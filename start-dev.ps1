Write-Host "🚀 Starting Personal Finance Visualizer..." -ForegroundColor Green
Write-Host ""
Write-Host "📱 Frontend will run on: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend will run on: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting both servers..." -ForegroundColor Yellow

try {
    npm run dev:full
} catch {
    Write-Host "❌ Error starting servers: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Make sure:" -ForegroundColor Yellow
    Write-Host "1. You're in the project root directory" -ForegroundColor White
    Write-Host "2. All dependencies are installed (npm install)" -ForegroundColor White
    Write-Host "3. Backend .env file is configured" -ForegroundColor White
} 