import 'package:dio/dio.dart';
import 'api_service.dart';
import '../models/property.dart';

class RecentlyViewedService {
  RecentlyViewedService._internal();
  static final RecentlyViewedService _instance = RecentlyViewedService._internal();
  factory RecentlyViewedService() => _instance;

  final ApiService _apiService = ApiService();

  Future<List<Property>> getRecentlyViewed() async {
    try {
      final Response response = await _apiService.dio.get('/auth/recently-viewed');
      final List<dynamic> items = (response.data is Map && response.data['data'] is List)
          ? response.data['data'] as List
          : (response.data as List);
      return items.map((item) {
        if (item is Map && item['property'] != null) {
          return Property.fromJson(item['property'] as Map<String, dynamic>);
        }
        return Property.fromJson(item as Map<String, dynamic>);
      }).toList();
    } on DioException catch (e) {
      throw Exception('Error fetching recently viewed: ${e.error ?? e.message}');
    }
  }

  Future<void> trackViewed(String propertyId) async {
    try {
      await _apiService.dio.post('/auth/recently-viewed/$propertyId');
    } on DioException catch (e) {
      // Do not throw for tracking; just swallow to avoid breaking UX
      // ignore: avoid_print
      print('Failed to track recently viewed: ${e.error ?? e.message}');
    }
  }
}

