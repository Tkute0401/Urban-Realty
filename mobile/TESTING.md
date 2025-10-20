# Urban Realty Mobile E2E Testing Guide

## Overview

This document provides comprehensive guidance for running end-to-end (E2E) tests for the Urban Realty Mobile Flutter application. The testing framework includes automated tests for user journeys, performance, and error handling.

## Test Structure

```
mobile/
├── integration_test/
│   ├── app_test.dart                 # Main E2E test suite
│   ├── property_discovery_test.dart  # Property search and discovery tests
│   ├── user_authentication_test.dart # Authentication and profile tests
│   ├── performance_test.dart         # Performance and load tests
│   └── test_config.dart             # Test configuration and utilities
├── test/
│   ├── unit/                        # Unit tests
│   ├── widget/                      # Widget tests
│   └── integration/                 # Integration tests
├── test_config.yaml                 # Test configuration file
├── run_tests.ps1                    # PowerShell test runner
└── TESTING.md                       # This documentation
```

## Prerequisites

### Required Software
- Flutter SDK (3.35.2 or higher)
- Android Studio with Android SDK
- Android Emulator or physical device
- PowerShell (for Windows test runner)

### Required Dependencies
```yaml
dev_dependencies:
  integration_test:
    sdk: flutter
  patrol: ^3.0.0
  test: ^1.24.0
  fake_async: ^1.3.1
  http_mock_adapter: ^0.6.1
  flutter_driver:
    sdk: flutter
```

## Running Tests

### 1. Quick Start

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
flutter pub get

# Run all E2E tests
flutter test integration_test/
```

### 2. Using PowerShell Test Runner

```powershell
# Run all tests
.\run_tests.ps1

# Run specific test type
.\run_tests.ps1 -TestType app
.\run_tests.ps1 -TestType discovery
.\run_tests.ps1 -TestType auth
.\run_tests.ps1 -TestType performance

# Run with specific device
.\run_tests.ps1 -Device emulator-5554

# Run with verbose output
.\run_tests.ps1 -Verbose

# Generate test report
.\run_tests.ps1 -GenerateReport
```

### 3. Individual Test Files

```bash
# Run main app test
flutter test integration_test/app_test.dart

# Run property discovery test
flutter test integration_test/property_discovery_test.dart

# Run authentication test
flutter test integration_test/user_authentication_test.dart

# Run performance test
flutter test integration_test/performance_test.dart
```

## Test Categories

### 1. Main App Tests (`app_test.dart`)
- **Purpose**: Complete user journey testing
- **Coverage**: App launch, authentication, navigation, property interactions
- **Duration**: ~5-10 minutes

**Key Test Scenarios:**
- App launch and splash screen
- Authentication flow (login/logout)
- Home screen navigation
- Property search and filtering
- Property details navigation
- Favorites and user interactions
- Profile and settings management
- Tab navigation

### 2. Property Discovery Tests (`property_discovery_test.dart`)
- **Purpose**: Property search and discovery functionality
- **Coverage**: Search, filtering, property listing, details
- **Duration**: ~3-5 minutes

**Key Test Scenarios:**
- Search functionality with various queries
- Filter options (price, bedrooms, bathrooms, type)
- Property listing and scrolling performance
- Property details navigation
- Favorites functionality
- Property comparison feature

### 3. User Authentication Tests (`user_authentication_test.dart`)
- **Purpose**: Authentication and profile management
- **Coverage**: Login, registration, profile editing, settings
- **Duration**: ~3-5 minutes

**Key Test Scenarios:**
- Login flow with valid/invalid credentials
- Registration process
- Password reset flow
- Profile management and editing
- Settings and preferences
- Session management and auto-login
- Logout functionality

### 4. Performance Tests (`performance_test.dart`)
- **Purpose**: App performance and optimization
- **Coverage**: Launch time, scrolling, memory, network
- **Duration**: ~5-8 minutes

**Key Test Scenarios:**
- App launch performance
- Scroll performance (vertical and horizontal)
- Image loading and caching performance
- Memory usage during navigation and scrolling
- API response times
- Offline handling
- Battery usage testing

## Test Configuration

### Environment Variables
```yaml
# test_config.yaml
environment:
  api_base_url: "https://urban-realty-production.up.railway.app/api/v1"
  test_timeout: 30
  screenshot_enabled: true
  video_recording: false
```

### Test Data
```yaml
test_data:
  users:
    valid_user:
      email: "test@example.com"
      password: "testpassword123"
      name: "Test User"
      phone: "+1234567890"
  
  properties:
    test_property_id: "68f22d6c2a0dece5cccdd865"
    search_queries: ["apartment", "villa", "luxury home"]
```

### Performance Thresholds
```yaml
performance:
  app_launch_time: 3000  # milliseconds
  scroll_fps: 60
  image_loading_time: 5000  # milliseconds
  api_response_time: 2000  # milliseconds
  memory_usage_mb: 200
```

## Test Utilities

### TestHelpers Class
```dart
// Wait for widget to appear
await TestHelpers.waitForWidget(tester, finder);

// Tap widget safely
await TestHelpers.tapSafely(tester, finder);

// Enter text safely
await TestHelpers.enterTextSafely(tester, finder, text);

// Scroll to widget
await TestHelpers.scrollToWidget(tester, finder);

// Take screenshot
await TestHelpers.takeScreenshot(tester, name);
```

### PerformanceTestUtils Class
```dart
// Measure build time
final buildTime = await PerformanceTestUtils.measureBuildTime(tester, widget);

// Measure scroll performance
final scrollTime = await PerformanceTestUtils.measureScrollPerformance(tester, finder, offset);

// Check for frame drops
final hasFrameDrops = await PerformanceTestUtils.checkForFrameDrops(tester, duration);
```

## Continuous Integration

### GitHub Actions
The project includes automated CI/CD testing via GitHub Actions:

```yaml
# .github/workflows/e2e-tests.yml
- Runs on every push and pull request
- Tests on multiple Android devices
- Generates test reports and screenshots
- Includes performance and security tests
```

### Test Reports
- **HTML Reports**: Generated in `test_reports/` directory
- **Screenshots**: Captured during test execution
- **Performance Metrics**: JSON format for analysis
- **Artifacts**: Uploaded to GitHub Actions

## Troubleshooting

### Common Issues

#### 1. Emulator Not Found
```bash
# List available devices
flutter devices

# Start emulator
flutter emulators --launch Pixel_8a
```

#### 2. Test Timeout
```bash
# Increase timeout
flutter test integration_test/app_test.dart --timeout=60s
```

#### 3. Build Failures
```bash
# Clean and rebuild
flutter clean
flutter pub get
flutter test integration_test/
```

#### 4. Permission Issues
```bash
# Grant execution permission (Linux/Mac)
chmod +x run_tests.ps1
```

### Debug Mode
```bash
# Run tests in debug mode
flutter test integration_test/app_test.dart --debug

# Enable verbose logging
flutter test integration_test/app_test.dart --verbose
```

## Best Practices

### 1. Test Organization
- Group related tests in the same file
- Use descriptive test names
- Keep tests independent and isolated
- Clean up after each test

### 2. Performance Testing
- Run performance tests on real devices when possible
- Monitor memory usage during long test runs
- Test under various network conditions
- Measure both cold and warm app launches

### 3. Error Handling
- Test both success and failure scenarios
- Verify error messages are user-friendly
- Test offline and network error conditions
- Validate recovery mechanisms

### 4. Maintenance
- Update tests when UI changes
- Review and update test data regularly
- Monitor test execution times
- Keep dependencies up to date

## Test Data Management

### Mock Data
- Use `TestDataGenerator` for creating test data
- Mock external API calls when possible
- Use consistent test data across tests
- Clean up test data after execution

### Test Database
- Use separate test database
- Reset database state between tests
- Avoid using production data in tests
- Implement proper cleanup mechanisms

## Reporting and Analytics

### Test Metrics
- **Pass Rate**: Percentage of passing tests
- **Execution Time**: Total test execution duration
- **Coverage**: Code coverage percentage
- **Performance**: Key performance indicators

### Test Reports
- **HTML Reports**: Human-readable test results
- **JSON Reports**: Machine-readable data
- **Screenshots**: Visual test evidence
- **Videos**: Recorded test sessions (optional)

## Contributing

### Adding New Tests
1. Create test file in appropriate directory
2. Follow existing naming conventions
3. Include proper documentation
4. Add to test runner script
5. Update CI/CD configuration

### Test Review Process
1. All tests must pass before merging
2. Performance tests must meet thresholds
3. Security tests must pass
4. Documentation must be updated

## Support

For questions or issues with testing:
- Check this documentation first
- Review test logs and error messages
- Consult Flutter testing documentation
- Contact the development team

---

**Last Updated**: October 2024
**Version**: 1.0.0
**Maintainer**: Urban Realty Development Team


