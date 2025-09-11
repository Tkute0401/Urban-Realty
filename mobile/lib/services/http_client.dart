import 'package:dio/dio.dart';
import 'api_service.dart';

class HttpClient {
  static final ApiService _api = ApiService();

  static Future<Response> get(String path, {Map<String, dynamic>? query}) {
    return _api.dio.get(path, queryParameters: query);
  }

  static Future<Response> post(String path, {dynamic body}) {
    return _api.dio.post(path, data: body);
  }

  static Future<Response> put(String path, {dynamic body}) {
    return _api.dio.put(path, data: body);
  }

  static Future<Response> delete(String path, {dynamic body}) {
    return _api.dio.delete(path, data: body);
  }

  // Raw GET helper to customize options like responseType
  static Future<Response<T>> getRaw<T>(String path, {Map<String, dynamic>? query, Options? options}) {
    return _api.dio.get<T>(path, queryParameters: query, options: options);
  }

  // Multipart POST helper for file uploads
  static Future<Response> postMultipart(String path, {required FormData formData, Options? options}) {
    return _api.dio.post(path, data: formData, options: options);
  }
}

