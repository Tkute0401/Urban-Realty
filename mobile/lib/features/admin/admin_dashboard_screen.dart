import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../shared/providers/properties_provider.dart';
import '../../models/property.dart';
// Removed unused imports
import '../../utils/format_utils.dart';
import '../../widgets/quick_action_card.dart';
import '../../widgets/stats_card.dart';
import '../../widgets/recent_activity_card.dart';
// Removed unused imports

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;
  bool isLoading = true;
  bool isRefreshing = false;
  
  // Dashboard data
  Map<String, dynamic> stats = {
    'counts': {
      'users': 0,
      'agents': 0,
      'properties': 0,
      'contacts': 0,
      'subscriptions': 0,
      'revenue': 0,
    },
    'recent': {
      'users': [],
      'properties': [],
      'contacts': [],
    },
    'analytics': {
      'growthRate': 0,
      'conversionRate': 0,
      'avgResponseTime': 0,
      'topPerformingAgents': [],
      'systemHealth': {
        'cpu': 0,
        'memory': 0,
        'storage': 0,
        'network': 0,
      }
    }
  };

  List<Property> recentProperties = [];
  List<dynamic> recentUsers = [];
  List<dynamic> recentContacts = [];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    // Use WidgetsBinding to ensure we're not in build phase
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadDashboardData();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadDashboardData() async {
    try {
      setState(() {
        isLoading = true;
      });

      await Future.wait([
        _loadStats(),
        _loadRecentProperties(),
        _loadRecentUsers(),
        _loadRecentContacts(),
      ]);

      setState(() {
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      if (mounted) {
        _showErrorSnackBar('Error loading dashboard: $e');
      }
    }
  }

  Future<void> _refreshData() async {
    setState(() {
      isRefreshing = true;
    });

    try {
      await _loadDashboardData();
      if (mounted) {
        _showSuccessSnackBar('Dashboard data refreshed successfully!');
      }
    } catch (e) {
      if (mounted) {
        _showErrorSnackBar('Failed to refresh data: $e');
      }
    } finally {
      setState(() {
        isRefreshing = false;
      });
    }
  }

  Future<void> _loadStats() async {
    try {
      // In a real app, this would call the API
      // For now, using mock data that matches the React app structure
      setState(() {
        stats = {
          'counts': {
            'users': 1200,
            'agents': 45,
            'properties': 850,
            'contacts': 320,
            'subscriptions': 28,
            'revenue': 125000,
          },
          'analytics': {
            'growthRate': 15.5,
            'conversionRate': 8.2,
            'avgResponseTime': 2.3,
            'topPerformingAgents': [
              {'name': 'John Doe', 'properties': 25, 'revenue': 150000},
              {'name': 'Jane Smith', 'properties': 22, 'revenue': 135000},
              {'name': 'Mike Johnson', 'properties': 18, 'revenue': 120000},
            ],
            'systemHealth': {
              'cpu': 45,
              'memory': 62,
              'storage': 78,
              'network': 92,
            }
          }
        };
      });
    } catch (e) {
      throw Exception('Failed to load stats: $e');
    }
  }

  Future<void> _loadRecentProperties() async {
    try {
      final propertiesProvider = Provider.of<PropertiesProvider>(context, listen: false);
      await propertiesProvider.fetchProperties();
      if (mounted) {
        setState(() {
          recentProperties = propertiesProvider.properties.take(5).toList();
        });
      }
    } catch (e) {
      throw Exception('Failed to load recent properties: $e');
    }
  }

  Future<void> _loadRecentUsers() async {
    try {
      // Mock data for recent users
      setState(() {
        recentUsers = [
          {
            '_id': '1',
            'name': 'John Doe',
            'email': 'john@example.com',
            'role': 'agent',
            'status': 'active',
            'createdAt': DateTime.now().subtract(const Duration(days: 2)),
          },
          {
            '_id': '2',
            'name': 'Jane Smith',
            'email': 'jane@example.com',
            'role': 'user',
            'status': 'active',
            'createdAt': DateTime.now().subtract(const Duration(days: 5)),
          },
        ];
      });
    } catch (e) {
      throw Exception('Failed to load recent users: $e');
    }
  }

  Future<void> _loadRecentContacts() async {
    try {
      // Mock data for recent contacts
      setState(() {
        recentContacts = [
          {
            '_id': '1',
            'user': {'name': 'Mike Johnson', 'email': 'mike@example.com'},
            'property': {'title': 'Luxury Villa in Pune'},
            'status': 'pending',
            'createdAt': DateTime.now().subtract(const Duration(hours: 2)),
          },
          {
            '_id': '2',
            'user': {'name': 'Sarah Wilson', 'email': 'sarah@example.com'},
            'property': {'title': 'Modern Apartment in Mumbai'},
            'status': 'contacted',
            'createdAt': DateTime.now().subtract(const Duration(hours: 5)),
          },
        ];
      });
    } catch (e) {
      throw Exception('Failed to load recent contacts: $e');
    }
  }

  void _showSuccessSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  String _formatTimeAgo(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);
    
    if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'Just now';
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      backgroundColor: theme.colorScheme.surface,
      appBar: AppBar(
        title: const Text('Admin Dashboard 🚀'),
        backgroundColor: theme.colorScheme.surface,
        foregroundColor: theme.colorScheme.onSurface,
        elevation: 0,
        actions: [
          IconButton(
            icon: isRefreshing 
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.refresh),
            onPressed: isRefreshing ? null : _refreshData,
          ),
          IconButton(
            icon: const Icon(Icons.download),
            onPressed: () {
              // TODO: Export report
            },
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              // TODO: Navigate to settings
            },
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Overview'),
            Tab(text: 'Properties'),
            Tab(text: 'Users'),
            Tab(text: 'Analytics'),
          ],
        ),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tabController,
              children: [
                _buildOverviewTab(theme),
                _buildPropertiesTab(theme),
                _buildUsersTab(theme),
                _buildAnalyticsTab(theme),
              ],
            ),
    );
  }

  Widget _buildOverviewTab(ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Welcome Header
          Card(
            elevation: 2,
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    theme.colorScheme.primary.withOpacity(0.1),
                    theme.colorScheme.secondary.withOpacity(0.05),
                  ],
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(
                          Icons.dashboard,
                          color: theme.colorScheme.primary,
                          size: 32,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Welcome back, Admin!',
                              style: theme.textTheme.headlineSmall?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Complete overview of your real estate platform',
                              style: theme.textTheme.bodyMedium?.copyWith(
                                color: theme.colorScheme.onSurfaceVariant,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Quick Actions
          Text(
            'Quick Actions',
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 16),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 3,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.1,
            children: [
              QuickActionCard(
                title: 'Manage Users',
                icon: Icons.people,
                color: Colors.blue,
                onTap: () => Navigator.pushNamed(context, '/admin/users'),
              ),
              QuickActionCard(
                title: 'View Properties',
                icon: Icons.home,
                color: Colors.green,
                onTap: () => Navigator.pushNamed(context, '/admin/properties'),
              ),
              QuickActionCard(
                title: 'Analytics',
                icon: Icons.analytics,
                color: Colors.purple,
                onTap: () => Navigator.pushNamed(context, '/admin/analytics'),
              ),
              QuickActionCard(
                title: 'Settings',
                icon: Icons.settings,
                color: Colors.orange,
                onTap: () => Navigator.pushNamed(context, '/admin/settings'),
              ),
              QuickActionCard(
                title: 'Reports',
                icon: Icons.assessment,
                color: Colors.teal,
                onTap: () => Navigator.pushNamed(context, '/admin/reports'),
              ),
              QuickActionCard(
                title: 'Media',
                icon: Icons.storage,
                color: Colors.red,
                onTap: () => Navigator.pushNamed(context, '/admin/media'),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Stats Grid
          Text(
            'Statistics',
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 16),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 1.3,
            children: [
              StatsCard(
                title: 'Total Users',
                value: '${stats['counts']['users']}',
                subtitle: 'Registered users',
                icon: Icons.people,
                color: Colors.blue,
                percentage: 15.0,
                isPositive: true,
              ),
              StatsCard(
                title: 'Agents',
                value: '${stats['counts']['agents']}',
                subtitle: 'Active agents',
                icon: Icons.business,
                color: Colors.purple,
                percentage: 8.0,
                isPositive: true,
              ),
              StatsCard(
                title: 'Properties',
                value: '${stats['counts']['properties']}',
                subtitle: 'Listed properties',
                icon: Icons.home,
                color: Colors.cyan,
                percentage: 22.0,
                isPositive: true,
              ),
              StatsCard(
                title: 'Contacts',
                value: '${stats['counts']['contacts']}',
                subtitle: 'Total inquiries',
                icon: Icons.email,
                color: Colors.green,
                percentage: 18.0,
                isPositive: true,
              ),
              StatsCard(
                title: 'Subscriptions',
                value: '${stats['counts']['subscriptions']}',
                subtitle: 'Active plans',
                icon: Icons.trending_up,
                color: Colors.pink,
                percentage: 12.0,
                isPositive: true,
              ),
              StatsCard(
                title: 'Revenue',
                value: '\$${stats['counts']['revenue']}',
                subtitle: 'Monthly revenue',
                icon: Icons.attach_money,
                color: Colors.teal,
                percentage: 25.0,
                isPositive: true,
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Recent Activity
          Row(
            children: [
              Expanded(
                child: RecentActivityCard(
                  title: 'Recent Properties',
                  activities: recentProperties.map((property) => {
                    'type': 'property',
                    'title': property.title,
                    'subtitle': property.address.city,
                    'time': _formatTimeAgo(property.createdAt),
                  }).toList(),
                  onViewAll: () => Navigator.pushNamed(context, '/admin/properties'),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: RecentActivityCard(
                  title: 'Recent Users',
                  activities: recentUsers.map((user) => {
                    'type': 'user',
                    'title': user['name'] ?? 'Unknown User',
                    'subtitle': user['email'] ?? '',
                    'time': _formatTimeAgo(user['createdAt']),
                  }).toList(),
                  onViewAll: () => Navigator.pushNamed(context, '/admin/users'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // System Health
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'System Health',
                    style: theme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  GridView.count(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisCount: 2,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    childAspectRatio: 2.5,
                    children: [
                      _buildSystemHealthCard(
                        'CPU Usage',
                        '${stats['analytics']['systemHealth']['cpu']}%',
                        Icons.speed,
                        Colors.blue,
                        theme,
                      ),
                      _buildSystemHealthCard(
                        'Memory',
                        '${stats['analytics']['systemHealth']['memory']}%',
                        Icons.storage,
                        Colors.purple,
                        theme,
                      ),
                      _buildSystemHealthCard(
                        'Storage',
                        '${stats['analytics']['systemHealth']['storage']}%',
                        Icons.storage,
                        Colors.cyan,
                        theme,
                      ),
                      _buildSystemHealthCard(
                        'Network',
                        '${stats['analytics']['systemHealth']['network']}%',
                        Icons.network_check,
                        Colors.green,
                        theme,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Top Performing Agents
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Top Performing Agents',
                    style: theme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  ...stats['analytics']['topPerformingAgents'].map<Widget>((agent) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: Row(
                        children: [
                          CircleAvatar(
                            backgroundColor: theme.colorScheme.primary,
                            child: Text(
                              agent['name'][0],
                              style: const TextStyle(color: Colors.white),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  agent['name'],
                                  style: theme.textTheme.titleMedium?.copyWith(
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  '${agent['properties']} properties',
                                  style: theme.textTheme.bodySmall?.copyWith(
                                    color: theme.colorScheme.onSurfaceVariant,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Text(
                            '\$${agent['revenue']}',
                            style: theme.textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.bold,
                              color: theme.colorScheme.primary,
                            ),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(
    String title,
    String value,
    IconData icon,
    Color color,
    String subtitle,
    String trend,
    ThemeData theme,
  ) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        value,
                        style: theme.textTheme.headlineMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: color,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        subtitle,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                ),
                CircleAvatar(
                  backgroundColor: color.withOpacity(0.1),
                  child: Icon(icon, color: color),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(
                  Icons.trending_up,
                  size: 16,
                  color: Colors.green,
                ),
                const SizedBox(width: 4),
                Text(
                  trend,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: Colors.green,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSystemHealthCard(
    String title,
    String value,
    IconData icon,
    Color color,
    ThemeData theme,
  ) {
    final percentage = int.parse(value.replaceAll('%', ''));
    
    return Card(
      elevation: 1,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  title,
                  style: theme.textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Icon(icon, color: color, size: 20),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              value,
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            const SizedBox(height: 8),
            LinearProgressIndicator(
              value: percentage / 100,
              backgroundColor: color.withOpacity(0.2),
              valueColor: AlwaysStoppedAnimation<Color>(color),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPropertiesTab(ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Recent Properties',
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          if (recentProperties.isEmpty)
            Center(
              child: Column(
                children: [
                  Icon(
                    Icons.home_outlined,
                    size: 64,
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No properties found',
                    style: theme.textTheme.titleMedium?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            )
          else
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: recentProperties.length,
              itemBuilder: (context, index) {
                final property = recentProperties[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: theme.colorScheme.primary,
                      child: const Icon(Icons.home, color: Colors.white),
                    ),
                    title: Text(property.title),
                    subtitle: Text(
                      '${property.address.city}, ${property.address.state}',
                    ),
                    trailing: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          '₹${FormatUtils.formatPrice(property.price)}',
                          style: theme.textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: theme.colorScheme.primary,
                          ),
                        ),
                        Text(
                          '${property.views} views',
                          style: theme.textTheme.bodySmall,
                        ),
                      ],
                    ),
                    onTap: () {
                      // TODO: Navigate to property detail
                    },
                  ),
                );
              },
            ),
        ],
      ),
    );
  }

  Widget _buildUsersTab(ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Recent Users',
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          if (recentUsers.isEmpty)
            Center(
              child: Column(
                children: [
                  Icon(
                    Icons.people_outline,
                    size: 64,
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No users found',
                    style: theme.textTheme.titleMedium?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            )
          else
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: recentUsers.length,
              itemBuilder: (context, index) {
                final user = recentUsers[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: theme.colorScheme.primary,
                      child: Text(
                        user['name'][0],
                        style: const TextStyle(color: Colors.white),
                      ),
                    ),
                    title: Text(user['name']),
                    subtitle: Text(user['email']),
                    trailing: Chip(
                      label: Text(user['role']),
                      backgroundColor: user['role'] == 'admin' 
                          ? Colors.red.withOpacity(0.1)
                          : user['role'] == 'agent'
                              ? Colors.orange.withOpacity(0.1)
                              : Colors.blue.withOpacity(0.1),
                    ),
                    onTap: () {
                      // TODO: Navigate to user detail
                    },
                  ),
                );
              },
            ),
        ],
      ),
    );
  }

  Widget _buildAnalyticsTab(ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Platform Analytics',
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          
          // Performance Metrics
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Performance Metrics',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildMetricRow(
                    'Growth Rate',
                    '${stats['analytics']['growthRate']}%',
                    theme,
                  ),
                  _buildMetricRow(
                    'Conversion Rate',
                    '${stats['analytics']['conversionRate']}%',
                    theme,
                  ),
                  _buildMetricRow(
                    'Avg Response Time',
                    '${stats['analytics']['avgResponseTime']}h',
                    theme,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Chart placeholder
          Card(
            elevation: 2,
            child: Container(
              height: 300,
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Platform Growth Overview',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Expanded(
                    child: Center(
                      child: Text(
                        'Chart visualization would go here',
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricRow(String label, String value, ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: theme.textTheme.bodyMedium,
          ),
          Text(
            value,
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: theme.colorScheme.primary,
            ),
          ),
        ],
      ),
    );
  }
}