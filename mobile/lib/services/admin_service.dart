import 'http_client.dart';

class AdminService {
  static final AdminService _instance = AdminService._internal();
  factory AdminService() => _instance;
  AdminService._internal();



  Future<Map<String, dynamic>> getDashboardStats() async {
    try {
      final response = await HttpClient.get('/admin/dashboard');
      if (response.statusCode == 200) {
        final data = response.data;
        if (data is Map<String, dynamic>) return data;
        if (data is Map) return Map<String, dynamic>.from(data);
        if (data is String) {
          // Handle case where server returns a string instead of JSON
          return {
            'stats': {
              'totalUsers': 0,
              'totalProperties': 0,
              'totalAgents': 0,
              'totalRevenue': 0,
            },
            'recentActivities': [],
          };
        }
        throw Exception('Unexpected response format from server');
      }
      throw Exception('Failed to load dashboard stats. Status: ${response.statusCode}');
    } catch (e) {
      if (e.toString().contains('FormatException')) {
        throw Exception('Server returned invalid JSON. Please check your connection.');
      }
      if (e.toString().contains('type \'String\' is not a subtype of type \'Map<dynamic, dynamic>\'')) {
        // Return default data when type cast fails
        return {
          'stats': {
            'totalUsers': 0,
            'totalProperties': 0,
            'totalAgents': 0,
            'totalRevenue': 0,
          },
          'recentActivities': [],
        };
      }
      throw Exception('Error: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getUsers({int page = 1, int limit = 10}) async {
    try {
      final response = await HttpClient.get('/admin/users', query: {'page': page.toString(), 'limit': limit.toString()});
      if (response.statusCode == 200) {
        final data = response.data;
        return List<Map<String, dynamic>>.from((data is Map && data['users'] != null) ? data['users'] : []);
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
        final data = response.data;
        return List<Map<String, dynamic>>.from((data is Map && data['properties'] != null) ? data['properties'] : []);
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
        final data = response.data;
        return List<Map<String, dynamic>>.from((data is Map && data['agents'] != null) ? data['agents'] : []);
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
        final data = response.data;
        if (data is Map<String, dynamic>) return data;
        if (data is Map) return Map<String, dynamic>.from(data);
        if (data is String) {
          return {'success': true, 'message': 'Status updated successfully'};
        }
        throw Exception('Unexpected response format from server');
      }
      throw Exception('Failed to update user status');
    } catch (e) {
      if (e.toString().contains('type \'String\' is not a subtype of type \'Map<dynamic, dynamic>\'')) {
        return {'success': true, 'message': 'Status updated successfully'};
      }
      throw Exception('Error: $e');
    }
  }
}