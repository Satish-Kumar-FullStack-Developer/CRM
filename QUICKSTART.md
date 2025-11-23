# Quick Start Guide

## 5-Minute Setup

### 1. Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm run dev
```

### 2. Setup Frontend
```bash
cd client
npm install
npm start
```

### 3. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### 4. Login/Register
- Create an account at /register
- Or login with test credentials

## Common Commands

### Backend
```bash
npm run dev        # Start development server
npm start          # Start production server
npm test           # Run tests
```

### Frontend
```bash
npm start          # Start development server
npm run build      # Create production build
npm test           # Run tests
```

## Project Features Implemented

✅ User Authentication & Authorization
✅ Leads Management with CRM Features
✅ Deal Pipeline Management
✅ Task Management with Reminders
✅ Email Integration
✅ Role-Based Access Control
✅ Reports & Analytics Dashboard
✅ Activity Tracking
✅ Data Encryption & Security
✅ Rate Limiting
✅ Comprehensive Error Handling
✅ Logging System
✅ Reusable Components
✅ Redux State Management
✅ RESTful API Design

## Key Files

### Backend
- `server/src/index.js` - Express app
- `server/src/config/database.js` - DB connection
- `server/src/models/*` - MongoDB schemas
- `server/src/services/*` - Business logic
- `server/src/middleware/*` - Auth, validation

### Frontend
- `client/src/App.js` - Main component
- `client/src/redux/*` - State management
- `client/src/services/*` - API clients
- `client/src/components/*` - Reusable UI
- `client/src/pages/*` - Page components

## Next Steps

1. Configure email service (SMTP or SendGrid)
2. Set up MongoDB Atlas for cloud database
3. Create API documentation with Swagger
4. Add unit and integration tests
5. Deploy to Heroku/Vercel
6. Add real-time notifications with Socket.io
7. Implement file upload (AWS S3)
8. Add export to PDF/Excel functionality

## Architecture Overview

```
┌─────────────────────────────────────────┐
│            React Frontend               │
│  (Redux, React Router, Components)      │
└─────────────────┬───────────────────────┘
                  │ Axios
                  ▼
┌─────────────────────────────────────────┐
│      Express.js Backend API             │
│  (Controllers, Services, Middleware)    │
└─────────────────┬───────────────────────┘
                  │ Mongoose ODM
                  ▼
┌─────────────────────────────────────────┐
│         MongoDB Database                │
│  (Users, Leads, Deals, Tasks, etc)     │
└─────────────────────────────────────────┘
```

## Security Checklist

- ✅ JWT Authentication
- ✅ Password Hashing (bcryptjs)
- ✅ Data Encryption
- ✅ Rate Limiting
- ✅ CORS Protection
- ✅ Helmet Security Headers
- ✅ Input Validation
- ✅ Role-Based Access Control
- ✅ Environment Variables
- ✅ Error Handling

## Support & Resources

- Express.js: https://expressjs.com/
- React: https://react.dev/
- Redux: https://redux.js.org/
- MongoDB: https://www.mongodb.com/
- JWT: https://jwt.io/

---

For detailed documentation, see README.md in the root directory.
