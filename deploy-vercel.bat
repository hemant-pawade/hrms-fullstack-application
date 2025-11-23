@echo off
echo ==========================================
echo HRMS Vercel Deployment Script
echo ==========================================
echo.

echo Checking Vercel CLI...
where vercel >nul 2>&1
if errorlevel 1 (
    echo Vercel CLI not found. Installing...
    call npm install -g vercel
)

echo Logging in to Vercel...
call vercel login

echo.
echo ==========================================
echo Step 1: Deploying Backend
echo ==========================================
cd backend
echo Deploying backend to Vercel...
call vercel --prod

echo.
echo Backend deployed! Copy the URL and update frontend\.env.production
echo Press any key when ready to continue...
pause >nul

cd ..

echo.
echo ==========================================
echo Step 2: Deploying Frontend
echo ==========================================
cd frontend
echo Deploying frontend to Vercel...
call vercel --prod

echo.
echo ==========================================
echo Deployment Complete!
echo ==========================================
echo.
echo Next steps:
echo 1. Set up PostgreSQL database (Neon recommended)
echo 2. Add environment variables in Vercel dashboard
echo 3. Run database seed script
echo 4. Test your application
echo.
echo See VERCEL_DEPLOYMENT.md for detailed instructions
echo.
pause
