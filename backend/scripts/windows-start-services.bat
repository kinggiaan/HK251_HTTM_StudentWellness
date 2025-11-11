@echo off
REM Start Docker services for development on Windows (Batch version)

echo 🐳 Starting Docker services...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker is not running. Please start Docker Desktop
    pause
    exit /b 1
)

REM Check for docker compose
docker compose version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set COMPOSE_CMD=docker compose
) else (
    where docker-compose >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        set COMPOSE_CMD=docker-compose
    ) else (
        echo ❌ Docker Compose not found
        pause
        exit /b 1
    )
)

echo 📦 Starting PostgreSQL and Redis...
%COMPOSE_CMD% up -d postgres redis

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to start services
    pause
    exit /b 1
)

echo.
echo ⏳ Waiting for services to be ready...
timeout /t 5 /nobreak >nul

echo.
echo ✅ Services started!
echo.
echo PostgreSQL: localhost:5432
echo Redis: localhost:6379
echo.
echo To stop services: scripts\windows-stop-services.bat
echo To view logs: docker compose logs -f
echo.
pause


