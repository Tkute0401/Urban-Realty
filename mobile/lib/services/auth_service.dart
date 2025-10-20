import 'package:urban_realty_mobile/models/user.dart';
import 'package:urban_realty_mobile/services/api_service.dart';

/// Represents the result of an authentication operation
class AuthResult {
  final bool isSuccess;
  final String message;
  final User? user;
  final String? token;

  AuthResult({
    required this.isSuccess,
    required this.message,
    this.user,
    this.token,
  });

  factory AuthResult.success({User? user, String? token, String message = 'Success'}) {
    return AuthResult(isSuccess: true, message: message, user: user, token: token);
  }

  factory AuthResult.error(String message) {
    return AuthResult(isSuccess: false, message: message);
  }
}

/// Authentication Service
class AuthService {
  final ApiService _apiService;

  AuthService({required ApiService apiService}) : _apiService = apiService;

  /// Login user (Mock implementation)
  Future<AuthResult> login(String email, String password) async {
    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock validation - accept any email/password for demo
      if (email.isNotEmpty && password.isNotEmpty) {
        // Create mock user based on email
        final user = User(
          id: 'mock_user_${DateTime.now().millisecondsSinceEpoch}',
          name: email.split('@')[0].replaceAll('.', ' ').split(' ').map((word) =>
            word.isNotEmpty ? word[0].toUpperCase() + word.substring(1) : ''
          ).join(' '),
          email: email,
          phone: '+1234567890',
          role: email.contains('admin') ? 'admin' :
                email.contains('agent') ? 'agent' :
                email.contains('dev') ? 'developer' : 'user',
          profileImage: null,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        );

        final token = 'mock_token_${DateTime.now().millisecondsSinceEpoch}';

        // Set auth token
        _apiService.setAuthToken(token);

        return AuthResult.success(
          user: user,
          token: token,
          message: 'Login successful (Demo Mode)',
        );
      } else {
        return AuthResult.error('Please enter both email and password');
      }
    } catch (e) {
      return AuthResult.error('Login failed: ${e.toString()}');
    }
  }

  /// Register user (Mock implementation)
  Future<AuthResult> register({
    required String name,
    required String email,
    required String password,
    required String phone,
    String role = 'user',
  }) async {
    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock validation
      if (name.isNotEmpty && email.isNotEmpty && password.isNotEmpty && phone.isNotEmpty) {
        // Create mock user
        final user = User(
          id: 'mock_user_${DateTime.now().millisecondsSinceEpoch}',
          name: name,
          email: email,
          phone: phone,
          role: role,
          profileImage: null,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        );

        final token = 'mock_token_${DateTime.now().millisecondsSinceEpoch}';

        // Set auth token
        _apiService.setAuthToken(token);

        return AuthResult.success(
          user: user,
          token: token,
          message: 'Registration successful (Demo Mode)',
        );
      } else {
        return AuthResult.error('Please fill in all fields');
      }
    } catch (e) {
      return AuthResult.error('Registration failed: ${e.toString()}');
    }
  }

  /// Get current user (Mock implementation)
  Future<User?> getCurrentUser() async {
    try {
      // Simulate network delay
      await Future.delayed(const Duration(milliseconds: 500));

      // Check if we have a stored token (mock check)
      final token = _apiService.authToken;
      if (token != null && token.isNotEmpty) {
        // Return a mock user based on stored token
        return User(
          id: 'mock_user_123',
          name: 'Demo User',
          email: 'demo@urbanrealty.com',
          phone: '+1234567890',
          role: 'user',
          profileImage: null,
          createdAt: DateTime.now().subtract(const Duration(days: 30)),
          updatedAt: DateTime.now(),
        );
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  /// Logout user
  Future<void> logout() async {
    try {
      // Simulate network delay
      await Future.delayed(const Duration(milliseconds: 500));
      // Clear local auth data
      _apiService.setAuthToken('');
    } catch (e) {
      // Handle logout error if needed
      print('Logout error: $e');
    }
  }

  /// Check if user is authenticated
  Future<bool> isAuthenticated() async {
    try {
      final user = await getCurrentUser();
      return user != null;
    } catch (e) {
      return false;
    }
  }
}
