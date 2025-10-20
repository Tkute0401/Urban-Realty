import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:urban_realty_mobile/main.dart' as app;
import 'package:urban_realty_mobile/test/test_config.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  
  group('App Integration Tests', () {
    testWidgets('should launch app and show home screen', (WidgetTester tester) async {
      // Arrange
      TestConfig.initIntegrationTest();
      
      // Act
      app.main();
      await tester.pumpAndSettle();
      
      // Assert
      expect(find.byType(MaterialApp), findsOneWidget);
    });
    
    testWidgets('should navigate to projects screen', (WidgetTester tester) async {
      // Arrange
      app.main();
      await tester.pumpAndSettle();
      
      // Act
      await tester.tap(find.text('Projects'));
      await tester.pumpAndSettle();
      
      // Assert
      expect(find.text('Projects'), findsOneWidget);
    });
    
    testWidgets('should navigate to properties screen', (WidgetTester tester) async {
      // Arrange
      app.main();
      await tester.pumpAndSettle();
      
      // Act
      await tester.tap(find.text('Properties'));
      await tester.pumpAndSettle();
      
      // Assert
      expect(find.text('Properties'), findsOneWidget);
    });
    
    testWidgets('should navigate to profile screen', (WidgetTester tester) async {
      // Arrange
      app.main();
      await tester.pumpAndSettle();
      
      // Act
      await tester.tap(find.text('Profile'));
      await tester.pumpAndSettle();
      
      // Assert
      expect(find.text('Profile'), findsOneWidget);
    });
    
    testWidgets('should show search functionality', (WidgetTester tester) async {
      // Arrange
      app.main();
      await tester.pumpAndSettle();
      
      // Act
      await tester.tap(find.byIcon(Icons.search));
      await tester.pumpAndSettle();
      
      // Assert
      expect(find.byType(TextField), findsOneWidget);
    });
    
    testWidgets('should handle back navigation', (WidgetTester tester) async {
      // Arrange
      app.main();
      await tester.pumpAndSettle();
      
      // Act
      await tester.tap(find.text('Projects'));
      await tester.pumpAndSettle();
      await tester.pageBack();
      await tester.pumpAndSettle();
      
      // Assert
      expect(find.text('Home'), findsOneWidget);
    });
  });
  
  group('Authentication Flow Tests', () {
    testWidgets('should show login screen when not authenticated', (WidgetTester tester) async {
      // Arrange
      app.main();
      await tester.pumpAndSettle();
      
      // Act
      await tester.tap(find.text('Login'));
      await tester.pumpAndSettle();
      
      // Assert
      expect(find.text('Email'), findsOneWidget);
      expect(find.text('Password'), findsOneWidget);
      expect(find.byType(ElevatedButton), findsOneWidget);
    });
    
    testWidgets('should handle login form submission', (WidgetTester tester) async {
      // Arrange
      app.main();
      await tester.pumpAndSettle();
      
      // Act
      await tester.tap(find.text('Login'));
      await tester.pumpAndSettle();
      
      await tester.enterText(find.byKey(const Key('email_field')), TestConfig.testEmail);
      await tester.enterText(find.byKey(const Key('password_field')), TestConfig.testPassword);
      await tester.tap(find.byKey(const Key('login_button')));
      await tester.pumpAndSettle();
      
      // Assert
      expect(find.text('Welcome'), findsOneWidget);
    });
  });
  
  group('Project Management Tests', () {
    testWidgets('should create new project', (WidgetTester tester) async {
      // Arrange
      app.main();
      await tester.pumpAndSettle();
      
      // Act
      await tester.tap(find.text('Projects'));
      await tester.pumpAndSettle();
      await tester.tap(find.byIcon(Icons.add));
      await tester.pumpAndSettle();
      
      await tester.enterText(find.byKey(const Key('project_name_field')), 'Test Project');
      await tester.enterText(find.byKey(const Key('project_description_field')), 'Test Description');
      await tester.tap(find.byKey(const Key('create_project_button')));
      await tester.pumpAndSettle();
      
      // Assert
      expect(find.text('Test Project'), findsOneWidget);
    });
    
    testWidgets('should edit existing project', (WidgetTester tester) async {
      // Arrange
      app.main();
      await tester.pumpAndSettle();
      
      // Act
      await tester.tap(find.text('Projects'));
      await tester.pumpAndSettle();
      await tester.tap(find.byIcon(Icons.edit));
      await tester.pumpAndSettle();
      
      await tester.enterText(find.byKey(const Key('project_name_field')), 'Updated Project');
      await tester.tap(find.byKey(const Key('save_project_button')));
      await tester.pumpAndSettle();
      
      // Assert
      expect(find.text('Updated Project'), findsOneWidget);
    });
  });
  
  group('Property Management Tests', () {
    testWidgets('should view property details', (WidgetTester tester) async {
      // Arrange
      app.main();
      await tester.pumpAndSettle();
      
      // Act
      await tester.tap(find.text('Properties'));
      await tester.pumpAndSettle();
      await tester.tap(find.byType(Card).first);
      await tester.pumpAndSettle();
      
      // Assert
      expect(find.text('Property Details'), findsOneWidget);
    });
    
    testWidgets('should search properties', (WidgetTester tester) async {
      // Arrange
      app.main();
      await tester.pumpAndSettle();
      
      // Act
      await tester.tap(find.text('Properties'));
      await tester.pumpAndSettle();
      await tester.tap(find.byIcon(Icons.search));
      await tester.pumpAndSettle();
      
      await tester.enterText(find.byType(TextField), 'apartment');
      await tester.pumpAndSettle();
      
      // Assert
      expect(find.text('apartment'), findsOneWidget);
    });
  });
}