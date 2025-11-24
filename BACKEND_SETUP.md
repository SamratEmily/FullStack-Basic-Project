# Laravel JWT Authentication Backend

## Setup Complete ✓

The backend is now running with JWT-based authentication.

## Database Configuration
- Database: `appifylab`
- Username: `root`
- Password: `root`
- Port: `3306`

## API Endpoints

### Public Routes
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Protected Routes (Requires JWT Token)
- `POST /api/logout` - Logout user
- `GET /api/me` - Get current user
- `POST /api/refresh` - Refresh JWT token

## Server
Backend is running on: `http://localhost:8002`

## Authentication Flow
1. Register/Login returns a JWT token
2. Token is stored in localStorage
3. All protected requests include: `Authorization: Bearer {token}`
4. Token expires based on JWT config (default: 60 minutes)

## Testing the API

### Register
```bash
curl -X POST http://localhost:8002/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8002/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get User (Protected)
```bash
curl -X GET http://localhost:8002/api/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Frontend Integration
The frontend API service (`src/services/api.ts`) is already configured to:
- Store JWT tokens in localStorage
- Automatically include tokens in requests
- Handle authentication state
