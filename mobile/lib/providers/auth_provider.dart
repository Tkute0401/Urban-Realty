
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/user.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  User? _user;
  String? _token;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  String? get token => _token;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _token != null && _user != null;

  AuthProvider() {
    tryAutoLogin();
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _authService.login(email, password);
      
      if (response['token'] == null) {
        throw Exception('Login successful, but no token received.');
      }

      _token = response['token'];
      await _secureStorage.write(key: 'jwt_token', value: _token);
      
      // After getting a token, fetch the user profile
      await _getMe();

      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register({
    required String name,
    required String email,
    required String password,
    required String role,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _authService.register(email, password, name, role);

      if (response['token'] == null) {
        throw Exception('Registration successful, but no token received.');
      }

      _token = response['token'];
      await _secureStorage.write(key: 'jwt_token', value: _token);
      
      // After getting a token, fetch the user profile
      await _getMe();

      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    await _authService.logout(); // Call the service, but don't block on error
    _user = null;
    _token = null;
    await _secureStorage.delete(key: 'jwt_token');
    notifyListeners();
  }

  Future<void> tryAutoLogin() async {
    _isLoading = true;
    notifyListeners();

    final storedToken = await _secureStorage.read(key: 'jwt_token');

    if (storedToken == null || storedToken.isEmpty) {
      _isLoading = false;
      notifyListeners();
      return;
    }

    _token = storedToken;
    try {
      await _getMe();
    } catch (e) {
      // If fetching user fails, token is likely expired. Log out.
      await logout();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> _getMe() async {
    try {
      final user = await _authService.getCurrentUser();
      _user = user;
    } catch (e) {
      _error = e.toString();
      // Re-throw to be caught by the calling function (e.g., tryAutoLogin)
      rethrow;
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
