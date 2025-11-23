# Quick Installation Guide

## Step-by-Step Setup (5 minutes)

### 1️⃣ Install PostgreSQL

**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Run installer, remember your password
- Default port: 5432

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2️⃣ Create Database

```bash
# Open PostgreSQL command line
psql -U postgres

# Create database
CREATE DATABASE hrms_db;

# Exit
\q
```

### 3️⃣ Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Update .env file with your PostgreSQL password
# Edit: DB_PASS=your_postgres_password

# Seed database with demo data
npm run seed

# Start backend server
npm run dev
```

✅ Backend running on http://localhost:5000

### 4️⃣ Setup Frontend

**Open a NEW terminal window:**

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

✅ Frontend running on http://localhost:3000

### 5️⃣ Login

Open browser: http://localhost:3000

**Demo Credentials:**
- Email: `admin@demo.com`
- Password: `admin123`

---

## Troubleshooting

### "Database connection failed"
- Check PostgreSQL is running
- Verify password in `backend/.env`
- Ensure database `hrms_db` exists

### "Port already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### "Module not found"
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Quick Commands

```bash
# Backend
cd backend
npm run dev      # Start development server
npm run seed     # Reset database with demo data
npm start        # Production mode

# Frontend
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## What's Included?

After seeding, you'll have:
- ✅ 1 Demo Organisation
- ✅ 1 Admin User (admin@demo.com)
- ✅ 5 Sample Employees
- ✅ 3 Sample Teams
- ✅ Pre-assigned team members

---

## Next Steps

1. **Explore the Dashboard** - View statistics and recent activity
2. **Manage Employees** - Add, edit, delete employees
3. **Create Teams** - Organize your workforce
4. **Assign Members** - Add employees to teams
5. **Check Logs** - View all system activities

---

**Need Help?** Check the main README.md for detailed documentation.
