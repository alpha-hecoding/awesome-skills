#!/bin/bash
# Smart executor wrapper for TypeScript scripts
# Automatically detects and uses bun or tsx (faster) or falls back to node with ts-node

# Get the directory where this script is located (bin/)
BIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# The scripts directory is one level up, then into scripts/
SCRIPTS_DIR="$(cd "$BIN_DIR/../scripts" && pwd)"

# Check what runtime is available (in priority order)
if command -v bun &> /dev/null; then
    RUNNER="bun"
elif command -v tsx &> /dev/null; then
    RUNNER="tsx"
elif command -v ts-node &> /dev/null; then
    RUNNER="ts-node"
elif command -v node &> /dev/null; then
    # Check if typescript is available in node_modules
    if [ -f "$SCRIPTS_DIR/node_modules/.bin/tsx" ]; then
        RUNNER="$SCRIPTS_DIR/node_modules/.bin/tsx"
    elif [ -f "$SCRIPTS_DIR/node_modules/.bin/ts-node" ]; then
        RUNNER="$SCRIPTS_DIR/node_modules/.bin/ts-node"
    else
        echo "Error: No TypeScript runner found" >&2
        echo "Please install dependencies first:" >&2
        echo "  cd $SCRIPTS_DIR && ./install-deps.sh" >&2
        echo "" >&2
        echo "Or install one of:" >&2
        echo "  - bun (recommended): https://bun.sh" >&2
        echo "  - tsx: npm install -g tsx" >&2
        echo "  - ts-node: npm install -g ts-node typescript" >&2
        exit 1
    fi
else
    echo "Error: No JavaScript runtime found (bun or node)" >&2
    exit 1
fi

# Execute the script with the detected runner
exec "$RUNNER" "$@"
