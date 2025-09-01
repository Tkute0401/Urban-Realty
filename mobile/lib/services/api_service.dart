
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  final Dio _dio;
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  static const String _baseUrl = 'https://urban-realty-production.up.railway.app/api/v1';

  ApiService() : _dio = Dio() {
    _dio.options.baseUrl = _baseUrl;
    _dio.options.connectTimeout = const Duration(seconds: 30);
    _dio.options.receiveTimeout = const Duration(seconds: 30);
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _secureStorage.read(key: 'jwt_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (DioException e, handler) {
        // Handle 401 Unauthorized errors, potentially logging the user out.
        if (e.response?.statusCode == 401) {
          // For now, we'll just pass the error on.
          // In a later step, we can implement a global logout.
        }
        return handler.next(e);
      },
    ));
  }

  Dio get dio => _dio;
}
