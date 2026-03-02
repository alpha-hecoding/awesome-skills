import { autoInstall } from "./ensure-deps.js";
autoInstall();

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { cleanImage, hasProblematicMetadata, resizeForWeChat } from "./image-utils.js";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import css from "highlight.js/lib/languages/css";
import diff from "highlight.js/lib/languages/diff";
import go from "highlight.js/lib/languages/go";
import graphql from "highlight.js/lib/languages/graphql";
import ini from "highlight.js/lib/languages/ini";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import kotlin from "highlight.js/lib/languages/kotlin";
import less from "highlight.js/lib/languages/less";
import lua from "highlight.js/lib/languages/lua";
import makefile from "highlight.js/lib/languages/makefile";
import markdown from "highlight.js/lib/languages/markdown";
import objectivec from "highlight.js/lib/languages/objectivec";
import perl from "highlight.js/lib/languages/perl";
import php from "highlight.js/lib/languages/php";
import plaintext from "highlight.js/lib/languages/plaintext";
import python from "highlight.js/lib/languages/python";
import ruby from "highlight.js/lib/languages/ruby";
import rust from "highlight.js/lib/languages/rust";
import scss from "highlight.js/lib/languages/scss";
import shell from "highlight.js/lib/languages/shell";
import sql from "highlight.js/lib/languages/sql";
import swift from "highlight.js/lib/languages/swift";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

const HLJS_LANGUAGES: Record<string, hljs.LanguageFn> = {
  bash,
  c,
  cpp,
  csharp,
  css,
  diff,
  go,
  graphql,
  ini,
  java,
  javascript,
  json,
  kotlin,
  less,
  lua,
  makefile,
  markdown,
  objectivec,
  perl,
  php,
  plaintext,
  python,
  ruby,
  rust,
  scss,
  shell,
  sql,
  swift,
  typescript,
  xml,
  yaml,
};

Object.entries(HLJS_LANGUAGES).forEach(([name, lang]) => {
  hljs.registerLanguage(name, lang);
});

interface WechatConfig {
  appId: string;
  appSecret: string;
}

interface AccessTokenResponse {
  access_token?: string;
  errcode?: number;
  errmsg?: string;
}

interface UploadResponse {
  media_id: string;
  url: string;
  errcode?: number;
  errmsg?: string;
}

interface PublishResponse {
  media_id?: string;
  errcode?: number;
  errmsg?: string;
}

type ArticleType = "news" | "newspic";

interface ArticleOptions {
  title: string;
  author?: string;
  digest?: string;
  content: string;
  thumbMediaId: string;
  articleType: ArticleType;
  imageMediaIds?: string[];
}

const TOKEN_URL = "https://api.weixin.qq.com/cgi-bin/token";
const UPLOAD_URL = "https://api.weixin.qq.com/cgi-bin/material/add_material";
const DRAFT_URL = "https://api.weixin.qq.com/cgi-bin/draft/add";

function loadEnvFile(envPath: string): Record<string, string> {
  const env: Record<string, string> = {};
  if (!fs.existsSync(envPath)) return env;

  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      let value = trimmed.slice(eqIdx + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
  }
  return env;
}

function loadConfig(cliAppId?: string, cliAppSecret?: string): WechatConfig {
  const cwdEnvPath = path.join(process.cwd(), ".awesome-skills", ".env");
  const homeEnvPath = path.join(os.homedir(), ".awesome-skills", ".env");

  const cwdEnv = loadEnvFile(cwdEnvPath);
  const homeEnv = loadEnvFile(homeEnvPath);

  // Priority: CLI args > Environment variables > Project .env > User .env
  const appId = cliAppId || process.env.WECHAT_APP_ID || cwdEnv.WECHAT_APP_ID || homeEnv.WECHAT_APP_ID;
  const appSecret = cliAppSecret || process.env.WECHAT_APP_SECRET || cwdEnv.WECHAT_APP_SECRET || homeEnv.WECHAT_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error(
      "Missing WECHAT_APP_ID or WECHAT_APP_SECRET.\n" +
      "Provide via:\n" +
      "  1. Command line: --app-id <id> --app-secret <secret>\n" +
      "  2. Environment variables: WECHAT_APP_ID, WECHAT_APP_SECRET\n" +
      "  3. Config file: .awesome-skills/.env or ~/.awesome-skills/.env"
    );
  }

  return { appId, appSecret };
}

async function fetchAccessToken(appId: string, appSecret: string): Promise<string> {
  const url = `${TOKEN_URL}?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch access token: ${res.status}`);
  }
  const data = await res.json() as AccessTokenResponse;
  if (data.errcode) {
    throw new Error(`Access token error ${data.errcode}: ${data.errmsg}`);
  }
  if (!data.access_token) {
    throw new Error("No access_token in response");
  }
  return data.access_token;
}

async function cleanImageMetadata(buffer: Buffer, forceClean: boolean = false): Promise<Buffer> {
  const result = await cleanImage(buffer, forceClean);
  
  if (result.wasCleaned) {
    console.error(`[wechat-api] Cleaned image using ${result.method}: ${result.originalSize} -> ${result.cleanedSize} bytes`);
  }
  
  return result.buffer;
}

async function uploadImageWithRetry(
  imagePath: string,
  accessToken: string,
  baseDir?: string,
  retryCount: number = 0
): Promise<UploadResponse> {
  try {
    return await uploadImageInternal(imagePath, accessToken, baseDir, retryCount > 0);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    
    // If it's an unsupported file type error and we haven't retried yet
    if (errorMsg.includes("40113") && errorMsg.includes("unsupported file type") && retryCount === 0) {
      console.error(`[wechat-api] Upload failed with unsupported file type, retrying with forced metadata cleaning...`);
      return await uploadImageInternal(imagePath, accessToken, baseDir, true);
    }
    
    throw error;
  }
}

async function uploadImageInternal(
  imagePath: string,
  accessToken: string,
  baseDir?: string,
  forceClean: boolean = false
): Promise<UploadResponse> {
  let fileBuffer: Buffer;
  let filename: string;
  let contentType: string;

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    const response = await fetch(imagePath);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${imagePath}`);
    }
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength === 0) {
      throw new Error(`Remote image is empty: ${imagePath}`);
    }
    fileBuffer = Buffer.from(buffer);
    const urlPath = imagePath.split("?")[0];
    filename = path.basename(urlPath) || "image.jpg";
    contentType = response.headers.get("content-type") || "image/jpeg";

    if (!path.extname(filename)) {
      const extMap: Record<string, string> = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/gif": ".gif",
        "image/webp": ".webp"
      };
      const ext = extMap[contentType] || ".jpg";
      filename += ext;
    }
  } else {
    const resolvedPath = path.isAbsolute(imagePath)
      ? imagePath
      : path.resolve(baseDir || process.cwd(), imagePath);

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Image not found: ${resolvedPath}`);
    }
    const stats = fs.statSync(resolvedPath);
    if (stats.size === 0) {
      throw new Error(`Local image is empty: ${resolvedPath}`);
    }
    fileBuffer = fs.readFileSync(resolvedPath);
    filename = path.basename(resolvedPath);
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
    };
    contentType = mimeTypes[ext] || "image/jpeg";
  }

  if (forceClean || contentType === "image/jpeg" || filename.toLowerCase().match(/\.(jpg|jpeg)$/)) {
    fileBuffer = await cleanImageMetadata(fileBuffer, forceClean);
  }

  fileBuffer = await resizeForWeChat(fileBuffer);

  const boundary = `----WebKitFormBoundary${Date.now().toString(16)}`;
  const header = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="media"; filename="${filename}"`,
    `Content-Type: ${contentType}`,
    "",
    "",
  ].join("\r\n");
  const footer = `\r\n--${boundary}--\r\n`;

  const headerBuffer = Buffer.from(header, "utf-8");
  const footerBuffer = Buffer.from(footer, "utf-8");
  const body = Buffer.concat([headerBuffer, fileBuffer, footerBuffer]);

  const url = `${UPLOAD_URL}?access_token=${accessToken}&type=image`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
    },
    body,
  });

  const data = await res.json() as UploadResponse;
  if (data.errcode && data.errcode !== 0) {
    throw new Error(`Upload failed ${data.errcode}: ${data.errmsg}`);
  }

  if (data.url?.startsWith("http://")) {
    data.url = data.url.replace(/^http:\/\//i, "https://");
  }

  return data;
}

async function uploadImage(
  imagePath: string,
  accessToken: string,
  baseDir?: string
): Promise<UploadResponse> {
  return uploadImageWithRetry(imagePath, accessToken, baseDir, 0);
}

async function uploadImagesInHtml(
  html: string,
  accessToken: string,
  baseDir: string
): Promise<{ html: string; firstMediaId: string; allMediaIds: string[] }> {
  const imgRegex = /<img[^>]*\ssrc=["']([^"']+)["'][^>]*>/gi;
  const matches = [...html.matchAll(imgRegex)];

  if (matches.length === 0) {
    return { html, firstMediaId: "", allMediaIds: [] };
  }

  let firstMediaId = "";
  let updatedHtml = html;
  const allMediaIds: string[] = [];

  for (const match of matches) {
    const [fullTag, src] = match;
    if (!src) continue;

    if (src.startsWith("https://mmbiz.qpic.cn")) {
      if (!firstMediaId) {
        firstMediaId = src;
      }
      continue;
    }

    const localPathMatch = fullTag.match(/data-local-path=["']([^"']+)["']/);
    const imagePath = localPathMatch ? localPathMatch[1]! : src;

    console.error(`[wechat-api] Found image tag: ${fullTag.substring(0, 50)}... -> ${imagePath}`);
    try {
      const resp = await uploadImage(imagePath, accessToken, baseDir);
      console.error(`[wechat-api] Uploaded successfully: ${resp.url}`);
      const newTag = fullTag
        .replace(/\ssrc=["'][^"']+["']/, ` src="${resp.url}"`)
        .replace(/\sdata-local-path=["'][^"']+["']/, "");
      updatedHtml = updatedHtml.replace(fullTag, newTag);
      allMediaIds.push(resp.media_id);
      if (!firstMediaId) {
        firstMediaId = resp.media_id;
      }
    } catch (err) {
      console.error(`[wechat-api] Failed to upload ${imagePath}:`, err);
    }
  }

  return { html: updatedHtml, firstMediaId, allMediaIds };
}

async function publishToDraft(
  options: ArticleOptions,
  accessToken: string
): Promise<PublishResponse> {
  const url = `${DRAFT_URL}?access_token=${accessToken}`;

  let article: Record<string, unknown>;

  if (options.articleType === "newspic") {
    if (!options.imageMediaIds || options.imageMediaIds.length === 0) {
      throw new Error("newspic requires at least one image");
    }
    article = {
      article_type: "newspic",
      title: options.title,
      content: options.content,
      need_open_comment: 1,
      only_fans_can_comment: 0,
      image_info: {
        image_list: options.imageMediaIds.map(id => ({ image_media_id: id })),
      },
    };
    if (options.author) article.author = options.author;
  } else {
    article = {
      article_type: "news",
      title: options.title,
      content: options.content,
      thumb_media_id: options.thumbMediaId,
      need_open_comment: 1,
      only_fans_can_comment: 0,
    };
    if (options.author) article.author = options.author;
    if (options.digest) article.digest = options.digest;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ articles: [article] }),
  });

  const data = await res.json() as PublishResponse;
  if (data.errcode && data.errcode !== 0) {
    throw new Error(`Publish failed ${data.errcode}: ${data.errmsg}`);
  }

  return data;
}

function parseFrontmatter(content: string): { frontmatter: Record<string, string>; body: string } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const frontmatter: Record<string, string> = {};
  const lines = match[1]!.split("\n");
  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      frontmatter[key] = value;
    }
  }

  return { frontmatter, body: match[2]! };
}

function renderMarkdownToHtml(markdownPath: string, theme: string = "default"): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const renderScript = path.join(__dirname, "md", "render.ts");
  const baseDir = path.dirname(markdownPath);

  console.error(`[wechat-api] Rendering markdown with theme: ${theme}`);
  const result = spawnSync("npx", ["-y", "bun", renderScript, markdownPath, "--theme", theme], {
    stdio: ["inherit", "pipe", "pipe"],
    cwd: baseDir,
  });

  if (result.status !== 0) {
    const stderr = result.stderr?.toString() || "";
    throw new Error(`Render failed: ${stderr}`);
  }

  const htmlPath = markdownPath.replace(/\.md$/i, ".html");
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`HTML file not generated: ${htmlPath}`);
  }

  return htmlPath;
}

function inlineCss(html: string, css: string): string {
  const rules: Array<{ selector: string; declarations: Record<string, string> }> = [];
  const ruleRegex = /([^\{]+)\{([^\}]*)\}/g;
  let match;

  while ((match = ruleRegex.exec(css)) !== null) {
    const selectors = match[1]!.split(',').map(s => s.trim());
    const declarations: Record<string, string> = {};
    const declText = match[2]!;
    const declRegex = /([^:]+):\s*([^;]+);?/g;
    let declMatch;

    while ((declMatch = declRegex.exec(declText)) !== null) {
      const prop = declMatch[1]!.trim();
      const value = declMatch[2]!.trim();
      if (prop && value) {
        declarations[prop] = value;
      }
    }

    for (const selector of selectors) {
      rules.push({ selector, declarations });
    }
  }

  let result = html;

  result = result.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  result = result.replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, '');

  function mergeStylesIntoTag(tag: string, newStyles: Record<string, string>): string {
    const styleMatch = tag.match(/style=["']([^"]*)["']/);
    let existingStyles: Record<string, string> = {};

    if (styleMatch) {
      const styleText = styleMatch[1];
      const stylePairs = styleText.split(';').filter(s => s.trim());
      for (const pair of stylePairs) {
        const colonIdx = pair.indexOf(':');
        if (colonIdx > 0) {
          const prop = pair.slice(0, colonIdx).trim();
          const value = pair.slice(colonIdx + 1).trim();
          if (prop && value) {
            existingStyles[prop] = value;
          }
        }
      }
    }

    const mergedStyles = { ...existingStyles, ...newStyles };
    const styleString = Object.entries(mergedStyles)
      .map(([prop, value]) => `${prop}:${value}`)
      .join(';');

    if (styleMatch) {
      return tag.replace(/style=["'][^"]*["']/, `style="${styleString}"`);
    } else {
      return tag.replace(/>$/, ` style="${styleString}">`);
    }
  }

  function parseSelector(sel: string): { type: 'class' | 'tag' | 'compound'; classes: string[]; tag?: string } | null {
    sel = sel.trim();
    if (!sel || sel === '*') return null;

    if (sel.startsWith('.') && !sel.includes(' ') && !sel.includes(':') && !sel.includes('[')) {
      const classes = sel.slice(1).split('.').filter(c => c);
      return { type: 'class', classes };
    }

    if (!sel.includes('.') && !sel.includes(' ') && !sel.includes(':') && !sel.includes('[')) {
      return { type: 'tag', tag: sel.toLowerCase(), classes: [] };
    }

    const tagMatch = sel.match(/^([a-z][a-z0-9]*)/i);
    const tag = tagMatch ? tagMatch[1]!.toLowerCase() : undefined;
    const classMatches = sel.match(/\.([a-zA-Z0-9_-]+)/g);
    const classes = classMatches ? classMatches.map(c => c.slice(1)) : [];

    if (classes.length > 0 || tag) {
      return { type: 'compound', tag, classes };
    }

    return null;
  }

  for (const rule of rules) {
    const selector = rule.selector;
    const declarations = rule.declarations;

    const parsed = parseSelector(selector);
    if (!parsed) continue;

    if (parsed.type === 'class' && parsed.classes.length === 1) {
      const className = parsed.classes[0]!;
      const elementRegex = new RegExp(`<[^>]*\\bclass=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>`, 'gi');

      result = result.replace(elementRegex, (match) => {
        const classMatch = match.match(/class=["']([^"']*)["']/);
        if (classMatch && classMatch[1].split(/\s+/).includes(className)) {
          return mergeStylesIntoTag(match, declarations);
        }
        return match;
      });
    } else if (parsed.type === 'tag') {
      const skipTags = ['html', 'head', 'body', 'meta', 'link', 'script', 'style', 'title', 'doctype'];
      if (skipTags.includes(parsed.tag!)) continue;

      const tagRegex = new RegExp(`<${parsed.tag}([^>]*)>`, 'gi');
      result = result.replace(tagRegex, (match) => {
        return mergeStylesIntoTag(match, declarations);
      });
    } else if (parsed.type === 'compound') {
      const { tag, classes } = parsed;

      let elementRegex: RegExp;
      if (tag && classes.length > 0) {
        const classPattern = classes.map(c => `\\b${c}\\b`).join('[^"\']*');
        elementRegex = new RegExp(`<${tag}[^>]*\\bclass=["\'][^"\']*${classPattern}[^"\']*["\'][^>]*>`, 'gi');
      } else if (classes.length > 0) {
        const classPattern = classes.map(c => `\\b${c}\\b`).join('[^"\']*');
        elementRegex = new RegExp(`<[^>]*\\bclass=["\'][^"\']*${classPattern}[^"\']*["\'][^>]*>`, 'gi');
      } else if (tag) {
        elementRegex = new RegExp(`<${tag}([^>]*)>`, 'gi');
      } else {
        continue;
      }

      result = result.replace(elementRegex, (match) => {
        const classMatch = match.match(/class=["']([^"']*)["']/);
        if (classes.length > 0 && classMatch) {
          const elementClasses = classMatch[1].split(/\s+/);
          const hasAllClasses = classes.every(c => elementClasses.includes(c));
          if (!hasAllClasses) return match;
        }
        if (tag && !match.toLowerCase().startsWith(`<${tag}`)) return match;
        return mergeStylesIntoTag(match, declarations);
      });
    }
  }

  return result;
}

function detectLanguage(code: string): string {
  const trimmedCode = code.trim();
  
  if (trimmedCode.startsWith('{') && trimmedCode.endsWith('}')) {
    try {
      JSON.parse(trimmedCode);
      return 'json';
    } catch {}
  }
  
  if (/^(import|from|export|const|let|var|function|class|async|await)\s/m.test(trimmedCode)) {
    if (/\b(interface|type|namespace|declare|as\s+\w+)\b/.test(trimmedCode)) {
      return 'typescript';
    }
    return 'javascript';
  }
  
  if (/^(def |class |import |from |if __name__|print\(|@)/m.test(trimmedCode)) {
    return 'python';
  }
  
  if (/^(package |import |func |var |type |struct |interface {)/m.test(trimmedCode)) {
    return 'go';
  }
  
  if (/^(fn |let |mut |impl |pub |use |mod |trait )/m.test(trimmedCode)) {
    return 'rust';
  }
  
  if (/^(public |private |protected |class |interface |namespace |using )/m.test(trimmedCode)) {
    return trimmedCode.includes('System.') ? 'csharp' : 'java';
  }
  
  if (/^#!/m.test(trimmedCode) || /\b(if|then|fi|for|do|done|case|esac)\b/.test(trimmedCode)) {
    return 'bash';
  }
  
  if (/^(\s*)(mkdir|cd|ls|cp|mv|rm|cat|echo|export|source)\s/m.test(trimmedCode)) {
    return 'bash';
  }
  
  if (/^(\$|npm|yarn|pnpm|bun|npx)\s/m.test(trimmedCode)) {
    return 'bash';
  }
  
  if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|WITH)\s/mi.test(trimmedCode)) {
    return 'sql';
  }
  
  if (/^---\n[\s\S]*?\n---/.test(trimmedCode) || /^#{1,6}\s/m.test(trimmedCode)) {
    return 'markdown';
  }
  
  if (/<[a-z][\s\S]*>/i.test(trimmedCode) && /<\/[a-z]+>/i.test(trimmedCode)) {
    if (/\s(class|id|style|onclick)=/i.test(trimmedCode)) {
      return 'html';
    }
    return 'xml';
  }
  
  if (/^[\w\-]+:\s*[\w\d\-\s,]+;$/m.test(trimmedCode)) {
    return 'css';
  }
  
  return 'plaintext';
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatHighlightedCode(html: string): string {
  let formatted = html;
  formatted = formatted.replace(/\t/g, "    ");
  formatted = formatted.replace(/\r\n/g, "<br/>").replace(/\n/g, "<br/>");
  formatted = formatted.replace(/(>[^<]+)|(^[^<]+)/g, (str: string) => str.replace(/\s/g, "&nbsp;"));
  return formatted;
}

function highlightCodeBlocks(html: string): string {
  const codeBlockRegex = /<pre[^>]*><code(?:\s+class="language-(\w+)")?>([\s\S]*?)<\/code><\/pre>/gi;
  
  let result = html;
  let highlightedCount = 0;
  
  result = result.replace(codeBlockRegex, (match, langClass: string | undefined, codeContent: string) => {
    const decodedCode = codeContent
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
    
    const language = langClass || detectLanguage(decodedCode);
    
    let highlighted: string;
    try {
      if (hljs.getLanguage(language)) {
        highlighted = hljs.highlight(decodedCode, { language }).value;
      } else {
        highlighted = hljs.highlightAuto(decodedCode).value;
      }
    } catch {
      highlighted = escapeHtml(decodedCode);
    }
    
    const formatted = formatHighlightedCode(highlighted);
    highlightedCount++;
    
    return `<pre class="hljs code__pre" style="font-size:90%;overflow-x:auto;border-radius:8px;line-height:1.5;margin:10px 8px;padding:0"><code class="language-${language}" style="display:-webkit-box;padding:0.5em 1em 1em;overflow-x:auto;text-indent:0;background:#f6f8fa;color:#24292f;white-space:nowrap;margin:0;border-radius:4px">${formatted}</code></pre>`;
  });
  
  if (highlightedCount > 0) {
    console.error(`[wechat-api] Highlighted ${highlightedCount} code blocks`);
  }
  
  return result;
}

function loadHljsTheme(): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const hljsThemePath = path.join(__dirname, "md", "themes", "hljs-github.css");

  if (fs.existsSync(hljsThemePath)) {
    return fs.readFileSync(hljsThemePath, "utf-8");
  }
  return '';
}

function inlineCodeBlockStyles(html: string): string {
  const hljsCss = loadHljsTheme();
  if (!hljsCss) {
    console.error("[wechat-api] Warning: hljs-github.css not found");
    return html;
  }

  console.error("[wechat-api] Applying highlight.js styles...");
  return inlineCss(html, hljsCss);
}

function cleanHtmlWhitespace(html: string): string {
  // Remove empty class attributes
  html = html.replace(/\sclass=""/g, '');
  
  // Minimize whitespace between tags while preserving content
  // This removes indentation spaces that would become &nbsp; in WeChat
  html = html.replace(/>\s+</g, '><');
  
  // Clean up multiple consecutive spaces in text content
  // but preserve single spaces between words
  html = html.replace(/(\S)\s{2,}(\S)/g, '$1 $2');
  
  // Remove leading/trailing whitespace from the entire content
  html = html.trim();
  
  return html;
}

function extractHtmlContent(htmlPath: string, shouldInlineCss: boolean = false): string {
  const html = fs.readFileSync(htmlPath, "utf-8");

  let processedHtml = html;
  if (shouldInlineCss) {
    let css = '';
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let styleMatch;
    while ((styleMatch = styleRegex.exec(html)) !== null) {
      css += styleMatch[1] + '\n';
    }

    if (css.trim()) {
      console.error("[wechat-api] Inlining CSS styles...");
      processedHtml = inlineCss(html, css);
    }
  }

  let content: string;
  const outputMatch = processedHtml.match(/<div id="output">([\s\S]*?)<\/div>\s*<\/body>/);
  if (outputMatch) {
    content = outputMatch[1]!.trim();
  } else {
    const bodyMatch = processedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    content = bodyMatch ? bodyMatch[1]!.trim() : processedHtml;
  }

  console.error("[wechat-api] Highlighting code blocks in HTML...");
  content = highlightCodeBlocks(content);

  console.error("[wechat-api] Inlining code block styles for WeChat compatibility...");
  content = inlineCodeBlockStyles(content);

  content = cleanHtmlWhitespace(content);

  return content;
}

function printUsage(): never {
  console.log(`Publish article to WeChat Official Account draft using API

Usage:
  npx -y bun wechat-api.ts <file> [options]

Arguments:
  file                Markdown (.md) or HTML (.html) file

Options:
  --type <type>       Article type: news (文章, default) or newspic (图文)
  --title <title>     Override title
  --author <name>     Author name (max 16 chars)
  --summary <text>    Article summary/digest (max 128 chars)
  --theme <name>      Theme name for markdown (default, grace, simple). Default: default
  --cover <path>      Cover image path (local or URL)
  --inline-css        Inline CSS styles for HTML input (preserves original styling)
  --dry-run           Parse and render only, don't publish
  --app-id <id>       WeChat App ID (overrides env/config)
  --app-secret <key>  WeChat App Secret (overrides env/config)
  --help              Show this help

Frontmatter Fields (markdown):
  title               Article title
  author              Author name
  digest/summary      Article summary
  featureImage/coverImage/cover/image   Cover image path

Comments:
  Comments are enabled by default, open to all users.

Authentication (in priority order):
  1. Command line arguments: --app-id and --app-secret
  2. Environment variables: WECHAT_APP_ID, WECHAT_APP_SECRET
  3. Project config: <cwd>/.awesome-skills/.env
  4. User config: ~/.awesome-skills/.env

Example:
  # Using config file or environment variables
  npx -y bun wechat-api.ts article.md
  npx -y bun wechat-api.ts article.md --theme grace --cover cover.png

  # Using command line credentials (most flexible)
  npx -y bun wechat-api.ts article.md --app-id wx123456 --app-secret abc123xyz

  # Other examples
  npx -y bun wechat-api.ts article.md --author "Author Name" --summary "Brief intro"
  npx -y bun wechat-api.ts article.html --title "My Article" --inline-css
  npx -y bun wechat-api.ts images/ --type newspic --title "Photo Album"
  npx -y bun wechat-api.ts article.md --dry-run
`);
  process.exit(0);
}

interface CliArgs {
  filePath: string;
  isHtml: boolean;
  articleType: ArticleType;
  title?: string;
  author?: string;
  summary?: string;
  theme: string;
  cover?: string;
  inlineCss: boolean;
  dryRun: boolean;
  appId?: string;
  appSecret?: string;
}

function parseArgs(argv: string[]): CliArgs {
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    printUsage();
  }

  const args: CliArgs = {
    filePath: "",
    isHtml: false,
    articleType: "news",
    theme: "default",
    inlineCss: false,
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg === "--type" && argv[i + 1]) {
      const t = argv[++i]!.toLowerCase();
      if (t === "news" || t === "newspic") {
        args.articleType = t;
      }
    } else if (arg === "--title" && argv[i + 1]) {
      args.title = argv[++i];
    } else if (arg === "--author" && argv[i + 1]) {
      args.author = argv[++i];
    } else if (arg === "--summary" && argv[i + 1]) {
      args.summary = argv[++i];
    } else if (arg === "--theme" && argv[i + 1]) {
      args.theme = argv[++i]!;
    } else if (arg === "--cover" && argv[i + 1]) {
      args.cover = argv[++i];
    } else if (arg === "--inline-css") {
      args.inlineCss = true;
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--app-id" && argv[i + 1]) {
      args.appId = argv[++i];
    } else if (arg === "--app-secret" && argv[i + 1]) {
      args.appSecret = argv[++i];
    } else if (arg.startsWith("--") && argv[i + 1] && !argv[i + 1]!.startsWith("-")) {
      i++;
    } else if (!arg.startsWith("-")) {
      args.filePath = arg;
    }
  }

  if (!args.filePath) {
    console.error("Error: File path required");
    process.exit(1);
  }

  args.isHtml = args.filePath.toLowerCase().endsWith(".html");

  return args;
}

function extractHtmlTitle(html: string): string {
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch) return titleMatch[1]!;
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) return h1Match[1]!.replace(/<[^>]+>/g, "").trim();
  return "";
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  const filePath = path.resolve(args.filePath);
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  const baseDir = path.dirname(filePath);
  let title = args.title || "";
  let author = args.author || "";
  let digest = args.summary || "";
  let htmlPath: string;
  let htmlContent: string;
  let frontmatter: Record<string, string> = {};

  if (args.isHtml) {
    htmlPath = filePath;
    htmlContent = extractHtmlContent(htmlPath, args.inlineCss);
    const mdPath = filePath.replace(/\.html$/i, ".md");
    if (fs.existsSync(mdPath)) {
      const mdContent = fs.readFileSync(mdPath, "utf-8");
      const parsed = parseFrontmatter(mdContent);
      frontmatter = parsed.frontmatter;
      if (!title && frontmatter.title) title = frontmatter.title;
      if (!author) author = frontmatter.author || "";
      if (!digest) digest = frontmatter.digest || frontmatter.summary || frontmatter.description || "";
    }
    if (!title) {
      title = extractHtmlTitle(fs.readFileSync(htmlPath, "utf-8"));
    }
    console.error(`[wechat-api] Using HTML file: ${htmlPath}`);
  } else {
    const content = fs.readFileSync(filePath, "utf-8");
    const parsed = parseFrontmatter(content);
    frontmatter = parsed.frontmatter;
    const body = parsed.body;

    title = title || frontmatter.title || "";
    if (!title) {
      const h1Match = body.match(/^#\s+(.+)$/m);
      if (h1Match) title = h1Match[1]!;
    }
    if (!author) author = frontmatter.author || "";
    if (!digest) digest = frontmatter.digest || frontmatter.summary || frontmatter.description || "";

    console.error(`[wechat-api] Theme: ${args.theme}`);
    htmlPath = renderMarkdownToHtml(filePath, args.theme);
    console.error(`[wechat-api] HTML generated: ${htmlPath}`);
    htmlContent = extractHtmlContent(htmlPath);
  }

  if (!title) {
    console.error("Error: No title found. Provide via --title, frontmatter, or <title> tag.");
    process.exit(1);
  }

  console.error(`[wechat-api] Title: ${title}`);
  if (author) console.error(`[wechat-api] Author: ${author}`);
  if (digest) console.error(`[wechat-api] Digest: ${digest.slice(0, 50)}...`);
  console.error(`[wechat-api] Type: ${args.articleType}`);

  if (args.dryRun) {
    const outputHtmlPath = htmlPath.replace('.html', '-processed.html');
    fs.writeFileSync(outputHtmlPath, htmlContent, 'utf-8');
    console.error(`[wechat-api] Processed HTML saved to: ${outputHtmlPath}`);
    console.log(JSON.stringify({
      articleType: args.articleType,
      title,
      author: author || undefined,
      digest: digest || undefined,
      htmlPath,
      processedHtmlPath: outputHtmlPath,
      contentLength: htmlContent.length,
    }, null, 2));
    return;
  }

  const config = loadConfig(args.appId, args.appSecret);
  console.error("[wechat-api] Fetching access token...");
  const accessToken = await fetchAccessToken(config.appId, config.appSecret);

  console.error("[wechat-api] Uploading images...");
  const { html: processedHtml, firstMediaId, allMediaIds } = await uploadImagesInHtml(
    htmlContent,
    accessToken,
    baseDir
  );
  htmlContent = processedHtml;

  let thumbMediaId = "";
  const coverPath = args.cover ||
    frontmatter.featureImage ||
    frontmatter.coverImage ||
    frontmatter.cover ||
    frontmatter.image;

  if (coverPath) {
    console.error(`[wechat-api] Uploading cover: ${coverPath}`);
    const coverResp = await uploadImage(coverPath, accessToken, baseDir);
    thumbMediaId = coverResp.media_id;
  } else if (firstMediaId) {
    if (firstMediaId.startsWith("https://")) {
      console.error(`[wechat-api] Uploading first image as cover: ${firstMediaId}`);
      const coverResp = await uploadImage(firstMediaId, accessToken, baseDir);
      thumbMediaId = coverResp.media_id;
    } else {
      thumbMediaId = firstMediaId;
    }
  }

  if (args.articleType === "news" && !thumbMediaId) {
    console.error("Error: No cover image. Provide via --cover, frontmatter.featureImage, or include an image in content.");
    process.exit(1);
  }

  if (args.articleType === "newspic" && allMediaIds.length === 0) {
    console.error("Error: newspic requires at least one image in content.");
    process.exit(1);
  }

  console.error("[wechat-api] Publishing to draft...");
  const result = await publishToDraft({
    title,
    author: author || undefined,
    digest: digest || undefined,
    content: htmlContent,
    thumbMediaId,
    articleType: args.articleType,
    imageMediaIds: args.articleType === "newspic" ? allMediaIds : undefined,
  }, accessToken);

  console.log(JSON.stringify({
    success: true,
    media_id: result.media_id,
    title,
    articleType: args.articleType,
  }, null, 2));

  console.error(`[wechat-api] Published successfully! media_id: ${result.media_id}`);
}

await main().catch((err) => {
  console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
