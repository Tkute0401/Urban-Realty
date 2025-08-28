import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';

class HttpClient {
  HttpClient._internal();
  static final HttpClient _instance = HttpClient._internal();
  factory HttpClient() => _instance;

  Future<Map<String, String>> _buildHeaders({Map<String, String>? headers, bool isMultipart = false}) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString('auth_token');

    final Map<String, String> finalHeaders = {
      if (!isMultipart) 'Content-Type': 'application/json',
      ...?headers,
    };

    if (token != null && token.isNotEmpty) {
      finalHeaders['Authorization'] = 'Bearer $token';
    }
    return finalHeaders;
  }

  Uri _uri(String path, [Map<String, dynamic>? query]) {
    return Uri.parse('${ApiConfig.baseUrl}$path').replace(queryParameters: query?.map((k, v) => MapEntry(k, v.toString())));
  }

  Future<http.Response> get(String path, {Map<String, dynamic>? query}) async {
    final headers = await _buildHeaders();
    return http.get(_uri(path, query), headers: headers);
  }

  Future<http.Response> post(String path, {Object? body, Map<String, String>? headers}) async {
    final finalHeaders = await _buildHeaders(headers: headers);
    return http.post(_uri(path), headers: finalHeaders, body: body is String ? body : jsonEncode(body));
  }

  Future<http.Response> put(String path, {Object? body, Map<String, String>? headers}) async {
    final finalHeaders = await _buildHeaders(headers: headers);
    return http.put(_uri(path), headers: finalHeaders, body: body is String ? body : jsonEncode(body));
  }

  Future<http.Response> delete(String path, {Object? body}) async {
    final headers = await _buildHeaders();
    return http.delete(_uri(path), headers: headers, body: body == null ? null : jsonEncode(body));
  }
}

