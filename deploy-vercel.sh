#!/bin/bash

echo "=========================================="
echo "HRMS Vercel Deployment Script"
echo "=========================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "Logging in to Vercel..."
vercel login

echo ""
echo "=========================================="
echo "Step 1: Deploying Backend"
echo "=========================================="
cd backend
echo "Deploying backend to Vercel..."
vercel --prod

echo ""
echo "Backend deployed! Copy the URL and update frontend/.env.production"
echo "Press Enter when ready to continue..."
read

cd ..

echo ""
echo "=========================================="
echo "Step 2: Deploying Frontend"
echo "=========================================="
cd frontend
echo "Deploying frontend to Vercel..."
vercel --prod

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Set up PostgreSQL database (Neon recommended)"
echo "2. Add environment variables in Vercel dashboard"
echo "3. Run database seed script"
echo "4. Test your application"
echo ""
echo "See VERCEL_DEPLOYMENT.md for detailed instructions"
echo ""
