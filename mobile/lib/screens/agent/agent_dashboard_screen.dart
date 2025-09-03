import 'package:flutter/material.dart';
import '../../services/agent_service.dart';

class AgentDashboardScreen extends StatefulWidget {
  const AgentDashboardScreen({super.key});

  @override
  State<AgentDashboardScreen> createState() => _AgentDashboardScreenState();
}

class _AgentDashboardScreenState extends State<AgentDashboardScreen> {
  final AgentService _agentService = AgentService();
  Map<String, dynamic>? _dashboardData;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    try {
      setState(() {
        _isLoading = true;
      });
      
      final data = await _agentService.getAgentDashboard();
      setState(() {
        _dashboardData = data;
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
        title: const Text('Agent Dashboard'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () => Navigator.pushNamed(context, '/notifications'),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadDashboardData,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildWelcomeCard(),
                    const SizedBox(height: 16),
                    _buildStatsGrid(),
                    const SizedBox(height: 16),
                    _buildQuickActions(),
                    const SizedBox(height: 16),
                    _buildRecentLeads(),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildWelcomeCard() {
    final agentName = _dashboardData?['agentName'] ?? 'Agent';
    
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 24,
                  backgroundColor: Theme.of(context).primaryColor,
                  child: const Icon(Icons.person, color: Colors.white, size: 28),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Welcome, $agentName!',
                        style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                      const Text(
                        'Manage your properties and leads',
                        style: TextStyle(color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatsGrid() {
    if (_dashboardData == null) return const SizedBox.shrink();

    final stats = _dashboardData!['stats'] ?? {};
    
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      childAspectRatio: 1.5,
      children: [
        _buildStatCard(
          'My Properties',
          stats['totalProperties']?.toString() ?? '0',
          Icons.home,
          Colors.blue,
        ),
        _buildStatCard(
          'Active Leads',
          stats['activeLeads']?.toString() ?? '0',
          Icons.people,
          Colors.green,
        ),
        _buildStatCard(
          'This Month',
          '₹${stats['monthlyEarnings']?.toString() ?? '0'}',
          Icons.attach_money,
          Colors.orange,
        ),
        _buildStatCard(
          'Inquiries',
          stats['totalInquiries']?.toString() ?? '0',
          Icons.message,
          Colors.purple,
        ),
      ],
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 32, color: color),
            const SizedBox(height: 8),
            Text(
              value,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: const TextStyle(color: Colors.grey),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActions() {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Quick Actions',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 2.5,
              children: [
                _buildActionButton('My Properties', Icons.home, () => _navigateToProperties()),
                _buildActionButton('Manage Leads', Icons.people, () => _navigateToLeads()),
                _buildActionButton('View Inquiries', Icons.message, () => _navigateToInquiries()),
                _buildActionButton('Analytics', Icons.analytics, () => _navigateToAnalytics()),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton(String title, IconData icon, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade300),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: Theme.of(context).primaryColor),
            const SizedBox(height: 4),
            Text(
              title,
              style: const TextStyle(fontSize: 12),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentLeads() {
    final leads = _dashboardData?['recentLeads'] ?? [];
    
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Recent Leads',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                TextButton(
                  onPressed: () => _navigateToLeads(),
                  child: const Text('View All'),
                ),
              ],
            ),
            const SizedBox(height: 16),
            if (leads.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text('No recent leads'),
                ),
              )
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: leads.length > 3 ? 3 : leads.length,
                itemBuilder: (context, index) {
                  final lead = leads[index];
                  return ListTile(
                    leading: CircleAvatar(
                      backgroundColor: Theme.of(context).primaryColor,
                      child: const Icon(Icons.person, color: Colors.white, size: 16),
                    ),
                    title: Text(lead['name'] ?? 'Unknown Lead'),
                    subtitle: Text(lead['property'] ?? ''),
                    trailing: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: _getLeadStatusColor(lead['status']).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: _getLeadStatusColor(lead['status'])),
                      ),
                      child: Text(
                        lead['status'] ?? 'new',
                        style: TextStyle(
                          color: _getLeadStatusColor(lead['status']),
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    onTap: () => _showLeadDetails(lead),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }

  Color _getLeadStatusColor(String? status) {
    switch (status?.toLowerCase()) {
      case 'new':
        return Colors.blue;
      case 'contacted':
        return Colors.orange;
      case 'interested':
        return Colors.green;
      case 'converted':
        return Colors.purple;
      default:
        return Colors.grey;
    }
  }

  void _showLeadDetails(Map<String, dynamic> lead) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundColor: Theme.of(context).primaryColor,
                  child: const Icon(Icons.person, color: Colors.white),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        lead['name'] ?? 'Unknown Lead',
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        lead['email'] ?? '',
                        style: const TextStyle(color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildDetailRow('Phone', lead['phone'] ?? 'Not provided'),
            _buildDetailRow('Property', lead['property'] ?? 'Not specified'),
            _buildDetailRow('Status', lead['status'] ?? 'new'),
            _buildDetailRow('Date', lead['date'] ?? 'Unknown'),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      _handleLeadAction('contact', lead);
                    },
                    child: const Text('Contact'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Close'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 80,
            child: Text(
              '$label:',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            child: Text(value),
          ),
        ],
      ),
    );
  }

  void _handleLeadAction(String action, Map<String, dynamic> lead) {
    switch (action) {
      case 'contact':
        // Implement contact lead functionality
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Contact functionality to be implemented')),
        );
        break;
    }
  }

  void _navigateToProperties() {
    Navigator.pushNamed(context, '/agent/properties');
  }

  void _navigateToLeads() {
    Navigator.pushNamed(context, '/agent/leads');
  }

  void _navigateToInquiries() {
    Navigator.pushNamed(context, '/agent/inquiries');
  }

  void _navigateToAnalytics() {
    Navigator.pushNamed(context, '/agent/analytics');
  }
}