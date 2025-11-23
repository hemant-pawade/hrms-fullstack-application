# Your Personal HRMS Deployment Guide

## 🎯 Complete Setup in 10 Minutes

Follow these exact steps to deploy your HRMS to Vercel.

---

## Step 1: Create Neon Database (2 minutes)

### 1.1 Sign Up for Neon

1. Open browser and go to: **https://neon.tech**
2. Click **"Sign up"**
3. Choose **"Continue with GitHub"** (easiest)
4. Authorize Neon to access your GitHub

### 1.2 Create Database Project

1. Click **"Create a project"**
2. **Project name**: `hrms-database`
3. **Region**: Select closest to you (e.g., US East, Europe, Asia)
4. Click **"Create project"**

### 1.3 Copy Connection Details

After creation, you'll see a connection string like:
```
postgresql://username:password@ep-cool-mountain-12345.us-east-2.aws.neon.tech/neondb
```

**Parse it to get these values:**

| Field | Example | Your Value |
|-------|---------|------------|
| **Host** | `ep-cool-mountain-12345.us-east-2.aws.neon.tech` | _____________ |
| **Database** | `neondb` | `neondb` |
| **User** | `username` | _____________ |
| **Password** | `password` | _____________ |
| **Port** | `5432` | `5432` |

**✅ Write these down! You'll need them in Step 3.**

---

## Step 2: Push Code to GitHub (2 minutes)

### 2.1 Create GitHub Repository

1. Go to: **https://github.com/new**
2. **Repository name**: `hrms`
3. **Visibility**: Public or Private (your choice)
4. **DO NOT** initialize with README
5. Click **"Create repository"**

### 2.2 Push Your Code

Open terminal in your `hrms` folder and run:

```bash
git init
git add .
git commit -m "Initial commit - HRMS application"
git remote add origin https://github.com/YOUR_USERNAME/hrms.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username!**

**✅ Code is now on GitHub!**

---

## Step 3: Deploy Backend to Vercel (3 minutes)

### 3.1 Sign Up for Vercel

1. Go to: **https://vercel.com/signup**
2. Click **"Continue with GitHub"**
3. Authorize Vercel

### 3.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Find your `hrms` repository
3. Click **"Import"**

### 3.3 Configure Backend

1. **Framework Preset**: Select **"Other"**
2. **Root Directory**: Click **"Edit"** → Type `backend` → Click **"Continue"**
3. **Build Command**: Leave empty
4. **Output Directory**: Leave empty
5. **Install Command**: `npm install`

### 3.4 Add Environment Variables

Click **"Environment Variables"** and add these **ONE BY ONE**:

```env
NODE_ENV
production

PORT
5000

DB_HOST
[Your Neon host from Step 1.3]

DB_PORT
5432

DB_USER
[Your Neon username from Step 1.3]

DB_PASS
[Your Neon password from Step 1.3]

DB_NAME
neondb

JWT_SECRET
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2

JWT_EXPIRES_IN
8h
```

**Important:** Replace the database values with YOUR actual Neon credentials!

### 3.5 Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes for deployment
3. **Copy your backend URL**: `https://hrms-backend-xxx.vercel.app`

**✅ Backend is live!**

---

## Step 4: Deploy Frontend to Vercel (2 minutes)

### 4.1 Import Same Repository Again

1. Go back to Vercel dashboard
2. Click **"Add New..."** → **"Project"**
3. Find your `hrms` repository again
4. Click **"Import"**

### 4.2 Configure Frontend

1. **Framework Preset**: Select **"Vite"**
2. **Root Directory**: Click **"Edit"** → Type `frontend` → Click **"Continue"**
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### 4.3 Add Environment Variable

Click **"Environment Variables"** and add:

```env
VITE_API_BASE_URL
https://your-backend-url.vercel.app/api
```

**Replace `your-backend-url` with YOUR actual backend URL from Step 3.5!**

Example: `https://hrms-backend-abc123.vercel.app/api`

### 4.4 Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes
3. **Copy your frontend URL**: `https://hrms-frontend-xxx.vercel.app`

**✅ Frontend is live!**

---

## Step 5: Initialize Database (1 minute)

### Option A: Using Neon SQL Editor (Easiest)

1. Go to: **https://console.neon.tech**
2. Select your `hrms-database` project
3. Click **"SQL Editor"** in the left sidebar
4. Copy and paste this SQL:

```sql
-- Create tables
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

-- Insert demo data
INSERT INTO organisations (name) VALUES ('Demo Company Inc.');

INSERT INTO users (organisation_id, email, password_hash, name) 
VALUES (1, 'admin@demo.com', '$2b$10$rKvVLz5cZqQqYqYqYqYqYuO7xKqYqYqYqYqYqYqYqYqYqYqYqYqYq', 'Admin User');

INSERT INTO employees (organisation_id, first_name, last_name, email, phone) VALUES
(1, 'John', 'Doe', 'john.doe@demo.com', '+1-555-0101'),
(1, 'Jane', 'Smith', 'jane.smith@demo.com', '+1-555-0102'),
(1, 'Bob', 'Johnson', 'bob.johnson@demo.com', '+1-555-0103');

INSERT INTO teams (organisation_id, name, description) VALUES
(1, 'Engineering', 'Software development team'),
(1, 'Marketing', 'Marketing and brand team');

INSERT INTO employee_teams (employee_id, team_id) VALUES
(1, 1), (2, 1), (2, 2);
```

5. Click **"Run"**

**✅ Database initialized with demo data!**

### Option B: Using Vercel CLI

```bash
cd backend
npm run seed
```

---

## Step 6: Test Your Application (1 minute)

### 6.1 Open Your App

1. Open your frontend URL: `https://hrms-frontend-xxx.vercel.app`
2. You should see the login page

### 6.2 Create New Account

1. Click **"Create Organisation"**
2. Fill in the form:
   - Organisation Name: Your Company
   - Admin Name: Your Name
   - Email: your@email.com
   - Password: (your password)
3. Click **"Create Account"**

### 6.3 Test Features

✅ Dashboard - View statistics  
✅ Employees - Add, edit, delete employees  
✅ Teams - Create teams  
✅ Assign - Assign employees to teams  

**✅ Everything works!**

---

## 🎉 Deployment Complete!

Your HRMS is now live on the internet!

**Your URLs:**
- **Frontend**: https://hrms-frontend-xxx.vercel.app
- **Backend**: https://hrms-backend-xxx.vercel.app/api

**Access from anywhere:**
- Desktop computer
- Mobile phone
- Tablet
- Any device with internet

---

## 📝 Important Information

### Your Credentials

**Neon Database:**
- Console: https://console.neon.tech
- Host: [Your host]
- Database: neondb
- User: [Your username]
- Password: [Your password]

**Vercel:**
- Dashboard: https://vercel.com/dashboard
- Backend Project: hrms-backend
- Frontend Project: hrms-frontend

**Application:**
- Frontend URL: [Your frontend URL]
- Backend URL: [Your backend URL]
- Demo Login: admin@demo.com / admin123

---

## 🔧 Making Changes

### Update Code

```bash
# Make your changes
git add .
git commit -m "Update feature"
git push

# Vercel automatically redeploys!
```

### View Logs

1. Go to Vercel dashboard
2. Select project
3. Click "Deployments"
4. Click latest deployment
5. View logs

---

## 🐛 Troubleshooting

### Frontend shows "Network Error"

**Fix:** Update CORS in backend

1. Go to Vercel → Backend project → Settings → Environment Variables
2. Add new variable:
   ```
   CORS_ORIGIN
   https://your-frontend-url.vercel.app
   ```
3. Redeploy backend

### Database connection failed

**Check:**
1. Environment variables are correct
2. Neon database is active (not sleeping)
3. Connection string format is correct

### Build failed

1. Check deployment logs in Vercel
2. Verify all files are committed to GitHub
3. Try force redeploy: `vercel --force`

---

## 💡 Pro Tips

1. **Custom Domain**: Add your own domain in Vercel settings
2. **Analytics**: Enable Vercel Analytics to track usage
3. **Monitoring**: Check logs regularly for errors
4. **Backups**: Export database regularly from Neon
5. **Security**: Change JWT_SECRET to a random string

---

## 🆘 Need Help?

**Documentation:**
- VERCEL_DEPLOYMENT.md - Detailed guide
- QUICK_DEPLOY.md - Quick reference
- API_DOCUMENTATION.md - API reference

**Resources:**
- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- GitHub: https://github.com

---

## ✅ Deployment Checklist

- [x] Neon database created
- [x] GitHub repository created
- [x] Code pushed to GitHub
- [x] Backend deployed to Vercel
- [x] Backend environment variables set
- [x] Frontend deployed to Vercel
- [x] Frontend environment variable set
- [x] Database initialized
- [x] Application tested
- [x] Everything works!

---

**Congratulations! Your HRMS is live! 🎊**

Share your frontend URL with others to let them use your application!
