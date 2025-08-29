import 'dart:convert';
import 'http_client.dart';

class AdminService {
  static final AdminService _instance = AdminService._internal();
  factory AdminService() => _instance;
  AdminService._internal();

  final HttpClient _httpClient = HttpClient();

  Future<Map<String, dynamic>> getDashboardStats() async {
    try {
      final response = await _httpClient.get('/admin/dashboard');
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      throw Exception('Failed to load dashboard stats');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getUsers({int page = 1, int limit = 10}) async {
    try {
      final response = await _httpClient.get('/admin/users', query: {'page': page, 'limit': limit});
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
      final response = await _httpClient.get('/admin/properties', query: {'page': page, 'limit': limit});
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
      final response = await _httpClient.get('/admin/agents', query: {'page': page, 'limit': limit});
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<Map<String, dynamic>>.from(data['agents'] ?? []);
      }
      throw Exception('Failed to load agents');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }
}