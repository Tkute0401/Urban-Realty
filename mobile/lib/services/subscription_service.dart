import 'package:dio/dio.dart';
import 'http_client.dart';

class SubscriptionService {
  Future<Response> getPlans() {
    return HttpClient.get('/subscriptions');
  }

  Future<Response> getMySubscription() {
    return HttpClient.get('/subscriptions/my-subscription');
  }

  Future<Response> getBillingHistory() {
    return HttpClient.get('/subscriptions/billing-history');
  }

  Future<Response> getUpcomingBilling() {
    return HttpClient.get('/subscriptions/upcoming-billing');
  }

  Future<Response> subscribe({
    required String subscriptionId,
    required String billingCycle,
    required String paymentMethod,
  }) {
    return HttpClient.post('/subscriptions/subscribe', body: {
      'subscriptionId': subscriptionId,
      'billingCycle': billingCycle,
      'paymentMethod': paymentMethod,
    });
  }

  Future<Response> cancelSubscription() {
    return HttpClient.put('/subscriptions/cancel');
  }

  Future<Response> updatePaymentMethod({
    required String paymentMethod,
  }) {
    return HttpClient.put('/subscriptions/payment-method', body: {
      'paymentMethod': paymentMethod,
    });
  }

  // Razorpay helpers
  Future<Response> getRazorpayKey() {
    return HttpClient.get('/subscriptions/razorpay/key');
  }

  Future<Response> createRazorpayOrder({
    required String subscriptionId,
    required String billingCycle,
  }) {
    return HttpClient.post('/subscriptions/razorpay/order', body: {
      'subscriptionId': subscriptionId,
      'billingCycle': billingCycle,
    });
  }

  Future<Response> verifyRazorpayPayment({
    required String razorpayPaymentId,
    required String razorpayOrderId,
    required String razorpaySignature,
  }) {
    return HttpClient.post('/subscriptions/razorpay/verify', body: {
      'razorpay_payment_id': razorpayPaymentId,
      'razorpay_order_id': razorpayOrderId,
      'razorpay_signature': razorpaySignature,
    });
  }
}

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
      // Use dio directly to request bytes
      final dio = HttpClient._api.dio;
      final response = await dio.get(
        '/subscriptions/invoice/$subscriptionId/download',
        options: Options(responseType: ResponseType.bytes),
      );
      if (response.statusCode == 200 && response.data is List<int>) {
        return List<int>.from(response.data as List<int>);
      }
      if (response.data is List) {
        return List<int>.from(response.data as List);
      }
      throw Exception('Failed to download invoice');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }
}