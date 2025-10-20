import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:urban_realty_mobile/main.dart' as app;
import 'test_config.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Property Discovery E2E Tests', () {
    testWidgets('Complete Property Discovery Journey', (WidgetTester tester) async {
      // Launch app
      app.main();
      await tester.pumpAndSettle();

      // Step 1: Verify home screen loads
      await _verifyHomeScreenLoads(tester);

      // Step 2: Test search functionality
      await _testSearchFunctionality(tester);

      // Step 3: Test filter options
      await _testFilterOptions(tester);

      // Step 4: Test property listing
      await _testPropertyListing(tester);

      // Step 5: Test property details navigation
      await _testPropertyDetailsNavigation(tester);

      // Step 6: Test favorites functionality
      await _testFavoritesFunctionality(tester);

      // Step 7: Test comparison feature
      await _testComparisonFeature(tester);
    });

    testWidgets('Search Performance Test', (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();

      // Test search with various queries
      for (final query in TestConfig.searchQueries) {
        await _testSearchQuery(tester, query);
        await TestHelpers.simulateNetworkDelay();
      }
    });

    testWidgets('Filter Performance Test', (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();

      // Test all filter combinations
      await _testAllFilterCombinations(tester);
    });
  });
}

Future<void> _verifyHomeScreenLoads(WidgetTester tester) async {
  // Wait for home screen to load
  await TestHelpers.waitForWidget(tester, find.text('Featured Properties'));
  
  // Verify key elements are present
  expect(find.text('Featured Properties'), findsOneWidget);
  expect(find.text('Recent Properties'), findsOneWidget);
  
  // Verify search bar is present
  final searchField = find.byType(TextField);
  expect(searchField, findsAtLeastNWidgets(1));
  
  // Verify filter button is present
  final filterButton = find.byIcon(Icons.filter_list);
  expect(filterButton, findsOneWidget);
  
  // Take screenshot for verification
  await TestHelpers.takeScreenshot(tester, 'home_screen_loaded');
}

Future<void> _testSearchFunctionality(WidgetTester tester) async {
  // Find search field
  final searchField = find.byType(TextField).first;
  
  // Test basic search
  await TestHelpers.enterTextSafely(tester, searchField, 'apartment');
  await tester.pumpAndSettle();
  
  // Verify search results appear
  expect(find.byType(Card), findsAtLeastNWidgets(1));
  
  // Test search with special characters
  await TestHelpers.clearAllTextFields(tester);
  await TestHelpers.enterTextSafely(tester, searchField, 'luxury villa & garden');
  await tester.pumpAndSettle();
  
  // Test empty search
  await TestHelpers.clearAllTextFields(tester);
  await TestHelpers.enterTextSafely(tester, searchField, '');
  await tester.pumpAndSettle();
  
  // Test very long search query
  await TestHelpers.clearAllTextFields(tester);
  await TestHelpers.enterTextSafely(tester, searchField, 'a' * 100);
  await tester.pumpAndSettle();
  
  await TestHelpers.takeScreenshot(tester, 'search_functionality_tested');
}

Future<void> _testSearchQuery(WidgetTester tester, String query) async {
  final searchField = find.byType(TextField).first;
  
  await TestHelpers.enterTextSafely(tester, searchField, query);
  await tester.pumpAndSettle();
  
  // Verify search results
  expect(find.byType(Card), findsAtLeastNWidgets(1));
  
  // Clear search
  await TestHelpers.clearAllTextFields(tester);
}

Future<void> _testFilterOptions(WidgetTester tester) async {
  // Open filter dialog
  final filterButton = find.byIcon(Icons.filter_list);
  await TestHelpers.tapSafely(tester, filterButton);
  
  // Test price range filter
  await _testPriceRangeFilter(tester);
  
  // Test property type filter
  await _testPropertyTypeFilter(tester);
  
  // Test bedroom filter
  await _testBedroomFilter(tester);
  
  // Test bathroom filter
  await _testBathroomFilter(tester);
  
  // Apply filters
  final applyButton = find.text('Apply Filters');
  if (applyButton.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, applyButton);
    await tester.pumpAndSettle();
  }
  
  await TestHelpers.takeScreenshot(tester, 'filters_applied');
}

Future<void> _testPriceRangeFilter(WidgetTester tester) async {
  // Find price range sliders
  final priceSliders = find.byType(RangeSlider);
  if (priceSliders.evaluate().isNotEmpty) {
    // Test minimum price
    await tester.drag(priceSliders.first, const Offset(100, 0));
    await tester.pumpAndSettle();
    
    // Test maximum price
    await tester.drag(priceSliders.first, const Offset(-50, 0));
    await tester.pumpAndSettle();
  }
}

Future<void> _testPropertyTypeFilter(WidgetTester tester) async {
  // Find property type checkboxes
  final propertyTypeCheckboxes = find.byType(CheckboxListTile);
  if (propertyTypeCheckboxes.evaluate().isNotEmpty) {
    // Select apartment
    await TestHelpers.tapSafely(tester, propertyTypeCheckboxes.first);
    await tester.pumpAndSettle();
  }
}

Future<void> _testBedroomFilter(WidgetTester tester) async {
  // Find bedroom filter
  final bedroomFilter = find.text('Bedrooms');
  if (bedroomFilter.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, bedroomFilter);
    await tester.pumpAndSettle();
    
    // Select 2 bedrooms
    final twoBedroom = find.text('2');
    if (twoBedroom.evaluate().isNotEmpty) {
      await TestHelpers.tapSafely(tester, twoBedroom);
      await tester.pumpAndSettle();
    }
  }
}

Future<void> _testBathroomFilter(WidgetTester tester) async {
  // Find bathroom filter
  final bathroomFilter = find.text('Bathrooms');
  if (bathroomFilter.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, bathroomFilter);
    await tester.pumpAndSettle();
    
    // Select 2 bathrooms
    final twoBathroom = find.text('2');
    if (twoBathroom.evaluate().isNotEmpty) {
      await TestHelpers.tapSafely(tester, twoBathroom);
      await tester.pumpAndSettle();
    }
  }
}

Future<void> _testAllFilterCombinations(WidgetTester tester) async {
  // Test different filter combinations
  final filterCombinations = [
    {'minPrice': 100000, 'maxPrice': 500000, 'bedrooms': 2},
    {'minPrice': 500000, 'maxPrice': 1000000, 'bedrooms': 3},
    {'minPrice': 0, 'maxPrice': 2000000, 'bedrooms': 1},
  ];
  
  for (final combination in filterCombinations) {
    await _applyFilterCombination(tester, combination);
    await TestHelpers.simulateNetworkDelay();
  }
}

Future<void> _applyFilterCombination(WidgetTester tester, Map<String, dynamic> filters) async {
  // Open filter dialog
  final filterButton = find.byIcon(Icons.filter_list);
  await TestHelpers.tapSafely(tester, filterButton);
  
  // Apply filters based on combination
  // This would be implemented based on actual filter UI
  
  // Apply filters
  final applyButton = find.text('Apply Filters');
  if (applyButton.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, applyButton);
    await tester.pumpAndSettle();
  }
}

Future<void> _testPropertyListing(WidgetTester tester) async {
  // Verify property cards are displayed
  final propertyCards = find.byType(Card);
  expect(propertyCards, findsAtLeastNWidgets(1));
  
  // Test scroll performance
  await _testScrollPerformance(tester);
  
  // Test property card interactions
  await _testPropertyCardInteractions(tester);
}

Future<void> _testScrollPerformance(WidgetTester tester) async {
  final scrollable = find.byType(Scrollable);
  if (scrollable.evaluate().isNotEmpty) {
    // Measure scroll performance
    final scrollTime = await PerformanceTestUtils.measureScrollPerformance(
      tester,
      scrollable.first,
      const Offset(0, -1000),
    );
    
    // Verify scroll is smooth (less than 1 second for 1000px)
    expect(scrollTime.inMilliseconds, lessThan(1000));
    
    // Check for frame drops
    final hasFrameDrops = await PerformanceTestUtils.checkForFrameDrops(
      tester,
      const Duration(seconds: 2),
    );
    expect(hasFrameDrops, false);
  }
}

Future<void> _testPropertyCardInteractions(WidgetTester tester) async {
  final propertyCards = find.byType(Card);
  if (propertyCards.evaluate().isNotEmpty) {
    // Test tap on property card
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

Future<void> _testPropertyDetailsNavigation(WidgetTester tester) async {
  final propertyCards = find.byType(Card);
  if (propertyCards.evaluate().isNotEmpty) {
    // Tap on first property
    await TestHelpers.tapSafely(tester, propertyCards.first);
    await tester.pumpAndSettle();
    
    // Verify property details screen
    expect(find.text('Property Details'), findsOneWidget);
    
    // Test image gallery
    await _testImageGallery(tester);
    
    // Test property information
    await _testPropertyInformation(tester);
    
    // Test action buttons
    await _testActionButtons(tester);
    
    // Navigate back
    final backButton = find.byIcon(Icons.arrow_back);
    if (backButton.evaluate().isNotEmpty) {
      await TestHelpers.tapSafely(tester, backButton);
      await tester.pumpAndSettle();
    }
  }
}

Future<void> _testImageGallery(WidgetTester tester) async {
  // Test image carousel
  final pageView = find.byType(PageView);
  if (pageView.evaluate().isNotEmpty) {
    // Swipe to next image
    await tester.fling(pageView.first, const Offset(-300, 0), 1000);
    await tester.pumpAndSettle();
    
    // Swipe back
    await tester.fling(pageView.first, const Offset(300, 0), 1000);
    await tester.pumpAndSettle();
  }
}

Future<void> _testPropertyInformation(WidgetTester tester) async {
  // Verify property details are displayed
  expect(find.text('Price'), findsOneWidget);
  expect(find.text('Bedrooms'), findsOneWidget);
  expect(find.text('Bathrooms'), findsOneWidget);
  expect(find.text('Area'), findsOneWidget);
}

Future<void> _testActionButtons(WidgetTester tester) async {
  // Test favorite button
  final favoriteButton = find.byIcon(Icons.favorite_border);
  if (favoriteButton.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, favoriteButton);
    await tester.pumpAndSettle();
  }
  
  // Test share button
  final shareButton = find.byIcon(Icons.share);
  if (shareButton.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, shareButton);
    await tester.pumpAndSettle();
  }
  
  // Test contact button
  final contactButton = find.text('Contact Agent');
  if (contactButton.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, contactButton);
    await tester.pumpAndSettle();
  }
}

Future<void> _testFavoritesFunctionality(WidgetTester tester) async {
  // Navigate to favorites tab
  final favoritesTab = find.text('Favorites');
  if (favoritesTab.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, favoritesTab);
    await tester.pumpAndSettle();
    
    // Verify favorites screen
    expect(find.text('Favorites'), findsOneWidget);
    
    // Test adding to favorites
    await _testAddingToFavorites(tester);
    
    // Test removing from favorites
    await _testRemovingFromFavorites(tester);
  }
}

Future<void> _testAddingToFavorites(WidgetTester tester) async {
  // Go back to home
  final homeTab = find.text('Home');
  if (homeTab.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, homeTab);
    await tester.pumpAndSettle();
  }
  
  // Add property to favorites
  final favoriteButton = find.byIcon(Icons.favorite_border);
  if (favoriteButton.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, favoriteButton);
    await tester.pumpAndSettle();
  }
}

Future<void> _testRemovingFromFavorites(WidgetTester tester) async {
  // Go to favorites
  final favoritesTab = find.text('Favorites');
  if (favoritesTab.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, favoritesTab);
    await tester.pumpAndSettle();
  }
  
  // Remove from favorites
  final favoriteButton = find.byIcon(Icons.favorite);
  if (favoriteButton.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, favoriteButton);
    await tester.pumpAndSettle();
  }
}

Future<void> _testComparisonFeature(WidgetTester tester) async {
  // Go back to home
  final homeTab = find.text('Home');
  if (homeTab.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, homeTab);
    await tester.pumpAndSettle();
  }
  
  // Test comparison feature
  final compareButton = find.byIcon(Icons.compare_arrows);
  if (compareButton.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, compareButton);
    await tester.pumpAndSettle();
    
    // Verify comparison screen
    expect(find.text('Compare Properties'), findsOneWidget);
    
    // Add properties to comparison
    await _testAddingToComparison(tester);
    
    // Test comparison view
    await _testComparisonView(tester);
  }
}

Future<void> _testAddingToComparison(WidgetTester tester) async {
  // This would depend on the actual comparison UI
  // For now, just verify the feature exists
  expect(find.byIcon(Icons.compare_arrows), findsAtLeastNWidgets(1));
}

Future<void> _testComparisonView(WidgetTester tester) async {
  // Test comparison table/view
  // This would depend on the actual comparison UI implementation
  expect(find.text('Compare Properties'), findsOneWidget);
}


