# ============================================
# AI Doctor - PowerShell Setup & Start Script
# ============================================
# Run with: .\start.ps1
# Or: powershell -ExecutionPolicy Bypass -File .\start.ps1

Write-Host "`n" -ForegroundColor Cyan
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║   🩺 AI Doctor - Setup & Start       ║" -ForegroundColor Blue
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Cyan
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found! Please install from https://nodejs.org" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Check npm
Write-Host "Checking npm installation..." -ForegroundColor Cyan
$npmVersion = npm --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "❌ npm not found! Please reinstall Node.js" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Clean port 3000
Write-Host "Cleaning up port 3000..." -ForegroundColor Cyan
try {
    $process = Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -eq "node" }
    if ($process) {
        Write-Host "⚠️  Stopping existing Node processes..." -ForegroundColor Yellow
        $process | Stop-Process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        Write-Host "✅ Processes stopped" -ForegroundColor Green
    } else {
        Write-Host "✅ No Node processes found" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Could not stop Node processes: $_" -ForegroundColor Yellow
}
Write-Host ""

# Check .env
Write-Host "Checking .env file..." -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found" -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ Created .env from .env.example" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  IMPORTANT: Update your .env file!" -ForegroundColor Yellow
        Write-Host "  1. Get SUPABASE_SERVICE_ROLE_KEY from Supabase Settings > API" -ForegroundColor Yellow
        Write-Host "  2. Update JWT_SECRET with a secure key" -ForegroundColor Yellow
        Write-Host ""
        $response = Read-Host "Press Enter to continue or 'exit' to quit"
        if ($response -eq "exit") { exit 0 }
    } else {
        Write-Host "❌ .env.example not found" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "✅ .env file found" -ForegroundColor Green
}
Write-Host ""

# Check dependencies
Write-Host "Checking dependencies..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  node_modules not found, installing..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ npm install failed!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}
Write-Host ""

# Run diagnostic
Write-Host "Running system diagnostic..." -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
node scripts/diagnostic.js
Write-Host ""

# Start server
Write-Host ""
Write-Host "Attempting to start server..." -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

npm run dev

Read-Host "`nPress Enter to exit"
