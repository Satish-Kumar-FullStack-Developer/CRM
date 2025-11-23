# API Collection & Examples

## Authentication

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "department": "Sales"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": {...}
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Profile
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Leads API

### Create Lead
```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phone": "+1-555-1234",
    "company": "Tech Corp",
    "title": "Manager",
    "source": "Website",
    "description": "Interested in CRM solution"
  }'
```

### Get All Leads (Paginated)
```bash
curl -X GET "http://localhost:5000/api/leads?page=1&limit=20&status=Qualified" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Query Parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `status` - Filter by status
- `assignedTo` - Filter by assigned user
- `source` - Filter by source
- `search` - Search by name, email, company

### Get Lead by ID
```bash
curl -X GET http://localhost:5000/api/leads/LEAD_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Lead
```bash
curl -X PUT http://localhost:5000/api/leads/LEAD_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "status": "Qualified",
    "leadScore": 85
  }'
```

### Delete Lead
```bash
curl -X DELETE http://localhost:5000/api/leads/LEAD_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Lead Statistics
```bash
curl -X GET http://localhost:5000/api/leads/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:
```json
{
  "success": true,
  "data": {
    "byStatus": [
      { "_id": "New", "count": 45 },
      { "_id": "Qualified", "count": 23 }
    ],
    "bySource": [
      { "_id": "Website", "count": 30 }
    ],
    "total": 100
  }
}
```

## Deals API

### Create Deal
```bash
curl -X POST http://localhost:5000/api/deals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Enterprise CRM Implementation",
    "value": 50000,
    "currency": "USD",
    "stage": "Proposal",
    "probability": 75,
    "expectedCloseDate": "2024-03-31",
    "description": "Large enterprise deal"
  }'
```

### Get All Deals
```bash
curl -X GET "http://localhost:5000/api/deals?page=1&limit=20&stage=Proposal" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Query Parameters:
- `page` - Page number
- `limit` - Items per page
- `stage` - Filter by stage
- `owner` - Filter by owner
- `status` - Filter by status
- `minValue` - Minimum deal value
- `maxValue` - Maximum deal value

### Get Pipeline Summary
```bash
curl -X GET http://localhost:5000/api/deals/pipeline/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:
```json
{
  "success": true,
  "data": {
    "byStage": [
      { "_id": "Prospecting", "count": 10, "totalValue": 500000 },
      { "_id": "Proposal", "count": 5, "totalValue": 250000 }
    ]
  }
}
```

## Tasks API

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Follow up with client",
    "type": "Call",
    "priority": "High",
    "dueDate": "2024-01-20",
    "description": "Check on proposal status",
    "assignedTo": "USER_ID"
  }'
```

### Get My Tasks
```bash
curl -X GET "http://localhost:5000/api/tasks?assignedTo=USER_ID&status=Open" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Complete Task
```bash
curl -X PATCH http://localhost:5000/api/tasks/TASK_ID/complete \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Add Note to Task
```bash
curl -X POST http://localhost:5000/api/tasks/TASK_ID/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "content": "Client confirmed interest in proposal"
  }'
```

## Reports API

### Dashboard Analytics
```bash
curl -X GET http://localhost:5000/api/reports/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response includes:
- Total leads, qualified leads
- Total deals, won deals, deal value
- Total tasks, completed tasks, overdue tasks
- Sales pipeline by stage

### Sales Pipeline Report
```bash
curl -X GET http://localhost:5000/api/reports/pipeline \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Lead Conversion Report
```bash
curl -X GET http://localhost:5000/api/reports/conversion \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Deal Analytics Report
```bash
curl -X GET http://localhost:5000/api/reports/deals \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Team Performance Report
```bash
curl -X GET http://localhost:5000/api/reports/team \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Error Responses

### Validation Error
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

### Authentication Error
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### Authorization Error
```json
{
  "success": false,
  "message": "No permission to create leads"
}
```

### Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Rate Limiting

- General API: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes
- Response headers include:
  - `RateLimit-Limit`
  - `RateLimit-Remaining`
  - `RateLimit-Reset`

## Pagination

All list endpoints support pagination:
- `page` (default: 1)
- `limit` (default: 20, max: 100)

Response includes pagination info:
```json
{
  "success": true,
  "leads": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

## Example Workflows

### 1. Create Lead → Convert to Deal
```bash
# 1. Create Lead
LEAD_RESPONSE=$(curl -s -X POST http://localhost:5000/api/leads \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","source":"Website"}')

LEAD_ID=$(echo $LEAD_RESPONSE | jq '.data._id')

# 2. Update Lead Status
curl -X PUT http://localhost:5000/api/leads/$LEAD_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"Qualified"}'

# 3. Create Deal from Lead
curl -X POST http://localhost:5000/api/deals \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Deal Name","value":50000,"lead":"'$LEAD_ID'"}'
```

### 2. Assign Task with Reminder
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Follow-up Call",
    "type": "Call",
    "priority": "High",
    "dueDate": "2024-01-25T14:00:00Z",
    "assignedTo": "USER_ID",
    "remindersSet": true
  }'
```

## Testing with Postman

1. Import this collection into Postman
2. Set environment variables:
   - `base_url`: http://localhost:5000/api
   - `token`: Your JWT token
3. Run requests with `{{base_url}}` and `{{token}}` placeholders

---

For more information, check README.md and API documentation.
