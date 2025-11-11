# Script tự động khởi động project
# Usage: .\start-project.ps1

# Thiết lập encoding UTF-8 cho output (tránh lỗi khi host không hỗ trợ ký tự đặc biệt)
$OutputEncoding = [Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Starting Student Mental Health Dashboard Project..." -ForegroundColor Cyan
Write-Host ""

# Kiểm tra Node.js
Write-Host "Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "Node.js not found! Please install Node.js >= 20.11.0" -ForegroundColor Red
    exit 1
}
Write-Host "Node.js: $nodeVersion" -ForegroundColor Green

# Kiểm tra Docker
Write-Host "Checking Docker..." -ForegroundColor Yellow
docker --version | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker not found! Please install Docker Desktop" -ForegroundColor Red
    exit 1
}
Write-Host "Docker is installed" -ForegroundColor Green

# Kiểm tra và khởi động Docker services
Write-Host ""
Write-Host "Starting Docker services (PostgreSQL & Redis)..." -ForegroundColor Yellow
Set-Location backend
docker compose up -d postgres redis
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to start Docker services" -ForegroundColor Red
    exit 1
}
Write-Host "Docker services started" -ForegroundColor Green
Start-Sleep -Seconds 5

# Kiểm tra backend .env
Write-Host ""
Write-Host "Checking backend .env file..." -ForegroundColor Yellow
if (-not (Test-Path .env)) {
    Write-Host "Backend .env not found, creating from env.example..." -ForegroundColor Yellow
    Copy-Item env.example .env
    Write-Host "Created backend .env file" -ForegroundColor Green
} else {
    Write-Host "Backend .env exists" -ForegroundColor Green
}

# Kiểm tra frontend .env
Set-Location ..
Write-Host ""
Write-Host "Checking frontend .env file..." -ForegroundColor Yellow
if (-not (Test-Path .env)) {
    Write-Host "Frontend .env not found, creating..." -ForegroundColor Yellow
    "VITE_API_BASE_URL=http://localhost:4000/api" | Out-File -FilePath .env -Encoding utf8
    Write-Host "Created frontend .env file" -ForegroundColor Green
} else {
    Write-Host "Frontend .env exists" -ForegroundColor Green
}

# Kiểm tra backend dependencies
Write-Host ""
Write-Host "Checking backend dependencies..." -ForegroundColor Yellow
Set-Location backend
if (-not (Test-Path node_modules)) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install backend dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "Backend dependencies exist" -ForegroundColor Green
}

# Kiểm tra frontend dependencies
Set-Location ..
Write-Host ""
Write-Host "Checking frontend dependencies..." -ForegroundColor Yellow
if (-not (Test-Path node_modules)) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install frontend dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "Frontend dependencies exist" -ForegroundColor Green
}

# Kiểm tra database migrations
Write-Host ""
Write-Host "Checking database migrations..." -ForegroundColor Yellow
Set-Location backend
Write-Host "   Running migrations..." -ForegroundColor Gray
npm run migrate:dev 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Migration may have issues, but continuing..." -ForegroundColor Yellow
} else {
    Write-Host "Database migrations completed" -ForegroundColor Green
}

# Kiểm tra seed data
Write-Host ""
Write-Host "Checking seed data..." -ForegroundColor Yellow
Write-Host "   Running seed..." -ForegroundColor Gray
npm run seed 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Seed may have issues, but continuing..." -ForegroundColor Yellow
} else {
    Write-Host "Seed data loaded" -ForegroundColor Green
}

# Tóm tắt
Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host -ForegroundColor Yellow "Next Steps:"
Write-Host ""
Write-Host -ForegroundColor White "1. Start Backend (Terminal 1):"
Write-Host -ForegroundColor Gray "   cd backend"
Write-Host -ForegroundColor Gray "   npm run dev"
Write-Host ""
Write-Host -ForegroundColor White "2. Start Frontend (Terminal 2):"
Write-Host -ForegroundColor Gray "   npm run dev"
Write-Host ""
Write-Host -ForegroundColor White "3. Open browser:"
Write-Host -ForegroundColor Cyan "   http://localhost:3000"
Write-Host ""
Write-Host -ForegroundColor Yellow "Login Credentials:"
Write-Host -ForegroundColor Gray "   Consultant: consultant@university.edu / password123"
Write-Host -ForegroundColor Gray "   Teacher: teacher@university.edu / password123"
Write-Host -ForegroundColor Gray "   Data Scientist: datascientist@university.edu / password123"
Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan

