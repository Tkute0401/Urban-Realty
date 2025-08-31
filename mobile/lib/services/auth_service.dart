import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user.dart';

class AuthService {
  static const String baseUrl = 'https://urban-realty-production.up.railway.app/api/v1';

  static Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Login failed');
      }
    } catch (e) {
      throw Exception('Error during login: $e');
    }
  }

  static Future<Map<String, dynamic>> register(String email, String password, String name, String role) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/register'),
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
        Uri.parse('$baseUrl/auth/logout'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Logout failed');
      }
    } catch (e) {
      throw Exception('Error during logout: $e');
    }
  }

  static Future<User> getCurrentUser() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/auth/me'),
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
        Uri.parse('$baseUrl/auth/verify'),
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
        Uri.parse('$baseUrl/auth/profile'),
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