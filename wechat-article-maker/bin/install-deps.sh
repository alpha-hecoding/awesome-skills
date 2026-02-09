#!/bin/bash
# Installation script for wechat-article-maker dependencies

# Get the directory where this script is located (bin/)
BIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPTS_DIR="$(cd "$BIN_DIR/../scripts" && pwd)"

cd "$SCRIPTS_DIR" || exit 1

echo "==================================="
echo "Installing dependencies..."
echo "==================================="
echo ""
echo "Working directory: $SCRIPTS_DIR"
echo ""

# Check if bun is available
if command -v bun &> /dev/null; then
    echo "✓ Using Bun for faster installation"
    bun install
elif command -v npm &> /dev/null; then
    echo "✓ Using npm"
    npm install
else
    echo "✗ Error: Neither bun nor npm found"
    echo "Please install Node.js or Bun first"
    exit 1
fi

echo ""
echo "==================================="
echo "Installation complete!"
echo "==================================="
echo ""
echo "Installed packages:"
echo "  • markdown-it (required) - Markdown rendering"
echo "  • juice (required) - CSS inlining"
echo "  • tsx (required) - TypeScript runner for Node.js"
echo ""
echo "Optional packages (for cover generation):"
if [ -d "$SCRIPTS_DIR/node_modules/@napi-rs/canvas" ]; then
    echo "  ✓ @napi-rs/canvas - High-performance image generation"
elif [ -d "$SCRIPTS_DIR/node_modules/sharp" ]; then
    echo "  ✓ sharp - Image processing"
else
    echo "  ⚠ No image libraries installed (will use SVG fallback)"
    echo ""
    echo "To install optional packages:"
    echo "  cd $SCRIPTS_DIR"
    echo "  npm install @napi-rs/canvas"
    echo "  or"
    echo "  npm install sharp"
fi
echo ""
echo "You can now use the commands in bin/ directory:"
echo "  $BIN_DIR/wechat-api"
echo "  $BIN_DIR/wechat-article"
echo "  $BIN_DIR/generate-cover"
echo ""
