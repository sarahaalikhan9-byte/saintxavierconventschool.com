@echo off
REM 🚀 One-Command Firebase Deployment Script for Windows
REM For: Saint Xavier Convent School Social Media Dashboard

echo.
echo 🚀 Firebase Deploy शुरू करते हैं...
echo.

REM Step 1: Check Firebase CLI
echo Step 1: Checking Firebase CLI...
firebase --version >nul 2>&1
if errorlevel 1 (
    echo Firebase CLI नहीं मिला!
    echo Install करो: npm install -g firebase-tools
    pause
    exit /b 1
)
echo ✓ Firebase CLI installed
echo.

REM Step 2: Check Node modules
echo Step 2: Checking Node modules...
if not exist "node_modules" (
    echo node_modules नहीं है। Installing...
    call npm install
)
echo ✓ Node modules ready
echo.

REM Step 3: Clean करो
echo Step 3: Cleaning...
call npm run clean
echo ✓ Cleaned
echo.

REM Step 4: Build करो
echo Step 4: Building project...
call npm run build
if errorlevel 1 (
    echo Build failed!
    pause
    exit /b 1
)
echo ✓ Build successful
echo.

REM Step 5: Deploy करो
echo Step 5: Deploying to Firebase...
call firebase deploy --only hosting

if errorlevel 1 (
    echo Deployment failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo 🎉 Deployment Successful! 🎉
echo ========================================
echo.
echo Your dashboard is live at:
echo https://saint-xavier-convent-school.web.app/social-dashboard
echo.
echo Dashboard लॉगिन करने के लिए अपना password use करो!
echo.
pause
