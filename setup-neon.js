const crypto = require('crypto');

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║         HRMS - Neon Database Setup Helper                    ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

// Generate secure JWT secret
const jwtSecret = crypto.randomBytes(32).toString('hex');

console.log('✅ Generated secure JWT secret!\n');

console.log('═══════════════════════════════════════════════════════════════\n');
console.log('STEP 1: Create Neon Database');
console.log('═══════════════════════════════════════════════════════════════\n');
console.log('1. Go to: https://neon.tech');
console.log('2. Sign up with GitHub (free)');
console.log('3. Click "Create a project"');
console.log('4. Name: hrms-database');
console.log('5. Select region closest to you');
console.log('6. Click "Create project"\n');

console.log('═══════════════════════════════════════════════════════════════\n');
console.log('STEP 2: Copy Your Database Connection Details');
console.log('═══════════════════════════════════════════════════════════════\n');
console.log('After creating the project, Neon will show you:');
console.log('Connection string format:');
console.log('postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb\n');

console.log('Parse it to get:');
console.log('  Host: ep-xxx-xxx.region.aws.neon.tech');
console.log('  Database: neondb');
console.log('  User: username (from connection string)');
console.log('  Password: password (from connection string)');
console.log('  Port: 5432\n');

console.log('═══════════════════════════════════════════════════════════════\n');
console.log('STEP 3: Backend Environment Variables (Vercel)');
console.log('═══════════════════════════════════════════════════════════════\n');
console.log('Copy these to Vercel Dashboard → Backend Project → Settings → Environment Variables:\n');

console.log('NODE_ENV=production');
console.log('PORT=5000');
console.log('');
console.log('# Replace with your Neon database details:');
console.log('DB_HOST=ep-xxx-xxx.region.aws.neon.tech');
console.log('DB_PORT=5432');
console.log('DB_USER=your-neon-username');
console.log('DB_PASS=your-neon-password');
console.log('DB_NAME=neondb');
console.log('');
console.log('# Use this generated JWT secret:');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('JWT_EXPIRES_IN=8h\n');

console.log('═══════════════════════════════════════════════════════════════\n');
console.log('STEP 4: Frontend Environment Variables (Vercel)');
console.log('═══════════════════════════════════════════════════════════════\n');
console.log('After deploying backend, copy backend URL and add to:');
console.log('Vercel Dashboard → Frontend Project → Settings → Environment Variables:\n');
console.log('VITE_API_BASE_URL=https://your-backend-url.vercel.app/api\n');

console.log('═══════════════════════════════════════════════════════════════\n');
console.log('STEP 5: Deploy to Vercel');
console.log('═══════════════════════════════════════════════════════════════\n');
console.log('# Install Vercel CLI');
console.log('npm install -g vercel\n');
console.log('# Deploy backend');
console.log('cd backend');
console.log('vercel --prod\n');
console.log('# Deploy frontend');
console.log('cd ../frontend');
console.log('vercel --prod\n');

console.log('═══════════════════════════════════════════════════════════════\n');
console.log('✅ Setup Complete!');
console.log('═══════════════════════════════════════════════════════════════\n');
console.log('Your HRMS will be live at:');
console.log('Frontend: https://your-frontend.vercel.app');
console.log('Backend:  https://your-backend.vercel.app/api\n');
console.log('Login: admin@demo.com / admin123\n');

// Save to file for reference
const fs = require('fs');
const envContent = `# HRMS Backend Environment Variables for Vercel
# Generated: ${new Date().toISOString()}

NODE_ENV=production
PORT=5000

# Database Configuration (Replace with your Neon details)
DB_HOST=ep-xxx-xxx.region.aws.neon.tech
DB_PORT=5432
DB_USER=your-neon-username
DB_PASS=your-neon-password
DB_NAME=neondb

# JWT Configuration (Generated secure secret)
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=8h
`;

fs.writeFileSync('backend/.env.vercel', envContent);
console.log('📝 Saved template to: backend/.env.vercel');
console.log('   (Update with your Neon credentials)\n');

const frontendEnv = `# HRMS Frontend Environment Variables for Vercel
# Update this after deploying backend

VITE_API_BASE_URL=https://your-backend-url.vercel.app/api
`;

fs.writeFileSync('frontend/.env.vercel', frontendEnv);
console.log('📝 Saved template to: frontend/.env.vercel');
console.log('   (Update with your backend URL)\n');

console.log('═══════════════════════════════════════════════════════════════\n');
