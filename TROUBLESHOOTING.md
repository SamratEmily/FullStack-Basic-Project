# Troubleshooting Guide

## Composer Install Error: "Script returned with error code 255"

This error occurs when Laravel tries to run post-install scripts but can't find required files.

### Solution 1: Install Without Scripts (Quickest)

```bash
cd backend
composer install --no-scripts
php artisan key:generate
```

### Solution 2: Use Pre-built Laravel

Instead of running composer install in our backend folder, use a fresh Laravel installation:

```bash
# Create a new Laravel project
composer create-project laravel/laravel my-backend

# Copy our custom files into it
cp -r backend/app my-backend/
cp -r backend/config my-backend/
cp -r backend/database my-backend/
cp -r backend/routes my-backend/
cp backend/.env my-backend/.env

# Use the new backend
cd my-backend
php artisan migrate
php artisan serve
```

### Solution 3: Manual Database Setup

If Laravel won't install, you can still test the system:

1. **Create database and tables manually:**

```sql
CREATE DATABASE appifylab;
USE appifylab;

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload LONGTEXT NOT NULL,
    last_activity INT NOT NULL,
    INDEX (user_id),
    INDEX (last_activity)
);
```

2. **Test database setup:**

```bash
cd backend
php test-api.php
```

This will verify your database is working correctly.

3. **If composer still fails, try:**

```bash
cd backend

# Clear composer cache
composer clear-cache

# Update composer itself
composer self-update

# Try install again
composer install --no-scripts

# If still fails, install dependencies one by one
composer require laravel/framework
composer require laravel/sanctum
```

## Other Common Issues

### Issue: "Class 'Illuminate\Foundation\Application' not found"

**Cause:** Vendor folder is missing or incomplete

**Solution:**
```bash
cd backend
rm -rf vendor composer.lock
composer install --no-scripts
```

### Issue: "No application encryption key has been specified"

**Cause:** APP_KEY not set in .env

**Solution:**
```bash
cd backend
php artisan key:generate
```

Or manually add to `.env`:
```
APP_KEY=base64:$(openssl rand -base64 32)
```

### Issue: "SQLSTATE[HY000] [2002] Connection refused"

**Cause:** MySQL is not running

**Solution:**
- Start XAMPP/MAMP and start MySQL
- Or start MySQL service: `sudo service mysql start` (Linux) or `brew services start mysql` (Mac)

### Issue: "SQLSTATE[HY000] [1045] Access denied for user 'root'@'localhost'"

**Cause:** Wrong database credentials

**Solution:**
1. Check your MySQL password
2. Update `backend/.env`:
```
DB_USERNAME=root
DB_PASSWORD=your_actual_password
```

### Issue: "SQLSTATE[HY000] [1049] Unknown database 'appifylab'"

**Cause:** Database doesn't exist

**Solution:**
```sql
CREATE DATABASE appifylab;
```

### Issue: "Base table or view not found: 1146 Table 'appifylab.users' doesn't exist"

**Cause:** Migrations haven't been run

**Solution:**
```bash
cd backend
php artisan migrate
```

Or create tables manually (see Solution 3 above)

### Issue: CORS error in browser

**Cause:** Laravel not configured for frontend origin

**Solution:**
1. Check `backend/config/cors.php` has:
```php
'allowed_origins' => ['http://localhost:5173', 'http://127.0.0.1:5173'],
'supports_credentials' => true,
```

2. Restart Laravel server:
```bash
php artisan serve
```

### Issue: "419 Page Expired" or CSRF token mismatch

**Cause:** CSRF protection blocking API requests

**Solution:**
The API routes should already be exempt from CSRF. If you still get this error:

1. Check `backend/routes/api.php` (not web.php)
2. Ensure frontend is sending requests to `/api/` endpoints
3. Check `credentials: 'include'` is set in `src/services/api.ts`

### Issue: Frontend can't connect to backend

**Symptoms:** "Failed to fetch" or network errors

**Solution:**
1. Verify Laravel is running: `curl http://localhost:8000`
2. Check API endpoint: `curl http://localhost:8000/api/register`
3. Verify `API_BASE_URL` in `src/services/api.ts` is `http://localhost:8000/api`
4. Check browser console for detailed errors

### Issue: Session not persisting after login

**Cause:** Cookies not being saved

**Solution:**
1. Check `credentials: 'include'` in API requests
2. Verify `SESSION_DOMAIN` in `backend/.env` is set to `localhost`
3. Clear browser cookies and try again
4. Check browser console for cookie warnings

## Testing Without Frontend

You can test the backend API directly using curl:

### Test Registration:
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Test Login:
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Test Get User (with session):
```bash
curl -X GET http://localhost:8000/api/user \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

## Still Having Issues?

### Check PHP Version
```bash
php -v
```
Required: PHP 8.1 or higher

### Check PHP Extensions
```bash
php -m | grep -E 'pdo|mysql|mbstring|openssl'
```
Required extensions: pdo, pdo_mysql, mbstring, openssl, tokenizer, xml, ctype, json

### Check Composer Version
```bash
composer --version
```
Required: Composer 2.x

### Enable Error Display
Add to `backend/.env`:
```
APP_DEBUG=true
LOG_LEVEL=debug
```

Then check `backend/storage/logs/laravel.log` for detailed errors.

### Nuclear Option: Start Fresh

If nothing works, start completely fresh:

```bash
# 1. Create new Laravel project
composer create-project laravel/laravel fresh-backend

# 2. Copy only the essential files
cp backend/app/Http/Controllers/AuthController.php fresh-backend/app/Http/Controllers/
cp backend/app/Models/User.php fresh-backend/app/Models/
cp backend/routes/api.php fresh-backend/routes/
cp backend/database/migrations/* fresh-backend/database/migrations/

# 3. Update .env
cd fresh-backend
# Edit .env with your database credentials

# 4. Run migrations
php artisan migrate

# 5. Start server
php artisan serve
```

## Need More Help?

1. Check Laravel logs: `backend/storage/logs/laravel.log`
2. Check browser console for frontend errors
3. Use browser Network tab to see API requests/responses
4. Test API with Postman or curl to isolate frontend vs backend issues
