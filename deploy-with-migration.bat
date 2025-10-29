@echo off
REM Deployment Script with Project Favorites Migration for Windows
REM This script handles deployment and runs the necessary migrations

echo 🚀 Urban Realty - Deployment with Project Favorites Migration
echo =============================================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] package.json not found. Please run this script from the project root.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed. Please install npm first.
    exit /b 1
)

echo [INFO] Environment checks passed

REM Install dependencies
echo [INFO] Installing dependencies...
call npm run install-all

if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)

echo [SUCCESS] Dependencies installed successfully

REM Check if MongoDB URI is set
if "%MONGODB_URI%"=="" if "%DATABASE_URL%"=="" (
    echo [WARNING] MONGODB_URI or DATABASE_URL not set. Migration will use default local MongoDB.
    echo [WARNING] Make sure MongoDB is running locally or set the environment variable.
)

REM Run migration test if requested
if "%1"=="--test" (
    echo [INFO] Running migration test...
    call npm run test:migration
    
    if errorlevel 1 (
        echo [ERROR] Migration test failed
        exit /b 1
    )
    
    echo [SUCCESS] Migration test passed
)

REM Run the migration
echo [INFO] Running project favorites migration...
call npm run migrate:project-favorites

if errorlevel 1 (
    echo [ERROR] Migration failed
    exit /b 1
)

echo [SUCCESS] Migration completed successfully

REM Build the application
echo [INFO] Building the application...
call npm run build

if errorlevel 1 (
    echo [ERROR] Build failed
    exit /b 1
)

echo [SUCCESS] Application built successfully

REM Start the application (if not in CI/CD environment)
if not "%1"=="--no-start" if "%CI%"=="" (
    echo [INFO] Starting the application...
    echo [WARNING] Press Ctrl+C to stop the application
    
    REM Start both server and client
    call npm run dev
) else (
    echo [SUCCESS] Deployment completed successfully!
    echo [INFO] Application is ready to start with: npm run dev
)

echo.
echo 🎉 Deployment Summary:
echo =====================
echo ✅ Dependencies installed
echo ✅ Project favorites migration completed
echo ✅ Application built
echo ✅ Ready for production
echo.
echo 📋 Post-deployment checklist:
echo    - [ ] Test project favorites functionality
echo    - [ ] Verify user profile page shows 'Project Favorites' tab
echo    - [ ] Check that users can add/remove project favorites
echo    - [ ] Test the project favorites page
echo.
echo 🔧 Useful commands:
echo    npm run migrate:project-favorites:rollback  # Rollback migration
echo    npm run test:migration                      # Test migration
echo    npm run dev                                 # Start development server
echo.

pause
