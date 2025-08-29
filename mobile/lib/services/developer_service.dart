import 'dart:convert';
import 'http_client.dart';

class DeveloperService {
  static final DeveloperService _instance = DeveloperService._internal();
  factory DeveloperService() => _instance;
  DeveloperService._internal();

  final HttpClient _httpClient = HttpClient();

  Future<List<Map<String, dynamic>>> getDevelopers({int page = 1, int limit = 10}) async {
    try {
      final response = await _httpClient.get('/developers', query: {'page': page, 'limit': limit});
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<Map<String, dynamic>>.from(data['developers'] ?? []);
      }
      throw Exception('Failed to load developers');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<Map<String, dynamic>> getDeveloperDetails(String developerId) async {
    try {
      final response = await _httpClient.get('/developers/$developerId');
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      throw Exception('Failed to load developer details');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<Map<String, dynamic>> addDeveloper(Map<String, dynamic> developerData) async {
    try {
      final response = await _httpClient.post('/developers', body: developerData);
      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      }
      throw Exception('Failed to add developer');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<Map<String, dynamic>> updateDeveloper(String developerId, Map<String, dynamic> developerData) async {
    try {
      final response = await _httpClient.put('/developers/$developerId', body: developerData);
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      throw Exception('Failed to update developer');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<bool> deleteDeveloper(String developerId) async {
    try {
      final response = await _httpClient.delete('/developers/$developerId');
      return response.statusCode == 200;
    } catch (e) {
      throw Exception('Error: $e');
    }
  }
}