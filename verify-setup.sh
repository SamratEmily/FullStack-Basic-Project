#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================="
echo "  BuddyScript Setup Verification"
echo "========================================="
echo ""

# Check PHP
echo -n "Checking PHP... "
if command -v php &> /dev/null; then
    PHP_VERSION=$(php -v | head -n 1 | cut -d " " -f 2 | cut -d "." -f 1,2)
    echo -e "${GREEN}✓${NC} Found PHP $PHP_VERSION"
else
    echo -e "${RED}✗${NC} PHP not found"
    exit 1
fi

# Check Composer
echo -n "Checking Composer... "
if command -v composer &> /dev/null; then
    COMPOSER_VERSION=$(composer --version | cut -d " " -f 3)
    echo -e "${GREEN}✓${NC} Found Composer $COMPOSER_VERSION"
else
    echo -e "${RED}✗${NC} Composer not found"
    exit 1
fi

# Check Node
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Found Node $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found"
    exit 1
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} Found npm $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found"
    exit 1
fi

# Check MySQL
echo -n "Checking MySQL... "
if command -v mysql &> /dev/null; then
    echo -e "${GREEN}✓${NC} MySQL found"
else
    echo -e "${YELLOW}⚠${NC} MySQL command not found (might still be running via XAMPP)"
fi

echo ""
echo "========================================="
echo "  File Structure Check"
echo "========================================="
echo ""

# Check backend files
echo "Backend files:"
[ -f "backend/.env" ] && echo -e "${GREEN}✓${NC} backend/.env" || echo -e "${RED}✗${NC} backend/.env"
[ -f "backend/composer.json" ] && echo -e "${GREEN}✓${NC} backend/composer.json" || echo -e "${RED}✗${NC} backend/composer.json"
[ -f "backend/artisan" ] && echo -e "${GREEN}✓${NC} backend/artisan" || echo -e "${RED}✗${NC} backend/artisan"
[ -f "backend/app/Models/User.php" ] && echo -e "${GREEN}✓${NC} backend/app/Models/User.php" || echo -e "${RED}✗${NC} backend/app/Models/User.php"
[ -f "backend/app/Http/Controllers/AuthController.php" ] && echo -e "${GREEN}✓${NC} backend/app/Http/Controllers/AuthController.php" || echo -e "${RED}✗${NC} backend/app/Http/Controllers/AuthController.php"
[ -f "backend/routes/api.php" ] && echo -e "${GREEN}✓${NC} backend/routes/api.php" || echo -e "${RED}✗${NC} backend/routes/api.php"
[ -f "backend/test-api.php" ] && echo -e "${GREEN}✓${NC} backend/test-api.php" || echo -e "${RED}✗${NC} backend/test-api.php"

echo ""
echo "Frontend files:"
[ -f "package.json" ] && echo -e "${GREEN}✓${NC} package.json" || echo -e "${RED}✗${NC} package.json"
[ -f "src/App.tsx" ] && echo -e "${GREEN}✓${NC} src/App.tsx" || echo -e "${RED}✗${NC} src/App.tsx"
[ -f "src/Register.tsx" ] && echo -e "${GREEN}✓${NC} src/Register.tsx" || echo -e "${RED}✗${NC} src/Register.tsx"
[ -f "src/Feed.tsx" ] && echo -e "${GREEN}✓${NC} src/Feed.tsx" || echo -e "${RED}✗${NC} src/Feed.tsx"
[ -f "src/services/api.ts" ] && echo -e "${GREEN}✓${NC} src/services/api.ts" || echo -e "${RED}✗${NC} src/services/api.ts"

echo ""
echo "========================================="
echo "  Configuration Check"
echo "========================================="
echo ""

# Check .env configuration
if [ -f "backend/.env" ]; then
    echo "Database configuration:"
    grep "DB_DATABASE" backend/.env
    grep "DB_USERNAME" backend/.env
    grep "DB_PASSWORD" backend/.env
else
    echo -e "${RED}✗${NC} backend/.env not found"
fi

echo ""
echo "========================================="
echo "  Next Steps"
echo "========================================="
echo ""
echo "1. Create database:"
echo "   mysql -u root -proot -e 'CREATE DATABASE IF NOT EXISTS appifylab;'"
echo ""
echo "2. Test database setup:"
echo "   cd backend && php test-api.php"
echo ""
echo "3. Install backend dependencies:"
echo "   cd backend && composer install --no-scripts"
echo ""
echo "4. Generate app key:"
echo "   cd backend && php artisan key:generate"
echo ""
echo "5. Run migrations:"
echo "   cd backend && php artisan migrate"
echo ""
echo "6. Start backend:"
echo "   cd backend && php artisan serve"
echo ""
echo "7. Install frontend dependencies:"
echo "   npm install"
echo ""
echo "8. Start frontend:"
echo "   npm run dev"
echo ""
echo "========================================="
echo "  Documentation"
echo "========================================="
echo ""
echo "📖 START_HERE.md - Quick start guide"
echo "🔧 TROUBLESHOOTING.md - Error solutions"
echo "📚 README_SETUP.md - Complete documentation"
echo "⚡ backend/QUICK_SETUP.md - Alternative setup"
echo ""
