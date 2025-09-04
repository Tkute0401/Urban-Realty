import 'package:flutter/material.dart';
import '../../services/subscription_service.dart';

class SubscriptionManagementScreen extends StatefulWidget {
  const SubscriptionManagementScreen({super.key});

  @override
  State<SubscriptionManagementScreen> createState() => _SubscriptionManagementScreenState();
}

class _SubscriptionManagementScreenState extends State<SubscriptionManagementScreen> {
  bool _loading = true;
  bool _cancelling = false;
  Map<String, dynamic>? _current;
  List<Map<String, dynamic>> _billing = const [];
  List<Map<String, dynamic>> _upcoming = const [];

  @override
  void initState() {
    super.initState();
    _loadAll();
  }

  Future<void> _loadAll() async {
    setState(() { _loading = true; });
    try {
      final service = SubscriptionService();
      final results = await Future.wait([
        service.getCurrentSubscription(),
        service.getBillingHistory(),
        service.getUpcomingBilling(),
      ]);
      setState(() {
        _current = results[0] as Map<String, dynamic>?;
        _billing = (results[1] as List<Map<String, dynamic>>);
        _upcoming = (results[2] as List<Map<String, dynamic>>);
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load subscription data: $e')),
        );
      }
    } finally {
      if (mounted) setState(() { _loading = false; });
    }
  }

  Future<void> _cancel() async {
    setState(() { _cancelling = true; });
    try {
      await SubscriptionService().cancelSubscription();
      await _loadAll();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Subscription cancelled')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to cancel: $e')),
        );
      }
    } finally {
      if (mounted) setState(() { _cancelling = false; });
    }
  }

  Future<void> _downloadInvoice(String subscriptionId) async {
    try {
      final bytes = await SubscriptionService().downloadInvoicePdf(subscriptionId);
      // For simplicity, just confirm download; integrate file saver/share later
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Invoice downloaded (${bytes.length} bytes)')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to download invoice: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Subscription')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadAll,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  _buildCurrentCard(),
                  const SizedBox(height: 12),
                  _buildUpcomingCard(),
                  const SizedBox(height: 12),
                  _buildBillingCard(),
                ],
              ),
            ),
    );
  }

  Widget _buildCurrentCard() {
    final current = _current;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Current Plan', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            if (current == null || current.isEmpty)
              const Text('No active subscription')
            else ...[
              Text('Plan: ${current['planName'] ?? current['name'] ?? 'N/A'}'),
              Text('Status: ${current['status'] ?? 'N/A'}'),
              if (current['billingCycle'] != null) Text('Billing: ${current['billingCycle']}'),
              const SizedBox(height: 12),
              Row(
                children: [
                  ElevatedButton(
                    onPressed: _cancelling ? null : _cancel,
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white),
                    child: _cancelling ? const SizedBox(height: 16, width: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : const Text('Cancel Subscription'),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildUpcomingCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Upcoming Billing', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            if (_upcoming.isEmpty) const Text('No upcoming bills')
            else ..._upcoming.map((u) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(u['description']?.toString() ?? 'Upcoming payment'),
                  Text(u['amount']?.toString() ?? ''),
                ],
              ),
            )),
          ],
        ),
      ),
    );
  }

  Widget _buildBillingCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Billing History', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            if (_billing.isEmpty) const Text('No billing history')
            else ..._billing.map((b) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(child: Text(b['description']?.toString() ?? 'Invoice')),
                  Row(children: [
                    Text(b['amount']?.toString() ?? ''),
                    const SizedBox(width: 8),
                    IconButton(
                      icon: const Icon(Icons.download),
                      tooltip: 'Download invoice',
                      onPressed: () {
                        final id = (b['subscriptionId'] ?? b['id'] ?? '').toString();
                        if (id.isNotEmpty) _downloadInvoice(id);
                      },
                    ),
                  ]),
                ],
              ),
            )),
          ],
        ),
      ),
    );
  }
}

