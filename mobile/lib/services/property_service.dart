import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/property.dart';

class PropertyService {
  static const String baseUrl = 'http://localhost:3000/api';

  static Future<List<Property>> getProperties({
    String? search,
    String? location,
    double? minPrice,
    double? maxPrice,
    List<String>? amenities,
    int? page,
    int? limit,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (search != null) queryParams['search'] = search;
      if (location != null) queryParams['location'] = location;
      if (minPrice != null) queryParams['minPrice'] = minPrice.toString();
      if (maxPrice != null) queryParams['maxPrice'] = maxPrice.toString();
      if (amenities != null) queryParams['amenities'] = amenities.join(',');
      if (page != null) queryParams['page'] = page.toString();
      if (limit != null) queryParams['limit'] = limit.toString();

      final uri = Uri.parse('$baseUrl/properties').replace(queryParameters: queryParams);
      final response = await http.get(uri);

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Property.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load properties');
      }
    } catch (e) {
      throw Exception('Error fetching properties: $e');
    }
  }

  static Future<Property> getPropertyById(String id) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/properties/$id'));
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return Property.fromJson(data);
      } else {
        throw Exception('Failed to load property');
      }
    } catch (e) {
      throw Exception('Error fetching property: $e');
    }
  }

  static Future<List<Property>> getFeaturedProperties() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/properties/featured'));
      
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Property.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load featured properties');
      }
    } catch (e) {
      throw Exception('Error fetching featured properties: $e');
    }
  }

  static Future<List<Property>> getRecentlyViewedProperties() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/properties/recently-viewed'));
      
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Property.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load recently viewed properties');
      }
    } catch (e) {
      throw Exception('Error fetching recently viewed properties: $e');
    }
  }
}