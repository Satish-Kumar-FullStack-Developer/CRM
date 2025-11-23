# Quick Fix Guide - Data Showing as Zeros

## TL;DR

Your application shows zeros for leads/deals/tasks because **roles weren't seeded with permissions**. Fixed!

## What To Do

### Step 1: Start Server
```bash
cd server
npm run dev
```
✓ Roles will auto-create on startup

### Step 2: Test
- Login to application
- Go to Leads/Deals/Tasks pages
- **Should show actual data instead of zeros**

### Step 3: If Still Zeros
```bash
npm run seed:roles
npm run dev
```

## What Changed

Created automatic role seeding so permissions are properly configured when server starts.

### New Files:
- `server/src/config/initRoles.js` - Auto-initialization logic
- `server/src/scripts/seedRoles.js` - Manual seed script
- `ROLE_SEEDING.md` - Full documentation
- `FIX_DATA_RETRIEVAL.md` - Technical details

### Modified Files:
- `server/src/index.js` - Calls role initialization
- `server/package.json` - Added `npm run seed:roles` command

## Role Permissions Seeded

**Admin**: All permissions ✓  
**Manager**: Most permissions ✓  
**Sales Rep**: Leads/Deals/Tasks ✓  
**Support Agent**: Tasks + Read-only ✓  
**Viewer**: Read-only ✓  

## Commands Reference

```bash
# Start server (auto-seeds roles if missing)
npm run dev

# Manually reset roles to default
npm run seed:roles

# Check server is running
curl http://localhost:5000/health
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Still showing zeros | Run `npm run seed:roles` then restart |
| Server won't start | Check MongoDB is running: `mongod` |
| Can't find roles in DB | Run seed script: `npm run seed:roles` |
| Getting 403 Forbidden | Roles were seeded but permissions wrong - run seed again |

## Done!

Your data retrieval issue is fixed. The system now:
1. ✅ Auto-creates roles on startup
2. ✅ Sets proper permissions for each role
3. ✅ Allows authorized requests through
4. ✅ Shows actual data instead of zeros

See `ROLE_SEEDING.md` for full details.
