# CRM System - Client Management Tool

A comprehensive MERN stack Customer Relationship Management (CRM) system with leads, deals, pipeline, tasks, reminders, email integration, user roles, and advanced analytics.

## Features

### 🎯 Core Features
- **Leads Management** - Track and manage sales leads with status, scores, and sources
- **Deal Pipeline** - Visual sales pipeline with stages (Prospecting → Closed Won/Lost)
- **Task Management** - Create, assign, and track tasks with reminders
- **Email Integration** - Send emails, templates, and automated notifications
- **User Roles & Permissions** - Role-based access control (Admin, Manager, Sales Rep, etc.)
- **Reports & Analytics** - Comprehensive dashboards, sales pipeline, performance metrics
- **Activity Tracking** - Track all interactions and activities
- **Team Collaboration** - Assign deals/tasks, add notes, share information

### 🔒 Security Features
- JWT authentication with token-based authorization
- Role-based access control (RBAC)
- Password hashing with bcryptjs
- Data encryption for sensitive information
- CORS protection
- Rate limiting on API endpoints
- SQL injection prevention through proper validation
- XSS protection
- Input validation and sanitization

## Project Structure

```
CRM-System/
├── server/                 # Backend (Node.js/Express)
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── models/        # MongoDB schemas
│   │   ├── controllers/   # Business logic
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth, validation, error handling
│   │   ├── services/      # Business services
│   │   ├── validators/    # Input validation
│   │   ├── utils/         # Utilities (encryption, JWT, logger)
│   │   └── index.js       # Express app entry point
│   ├── .env.example       # Environment variables template
│   └── package.json       # Dependencies
│
├── client/                # Frontend (React)
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # State management slices
│   │   ├── services/      # API service clients
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   ├── constants/     # App constants
│   │   ├── styles/        # CSS styles
│   │   ├── App.js         # Main app component
│   │   └── index.js       # React entry point
│   ├── public/            # Static files
│   └── package.json       # Dependencies
│
└── shared/                # Shared utilities (optional)
```

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Joi
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston
- **Task Scheduling**: node-cron

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Notifications**: React Toastify

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to server directory**
```bash
cd server
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
cp .env.example .env
```

4. **Configure environment variables** in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/crm-system
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRY=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:3000

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
SMTP_FROM_EMAIL=noreply@crmsystem.com
SMTP_FROM_NAME=CRM System
```

5. **Create MongoDB Database**
- Local: Start MongoDB server
- Cloud: Use MongoDB Atlas

6. **Start the server**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**
```bash
cd client
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start the development server**
```bash
npm start
```

App will open at `http://localhost:3000`

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "department": "Sales"
}

Response: { success: true, user: {...}, token: "..." }
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: { success: true, user: {...}, token: "..." }
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer {token}

Response: { success: true, data: {...} }
```

### Leads Endpoints

```http
GET    /api/leads                    # Get all leads (paginated)
GET    /api/leads/:id               # Get lead by ID
GET    /api/leads/statistics        # Get lead statistics
POST   /api/leads                   # Create new lead
PUT    /api/leads/:id               # Update lead
DELETE /api/leads/:id               # Delete lead
```

### Deals Endpoints

```http
GET    /api/deals                   # Get all deals (paginated)
GET    /api/deals/:id               # Get deal by ID
GET    /api/deals/pipeline/summary  # Get pipeline summary
POST   /api/deals                   # Create new deal
PUT    /api/deals/:id               # Update deal
DELETE /api/deals/:id               # Delete deal
```

### Tasks Endpoints

```http
GET    /api/tasks                   # Get all tasks (paginated)
GET    /api/tasks/:id               # Get task by ID
GET    /api/tasks/statistics        # Get task statistics
POST   /api/tasks                   # Create new task
PUT    /api/tasks/:id               # Update task
PATCH  /api/tasks/:id/complete      # Mark task as complete
POST   /api/tasks/:id/notes         # Add note to task
DELETE /api/tasks/:id               # Delete task
```

### Reports Endpoints

```http
GET /api/reports/dashboard          # Dashboard analytics
GET /api/reports/pipeline           # Sales pipeline report
GET /api/reports/conversion         # Lead conversion report
GET /api/reports/deals              # Deal analytics report
GET /api/reports/team               # Team performance report
```

## Design Patterns & Best Practices

### Backend Patterns
- **MVC Pattern**: Models, Controllers, Routes
- **Service Layer Pattern**: Business logic separation
- **Repository Pattern**: Data access abstraction
- **Middleware Pattern**: Request/response processing
- **Validator Pattern**: Input validation
- **Error Handling**: Centralized error middleware
- **Logging**: Winston logger for debugging

### Frontend Patterns
- **Component Composition**: Reusable, composable components
- **Redux Pattern**: Centralized state management
- **Custom Hooks**: Logic reusability
- **Service Layer**: API abstraction
- **Factory Pattern**: Component factory functions

### Security Best Practices
- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ Role-based access control
- ✅ Rate limiting on API endpoints
- ✅ CORS configuration
- ✅ Helmet for HTTP headers
- ✅ Input validation and sanitization
- ✅ Data encryption for sensitive fields
- ✅ Secure HTTP-only cookies (for tokens)
- ✅ Environment variables for secrets

## Database Schema

### User Schema
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: ObjectId (ref: Role),
  department: String,
  isActive: Boolean,
  lastLogin: Date,
  loginAttempts: Number,
  lockUntil: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Lead Schema
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  company: String,
  status: Enum ['New', 'Contacted', 'Qualified', 'Unqualified', 'Lost'],
  source: Enum ['Website', 'Email', 'Phone', 'Referral', ...],
  leadScore: Number (0-100),
  assignedTo: ObjectId (ref: User),
  convertedToDeal: ObjectId (ref: Deal),
  activities: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Deal Schema
```javascript
{
  title: String,
  value: Number,
  currency: String,
  stage: Enum ['Prospecting', 'Qualification', 'Proposal', ...],
  probability: Number (0-100),
  owner: ObjectId (ref: User),
  lead: ObjectId (ref: Lead),
  collaborators: [ObjectId],
  expectedCloseDate: Date,
  actualCloseDate: Date,
  status: Enum ['Active', 'Won', 'Lost', 'Stuck'],
  createdAt: Date,
  updatedAt: Date
}
```

### Task Schema
```javascript
{
  title: String,
  type: Enum ['Call', 'Email', 'Meeting', 'Follow-up', 'Other'],
  status: Enum ['Open', 'In Progress', 'Completed', 'Cancelled'],
  priority: Enum ['Low', 'Medium', 'High', 'Urgent'],
  dueDate: Date,
  assignedTo: ObjectId (ref: User),
  assignedBy: ObjectId (ref: User),
  lead: ObjectId (ref: Lead),
  deal: ObjectId (ref: Deal),
  notes: [{content, author, timestamp}],
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Variables

### Server (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/crm-system
MONGODB_USER=crm_user
MONGODB_PASSWORD=secure_password

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRY=7d

# Security
BCRYPT_ROUNDS=10
ENCRYPTION_KEY=your_encryption_key_32_chars

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=app-specific-password
SMTP_FROM_EMAIL=noreply@crmsystem.com
SMTP_FROM_NAME=CRM System

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

### Client (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

### Production Build

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
```

## Testing

### Backend
```bash
cd server
npm test
```

### Frontend
```bash
cd client
npm test
```

## Performance Optimization

- Database indexing on frequently queried fields
- Pagination for large datasets
- Caching strategies with Redis (optional)
- React lazy loading and code splitting
- Image optimization
- Bundle size optimization

## Deployment

### Heroku (Backend)
1. Create Heroku account and install CLI
2. `heroku login`
3. `heroku create app-name`
4. Set environment variables: `heroku config:set JWT_SECRET=...`
5. `git push heroku main`

### Vercel (Frontend)
1. Connect GitHub repository
2. Set environment variables in Vercel dashboard
3. Auto-deploys on git push

## Troubleshooting

### MongoDB Connection Error
- Verify MongoDB is running
- Check connection string in .env
- Ensure firewall allows connections

### JWT Token Errors
- Regenerate token
- Check token expiry in .env
- Clear localStorage and re-login

### CORS Issues
- Verify CORS_ORIGIN in server .env
- Check client API URL in .env

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

## License

MIT License - feel free to use this project

## Support

For issues and questions, please open an issue on GitHub or contact the development team.

---

**Happy CRM-ing! 🚀**
# CRM
