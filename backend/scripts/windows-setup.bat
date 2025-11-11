@echo off
REM Windows Setup Script for Backend (Batch version)
REM Run this script in Command Prompt

echo 🚀 Setting up Backend for Windows...
echo.

REM Check Node.js
echo 📦 Checking Node.js...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found. Please install Node.js 20+ from https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js found
    node -v
)

REM Check npm
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm not found
    pause
    exit /b 1
) else (
    echo ✅ npm found
    npm -v
)

REM Check Docker
echo.
echo 🐳 Checking Docker...
where docker >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker not found. Please install Docker Desktop from https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
) else (
    echo ✅ Docker found
    docker --version
)

REM Check if Docker is running
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker is not running. Please start Docker Desktop
    pause
    exit /b 1
) else (
    echo ✅ Docker is running
)

REM Install dependencies
echo.
echo 📦 Installing npm dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Generate Prisma Client
echo.
echo 🔧 Generating Prisma Client...
call npm run prisma:generate
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to generate Prisma Client
    pause
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist .env (
    echo.
    echo 📝 Creating .env file from env.example...
    copy env.example .env >nul
    echo ⚠️  Please edit .env file with your configuration
) else (
    echo.
    echo ✅ .env file already exists
)

echo.
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Start Docker services: scripts\windows-start-services.bat
echo 2. Run migrations: npm run migrate:dev
echo 3. Seed database (optional): npm run seed
echo 4. Start dev server: npm run dev
echo.
pause


