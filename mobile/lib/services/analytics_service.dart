import 'http_client.dart';

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
}

