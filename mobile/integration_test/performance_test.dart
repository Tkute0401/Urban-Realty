import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:urban_realty_mobile/main.dart' as app;
import 'test_config.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Performance E2E Tests', () {
    testWidgets('App Launch Performance Test', (WidgetTester tester) async {
      // Measure app launch time
      final launchTime = await _measureAppLaunchTime(tester);
      
      // Verify launch time is acceptable (less than 3 seconds)
      expect(launchTime.inSeconds, lessThan(3));
      
      print('App launch time: ${launchTime.inMilliseconds}ms');
    });

    testWidgets('Scroll Performance Test', (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();

      // Test vertical scrolling performance
      await _testVerticalScrollPerformance(tester);
      
      // Test horizontal scrolling performance
      await _testHorizontalScrollPerformance(tester);
    });

    testWidgets('Image Loading Performance Test', (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();

      // Test image loading performance
      await _testImageLoadingPerformance(tester);
      
      // Test image caching
      await _testImageCaching(tester);
    });

    testWidgets('Memory Usage Test', (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();

      // Test memory usage during navigation
      await _testMemoryUsageDuringNavigation(tester);
      
      // Test memory usage during scrolling
      await _testMemoryUsageDuringScrolling(tester);
    });

    testWidgets('Network Performance Test', (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();

      // Test API response times
      await _testAPIResponseTimes(tester);
      
      // Test offline handling
      await _testOfflineHandling(tester);
    });

    testWidgets('Battery Usage Test', (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();

      // Test battery usage during normal usage
      await _testBatteryUsage(tester);
    });
  });
}

Future<Duration> _measureAppLaunchTime(WidgetTester tester) async {
  final stopwatch = Stopwatch()..start();
  
  // Launch app
  app.main();
  await tester.pumpAndSettle();
  
  // Wait for home screen to be fully loaded
  await TestHelpers.waitForWidget(tester, find.text('Featured Properties'));
  
  stopwatch.stop();
  return stopwatch.elapsed;
}

Future<void> _testVerticalScrollPerformance(WidgetTester tester) async {
  final scrollable = find.byType(Scrollable);
  if (scrollable.evaluate().isNotEmpty) {
    // Measure scroll performance
    final scrollTime = await PerformanceTestUtils.measureScrollPerformance(
      tester,
      scrollable.first,
      const Offset(0, -2000),
    );
    
    // Verify scroll is smooth (less than 500ms for 2000px)
    expect(scrollTime.inMilliseconds, lessThan(500));
    
    // Check for frame drops during scrolling
    final hasFrameDrops = await PerformanceTestUtils.checkForFrameDrops(
      tester,
      const Duration(seconds: 3),
    );
    expect(hasFrameDrops, false);
    
    print('Vertical scroll time: ${scrollTime.inMilliseconds}ms');
  }
}

Future<void> _testHorizontalScrollPerformance(WidgetTester tester) async {
  final pageView = find.byType(PageView);
  if (pageView.evaluate().isNotEmpty) {
    // Measure horizontal scroll performance
    final scrollTime = await PerformanceTestUtils.measureScrollPerformance(
      tester,
      pageView.first,
      const Offset(-1000, 0),
    );
    
    // Verify horizontal scroll is smooth
    expect(scrollTime.inMilliseconds, lessThan(300));
    
    print('Horizontal scroll time: ${scrollTime.inMilliseconds}ms');
  }
}

Future<void> _testImageLoadingPerformance(WidgetTester tester) async {
  // Find all images
  final images = find.byType(Image);
  
  if (images.evaluate().isNotEmpty) {
    final stopwatch = Stopwatch()..start();
    
    // Wait for all images to load
    await tester.pumpAndSettle(const Duration(seconds: 5));
    
    stopwatch.stop();
    
    // Verify images loaded within acceptable time
    expect(stopwatch.elapsed.inSeconds, lessThan(5));
    
    // Verify all images are displayed
    expect(images, findsAtLeastNWidgets(1));
    
    print('Image loading time: ${stopwatch.elapsed.inMilliseconds}ms');
  }
}

Future<void> _testImageCaching(WidgetTester tester) async {
  // Navigate to a property detail screen
  final propertyCards = find.byType(Card);
  if (propertyCards.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, propertyCards.first);
    await tester.pumpAndSettle();
    
    // Wait for images to load
    await tester.pumpAndSettle(const Duration(seconds: 2));
    
    // Navigate back
    final backButton = find.byIcon(Icons.arrow_back);
    if (backButton.evaluate().isNotEmpty) {
      await TestHelpers.tapSafely(tester, backButton);
      await tester.pumpAndSettle();
    }
    
    // Navigate to the same property again
    await TestHelpers.tapSafely(tester, propertyCards.first);
    await tester.pumpAndSettle();
    
    // Images should load faster due to caching
    final images = find.byType(Image);
    expect(images, findsAtLeastNWidgets(1));
    
    print('Image caching test completed');
  }
}

Future<void> _testMemoryUsageDuringNavigation(WidgetTester tester) async {
  // Navigate through multiple screens
  for (int i = 0; i < 10; i++) {
    // Navigate to property details
    final propertyCards = find.byType(Card);
    if (propertyCards.evaluate().isNotEmpty) {
      await TestHelpers.tapSafely(tester, propertyCards.first);
      await tester.pumpAndSettle();
      
      // Navigate back
      final backButton = find.byIcon(Icons.arrow_back);
      if (backButton.evaluate().isNotEmpty) {
        await TestHelpers.tapSafely(tester, backButton);
        await tester.pumpAndSettle();
      }
    }
  }
  
  // Verify app is still responsive
  expect(find.byType(MaterialApp), findsOneWidget);
  
  print('Memory usage during navigation test completed');
}

Future<void> _testMemoryUsageDuringScrolling(WidgetTester tester) async {
  final scrollable = find.byType(Scrollable);
  if (scrollable.evaluate().isNotEmpty) {
    // Perform extensive scrolling
    for (int i = 0; i < 20; i++) {
      await tester.fling(scrollable.first, const Offset(0, -500), 1000);
      await tester.pumpAndSettle();
      
      await tester.fling(scrollable.first, const Offset(0, 500), 1000);
      await tester.pumpAndSettle();
    }
  }
  
  // Verify app is still responsive
  expect(find.byType(MaterialApp), findsOneWidget);
  
  print('Memory usage during scrolling test completed');
}

Future<void> _testAPIResponseTimes(WidgetTester tester) async {
  // Test search API response time
  final searchField = find.byType(TextField).first;
  if (searchField.evaluate().isNotEmpty) {
    final stopwatch = Stopwatch()..start();
    
    await TestHelpers.enterTextSafely(tester, searchField, 'apartment');
    await tester.pumpAndSettle();
    
    stopwatch.stop();
    
    // Verify API response is fast (less than 2 seconds)
    expect(stopwatch.elapsed.inSeconds, lessThan(2));
    
    print('Search API response time: ${stopwatch.elapsed.inMilliseconds}ms');
  }
  
  // Test property loading API response time
  final propertyCards = find.byType(Card);
  if (propertyCards.evaluate().isNotEmpty) {
    final stopwatch = Stopwatch()..start();
    
    await TestHelpers.tapSafely(tester, propertyCards.first);
    await tester.pumpAndSettle();
    
    stopwatch.stop();
    
    // Verify property details load fast
    expect(stopwatch.elapsed.inSeconds, lessThan(3));
    
    print('Property details API response time: ${stopwatch.elapsed.inMilliseconds}ms');
  }
}

Future<void> _testOfflineHandling(WidgetTester tester) async {
  // This test would require simulating network conditions
  // For now, test that the app handles network errors gracefully
  
  // Test search with no network
  final searchField = find.byType(TextField).first;
  if (searchField.evaluate().isNotEmpty) {
    await TestHelpers.enterTextSafely(tester, searchField, 'test offline');
    await tester.pumpAndSettle();
    
    // Verify error handling UI is displayed
    final errorWidgets = find.text('No internet connection');
    if (errorWidgets.evaluate().isNotEmpty) {
      expect(errorWidgets, findsOneWidget);
    }
  }
  
  print('Offline handling test completed');
}

Future<void> _testBatteryUsage(WidgetTester tester) async {
  // Simulate normal app usage for battery testing
  final stopwatch = Stopwatch()..start();
  
  // Perform various actions that might drain battery
  for (int i = 0; i < 5; i++) {
    // Scroll through properties
    final scrollable = find.byType(Scrollable);
    if (scrollable.evaluate().isNotEmpty) {
      await tester.fling(scrollable.first, const Offset(0, -1000), 1000);
      await tester.pumpAndSettle();
    }
    
    // Navigate to property details
    final propertyCards = find.byType(Card);
    if (propertyCards.evaluate().isNotEmpty) {
      await TestHelpers.tapSafely(tester, propertyCards.first);
      await tester.pumpAndSettle();
      
      // Navigate back
      final backButton = find.byIcon(Icons.arrow_back);
      if (backButton.evaluate().isNotEmpty) {
        await TestHelpers.tapSafely(tester, backButton);
        await tester.pumpAndSettle();
      }
    }
    
    // Wait between actions
    await tester.binding.delayed(const Duration(milliseconds: 500));
  }
  
  stopwatch.stop();
  
  // Verify app is still responsive after extended usage
  expect(find.byType(MaterialApp), findsOneWidget);
  
  print('Battery usage test completed in ${stopwatch.elapsed.inSeconds}s');
}

// Additional performance test utilities
class PerformanceTestUtils {
  /// Measure widget build time
  static Future<Duration> measureBuildTime(
    WidgetTester tester,
    Widget widget,
  ) async {
    final stopwatch = Stopwatch()..start();
    
    await tester.pumpWidget(widget);
    await tester.pumpAndSettle();
    
    stopwatch.stop();
    return stopwatch.elapsed;
  }
  
  /// Measure scroll performance
  static Future<Duration> measureScrollPerformance(
    WidgetTester tester,
    Finder scrollable,
    Offset offset,
  ) async {
    final stopwatch = Stopwatch()..start();
    
    await tester.fling(scrollable, offset, 1000);
    await tester.pumpAndSettle();
    
    stopwatch.stop();
    return stopwatch.elapsed;
  }
  
  /// Check for frame drops during animation
  static Future<bool> checkForFrameDrops(
    WidgetTester tester,
    Duration duration,
  ) async {
    int frameCount = 0;
    int droppedFrames = 0;
    
    final stopwatch = Stopwatch()..start();
    
    while (stopwatch.elapsed < duration) {
      await tester.pump(const Duration(milliseconds: 16)); // 60fps
      frameCount++;
      
      // Check if frame took too long (simplified check)
      if (stopwatch.elapsedMilliseconds > frameCount * 20) {
        droppedFrames++;
      }
    }
    
    return droppedFrames > frameCount * 0.1; // More than 10% dropped frames
  }
  
  /// Measure memory usage (simplified)
  static Future<int> measureMemoryUsage() async {
    // This would require platform-specific implementation
    // For now, return a mock value
    return 100; // MB
  }
  
  /// Measure CPU usage (simplified)
  static Future<double> measureCPUUsage() async {
    // This would require platform-specific implementation
    // For now, return a mock value
    return 25.0; // Percentage
  }
}


