import 'dart:convert';
import 'package:http/http.dart' as http;

class HttpClient {
  static const String baseUrl = 'http://localhost:3000/api';
  
  static Future<http.Response> get(String endpoint, {Map<String, String>? query, Map<String, String>? headers}) async {
    try {
      Uri uri = Uri.parse('$baseUrl$endpoint');
      if (query != null) {
        uri = uri.replace(queryParameters: query.map((key, value) => MapEntry(key, value.toString())));
      }
      final response = await http.get(
        uri,
        headers: headers ?? {'Content-Type': 'application/json'},
      );
      return response;
    } catch (e) {
      throw Exception('GET request failed: $e');
    }
  }

  static Future<http.Response> post(String endpoint, {Object? body, Map<String, String>? headers}) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl$endpoint'),
        body: body != null ? jsonEncode(body) : null,
        headers: headers ?? {'Content-Type': 'application/json'},
      );
      return response;
    } catch (e) {
      throw Exception('POST request failed: $e');
    }
  }

  static Future<http.Response> put(String endpoint, {Object? body, Map<String, String>? headers}) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl$endpoint'),
        body: body != null ? jsonEncode(body) : null,
        headers: headers ?? {'Content-Type': 'application/json'},
      );
      return response;
    } catch (e) {
      throw Exception('PUT request failed: $e');
    }
  }

  static Future<http.Response> delete(String endpoint, {Map<String, String>? headers}) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl$endpoint'),
        headers: headers ?? {'Content-Type': 'application/json'},
      );
      return response;
    } catch (e) {
      throw Exception('DELETE request failed: $e');
    }
  }
}