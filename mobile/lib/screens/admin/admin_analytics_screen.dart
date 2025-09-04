import 'package:flutter/material.dart';
import '../../services/analytics_service.dart';

class AdminAnalyticsScreen extends StatefulWidget {
  const AdminAnalyticsScreen({super.key});

  @override
  State<AdminAnalyticsScreen> createState() => _AdminAnalyticsScreenState();
}

class _AdminAnalyticsScreenState extends State<AdminAnalyticsScreen> {
  final AnalyticsService _analyticsService = AnalyticsService();
  bool _loading = true;
  String _timeframe = '24h';
  Map<String, dynamic>? _dashboard;
  Map<String, dynamic>? _search;
  Map<String, dynamic>? _system;

  @override
  void initState() {
    super.initState();
    _fetchAll();
  }

  Future<void> _fetchAll() async {
    setState(() {
      _loading = true;
    });
    try {
      final results = await Future.wait([
        _analyticsService.getDashboardAnalytics(),
        _analyticsService.getSearchAnalytics(timeframe: _timeframe),
        _analyticsService.getSystemMetrics(),
      ]);
      setState(() {
        _dashboard = results[0];
        _search = results[1];
        _system = results[2];
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load analytics: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }
  }

  Future<void> _exportCsv() async {
    try {
      final path = await _analyticsService.exportAnalyticsCsv();
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Exported to $path')),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Export failed: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Analytics Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _fetchAll,
            tooltip: 'Refresh',
          ),
          IconButton(
            icon: const Icon(Icons.download),
            onPressed: _exportCsv,
            tooltip: 'Export CSV',
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _dashboard == null || _search == null || _system == null
              ? const Center(child: Text('Failed to load analytics'))
              : Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Overview',
                            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                          ),
                          DropdownButton<String>(
                            value: _timeframe,
                            items: const [
                              DropdownMenuItem(value: '1h', child: Text('Last Hour')),
                              DropdownMenuItem(value: '24h', child: Text('Last 24 Hours')),
                              DropdownMenuItem(value: '7d', child: Text('Last 7 Days')),
                              DropdownMenuItem(value: '30d', child: Text('Last 30 Days')),
                            ],
                            onChanged: (val) {
                              if (val == null) return;
                              setState(() {
                                _timeframe = val;
                              });
                              _fetchAll();
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Wrap(
                        spacing: 12,
                        runSpacing: 12,
                        children: [
                          _metricCard('Total Users', _dashboard!['overview']?['totalUsers']?.toString() ?? '0'),
                          _metricCard('Total Properties', _dashboard!['overview']?['totalProperties']?.toString() ?? '0'),
                          _metricCard('Total Searches', _search!['totalSearches']?.toString() ?? '0'),
                          _metricCard('Total Errors', _dashboard!['overview']?['totalErrors']?.toString() ?? '0'),
                        ],
                      ),
                      const SizedBox(height: 24),
                      const Text('System Health', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
                      const SizedBox(height: 8),
                      Text('Memory: ${_system!['memory']?['used']}MB / ${_system!['memory']?['total']}MB'),
                      Text('Uptime: ${_system!['uptime']}s'),
                      Text('Active Users: ${_system!['users']?['active']}'),
                      const SizedBox(height: 24),
                      const Text('Top Queries', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
                      const SizedBox(height: 8),
                      Expanded(
                        child: ListView.builder(
                          itemCount: (_search!['topQueries'] as List<dynamic>? ?? const []).length,
                          itemBuilder: (context, index) {
                            final item = (_search!['topQueries'] as List<dynamic>)[index] as Map<String, dynamic>;
                            return ListTile(
                              dense: true,
                              title: Text(item['query']?.toString() ?? ''),
                              trailing: Text(item['count']?.toString() ?? '0'),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }

  Widget _metricCard(String title, String value) {
    return Container(
      width: 160,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        color: Theme.of(context).cardColor,
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 6, offset: const Offset(0, 2)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontSize: 12, color: Colors.grey)),
          const SizedBox(height: 8),
          Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}