import 'package:flutter/material.dart';
import 'package:patrol/patrol.dart';
import 'package:urban_realty_mobile/main.dart' as app;
import 'package:urban_realty_mobile/test/test_config.dart';

void main() {
  patrolTest('App Launch Test', ($) async {
    // Arrange
    TestConfig.initPatrolTest();
    
    // Act
    await app.main();
    await $.pumpAndSettle();
    
    // Assert
    await $.native.tap(Selector(text: 'Login'));
    await $.pumpAndSettle();
    
    expect($.native.$(Selector(text: 'Email')), findsOneWidget);
    expect($.native.$(Selector(text: 'Password')), findsOneWidget);
  });
  
  patrolTest('Authentication Flow Test', ($) async {
    // Arrange
    await app.main();
    await $.pumpAndSettle();
    
    // Act
    await $.native.tap(Selector(text: 'Login'));
    await $.pumpAndSettle();
    
    await $.native.enterText(Selector(key: 'email_field'), TestConfig.testEmail);
    await $.native.enterText(Selector(key: 'password_field'), TestConfig.testPassword);
    await $.native.tap(Selector(key: 'login_button'));
    await $.pumpAndSettle();
    
    // Assert
    expect($.native.$(Selector(text: 'Welcome')), findsOneWidget);
  });
  
  patrolTest('Project Creation Test', ($) async {
    // Arrange
    await app.main();
    await $.pumpAndSettle();
    
    // Act
    await $.native.tap(Selector(text: 'Projects'));
    await $.pumpAndSettle();
    await $.native.tap(Selector(icon: Icons.add));
    await $.pumpAndSettle();
    
    await $.native.enterText(Selector(key: 'project_name_field'), 'Test Project');
    await $.native.enterText(Selector(key: 'project_description_field'), 'Test Description');
    await $.native.tap(Selector(key: 'create_project_button'));
    await $.pumpAndSettle();
    
    // Assert
    expect($.native.$(Selector(text: 'Test Project')), findsOneWidget);
  });
  
  patrolTest('Property Search Test', ($) async {
    // Arrange
    await app.main();
    await $.pumpAndSettle();
    
    // Act
    await $.native.tap(Selector(text: 'Properties'));
    await $.pumpAndSettle();
    await $.native.tap(Selector(icon: Icons.search));
    await $.pumpAndSettle();
    
    await $.native.enterText(Selector(type: TextField), 'apartment');
    await $.pumpAndSettle();
    
    // Assert
    expect($.native.$(Selector(text: 'apartment')), findsOneWidget);
  });
  
  patrolTest('Navigation Test', ($) async {
    // Arrange
    await app.main();
    await $.pumpAndSettle();
    
    // Act & Assert
    await $.native.tap(Selector(text: 'Projects'));
    await $.pumpAndSettle();
    expect($.native.$(Selector(text: 'Projects')), findsOneWidget);
    
    await $.native.tap(Selector(text: 'Properties'));
    await $.pumpAndSettle();
    expect($.native.$(Selector(text: 'Properties')), findsOneWidget);
    
    await $.native.tap(Selector(text: 'Profile'));
    await $.pumpAndSettle();
    expect($.native.$(Selector(text: 'Profile')), findsOneWidget);
  });
  
  patrolTest('Error Handling Test', ($) async {
    // Arrange
    await app.main();
    await $.pumpAndSettle();
    
    // Act
    await $.native.tap(Selector(text: 'Login'));
    await $.pumpAndSettle();
    
    await $.native.enterText(Selector(key: 'email_field'), 'invalid@email');
    await $.native.enterText(Selector(key: 'password_field'), '123');
    await $.native.tap(Selector(key: 'login_button'));
    await $.pumpAndSettle();
    
    // Assert
    expect($.native.$(Selector(text: 'Invalid email')), findsOneWidget);
  });
  
  patrolTest('Performance Test', ($) async {
    // Arrange
    final stopwatch = Stopwatch()..start();
    
    // Act
    await app.main();
    await $.pumpAndSettle();
    
    // Assert
    expect(stopwatch.elapsedMilliseconds, lessThan(5000)); // App should launch within 5 seconds
  });
}


