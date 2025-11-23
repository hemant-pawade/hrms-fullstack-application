# HRMS API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register Organisation

Create a new organisation and admin user.

**Endpoint:** `POST /auth/register`

**Access:** Public

**Request Body:**
```json
{
  "orgName": "Acme Corporation",
  "adminName": "John Doe",
  "email": "admin@acme.com",
  "password": "securepassword123"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Organisation and admin user created successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "admin@acme.com",
      "organisationId": 1,
      "organisationName": "Acme Corporation"
    }
  }
}
```

**Errors:**
- `400` - Missing required fields
- `409` - Email already exists

---

### Login

Authenticate user and receive JWT token.

**Endpoint:** `POST /auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "admin@acme.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "admin@acme.com",
      "organisationId": 1,
      "organisationName": "Acme Corporation"
    }
  }
}
```

**Errors:**
- `400` - Missing email or password
- `401` - Invalid credentials

---

### Logout

Log out current user (creates audit log).

**Endpoint:** `POST /auth/logout`

**Access:** Protected

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### Get Current User

Get authenticated user information.

**Endpoint:** `GET /auth/me`

**Access:** Protected

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "admin@acme.com",
    "organisationId": 1,
    "organisationName": "Acme Corporation"
  }
}
```

---

## Employee Endpoints

### List All Employees

Get all employees for the authenticated user's organisation.

**Endpoint:** `GET /employees`

**Access:** Protected

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "organisationId": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@acme.com",
      "phone": "+1-555-0101",
      "createdAt": "2024-11-23T10:00:00Z",
      "teams": [
        {
          "id": 1,
          "name": "Engineering"
        }
      ]
    }
  ]
}
```

---

### Get Single Employee

Get detailed information about a specific employee.

**Endpoint:** `GET /employees/:id`

**Access:** Protected

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "organisationId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@acme.com",
    "phone": "+1-555-0101",
    "createdAt": "2024-11-23T10:00:00Z",
    "teams": [
      {
        "id": 1,
        "name": "Engineering",
        "description": "Software development team",
        "EmployeeTeam": {
          "assignedAt": "2024-11-23T10:30:00Z"
        }
      }
    ]
  }
}
```

**Errors:**
- `404` - Employee not found

---

### Create Employee

Add a new employee to the organisation.

**Endpoint:** `POST /employees`

**Access:** Protected

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@acme.com",
  "phone": "+1-555-0102"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": 2,
    "organisationId": 1,
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@acme.com",
    "phone": "+1-555-0102",
    "createdAt": "2024-11-23T11:00:00Z"
  }
}
```

**Errors:**
- `400` - Missing required fields (firstName, lastName)

---

### Update Employee

Update an existing employee's information.

**Endpoint:** `PUT /employees/:id`

**Access:** Protected

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith-Johnson",
  "email": "jane.johnson@acme.com",
  "phone": "+1-555-0199"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": {
    "id": 2,
    "organisationId": 1,
    "firstName": "Jane",
    "lastName": "Smith-Johnson",
    "email": "jane.johnson@acme.com",
    "phone": "+1-555-0199",
    "createdAt": "2024-11-23T11:00:00Z"
  }
}
```

**Errors:**
- `404` - Employee not found

---

### Delete Employee

Remove an employee from the organisation.

**Endpoint:** `DELETE /employees/:id`

**Access:** Protected

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Employee deleted successfully"
}
```

**Errors:**
- `404` - Employee not found

---

## Team Endpoints

### List All Teams

Get all teams for the authenticated user's organisation.

**Endpoint:** `GET /teams`

**Access:** Protected

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "organisationId": 1,
      "name": "Engineering",
      "description": "Software development team",
      "createdAt": "2024-11-23T09:00:00Z",
      "employees": [
        {
          "id": 1,
          "firstName": "John",
          "lastName": "Doe",
          "email": "john.doe@acme.com"
        }
      ]
    }
  ]
}
```

---

### Get Single Team

Get detailed information about a specific team.

**Endpoint:** `GET /teams/:id`

**Access:** Protected

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "organisationId": 1,
    "name": "Engineering",
    "description": "Software development team",
    "createdAt": "2024-11-23T09:00:00Z",
    "employees": [
      {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@acme.com",
        "phone": "+1-555-0101",
        "EmployeeTeam": {
          "assignedAt": "2024-11-23T10:30:00Z"
        }
      }
    ]
  }
}
```

**Errors:**
- `404` - Team not found

---

### Create Team

Add a new team to the organisation.

**Endpoint:** `POST /teams`

**Access:** Protected

**Request Body:**
```json
{
  "name": "Marketing",
  "description": "Marketing and brand management team"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Team created successfully",
  "data": {
    "id": 2,
    "organisationId": 1,
    "name": "Marketing",
    "description": "Marketing and brand management team",
    "createdAt": "2024-11-23T12:00:00Z"
  }
}
```

**Errors:**
- `400` - Missing team name

---

### Update Team

Update an existing team's information.

**Endpoint:** `PUT /teams/:id`

**Access:** Protected

**Request Body:**
```json
{
  "name": "Marketing & Sales",
  "description": "Combined marketing and sales team"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Team updated successfully",
  "data": {
    "id": 2,
    "organisationId": 1,
    "name": "Marketing & Sales",
    "description": "Combined marketing and sales team",
    "createdAt": "2024-11-23T12:00:00Z"
  }
}
```

**Errors:**
- `404` - Team not found

---

### Delete Team

Remove a team from the organisation.

**Endpoint:** `DELETE /teams/:id`

**Access:** Protected

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Team deleted successfully"
}
```

**Errors:**
- `404` - Team not found

---

## Team Assignment Endpoints

### Assign Employees to Team

Assign one or more employees to a team.

**Endpoint:** `POST /teams/:teamId/assign`

**Access:** Protected

**Request Body:**
```json
{
  "employeeIds": [1, 2, 3]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "3 employee(s) assigned to team",
  "data": {
    "assigned": 3
  }
}
```

**Errors:**
- `400` - Missing or invalid employeeIds
- `404` - Team or employee not found

---

### Unassign Employee from Team

Remove an employee from a team.

**Endpoint:** `DELETE /teams/:teamId/unassign/:employeeId`

**Access:** Protected

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Employee unassigned from team"
}
```

**Errors:**
- `404` - Team, employee, or assignment not found

---

## Logging Endpoints

### Get Activity Logs

Retrieve audit logs for the organisation.

**Endpoint:** `GET /teams/logs/all`

**Access:** Protected

**Query Parameters:**
- `limit` (optional) - Number of logs to return (default: 100)
- `action` (optional) - Filter by action type

**Example:** `GET /teams/logs/all?limit=50&action=employee_created`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "organisationId": 1,
      "userId": 1,
      "action": "employee_created",
      "meta": {
        "employeeId": 5,
        "firstName": "John",
        "lastName": "Doe"
      },
      "timestamp": "2024-11-23T10:30:00Z"
    }
  ]
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per user

---

## Pagination

For future implementation:

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sort` - Sort field
- `order` - Sort order (asc/desc)

**Example:** `GET /employees?page=2&limit=10&sort=firstName&order=asc`

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "orgName": "Test Corp",
    "adminName": "Admin User",
    "email": "admin@test.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123"
  }'
```

### Get Employees (with token)
```bash
curl -X GET http://localhost:5000/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Employee
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@test.com",
    "phone": "+1-555-0101"
  }'
```

---

## Testing with Postman

1. Import the API endpoints
2. Set base URL: `http://localhost:5000/api`
3. Create environment variable for token
4. Use `{{token}}` in Authorization header

---

**API Version:** 1.0.0  
**Last Updated:** November 23, 2024
