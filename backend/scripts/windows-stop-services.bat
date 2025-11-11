@echo off
REM Stop Docker services on Windows (Batch version)

echo 🛑 Stopping Docker services...
echo.

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

%COMPOSE_CMD% stop postgres redis

if %ERRORLEVEL% EQU 0 (
    echo ✅ Services stopped
) else (
    echo ⚠️  Some services may not have been running
)

echo.
pause


