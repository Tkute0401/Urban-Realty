import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user.dart';
import '../config/api_config.dart';
import 'network_service.dart';

class AuthService {

  static Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      // Check network connectivity first
      if (!await NetworkService.hasInternetConnection()) {
        throw Exception('No internet connection available');
      }
      
      // Check if server is reachable
      if (!await NetworkService.isServerReachable(ApiConfig.baseUrl)) {
        throw Exception('Server is not reachable. Please check your connection.');
      }
      
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/login'),
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
        headers: {'Content-Type': 'application/json'},
      ).timeout(const Duration(seconds: 30));

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        if (responseData == null) {
          throw Exception('Invalid response from server');
        }
        return responseData;
      } else {
        final errorData = jsonDecode(response.body);
        final errorMessage = errorData['error'] ?? errorData['message'] ?? 'Login failed with status ${response.statusCode}';
        throw Exception(errorMessage);
      }
    } catch (e) {
      if (e is Exception) {
        rethrow;
      }
      throw Exception('Error during login: ${NetworkService.getNetworkErrorMessage(e)}');
    }
  }

  static Future<Map<String, dynamic>> register(String email, String password, String name, String role) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/register'),
        body: jsonEncode({
          'email': email,
          'password': password,
          'name': name,
          'role': role,
        }),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Registration failed');
      }
    } catch (e) {
      throw Exception('Error during registration: $e');
    }
  }

  static Future<Map<String, dynamic>> logout() async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/logout'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        // Don't throw exception for logout failures, just return empty response
        // This prevents app crashes when server is unavailable
        return {};
      }
    } catch (e) {
      // Don't throw exception for logout failures, just return empty response
      // This prevents app crashes when server is unavailable
      debugPrint('Logout error: $e');
      return {};
    }
  }

  static Future<User> getCurrentUser() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/auth/me'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return User.fromJson(data);
      } else {
        throw Exception('Failed to get current user');
      }
    } catch (e) {
      throw Exception('Error getting current user: $e');
    }
  }

  static Future<bool> isAuthenticated() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/auth/verify'),
        headers: {'Content-Type': 'application/json'},
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  static Future<Map<String, dynamic>> updateProfile(Map<String, dynamic> userData) async {
    try {
      final response = await http.put(
        Uri.parse('${ApiConfig.baseUrl}/auth/profile'),
        body: jsonEncode(userData),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Profile update failed');
      }
    } catch (e) {
      throw Exception('Error updating profile: $e');
    }
  }
}