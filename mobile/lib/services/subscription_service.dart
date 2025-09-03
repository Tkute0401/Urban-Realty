import 'http_client.dart';

class SubscriptionService {
  static final SubscriptionService _instance = SubscriptionService._internal();
  factory SubscriptionService() => _instance;
  SubscriptionService._internal();



  Future<List<Map<String, dynamic>>> getSubscriptionPlans() async {
    try {
      final response = await HttpClient.get('/subscriptions/plans');
      if (response.statusCode == 200) {
        final data = response.data;
        return List<Map<String, dynamic>>.from((data is Map && data['plans'] != null) ? data['plans'] : []);
      }
      throw Exception('Failed to load subscription plans');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<Map<String, dynamic>> getCurrentSubscription() async {
    try {
      final response = await HttpClient.get('/subscriptions/current');
      if (response.statusCode == 200) {
        final data = response.data;
        if (data is Map<String, dynamic>) return data;
        if (data is Map) return Map<String, dynamic>.from(data);
        if (data is String) {
          return {'success': true, 'message': 'Operation completed successfully'};
        }
        throw Exception('Unexpected response format from server');
      }
      throw Exception('Failed to load current subscription');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<Map<String, dynamic>> subscribeToPlan(String planId) async {
    try {
      final response = await HttpClient.post('/subscriptions/subscribe', body: {'planId': planId});
      if (response.statusCode == 200) {
        final data = response.data;
        if (data is Map<String, dynamic>) return data;
        if (data is Map) return Map<String, dynamic>.from(data);
        if (data is String) {
          return {'success': true, 'message': 'Operation completed successfully'};
        }
        throw Exception('Unexpected response format from server');
      }
      throw Exception('Failed to subscribe to plan');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<Map<String, dynamic>> cancelSubscription() async {
    try {
      final response = await HttpClient.post('/subscriptions/cancel');
      if (response.statusCode == 200) {
        final data = response.data;
        if (data is Map<String, dynamic>) return data;
        if (data is Map) return Map<String, dynamic>.from(data);
        if (data is String) {
          return {'success': true, 'message': 'Operation completed successfully'};
        }
        throw Exception('Unexpected response format from server');
      }
      throw Exception('Failed to cancel subscription');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getBillingHistory() async {
    try {
      final response = await HttpClient.get('/subscriptions/billing-history');
      if (response.statusCode == 200) {
        final data = response.data;
        return List<Map<String, dynamic>>.from((data is Map && data['bills'] != null) ? data['bills'] : []);
      }
      throw Exception('Failed to load billing history');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }
}