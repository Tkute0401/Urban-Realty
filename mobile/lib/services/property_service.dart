import 'dart:convert';
import 'package:http/http.dart' as http;
import 'http_client.dart';

class PropertyService {
  final HttpClient _client = HttpClient();

  Future<Map<String, dynamic>> list({Map<String, dynamic>? query}) async {
    final http.Response res = await _client.get('/properties', query: query);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return jsonDecode(res.body) as Map<String, dynamic>;
    }
    throw Exception('List properties failed: ${res.statusCode}');
  }

  Future<Map<String, dynamic>> featured() async {
    final http.Response res = await _client.get('/properties/featured');
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return jsonDecode(res.body) as Map<String, dynamic>;
    }
    throw Exception('Featured properties failed: ${res.statusCode}');
  }

  Future<Map<String, dynamic>> searchSuggestions(String query) async {
    final http.Response res = await _client.get('/properties/search-suggestions', query: {'q': query});
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return jsonDecode(res.body) as Map<String, dynamic>;
    }
    throw Exception('Search suggestions failed: ${res.statusCode}');
  }

  Future<Map<String, dynamic>> propertiesInRadius(String zipcode, int distance) async {
    final http.Response res = await _client.get('/properties/radius/$zipcode/$distance');
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return jsonDecode(res.body) as Map<String, dynamic>;
    }
    throw Exception('Properties in radius failed: ${res.statusCode}');
  }

  Future<Map<String, dynamic>> agentProperties(String agentId) async {
    final http.Response res = await _client.get('/properties/agent/$agentId');
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return jsonDecode(res.body) as Map<String, dynamic>;
    }
    throw Exception('Agent properties failed: ${res.statusCode}');
  }

  Future<Map<String, dynamic>> detail(String id) async {
    final http.Response res = await _client.get('/properties/$id');
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return jsonDecode(res.body) as Map<String, dynamic>;
    }
    throw Exception('Property detail failed: ${res.statusCode}');
  }

  Future<Map<String, dynamic>> contact({
    required String id,
    required String message,
    required String contactMethod,
  }) async {
    final http.Response res = await _client.post('/properties/$id/contact', body: {
      'message': message,
      'contactMethod': contactMethod,
    });
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return jsonDecode(res.body) as Map<String, dynamic>;
    }
    throw Exception('Contact agent failed: ${res.statusCode} ${res.body}');
  }
}

