@echo off
REM ============================================
REM AI Doctor - Setup & Start Script
REM ============================================
REM This script performs setup and starts the server

setlocal enabledelayedexpansion

cd /d "%~dp0"

echo.
echo ╔════════════════════════════════════════╗
echo ║   🩺 AI Doctor - Setup & Start       ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if node is installed
echo Checking Node.js installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version
echo.

REM Check if npm is installed
echo Checking npm installation...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm not found! Please reinstall Node.js
    pause
    exit /b 1
)

echo ✅ npm found: 
npm --version
echo.

REM Kill any existing node processes on port 3000
echo Cleaning up port 3000...
netstat -ano | findstr :3000 >nul
if !errorlevel! equ 0 (
    echo ⚠️  Found process on port 3000, attempting to close...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
        taskkill /PID %%a /F 2>nul
    )
    timeout /t 2 /nobreak
)
echo ✅ Port 3000 cleared
echo.

REM Check if .env exists
echo Checking .env file...
if not exist ".env" (
    echo ⚠️  .env file not found, creating from .env.example...
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo ✅ Created .env file
        echo.
        echo ⚠️  IMPORTANT: Update .env with your Supabase credentials!
        echo   1. Get SUPABASE_SERVICE_ROLE_KEY from Supabase Settings ^> API
        echo   2. Update JWT_SECRET with a secure key
        echo.
        pause
    ) else (
        echo ❌ .env.example not found - cannot create .env
        pause
        exit /b 1
    )
) else (
    echo ✅ .env file exists
)
echo.

REM Check if node_modules exists
echo Checking dependencies...
if not exist "node_modules" (
    echo ⚠️  node_modules not found, installing...
    call npm install
    if !errorlevel! neq 0 (
        echo ❌ npm install failed!
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed
) else (
    echo ✅ Dependencies already installed
)
echo.

REM Run diagnostic
echo Running system diagnostic...
call node scripts/diagnostic.js
echo.

REM Start server
echo.
echo Attempting to start server...
echo ════════════════════════════════════════
echo.

call npm run dev

pause
