import 'http_client.dart';

class DeveloperService {
  static final DeveloperService _instance = DeveloperService._internal();
  factory DeveloperService() => _instance;
  DeveloperService._internal();



  Future<List<Map<String, dynamic>>> getDevelopers({int page = 1, int limit = 10}) async {
    try {
      final response = await HttpClient.get('/developers', query: {'page': page.toString(), 'limit': limit.toString()});
      if (response.statusCode == 200) {
        final data = response.data;
        return List<Map<String, dynamic>>.from((data is Map && data['developers'] != null) ? data['developers'] : []);
      }
      throw Exception('Failed to load developers');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<Map<String, dynamic>> getDeveloperDetails(String developerId) async {
    try {
      final response = await HttpClient.get('/developers/$developerId');
      if (response.statusCode == 200) {
        final data = response.data;
        if (data is Map<String, dynamic>) return data;
        return Map<String, dynamic>.from(data as Map);
      }
      throw Exception('Failed to load developer details');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<Map<String, dynamic>> addDeveloper(Map<String, dynamic> developerData) async {
    try {
      final response = await HttpClient.post('/developers', body: developerData);
      if (response.statusCode == 201) {
        final data = response.data;
        if (data is Map<String, dynamic>) return data;
        return Map<String, dynamic>.from(data as Map);
      }
      throw Exception('Failed to add developer');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<Map<String, dynamic>> updateDeveloper(String developerId, Map<String, dynamic> developerData) async {
    try {
      final response = await HttpClient.put('/developers/$developerId', body: developerData);
      if (response.statusCode == 200) {
        final data = response.data;
        if (data is Map<String, dynamic>) return data;
        return Map<String, dynamic>.from(data as Map);
      }
      throw Exception('Failed to update developer');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<bool> deleteDeveloper(String developerId) async {
    try {
      final response = await HttpClient.delete('/developers/$developerId');
      return response.statusCode == 200;
    } catch (e) {
      throw Exception('Error: $e');
    }
  }
}