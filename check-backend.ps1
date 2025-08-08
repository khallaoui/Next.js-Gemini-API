Write-Host "🔍 Backend Diagnostic Tool" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Check if port 8080 is in use
Write-Host "1. Checking port 8080..." -ForegroundColor Yellow
$port8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($port8080) {
    Write-Host "✅ Port 8080 is in use" -ForegroundColor Green
    Write-Host "   Process: $($port8080.OwningProcess)" -ForegroundColor Gray
} else {
    Write-Host "❌ Port 8080 is not in use" -ForegroundColor Red
    Write-Host "   Your Spring Boot backend is not running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 To start your backend:" -ForegroundColor Yellow
    Write-Host "   1. Find your Spring Boot project directory" -ForegroundColor Gray
    Write-Host "   2. Run: mvn spring-boot:run" -ForegroundColor Gray
    Write-Host "   3. Or: ./mvnw spring-boot:run" -ForegroundColor Gray
}

Write-Host ""

# Test basic connectivity
Write-Host "2. Testing basic connectivity..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -Method Get -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Backend is responding (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is not responding" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""

# Test API endpoints
$endpoints = @(
    "/api/pensioners",
    "/api/affilies", 
    "/api/allocataires",
    "/api/groups",
    "/actuator/health"
)

Write-Host "3. Testing API endpoints..." -ForegroundColor Yellow
foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080$endpoint" -Method Get -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✅ $endpoint (Status: $($response.StatusCode))" -ForegroundColor Green
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode) {
            Write-Host "⚠️  $endpoint (Status: $statusCode)" -ForegroundColor Yellow
        } else {
            Write-Host "❌ $endpoint (No response)" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "==========" -ForegroundColor Cyan

if (-not $port8080) {
    Write-Host "🚨 MAIN ISSUE: Spring Boot backend is not running" -ForegroundColor Red
    Write-Host ""
    Write-Host "SOLUTION:" -ForegroundColor Yellow
    Write-Host "1. Navigate to your Spring Boot project directory" -ForegroundColor White
    Write-Host "2. Look for pom.xml or build.gradle file" -ForegroundColor White
    Write-Host "3. Run: mvn spring-boot:run (or ./mvnw spring-boot:run)" -ForegroundColor White
    Write-Host "4. Wait for 'Started Application' message" -ForegroundColor White
} else {
    Write-Host "✅ Backend is running" -ForegroundColor Green
    Write-Host "If you're still getting 404s, your controllers might be missing" -ForegroundColor Yellow
    Write-Host "Check BACKEND_SETUP_GUIDE.md for controller examples" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")