# HRMS Vercel Deployment Guide

Complete step-by-step guide to deploy your HRMS application to Vercel.

---

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account** - For repository hosting
3. **PostgreSQL Database** - Use one of these options:
   - [Neon](https://neon.tech) - Free PostgreSQL (Recommended)
   - [Supabase](https://supabase.com) - Free PostgreSQL
   - [Railway](https://railway.app) - PostgreSQL hosting
   - [ElephantSQL](https://www.elephantsql.com) - Free tier available

---

## 🗄️ Step 1: Setup PostgreSQL Database (Neon - Recommended)

### Option A: Neon (Easiest & Free)

1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub
3. Click **"Create a project"**
4. Name it: `hrms-database`
5. Select region closest to you
6. Click **"Create project"**

7. **Copy Connection String**:
   ```
   postgresql://username:password@host/database?sslmode=require
   ```

8. **Parse the connection details**:
   - Host: `ep-xxx-xxx.region.aws.neon.tech`
   - Database: `neondb`
   - User: `username`
   - Password: `your-password`
   - Port: `5432`

---

## 🚀 Step 2: Deploy Backend to Vercel

### 2.1 Push Code to GitHub

```bash
# Initialize git (if not already done)
cd hrms
git init
git add .
git commit -m "Initial commit - HRMS application"

# Create GitHub repository and push
# Go to github.com and create a new repository named "hrms"
git remote add origin https://github.com/YOUR_USERNAME/hrms.git
git branch -M main
git push -u origin main
```

### 2.2 Deploy Backend

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty or `npm install`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

5. **Add Environment Variables** (Click "Environment Variables"):
   ```
   NODE_ENV=production
   PORT=5000
   
   DB_HOST=your-neon-host.neon.tech
   DB_PORT=5432
   DB_USER=your-username
   DB_PASS=your-password
   DB_NAME=neondb
   
   JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long_random_string
   JWT_EXPIRES_IN=8h
   ```

6. Click **"Deploy"**

7. **Copy Backend URL**: 
   ```
   https://hrms-backend-xxx.vercel.app
   ```

### 2.3 Initialize Database

After backend deployment, run the seed script:

**Option 1: Using Vercel CLI**
```bash
npm install -g vercel
vercel login
cd backend
vercel env pull .env.production
npm run seed
```

**Option 2: Using Database Client**
Connect to your Neon database and run the seed script manually, or use the Neon SQL Editor to create tables.

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Update Frontend Environment

1. Edit `frontend/.env.production`:
   ```env
   VITE_API_BASE_URL=https://your-backend-url.vercel.app/api
   ```
   Replace with your actual backend URL from Step 2.7

### 3.2 Deploy Frontend

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import the same GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Add Environment Variable**:
   ```
   VITE_API_BASE_URL=https://your-backend-url.vercel.app/api
   ```

6. Click **"Deploy"**

7. **Your Frontend URL**:
   ```
   https://hrms-frontend-xxx.vercel.app
   ```

---

## 🔧 Step 4: Configure CORS

Update `backend/src/index.js` to allow your frontend domain:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-url.vercel.app'
  ],
  credentials: true
}));
```

Then redeploy the backend:
```bash
git add .
git commit -m "Update CORS configuration"
git push
```

Vercel will automatically redeploy.

---

## ✅ Step 5: Test Your Deployment

1. Open your frontend URL: `https://hrms-frontend-xxx.vercel.app`
2. Try to register a new organisation
3. Login with credentials
4. Test all CRUD operations

---

## 🎯 Quick Deployment (Alternative Method)

### Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy Backend
cd backend
vercel --prod

# Deploy Frontend
cd ../frontend
vercel --prod
```

---

## 🔐 Environment Variables Reference

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `5000` |
| `DB_HOST` | Database host | `ep-xxx.neon.tech` |
| `DB_PORT` | Database port | `5432` |
| `DB_USER` | Database user | `username` |
| `DB_PASS` | Database password | `your-password` |
| `DB_NAME` | Database name | `neondb` |
| `JWT_SECRET` | JWT secret key | `min-32-chars-random` |
| `JWT_EXPIRES_IN` | Token expiry | `8h` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `https://backend.vercel.app/api` |

---

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Failed**
```bash
# Check environment variables in Vercel dashboard
# Ensure DB credentials are correct
# Check if database allows external connections
```

**CORS Errors**
```javascript
// Update backend/src/index.js
app.use(cors({
  origin: 'https://your-frontend.vercel.app',
  credentials: true
}));
```

**Function Timeout**
- Vercel free tier has 10s timeout
- Optimize database queries
- Add connection pooling

### Frontend Issues

**API Calls Failing**
- Check `VITE_API_BASE_URL` in Vercel environment variables
- Ensure backend URL is correct
- Check browser console for errors

**Build Failures**
```bash
# Clear cache and rebuild
vercel --force
```

---

## 📊 Database Management

### Using Neon Console

1. Go to [console.neon.tech](https://console.neon.tech)
2. Select your project
3. Click **"SQL Editor"**
4. Run queries directly

### Backup Database

```bash
# Using pg_dump (if you have PostgreSQL installed)
pg_dump -h your-host.neon.tech -U username -d neondb > backup.sql
```

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel automatically deploys!
```

---

## 💰 Cost Considerations

### Free Tier Limits

**Vercel Free Tier:**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless functions
- ⚠️ 10s function timeout
- ⚠️ 100 deployments/day

**Neon Free Tier:**
- ✅ 0.5GB storage
- ✅ 1 project
- ✅ Unlimited queries
- ⚠️ Database sleeps after inactivity

---

## 🎉 Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database connected and seeded
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Test user registration
- [ ] Test login/logout
- [ ] Test CRUD operations
- [ ] Test team assignments
- [ ] Check logs in Vercel dashboard
- [ ] Set up custom domain (optional)

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain to Frontend

1. Go to Vercel dashboard
2. Select your frontend project
3. Click **"Settings"** → **"Domains"**
4. Add your domain: `hrms.yourdomain.com`
5. Follow DNS configuration instructions

### Add Custom Domain to Backend

1. Select your backend project
2. Add domain: `api.yourdomain.com`
3. Update frontend `VITE_API_BASE_URL`

---

## 📱 Mobile App Considerations

If you want to build a mobile app later:

1. Backend is already API-ready
2. Use React Native with same API endpoints
3. Update CORS to allow mobile app domain

---

## 🔒 Security Best Practices

1. **Use Strong JWT Secret**
   ```bash
   # Generate random secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Enable HTTPS Only**
   - Vercel provides HTTPS by default

3. **Set Secure Headers**
   ```javascript
   // Add to backend
   app.use(helmet());
   ```

4. **Rate Limiting**
   ```javascript
   // Add to backend
   const rateLimit = require('express-rate-limit');
   app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
   ```

---

## 📈 Monitoring

### Vercel Analytics

1. Go to project settings
2. Enable **"Analytics"**
3. View real-time metrics

### Error Tracking

Consider adding:
- [Sentry](https://sentry.io) - Error tracking
- [LogRocket](https://logrocket.com) - Session replay

---

## 🎓 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Express on Vercel](https://vercel.com/guides/using-express-with-vercel)

---

## 🆘 Need Help?

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser console
3. Verify environment variables
4. Test API endpoints directly
5. Check database connection

---

**Your HRMS is now live on Vercel! 🎉**

Frontend: `https://your-frontend.vercel.app`  
Backend: `https://your-backend.vercel.app`

Login with: admin@demo.com / admin123
