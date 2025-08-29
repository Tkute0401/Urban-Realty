import 'package:flutter/material.dart';
import '../../services/agent_service.dart';

class AgentAnalyticsScreen extends StatefulWidget {
  const AgentAnalyticsScreen({super.key});

  @override
  State<AgentAnalyticsScreen> createState() => _AgentAnalyticsScreenState();
}

class _AgentAnalyticsScreenState extends State<AgentAnalyticsScreen> {
  final AgentService _agentService = AgentService();
  Map<String, dynamic>? _analyticsData;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadAnalytics();
  }

  Future<void> _loadAnalytics() async {
    try {
      setState(() {
        _isLoading = true;
      });
      
      final data = await _agentService.getAgentAnalytics();
      setState(() {
        _analyticsData = data;
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
        title: const Text('Analytics'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadAnalytics,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadAnalytics,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildOverviewCard(),
                    const SizedBox(height: 16),
                    _buildPerformanceMetrics(),
                    const SizedBox(height: 16),
                    _buildLeadConversionChart(),
                    const SizedBox(height: 16),
                    _buildRecentActivity(),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildOverviewCard() {
    if (_analyticsData == null) return const SizedBox.shrink();

    final overview = _analyticsData!['overview'] ?? {};
    
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Performance Overview',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _buildMetricItem(
                    'Total Leads',
                    overview['totalLeads']?.toString() ?? '0',
                    Icons.people,
                    Colors.blue,
                  ),
                ),
                Expanded(
                  child: _buildMetricItem(
                    'Converted',
                    overview['convertedLeads']?.toString() ?? '0',
                    Icons.check_circle,
                    Colors.green,
                  ),
                ),
                Expanded(
                  child: _buildMetricItem(
                    'Conversion Rate',
                    '${overview['conversionRate']?.toString() ?? '0'}%',
                    Icons.trending_up,
                    Colors.orange,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricItem(String label, String value, IconData icon, Color color) {
    return Column(
      children: [
        Icon(icon, size: 32, color: color),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(color: Colors.grey, fontSize: 12),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildPerformanceMetrics() {
    if (_analyticsData == null) return const SizedBox.shrink();

    final metrics = _analyticsData!['metrics'] ?? {};
    
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Monthly Performance',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            _buildMetricRow('Properties Listed', metrics['propertiesListed']?.toString() ?? '0'),
            _buildMetricRow('Leads Generated', metrics['leadsGenerated']?.toString() ?? '0'),
            _buildMetricRow('Inquiries Received', metrics['inquiriesReceived']?.toString() ?? '0'),
            _buildMetricRow('Revenue Generated', '₹${metrics['revenueGenerated']?.toString() ?? '0'}'),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget _buildLeadConversionChart() {
    if (_analyticsData == null) return const SizedBox.shrink();

    final conversions = _analyticsData!['leadConversions'] ?? [];
    
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Lead Conversion Pipeline',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            if (conversions.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text('No conversion data available'),
                ),
              )
            else
              Column(
                children: conversions.map<Widget>((conversion) {
                  return _buildConversionStage(
                    conversion['stage'] ?? 'Unknown',
                    conversion['count']?.toString() ?? '0',
                    conversion['percentage']?.toString() ?? '0',
                  );
                }).toList(),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildConversionStage(String stage, String count, String percentage) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Expanded(
            flex: 2,
            child: Text(stage),
          ),
          Expanded(
            flex: 1,
            child: Text(
              count,
              textAlign: TextAlign.center,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            flex: 1,
            child: Text(
              '$percentage%',
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.grey),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentActivity() {
    if (_analyticsData == null) return const SizedBox.shrink();

    final activities = _analyticsData!['recentActivities'] ?? [];
    
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Recent Activity',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            if (activities.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text('No recent activity'),
                ),
              )
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: activities.length > 5 ? 5 : activities.length,
                itemBuilder: (context, index) {
                  final activity = activities[index];
                  return ListTile(
                    leading: CircleAvatar(
                      backgroundColor: Theme.of(context).primaryColor,
                      child: Icon(Icons.notifications, color: Colors.white, size: 16),
                    ),
                    title: Text(activity['message'] ?? ''),
                    subtitle: Text(activity['timestamp'] ?? ''),
                    dense: true,
                  );
                },
              ),
          ],
        ),
      ),
    );
  }
}