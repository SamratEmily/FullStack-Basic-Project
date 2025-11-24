# BuddyScript - Full Stack Setup Guide

This project consists of a React TypeScript frontend and a Laravel PHP backend with MySQL database.

## Project Structure

```
.
├── backend/              # Laravel API
│   ├── app/
│   ├── config/
│   ├── database/
│   └── routes/
├── src/                  # React Frontend
│   ├── services/         # API service layer
│   ├── App.tsx
│   ├── Feed.tsx
│   └── Register.tsx
└── assets/              # Static assets
```

## Prerequisites

### Backend Requirements
- PHP 8.1 or higher
- Composer
- MySQL 5.7 or higher
- XAMPP/MAMP/WAMP (recommended for easy MySQL setup)

### Frontend Requirements
- Node.js 16+ and npm
- Modern web browser

## Setup Instructions

### 1. Database Setup

1. Start MySQL server (via XAMPP or standalone)
2. Create the database:
   ```sql
   CREATE DATABASE appifylab;
   ```

### 2. Backend Setup (Laravel)

```bash
# Navigate to backend directory
cd backend

# Install PHP dependencies
composer install

# Generate application key
php artisan key:generate

# Run database migrations
php artisan migrate

# Start Laravel development server
php artisan serve
```

The API will be available at: **http://localhost:8000**

### 3. Frontend Setup (React)

```bash
# From project root directory
npm install

# Start Vite development server
npm run dev
```

The frontend will be available at: **http://localhost:5173**

## API Endpoints

### Authentication

#### Register
- **URL:** `POST /api/register`
- **Body:**
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com"
    }
  }
  ```

#### Login
- **URL:** `POST /api/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123",
    "remember": true
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com"
    }
  }
  ```

#### Logout
- **URL:** `POST /api/logout`
- **Headers:** Requires authentication session
- **Response:**
  ```json
  {
    "success": true,
    "message": "Logout successful"
  }
  ```

#### Get User
- **URL:** `GET /api/user`
- **Headers:** Requires authentication session
- **Response:**
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com"
    }
  }
  ```

## Security Features

### Backend (Laravel)
- **Password Hashing:** Uses bcrypt for secure password storage
- **Session-based Authentication:** Secure session management with Laravel
- **CSRF Protection:** Built-in CSRF token validation
- **SQL Injection Prevention:** Eloquent ORM with prepared statements
- **Input Validation:** Server-side validation for all inputs
- **CORS Configuration:** Properly configured for frontend origin

### Frontend (React)
- **Credentials Include:** Sends cookies with API requests
- **Form Validation:** Client-side validation before API calls
- **Error Handling:** Proper error messages for users
- **Loading States:** Prevents duplicate submissions

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### Sessions Table
```sql
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload LONGTEXT NOT NULL,
    last_activity INT NOT NULL,
    INDEX sessions_user_id_index (user_id),
    INDEX sessions_last_activity_index (last_activity)
);
```

## Testing the Application

### 1. Register a New User
1. Open http://localhost:5173
2. Click "Create New Account"
3. Fill in the registration form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: password123
   - Repeat Password: password123
   - Check "I agree to terms & conditions"
4. Click "Register now"
5. You should be redirected to login page

### 2. Login
1. Enter the registered email and password
2. Check "Remember me" if desired
3. Click "Login now"
4. You should be redirected to the Feed page

### 3. Logout
1. Click on the profile dropdown in the top right
2. Click "Log Out"
3. You should be redirected back to login page

## Troubleshooting

### Backend Issues

**Database Connection Error**
```
SQLSTATE[HY000] [1045] Access denied for user 'root'@'localhost'
```
- Solution: Check MySQL is running and credentials in `backend/.env` are correct

**Migration Error**
```
Nothing to migrate
```
- Solution: Run `php artisan migrate:fresh` to reset and run migrations

**CORS Error**
```
Access to fetch has been blocked by CORS policy
```
- Solution: Verify `backend/config/cors.php` includes your frontend URL

### Frontend Issues

**API Connection Failed**
- Ensure Laravel server is running on port 8000
- Check browser console for detailed error messages
- Verify API_BASE_URL in `src/services/api.ts`

**Session Not Persisting**
- Clear browser cookies and try again
- Check `credentials: 'include'` is set in API requests

## Development Tips

### Hot Reload
- Frontend: Vite automatically reloads on file changes
- Backend: Restart `php artisan serve` after code changes

### Debugging
- Frontend: Use browser DevTools Console and Network tab
- Backend: Check `storage/logs/laravel.log` for errors

### Database Management
- Use phpMyAdmin (comes with XAMPP) at http://localhost/phpmyadmin
- Or use MySQL Workbench for a desktop client

## Production Deployment

### Backend
1. Set `APP_ENV=production` in `.env`
2. Set `APP_DEBUG=false`
3. Run `php artisan config:cache`
4. Run `php artisan route:cache`
5. Set up proper web server (Apache/Nginx)

### Frontend
1. Run `npm run build`
2. Deploy `dist/` folder to web server
3. Update API_BASE_URL to production API URL

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Laravel documentation: https://laravel.com/docs
3. Review React documentation: https://react.dev

## License

This project is for educational purposes.
