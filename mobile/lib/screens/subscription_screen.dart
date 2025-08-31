import "package:flutter/material.dart";
import "../models/subscription.dart";

class SubscriptionScreen extends StatefulWidget {
  const SubscriptionScreen({super.key});

  @override
  State<SubscriptionScreen> createState() => _SubscriptionScreenState();
}

class _SubscriptionScreenState extends State<SubscriptionScreen> {
  List<Subscription> _plans = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadPlans();
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
                            ).toList(),
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
    // Mock data for now - replace with actual API call
    setState(() {
      _plans = [
        Subscription(
          id: "1",
          name: "Free Plan",
          type: "free",
          price: 0,
          billingCycle: "monthly",
          features: [
            "5 property listings",
            "Basic search",
            "Email support"
          ],
          listingLimit: 5,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
        Subscription(
          id: "2",
          name: "Basic Plan",
          type: "basic",
          price: 29,
          billingCycle: "monthly",
          features: [
            "25 property listings",
            "Advanced search",
            "Priority support",
            "Property analytics"
          ],
          listingLimit: 25,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
        Subscription(
          id: "3",
          name: "Premium Plan",
          type: "premium",
          price: 79,
          billingCycle: "monthly",
          features: [
            "Unlimited listings",
            "Premium support",
            "Advanced analytics",
            "Featured listings",
            "Lead management"
          ],
          listingLimit: -1,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
        Subscription(
          id: "4",
          name: "Enterprise Plan",
          type: "enterprise",
          price: 199,
          billingCycle: "monthly",
          features: [
            "Everything in Premium",
            "Custom branding",
            "API access",
            "Dedicated support",
            "White-label solution"
          ],
          listingLimit: -1,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
      ];
      _isLoading = false;
    });
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
            onPressed: () {
              Navigator.pop(context);
              _processPayment(plan);
            },
            child: const Text("Proceed"),
          ),
        ],
      ),
    );
  }

  void _processPayment(Subscription plan) {
    // This would integrate with Razorpay or other payment gateway
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text("Payment processing for ${plan.name} will be implemented"),
      ),
    );
  }
}
