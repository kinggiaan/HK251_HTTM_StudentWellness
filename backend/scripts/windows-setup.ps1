# Windows Setup Script for Backend
# Run this script in PowerShell (as Administrator if needed)

Write-Host "🚀 Setting up Backend for Windows..." -ForegroundColor Green

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

# Check Node.js
Write-Host "`n📦 Checking Node.js..." -ForegroundColor Green
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js not found. Please install Node.js 20+ from https://nodejs.org/" -ForegroundColor Red
    Write-Host "   Or use: winget install OpenJS.NodeJS.LTS" -ForegroundColor Yellow
    exit 1
} else {
    $nodeVersion = node -v
    $nodeMajorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($nodeMajorVersion -lt 20) {
        Write-Host "❌ Node.js version $nodeVersion is too old. Please upgrade to Node.js 20+" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Node.js $nodeVersion found (yêu cầu: >=20.11.0)" -ForegroundColor Green
}

# Check npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm not found" -ForegroundColor Red
    exit 1
} else {
    $npmVersion = npm -v
    Write-Host "✅ npm $npmVersion found" -ForegroundColor Green
}

# Check Docker
Write-Host "`n🐳 Checking Docker..." -ForegroundColor Green
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker not found. Please install Docker Desktop from https://www.docker.com/products/docker-desktop/" -ForegroundColor Red
    Write-Host "   Or use: winget install Docker.DockerDesktop" -ForegroundColor Yellow
    exit 1
} else {
    $dockerVersion = docker --version
    Write-Host "✅ Docker $dockerVersion found" -ForegroundColor Green
}

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop" -ForegroundColor Red
    exit 1
}

# Check Docker Compose
if (-not (docker compose version 2>$null)) {
    if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
        Write-Host "⚠️  Docker Compose not found" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Docker Compose found" -ForegroundColor Green
    }
} else {
    Write-Host "✅ Docker Compose found" -ForegroundColor Green
}

# Install dependencies
Write-Host "`n📦 Installing npm dependencies..." -ForegroundColor Green
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Generate Prisma Client
Write-Host "`n🔧 Generating Prisma Client..." -ForegroundColor Green
npm run prisma:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}

# Create .env file if it doesn't exist
if (-not (Test-Path .env)) {
    Write-Host "`n📝 Creating .env file from env.example..." -ForegroundColor Green
    Copy-Item env.example .env
    Write-Host "⚠️  Please edit .env file with your configuration" -ForegroundColor Yellow
} else {
    Write-Host "`n✅ .env file already exists" -ForegroundColor Green
}

# Generate JWT secrets if not set
$envContent = Get-Content .env -Raw
if ($envContent -match "JWT_SECRET=change-me" -or $envContent -match "JWT_SECRET=$") {
    Write-Host "`n🔐 Generating secure JWT secrets..." -ForegroundColor Green
    
    # Generate random secrets
    $jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
    $refreshSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
    
    # Update .env file
    $envContent = $envContent -replace "JWT_SECRET=change-me", "JWT_SECRET=$jwtSecret"
    $envContent = $envContent -replace "REFRESH_TOKEN_SECRET=change-me-too", "REFRESH_TOKEN_SECRET=$refreshSecret"
    Set-Content -Path .env -Value $envContent -NoNewline
    
    Write-Host "✅ JWT secrets generated and updated in .env" -ForegroundColor Green
}

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Start Docker services: .\scripts\windows-start-services.ps1" -ForegroundColor White
Write-Host "2. Run migrations: npm run migrate:dev" -ForegroundColor White
Write-Host "3. Seed database (optional): npm run seed" -ForegroundColor White
Write-Host "4. Start dev server: npm run dev" -ForegroundColor White


