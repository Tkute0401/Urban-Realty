import 'package:flutter/material.dart';
import '../../services/admin_service.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  final AdminService _adminService = AdminService();
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
      
      final data = await _adminService.getDashboardStats();
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
        title: const Text('Admin Dashboard'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
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
                    _buildRecentActivity(),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildWelcomeCard() {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.admin_panel_settings, size: 32, color: Theme.of(context).primaryColor),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Welcome, Admin!',
                        style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        'Manage your real estate platform',
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

    final counts = _dashboardData!['counts'] ?? {};
    
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      childAspectRatio: 1.5,
      children: [
        _buildStatCard(
          'Total Users',
          counts['users']?.toString() ?? '0',
          Icons.people,
          Colors.blue,
        ),
        _buildStatCard(
          'Total Properties',
          counts['properties']?.toString() ?? '0',
          Icons.home,
          Colors.green,
        ),
        _buildStatCard(
          'Total Agents',
          counts['agents']?.toString() ?? '0',
          Icons.person,
          Colors.orange,
        ),
        _buildStatCard(
          'Total Revenue',
          '₹${counts['revenue']?.toString() ?? '0'}',
          Icons.attach_money,
          Colors.purple,
        ),
        _buildStatCard(
          'Total Contacts',
          counts['contacts']?.toString() ?? '0',
          Icons.contact_mail,
          Colors.teal,
        ),
        _buildStatCard(
          'Subscriptions',
          counts['subscriptions']?.toString() ?? '0',
          Icons.card_membership,
          Colors.indigo,
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
                _buildActionButton('Manage Users', Icons.people, () => _navigateToUsers()),
                _buildActionButton('Manage Properties', Icons.home, () => _navigateToProperties()),
                _buildActionButton('Manage Agents', Icons.person, () => _navigateToAgents()),
                _buildActionButton('View Analytics', Icons.analytics, () => _navigateToAnalytics()),
                _buildActionButton('Settings', Icons.settings, () => Navigator.pushNamed(context, '/admin/settings')),
                _buildActionButton('Reports', Icons.description, () => Navigator.pushNamed(context, '/admin/reports')),
                _buildActionButton('Media', Icons.perm_media, () => Navigator.pushNamed(context, '/admin/media')),
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

  Widget _buildRecentActivity() {
    final recent = _dashboardData?['recent'] ?? {};
    final recentUsers = recent['users'] ?? [];
    final recentProperties = recent['properties'] ?? [];
    final recentContacts = recent['contacts'] ?? [];
    
    // Combine all recent activities
    List<Map<String, dynamic>> allActivities = [];
    
    // Add recent users
    for (var user in recentUsers) {
      allActivities.add({
        'type': 'user',
        'message': 'New user registered: ${user['name'] ?? user['email'] ?? 'Unknown'}',
        'timestamp': _formatDate(user['createdAt']),
        'icon': Icons.person_add,
        'color': Colors.blue,
      });
    }
    
    // Add recent properties
    for (var property in recentProperties) {
      allActivities.add({
        'type': 'property',
        'message': 'New property added: ${property['title'] ?? 'Untitled Property'}',
        'timestamp': _formatDate(property['createdAt']),
        'icon': Icons.home,
        'color': Colors.green,
      });
    }
    
    // Add recent contacts
    for (var contact in recentContacts) {
      allActivities.add({
        'type': 'contact',
        'message': 'New inquiry for: ${contact['property']?['title'] ?? 'Property'}',
        'timestamp': _formatDate(contact['createdAt']),
        'icon': Icons.contact_mail,
        'color': Colors.orange,
      });
    }
    
    // Sort by timestamp (most recent first)
    allActivities.sort((a, b) => b['timestamp'].compareTo(a['timestamp']));
    
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
            if (allActivities.isEmpty)
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
                itemCount: allActivities.length > 5 ? 5 : allActivities.length,
                itemBuilder: (context, index) {
                  final activity = allActivities[index];
                  return ListTile(
                    leading: CircleAvatar(
                      backgroundColor: activity['color'],
                      child: Icon(activity['icon'], color: Colors.white, size: 16),
                    ),
                    title: Text(activity['message']),
                    subtitle: Text(activity['timestamp']),
                    dense: true,
                  );
                },
              ),
          ],
        ),
      ),
    );
  }

  String _formatDate(dynamic date) {
    if (date == null) return 'Unknown date';
    try {
      final dateTime = DateTime.parse(date.toString());
      final now = DateTime.now();
      final difference = now.difference(dateTime);
      
      if (difference.inDays > 0) {
        return '${difference.inDays} day${difference.inDays == 1 ? '' : 's'} ago';
      } else if (difference.inHours > 0) {
        return '${difference.inHours} hour${difference.inHours == 1 ? '' : 's'} ago';
      } else if (difference.inMinutes > 0) {
        return '${difference.inMinutes} minute${difference.inMinutes == 1 ? '' : 's'} ago';
      } else {
        return 'Just now';
      }
    } catch (e) {
      return 'Unknown date';
    }
  }

  void _navigateToUsers() {
    Navigator.pushNamed(context, '/admin/users');
  }

  void _navigateToProperties() {
    Navigator.pushNamed(context, '/admin/properties');
  }

  void _navigateToAgents() {
    Navigator.pushNamed(context, '/admin/agents');
  }

  void _navigateToAnalytics() {
    Navigator.pushNamed(context, '/admin/analytics');
  }
}