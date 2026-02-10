#!/usr/bin/env bun

import { autoInstall } from "./ensure-deps.js";
autoInstall();

import fs from "node:fs";
import path from "node:path";

interface CoverOptions {
  title: string;
  width?: number;
  height?: number;
  output: string;
  gradientStart?: string;
  gradientEnd?: string;
  textColor?: string;
  style?: string;
}

function printUsage(): void {
  console.log(`Generate cover image for WeChat articles

Usage:
  npx -y bun generate-cover.ts --title <title> --output <path> [options]

Required:
  --title <text>      Article title (will be auto-wrapped)
  --output <path>     Output image path (e.g., cover.jpg)

Optional:
  --width <number>    Image width (default: 900)
  --height <number>   Image height (default: 500)
  --gradient-start    Gradient start color (default: #667eea)
  --gradient-end      Gradient end color (default: #764ba2)
  --text-color        Text color (default: white)
  --style             Style preset: "simple" (default) or "tech"

Examples:
  npx -y bun generate-cover.ts --title "My Article" --output cover.jpg
  npx -y bun generate-cover.ts --title "Claude Code 最佳实践" --style tech --output cover.png --gradient-start "#ff6b6b" --gradient-end "#4ecdc4"
`);
  process.exit(0);
}

function parseArgs(argv: string[]): CoverOptions {
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    printUsage();
  }

  const options: CoverOptions = {
    title: "",
    width: 900,
    height: 500,
    output: "",
    gradientStart: "#667eea",
    gradientEnd: "#764ba2",
    textColor: "white",
    style: "simple",
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg === "--title" && argv[i + 1]) {
      options.title = argv[++i]!;
    } else if (arg === "--output" && argv[i + 1]) {
      options.output = argv[++i]!;
    } else if (arg === "--width" && argv[i + 1]) {
      options.width = parseInt(argv[++i]!, 10);
    } else if (arg === "--height" && argv[i + 1]) {
      options.height = parseInt(argv[++i]!, 10);
    } else if (arg === "--gradient-start" && argv[i + 1]) {
      options.gradientStart = argv[++i]!;
    } else if (arg === "--gradient-end" && argv[i + 1]) {
      options.gradientEnd = argv[++i]!;
    } else if (arg === "--text-color" && argv[i + 1]) {
      options.textColor = argv[++i]!;
    } else if (arg === "--style" && argv[i + 1]) {
      options.style = argv[++i]!;
    }
  }

  if (!options.title) {
    console.error("Error: --title is required");
    process.exit(1);
  }

  if (!options.output) {
    console.error("Error: --output is required");
    process.exit(1);
  }

  return options;
}

function wrapText(ctx: any, text: string, maxWidth: number, fontSize: number): string[] {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

async function generateCoverWithCanvas(options: CoverOptions): Promise<void> {
  try {
    // Try to import @napi-rs/canvas
    const { createCanvas } = await import("@napi-rs/canvas");

    // Super-sampling for tech style to ensure crisp text
    const scale = options.style === "tech" ? 2 : 1;
    const width = options.width! * scale;
    const height = options.height! * scale;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background
    if (options.style === "tech") {
       // Deep Tech Background (Darker, more premium)
       const gradient = ctx.createLinearGradient(0, 0, width, height);
       gradient.addColorStop(0, "#0B0E14"); // Almost black/dark blue
       gradient.addColorStop(1, "#1B2735"); // Deep metallic blue
       ctx.fillStyle = gradient;
       ctx.fillRect(0, 0, width, height);

       // Hex Grid or Square Grid (Subtle)
       ctx.strokeStyle = "rgba(0, 240, 255, 0.03)"; // Cyan, very faint
       ctx.lineWidth = 1 * scale;
       const step = 40 * scale;
       
       // Vertical lines
       for (let x = 0; x < width; x += step) {
           ctx.beginPath();
           ctx.moveTo(x, 0);
           ctx.lineTo(x, height);
           ctx.stroke();
       }
       // Horizontal lines
       for (let y = 0; y < height; y += step) {
           ctx.beginPath();
           ctx.moveTo(0, y);
           ctx.lineTo(width, y);
           ctx.stroke();
       }

       // Tech Accents: Random glowing data lines
       const lineCount = 5;
       ctx.strokeStyle = "rgba(0, 240, 255, 0.1)";
       ctx.lineWidth = 2 * scale;
       for(let i=0; i<lineCount; i++) {
           const y = Math.random() * height;
           ctx.beginPath();
           ctx.moveTo(0, y);
           ctx.lineTo(width, y);
           ctx.stroke();
           
           // Add a "node" on the line
           ctx.fillStyle = "rgba(0, 240, 255, 0.4)";
           ctx.beginPath();
           ctx.arc(Math.random() * width, y, 3 * scale, 0, Math.PI * 2);
           ctx.fill();
       }

       // Particles/Network
       const particles = [];
       const particleCount = 40;
       for(let i=0; i<particleCount; i++) {
           particles.push({
               x: Math.random() * width,
               y: Math.random() * height,
               r: (Math.random() * 2 + 1) * scale
           });
       }

       ctx.fillStyle = "rgba(0, 240, 255, 0.4)"; // Cyan particles
       ctx.strokeStyle = "rgba(0, 240, 255, 0.15)"; // Cyan connections
       
       particles.forEach((p, i) => {
           ctx.beginPath();
           ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
           ctx.fill();

           // Connect to nearby
           particles.forEach((p2, j) => {
               if (i !== j) {
                   const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                   if (dist < 150 * scale) {
                       ctx.lineWidth = (1 - dist / (150 * scale)) * scale; // Fade out by distance
                       ctx.beginPath();
                       ctx.moveTo(p.x, p.y);
                       ctx.lineTo(p2.x, p2.y);
                       ctx.stroke();
                   }
               }
           });
       });

       // Vignette (Dark corners)
        const radial = ctx.createRadialGradient(width/2, height/2, width/3, width/2, height/2, width);
        radial.addColorStop(0, "rgba(0,0,0,0)");
        radial.addColorStop(1, "rgba(0,0,0,0.7)");
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);

    } else {
        // Simple Gradient (Legacy)
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, options.gradientStart!);
        gradient.addColorStop(1, options.gradientEnd!);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }

    // Add text
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Text Config
    const baseFontSize = options.style === "tech" ? 64 : 48;
    const fontSize = baseFontSize * scale;
    
    // Use system fonts that are likely to support English well
    const fontFamily = options.style === "tech" 
        ? `"Segoe UI", Roboto, Helvetica, Arial, sans-serif`
        : `"PingFang SC", "Microsoft YaHei", sans-serif`;
    
    // Wrap title text
    const lines = wrapText(ctx, options.title, width * 0.8, fontSize);
    const lineHeight = fontSize * 1.3;
    const totalHeight = lines.length * lineHeight;
    const centerY = height / 2;
    const startY = centerY - totalHeight / 2;

    if (options.style === "tech") {
        // Tech Text Rendering: 2 Passes for Glow + Sharpness

        ctx.font = `900 ${fontSize}px ${fontFamily}`; // Extra Bold for tech

        // Pass 1: Glow (Shadow only)
        ctx.fillStyle = "rgba(255, 255, 255, 0)"; // Transparent text
        ctx.shadowColor = "#00F0FF"; // Cyan Neon Glow
        ctx.shadowBlur = 20 * scale;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        lines.forEach((line, index) => {
            ctx.fillText(line, width / 2, startY + index * lineHeight + lineHeight / 2);
        });

        // Pass 2: Crisp Text (No Shadow)
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#FFFFFF"; // Pure White
        
        lines.forEach((line, index) => {
            ctx.fillText(line, width / 2, startY + index * lineHeight + lineHeight / 2);
        });

    } else {
        // Simple Style Rendering
        ctx.font = `bold ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = options.textColor!;
        lines.forEach((line, index) => {
            ctx.fillText(line, width / 2, startY + index * lineHeight + lineHeight / 2);
        });
    }

    // Save image
    const outputPath = path.resolve(options.output);
    const ext = path.extname(outputPath).toLowerCase();

    let buffer: Buffer;
    if (ext === ".png") {
      buffer = canvas.toBuffer("image/png");
    } else {
      // High quality JPEG
      buffer = canvas.toBuffer("image/jpeg", 95);
    }

    fs.writeFileSync(outputPath, buffer);
    console.log(JSON.stringify({
      success: true,
      output: outputPath,
      size: `${width}x${height}`,
      scale: scale
    }));

  } catch (error) {
    throw new Error(`Canvas generation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function generateCoverWithSVG(options: CoverOptions): Promise<void> {
  // Fallback: Generate SVG and convert to PNG using sharp
  const svg = `
<svg width="${options.width}" height="${options.height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${options.gradientStart};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${options.gradientEnd};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif"
        font-size="48" font-weight="bold" fill="${options.textColor}"
        text-anchor="middle" dominant-baseline="middle">
    ${options.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
  </text>
</svg>
`.trim();

  try {
    // Try to use sharp for SVG to PNG conversion
    const sharp = await import("sharp");

    const outputPath = path.resolve(options.output);
    await sharp.default(Buffer.from(svg))
      .resize(options.width, options.height)
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    console.log(JSON.stringify({
      success: true,
      output: outputPath,
      size: `${options.width}x${options.height}`,
      method: "sharp+svg"
    }));

  } catch (error) {
    throw new Error(`Sharp generation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function generateCoverFallback(options: CoverOptions): Promise<void> {
  // Simple SVG-only fallback (no conversion to raster)
  // Note: wrapText needs ctx, so we simulate simple wrapping here
  const charsPerLine = Math.floor(options.width! * 0.8 / 30); // rough est
  const words = options.title.split(' ');
  const lines = [];
  let currentLine = words[0];
  for(let i=1; i<words.length; i++) {
      if ((currentLine + " " + words[i]).length < charsPerLine) {
          currentLine += " " + words[i];
      } else {
          lines.push(currentLine);
          currentLine = words[i];
      }
  }
  lines.push(currentLine);

  const lineHeight = 60;
  const totalHeight = lines.length * lineHeight;
  const startY = (options.height! - totalHeight) / 2;

  const textElements = lines.map((line, index) => {
    const y = startY + index * lineHeight + lineHeight / 2;
    return `<text x="50%" y="${y}" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif"
              font-size="48" font-weight="bold" fill="${options.textColor}"
              text-anchor="middle" dominant-baseline="middle">${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>`;
  }).join('\n  ');

  const svg = `
<svg width="${options.width}" height="${options.height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${options.gradientStart};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${options.gradientEnd};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)"/>
  ${textElements}
</svg>
`.trim();

  const outputPath = path.resolve(options.output);
  fs.writeFileSync(outputPath, svg);

  console.error(`Warning: Installed packages not found. Generated SVG file instead.`);
  console.error(`To generate PNG/JPEG, install one of:`);
  console.error(`  - npm install @napi-rs/canvas`);
  console.error(`  - npm install sharp`);

  console.log(JSON.stringify({
    success: true,
    output: outputPath,
    size: `${options.width}x${options.height}`,
    method: "svg-only",
    warning: "SVG file created. Install @napi-rs/canvas or sharp for raster image output."
  }));
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  console.error(`[generate-cover] Generating cover image...`);
  console.error(`[generate-cover] Title: ${options.title}`);
  console.error(`[generate-cover] Size: ${options.width}x${options.height}`);
  console.error(`[generate-cover] Output: ${options.output}`);

  // Try methods in order: canvas > sharp > svg-only
  try {
    await generateCoverWithCanvas(options);
  } catch (canvasError) {
    console.error(`[generate-cover] Canvas method failed, trying sharp...`);
    try {
      await generateCoverWithSVG(options);
    } catch (sharpError) {
      console.error(`[generate-cover] Sharp method failed, using SVG fallback...`);
      await generateCoverFallback(options);
    }
  }
}

await main().catch((err) => {
  console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
