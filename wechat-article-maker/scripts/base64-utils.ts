import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { createHash } from "crypto";

/**
 * Extract base64 images from HTML and convert to local files
 * Returns modified HTML with local file paths and array of extracted image paths
 */
export function extractBase64Images(
  html: string,
  baseDir: string
): { html: string; extractedImages: string[] } {
  const BASE64_PATTERN = /<img[^>]+src="(data:image\/([^;]+);base64,([^"]+))"[^>]*>/gi;

  const outputDir = path.join(baseDir, "extracted-images");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let modifiedHtml = html;
  const extractedImages: string[] = [];
  let imageIndex = 0;

  let match;
  while ((match = BASE64_PATTERN.exec(html)) !== null) {
    const fullMatch = match[0];
    const dataUri = match[1];
    const imageType = match[2]; // e.g., 'png', 'jpeg', 'webp'
    const base64Data = match[3];

    // Create hash for unique filename
    const hash = createHash('md5').update(base64Data).digest('hex').substring(0, 8);
    const ext = imageType === 'jpeg' ? 'jpg' : imageType;
    const filename = `base64-${imageIndex}-${hash}.${ext}`;
    const filepath = path.join(outputDir, filename);

    // Decode and save image
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filepath, buffer);

    // Create relative path for HTML
    const relativePath = `extracted-images/${filename}`;

    extractedImages.push(filepath);

    // Replace base64 data URI with local file path
    modifiedHtml = modifiedHtml.replace(fullMatch, fullMatch.replace(dataUri, relativePath));

    imageIndex++;
    console.error(`[base64-utils] Extracted base64 image: ${filename} (${buffer.length} bytes)`);
  }

  return { html: modifiedHtml, extractedImages };
}

/**
 * Check if HTML contains base64 images
 */
export function hasBase64Images(html: string): boolean {
  const BASE64_PATTERN = /<img[^>]+src="data:image\/[^;]+;base64,/i;
  return BASE64_PATTERN.test(html);
}
