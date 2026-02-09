#!/usr/bin/env node
/**
 * Cross-platform TypeScript runner with automatic runtime detection
 * Works on Windows, macOS, and Linux
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the directory where this script is located (bin/)
const binDir = __dirname;
const scriptsDir = path.resolve(binDir, '..', 'scripts');

/**
 * Check if a command exists
 */
function commandExists(cmd) {
  const isWindows = process.platform === 'win32';

  try {
    const result = require('child_process').spawnSync(
      isWindows ? 'where' : 'which',
      [cmd],
      { stdio: 'pipe' }
    );
    return result.status === 0;
  } catch (e) {
    return false;
  }
}

/**
 * Find the best available TypeScript runner
 */
function findRunner() {
  // Priority: bun > tsx > ts-node > node with local tsx
  if (commandExists('bun')) {
    return { command: 'bun', type: 'bun' };
  }

  if (commandExists('tsx')) {
    return { command: 'tsx', type: 'tsx' };
  }

  if (commandExists('ts-node')) {
    return { command: 'ts-node', type: 'ts-node' };
  }

  // Check for local tsx in node_modules
  const localTsx = path.join(scriptsDir, 'node_modules', '.bin', 'tsx');
  const localTsxWindows = localTsx + '.cmd';

  if (fs.existsSync(process.platform === 'win32' ? localTsxWindows : localTsx)) {
    return {
      command: process.platform === 'win32' ? localTsxWindows : localTsx,
      type: 'local-tsx'
    };
  }

  // Check for local ts-node
  const localTsNode = path.join(scriptsDir, 'node_modules', '.bin', 'ts-node');
  const localTsNodeWindows = localTsNode + '.cmd';

  if (fs.existsSync(process.platform === 'win32' ? localTsNodeWindows : localTsNode)) {
    return {
      command: process.platform === 'win32' ? localTsNodeWindows : localTsNode,
      type: 'local-ts-node'
    };
  }

  // No runner found
  return null;
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Error: No script specified');
    console.error('Usage: node run.js <script.ts> [args...]');
    process.exit(1);
  }

  const runner = findRunner();

  if (!runner) {
    console.error('Error: No TypeScript runner found');
    console.error('');
    console.error('Please install dependencies first:');
    console.error(`  cd ${scriptsDir}`);
    console.error('  npm install');
    console.error('');
    console.error('Or install one of:');
    console.error('  - bun (recommended): https://bun.sh');
    console.error('  - tsx: npm install -g tsx');
    console.error('  - ts-node: npm install -g ts-node typescript');
    process.exit(1);
  }

  // Execute the TypeScript file
  const child = spawn(runner.command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32' // Use shell on Windows for .cmd files
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });

  child.on('error', (err) => {
    console.error('Error executing script:', err.message);
    process.exit(1);
  });
}

main();
