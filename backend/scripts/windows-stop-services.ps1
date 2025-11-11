# Stop Docker services on Windows

Write-Host "🛑 Stopping Docker services..." -ForegroundColor Green

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

Invoke-Expression "$composeCmd stop postgres redis"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Services stopped" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some services may not have been running" -ForegroundColor Yellow
}


