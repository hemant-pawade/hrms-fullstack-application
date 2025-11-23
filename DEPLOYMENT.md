# HRMS Deployment Guide

Complete guide for deploying the HRMS application to production.

---

## 📋 Pre-Deployment Checklist

### Security
- [ ] Change JWT_SECRET to a strong random string
- [ ] Update database credentials
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for production domain
- [ ] Review and update .env files
- [ ] Remove console.log statements
- [ ] Enable rate limiting
- [ ] Set secure cookie flags

### Code
- [ ] Run tests
- [ ] Check for errors
- [ ] Optimize images
- [ ] Minify assets
- [ ] Remove debug code
- [ ] Update API URLs

### Database
- [ ] Backup existing data
- [ ] Run migrations
- [ ] Verify schema
- [ ] Set up automated backups
- [ ] Configure connection pooling

---

## 🚀 Deployment Options

### Option 1: Heroku (Easiest)

#### Backend Deployment

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
cd backend
heroku create hrms-backend-app
```

4. **Add PostgreSQL**
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

5. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_super_secret_key_here
heroku config:set JWT_EXPIRES_IN=8h
```

6. **Deploy**
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

7. **Run Migrations**
```bash
heroku run npm run seed
```

#### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd frontend
vercel
```

3. **Set Environment Variable**
```bash
vercel env add VITE_API_BASE_URL
# Enter: https://hrms-backend-app.herokuapp.com/api
```

4. **Deploy to Production**
```bash
vercel --prod
```

---

### Option 2: Render.com

#### Backend

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure:
   - **Name:** hrms-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. Add Environment Variables:
   ```
   NODE_ENV=production
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=8h
   ```

6. Add PostgreSQL Database:
   - Click "New +" → "PostgreSQL"
   - Copy connection string
   - Add to backend environment variables

#### Frontend

1. Click "New +" → "Static Site"
2. Connect repository
3. Configure:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`

4. Add Environment Variable:
   ```
   VITE_API_BASE_URL=https://hrms-backend.onrender.com/api
   ```

---

### Option 3: Railway.app

#### Backend

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select repository
4. Add PostgreSQL:
   - Click "New" → "Database" → "PostgreSQL"
   - Railway auto-configures connection

5. Configure Backend:
   - Set root directory: `/backend`
   - Add environment variables
   - Deploy

#### Frontend

1. Click "New" → "GitHub Repo"
2. Select repository
3. Configure:
   - Root directory: `/frontend`
   - Build command: `npm run build`
   - Start command: `npm run preview`

---

### Option 4: DigitalOcean / AWS / VPS

#### Server Setup

1. **Create Droplet/Instance**
   - Ubuntu 22.04 LTS
   - 2GB RAM minimum
   - SSH access

2. **Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Nginx
sudo apt install nginx

# Install PM2
sudo npm install -g pm2
```

3. **Setup PostgreSQL**
```bash
sudo -u postgres psql
CREATE DATABASE hrms_db;
CREATE USER hrms_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE hrms_db TO hrms_user;
\q
```

4. **Clone Repository**
```bash
cd /var/www
git clone your-repo-url hrms
cd hrms
```

5. **Setup Backend**
```bash
cd backend
npm install
# Create .env file with production values
pm2 start src/index.js --name hrms-backend
pm2 save
pm2 startup
```

6. **Setup Frontend**
```bash
cd ../frontend
npm install
npm run build
```

7. **Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/hrms
```

```nginx
# Backend
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/hrms/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

8. **Enable Site**
```bash
sudo ln -s /etc/nginx/sites-available/hrms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

9. **Setup SSL (Let's Encrypt)**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com
```

---

## 🔒 Production Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000

# Database (use production credentials)
DB_HOST=your-db-host.com
DB_PORT=5432
DB_USER=your_db_user
DB_PASS=your_secure_password
DB_NAME=hrms_production

# JWT (use strong secret!)
JWT_SECRET=generate_a_very_long_random_string_here_min_32_chars
JWT_EXPIRES_IN=8h

# CORS (your frontend domain)
CORS_ORIGIN=https://yourdomain.com
```

### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

---

## 🗄️ Database Migration

### Backup Current Database
```bash
pg_dump -U postgres hrms_db > backup.sql
```

### Restore to Production
```bash
psql -U production_user -d hrms_production < backup.sql
```

### Run Migrations
```bash
cd backend
npm run seed  # Only for initial setup
```

---

## 📊 Monitoring & Maintenance

### PM2 Monitoring
```bash
pm2 monit                 # Real-time monitoring
pm2 logs hrms-backend     # View logs
pm2 restart hrms-backend  # Restart app
pm2 status                # Check status
```

### Database Backups
```bash
# Create backup script
nano /home/user/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U hrms_user hrms_db > /backups/hrms_$DATE.sql
# Keep only last 7 days
find /backups -name "hrms_*.sql" -mtime +7 -delete
```

```bash
chmod +x /home/user/backup.sh
# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /home/user/backup.sh
```

### Log Rotation
```bash
sudo nano /etc/logrotate.d/hrms
```

```
/var/log/hrms/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

---

## 🔍 Health Checks

### Backend Health Endpoint
Add to `backend/src/index.js`:
```javascript
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Monitoring Services
- **UptimeRobot** - Free uptime monitoring
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **New Relic** - Performance monitoring

---

## 🚨 Troubleshooting

### Backend Won't Start
```bash
# Check logs
pm2 logs hrms-backend

# Check port
sudo lsof -i :5000

# Check environment
pm2 env 0
```

### Database Connection Failed
```bash
# Test connection
psql -U hrms_user -d hrms_db -h localhost

# Check PostgreSQL status
sudo systemctl status postgresql

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

### Nginx Errors
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### SSL Certificate Issues
```bash
# Renew certificates
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

---

## 📈 Performance Optimization

### Backend
- Enable gzip compression
- Add Redis for caching
- Implement rate limiting
- Use CDN for static assets
- Enable database query caching

### Frontend
- Enable Vite build optimizations
- Use lazy loading
- Implement code splitting
- Compress images
- Use CDN for assets

### Database
- Add indexes on frequently queried columns
- Optimize slow queries
- Enable connection pooling
- Regular VACUUM and ANALYZE

---

## 🔐 Security Hardening

### Server
```bash
# Setup firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no

# Install fail2ban
sudo apt install fail2ban
```

### Application
- Use helmet.js for security headers
- Implement rate limiting
- Add CSRF protection
- Enable CORS properly
- Sanitize user inputs
- Use prepared statements

---

## 📞 Support & Maintenance

### Regular Tasks
- [ ] Weekly: Check logs for errors
- [ ] Weekly: Review database performance
- [ ] Monthly: Update dependencies
- [ ] Monthly: Review security advisories
- [ ] Quarterly: Load testing
- [ ] Quarterly: Security audit

### Update Process
```bash
# Pull latest code
git pull origin main

# Update backend
cd backend
npm install
pm2 restart hrms-backend

# Update frontend
cd ../frontend
npm install
npm run build
```

---

## 🎉 Post-Deployment

1. **Test all features**
   - User registration
   - Login/logout
   - CRUD operations
   - Team assignments

2. **Monitor for 24 hours**
   - Check error logs
   - Monitor performance
   - Watch database queries

3. **Setup alerts**
   - Uptime monitoring
   - Error tracking
   - Performance alerts

4. **Document**
   - Production URLs
   - Credentials (secure storage)
   - Deployment process
   - Rollback procedure

---

**Deployment Complete! 🚀**

Your HRMS application is now live and ready for production use.
