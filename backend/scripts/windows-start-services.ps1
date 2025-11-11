# Start Docker services for development on Windows
# This script starts PostgreSQL and Redis using Docker Compose

Write-Host "🐳 Starting Docker services..." -ForegroundColor Green

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop" -ForegroundColor Red
    exit 1
}

# Check if docker-compose is available
$composeCmd = "docker compose"
try {
    docker compose version | Out-Null
} catch {
    if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
        $composeCmd = "docker-compose"
    } else {
        Write-Host "❌ Docker Compose not found" -ForegroundColor Red
        exit 1
    }
}

# Start only postgres and redis services
Write-Host "📦 Starting PostgreSQL and Redis..." -ForegroundColor Green
Invoke-Expression "$composeCmd up -d postgres redis"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start services" -ForegroundColor Red
    exit 1
}

# Wait for services to be ready
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Green
Start-Sleep -Seconds 5

# Check PostgreSQL
Write-Host "🔍 Checking PostgreSQL..." -ForegroundColor Green
$postgresContainer = docker ps -q -f name=postgres
if ($postgresContainer) {
    $maxAttempts = 30
    $attempt = 0
    $postgresReady = $false
    
    while ($attempt -lt $maxAttempts) {
        try {
            docker exec $postgresContainer pg_isready -U admin -d mental_health_db 2>$null | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ PostgreSQL is ready" -ForegroundColor Green
                $postgresReady = $true
                break
            }
        } catch {
            # Continue waiting
        }
        $attempt++
        Start-Sleep -Seconds 1
    }
    
    if (-not $postgresReady) {
        Write-Host "❌ PostgreSQL failed to start" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "⚠️  PostgreSQL container not found" -ForegroundColor Yellow
}

# Check Redis
Write-Host "🔍 Checking Redis..." -ForegroundColor Green
$redisContainer = docker ps -q -f name=redis
if ($redisContainer) {
    $maxAttempts = 30
    $attempt = 0
    $redisReady = $false
    
    while ($attempt -lt $maxAttempts) {
        try {
            docker exec $redisContainer redis-cli ping 2>$null | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Redis is ready" -ForegroundColor Green
                $redisReady = $true
                break
            }
        } catch {
            # Continue waiting
        }
        $attempt++
        Start-Sleep -Seconds 1
    }
    
    if (-not $redisReady) {
        Write-Host "❌ Redis failed to start" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "⚠️  Redis container not found" -ForegroundColor Yellow
}

Write-Host "`n✅ All services are running!" -ForegroundColor Green
Write-Host "`nPostgreSQL: localhost:5432" -ForegroundColor Cyan
Write-Host "Redis: localhost:6379" -ForegroundColor Cyan
Write-Host "`nTo stop services: .\scripts\windows-stop-services.ps1" -ForegroundColor White
Write-Host "To view logs: docker compose logs -f" -ForegroundColor White


