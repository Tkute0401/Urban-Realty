import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../shared/providers/properties_provider.dart';
import '../../shared/providers/auth_provider.dart';
import '../../models/property.dart';
import '../../services/api_service.dart';
import '../../utils/format_utils.dart';

class AgentDashboardScreen extends StatefulWidget {
  const AgentDashboardScreen({super.key});

  @override
  State<AgentDashboardScreen> createState() => _AgentDashboardScreenState();
}

class _AgentDashboardScreenState extends State<AgentDashboardScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;
  bool isLoading = true;
  bool isRefreshing = false;
  
  // Dashboard data
  Map<String, dynamic> stats = {
    'totalProperties': 0,
    'activeProperties': 0,
    'activeLeads': 0,
    'totalViews': 0,
    'monthlyRevenue': 0,
    'conversionRate': 0,
    'avgResponseTime': 0,
    'topPerformingProperty': null,
  };

  List<Property> myProperties = [];
  List<dynamic> recentLeads = [];
  List<dynamic> recentInquiries = [];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    _loadDashboardData();
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
        _loadMyProperties(),
        _loadRecentLeads(),
        _loadRecentInquiries(),
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
      final propertiesProvider = Provider.of<PropertiesProvider>(context, listen: false);
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      
      // Get agent's properties
      await propertiesProvider.fetchProperties();
      final agentProperties = propertiesProvider.properties
          .where((p) => p.agent.id == authProvider.user?.id)
          .toList();

      final totalProperties = agentProperties.length;
      final activeProperties = agentProperties.where((p) => p.status == 'For Sale').length;
      final totalViews = agentProperties.fold<int>(0, (sum, p) => sum + p.views);
      final monthlyRevenue = agentProperties.fold<double>(0, (sum, p) => sum + (p.price * 0.02));
      
      final topPerformingProperty = agentProperties.isNotEmpty
          ? agentProperties.reduce((a, b) => a.views > b.views ? a : b)
          : null;

      setState(() {
        stats = {
          'totalProperties': totalProperties,
          'activeProperties': activeProperties,
          'activeLeads': 18, // Mock data
          'totalViews': totalViews,
          'monthlyRevenue': monthlyRevenue,
          'conversionRate': totalViews > 0 ? (18 / totalViews) * 100 : 0,
          'avgResponseTime': 2.3, // Mock data
          'topPerformingProperty': topPerformingProperty,
        };
      });
    } catch (e) {
      throw Exception('Failed to load stats: $e');
    }
  }

  Future<void> _loadMyProperties() async {
    try {
      final propertiesProvider = Provider.of<PropertiesProvider>(context, listen: false);
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      
      setState(() {
        myProperties = propertiesProvider.properties
            .where((p) => p.agent.id == authProvider.user?.id)
            .take(5)
            .toList();
      });
    } catch (e) {
      throw Exception('Failed to load properties: $e');
    }
  }

  Future<void> _loadRecentLeads() async {
    try {
      // Mock data for recent leads
      setState(() {
        recentLeads = [
          {
            '_id': '1',
            'user': {'name': 'John Doe', 'email': 'john@example.com'},
            'property': {'title': 'Luxury Villa in Pune'},
            'status': 'pending',
            'createdAt': DateTime.now().subtract(const Duration(hours: 2)),
          },
          {
            '_id': '2',
            'user': {'name': 'Jane Smith', 'email': 'jane@example.com'},
            'property': {'title': 'Modern Apartment in Mumbai'},
            'status': 'contacted',
            'createdAt': DateTime.now().subtract(const Duration(hours: 5)),
          },
        ];
      });
    } catch (e) {
      throw Exception('Failed to load recent leads: $e');
    }
  }

  Future<void> _loadRecentInquiries() async {
    try {
      // Mock data for recent inquiries
      setState(() {
        recentInquiries = [
          {
            '_id': '1',
            'user': {'name': 'Mike Johnson', 'email': 'mike@example.com'},
            'property': {'title': 'Luxury Villa in Pune'},
            'message': 'I am interested in the villa. Can you provide more details?',
            'status': 'new',
            'createdAt': DateTime.now().subtract(const Duration(hours: 1)),
          },
          {
            '_id': '2',
            'user': {'name': 'Sarah Wilson', 'email': 'sarah@example.com'},
            'property': {'title': 'Modern Apartment in Mumbai'},
            'message': 'What are the payment terms for the apartment?',
            'status': 'responded',
            'createdAt': DateTime.now().subtract(const Duration(hours: 3)),
          },
        ];
      });
    } catch (e) {
      throw Exception('Failed to load recent inquiries: $e');
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

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final authProvider = Provider.of<AuthProvider>(context);
    
    return Scaffold(
      backgroundColor: theme.colorScheme.surface,
      appBar: AppBar(
        title: Text('Welcome back, ${authProvider.user?.name ?? 'Agent'}! 👋'),
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
            icon: const Icon(Icons.add),
            onPressed: () {
              // TODO: Navigate to add property
            },
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Overview'),
            Tab(text: 'Properties'),
            Tab(text: 'Leads'),
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
                _buildLeadsTab(theme),
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
          // Header
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Here\'s your real estate performance overview',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Stats Grid
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 1.3,
            children: [
              _buildStatCard(
                'Total Properties',
                '${stats['totalProperties']}',
                Icons.home,
                Colors.blue,
                '${stats['activeProperties']} active',
                '+12% this month',
                theme,
              ),
              _buildStatCard(
                'Active Leads',
                '${stats['activeLeads']}',
                Icons.people,
                Colors.purple,
                'Require attention',
                '+8% this week',
                theme,
              ),
              _buildStatCard(
                'Total Views',
                '${stats['totalViews']}',
                Icons.visibility,
                Colors.cyan,
                'Property impressions',
                '+15% this month',
                theme,
              ),
              _buildStatCard(
                'Monthly Revenue',
                '₹${FormatUtils.formatPrice(stats['monthlyRevenue'].toInt())}',
                Icons.attach_money,
                Colors.green,
                'Commission earned',
                '+22% this month',
                theme,
              ),
            ],
          ),
          const SizedBox(height: 24),

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
                    style: theme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildMetricRow(
                    'Conversion Rate',
                    '${stats['conversionRate'].toStringAsFixed(1)}%',
                    theme,
                  ),
                  _buildMetricRow(
                    'Avg Response Time',
                    '${stats['avgResponseTime']}h',
                    theme,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Top Performing Property
          if (stats['topPerformingProperty'] != null)
            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Top Performing Property',
                      style: theme.textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    _buildTopPropertyCard(stats['topPerformingProperty'], theme),
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

  Widget _buildTopPropertyCard(Property property, ThemeData theme) {
    return Row(
      children: [
        CircleAvatar(
          radius: 30,
          backgroundColor: theme.colorScheme.primary,
          child: const Icon(Icons.home, color: Colors.white),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                property.title,
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                '${property.address.city}, ${property.address.state}',
                style: theme.textTheme.bodySmall?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  Icon(
                    Icons.visibility,
                    size: 16,
                    color: theme.colorScheme.primary,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    '${property.views} views',
                    style: theme.textTheme.bodySmall,
                  ),
                ],
              ),
            ],
          ),
        ),
        Chip(
          label: Text('₹${FormatUtils.formatPrice(property.price)}'),
          backgroundColor: theme.colorScheme.primary.withOpacity(0.1),
        ),
      ],
    );
  }

  Widget _buildPropertiesTab(ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'My Properties',
                style: theme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              ElevatedButton.icon(
                onPressed: () {
                  // TODO: Navigate to add property
                },
                icon: const Icon(Icons.add),
                label: const Text('Add Property'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (myProperties.isEmpty)
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
                    'No properties yet',
                    style: theme.textTheme.titleMedium?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Start by adding your first property',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: () {
                      // TODO: Navigate to add property
                    },
                    icon: const Icon(Icons.add),
                    label: const Text('Add Property'),
                  ),
                ],
              ),
            )
          else
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: myProperties.length,
              itemBuilder: (context, index) {
                final property = myProperties[index];
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

  Widget _buildLeadsTab(ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Recent Leads',
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          if (recentLeads.isEmpty)
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
                    'No leads yet',
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
              itemCount: recentLeads.length,
              itemBuilder: (context, index) {
                final lead = recentLeads[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: theme.colorScheme.primary,
                      child: Text(
                        lead['user']['name'][0],
                        style: const TextStyle(color: Colors.white),
                      ),
                    ),
                    title: Text(lead['user']['name']),
                    subtitle: Text(lead['property']['title']),
                    trailing: Chip(
                      label: Text(lead['status']),
                      backgroundColor: _getStatusColor(lead['status']).withOpacity(0.1),
                    ),
                    onTap: () {
                      // TODO: Navigate to lead detail
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
            'Advanced Analytics',
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          
          // Performance Overview
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Performance Overview',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildMetricRow(
                    'Total Properties',
                    '${stats['totalProperties']}',
                    theme,
                  ),
                  _buildMetricRow(
                    'Active Properties',
                    '${stats['activeProperties']}',
                    theme,
                  ),
                  _buildMetricRow(
                    'Total Views',
                    '${stats['totalViews']}',
                    theme,
                  ),
                  _buildMetricRow(
                    'Conversion Rate',
                    '${stats['conversionRate'].toStringAsFixed(1)}%',
                    theme,
                  ),
                  _buildMetricRow(
                    'Monthly Revenue',
                    '₹${FormatUtils.formatPrice(stats['monthlyRevenue'].toInt())}',
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
                    'Monthly Performance',
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

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return Colors.orange;
      case 'contacted':
        return Colors.blue;
      case 'followup':
        return Colors.purple;
      case 'closed':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }
}