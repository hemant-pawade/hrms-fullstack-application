# Deploy HRMS to Vercel - SIMPLEST METHOD

## 🚀 **Deploy in 5 Minutes - No Database Setup Needed!**

Vercel has built-in PostgreSQL! Skip Neon and use Vercel Postgres instead.

---

## **Step 1: Push to GitHub (1 minute)**

```bash
cd hrms
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/hrms.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## **Step 2: Deploy Backend (2 minutes)**

1. Go to: **https://vercel.com/new**
2. Sign in with GitHub
3. Import your `hrms` repository
4. **Root Directory**: Click "Edit" → Type `backend`
5. **Framework**: Other
6. Click **"Deploy"**

**Copy your backend URL**: `https://hrms-backend-xxx.vercel.app`

---

## **Step 3: Add Vercel Postgres (1 minute)**

1. In Vercel dashboard, go to your backend project
2. Click **"Storage"** tab
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Click **"Create"**

**Done!** Vercel automatically connects your database!

---

## **Step 4: Add Environment Variables (1 minute)**

In Vercel backend project → Settings → Environment Variables, add:

```env
NODE_ENV=production
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
JWT_EXPIRES_IN=8h
```

**Redeploy** the backend (Vercel → Deployments → Redeploy)

---

## **Step 5: Deploy Frontend (1 minute)**

1. Go to: **https://vercel.com/new**
2. Import your `hrms` repository again
3. **Root Directory**: Click "Edit" → Type `frontend`
4. **Framework**: Vite
5. Add environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend-url.vercel.app/api
   ```
6. Click **"Deploy"**

---

## **Step 6: Initialize Database (1 minute)**

1. Go to Vercel → Backend project → Storage → Postgres
2. Click **"Query"** tab
3. Copy and paste this SQL:

```sql
CREATE TABLE organisations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  organisation_id INT REFERENCES organisations(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  organisation_id INT REFERENCES organisations(id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  organisation_id INT REFERENCES organisations(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE employee_teams (
  id SERIAL PRIMARY KEY,
  employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
  team_id INT REFERENCES teams(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT now(),
  UNIQUE(employee_id, team_id)
);

CREATE TABLE logs (
  id SERIAL PRIMARY KEY,
  organisation_id INT,
  user_id INT,
  action VARCHAR(255) NOT NULL,
  meta JSONB DEFAULT '{}',
  timestamp TIMESTAMP DEFAULT now()
);
```

4. Click **"Run Query"**

---

## **✅ Done!**

Your HRMS is live!

**Frontend**: `https://hrms-frontend-xxx.vercel.app`  
**Backend**: `https://hrms-backend-xxx.vercel.app`

**Open frontend URL and create your account!**

---

## **Why This is Better:**

✅ No Neon signup needed  
✅ No external database  
✅ Everything in Vercel  
✅ Automatic connection  
✅ Free tier included  
✅ Faster deployment  

---

**Start now: Push to GitHub!** 🚀
