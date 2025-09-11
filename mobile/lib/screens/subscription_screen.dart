import "package:flutter/material.dart";
import 'package:razorpay_flutter/razorpay_flutter.dart';
import "../models/subscription.dart";
import "../services/subscription_service.dart";
import "../services/analytics_service.dart";

class SubscriptionScreen extends StatefulWidget {
  const SubscriptionScreen({super.key});

  @override
  State<SubscriptionScreen> createState() => _SubscriptionScreenState();
}

class _SubscriptionScreenState extends State<SubscriptionScreen> {
  List<Subscription> _plans = [];
  bool _isLoading = true;
  bool _subscribing = false;
  late final Razorpay _razorpay;

  @override
  void initState() {
    super.initState();
    _razorpay = Razorpay();
    _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
    _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
    _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
    _loadPlans();
    AnalyticsService().track('mobile_subscription_viewed', {
      'screen': 'SubscriptionScreen'
    });
  }

  @override
  void dispose() {
    _razorpay.clear();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Subscription Plans"),
        backgroundColor: Colors.blue,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _plans.length,
              itemBuilder: (context, index) {
                final plan = _plans[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 16),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                plan.name,
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 6,
                              ),
                              decoration: BoxDecoration(
                                color: _getPlanColor(plan.type),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                plan.type.toUpperCase(),
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          "\$${plan.price.toStringAsFixed(0)}/${plan.billingCycle}",
                          style: const TextStyle(
                            fontSize: 24,
                            color: Colors.green,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          "Listing Limit: ${plan.listingLimit} properties",
                          style: const TextStyle(fontSize: 16),
                        ),
                        const SizedBox(height: 16),
                        if (plan.features.isNotEmpty)
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                "Features:",
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 8),
                              ...plan.features.map((feature) => Padding(
                                padding: const EdgeInsets.only(bottom: 4),
                                child: Row(
                                  children: [
                                    const Icon(
                                      Icons.check,
                                      color: Colors.green,
                                      size: 16,
                                    ),
                                    const SizedBox(width: 8),
                                    Expanded(child: Text(feature)),
                                  ],
                                ),
                              ),
                            ),
                            ],
                          ),
                        const SizedBox(height: 16),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: () => _subscribeToPlan(plan),
                            child: const Text(
                              "Subscribe Now",
                              style: TextStyle(fontSize: 16),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }

  Color _getPlanColor(String type) {
    switch (type.toLowerCase()) {
      case "free":
        return Colors.grey;
      case "basic":
        return Colors.blue;
      case "premium":
        return Colors.purple;
      case "enterprise":
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }

  Future<void> _loadPlans() async {
    try {
      setState(() { _isLoading = true; });
      final List<Map<String, dynamic>> plansJson = await SubscriptionService().getSubscriptionPlans();
      final List<Subscription> plans = plansJson.map((json) => Subscription.fromJson(json)).toList();
      setState(() {
        _plans = plans;
        _isLoading = false;
      });
    } catch (e) {
      setState(() { _isLoading = false; });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load plans: $e')),
        );
      }
    }
  }

  void _subscribeToPlan(Subscription plan) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text("Subscribe to ${plan.name}"),
        content: Text(
          "This will redirect you to the payment gateway to complete your subscription to ${plan.name} for \$${plan.price.toStringAsFixed(0)}/${plan.billingCycle}.",
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Cancel"),
          ),
          ElevatedButton(
            onPressed: _subscribing ? null : () async {
              Navigator.pop(context);
              await _processSubscription(plan);
            },
            child: const Text("Proceed"),
          ),
        ],
      ),
    );
  }

  Future<void> _processSubscription(Subscription plan) async {
    try {
      setState(() { _subscribing = true; });
      // If the plan is free or price is zero, call direct subscribe API
      if (plan.price <= 0) {
        final result = await SubscriptionService().subscribeToPlan(plan.id, billingCycle: plan.billingCycle);
        AnalyticsService().track('mobile_subscription_subscribed', {
          'planId': plan.id,
          'planName': plan.name,
          'type': 'free'
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(result['message']?.toString() ?? 'Subscription activated')),
          );
        }
        return;
      }

      // Paid plans -> start Razorpay flow
      final service = SubscriptionService();
      final keyRes = await service.getRazorpayKey();
      final orderRes = await service.createRazorpayOrder(
        subscriptionId: plan.id,
        billingCycle: plan.billingCycle,
      );

      final key = (keyRes.data is Map && keyRes.data['key'] != null)
          ? keyRes.data['key'].toString()
          : '';

      // Server responds with { success, order, subscription }
      // Extract order.id and order.amount (already in paise)
      String orderId = '';
      int amountPaise = (plan.price * 100).toInt();
      if (orderRes.data is Map) {
        final map = Map<String, dynamic>.from(orderRes.data as Map);
        final order = map['order'] is Map ? Map<String, dynamic>.from(map['order']) : null;
        if (order != null) {
          orderId = order['id']?.toString() ?? '';
          final dynamic srvAmount = order['amount'];
          if (srvAmount is int) {
            amountPaise = srvAmount;
          } else if (srvAmount is String) {
            amountPaise = int.tryParse(srvAmount) ?? amountPaise;
          }
        }
      }

      if (key.isEmpty || orderId.isEmpty) {
        throw Exception('Failed to initiate payment');
      }

      final options = {
        'key': key,
        'amount': amountPaise, // in paise, from server
        'currency': 'INR',
        'name': 'Urban Realty',
        'description': 'Subscription: ${plan.name} (${plan.billingCycle})',
        'order_id': orderId,
      };

      _razorpay.open(options);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to start subscription: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() { _subscribing = false; });
      }
    }
  }

  Future<void> _handlePaymentSuccess(PaymentSuccessResponse response) async {
    try {
      final verifyRes = await SubscriptionService().verifyRazorpayPayment(
        razorpayPaymentId: response.paymentId ?? '',
        razorpayOrderId: response.orderId ?? '',
        razorpaySignature: response.signature ?? '',
      );
      AnalyticsService().track('mobile_payment_success', {
        'orderId': response.orderId,
        'paymentId': response.paymentId,
      });
    
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(verifyRes.data is Map && verifyRes.data['message'] != null ? verifyRes.data['message'].toString() : 'Payment verified and subscription activated')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Payment verification failed: $e')),
        );
      }
    }
  }

  void _handlePaymentError(PaymentFailureResponse response) {
    AnalyticsService().track('mobile_payment_failed', {
      'code': response.code,
      'message': response.message,
    });
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Payment failed: ${response.message ?? response.code}')),
      );
    }
  }

  void _handleExternalWallet(ExternalWalletResponse response) {
    AnalyticsService().track('mobile_payment_external_wallet', {
      'walletName': response.walletName,
    });
  }
}
