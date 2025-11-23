# CRM System - Architecture & Design Patterns

## System Architecture

### Overall System Design

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ React Components (Leads, Deals, Tasks, Reports)     │  │
│  └─────────────────┬──────────────────────────────────┘   │
│                    │ Redux State Management                  │
│  ┌─────────────────▼──────────────────────────────────┐   │
│  │ Redux Store (authSlice, leadSlice, dealSlice...)  │   │
│  └─────────────────┬──────────────────────────────────┘   │
│                    │ Axios HTTP Client                      │
└────────────────────┼──────────────────────────────────────┘
                     │ REST API Calls
┌────────────────────▼──────────────────────────────────────┐
│                   API GATEWAY LAYER                        │
│  - Rate Limiting (100 req/15min)                          │
│  - CORS Protection                                         │
│  - Authentication Middleware (JWT)                         │
│  - Authorization Middleware (RBAC)                         │
│  - Request Validation                                      │
└────────────────────┬──────────────────────────────────────┘
                     │
┌────────────────────▼──────────────────────────────────────┐
│                 BUSINESS LOGIC LAYER                       │
│  ┌──────────┬──────────┬──────────┬──────────┐           │
│  │ Auth     │ Lead     │ Deal     │ Task     │           │
│  │ Service  │ Service  │ Service  │ Service  │           │
│  │          │          │          │          │           │
│  │ - Hash   │ - CRUD   │ - CRUD   │ - CRUD   │           │
│  │ - JWT    │ - Filter │ - Filter │ - Filter │           │
│  │ - Role   │ - Stats  │ - Stats  │ - Stats  │           │
│  │ - Perms  │          │          │          │           │
│  └──────────┴──────────┴──────────┴──────────┘           │
│  ┌──────────┬────────────────┬──────────────┐            │
│  │ Report   │ Email Service  │ Analytics    │            │
│  │ Service  │                │ Service      │            │
│  └──────────┴────────────────┴──────────────┘            │
└────────────────────┬──────────────────────────────────────┘
                     │
┌────────────────────▼──────────────────────────────────────┐
│               DATA ACCESS LAYER                           │
│  ┌──────────┬──────────┬──────────┬──────────┐           │
│  │ User     │ Lead     │ Deal     │ Task     │           │
│  │ Model    │ Model    │ Model    │ Model    │           │
│  │          │          │          │          │           │
│  │ - Schema │ - Schema │ - Schema │ - Schema │           │
│  │ - Hooks  │ - Index  │ - Index  │ - Index  │           │
│  │ - Queries│ - Methods│ - Methods│ - Methods│           │
│  └──────────┴──────────┴──────────┴──────────┘           │
│  ┌──────────┬────────────────┬──────────────┐            │
│  │ Role     │ Activity       │ Report       │            │
│  │ Model    │ Model          │ Model        │            │
│  └──────────┴────────────────┴──────────────┘            │
└────────────────────┬──────────────────────────────────────┘
                     │ Mongoose ODM
┌────────────────────▼──────────────────────────────────────┐
│              DATABASE LAYER                               │
│  ┌─────────────────────────────────────────────────┐    │
│  │         MongoDB (Collections)                   │    │
│  │  - users, leads, deals, tasks, roles, etc     │    │
│  └─────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
```

## Design Patterns Used

### 1. Model-View-Controller (MVC)
- **Models**: MongoDB schemas (User, Lead, Deal, Task, etc.)
- **Views**: React components displaying data
- **Controllers**: Handle HTTP requests and responses

```
Routes → Controllers → Services → Models → Database
```

### 2. Service Layer Pattern
Separates business logic from controllers for reusability and testability.

```javascript
// Controller
app.post('/leads', async (req, res) => {
  const lead = await leadService.createLead(req.body);
  res.json(lead);
});

// Service
class LeadService {
  async createLead(leadData) {
    // Business logic here
  }
}
```

### 3. Repository Pattern
Abstracts data access logic through models.

```javascript
// Instead of direct DB calls in controllers
const lead = await Lead.findById(id);

// Business logic is isolated in services
async getLead(id) {
  return await Lead.findById(id).populate('assignedTo');
}
```

### 4. Middleware Pipeline Pattern
Chain of responsibility for request processing.

```
Request → Security (Helmet) 
        → CORS 
        → Rate Limiter 
        → Body Parser 
        → Authentication 
        → Authorization 
        → Validation 
        → Route Handler
        → Error Handler 
        → Response
```

### 5. Redux State Management Pattern
Centralized state management for React.

```javascript
// Action → Reducer → Store → Component
dispatch(fetchLeadsStart());
→ leadSlice reducer updates state
→ Components subscribe to changes
→ UI re-renders
```

### 6. Factory Pattern
Creating objects (components, services) dynamically.

```javascript
// Reusable Button component factory
const Button = ({ variant, size, ...props }) => {
  const styles = getButtonStyles(variant, size);
  return <button style={styles} {...props} />;
};
```

### 7. Observer Pattern
React components observe Redux store changes.

```javascript
const { leads } = useSelector(state => state.leads);
// Component re-renders when leads change
```

### 8. Singleton Pattern
Logger and configuration instances.

```javascript
// Created once, used everywhere
const logger = winston.createLogger({...});
module.exports = logger;
```

## Code Organization

### Backend Structure
```
server/
├── src/
│   ├── config/
│   │   ├── config.js          # Environment config
│   │   └── database.js        # MongoDB connection
│   ├── models/                # Data schemas
│   │   ├── User.js
│   │   ├── Lead.js
│   │   ├── Deal.js
│   │   └── Task.js
│   ├── controllers/           # Request handlers
│   │   ├── authController.js
│   │   ├── leadController.js
│   │   └── dealController.js
│   ├── services/              # Business logic
│   │   ├── authService.js
│   │   ├── leadService.js
│   │   ├── emailService.js
│   │   └── reportService.js
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── leadRoutes.js
│   │   └── dealRoutes.js
│   ├── middleware/            # Request processing
│   │   ├── authenticate.js    # JWT validation
│   │   ├── authorize.js       # RBAC
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── utils/                 # Helper functions
│   │   ├── logger.js          # Logging
│   │   ├── jwt.js             # JWT operations
│   │   ├── encryption.js      # Data encryption
│   │   └── password.js        # Password hashing
│   ├── validators/            # Input validation
│   │   ├── validators.js
│   │   └── validate.js
│   └── index.js               # App entry point
```

### Frontend Structure
```
client/
├── src/
│   ├── components/            # Reusable components
│   │   ├── UI.js             # Basic UI (Button, Card, Input)
│   │   ├── Navbar.js
│   │   ├── LoadingSpinner.js
│   │   └── PrivateRoute.js
│   ├── pages/                 # Page components
│   │   ├── LoginPage.js
│   │   ├── Dashboard.js
│   │   ├── LeadsPage.js
│   │   └── DealsPage.js
│   ├── redux/                 # State management
│   │   ├── store.js           # Redux store
│   │   ├── authSlice.js
│   │   ├── leadSlice.js
│   │   └── dealSlice.js
│   ├── services/              # API clients
│   │   ├── apiClient.js       # Axios instance
│   │   ├── authService.js
│   │   ├── leadService.js
│   │   └── dealService.js
│   ├── hooks/                 # Custom hooks
│   │   ├── useForm.js         # Form handling
│   │   ├── useAsync.js        # Async operations
│   │   └── usePagination.js
│   ├── utils/                 # Utilities
│   │   ├── validators.js      # Input validation
│   │   ├── formatters.js      # Data formatting
│   │   └── dateFormatter.js
│   ├── constants/             # App constants
│   │   └── index.js
│   ├── styles/                # CSS
│   │   └── global.css
│   ├── App.js                 # Main component
│   └── index.js               # React entry
```

## Data Flow

### Authentication Flow
```
User Input → Login Form
         ↓
authService.login(email, password)
         ↓
API POST /auth/login
         ↓
authController.login()
         ↓
authService.login() (verify credentials)
         ↓
JWT generated
         ↓
loginSuccess(user, token)
         ↓
Redux Store Updated
         ↓
Token stored in localStorage
         ↓
Redirect to Dashboard
```

### Lead Creation Flow
```
User Input → Create Lead Form
         ↓
leadService.createLead(leadData)
         ↓
API POST /leads
         ↓
authenticate middleware (verify JWT)
         ↓
authorize middleware (check permission)
         ↓
validate middleware (validate input)
         ↓
leadController.createLead()
         ↓
leadService.createLead()
         ↓
Lead.create() (save to MongoDB)
         ↓
emailService.sendNotification()
         ↓
Response returned
         ↓
Redux action: addLead()
         ↓
UI updated with new lead
```

## Security Architecture

```
┌─────────────────────────────────────────┐
│         Security Layers                 │
├─────────────────────────────────────────┤
│ 1. HTTPS/TLS (Transport)               │
│    - Encrypted data transmission        │
├─────────────────────────────────────────┤
│ 2. CORS Configuration                  │
│    - Restrict cross-origin requests     │
├─────────────────────────────────────────┤
│ 3. Rate Limiting                       │
│    - Prevent brute force attacks        │
├─────────────────────────────────────────┤
│ 4. Helmet Security Headers             │
│    - Prevent XSS, clickjacking, etc    │
├─────────────────────────────────────────┤
│ 5. JWT Authentication                  │
│    - Token-based auth                  │
├─────────────────────────────────────────┤
│ 6. Role-Based Access Control (RBAC)   │
│    - Permission checks                 │
├─────────────────────────────────────────┤
│ 7. Input Validation                    │
│    - Validate all inputs               │
├─────────────────────────────────────────┤
│ 8. Password Hashing (bcryptjs)         │
│    - One-way encryption                │
├─────────────────────────────────────────┤
│ 9. Data Encryption                     │
│    - AES-256 for sensitive data        │
├─────────────────────────────────────────┤
│ 10. Logging & Monitoring               │
│     - Track all activities             │
└─────────────────────────────────────────┘
```

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers
- Load balancer (Nginx/HAProxy)
- Multiple database replicas
- Caching layer (Redis)

### Vertical Scaling
- Database indexing
- Query optimization
- Connection pooling
- Code optimization

### Performance Optimization
- API response caching
- Database query pagination
- Lazy loading components
- Code splitting in React
- Asset compression

## Error Handling Strategy

```
Error Occurs
         ↓
Try-Catch Block
         ↓
Log Error (Winston Logger)
         ↓
Format Error Response
         ↓
Send to Error Handler Middleware
         ↓
Generate HTTP Response
         ↓
Send to Client
         ↓
Display Toast Notification (Frontend)
```

## Testing Strategy

### Unit Tests
- Service functions
- Utility functions
- Validators

### Integration Tests
- API endpoints
- Database operations
- Middleware chains

### E2E Tests
- User workflows
- Component interactions
- Full application flows

---

This architecture ensures scalability, maintainability, security, and performance.
