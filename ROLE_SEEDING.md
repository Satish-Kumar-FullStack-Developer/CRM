# Role Seeding - Data Retrieval Fix

## Problem Identified

The application was showing all zeros for leads, deals, and tasks because:

1. **Missing Role Permissions**: The Role model exists in the database but the default roles (Admin, Manager, Sales Rep, Support Agent, Viewer) were not properly seeded with their permissions.

2. **Authorization Blocking Requests**: When users logged in, they were auto-assigned a role (e.g., Sales Rep), but that role had undefined permissions in the database. The authorization middleware checks `user.role.permissions[resource][action]` and denies access when permissions are undefined/false.

3. **Result**: API calls to GET /leads, /deals, /tasks returned empty arrays or 403 Forbidden errors because the authorization checks failed.

## Solution Implemented

### 1. Created Role Initialization Function
**File**: `server/src/config/initRoles.js`
- Defines all 5 default roles with complete permission structures
- Runs automatically when the server starts
- Only creates roles if they don't already exist (safe to restart server)
- Permissions are set per resource and action:
  - **Admin**: All permissions = true
  - **Manager**: Most permissions = true (except settings.manage and user deletion)
  - **Sales Rep**: Full access to leads/deals/tasks, read-only reports
  - **Support Agent**: Read-only leads/deals, full task access
  - **Viewer**: Read-only access to all resources

### 2. Created Seed Script
**File**: `server/src/scripts/seedRoles.js`
- Standalone script to manually seed roles
- Clears existing roles and inserts fresh ones (use with caution)
- Run with: `npm run seed:roles`
- Useful for resetting to default state

### 3. Updated Server Initialization
**File**: `server/src/index.js`
- Added import: `const { initializeRoles } = require('./config/initRoles');`
- Calls `initializeRoles()` after database connection
- Ensures roles are available before server starts accepting requests

### 4. Added NPM Script
**File**: `server/package.json`
- Added script: `"seed:roles": "node src/scripts/seedRoles.js"`
- Allows running seed from command line: `npm run seed:roles`

## How It Works

### Automatic Initialization (Recommended)
When you start the server:
```bash
npm run dev  # or npm start
```

The server will:
1. Connect to MongoDB
2. Check if roles exist in the database
3. If not, automatically create all 5 default roles with proper permissions
4. Start accepting requests

### Manual Seeding (Optional)
If you want to reset roles to default:
```bash
npm run seed:roles
```

This will:
1. Connect to MongoDB
2. Clear all existing roles
3. Insert fresh copies of all 5 default roles
4. Disconnect and exit

## Permission Structure

Each role has permissions organized by resource and action:

```javascript
permissions: {
  leads: {
    create: Boolean,
    read: Boolean,
    update: Boolean,
    delete: Boolean,
  },
  deals: {
    create: Boolean,
    read: Boolean,
    update: Boolean,
    delete: Boolean,
  },
  tasks: {
    create: Boolean,
    read: Boolean,
    update: Boolean,
    delete: Boolean,
  },
  reports: {
    read: Boolean,
    export: Boolean,
  },
  users: {
    create: Boolean,
    read: Boolean,
    update: Boolean,
    delete: Boolean,
  },
  settings: {
    manage: Boolean,
  },
}
```

## Role Details

### Admin
- **Description**: Administrator with full access to all resources
- **Permissions**: All true
- **Use Case**: System administrators

### Manager
- **Description**: Manager with access to most resources
- **Leads**: ✓ create, read, update, delete
- **Deals**: ✓ create, read, update, delete
- **Tasks**: ✓ create, read, update, delete
- **Reports**: ✓ read, export
- **Users**: ✓ create, read, update (no delete)
- **Settings**: ✗ manage
- **Use Case**: Team leads and supervisors

### Sales Rep
- **Description**: Sales representative with access to leads, deals, and tasks
- **Leads**: ✓ create, read, update (no delete)
- **Deals**: ✓ create, read, update (no delete)
- **Tasks**: ✓ create, read, update (no delete)
- **Reports**: ✓ read (no export)
- **Users**: ✗ None
- **Settings**: ✗ manage
- **Use Case**: Sales team members

### Support Agent
- **Description**: Support agent with access to tasks and limited leads access
- **Leads**: ✓ read only
- **Deals**: ✓ read only
- **Tasks**: ✓ create, read, update (no delete)
- **Reports**: ✓ read (no export)
- **Users**: ✗ None
- **Settings**: ✗ manage
- **Use Case**: Support and customer service staff

### Viewer
- **Description**: Viewer with read-only access to all resources
- **All Resources**: ✓ read only
- **Use Case**: Stakeholders and consultants

## Troubleshooting

### Still Getting Empty Data?

1. **Check role initialization**: Look for "✓ Default roles initialized successfully" or similar message in server logs
2. **Verify user role**: Check in MongoDB: `db.users.findOne({email: "your-email@domain.com"})`
3. **Run seed manually**: `npm run seed:roles` to force reset
4. **Check authorization response**: Add console.logs to see if requests are being blocked with 403

### Reset All Roles
```bash
npm run seed:roles
```

### Verify Roles Created
In MongoDB shell:
```javascript
use crm-system
db.roles.find({}, { name: 1, permissions: 1 })
```

## Next Steps

1. Restart your server: `npm run dev`
2. Roles will be automatically created if they don't exist
3. Login and test data retrieval
4. Data should now display correctly instead of zeros

## Files Modified

- `server/src/index.js` - Added role initialization
- `server/src/config/initRoles.js` - NEW role initialization logic
- `server/src/scripts/seedRoles.js` - NEW standalone seed script
- `server/package.json` - Added seed:roles script
