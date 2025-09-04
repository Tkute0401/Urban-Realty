import 'package:flutter/material.dart';
import '../services/subscription_service.dart';

class BillingDashboardScreen extends StatefulWidget {
  const BillingDashboardScreen({super.key});

  @override
  State<BillingDashboardScreen> createState() => _BillingDashboardScreenState();
}

class _BillingDashboardScreenState extends State<BillingDashboardScreen> {
  final SubscriptionService _subscriptionService = SubscriptionService();
  Map<String, dynamic>? _currentSubscription;
  List<Map<String, dynamic>> _billingHistory = [];
  Map<String, dynamic>? _upcomingBilling;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadBillingData();
  }

  Future<void> _loadBillingData() async {
    try {
      setState(() {
        _isLoading = true;
      });

      // Load current subscription, billing history, and upcoming billing
      final results = await Future.wait([
        _subscriptionService.getMySubscription(),
        _subscriptionService.getBillingHistory(),
        _subscriptionService.getUpcomingBilling(),
      ]);

      setState(() {
        _currentSubscription = results[0] as Map<String, dynamic>?;
        _billingHistory = List<Map<String, dynamic>>.from(results[1] as List<dynamic>);
        _upcomingBilling = results[2] as Map<String, dynamic>?;
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
        title: const Text('Billing Dashboard'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadBillingData,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadBillingData,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildCurrentSubscriptionCard(),
                    const SizedBox(height: 24),
                    _buildUpcomingBillingCard(),
                    const SizedBox(height: 24),
                    _buildBillingHistoryCard(),
                    const SizedBox(height: 24),
                    _buildQuickActionsCard(),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildCurrentSubscriptionCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Current Subscription',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            if (_currentSubscription != null) ...[
              _buildSubscriptionInfo(_currentSubscription!),
            ] else ...[
              const Center(
                child: Column(
                  children: [
                    Icon(Icons.cancel_outlined, size: 48, color: Colors.grey),
                    SizedBox(height: 8),
                    Text('No active subscription'),
                    SizedBox(height: 16),
                  ],
                ),
              ),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.pushNamed(context, '/subscription'),
                  child: const Text('View Plans'),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildSubscriptionInfo(Map<String, dynamic> subscription) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    subscription['plan']?['name'] ?? 'Unknown Plan',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '₹${subscription['plan']?['price']?.toStringAsFixed(0) ?? '0'}/month',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                ],
              ),
            ),
            _buildStatusChip(subscription['status'] ?? 'active'),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: _buildInfoItem(
                'Started',
                _formatDate(subscription['startDate']),
                Icons.calendar_today,
              ),
            ),
            Expanded(
              child: _buildInfoItem(
                'Next Billing',
                _formatDate(subscription['nextBillingDate']),
                Icons.payment,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildUpcomingBillingCard() {
    if (_upcomingBilling == null) return const SizedBox.shrink();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Upcoming Billing',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _buildInfoItem(
                    'Amount',
                    '₹${_upcomingBilling!['amount']?.toStringAsFixed(0) ?? '0'}',
                    Icons.currency_rupee,
                  ),
                ),
                Expanded(
                  child: _buildInfoItem(
                    'Date',
                    _formatDate(_upcomingBilling!['billingDate']),
                    Icons.calendar_today,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBillingHistoryCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Billing History',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                TextButton(
                  onPressed: () => Navigator.pushNamed(context, '/subscription/manage'),
                  child: const Text('View All'),
                ),
              ],
            ),
            const SizedBox(height: 16),
            if (_billingHistory.isEmpty) ...[
              const Center(
                child: Column(
                  children: [
                    Icon(Icons.receipt_long, size: 48, color: Colors.grey),
                    SizedBox(height: 8),
                    Text('No billing history available'),
                  ],
                ),
              ),
            ] else ...[
              ..._billingHistory.take(3).map((bill) => _buildBillingItem(bill)),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildBillingItem(Map<String, dynamic> bill) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        children: [
          Icon(
            bill['status'] == 'paid' ? Icons.check_circle : Icons.pending,
            color: bill['status'] == 'paid' ? Colors.green : Colors.orange,
            size: 24,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '₹${bill['amount']?.toStringAsFixed(0) ?? '0'}',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  _formatDate(bill['date']),
                  style: const TextStyle(
                    fontSize: 12,
                    color: Colors.grey,
                  ),
                ),
              ],
            ),
          ),
          _buildStatusChip(bill['status'] ?? 'pending'),
        ],
      ),
    );
  }

  Widget _buildQuickActionsCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Quick Actions',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => Navigator.pushNamed(context, '/subscription'),
                    icon: const Icon(Icons.subscriptions),
                    label: const Text('Change Plan'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => Navigator.pushNamed(context, '/subscription/manage'),
                    icon: const Icon(Icons.settings),
                    label: const Text('Manage'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoItem(String label, String value, IconData icon) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, size: 16, color: Colors.grey),
            const SizedBox(width: 4),
            Text(
              label,
              style: const TextStyle(
                fontSize: 12,
                color: Colors.grey,
              ),
            ),
          ],
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildStatusChip(String status) {
    Color color;
    switch (status.toLowerCase()) {
      case 'active':
      case 'paid':
        color = Colors.green;
        break;
      case 'pending':
        color = Colors.orange;
        break;
      case 'cancelled':
        color = Colors.red;
        break;
      default:
        color = Colors.grey;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color),
      ),
      child: Text(
        status.toUpperCase(),
        style: TextStyle(
          color: color,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  String _formatDate(dynamic date) {
    if (date == null) return 'Unknown';
    try {
      final DateTime dateTime = DateTime.parse(date.toString());
      return '${dateTime.day}/${dateTime.month}/${dateTime.year}';
    } catch (e) {
      return 'Unknown';
    }
  }
}