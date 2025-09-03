
import 'package:dio/dio.dart';
import 'dart:developer' as developer;
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
      // For now, logout is a client-side operation (handled by AuthProvider).
      // We'll skip the API call to avoid the error since the backend doesn't have this endpoint.
      developer.log('Logout completed (client-side only)', name: 'AuthService.logout');
    } catch (e) {
      // Don't throw exception for logout failures, just log it without using print.
      developer.log('Logout error: ${e.toString()}', name: 'AuthService.logout');
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
