import 'dart:convert';
import 'http_client.dart';

class AdminService {
  static final AdminService _instance = AdminService._internal();
  factory AdminService() => _instance;
  AdminService._internal();



  Future<Map<String, dynamic>> getDashboardStats() async {
    try {
      final response = await HttpClient.get('/admin/dashboard');
      if (response.statusCode == 200) {
        // Check if response is JSON
        final contentType = response.headers['content-type'];
        if (contentType != null && contentType.contains('application/json')) {
          return jsonDecode(response.body);
        } else {
          throw Exception('Server returned non-JSON response. Status: ${response.statusCode}');
        }
      }
      throw Exception('Failed to load dashboard stats. Status: ${response.statusCode}');
    } catch (e) {
      if (e.toString().contains('FormatException')) {
        throw Exception('Server returned invalid JSON. Please check your connection.');
      }
      throw Exception('Error: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getUsers({int page = 1, int limit = 10}) async {
    try {
      final response = await HttpClient.get('/admin/users', query: {'page': page.toString(), 'limit': limit.toString()});
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<Map<String, dynamic>>.from(data['users'] ?? []);
      }
      throw Exception('Failed to load users');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getAdminProperties({int page = 1, int limit = 10}) async {
    try {
      final response = await HttpClient.get('/admin/properties', query: {'page': page.toString(), 'limit': limit.toString()});
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<Map<String, dynamic>>.from(data['properties'] ?? []);
      }
      throw Exception('Failed to load properties');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getAgents({int page = 1, int limit = 10}) async {
    try {
      final response = await HttpClient.get('/admin/agents', query: {'page': page.toString(), 'limit': limit.toString()});
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<Map<String, dynamic>>.from(data['agents'] ?? []);
      }
      throw Exception('Failed to load agents');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<Map<String, dynamic>> updateUserStatus(String userId, String status) async {
    try {
      final response = await HttpClient.put('/admin/users/$userId/status', body: {'status': status});
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      throw Exception('Failed to update user status');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }
}