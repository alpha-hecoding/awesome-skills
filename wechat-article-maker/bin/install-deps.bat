@echo off
REM Installation script for wechat-article-maker dependencies (Windows)
setlocal

set "BIN_DIR=%~dp0"
set "SCRIPTS_DIR=%BIN_DIR%..\scripts"

cd /d "%SCRIPTS_DIR%" || exit /b 1

echo ===================================
echo Installing dependencies...
echo ===================================
echo.
echo Working directory: %SCRIPTS_DIR%
echo.

REM Check if bun is available
where bun >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Using Bun for faster installation
    bun install
) else (
    REM Check if npm is available
    where npm >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Using npm
        npm install
    ) else (
        echo [ERROR] Neither bun nor npm found
        echo Please install Node.js or Bun first
        exit /b 1
    )
)

echo.
echo ===================================
echo Installation complete!
echo ===================================
echo.
echo Installed packages:
echo   * markdown-it (required) - Markdown rendering
echo   * juice (required) - CSS inlining
echo   * tsx (required) - TypeScript runner for Node.js
echo.
echo Optional packages (for cover generation):
if exist "%SCRIPTS_DIR%\node_modules\@napi-rs\canvas" (
    echo   [OK] @napi-rs/canvas - High-performance image generation
) else if exist "%SCRIPTS_DIR%\node_modules\sharp" (
    echo   [OK] sharp - Image processing
) else (
    echo   [WARN] No image libraries installed (will use SVG fallback^)
    echo.
    echo To install optional packages:
    echo   cd %SCRIPTS_DIR%
    echo   npm install @napi-rs/canvas
    echo   or
    echo   npm install sharp
)
echo.
echo You can now use the commands in bin\ directory:
echo   %BIN_DIR%wechat-api.bat
echo   %BIN_DIR%wechat-article.bat
echo   %BIN_DIR%generate-cover.bat
echo.
