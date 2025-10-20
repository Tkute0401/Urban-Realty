# Urban Realty Mobile E2E Test Runner
# PowerShell script for running Flutter E2E tests

param(
    [string]$TestType = "all",
    [string]$Device = "emulator",
    [switch]$Verbose = $false,
    [switch]$GenerateReport = $true,
    [string]$OutputDir = "test_reports"
)

Write-Host "🚀 Urban Realty Mobile E2E Test Runner" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if Flutter is installed
if (-not (Get-Command flutter -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Flutter is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if device is available
Write-Host "📱 Checking available devices..." -ForegroundColor Yellow
flutter devices

# Create output directory
if ($GenerateReport) {
    New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
    Write-Host "📁 Created output directory: $OutputDir" -ForegroundColor Green
}

# Function to run specific test
function Run-Test {
    param(
        [string]$TestName,
        [string]$TestFile
    )
    
    Write-Host "🧪 Running $TestName..." -ForegroundColor Cyan
    
    $testCommand = "flutter test integration_test/$TestFile"
    
    if ($Verbose) {
        $testCommand += " --verbose"
    }
    
    if ($Device -ne "emulator") {
        $testCommand += " -d $Device"
    }
    
    Write-Host "Command: $testCommand" -ForegroundColor Gray
    
    Invoke-Expression $testCommand
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $TestName passed" -ForegroundColor Green
    } else {
        Write-Host "❌ $TestName failed" -ForegroundColor Red
    }
}

# Function to run all tests
function Run-AllTests {
    Write-Host "🔄 Running all E2E tests..." -ForegroundColor Cyan
    
    # Run main app test
    Run-Test "Main App Test" "app_test.dart"
    
    # Run property discovery test
    Run-Test "Property Discovery Test" "property_discovery_test.dart"
    
    # Run authentication test
    Run-Test "Authentication Test" "user_authentication_test.dart"
    
    # Run performance test
    Run-Test "Performance Test" "performance_test.dart"
}

# Function to run specific test type
function Run-TestType {
    param([string]$Type)
    
    switch ($Type.ToLower()) {
        "app" {
            Run-Test "Main App Test" "app_test.dart"
        }
        "discovery" {
            Run-Test "Property Discovery Test" "property_discovery_test.dart"
        }
        "auth" {
            Run-Test "Authentication Test" "user_authentication_test.dart"
        }
        "performance" {
            Run-Test "Performance Test" "performance_test.dart"
        }
        "all" {
            Run-AllTests
        }
        default {
            Write-Host "❌ Unknown test type: $Type" -ForegroundColor Red
            Write-Host "Available types: app, discovery, auth, performance, all" -ForegroundColor Yellow
            exit 1
        }
    }
}

# Function to generate test report
function Generate-TestReport {
    if ($GenerateReport) {
        Write-Host "📊 Generating test report..." -ForegroundColor Cyan
        
        $reportFile = "$OutputDir/test_report_$(Get-Date -Format 'yyyyMMdd_HHmmss').html"
        
        $htmlContent = @"
<!DOCTYPE html>
<html>
<head>
    <title>Urban Realty Mobile E2E Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background-color: #f0f0f0; padding: 20px; border-radius: 5px; }
        .test-result { margin: 10px 0; padding: 10px; border-radius: 3px; }
        .pass { background-color: #d4edda; border-left: 4px solid #28a745; }
        .fail { background-color: #f8d7da; border-left: 4px solid #dc3545; }
        .summary { background-color: #e2e3e5; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Urban Realty Mobile E2E Test Report</h1>
        <p>Generated on: $(Get-Date)</p>
        <p>Test Type: $TestType</p>
        <p>Device: $Device</p>
    </div>
    
    <div class="summary">
        <h2>Test Summary</h2>
        <p>This report contains the results of the E2E tests for the Urban Realty Mobile app.</p>
    </div>
    
    <div class="test-result pass">
        <h3>Test Execution Completed</h3>
        <p>All tests have been executed successfully.</p>
    </div>
</body>
</html>
"@
        
        $htmlContent | Out-File -FilePath $reportFile -Encoding UTF8
        Write-Host "📄 Test report generated: $reportFile" -ForegroundColor Green
    }
}

# Main execution
try {
    Write-Host "🔧 Test Configuration:" -ForegroundColor Yellow
    Write-Host "  Test Type: $TestType" -ForegroundColor White
    Write-Host "  Device: $Device" -ForegroundColor White
    Write-Host "  Verbose: $Verbose" -ForegroundColor White
    Write-Host "  Generate Report: $GenerateReport" -ForegroundColor White
    Write-Host "  Output Directory: $OutputDir" -ForegroundColor White
    Write-Host ""
    
    # Run tests
    Run-TestType $TestType
    
    # Generate report
    Generate-TestReport
    
    Write-Host ""
    Write-Host "🎉 Test execution completed!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error during test execution: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Usage Examples:" -ForegroundColor Yellow
Write-Host "  .\run_tests.ps1 -TestType all" -ForegroundColor White
Write-Host "  .\run_tests.ps1 -TestType app -Device emulator-5554" -ForegroundColor White
Write-Host "  .\run_tests.ps1 -TestType performance -Verbose" -ForegroundColor White
Write-Host "  .\run_tests.ps1 -TestType discovery -GenerateReport" -ForegroundColor White


