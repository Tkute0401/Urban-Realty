
import 'package:dio/dio.dart';
import '../models/property.dart';
import 'api_service.dart';

class PropertyService {
  final ApiService _apiService = ApiService();

  Future<List<Property>> getProperties({
    String? search,
    String? city,
    String? locality,
    double? minPrice,
    double? maxPrice,
    List<String>? amenities,
    int? page,
    int? limit,
    String? propertyType,
    int? bedrooms,
    int? bathrooms,
    String? furnishing,
    bool? verified,
    bool? featured,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        if (search != null) 'keyword': search, // API uses 'keyword' for search
        if (city != null) 'city': city,
        if (locality != null) 'locality': locality,
        if (minPrice != null) 'price[gte]': minPrice,
        if (maxPrice != null) 'price[lte]': maxPrice,
        if (amenities != null) 'amenities[in]': amenities.join(','),
        if (page != null) 'page': page,
        if (limit != null) 'limit': limit,
        if (propertyType != null) 'propertyType': propertyType,
        if (bedrooms != null) 'bedrooms[gte]': bedrooms,
        if (bathrooms != null) 'bathrooms[gte]': bathrooms,
        if (furnishing != null) 'furnishing': furnishing,
        if (verified != null) 'isVerified': verified,
        if (featured != null) 'isFeatured': featured,
      };

      final response = await _apiService.dio.get(
        '/properties',
        queryParameters: queryParams,
      );

      // Handle the API response structure: { success: true, data: [...], count: number }
      if (response.data is Map<String, dynamic>) {
        final responseData = response.data as Map<String, dynamic>;
        if (responseData['success'] == true && responseData['data'] is List) {
          final List<dynamic> data = responseData['data'] as List<dynamic>;
          return data.map((json) => Property.fromJson(json)).toList();
        }
      }
      
      // Fallback to empty list if structure is unexpected
      return <Property>[];
    } on DioException catch (e) {
      throw Exception('Error fetching properties: ${e.message}');
    }
  }

  // Backwards-compat for callers expecting static list() returning raw map/list
  static Future<dynamic> list() async {
    try {
      final service = PropertyService();
      final response = await service._apiService.dio.get('/properties', queryParameters: {'limit': 50});
      
      // Handle the API response structure: { success: true, data: [...], count: number }
      if (response.data is Map<String, dynamic>) {
        final responseData = response.data as Map<String, dynamic>;
        if (responseData['success'] == true && responseData['data'] is List) {
          return responseData['data'] as List<dynamic>;
        }
      }
      
      // Fallback to empty list if structure is unexpected
      return <dynamic>[];
    } catch (e) {
      // Error in PropertyService.list(): $e
      return <dynamic>[];
    }
  }

  static Future<dynamic> searchSuggestions(String query) async {
    try {
      final service = PropertyService();
      final response = await service._apiService.dio.get(
        '/properties/search-suggestions',
        queryParameters: {'q': query},
      );
      
      // Handle the API response structure: { success: true, data: [...] }
      if (response.data is Map<String, dynamic>) {
        final responseData = response.data as Map<String, dynamic>;
        if (responseData['success'] == true && responseData['data'] is List) {
          return responseData['data'] as List<dynamic>;
        }
      }
      
      // Fallback to empty list if structure is unexpected
      return <dynamic>[];
    } catch (e) {
      // Error in PropertyService.searchSuggestions(): $e
      return <dynamic>[];
    }
  }

  Future<Property> getPropertyById(String id) async {
    try {
      final response = await _apiService.dio.get('/properties/$id');
      
      // Handle the API response structure: { success: true, data: {...} }
      if (response.data is Map<String, dynamic>) {
        final responseData = response.data as Map<String, dynamic>;
        if (responseData['success'] == true && responseData['data'] is Map<String, dynamic>) {
          return Property.fromJson(responseData['data'] as Map<String, dynamic>);
        }
      }
      
      throw Exception('Invalid response structure');
    } on DioException catch (e) {
      throw Exception('Error fetching property: ${e.message}');
    }
  }

  Future<List<Property>> getFeaturedProperties() async {
    try {
      final response = await _apiService.dio.get('/properties/featured');
      
      // Handle the API response structure: { success: true, data: [...] }
      if (response.data is Map<String, dynamic>) {
        final responseData = response.data as Map<String, dynamic>;
        if (responseData['success'] == true && responseData['data'] is List) {
          final List<dynamic> data = responseData['data'] as List<dynamic>;
          return data.map((json) => Property.fromJson(json)).toList();
        }
      }
      
      // Fallback to empty list if structure is unexpected
      return <Property>[];
    } on DioException catch (e) {
      throw Exception('Error fetching featured properties: ${e.message}');
    }
  }

  Future<List<String>> getSearchSuggestions(String query) async {
    try {
      final response = await _apiService.dio.get(
        '/properties/search-suggestions',
        queryParameters: {'q': query},
      );
      
      // Handle the API response structure: { success: true, data: [...] }
      if (response.data is Map<String, dynamic>) {
        final responseData = response.data as Map<String, dynamic>;
        if (responseData['success'] == true && responseData['data'] is List) {
          final List<dynamic> data = responseData['data'] as List<dynamic>;
          return data.cast<String>();
        }
      }
      
      // Fallback to empty list if structure is unexpected
      return <String>[];
    } on DioException catch (e) {
      throw Exception('Error fetching search suggestions: ${e.message}');
    }
  }

  Future<Property> createProperty(
      Map<String, dynamic> propertyData, List<String> imagePaths) async {
    try {
      final formData = FormData.fromMap(propertyData);

      for (var imagePath in imagePaths) {
        formData.files.add(MapEntry(
          'images', // The field name expected by the server (Multer)
          await MultipartFile.fromFile(imagePath),
        ));
      }

      final response = await _apiService.dio.post(
        '/properties',
        data: formData,
      );

      // Handle the API response structure: { success: true, data: {...} }
      if (response.data is Map<String, dynamic>) {
        final responseData = response.data as Map<String, dynamic>;
        if (responseData['success'] == true && responseData['data'] is Map<String, dynamic>) {
          return Property.fromJson(responseData['data'] as Map<String, dynamic>);
        }
      }
      
      throw Exception('Invalid response structure');
    } on DioException catch (e) {
      throw Exception('Error creating property: ${e.message}');
    }
  }
  
  Future<Property> updateProperty(String id, Map<String, dynamic> propertyData) async {
    try {
      final response = await _apiService.dio.put(
        '/properties/$id',
        data: propertyData,
      );
      
      // Handle the API response structure: { success: true, data: {...} }
      if (response.data is Map<String, dynamic>) {
        final responseData = response.data as Map<String, dynamic>;
        if (responseData['success'] == true && responseData['data'] is Map<String, dynamic>) {
          return Property.fromJson(responseData['data'] as Map<String, dynamic>);
        }
      }
      
      throw Exception('Invalid response structure');
    } on DioException catch (e) {
      throw Exception('Error updating property: ${e.message}');
    }
  }

  Future<void> deleteProperty(String id) async {
    try {
      await _apiService.dio.delete('/properties/$id');
    } on DioException catch (e) {
      throw Exception('Error deleting property: ${e.message}');
    }
  }
}
