@echo off
REM Wrapper for md-to-wechat.ts (Windows)
setlocal

set "BIN_DIR=%~dp0"
set "SCRIPTS_DIR=%BIN_DIR%..\scripts"

node "%BIN_DIR%run.js" "%SCRIPTS_DIR%\md-to-wechat.ts" %*
