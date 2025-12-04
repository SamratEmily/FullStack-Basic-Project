# Login/Register Issues - Diagnosis & Fixes

## Issues Found

### 1. ❌ Backend Server Running from Wrong Directory
**Problem:** The PHP server is running from `/Users/samrathossen/Herd/social-media` instead of the `backend` folder in this project.
**Impact:** API routes are not accessible, causing all login/register requests to fail with 404 errors.
**Fix:** Stop the old server and start a new one from the correct directory.

### 2. ✅ FIXED - Missing APP_KEY
**Problem:** Laravel APP_KEY was empty in backend/.env
**Status:** Fixed - Generated new key with `php artisan key:generate`

### 3. ✅ FIXED - Missing JWT_SECRET
**Problem:** JWT_SECRET was not configured
**Status:** Fixed - Generated with `php artisan jwt:secret`

### 4. ✅ FIXED - API URL Mismatch
**Problem:** Frontend was configured to connect to port 8009, but backend runs on 8000
**Status:** Fixed - Updated `src/services/api.ts` to use `http://localhost:8000/api`

### 5. ✅ FIXED - CORS Configuration
**Problem:** CORS was only allowing port 5176, but Vite defaults to 5173
**Status:** Fixed - Updated `backend/config/cors.php` to allow ports 5173-5176

### 6. ⚠️ Static HTML Files Not Used
**Note:** The files `login.html` and `registration.html` are static templates with no functionality. The actual working login/register is in the React app (`src/App.tsx` and `src/Register.tsx`).

## How to Fix

### Step 1: Stop the Old Backend Server
```bash
# Find and kill the old PHP server process
kill 89167  # or whatever the PID is
# Or kill all php artisan serve processes:
pkill -f "php artisan serve"
```

### Step 2: Start Backend Server from Correct Directory
```bash
cd backend
php artisan serve
```

### Step 3: Start Frontend Development Server
```bash
# In the root directory
npm run dev
```

### Step 4: Test the Application
1. Open browser to `http://localhost:5173` (or whatever port Vite shows)
2. Try registering a new account
3. Try logging in with the created account

## Expected Behavior After Fix

- Registration form should accept: first name, last name, email, password
- Login form should accept: email, password
- Successful registration redirects to login
- Successful login redirects to feed page
- Errors are displayed in red alert boxes

## API Endpoints (Backend)

- POST `/api/register` - Register new user
- POST `/api/login` - Login user
- POST `/api/logout` - Logout user (requires auth)
- GET `/api/me` - Get current user (requires auth)
- GET `/api/posts` - Get posts (requires auth)

## Database Check

Make sure the database is set up:
```bash
cd backend
php artisan migrate
```

If you see migration errors, check that MySQL is running and credentials in `backend/.env` are correct:
- DB_DATABASE=appifylab
- DB_USERNAME=root
- DB_PASSWORD=root
