# Quick Vercel Deployment Guide

## 🚀 5-Minute Deployment

### Step 1: Setup Database (2 minutes)

1. Go to [neon.tech](https://neon.tech)
2. Sign up → Create project → Copy connection string
3. Save these details:
   ```
   Host: ep-xxx.neon.tech
   Database: neondb
   User: username
   Password: password
   ```

### Step 2: Deploy Backend (1 minute)

```bash
cd hrms/backend
vercel --prod
```

Add environment variables in Vercel dashboard:
```
NODE_ENV=production
DB_HOST=your-neon-host
DB_PORT=5432
DB_USER=your-username
DB_PASS=your-password
DB_NAME=neondb
JWT_SECRET=your-32-char-random-string
JWT_EXPIRES_IN=8h
```

Copy backend URL: `https://hrms-backend-xxx.vercel.app`

### Step 3: Deploy Frontend (1 minute)

Update `frontend/.env.production`:
```env
VITE_API_BASE_URL=https://your-backend-url.vercel.app/api
```

```bash
cd hrms/frontend
vercel --prod
```

### Step 4: Seed Database (1 minute)

Connect to Neon SQL Editor and run:
```sql
-- Copy SQL from backend/src/seed.js
-- Or use Vercel CLI to run seed script
```

### Done! 🎉

Open: `https://your-frontend.vercel.app`  
Login: admin@demo.com / admin123

---

## 📋 Checklist

- [ ] Neon database created
- [ ] Backend deployed to Vercel
- [ ] Backend environment variables set
- [ ] Frontend .env.production updated
- [ ] Frontend deployed to Vercel
- [ ] Database seeded
- [ ] Test login
- [ ] Test CRUD operations

---

## 🔗 Important URLs

**Neon Console**: https://console.neon.tech  
**Vercel Dashboard**: https://vercel.com/dashboard  
**GitHub**: https://github.com

---

## 🆘 Quick Fixes

**CORS Error?**
```javascript
// backend/src/index.js
app.use(cors({
  origin: 'https://your-frontend.vercel.app'
}));
```

**Database Connection Failed?**
- Check environment variables
- Verify Neon database is active
- Check connection string format

**Build Failed?**
```bash
vercel --force  # Force rebuild
```

---

## 📱 Access Your App

**Frontend**: https://your-app.vercel.app  
**Backend API**: https://your-api.vercel.app/api  
**Health Check**: https://your-api.vercel.app/health

---

**Need detailed instructions? See VERCEL_DEPLOYMENT.md**
