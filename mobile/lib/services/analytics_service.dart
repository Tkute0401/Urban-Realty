import 'package:dio/dio.dart';
import 'http_client.dart';
import '../utils/file_saver.dart';

class AnalyticsService {
  static final AnalyticsService _instance = AnalyticsService._internal();
  factory AnalyticsService() => _instance;
  AnalyticsService._internal();

  Future<void> track(String eventName, Map<String, dynamic> properties) async {
    try {
      await HttpClient.post('/analytics/track', body: {
        'event': eventName,
        'properties': properties,
        'source': 'mobile',
      });
    } catch (_) {
      // Swallow analytics errors to avoid breaking UX
    }
  }

  // Admin: dashboard metrics
  Future<Map<String, dynamic>> getDashboardAnalytics() async {
    final response = await HttpClient.get('/analytics/dashboard');
    return _unwrapData(response);
  }

  // Admin: search analytics with timeframe (e.g., 1h, 24h, 7d, 30d)
  Future<Map<String, dynamic>> getSearchAnalytics({String timeframe = '24h'}) async {
    final response = await HttpClient.get('/analytics/search', query: {'timeframe': timeframe});
    return _unwrapData(response);
  }

  // Admin: system metrics
  Future<Map<String, dynamic>> getSystemMetrics() async {
    final response = await HttpClient.get('/analytics/system');
    return _unwrapData(response);
  }

  // Admin: export analytics, saves CSV to device and returns local path
  Future<String> exportAnalyticsCsv() async {
    final Response<List<int>> response = await HttpClient.getRaw<List<int>(
      '/analytics/export',
      query: {'format': 'csv'},
      options: Options(responseType: ResponseType.bytes),
    );

    final bytes = response.data ?? <int>[];
    final String savedPath = await FileSaver.saveBytes(
      bytes: bytes,
      fileName: 'analytics_${DateTime.now().toIso8601String().replaceAll(':', '-')}.csv',
      subdirectory: 'UrbanRealty/Analytics',
    );
    return savedPath;
  }

  Map<String, dynamic> _unwrapData(Response response) {
    final dynamic data = response.data;
    if (data is Map<String, dynamic>) {
      if (data['success'] == true && data['data'] is Map<String, dynamic>) {
        return data['data'] as Map<String, dynamic>;
      }
      return data;
    }
    if (data is Map) {
      final mapData = Map<String, dynamic>.from(data);
      if (mapData['success'] == true && mapData['data'] is Map<String, dynamic>) {
        return mapData['data'] as Map<String, dynamic>;
      }
      return mapData;
    }
    return <String, dynamic>{};
  }
}

