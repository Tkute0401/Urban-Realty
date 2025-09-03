import "package:flutter/material.dart";
import "package:provider/provider.dart";
import "../../providers/properties_provider.dart";
import "../../providers/auth_provider.dart";
import "../../widgets/agent_stats_card.dart";
import "../../widgets/agent_property_card.dart";
import "../../widgets/agent_lead_card.dart";
import "../../utils/format_utils.dart";

class AgentDashboardScreen extends StatefulWidget {
  const AgentDashboardScreen({super.key});

  @override
  State<AgentDashboardScreen> createState() => _AgentDashboardScreenState();
}

class _AgentDashboardScreenState extends State<AgentDashboardScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;
  bool isLoading = true;
  Map<String, dynamic> stats = {};
  List<dynamic> myProperties = [];
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

      await _loadStats();
      await _loadMyProperties();
      await _loadRecentLeads();
      await _loadRecentInquiries();

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
        "totalProperties": 24,
        "activeProperties": 22,
        "pendingProperties": 2,
        "totalLeads": 18,
        "totalInquiries": 45,
        "monthlyViews": 156,
        "monthlyLeads": 8,
        "conversionRate": 15.2,
      };
    });
  }

  Future<void> _loadMyProperties() async {
    setState(() {
      myProperties = [
        {
          "id": "1",
          "title": "Luxury Villa in Pune",
          "price": 25000000,
          "status": "For Sale",
          "views": 45,
          "leads": 3,
          "image": "https://example.com/image1.jpg",
        },
        {
          "id": "2",
          "title": "Modern Apartment in Mumbai",
          "price": 15000000,
          "status": "For Sale",
          "views": 32,
          "leads": 2,
          "image": "https://example.com/image2.jpg",
        },
      ];
    });
  }

  Future<void> _loadRecentLeads() async {
    setState(() {
      recentLeads = [
        {
          "id": "1",
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "+91 9876543210",
          "property": "Luxury Villa in Pune",
          "status": "New",
          "createdAt": DateTime.now().subtract(const Duration(hours: 2)),
        },
        {
          "id": "2",
          "name": "Jane Smith",
          "email": "jane@example.com",
          "phone": "+91 9876543211",
          "property": "Modern Apartment in Mumbai",
          "status": "Contacted",
          "createdAt": DateTime.now().subtract(const Duration(hours: 5)),
        },
      ];
    });
  }

  Future<void> _loadRecentInquiries() async {
    setState(() {
      recentInquiries = [
        {
          "id": "1",
          "name": "Mike Johnson",
          "email": "mike@example.com",
          "message": "I am interested in the villa. Can you provide more details?",
          "property": "Luxury Villa in Pune",
          "status": "New",
          "createdAt": DateTime.now().subtract(const Duration(hours: 1)),
        },
        {
          "id": "2",
          "name": "Sarah Wilson",
          "email": "sarah@example.com",
          "message": "What are the payment terms for the apartment?",
          "property": "Modern Apartment in Mumbai",
          "status": "Responded",
          "createdAt": DateTime.now().subtract(const Duration(hours: 3)),
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
        title: const Text("Agent Dashboard"),
        backgroundColor: theme.colorScheme.surface,
        foregroundColor: theme.colorScheme.onSurface,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadDashboardData,
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
            Tab(text: "Overview"),
            Tab(text: "Properties"),
            Tab(text: "Leads"),
            Tab(text: "Inquiries"),
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
                _buildInquiriesTab(theme),
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
          // Welcome Section
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Welcome back, Agent!",
                    style: theme.textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    "Here is your performance overview for today.",
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
            childAspectRatio: 1.5,
            children: [
              AgentStatsCard(
                title: "My Properties",
                value: "${stats["totalProperties"] ?? 0}",
                icon: Icons.home,
                color: theme.colorScheme.primary,
                onTap: () {},
              ),
              AgentStatsCard(
                title: "Active Leads",
                value: "${stats["totalLeads"] ?? 0}",
                icon: Icons.people,
                color: Colors.green,
                onTap: () {},
              ),
              AgentStatsCard(
                title: "Monthly Views",
                value: "${stats["monthlyViews"] ?? 0}",
                icon: Icons.visibility,
                color: theme.colorScheme.secondary,
                onTap: () {},
              ),
              AgentStatsCard(
                title: "Conversion Rate",
                value: "${stats["conversionRate"] ?? 0}%",
                icon: Icons.trending_up,
                color: Colors.orange,
                onTap: () {},
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Recent Activity
          Text(
            "Recent Activity",
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          if (recentLeads.isNotEmpty) ...[
            AgentLeadCard(lead: recentLeads[0]),
            const SizedBox(height: 12),
          ],
          if (recentInquiries.isNotEmpty) ...[
            AgentLeadCard(lead: recentInquiries[0]),
            const SizedBox(height: 12),
          ],
        ],
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
            "My Properties",
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
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
                    "No properties yet",
                    style: theme.textTheme.titleMedium?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    "Start by adding your first property",
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
                    label: const Text("Add Property"),
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
                return AgentPropertyCard(
                  property: property,
                  onTap: () {
                    // TODO: Navigate to property detail
                  },
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
            "Recent Leads",
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
                    "No leads yet",
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
                return AgentLeadCard(
                  lead: lead,
                  onTap: () {
                    // TODO: Navigate to lead detail
                  },
                );
              },
            ),
        ],
      ),
    );
  }

  Widget _buildInquiriesTab(ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Recent Inquiries",
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          if (recentInquiries.isEmpty)
            Center(
              child: Column(
                children: [
                  Icon(
                    Icons.inbox_outlined,
                    size: 64,
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    "No inquiries yet",
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
              itemCount: recentInquiries.length,
              itemBuilder: (context, index) {
                final inquiry = recentInquiries[index];
                return AgentLeadCard(
                  lead: inquiry,
                  onTap: () {
                    // TODO: Navigate to inquiry detail
                  },
                );
              },
            ),
        ],
      ),
    );
  }
}
