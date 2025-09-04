import 'http_client.dart';

class SubscriptionService {
  static final SubscriptionService _instance = SubscriptionService._internal();
  factory SubscriptionService() => _instance;
  SubscriptionService._internal();



  Future<List<Map<String, dynamic>>> getSubscriptionPlans() async {
    try {
      // Server returns { success, data: [ ...plans ] } at GET /subscriptions
      final response = await HttpClient.get('/subscriptions');
      if (response.statusCode == 200) {
        final data = response.data;
        if (data is Map && data['data'] is List) {
          return List<Map<String, dynamic>>.from(data['data'] as List<dynamic>);
        }
        return <Map<String, dynamic>>[];
      }
      throw Exception('Failed to load subscription plans');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<Map<String, dynamic>> getCurrentSubscription() async {
    try {
      // Server route: GET /subscriptions/my-subscription -> { success, data }
      final response = await HttpClient.get('/subscriptions/my-subscription');
      if (response.statusCode == 200) {
        final data = response.data;
        if (data is Map<String, dynamic>) return data['data'] is Map<String, dynamic> ? data['data'] as Map<String, dynamic> : data;
        if (data is Map) return Map<String, dynamic>.from(data['data'] is Map ? data['data'] : data);
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
      // Server expects { subscriptionId, billingCycle? }
      final response = await HttpClient.post('/subscriptions/subscribe', body: {'subscriptionId': planId});
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
      // Server route uses PUT /subscriptions/cancel
      final response = await HttpClient.put('/subscriptions/cancel');
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
        if (data is Map && data['data'] is List) {
          return List<Map<String, dynamic>>.from(data['data'] as List<dynamic>);
        }
        return <Map<String, dynamic>>[];
      }
      throw Exception('Failed to load billing history');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getUpcomingBilling() async {
    try {
      final response = await HttpClient.get('/subscriptions/upcoming-billing');
      if (response.statusCode == 200) {
        final data = response.data;
        if (data is Map && data['data'] is List) {
          return List<Map<String, dynamic>>.from(data['data'] as List<dynamic>);
        }
        return <Map<String, dynamic>>[];
      }
      throw Exception('Failed to load upcoming billing');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<List<int>> downloadInvoicePdf(String subscriptionId) async {
    try {
      final response = await HttpClient.get('/subscriptions/invoice/$subscriptionId/download');
      if (response.statusCode == 200) {
        // Assuming server returns binary PDF; dio may already parse bytes
        final data = response.data;
        if (data is List<int>) return data;
        if (data is List) return List<int>.from(data);
      }
      throw Exception('Failed to download invoice');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }
}