import fs from "node:fs";
import type { Sharp } from "sharp";

let sharpModule: Sharp | undefined;
let sharpFactory: ((input?: string | Buffer) => Sharp) | undefined;

async function loadSharp(): Promise<{ factory: (input?: string | Buffer) => Sharp; module: typeof import("sharp") }> {
  if (!sharpFactory) {
    const sharp = await import("sharp");
    sharpFactory = sharp.default;
  }
  return { factory: sharpFactory, module: await import("sharp") };
}

export function hasProblematicMetadata(buffer: Buffer): boolean {
  if (buffer.length < 2 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return false;
  }

  const headerStr = buffer.slice(0, Math.min(2048, buffer.length)).toString("binary");
  return headerStr.includes("AIGC{") || 
         headerStr.includes("Coze") ||
         headerStr.includes("AI_GENERATED") ||
         headerStr.includes("Adobe") ||
         headerStr.includes("Photoshop");
}

export async function reencodeWithSharp(buffer: Buffer): Promise<Buffer> {
  const { factory } = await loadSharp();
  
  return factory(buffer)
    .jpeg({
      quality: 90,
      progressive: false,
      force: true,
    })
    .withMetadata({})
    .toBuffer();
}

export function stripMetadataManual(buffer: Buffer): Buffer {
  if (buffer.length < 2 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return buffer;
  }

  const headerStr = buffer.slice(0, Math.min(2048, buffer.length)).toString("binary");
  if (!headerStr.includes("AIGC{") && !headerStr.includes("Coze")) {
    return buffer;
  }

  let pos = 2;
  while (pos < buffer.length - 1) {
    if (buffer[pos] === 0xff) {
      const marker = buffer[pos + 1];

      if (marker === 0x00) {
        pos += 2;
        continue;
      }

      if (marker === 0xeb || marker === 0xec || marker === 0xed || marker === 0xee || marker === 0xef) {
        if (pos + 3 < buffer.length) {
          const length = (buffer[pos + 2] << 8) | buffer[pos + 3];
          pos += 2 + length;
          continue;
        }
      }

      if (marker >= 0xe0 && marker <= 0xe9) break;
      if (marker === 0xdb || marker === 0xc0 || marker === 0xc2 || marker === 0xc4) break;
    }
    pos++;
  }

  return Buffer.concat([buffer.slice(0, 2), buffer.slice(pos)]);
}

export async function cleanImage(buffer: Buffer, forceClean: boolean = false): Promise<{
  buffer: Buffer;
  wasCleaned: boolean;
  method: "sharp" | "manual" | "none";
  originalSize: number;
  cleanedSize: number;
}> {
  const originalSize = buffer.length;
  
  if (!forceClean && !hasProblematicMetadata(buffer)) {
    return {
      buffer,
      wasCleaned: false,
      method: "none",
      originalSize,
      cleanedSize: originalSize,
    };
  }

  try {
    const cleanedBuffer = await reencodeWithSharp(buffer);
    return {
      buffer: cleanedBuffer,
      wasCleaned: true,
      method: "sharp",
      originalSize,
      cleanedSize: cleanedBuffer.length,
    };
  } catch (error) {
    console.error(`[image-utils] Sharp processing failed, using fallback:`, 
      error instanceof Error ? error.message : String(error));
    
    const cleanedBuffer = stripMetadataManual(buffer);
    return {
      buffer: cleanedBuffer,
      wasCleaned: cleanedBuffer.length !== originalSize,
      method: "manual",
      originalSize,
      cleanedSize: cleanedBuffer.length,
    };
  }
}

export async function processImageFile(
  filePath: string,
  forceClean: boolean = false
): Promise<{
  buffer: Buffer;
  wasCleaned: boolean;
  method: "sharp" | "manual" | "none";
}> {
  const buffer = fs.readFileSync(filePath);
  const result = await cleanImage(buffer, forceClean);
  
  return {
    buffer: result.buffer,
    wasCleaned: result.wasCleaned,
    method: result.method,
  };
}

export async function getImageMetadata(buffer: Buffer): Promise<{
  format?: string;
  width?: number;
  height?: number;
} | null> {
  try {
    const { factory } = await loadSharp();
    const metadata = await factory(buffer).metadata();
    return {
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
    };
  } catch {
    return null;
  }
}

export async function resizeForWeChat(buffer: Buffer): Promise<Buffer> {
  try {
    const { factory } = await loadSharp();
    const metadata = await factory(buffer).metadata();
    
    if (!metadata.width || !metadata.height) {
      return buffer;
    }
    
    const MAX_WIDTH = 1920;
    const MAX_HEIGHT = 1080;
    
    if (metadata.width <= MAX_WIDTH && metadata.height <= MAX_HEIGHT) {
      return buffer;
    }
    
    return factory(buffer)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 90 })
      .toBuffer();
  } catch {
    return buffer;
  }
}
