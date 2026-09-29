@echo off
cd /d "%~dp0"
set "NODE_PATH=%~dp0node_modules\.pnpm\node_modules"
echo Opening Bao Vo's current website at http://127.0.0.1:3001
echo Keep this window open while using the website. Close it to stop.
start "" "http://127.0.0.1:3001"
"%~dp0runtime\node.exe" "%~dp0node_modules\next\dist\bin\next" start --hostname 127.0.0.1 --port 3001
pause
