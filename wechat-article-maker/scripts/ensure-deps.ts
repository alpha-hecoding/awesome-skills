#!/usr/bin/env bun
/**
 * Dependency manager for wechat-article-maker
 * Auto-installs required npm packages when needed
 */

import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

// Map of script names to their required dependencies
const DEPENDENCY_MAP: Record<string, string[]> = {
  "md/render.ts": [
    "front-matter",
    "highlight.js",
    "marked",
    "reading-time",
    "juice",
  ],
  "generate-cover.ts": ["@napi-rs/canvas", "sharp"],
  "wechat-api.ts": ["sharp"],
  "wechat-article.ts": [], // Uses only Node.js built-in APIs
  "wechat-browser.ts": [], // Uses only Node.js built-in APIs
  "wechat-agent-browser.ts": [], // Uses only Node.js built-in APIs
  "cdp.ts": [], // Uses only Node.js built-in APIs
  "md-to-wechat.ts": [], // Uses only Node.js built-in APIs
  "copy-to-clipboard.ts": [], // Uses only Node.js built-in APIs
  "paste-from-clipboard.ts": [], // Uses only Node.js built-in APIs
};

/**
 * Check if a package is installed
 */
function isPackageInstalled(packageName: string): boolean {
  try {
    // Try to resolve the package
    const require = createRequire(import.meta.url);
    require.resolve(packageName);
    return true;
  } catch {
    return false;
  }
}

/**
 * Install packages using npm
 */
function installPackages(packages: string[]): boolean {
  if (packages.length === 0) return true;

  console.error(`[deps] Installing dependencies: ${packages.join(", ")}...`);

  const result = spawnSync("npm", ["install", "--no-save", ...packages], {
    stdio: "pipe",
    encoding: "utf-8",
    timeout: 120000, // 2 minutes timeout
  });

  if (result.status !== 0) {
    console.error(`[deps] Failed to install dependencies:`, result.stderr);
    return false;
  }

  console.error(`[deps] Dependencies installed successfully.`);
  return true;
}

/**
 * Ensure all dependencies for a script are installed
 */
export function ensureDependencies(scriptPath: string): boolean {
  // Normalize script path to match keys in DEPENDENCY_MAP
  const normalizedPath = scriptPath.replace(/^.*scripts\//, "");

  const deps = DEPENDENCY_MAP[normalizedPath];
  if (!deps || deps.length === 0) {
    return true; // No dependencies needed
  }

  // Check which packages need to be installed
  const missingPackages = deps.filter((pkg) => !isPackageInstalled(pkg));

  if (missingPackages.length === 0) {
    return true; // All dependencies already installed
  }

  // Install missing packages
  return installPackages(missingPackages);
}

/**
 * Auto-install dependencies for the current script
 * Call this at the beginning of each TypeScript file that needs dependencies
 */
export function autoInstall(): boolean {
  // Get the calling script path from the call stack
  const stack = new Error().stack;
  if (!stack) return true;

  // Extract the script name from the stack trace
  const lines = stack.split("\n");
  for (const line of lines) {
    const match = line.match(/at .* \((.+\.ts):\d+:\d+\)/);
    if (match) {
      const scriptPath = match[1]!;
      if (scriptPath.includes("ensure-deps.ts")) continue;
      return ensureDependencies(scriptPath);
    }
  }

  return true;
}

// If called directly, show usage
if (import.meta.main) {
  console.log(`Dependency Manager for wechat-article-maker

Usage:
  Import and call autoInstall() at the start of your script:

  import { autoInstall } from "./ensure-deps.ts";
  autoInstall();

Or specify dependencies manually:

  import { ensureDependencies } from "./ensure-deps.ts";
  ensureDependencies("md/render.ts");
`);
}
