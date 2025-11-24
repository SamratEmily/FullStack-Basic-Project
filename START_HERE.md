# 🚀 START HERE - Quick Setup Guide

## If You're Getting Composer Errors

**Don't worry!** This is common. Here are your options:

### ⚡ Fastest Solution (Recommended)

```bash
cd backend
composer install --no-scripts
php artisan key:generate
php artisan migrate
php artisan serve
```

### 🔧 If That Doesn't Work

Run the database test script:
```bash
cd backend
php test-api.php
```

This will:
- ✅ Test your database connection
- ✅ Create tables automatically
- ✅ Verify everything works

Then start the server manually:
```bash
php -S localhost:8000 -t public
```

### 📚 Need More Help?

See these guides:
- **TROUBLESHOOTING.md** - Solutions for all common errors
- **backend/QUICK_SETUP.md** - Alternative setup methods
- **README_SETUP.md** - Complete documentation

## Quick Start (3 Steps)

### 1️⃣ Setup Database
```sql
CREATE DATABASE appifylab;
```

### 2️⃣ Start Backend
```bash
cd backend
composer install --no-scripts
php artisan key:generate
php artisan migrate
php artisan serve
```

### 3️⃣ Start Frontend
```bash
# New terminal, from project root
npm install
npm run dev
```

## ✅ Test It Works

1. Open: http://localhost:5173
2. Click "Create New Account"
3. Register a user
4. Login
5. See the Feed page

## 🆘 Getting Errors?

### "Script returned with error code 255"
→ Use `composer install --no-scripts`

### "Access denied for user 'root'"
→ Check password in `backend/.env` (currently set to "root")

### "Unknown database 'appifylab'"
→ Run: `CREATE DATABASE appifylab;`

### "Table 'users' doesn't exist"
→ Run: `php artisan migrate`
→ Or: `php backend/test-api.php`

### CORS errors in browser
→ Make sure Laravel is running on port 8000
→ Check `backend/config/cors.php`

## 📁 Important Files

- **backend/.env** - Database credentials (password is "root")
- **backend/test-api.php** - Test database setup
- **src/services/api.ts** - Frontend API configuration
- **TROUBLESHOOTING.md** - Detailed error solutions

## 🎯 What You Get

✅ User registration with validation
✅ Secure login with bcrypt password hashing
✅ Session-based authentication
✅ Protected feed page
✅ Logout functionality
✅ MySQL database integration
✅ CORS configured
✅ Error handling

## 🔐 Database Configuration

Already configured in `backend/.env`:
```
DB_DATABASE=appifylab
DB_USERNAME=root
DB_PASSWORD=root
```

If your MySQL password is different, update the `.env` file.

## 📊 API Endpoints

- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/user` - Get authenticated user

## 🧪 Test API Directly

```bash
# Test registration
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 💡 Pro Tips

1. **Always start MySQL first** (via XAMPP or service)
2. **Run backend before frontend**
3. **Check browser console** for frontend errors
4. **Check `storage/logs/laravel.log`** for backend errors
5. **Use `php backend/test-api.php`** to verify database setup

## 🎓 Learning Resources

- Laravel Docs: https://laravel.com/docs
- React Docs: https://react.dev
- TypeScript Docs: https://www.typescriptlang.org/docs

## ✨ Features Implemented

### Backend (Laravel)
- ✅ RESTful API
- ✅ Authentication controller
- ✅ User model with relationships
- ✅ Database migrations
- ✅ Session management
- ✅ CORS configuration
- ✅ Input validation
- ✅ Error handling

### Frontend (React + TypeScript)
- ✅ Login form
- ✅ Registration form
- ✅ Feed page
- ✅ API service layer
- ✅ Error handling
- ✅ Loading states
- ✅ Form validation
- ✅ Routing between views

## 🎉 Success Checklist

- [ ] MySQL is running
- [ ] Database `appifylab` created
- [ ] Backend server running on port 8000
- [ ] Frontend server running on port 5173
- [ ] Can register a new user
- [ ] Can login with credentials
- [ ] Can see feed page after login
- [ ] Can logout successfully

## 🚨 Still Stuck?

1. Read **TROUBLESHOOTING.md** (covers 99% of issues)
2. Run `php backend/test-api.php` to diagnose
3. Check both terminal outputs for errors
4. Verify MySQL is actually running
5. Try the alternative setup in **backend/QUICK_SETUP.md**

---

**Remember:** The database password is set to "root" in `backend/.env`. If your MySQL uses a different password, update it there!

Good luck! 🚀
