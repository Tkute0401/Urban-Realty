import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/property.dart';

class PropertyService {
  static const String baseUrl = 'https://urban-realty-production.up.railway.app/api/v1';

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

  static Future<Map<String, dynamic>> list() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/properties'));
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data;
      } else {
        throw Exception('Failed to load properties');
      }
    } catch (e) {
      throw Exception('Error fetching properties: $e');
    }
  }

  static Future<Map<String, dynamic>> searchSuggestions(String query) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/properties/search-suggestions?q=$query'),
      );
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data;
      } else {
        throw Exception('Failed to load search suggestions');
      }
    } catch (e) {
      throw Exception('Error fetching search suggestions: $e');
    }
  }

  static Future<Map<String, dynamic>> detail(String id) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/properties/$id'));
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data;
      } else {
        throw Exception('Failed to load property details');
      }
    } catch (e) {
      throw Exception('Error fetching property details: $e');
    }
  }

  static Future<Map<String, dynamic>> contact(String propertyId, Map<String, dynamic> contactData) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/properties/$propertyId/contact'),
        body: jsonEncode(contactData),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to send contact request');
      }
    } catch (e) {
      throw Exception('Error sending contact request: $e');
    }
  }

  static Future<bool> createProperty(Map<String, dynamic> propertyData, List<String> imagePaths) async {
    try {
      // Create multipart request for property data and images
      final request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/properties'),
      );

      // Add property data as fields
      propertyData.forEach((key, value) {
        if (value != null) {
          if (value is List) {
            request.fields[key] = value.join(',');
          } else {
            request.fields[key] = value.toString();
          }
        }
      });

      // Add images as files
      for (int i = 0; i < imagePaths.length; i++) {
        final file = await http.MultipartFile.fromPath(
          'images',
          imagePaths[i],
        );
        request.files.add(file);
      }

      final response = await request.send();
      final responseBody = await response.stream.bytesToString();

      if (response.statusCode == 200 || response.statusCode == 201) {
        return true;
      } else {
        throw Exception('Failed to create property: ${response.statusCode} - $responseBody');
      }
    } catch (e) {
      throw Exception('Error creating property: $e');
    }
  }
}