import 'dart:convert';
import 'package:http/http.dart' as http;
import 'http_client.dart';

class FavoritesService {

  Future<List<dynamic>> list() async {
    final http.Response res = await HttpClient.get('/auth/favorites');
    if (res.statusCode >= 200 && res.statusCode < 300) {
      final body = jsonDecode(res.body);
      if (body is Map<String, dynamic>) {
        final data = body['data'] ?? body['favorites'] ?? body;
        if (data is List) return data;
        if (data is Map && data['data'] is List) return (data['data'] as List);
      }
      if (body is List) return body;
    }
    throw Exception('Fetch favorites failed: ${res.statusCode}');
  }

  Future<Map<String, dynamic>> toggle(String propertyId) async {
    final http.Response res = await HttpClient.put('/auth/favorites/$propertyId');
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return jsonDecode(res.body) as Map<String, dynamic>;
    }
    throw Exception('Toggle favorite failed: ${res.statusCode}');
  }

  Future<bool> status(String propertyId) async {
    final http.Response res = await HttpClient.get('/auth/favorites/$propertyId/status');
    if (res.statusCode >= 200 && res.statusCode < 300) {
      final body = jsonDecode(res.body);
      if (body is Map<String, dynamic>) {
        final dynamic value = body['isFavorite'] ?? body['data']?['isFavorite'];
        if (value is bool) return value;
      }
      return false;
    }
    throw Exception('Favorite status failed: ${res.statusCode}');
  }
}

