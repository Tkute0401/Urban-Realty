# CORS Test Script for Squarefooot API
Write-Host "🧪 Testing CORS Configuration for Squarefooot API" -ForegroundColor Cyan

$localAPI = "http://localhost:3001"
$productionAPI = "https://urban-realty-production.up.railway.app"
$testOrigin = "https://www.squarefooot.com"

function Test-CORSEndpoint {
    param(
        [string]$Url,
        [string]$Origin,
        [string]$Description
    )
    
    Write-Host "`n📍 Testing: $Description" -ForegroundColor Yellow
    Write-Host "   URL: $Url" -ForegroundColor Gray
    Write-Host "   Origin: $Origin" -ForegroundColor Gray
    
    try {
        # Test preflight request (OPTIONS)
        Write-Host "   🔄 Sending OPTIONS request (preflight)..." -ForegroundColor Blue
        $optionsResponse = Invoke-WebRequest -Uri $Url -Method OPTIONS -Headers @{
            "Origin" = $Origin
            "Access-Control-Request-Method" = "GET"
            "Access-Control-Request-Headers" = "Content-Type"
        } -UseBasicParsing -ErrorAction Stop
        
        Write-Host "   ✅ OPTIONS Response: $($optionsResponse.StatusCode)" -ForegroundColor Green
        
        # Check CORS headers in OPTIONS response
        $corsHeaders = @{}
        if ($optionsResponse.Headers."Access-Control-Allow-Origin") {
            $corsHeaders["Access-Control-Allow-Origin"] = $optionsResponse.Headers."Access-Control-Allow-Origin"
            Write-Host "   🔑 Access-Control-Allow-Origin: $($corsHeaders['Access-Control-Allow-Origin'])" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Missing Access-Control-Allow-Origin header" -ForegroundColor Red
        }
        
        if ($optionsResponse.Headers."Access-Control-Allow-Methods") {
            $corsHeaders["Access-Control-Allow-Methods"] = $optionsResponse.Headers."Access-Control-Allow-Methods"
            Write-Host "   🔑 Access-Control-Allow-Methods: $($corsHeaders['Access-Control-Allow-Methods'])" -ForegroundColor Green
        }
        
        if ($optionsResponse.Headers."Access-Control-Allow-Credentials") {
            $corsHeaders["Access-Control-Allow-Credentials"] = $optionsResponse.Headers."Access-Control-Allow-Credentials"
            Write-Host "   🔑 Access-Control-Allow-Credentials: $($corsHeaders['Access-Control-Allow-Credentials'])" -ForegroundColor Green
        }
        
        # Test actual GET request
        Write-Host "   🔄 Sending GET request..." -ForegroundColor Blue
        $getResponse = Invoke-WebRequest -Uri $Url -Method GET -Headers @{
            "Origin" = $Origin
        } -UseBasicParsing -ErrorAction Stop
        
        Write-Host "   ✅ GET Response: $($getResponse.StatusCode)" -ForegroundColor Green
        
        # Parse JSON response if possible
        try {
            $jsonResponse = $getResponse.Content | ConvertFrom-Json
            Write-Host "   📄 Response Data:" -ForegroundColor Cyan
            Write-Host "      $($jsonResponse | ConvertTo-Json -Compress)" -ForegroundColor Gray
        } catch {
            Write-Host "   📄 Response: $($getResponse.Content.Substring(0, [Math]::Min(100, $getResponse.Content.Length)))..." -ForegroundColor Gray
        }
        
        return $true
        
    } catch {
        Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            Write-Host "   📊 Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        }
        return $false
    }
}

# Test endpoints
Write-Host "`n🎯 Testing Local Development Server" -ForegroundColor Magenta
$localHealth = Test-CORSEndpoint "$localAPI/api/v1/health" $testOrigin "Local Health Check"
$localTest = Test-CORSEndpoint "$localAPI/api/v1/test" $testOrigin "Local Test Endpoint"

Write-Host "`n🌐 Testing Production Server" -ForegroundColor Magenta
$prodHealth = Test-CORSEndpoint "$productionAPI/api/v1/health" $testOrigin "Production Health Check"
$prodProperties = Test-CORSEndpoint "$productionAPI/api/v1/properties/featured" $testOrigin "Production Featured Properties"

# Summary
Write-Host "`n📊 CORS Test Summary" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Cyan
Write-Host "Local Health Check: $(if($localHealth){'✅ PASS'}else{'❌ FAIL'})" -ForegroundColor $(if($localHealth){'Green'}else{'Red'})
Write-Host "Local Test Endpoint: $(if($localTest){'✅ PASS'}else{'❌ FAIL'})" -ForegroundColor $(if($localTest){'Green'}else{'Red'})
Write-Host "Production Health Check: $(if($prodHealth){'✅ PASS'}else{'❌ FAIL'})" -ForegroundColor $(if($prodHealth){'Green'}else{'Red'})
Write-Host "Production Properties: $(if($prodProperties){'✅ PASS'}else{'❌ FAIL'})" -ForegroundColor $(if($prodProperties){'Green'}else{'Red'})

if ($localHealth -and $localTest) {
    Write-Host "`n🎉 Local CORS configuration is working correctly!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Local CORS configuration needs attention." -ForegroundColor Yellow
}

if ($prodHealth -and $prodProperties) {
    Write-Host "🎉 Production CORS configuration is working correctly!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Production CORS configuration needs to be updated." -ForegroundColor Yellow
    Write-Host "`n📝 To fix production CORS:" -ForegroundColor Cyan
    Write-Host "   1. Go to Railway dashboard" -ForegroundColor White
    Write-Host "   2. Navigate to your project's Environment Variables" -ForegroundColor White
    Write-Host "   3. Set CORS_ORIGIN to: https://your-app.up.railway.app,https://www.squarefooot.com" -ForegroundColor White
    Write-Host "   4. Redeploy the application" -ForegroundColor White
}

Write-Host "`n✨ Test completed!" -ForegroundColor Cyan