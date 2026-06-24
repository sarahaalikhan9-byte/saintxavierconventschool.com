@echo off
setlocal
cd /d "%~dp0"

echo Installing Saint Xavier Convent School dependencies...
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found.
  echo Please install Node.js LTS from https://nodejs.org and run this file again.
  pause
  exit /b 1
)

call npm install
if errorlevel 1 goto failed

call npm run install:all
if errorlevel 1 goto failed

echo.
echo Installation complete.
echo Run START.bat to open the project.
pause
exit /b 0

:failed
echo.
echo Installation failed. Please check the error above.
pause
exit /b 1
