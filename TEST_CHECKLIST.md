# Testing Checklist

## ✅ Pre-flight Checks

### Database Configuration
- [x] Database name: `appifylab`
- [x] Database user: `root`
- [x] Database password: `root`
- [x] MySQL server running

### Backend Files Created
- [x] `backend/.env` - Environment configuration
- [x] `backend/app/Models/User.php` - User model
- [x] `backend/app/Http/Controllers/AuthController.php` - Authentication logic
- [x] `backend/database/migrations/` - Database schema
- [x] `backend/routes/api.php` - API routes
- [x] `backend/config/cors.php` - CORS configuration
- [x] `backend/config/database.php` - Database configuration
- [x] `backend/config/session.php` - Session configuration
- [x] `backend/bootstrap/app.php` - Application bootstrap

### Frontend Files Created
- [x] `src/services/api.ts` - API service layer
- [x] `src/App.tsx` - Login form with API integration
- [x] `src/Register.tsx` - Registration form with API integration
- [x] `src/Feed.tsx` - Feed page with logout

## 🧪 Testing Steps

### Step 1: Start MySQL
```bash
# If using XAMPP, start MySQL from control panel
# Or start MySQL service manually
```

### Step 2: Create Database
```sql
CREATE DATABASE IF NOT EXISTS appifylab;
```

### Step 3: Setup Backend
```bash
cd backend

# Install dependencies (if not already done)
composer install

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Start Laravel server
php artisan serve
```

Expected output:
```
Starting Laravel development server: http://127.0.0.1:8000
```

### Step 4: Setup Frontend
```bash
# From project root
npm install

# Start Vite dev server
npm run dev
```

Expected output:
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Step 5: Test Registration
1. Open browser: http://localhost:5173
2. Click "Create New Account"
3. Fill form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: password123
   - Repeat Password: password123
   - Check "I agree to terms & conditions"
4. Click "Register now"
5. Should see success message and redirect to login

### Step 6: Verify Database
```sql
USE appifylab;
SELECT * FROM users;
```

Expected: Should see the registered user with hashed password

### Step 7: Test Login
1. On login page, enter:
   - Email: test@example.com
   - Password: password123
2. Click "Login now"
3. Should redirect to Feed page

### Step 8: Test Logout
1. On Feed page, click profile dropdown (top right)
2. Click "Log Out"
3. Should redirect back to login page

## 🐛 Common Issues & Solutions

### Issue: "SQLSTATE[HY000] [1045] Access denied"
**Solution:** 
- Check MySQL is running
- Verify password in `backend/.env` is correct
- Try connecting to MySQL manually: `mysql -u root -proot`

### Issue: "SQLSTATE[HY000] [1049] Unknown database 'appifylab'"
**Solution:**
```sql
CREATE DATABASE appifylab;
```

### Issue: "Nothing to migrate"
**Solution:**
```bash
cd backend
php artisan migrate:fresh
```

### Issue: CORS error in browser console
**Solution:**
- Ensure Laravel server is running on port 8000
- Check `backend/config/cors.php` has correct frontend URL
- Clear browser cache

### Issue: "Failed to fetch" or network error
**Solution:**
- Verify Laravel server is running: http://localhost:8000
- Check browser console for detailed error
- Test API directly: `curl http://localhost:8000/api/register`

### Issue: Session not persisting
**Solution:**
- Clear browser cookies
- Check `credentials: 'include'` in `src/services/api.ts`
- Verify `SESSION_DOMAIN` in `backend/.env`

## 📊 API Testing with curl

### Test Registration
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

Expected response:
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

### Test Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Test Get User (with session)
```bash
curl -X GET http://localhost:8000/api/user \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

## ✨ Success Criteria

- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Database migrations run successfully
- [ ] User can register with valid data
- [ ] User data is saved in database with hashed password
- [ ] User can login with correct credentials
- [ ] User cannot login with wrong credentials
- [ ] User is redirected to Feed after login
- [ ] User can logout successfully
- [ ] User is redirected to login after logout

## 📝 Notes

- Default Laravel port: 8000
- Default Vite port: 5173
- Database: appifylab
- All passwords are hashed with bcrypt
- Sessions are stored in database
- CORS is configured for localhost:5173
