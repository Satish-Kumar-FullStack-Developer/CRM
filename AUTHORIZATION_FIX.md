# 403 Forbidden Error Fix - Role-Based Authorization

## Problem
When adding leads, tasks, or deals, you get a **403 Forbidden** error with message "no permission for lead".

## Root Cause
The CRM system uses role-based access control (RBAC). Users need:
1. ✅ A valid authentication token
2. ✅ An assigned role (Admin, Manager, Sales Rep, Support Agent, Viewer)
3. ✅ That role must have permissions for the resource (leads, deals, tasks, etc.)

If any of these are missing, the API returns a 403 error.

## Solution

### Step 1: Seed Default Roles (One-time Setup)

Run this command to initialize roles and permissions in your database:

```bash
cd server
node scripts/seedRoles.js
```

**Expected Output:**
```
🌱 Starting database seed for roles...
✓ Cleared existing roles
✓ Created 5 roles:
  - Admin
  - Manager
  - Sales Rep
  - Support Agent
  - Viewer
✓ Assigned existing users to Sales Rep role
✅ Database seed completed successfully!
```

### Step 2: Log Out and Log Back In

After seeding roles:

1. **Logout** from the application
2. **Refresh** the page (Ctrl + R / Cmd + R)
3. **Log back in** with your credentials

The system will now:
- Verify your authentication token
- Assign you the "Sales Rep" role (or the role configured for your account)
- Grant you permissions based on that role

### Step 3: Verify It Works

Try creating a new lead/task/deal. It should work without 403 errors.

## Understanding Roles and Permissions

| Role | Leads | Deals | Tasks | Reports | Users | Settings |
|------|-------|-------|-------|---------|-------|----------|
| **Admin** | ✅ Full | ✅ Full | ✅ Full | ✅ R,E | ✅ Full | ✅ Manage |
| **Manager** | ✅ C,R,U | ✅ C,R,U | ✅ C,R,U | ✅ R,E | ✅ R,U | ❌ |
| **Sales Rep** | ✅ C,R,U | ✅ C,R,U | ✅ C,R,U | ✅ R | ❌ | ❌ |
| **Support Agent** | ✅ R,U | ✅ R | ✅ C,R,U | ✅ R | ❌ | ❌ |
| **Viewer** | ✅ R | ✅ R | ✅ R | ✅ R | ❌ | ❌ |

**Legend:** C=Create, R=Read, U=Update, D=Delete, E=Export, M=Manage

## How It Works (Technical Details)

### Frontend Flow:
```
User Logs In
    ↓
Token stored in localStorage
    ↓
Thunk action creates API request
    ↓
apiClient adds "Authorization: Bearer {token}" header
    ↓
Request sent to backend
```

### Backend Flow:
```
Request received with token
    ↓
authenticate middleware verifies JWT token
    ↓
User loaded from database with populated role
    ↓
authorize middleware checks role permissions
    ↓
If role has permission → ✅ Request processed
If role lacks permission → ❌ 403 Forbidden returned
```

## Troubleshooting

### Still Getting 403 After Seeding?

**1. Check if you're logged in:**
```bash
# In browser console
console.log(localStorage.getItem('token'));
```
If empty → You're not authenticated, log in again.

**2. Check if token is being sent:**
```bash
# In Network tab:
# Look at the request headers for your API call
# Should see: Authorization: Bearer eyJ...
```
If missing → apiClient interceptor not working, check `src/services/apiClient.js`

**3. Check user has a role:**
```bash
# In MongoDB shell
db.users.findOne({email: "your-email@example.com"}, {role: 1})
# Should show a role ID, not null
```

### Custom Role Setup

To assign users to different roles, use MongoDB directly:

```bash
# Find available roles
db.roles.find({}, {name: 1})

# Assign user to Admin role
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: ObjectId("role-id-here") } }
)
```

## Files Modified

- `server/scripts/seedRoles.js` - New seed script
- `server/src/middleware/authenticate.js` - Auto-assign roles to users without roles

## Next Steps

Once roles are working:

1. ✅ Create leads/tasks/deals without errors
2. ✅ Data persists to database
3. ✅ Different roles have different access levels
4. 📋 (Optional) Set up user management page to assign roles
5. 📋 (Optional) Create admin panel for permission management

---

**Status:** ✅ Authorization system is now fully functional!
