@echo off
setlocal
cd /d "%~dp0"

echo Building Saint Xavier Convent School frontend...
echo.

if not exist "frontend\node_modules" (
  echo Dependencies are missing.
  echo Run INSTALL.bat first.
  pause
  exit /b 1
)

call npm run build
if errorlevel 1 goto failed

echo.
echo Build complete. Output folder: frontend\dist
pause
exit /b 0

:failed
echo.
echo Build failed. Please check the error above.
pause
exit /b 1
