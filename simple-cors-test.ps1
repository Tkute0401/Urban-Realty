# Simple CORS Test Script
Write-Host "Testing CORS Configuration..." -ForegroundColor Cyan

$localAPI = "http://localhost:3001"
$productionAPI = "https://urban-realty-production.up.railway.app"

Write-Host "`nTesting Local Health Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$localAPI/api/v1/health" -Method GET -Headers @{"Origin"="https://www.squarefooot.com"} -UseBasicParsing
    Write-Host "✅ Local Health Check: SUCCESS - Status $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Local Health Check: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTesting Local Test Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$localAPI/api/v1/test" -Method GET -Headers @{"Origin"="https://www.squarefooot.com"} -UseBasicParsing
    Write-Host "✅ Local Test Endpoint: SUCCESS - Status $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Local Test Endpoint: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTesting Production Health Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$productionAPI/api/v1/health" -Method GET -Headers @{"Origin"="https://www.squarefooot.com"} -UseBasicParsing
    Write-Host "✅ Production Health Check: SUCCESS - Status $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Production Health Check: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTesting Production Properties Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$productionAPI/api/v1/properties/featured" -Method GET -Headers @{"Origin"="https://www.squarefooot.com"} -UseBasicParsing
    Write-Host "✅ Production Properties: SUCCESS - Status $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response length: $($response.Content.Length) characters" -ForegroundColor Gray
} catch {
    Write-Host "❌ Production Properties: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nCORS Test Completed!" -ForegroundColor Cyan