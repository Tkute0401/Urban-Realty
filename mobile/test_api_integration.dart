import 'dart:convert';
import 'package:dio/dio.dart';

// Simple test to verify API integration works
void main() async {
  final dio = Dio();
  dio.options.baseUrl = 'https://urban-realty-production.up.railway.app/api/v1';
  dio.options.connectTimeout = const Duration(seconds: 30);
  dio.options.receiveTimeout = const Duration(seconds: 30);

  try {
    print('Testing properties API...');
    final response = await dio.get('/properties', queryParameters: {'limit': 3});
    
    if (response.data is Map<String, dynamic>) {
      final responseData = response.data as Map<String, dynamic>;
      print('Success: ${responseData['success']}');
      print('Count: ${responseData['count']}');
      
      if (responseData['data'] is List) {
        final properties = responseData['data'] as List<dynamic>;
        print('Properties found: ${properties.length}');
        
        if (properties.isNotEmpty) {
          final firstProperty = properties.first as Map<String, dynamic>;
          print('First property title: ${firstProperty['title']}');
          print('First property address: ${firstProperty['address']}');
          print('First property city: ${firstProperty['address'] is Map ? (firstProperty['address'] as Map)['city'] : 'N/A'}');
        }
      }
    }
    
    print('\nTesting search suggestions API...');
    final suggestionsResponse = await dio.get('/properties/search-suggestions', queryParameters: {'q': 'pune'});
    
    if (suggestionsResponse.data is Map<String, dynamic>) {
      final suggestionsData = suggestionsResponse.data as Map<String, dynamic>;
      print('Suggestions success: ${suggestionsData['success']}');
      print('Suggestions data: ${suggestionsData['data']}');
    }
    
    print('\n✅ All API tests passed!');
    
  } catch (e) {
    print('❌ API test failed: $e');
  }
}