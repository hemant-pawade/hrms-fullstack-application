@echo off
echo ========================================
echo HRMS - Quick Start Script
echo ========================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found!
echo.

echo ========================================
echo Step 1: Installing Backend Dependencies
echo ========================================
cd backend
if not exist node_modules (
    echo Installing backend packages...
    call npm install
) else (
    echo Backend dependencies already installed.
)
echo.

echo ========================================
echo Step 2: Installing Frontend Dependencies
echo ========================================
cd ..\frontend
if not exist node_modules (
    echo Installing frontend packages...
    call npm install
) else (
    echo Frontend dependencies already installed.
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo IMPORTANT: Before starting the servers:
echo 1. Make sure PostgreSQL is running
echo 2. Create database 'hrms_db'
echo 3. Update backend\.env with your DB credentials
echo 4. Run 'npm run seed' in backend folder to create demo data
echo.
echo To start the application:
echo 1. Open a terminal and run: cd backend ^&^& npm run dev
echo 2. Open another terminal and run: cd frontend ^&^& npm run dev
echo.
echo Then open http://localhost:3000 in your browser
echo.
pause
