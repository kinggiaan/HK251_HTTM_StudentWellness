# Start ML Python Service
Write-Host "🚀 Starting ML Python Service on port 8000..." -ForegroundColor Cyan

# Check if Python is installed
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Python not found! Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

# Check if venv exists
if (!(Test-Path "venv")) {
    Write-Host "📦 Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate venv
Write-Host "🔧 Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Start server
Write-Host "✅ Starting FastAPI server..." -ForegroundColor Green
Write-Host "📡 ML Service will be available at http://localhost:8000" -ForegroundColor Green
Write-Host "📚 API docs at http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""
python main.py
