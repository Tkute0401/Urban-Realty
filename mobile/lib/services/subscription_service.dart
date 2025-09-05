import 'package:dio/dio.dart';
import 'http_client.dart';

class SubscriptionService {
  static final SubscriptionService _instance = SubscriptionService._internal();
  factory SubscriptionService() => _instance;
  SubscriptionService._internal();

  Future<List<Map<String, dynamic>>> getSubscriptionPlans() async {
    try {
      final response = await HttpClient.get('/subscriptions');
      if (response.statusCode == 200) {
        final data = response.data;
        if (data is Map) {
          final dynamic inner = (data as Map)['data'];
          if (inner is List) {
            return List<Map<String, dynamic>>.from(inner as List<dynamic>);
          }
          if (inner is Map) {
            return [Map<String, dynamic>.from(inner as Map)];
          }
          return <Map<String, dynamic>>[];
        }
        return <Map<String, dynamic>>[];
      }
      throw Exception('Failed to load subscription plans');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  // Alias for getSubscriptionPlans to match web app usage
  Future<List<Map<String, dynamic>>> getPlans() async {
    return getSubscriptionPlans();
  }

  // Alias for getCurrentSubscription to match web app usage
  Future<Map<String, dynamic>> getMySubscription() async {
    return getCurrentSubscription();
  }

  Future<Map<String, dynamic>> getCurrentSubscription() async {
    try {
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

  Future<Map<String, dynamic>> subscribeToPlan(String planId, {String? billingCycle, String? paymentMethod}) async {
    try {
      final body = {
        'subscriptionId': planId,
        if (billingCycle != null) 'billingCycle': billingCycle,
        if (paymentMethod != null) 'paymentMethod': paymentMethod,
      };
      final response = await HttpClient.post('/subscriptions/subscribe', body: body);
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
        if (data is Map) {
          final dynamic inner = (data as Map)['data'];
          if (inner is List) {
            return List<Map<String, dynamic>>.from(inner as List<dynamic>);
          }
          if (inner is Map) {
            return [Map<String, dynamic>.from(inner as Map)];
          }
          return <Map<String, dynamic>>[];
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
        if (data is Map) {
          // API may return an object or a list under data
          final map = Map<String, dynamic>.from(data);
          final dynamic inner = map['data'];
          if (inner is List) {
            return List<Map<String, dynamic>>.from(inner);
          }
          if (inner is Map) {
            return [Map<String, dynamic>.from(inner)];
          }
          return <Map<String, dynamic>>[];
        }
        return <Map<String, dynamic>>[];
      }
      throw Exception('Failed to load upcoming billing');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<Map<String, dynamic>> updatePaymentMethod(String paymentMethod) async {
    try {
      final response = await HttpClient.put('/subscriptions/payment-method', body: {
        'paymentMethod': paymentMethod,
      });
      if (response.statusCode == 200) {
        final data = response.data;
        if (data is Map<String, dynamic>) return data;
        if (data is Map) return Map<String, dynamic>.from(data);
        if (data is String) {
          return {'success': true, 'message': 'Operation completed successfully'};
        }
        throw Exception('Unexpected response format from server');
      }
      throw Exception('Failed to update payment method');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<Response> getRazorpayKey() {
    return HttpClient.get('/subscriptions/razorpay/key');
  }

  Future<Response> createRazorpayOrder({
    required String subscriptionId,
    String? billingCycle,
  }) {
    return HttpClient.post('/subscriptions/razorpay/order', body: {
      'subscriptionId': subscriptionId,
      if (billingCycle != null) 'billingCycle': billingCycle,
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

  Future<List<int>> downloadInvoicePdf(String subscriptionId) async {
    try {
      final response = await HttpClient.getRaw<List<int>>(
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