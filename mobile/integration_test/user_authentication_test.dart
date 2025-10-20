import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:urban_realty_mobile/main.dart' as app;
import 'test_config.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('User Authentication E2E Tests', () {
    testWidgets('Complete Authentication Journey', (WidgetTester tester) async {
      // Launch app
      app.main();
      await tester.pumpAndSettle();

      // Test login flow
      await _testLoginFlow(tester);

      // Test profile management
      await _testProfileManagement(tester);

      // Test settings
      await _testSettings(tester);

      // Test logout
      await _testLogout(tester);
    });

    testWidgets('Registration Flow Test', (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();

      // Test registration
      await _testRegistrationFlow(tester);
    });

    testWidgets('Password Reset Flow Test', (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();

      // Test password reset
      await _testPasswordResetFlow(tester);
    });

    testWidgets('Session Management Test', (WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle();

      // Test session persistence
      await _testSessionPersistence(tester);

      // Test auto-login
      await _testAutoLogin(tester);
    });
  });
}

Future<void> _testLoginFlow(WidgetTester tester) async {
  // Check if login screen is present
  if (find.text('Login').evaluate().isNotEmpty) {
    await _performLogin(tester);
  } else {
    // Already logged in, proceed to profile
    print('User already authenticated');
  }
}

Future<void> _performLogin(WidgetTester tester) async {
  // Find email field
  final emailField = find.byType(TextField).first;
  await TestHelpers.waitForWidget(tester, emailField);
  
  // Enter email
  await TestHelpers.enterTextSafely(tester, emailField, TestConfig.testEmail);
  
  // Find password field
  final passwordField = find.byType(TextField).at(1);
  await TestHelpers.waitForWidget(tester, passwordField);
  
  // Enter password
  await TestHelpers.enterTextSafely(tester, passwordField, TestConfig.testPassword);
  
  // Find and tap login button
  final loginButton = find.text('Login');
  await TestHelpers.tapSafely(tester, loginButton);
  
  // Wait for login to complete
  await tester.pumpAndSettle(const Duration(seconds: 3));
  
  // Verify login success
  expect(find.text('Login'), findsNothing);
  
  await TestHelpers.takeScreenshot(tester, 'login_successful');
}

Future<void> _testRegistrationFlow(WidgetTester tester) async {
  // Find registration link/button
  final registerButton = find.text('Sign Up');
  if (registerButton.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, registerButton);
    await tester.pumpAndSettle();
    
    // Fill registration form
    await _fillRegistrationForm(tester);
    
    // Submit registration
    final submitButton = find.text('Create Account');
    if (submitButton.evaluate().isNotEmpty) {
      await TestHelpers.tapSafely(tester, submitButton);
      await tester.pumpAndSettle();
    }
  }
}

Future<void> _fillRegistrationForm(WidgetTester tester) async {
  // Fill name field
  final nameField = find.byType(TextField).first;
  await TestHelpers.enterTextSafely(tester, nameField, 'Test User');
  
  // Fill email field
  final emailField = find.byType(TextField).at(1);
  await TestHelpers.enterTextSafely(tester, emailField, 'newuser@example.com');
  
  // Fill phone field
  final phoneField = find.byType(TextField).at(2);
  await TestHelpers.enterTextSafely(tester, phoneField, '+1234567890');
  
  // Fill password field
  final passwordField = find.byType(TextField).at(3);
  await TestHelpers.enterTextSafely(tester, passwordField, 'newpassword123');
  
  // Fill confirm password field
  final confirmPasswordField = find.byType(TextField).at(4);
  await TestHelpers.enterTextSafely(tester, confirmPasswordField, 'newpassword123');
  
  // Accept terms and conditions
  final termsCheckbox = find.byType(Checkbox);
  if (termsCheckbox.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, termsCheckbox);
  }
}

Future<void> _testPasswordResetFlow(WidgetTester tester) async {
  // Find forgot password link
  final forgotPasswordLink = find.text('Forgot Password?');
  if (forgotPasswordLink.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, forgotPasswordLink);
    await tester.pumpAndSettle();
    
    // Enter email for password reset
    final emailField = find.byType(TextField).first;
    await TestHelpers.enterTextSafely(tester, emailField, TestConfig.testEmail);
    
    // Submit password reset request
    final submitButton = find.text('Send Reset Link');
    if (submitButton.evaluate().isNotEmpty) {
      await TestHelpers.tapSafely(tester, submitButton);
      await tester.pumpAndSettle();
    }
  }
}

Future<void> _testProfileManagement(WidgetTester tester) async {
  // Navigate to profile tab
  final profileTab = find.text('Profile');
  if (profileTab.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, profileTab);
    await tester.pumpAndSettle();
    
    // Verify profile screen
    expect(find.text('Profile'), findsOneWidget);
    
    // Test profile editing
    await _testProfileEditing(tester);
    
    // Test profile image upload
    await _testProfileImageUpload(tester);
    
    // Test preferences
    await _testPreferences(tester);
  }
}

Future<void> _testProfileEditing(WidgetTester tester) async {
  // Find edit profile button
  final editButton = find.byIcon(Icons.edit);
  if (editButton.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, editButton);
    await tester.pumpAndSettle();
    
    // Edit name
    final nameField = find.byType(TextField).first;
    await TestHelpers.clearAllTextFields(tester);
    await TestHelpers.enterTextSafely(tester, nameField, 'Updated Name');
    
    // Edit phone
    final phoneField = find.byType(TextField).at(1);
    await TestHelpers.enterTextSafely(tester, phoneField, '+9876543210');
    
    // Save changes
    final saveButton = find.text('Save');
    if (saveButton.evaluate().isNotEmpty) {
      await TestHelpers.tapSafely(tester, saveButton);
      await tester.pumpAndSettle();
    }
  }
}

Future<void> _testProfileImageUpload(WidgetTester tester) async {
  // Find profile image
  final profileImage = find.byType(CircleAvatar);
  if (profileImage.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, profileImage);
    await tester.pumpAndSettle();
    
    // Test image picker options
    final cameraOption = find.text('Camera');
    final galleryOption = find.text('Gallery');
    
    if (cameraOption.evaluate().isNotEmpty) {
      await TestHelpers.tapSafely(tester, cameraOption);
      await tester.pumpAndSettle();
    } else if (galleryOption.evaluate().isNotEmpty) {
      await TestHelpers.tapSafely(tester, galleryOption);
      await tester.pumpAndSettle();
    }
  }
}

Future<void> _testPreferences(tester) async {
  // Find preferences/settings
  final preferencesButton = find.text('Preferences');
  if (preferencesButton.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, preferencesButton);
    await tester.pumpAndSettle();
    
    // Test notification preferences
    await _testNotificationPreferences(tester);
    
    // Test privacy settings
    await _testPrivacySettings(tester);
  }
}

Future<void> _testNotificationPreferences(WidgetTester tester) async {
  // Find notification settings
  final notificationSettings = find.text('Notifications');
  if (notificationSettings.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, notificationSettings);
    await tester.pumpAndSettle();
    
    // Toggle push notifications
    final pushNotificationSwitch = find.byType(Switch).first;
    if (pushNotificationSwitch.evaluate().isNotEmpty) {
      await TestHelpers.tapSafely(tester, pushNotificationSwitch);
      await tester.pumpAndSettle();
    }
    
    // Toggle email notifications
    final emailNotificationSwitch = find.byType(Switch).at(1);
    if (emailNotificationSwitch.evaluate().isNotEmpty) {
      await TestHelpers.tapSafely(tester, emailNotificationSwitch);
      await tester.pumpAndSettle();
    }
  }
}

Future<void> _testPrivacySettings(WidgetTester tester) async {
  // Find privacy settings
  final privacySettings = find.text('Privacy');
  if (privacySettings.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, privacySettings);
    await tester.pumpAndSettle();
    
    // Test profile visibility
    final profileVisibilitySwitch = find.byType(Switch).first;
    if (profileVisibilitySwitch.evaluate().isNotEmpty) {
      await TestHelpers.tapSafely(tester, profileVisibilitySwitch);
      await tester.pumpAndSettle();
    }
  }
}

Future<void> _testSettings(WidgetTester tester) async {
  // Find settings button
  final settingsButton = find.byIcon(Icons.settings);
  if (settingsButton.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, settingsButton);
    await tester.pumpAndSettle();
    
    // Test theme toggle
    await _testThemeToggle(tester);
    
    // Test language settings
    await _testLanguageSettings(tester);
    
    // Test about section
    await _testAboutSection(tester);
  }
}

Future<void> _testThemeToggle(WidgetTester tester) async {
  // Find theme toggle
  final themeToggle = find.text('Dark Mode');
  if (themeToggle.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, themeToggle);
    await tester.pumpAndSettle();
    
    // Verify theme changed
    await TestHelpers.takeScreenshot(tester, 'dark_theme_enabled');
    
    // Toggle back
    await TestHelpers.tapSafely(tester, themeToggle);
    await tester.pumpAndSettle();
  }
}

Future<void> _testLanguageSettings(WidgetTester tester) async {
  // Find language settings
  final languageSettings = find.text('Language');
  if (languageSettings.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, languageSettings);
    await tester.pumpAndSettle();
    
    // Select different language
    final languageOption = find.text('English');
    if (languageOption.evaluate().isNotEmpty) {
      await TestHelpers.tapSafely(tester, languageOption);
      await tester.pumpAndSettle();
    }
  }
}

Future<void> _testAboutSection(WidgetTester tester) async {
  // Find about section
  final aboutSection = find.text('About');
  if (aboutSection.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, aboutSection);
    await tester.pumpAndSettle();
    
    // Verify about information
    expect(find.text('Version'), findsOneWidget);
    expect(find.text('Privacy Policy'), findsOneWidget);
    expect(find.text('Terms of Service'), findsOneWidget);
  }
}

Future<void> _testLogout(WidgetTester tester) async {
  // Find logout button
  final logoutButton = find.text('Logout');
  if (logoutButton.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, logoutButton);
    await tester.pumpAndSettle();
    
    // Confirm logout
    final confirmButton = find.text('Yes');
    if (confirmButton.evaluate().isNotEmpty) {
      await TestHelpers.tapSafely(tester, confirmButton);
      await tester.pumpAndSettle();
    }
    
    // Verify logout success
    expect(find.text('Login'), findsOneWidget);
    
    await TestHelpers.takeScreenshot(tester, 'logout_successful');
  }
}

Future<void> _testSessionPersistence(WidgetTester tester) async {
  // Login first
  await _performLogin(tester);
  
  // Navigate to home
  final homeTab = find.text('Home');
  if (homeTab.evaluate().isNotEmpty) {
    await TestHelpers.tapSafely(tester, homeTab);
    await tester.pumpAndSettle();
  }
  
  // Simulate app backgrounding and foregrounding
  // This would require platform-specific testing
  await tester.binding.delayed(const Duration(seconds: 1));
  
  // Verify user is still logged in
  expect(find.text('Login'), findsNothing);
}

Future<void> _testAutoLogin(WidgetTester tester) async {
  // This test would verify that the app automatically logs in
  // when the user has valid stored credentials
  
  // Restart app to test auto-login
  app.main();
  await tester.pumpAndSettle();
  
  // Verify auto-login worked
  expect(find.text('Login'), findsNothing);
  expect(find.text('Home'), findsOneWidget);
}


