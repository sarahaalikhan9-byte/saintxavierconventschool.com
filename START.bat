@echo off
setlocal
cd /d "%~dp0"

echo Starting Saint Xavier Convent School...
echo Frontend usually opens at http://localhost:5173
echo Backend runs in the same window.
echo.

if not exist "frontend\node_modules" (
  echo Dependencies are missing.
  echo Run INSTALL.bat first.
  pause
  exit /b 1
)

call npm run dev
pause
