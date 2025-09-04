
import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../config/api_config.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:async';

class ApiService {
  final Dio _dio;
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();
  final int _maxRetries = 2;

  static final String _baseUrl =
      dotenv.env['API_BASE_URL']?.trim().isNotEmpty == true
          ? dotenv.env['API_BASE_URL']!.trim()
          : ApiConfig.baseUrl;

  ApiService() : _dio = Dio() {
    _dio.options.baseUrl = _baseUrl;
    _dio.options.connectTimeout = const Duration(seconds: 30);
    _dio.options.receiveTimeout = const Duration(seconds: 30);
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _secureStorage.read(key: 'jwt_token');
        if (token != null && token.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        options.headers['Accept'] = 'application/json';
        return handler.next(options);
      },
      onResponse: (response, handler) {
        return handler.next(response);
      },
      onError: (DioException e, handler) async {
        final requestOptions = e.requestOptions;

        // Network issues: retry with simple exponential backoff
        final isNetworkError = e.type == DioExceptionType.connectionTimeout ||
            e.type == DioExceptionType.sendTimeout ||
            e.type == DioExceptionType.receiveTimeout ||
            e.type == DioExceptionType.connectionError;

        final int currentRetry = (requestOptions.extra['retryCount'] as int?) ?? 0;
        if ((isNetworkError || e.response?.statusCode == 503) && currentRetry < _maxRetries) {
          final int delayMs = 300 * (1 << currentRetry); // 300ms, 600ms
          await Future.delayed(Duration(milliseconds: delayMs));
          requestOptions.extra['retryCount'] = currentRetry + 1;
          try {
            final Response retryResponse = await _dio.fetch(requestOptions);
            return handler.resolve(retryResponse);
          } catch (err) {
            // Fall through to normalized error below
          }
        }

        // Normalize error structure
        final normalized = DioException(
          requestOptions: requestOptions,
          response: e.response,
          type: e.type,
          error: _normalizeErrorMessage(e),
        );
        return handler.next(normalized);
      },
    ));
  }

  Dio get dio => _dio;

  String _normalizeErrorMessage(DioException e) {
    try {
      final status = e.response?.statusCode;
      if (status != null) {
        final data = e.response?.data;
        if (data is Map && data['message'] is String) {
          return 'HTTP $status: ${data['message']}';
        }
        return 'HTTP $status: ${e.message ?? 'Request failed'}';
      }
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        return 'Network timeout. Please check your connection and try again.';
      }
      if (e.type == DioExceptionType.connectionError) {
        return 'Network error. You appear to be offline.';
      }
      return e.message ?? 'Unexpected error occurred.';
    } catch (_) {
      return 'Unexpected error occurred.';
    }
  }
}
