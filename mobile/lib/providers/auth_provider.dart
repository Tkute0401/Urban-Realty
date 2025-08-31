import "package:flutter/material.dart";
import "../models/user.dart";
import "../services/auth_service.dart";

class AuthProvider extends ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      final response = await AuthService.login(email, password);
      
      // Check if response doesn't contain user data
      if (response["user"] == null) {
        throw Exception('No user data received from server');
      }
      
      _user = User.fromJson(response["user"]);
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
    String? mobile,
    String? reraId,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      final response = await AuthService.register(email, password, name, role);
      
      // Check if response doesn't contain user data
      if (response["user"] == null) {
        throw Exception('No user data received from server');
      }
      
      _user = User.fromJson(response["user"]);
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
    try {
      await AuthService.logout();
      _user = null;
      notifyListeners();
    } catch (e) {
      // Even if logout fails on server, clear local user data
      _user = null;
      notifyListeners();
      // Log the error but don't throw it to prevent app crashes
      print('Logout error: $e');
    }
  }

  Future<void> loadUser() async {
    try {
      _user = await AuthService.getCurrentUser();
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}