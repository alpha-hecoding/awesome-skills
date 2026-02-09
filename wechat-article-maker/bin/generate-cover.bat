@echo off
REM Wrapper for generate-cover.ts (Windows)
setlocal

set "BIN_DIR=%~dp0"
set "SCRIPTS_DIR=%BIN_DIR%..\scripts"

node "%BIN_DIR%run.js" "%SCRIPTS_DIR%\generate-cover.ts" %*
