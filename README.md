# HRMS - Human Resource Management System

A modern, full-stack Human Resource Management System built with React, Node.js, Express, and PostgreSQL. Features a beautiful, responsive UI with smooth animations and comprehensive employee and team management capabilities.

## 🚀 Features

### Core Functionality
- ✅ **Organisation Management** - Multi-tenant architecture with organisation accounts
- ✅ **Authentication & Authorization** - Secure JWT-based authentication
- ✅ **Employee Management** - Full CRUD operations for employees
- ✅ **Team Management** - Create and manage teams
- ✅ **Team Assignments** - Many-to-many relationship (employees can belong to multiple teams)
- ✅ **Audit Logging** - Comprehensive logging of all operations
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ✅ **Animated UI** - Smooth transitions and animations using Framer Motion

### Technical Features
- 🔐 Password hashing with bcrypt
- 🎫 JWT token-based authentication
- 📊 PostgreSQL database with Sequelize ORM
- 🎨 TailwindCSS for styling
- ⚡ Vite for fast development
- 🔄 Real-time data updates
- 📱 Mobile-responsive design
- 🎭 Beautiful animations and transitions

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager

## 🛠️ Installation & Setup

### 1. Clone or Download the Project

```bash
cd hrms
```

### 2. Database Setup

#### Option A: Using PostgreSQL GUI (pgAdmin)
1. Open pgAdmin or your PostgreSQL client
2. Create a new database named `hrms_db`
3. Note your PostgreSQL credentials

#### Option B: Using Command Line
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE hrms_db;

# Exit
\q
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit the .env file with your database credentials
# Default values:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASS=postgres
# DB_NAME=hrms_db

# Run database migrations and seed data
npm run seed

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 4. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:3000`

## 🎯 Usage

### First Time Setup

1. **Access the Application**
   - Open your browser and navigate to `http://localhost:3000`

2. **Demo Login** (if you ran the seed script)
   - Email: `admin@demo.com`
   - Password: `admin123`

3. **Or Create New Organisation**
   - Click "Create Organisation" on the login page
   - Fill in your organisation details
   - Create your admin account

### Managing Employees

1. Navigate to **Employees** from the sidebar
2. Click **"Add Employee"** button
3. Fill in employee details (First Name, Last Name, Email, Phone)
4. Click **"Create Employee"**
5. Edit or delete employees using the action buttons on each card

### Managing Teams

1. Navigate to **Teams** from the sidebar
2. Click **"Create Team"** button
3. Enter team name and description
4. Click **"Create Team"**

### Assigning Employees to Teams

1. On the Teams page, click **"Assign"** button on any team
2. Select employees from the list (checkboxes)
3. Click **"Assign Selected"**
4. Remove employees by clicking the **X** button next to their name

### Viewing Activity Logs

- Dashboard shows recent activity
- All operations are automatically logged with timestamps

## 📁 Project Structure

```
hrms/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── employeeController.js
│   │   │   └── teamController.js
│   │   ├── middlewares/      # Auth & error handling
│   │   │   ├── authMiddleware.js
│   │   │   └── errorHandler.js
│   │   ├── models/           # Database models
│   │   │   ├── organisation.js
│   │   │   ├── user.js
│   │   │   ├── employee.js
│   │   │   ├── team.js
│   │   │   ├── employeeTeam.js
│   │   │   ├── log.js
│   │   │   └── index.js
│   │   ├── routes/           # API routes
│   │   │   ├── auth.js
│   │   │   ├── employees.js
│   │   │   └── teams.js
│   │   ├── db.js            # Database connection
│   │   ├── index.js         # Server entry point
│   │   └── seed.js          # Database seeder
│   ├── .env                 # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── RegisterOrg.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Employees.jsx
│   │   │   └── Teams.jsx
│   │   ├── components/      # Reusable components
│   │   │   ├── Layout.jsx
│   │   │   ├── EmployeeForm.jsx
│   │   │   └── TeamForm.jsx
│   │   ├── services/        # API services
│   │   │   └── api.js
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create organisation and admin user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout (protected)
- `GET /api/auth/me` - Get current user (protected)

### Employees
- `GET /api/employees` - List all employees (protected)
- `GET /api/employees/:id` - Get single employee (protected)
- `POST /api/employees` - Create employee (protected)
- `PUT /api/employees/:id` - Update employee (protected)
- `DELETE /api/employees/:id` - Delete employee (protected)

### Teams
- `GET /api/teams` - List all teams (protected)
- `GET /api/teams/:id` - Get single team (protected)
- `POST /api/teams` - Create team (protected)
- `PUT /api/teams/:id` - Update team (protected)
- `DELETE /api/teams/:id` - Delete team (protected)
- `POST /api/teams/:teamId/assign` - Assign employees to team (protected)
- `DELETE /api/teams/:teamId/unassign/:employeeId` - Remove employee from team (protected)
- `GET /api/teams/logs/all` - Get activity logs (protected)

## 🗄️ Database Schema

### Tables

**organisations**
- id (Primary Key)
- name
- created_at

**users**
- id (Primary Key)
- organisation_id (Foreign Key)
- email (Unique)
- password_hash
- name
- created_at

**employees**
- id (Primary Key)
- organisation_id (Foreign Key)
- first_name
- last_name
- email
- phone
- created_at

**teams**
- id (Primary Key)
- organisation_id (Foreign Key)
- name
- description
- created_at

**employee_teams** (Join Table)
- id (Primary Key)
- employee_id (Foreign Key)
- team_id (Foreign Key)
- assigned_at

**logs**
- id (Primary Key)
- organisation_id
- user_id
- action
- meta (JSONB)
- timestamp

## 🎨 UI Features

- **Modern Design** - Clean, professional interface
- **Smooth Animations** - Framer Motion powered transitions
- **Responsive Layout** - Mobile-first design approach
- **Dark Mode Ready** - Easy to implement dark theme
- **Toast Notifications** - Real-time feedback for user actions
- **Loading States** - Skeleton screens and spinners
- **Form Validation** - Client and server-side validation
- **Search Functionality** - Filter employees and teams
- **Modal Dialogs** - Smooth modal transitions

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token authentication
- Protected API routes
- Organisation-level data isolation
- SQL injection prevention (Sequelize ORM)
- XSS protection
- CORS configuration
- Environment variable protection

## 🚀 Production Deployment

### Backend Deployment (Heroku/Render/Railway)

1. Set environment variables:
```bash
PORT=5000
NODE_ENV=production
DB_HOST=your_db_host
DB_PORT=5432
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_secure_jwt_secret
```

2. Build and deploy:
```bash
npm start
```

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder

3. Set environment variable:
```bash
VITE_API_BASE_URL=https://your-backend-url.com/api
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Create, read, update, delete employees
- [ ] Create, read, update, delete teams
- [ ] Assign employees to teams
- [ ] Remove employees from teams
- [ ] View activity logs
- [ ] Logout functionality
- [ ] Responsive design on mobile
- [ ] Form validation
- [ ] Error handling

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=hrms_db
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=8h
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for the HRMS Full-Stack Developer Assignment

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists: `psql -U postgres -l`

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 3000 (frontend)
npx kill-port 3000
```

### Module Not Found Errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- Ensure backend is running on port 5000
- Check CORS configuration in `backend/src/index.js`

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Happy Coding! 🎉**
