import "package:flutter/material.dart";
import "package:provider/provider.dart";
import "../../providers/properties_provider.dart";
import "../../providers/auth_provider.dart";
import "../../widgets/admin_stats_card.dart";
import "../../widgets/admin_chart_widget.dart";
import "../../widgets/admin_recent_properties.dart";
import "../../widgets/admin_recent_users.dart";
import "../../utils/format_utils.dart";

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;
  bool isLoading = true;
  Map<String, dynamic> stats = {};
  List<dynamic> recentProperties = [];
  List<dynamic> recentUsers = [];

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

      await _loadStats();
      await _loadRecentProperties();
      await _loadRecentUsers();

      setState(() {
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error loading dashboard: $e")),
        );
      }
    }
  }

  Future<void> _loadStats() async {
    setState(() {
      stats = {
        "totalProperties": 156,
        "activeProperties": 142,
        "pendingProperties": 8,
        "soldProperties": 6,
        "totalUsers": 89,
        "totalAgents": 23,
        "totalRevenue": 45000000,
        "monthlyGrowth": 12.5,
      };
    });
  }

  Future<void> _loadRecentProperties() async {
    setState(() {
      recentProperties = [
        {
          "id": "1",
          "title": "Luxury Villa in Pune",
          "price": 25000000,
          "status": "For Sale",
          "views": 45,
          "createdAt": DateTime.now().subtract(const Duration(days: 2)),
        },
        {
          "id": "2",
          "title": "Modern Apartment in Mumbai",
          "price": 15000000,
          "status": "For Sale",
          "views": 32,
          "createdAt": DateTime.now().subtract(const Duration(days: 3)),
        },
      ];
    });
  }

  Future<void> _loadRecentUsers() async {
    setState(() {
      recentUsers = [
        {
          "id": "1",
          "name": "John Doe",
          "email": "john@example.com",
          "role": "agent",
          "joinedAt": DateTime.now().subtract(const Duration(days: 5)),
        },
        {
          "id": "2",
          "name": "Jane Smith",
          "email": "jane@example.com",
          "role": "user",
          "joinedAt": DateTime.now().subtract(const Duration(days: 7)),
        },
      ];
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      backgroundColor: theme.colorScheme.surface,
      appBar: AppBar(
        title: const Text("Admin Dashboard"),
        backgroundColor: theme.colorScheme.surface,
        foregroundColor: theme.colorScheme.onSurface,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadDashboardData,
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {},
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: "Overview"),
            Tab(text: "Properties"),
            Tab(text: "Users"),
            Tab(text: "Analytics"),
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
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Welcome back, Admin!",
                    style: theme.textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    "Here is what is happening with your real estate platform today.",
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 1.5,
            children: [
              AdminStatsCard(
                title: "Total Properties",
                value: "${stats["totalProperties"] ?? 0}",
                icon: Icons.home,
                color: theme.colorScheme.primary,
                onTap: () {},
              ),
              AdminStatsCard(
                title: "Active Properties",
                value: "${stats["activeProperties"] ?? 0}",
                icon: Icons.check_circle,
                color: Colors.green,
                onTap: () {},
              ),
              AdminStatsCard(
                title: "Total Users",
                value: "${stats["totalUsers"] ?? 0}",
                icon: Icons.people,
                color: theme.colorScheme.secondary,
                onTap: () {},
              ),
              AdminStatsCard(
                title: "Total Agents",
                value: "${stats["totalAgents"] ?? 0}",
                icon: Icons.business,
                color: Colors.orange,
                onTap: () {},
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPropertiesTab(ThemeData theme) {
    return const Center(child: Text("Properties Tab"));
  }

  Widget _buildUsersTab(ThemeData theme) {
    return const Center(child: Text("Users Tab"));
  }

  Widget _buildAnalyticsTab(ThemeData theme) {
    return const Center(child: Text("Analytics Tab"));
  }
}
