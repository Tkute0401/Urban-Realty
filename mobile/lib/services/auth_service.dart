
import 'package:dio/dio.dart';
import '../models/user.dart';
import 'api_service.dart';

class AuthService {
  final ApiService _apiService = ApiService();

  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await _apiService.dio.post(
        '/auth/login',
        data: {
          'email': email,
          'password': password,
        },
      );
      return response.data;
    } on DioException catch (e) {
      throw Exception('Error during login: ${e.message}');
    }
  }

  Future<Map<String, dynamic>> register(String email, String password, String name, String role) async {
    try {
      final response = await _apiService.dio.post(
        '/auth/register',
        data: {
          'email': email,
          'password': password,
          'name': name,
          'role': role,
        },
      );
      return response.data;
    } on DioException catch (e) {
      throw Exception('Error during registration: ${e.message}');
    }
  }

  Future<void> logout() async {
    try {
      // The backend doesn't seem to have a formal logout endpoint to invalidate tokens.
      // If it did, we would call it here.
      // For now, logout is a client-side operation (handled by AuthProvider).
      await _apiService.dio.post('/auth/logout');
    } on DioException catch (e) {
      // Don't throw exception for logout failures, just log it.
      // This prevents app crashes when server is unavailable during logout.
      print('Logout error: ${e.message}');
    }
  }

  Future<User> getCurrentUser() async {
    try {
      final response = await _apiService.dio.get('/auth/me');
      return User.fromJson(response.data['data']);
    } on DioException catch (e) {
      throw Exception('Error getting current user: ${e.message}');
    }
  }

  Future<Map<String, dynamic>> updateProfile(Map<String, dynamic> userData) async {
    try {
      final response = await _apiService.dio.put(
        '/auth/update', // Corrected endpoint based on API docs
        data: userData,
      );
      return response.data;
    } on DioException catch (e) {
      throw Exception('Error updating profile: ${e.message}');
    }
  }
}
