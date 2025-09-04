import 'package:flutter/material.dart';
import '../services/subscription_service.dart';

class SubscriptionComparisonScreen extends StatefulWidget {
  const SubscriptionComparisonScreen({super.key});

  @override
  State<SubscriptionComparisonScreen> createState() => _SubscriptionComparisonScreenState();
}

class _SubscriptionComparisonScreenState extends State<SubscriptionComparisonScreen> {
  final SubscriptionService _subscriptionService = SubscriptionService();
  List<Map<String, dynamic>> _plans = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadPlans();
  }

  Future<void> _loadPlans() async {
    try {
      setState(() {
        _isLoading = true;
      });

      final plans = await _subscriptionService.getPlans();
      
      setState(() {
        _plans = plans;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Subscription Comparison'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadPlans,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _plans.isEmpty
              ? const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.subscriptions, size: 64, color: Colors.grey),
                      SizedBox(height: 16),
                      Text('No subscription plans available'),
                    ],
                  ),
                )
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildHeader(),
                      const SizedBox(height: 24),
                      _buildComparisonTable(),
                      const SizedBox(height: 24),
                      _buildFeatureComparison(),
                    ],
                  ),
                ),
    );
  }

  Widget _buildHeader() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Choose Your Perfect Plan',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Compare all our subscription plans and choose the one that best fits your needs.',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => Navigator.pushNamed(context, '/subscription'),
                    child: const Text('View Plans'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pushNamed(context, '/subscription/manage'),
                    child: const Text('My Subscription'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildComparisonTable() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Plan Comparison',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: DataTable(
                columns: [
                  const DataColumn(label: Text('Features')),
                  ..._plans.map((plan) => DataColumn(
                    label: Text(
                      plan['name'] ?? 'Unknown',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  )),
                ],
                rows: [
                  _buildComparisonRow('Price', _plans.map((p) => '₹${(p['price'] ?? 0).toStringAsFixed(0)}/month').toList()),
                  _buildComparisonRow('Duration', _plans.map((p) => '${p['duration'] ?? 1} months').toList()),
                  _buildComparisonRow('Property Listings', _plans.map((p) => (p['maxProperties'] ?? -1) == -1 ? 'Unlimited' : '${p['maxProperties'] ?? 0}').toList()),
                  _buildComparisonRow('Featured Properties', _plans.map((p) => (p['featuredProperties'] ?? 0) == -1 ? 'Unlimited' : '${p['featuredProperties'] ?? 0}').toList()),
                  _buildComparisonRow('Priority Support', _plans.map((p) => (p['prioritySupport'] ?? false) ? 'Yes' : 'No').toList()),
                  _buildComparisonRow('Analytics', _plans.map((p) => (p['analytics'] ?? false) ? 'Yes' : 'No').toList()),
                  _buildComparisonRow('Custom Branding', _plans.map((p) => (p['customBranding'] ?? false) ? 'Yes' : 'No').toList()),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  DataRow _buildComparisonRow(String feature, List<String> values) {
    return DataRow(
      cells: [
        DataCell(Text(feature)),
        ...values.map((value) => DataCell(Text(value))),
      ],
    );
  }

  Widget _buildFeatureComparison() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Feature Details',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildFeatureItem(
              'Property Listings',
              'Number of properties you can list on the platform',
              Icons.home,
            ),
            _buildFeatureItem(
              'Featured Properties',
              'Properties that appear prominently in search results',
              Icons.star,
            ),
            _buildFeatureItem(
              'Priority Support',
              'Faster response times and dedicated support channel',
              Icons.support_agent,
            ),
            _buildFeatureItem(
              'Analytics',
              'Detailed insights and performance metrics for your properties',
              Icons.analytics,
            ),
            _buildFeatureItem(
              'Custom Branding',
              'Personalized branding options for your listings',
              Icons.palette,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeatureItem(String title, String description, IconData icon) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: Theme.of(context).primaryColor, size: 24),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Colors.grey,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}