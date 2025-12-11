# Script hỗ trợ setup và deploy project (Backend, Frontend, ML Service)
# Usage: .\setup_and_run.ps1

$ErrorActionPreference = "Stop"
$OutputEncoding = [Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Write-Step {
    param([string]$Message)
    Write-Host "`n[STEP] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "   OK: $Message" -ForegroundColor Green
}

function Write-ErrorMsg {
    param([string]$Message)
    Write-Host "   ERROR: $Message" -ForegroundColor Red
}

function Setup-Env {
    param (
        [string]$Dir,
        [string]$DefaultContent
    )
    
    $EnvPath = Join-Path $Dir ".env"
    $ExamplePath = Join-Path $Dir ".env.example"
    
    if (Test-Path $EnvPath) {
        Write-Host "   .env already exists in $Dir" -ForegroundColor Gray
        return
    }

    if (Test-Path $ExamplePath) {
        Write-Host "   Copying .env.example to .env in $Dir..." -ForegroundColor Yellow
        Copy-Item $ExamplePath $EnvPath
    } else {
        Write-Host "   Creating default .env in $Dir..." -ForegroundColor Yellow
        Set-Content -Path $EnvPath -Value $DefaultContent -Encoding UTF8
    }
    Write-Success ".env setup complete for $Dir"
}

# 1. Check Prerequisites
Write-Step "Checking Prerequisites"

# Check Node.js
try {
    $nodeVer = node --version
    Write-Success "Node.js found: $nodeVer"
} catch {
    Write-ErrorMsg "Node.js not found. Please install Node.js (v18/v20 recommended)."
    exit 1
}

# Check Python
try {
    $pyVer = python --version 2>&1
    Write-Success "Python found: $pyVer"
} catch {
    Write-ErrorMsg "Python not found. Please install Python 3.9+."
    exit 1
}

# 2. Setup Backend (Strapi)
Write-Step "Setting up Backend (Strapi)..."

$BackendDefaultEnv = @"
HOST=0.0.0.0
PORT=1337
APP_KEYS=toBeModified1,toBeModified2
API_TOKEN_SALT=tobemodified
ADMIN_JWT_SECRET=tobemodified
TRANSFER_TOKEN_SALT=tobemodified
# Database config (default is SQLite)
JWT_SECRET=tobemodified
"@

Setup-Env -Dir "backend" -DefaultContent $BackendDefaultEnv

if (-not (Test-Path "backend/node_modules")) {
    Write-Host "   Installing backend dependencies..." -ForegroundColor Yellow
    Push-Location backend
    npm install
    Pop-Location
} else {
    Write-Host "   Backend dependencies already installed." -ForegroundColor Gray
}

# Build Backend
if (-not (Test-Path "backend/dist")) {
    Write-Host "   Building backend..." -ForegroundColor Yellow
    Push-Location backend
    npm run build
    Pop-Location
}

# 3. Setup ML Service (FastAPI)
Write-Step "Setting up ML Service..."
if (-not (Test-Path "ml-service/venv")) {
    Write-Host "   Creating Python virtual environment..." -ForegroundColor Yellow
    Push-Location ml-service
    python -m venv venv
    Pop-Location
} else {
    Write-Host "   Virtual environment exists." -ForegroundColor Gray
}

# Install Python deps
Write-Host "   Installing/Checking Python dependencies..." -ForegroundColor Yellow
# We use a script block to run in the venv context without changing current shell permanently
$InstallScript = {
    param($path)
    Set-Location $path
    if ($IsWindows) {
        .\venv\Scripts\activate.ps1
    } else {
        source venv/bin/activate
    }
    pip install -r requirements.txt
}
# Execute the installation in a subprocess to ensure clean env activation
Start-Process powershell -ArgumentList "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", "& { Set-Location 'ml-service'; .\venv\Scripts\Activate.ps1; pip install -r requirements.txt }" -Wait -NoNewWindow


# 4. Setup Frontend (React)
Write-Step "Setting up Frontend..."

$FrontendDefaultEnv = @"
# URL to the Strapi Backend API
VITE_API_BASE_URL=http://localhost:1337/api
"@

Setup-Env -Dir "frontend" -DefaultContent $FrontendDefaultEnv

if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "   Installing frontend dependencies..." -ForegroundColor Yellow
    Push-Location frontend
    npm install
    Pop-Location
} else {
    Write-Host "   Frontend dependencies already installed." -ForegroundColor Gray
}

Write-Step "Setup Complete!"

# 5. Run Option
$Response = Read-Host "Do you want to start all services now? (Y/N)"
if ($Response -eq 'Y' -or $Response -eq 'y') {
    Write-Step "Starting Services in new windows..."

    # Start Backend
    Write-Host "   Starting Backend (Port 1337)..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", "cd backend; npm run develop"

    # Start ML Service
    Write-Host "   Starting ML Service (Port 8000)..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", "cd ml-service; .\venv\Scripts\Activate.ps1; python main.py"

    # Start Frontend
    Write-Host "   Starting Frontend (Port 5173)..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", "cd frontend; npm run dev"

    Write-Step "All services launched!"
    Write-Host "   Backend: http://localhost:1337/admin"
    Write-Host "   ML Service: http://localhost:8000/docs"
    Write-Host "   Frontend: http://localhost:5173"
} else {
    Write-Host "You can start services manually or run this script again."
}

