import 'dart:convert';
import 'http_client.dart';

class AgentService {
  static final AgentService _instance = AgentService._internal();
  factory AgentService() => _instance;
  AgentService._internal();



  Future<Map<String, dynamic>> getAgentDashboard() async {
    try {
      final response = await HttpClient.get('/agent/dashboard');
      if (response.statusCode == 200) {
        // Check if response is JSON
        final contentType = response.headers['content-type'];
        if (contentType != null && contentType.contains('application/json')) {
          return jsonDecode(response.body);
        } else {
          throw Exception('Server returned non-JSON response. Status: ${response.statusCode}');
        }
      }
      throw Exception('Failed to load agent dashboard. Status: ${response.statusCode}');
    } catch (e) {
      if (e.toString().contains('FormatException')) {
        throw Exception('Server returned invalid JSON. Please check your connection.');
      }
      throw Exception('Error: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getAgentProperties({int page = 1, int limit = 10}) async {
    try {
      final response = await HttpClient.get('/agent/properties', query: {'page': page.toString(), 'limit': limit.toString()});
      if (response.statusCode == 200) {
        // Check if response is JSON
        final contentType = response.headers['content-type'];
        if (contentType != null && contentType.contains('application/json')) {
          final data = jsonDecode(response.body);
          return List<Map<String, dynamic>>.from(data['properties'] ?? []);
        } else {
          throw Exception('Server returned non-JSON response. Status: ${response.statusCode}');
        }
      }
      throw Exception('Failed to load agent properties. Status: ${response.statusCode}');
    } catch (e) {
      if (e.toString().contains('FormatException')) {
        throw Exception('Server returned invalid JSON. Please check your connection.');
      }
      throw Exception('Error: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getAgentLeads({int page = 1, int limit = 10}) async {
    try {
      final response = await HttpClient.get('/agent/leads', query: {'page': page.toString(), 'limit': limit.toString()});
      if (response.statusCode == 200) {
        // Check if response is JSON
        final contentType = response.headers['content-type'];
        if (contentType != null && contentType.contains('application/json')) {
          final data = jsonDecode(response.body);
          return List<Map<String, dynamic>>.from(data['leads'] ?? []);
        } else {
          throw Exception('Server returned non-JSON response. Status: ${response.statusCode}');
        }
      }
      throw Exception('Failed to load agent leads. Status: ${response.statusCode}');
    } catch (e) {
      if (e.toString().contains('FormatException')) {
        throw Exception('Server returned invalid JSON. Please check your connection.');
      }
      throw Exception('Error: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getAgentInquiries({int page = 1, int limit = 10}) async {
    try {
      final response = await HttpClient.get('/agent/inquiries', query: {'page': page.toString(), 'limit': limit.toString()});
      if (response.statusCode == 200) {
        // Check if response is JSON
        final contentType = response.headers['content-type'];
        if (contentType != null && contentType.contains('application/json')) {
          final data = jsonDecode(response.body);
          return List<Map<String, dynamic>>.from(data['inquiries'] ?? []);
        } else {
          throw Exception('Server returned non-JSON response. Status: ${response.statusCode}');
        }
      }
      throw Exception('Failed to load agent inquiries. Status: ${response.statusCode}');
    } catch (e) {
      if (e.toString().contains('FormatException')) {
        throw Exception('Server returned invalid JSON. Please check your connection.');
      }
      throw Exception('Error: $e');
    }
  }

  Future<Map<String, dynamic>> getAgentAnalytics() async {
    try {
      final response = await HttpClient.get('/agent/analytics');
      if (response.statusCode == 200) {
        // Check if response is JSON
        final contentType = response.headers['content-type'];
        if (contentType != null && contentType.contains('application/json')) {
          return jsonDecode(response.body);
        } else {
          throw Exception('Server returned non-JSON response. Status: ${response.statusCode}');
        }
      }
      throw Exception('Failed to load agent analytics. Status: ${response.statusCode}');
    } catch (e) {
      if (e.toString().contains('FormatException')) {
        throw Exception('Server returned invalid JSON. Please check your connection.');
      }
      throw Exception('Error: $e');
    }
  }
}