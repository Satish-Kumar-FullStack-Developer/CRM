# Setup Instructions & Development Guide

## Getting Started

### Prerequisites
- Node.js v14+ and npm
- MongoDB (local or MongoDB Atlas)
- Git
- Code editor (VS Code recommended)

## Step 1: Clone/Extract Project

```bash
cd CRM-System
```

## Step 2: Backend Setup

### 2.1 Install Dependencies
```bash
cd server
npm install
```

### 2.2 Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/crm-system
JWT_SECRET=your_super_secret_key_here_change_this
JWT_EXPIRY=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:3000

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=app-specific-password
SMTP_FROM_EMAIL=noreply@crmsystem.com
SMTP_FROM_NAME=CRM System

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### 2.3 Start MongoDB

**Windows (Local MongoDB):**
```bash
mongod
```

**Or use MongoDB Atlas:**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster and get connection string
3. Update MONGODB_URI in .env

### 2.4 Start Backend Server
```bash
npm run dev
```

Expected output:
```
[info] CRM Server started on port 5000
[info] Environment: development
[info] MongoDB connected successfully
```

## Step 3: Frontend Setup

### 3.1 Install Dependencies
```bash
cd client
npm install
```

### 3.2 Create Environment File
```bash
# .env file already configured in package.json proxy
# Default API URL: http://localhost:5000
```

### 3.3 Start Frontend Development Server
```bash
npm start
```

Browser will open automatically to `http://localhost:3000`

## Step 4: First Run

### 4.1 Create Account
1. Go to http://localhost:3000/register
2. Fill in details:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: password123
   - Department: Sales
3. Click "Create Account"

### 4.2 Login
1. You'll be redirected to dashboard
2. Or go to http://localhost:3000/login
3. Enter credentials

### 4.3 Explore Features
- Dashboard: View analytics overview
- Leads: Add and manage leads
- Deals: Create and track deals
- Tasks: Assign and track tasks
- Reports: View detailed analytics

## Advanced Setup

### Using Docker

```bash
# Build and start all services
docker-compose up -d

# Access services:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# MongoDB: localhost:27017

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

### Email Configuration

#### Using Gmail:
1. Enable 2-Factor Authentication
2. Create App Password: https://myaccount.google.com/apppasswords
3. Use App Password in SMTP_PASSWORD

#### Using SendGrid:
1. Install SendGrid: `npm install @sendgrid/mail`
2. Update emailService.js
3. Add API key to .env

#### Using Nodemailer (Any Email Provider):
```env
SMTP_HOST=smtp.provider.com
SMTP_PORT=587
SMTP_USER=your-email@provider.com
SMTP_PASSWORD=your-password
```

## Development Workflow

### Terminal Setup (Recommended)

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

### Code Changes

- **Backend changes**: Auto-reloads with nodemon
- **Frontend changes**: Auto-reloads with React dev server
- **Database changes**: Manual restart if schema updated

## Testing

### Test Backend
```bash
cd server
npm test
```

### Test Frontend
```bash
cd client
npm test
```

### Manual API Testing

**Using curl:**
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Using Postman:**
1. Import API collection from API_COLLECTION.md
2. Set environment variables
3. Test endpoints

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:**
- Ensure MongoDB is running
- Check connection string in .env
- Verify MongoDB port (default: 27017)

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### JWT Token Error
```
Error: Invalid token
```
**Solution:**
- Check JWT_SECRET is set in .env
- Try logging in again
- Clear browser storage: localStorage.clear()

### CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:**
- Verify CORS_ORIGIN in server .env
- Ensure client is on correct port
- Restart backend server

### Email Not Sending
**Solution:**
- Check SMTP credentials
- Verify email provider allows SMTP
- Check email logs in Winston logger
- Test with different email provider

## Performance Tips

### Backend
- Enable query caching with Redis
- Add database indexes
- Use connection pooling
- Implement API rate limiting

### Frontend
- Use React.memo for components
- Lazy load pages with React.lazy
- Optimize bundle size
- Use production build

## Production Deployment

### Environment Variables (Production)
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/crm-system
JWT_SECRET=use_very_strong_secret_key_here
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=warn
```

### Backend Deployment (Heroku)
```bash
cd server
heroku login
heroku create app-name
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Frontend Deployment (Vercel)
```bash
# Connect GitHub repo to Vercel
# Set environment variables in dashboard
# Auto-deploys on push
```

## Useful Commands

### Backend
```bash
npm run dev          # Development mode
npm start            # Production mode
npm test             # Run tests
npm run lint         # Lint code
```

### Frontend
```bash
npm start            # Development server
npm run build        # Production build
npm test             # Run tests
npm run eject        # Advanced config (not recommended)
```

## Project Structure Quick Reference

```
CRM-System/
├── server/          ← Backend (Express)
├── client/          ← Frontend (React)
├── README.md        ← Full documentation
├── QUICKSTART.md    ← Quick setup
├── ARCHITECTURE.md  ← System design
├── API_COLLECTION.md ← API docs
└── docker-compose.yml ← Docker setup
```

## Common Tasks

### Add New Endpoint
1. Create model in `server/src/models/`
2. Create service in `server/src/services/`
3. Create controller in `server/src/controllers/`
4. Create routes in `server/src/routes/`
5. Add to `server/src/index.js`

### Add New Page
1. Create component in `client/src/pages/`
2. Add route in `client/src/App.js`
3. Add Redux slice if needed
4. Add service if API calls needed

### Add Security
- Always validate input
- Hash passwords with bcryptjs
- Encrypt sensitive data
- Check user permissions
- Use environment variables for secrets

## Resources

- Express.js: https://expressjs.com
- React: https://react.dev
- Redux: https://redux.js.org
- MongoDB: https://www.mongodb.com
- Mongoose: https://mongoosejs.com
- JWT: https://jwt.io
- Axios: https://axios-http.com

## Support

For issues:
1. Check README.md and ARCHITECTURE.md
2. Review error logs
3. Check API_COLLECTION.md for examples
4. Search project documentation

---

**You're all set! Start developing your CRM system now.** 🚀

Questions? Check the documentation files or the code comments for guidance.
