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
        return jsonDecode(response.body);
      }
      throw Exception('Failed to load agent dashboard');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getAgentProperties({int page = 1, int limit = 10}) async {
    try {
      final response = await HttpClient.get('/agent/properties', query: {'page': page.toString(), 'limit': limit.toString()});
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<Map<String, dynamic>>.from(data['properties'] ?? []);
      }
      throw Exception('Failed to load agent properties');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getAgentLeads({int page = 1, int limit = 10}) async {
    try {
      final response = await HttpClient.get('/agent/leads', query: {'page': page.toString(), 'limit': limit.toString()});
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<Map<String, dynamic>>.from(data['leads'] ?? []);
      }
      throw Exception('Failed to load agent leads');
    } catch (e) {
      throw Exception('Error: load agent leads');
    }
  }

  Future<List<Map<String, dynamic>>> getAgentInquiries({int page = 1, int limit = 10}) async {
    try {
      final response = await HttpClient.get('/agent/inquiries', query: {'page': page.toString(), 'limit': limit.toString()});
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<Map<String, dynamic>>.from(data['inquiries'] ?? []);
      }
      throw Exception('Failed to load agent inquiries');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<Map<String, dynamic>> getAgentAnalytics() async {
    try {
      final response = await HttpClient.get('/agent/analytics');
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      throw Exception('Failed to load agent analytics');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }
}