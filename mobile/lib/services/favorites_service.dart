import 'package:dio/dio.dart';
import 'api_service.dart';
import '../models/property.dart';

class FavoritesService {
  final ApiService _apiService = ApiService();

  Future<List<Property>> getFavorites() async {
    try {
      final response = await _apiService.dio.get('/auth/favorites');
      final List<dynamic> data = response.data['data'];
      return data.map((json) => Property.fromJson(json)).toList();
    } on DioException catch (e) {
      throw Exception('Error fetching favorites: ${e.message}');
    }
  }

  Future<void> addFavorite(String propertyId) async {
    try {
      await _apiService.dio.put('/auth/favorites/$propertyId');
    } on DioException catch (e) {
      throw Exception('Error adding favorite: ${e.message}');
    }
  }

  Future<void> removeFavorite(String propertyId) async {
    try {
      await _apiService.dio.delete('/auth/favorites/$propertyId');
    } on DioException catch (e) {
      throw Exception('Error removing favorite: ${e.message}');
    }
  }

  Future<bool> isFavorite(String propertyId) async {
    try {
      final response = await _apiService.dio.get('/auth/favorites/$propertyId/status');
      return response.data['data']['isFavorite'] ?? false;
    } on DioException catch (e) {
      // If the status endpoint fails, assume it's not a favorite
      print('Error checking favorite status: ${e.message}');
      return false;
    }
  }
}