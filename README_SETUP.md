# BuddyScript - Complete Setup Guide

## Quick Start (Recommended Path)

### Step 1: Install Composer Dependencies

Try this first:
```bash
cd backend
composer install --no-scripts
```

If you get errors, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md) or use [backend/QUICK_SETUP.md](backend/QUICK_SETUP.md)

### Step 2: Setup Database

```sql
CREATE DATABASE appifylab;
```

### Step 3: Configure Environment

The `.env` file is already configured with:
- Database: `appifylab`
- Username: `root`
- Password: `root`

If your MySQL password is different, update `backend/.env`

### Step 4: Generate Application Key

```bash
cd backend
php artisan key:generate
```

### Step 5: Run Migrations

```bash
php artisan migrate
```

### Step 6: Start Backend Server

```bash
php artisan serve
```

Backend will run at: http://localhost:8000

### Step 7: Start Frontend

Open a new terminal:
```bash
# From project root
npm install
npm run dev
```

Frontend will run at: http://localhost:5173

### Step 8: Test the Application

1. Open http://localhost:5173
2. Click "Create New Account"
3. Register with:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: password123
4. Login with the same credentials
5. You should see the Feed page

## Alternative Setup (If Composer Fails)

### Option A: Test Database First

```bash
cd backend
php test-api.php
```

This will:
- Test database connection
- Create tables if needed
- Verify registration and login work

### Option B: Use Fresh Laravel

```bash
# Create new Laravel project
composer create-project laravel/laravel my-backend

# Copy our files
cp -r backend/app my-backend/
cp -r backend/config my-backend/
cp -r backend/database my-backend/
cp -r backend/routes my-backend/
cp backend/.env my-backend/.env

# Setup
cd my-backend
php artisan key:generate
php artisan migrate
php artisan serve
```

## Project Structure

```
.
├── backend/                    # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── AuthController.php    # Authentication logic
│   │   │   └── Middleware/               # HTTP middleware
│   │   ├── Models/
│   │   │   └── User.php                  # User model
│   │   └── Providers/
│   ├── config/
│   │   ├── app.php                       # App configuration
│   │   ├── auth.php                      # Authentication config
│   │   ├── cors.php                      # CORS settings
│   │   ├── database.php                  # Database config
│   │   └── session.php                   # Session config
│   ├── database/
│   │   └── migrations/                   # Database migrations
│   ├── routes/
│   │   └── api.php                       # API routes
│   ├── .env                              # Environment variables
│   ├── composer.json                     # PHP dependencies
│   └── test-api.php                      # Database test script
│
├── src/                        # React Frontend
│   ├── services/
│   │   └── api.ts                        # API service layer
│   ├── App.tsx                           # Login component
│   ├── Register.tsx                      # Registration component
│   ├── Feed.tsx                          # Feed page
│   └── main.tsx                          # App entry point
│
├── assets/                     # Static assets (CSS, images)
├── package.json                # Node dependencies
├── vite.config.ts              # Vite configuration
├── TROUBLESHOOTING.md          # Detailed troubleshooting
├── TEST_CHECKLIST.md           # Testing checklist
└── FULLSTACK_SETUP.md          # Full documentation
```

## API Endpoints

### POST /api/register
Register a new user

**Request:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
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

### POST /api/login
Login user

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "remember": true
}
```

**Response:**
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

### POST /api/logout
Logout user (requires authentication)

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### GET /api/user
Get authenticated user (requires authentication)

**Response:**
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
- ✅ Bcrypt password hashing
- ✅ Session-based authentication
- ✅ CSRF protection
- ✅ SQL injection prevention (Eloquent ORM)
- ✅ Input validation
- ✅ CORS configuration
- ✅ Secure cookie handling

### Frontend (React)
- ✅ Client-side validation
- ✅ Error handling
- ✅ Loading states
- ✅ Credentials included in requests
- ✅ TypeScript type safety

## Database Schema

### users
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT UNSIGNED | Primary key |
| first_name | VARCHAR(255) | User's first name |
| last_name | VARCHAR(255) | User's last name |
| email | VARCHAR(255) | Unique email |
| password | VARCHAR(255) | Hashed password |
| remember_token | VARCHAR(100) | Remember me token |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Update timestamp |

### sessions
| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(255) | Primary key |
| user_id | BIGINT UNSIGNED | Foreign key to users |
| ip_address | VARCHAR(45) | User's IP |
| user_agent | TEXT | Browser info |
| payload | LONGTEXT | Session data |
| last_activity | INT | Last activity timestamp |

## Testing

### Manual Testing
1. Register a new user
2. Check database: `SELECT * FROM users;`
3. Verify password is hashed
4. Login with credentials
5. Check session: `SELECT * FROM sessions;`
6. Logout
7. Verify session is cleared

### API Testing with curl
```bash
# Register
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Test","last_name":"User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","password":"password123"}'

# Get User
curl -X GET http://localhost:8000/api/user \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Composer error 255 | Run `composer install --no-scripts` |
| Database connection failed | Check MySQL is running and credentials in .env |
| Table not found | Run `php artisan migrate` |
| CORS error | Verify Laravel is running on port 8000 |
| Session not persisting | Check `credentials: 'include'` in API calls |

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed solutions.

## Requirements

### Backend
- PHP 8.1+
- Composer
- MySQL 5.7+
- Extensions: pdo, pdo_mysql, mbstring, openssl, tokenizer, xml

### Frontend
- Node.js 16+
- npm or yarn

## Development

### Backend Development
```bash
cd backend

# Clear cache
php artisan cache:clear
php artisan config:clear

# View routes
php artisan route:list

# Check logs
tail -f storage/logs/laravel.log
```

### Frontend Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Production Deployment

### Backend
1. Set `APP_ENV=production` in .env
2. Set `APP_DEBUG=false`
3. Run `php artisan config:cache`
4. Run `php artisan route:cache`
5. Set up proper web server (Apache/Nginx)

### Frontend
1. Update `API_BASE_URL` in `src/services/api.ts`
2. Run `npm run build`
3. Deploy `dist/` folder

## Support Files

- **TROUBLESHOOTING.md** - Detailed error solutions
- **TEST_CHECKLIST.md** - Complete testing guide
- **FULLSTACK_SETUP.md** - Comprehensive documentation
- **backend/SETUP.md** - Backend-specific setup
- **backend/QUICK_SETUP.md** - Alternative setup methods

## License

Educational project for Appifylab selection task.
