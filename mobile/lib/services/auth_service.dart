import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'http_client.dart';

class AuthService {
  final HttpClient _client = HttpClient();

  Future<Map<String, dynamic>> login({required String email, required String password}) async {
    final http.Response res = await _client.post('/auth/login', body: {
      'email': email,
      'password': password,
    });

    if (res.statusCode >= 200 && res.statusCode < 300) {
      final body = jsonDecode(res.body) as Map<String, dynamic>;
      final String? token = body['token'] as String? ?? body['data']?['token'] as String?;
      if (token != null) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', token);
      }
      return body;
    }
    throw Exception('Login failed: ${res.statusCode} ${res.body}');
  }

  Future<Map<String, dynamic>> me() async {
    final http.Response res = await _client.get('/auth/me');
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return jsonDecode(res.body) as Map<String, dynamic>;
    }
    throw Exception('Fetch me failed: ${res.statusCode}');
  }

  Future<Map<String, dynamic>> update(Map<String, dynamic> payload) async {
    final http.Response res = await _client.put('/auth/update', body: payload);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return jsonDecode(res.body) as Map<String, dynamic>;
    }
    throw Exception('Update failed: ${res.statusCode}');
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }
}

