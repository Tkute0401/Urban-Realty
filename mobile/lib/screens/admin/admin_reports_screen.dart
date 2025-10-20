import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/design_tokens.dart';

class AdminReportsScreen extends ConsumerStatefulWidget {
  const AdminReportsScreen({super.key});

  @override
  ConsumerState<AdminReportsScreen> createState() => _AdminReportsScreenState();
}

class _AdminReportsScreenState extends ConsumerState<AdminReportsScreen> {
  String _selectedTimeRange = '30 days';
  String _selectedReportType = 'overview';

  final List<String> _timeRanges = ['7 days', '30 days', '90 days', '1 year'];
  final List<String> _reportTypes = ['overview', 'properties', 'users', 'revenue'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reports & Analytics'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.download),
            onPressed: _exportReport,
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _refreshData,
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Time Range and Report Type Selectors
            Container(
              padding: const EdgeInsets.all(DesignTokens.spaceLg),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          value: _selectedTimeRange,
                          decoration: const InputDecoration(
                            labelText: 'Time Range',
                            border: OutlineInputBorder(),
                          ),
                          items: _timeRanges.map((String range) {
                            return DropdownMenuItem<String>(
                              value: range,
                              child: Text(range),
                            );
                          }).toList(),
                          onChanged: (String? newValue) {
                            setState(() {
                              _selectedTimeRange = newValue!;
                            });
                          },
                        ),
                      ),
                      const SizedBox(width: DesignTokens.spaceMd),
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          value: _selectedReportType,
                          decoration: const InputDecoration(
                            labelText: 'Report Type',
                            border: OutlineInputBorder(),
                          ),
                          items: _reportTypes.map((String type) {
                            return DropdownMenuItem<String>(
                              value: type,
                              child: Text(type.capitalize()),
                            );
                          }).toList(),
                          onChanged: (String? newValue) {
                            setState(() {
                              _selectedReportType = newValue!;
                            });
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Key Metrics Cards
            Padding(
              padding: const EdgeInsets.all(DesignTokens.spaceLg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Key Metrics',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: DesignTokens.spaceLg),
                  Row(
                    children: [
                      Expanded(
                        child: _buildMetricCard(
                          context,
                          'Total Properties',
                          '1,247',
                          '+12%',
                          Icons.home,
                          Colors.blue,
                        ),
                      ),
                      const SizedBox(width: DesignTokens.spaceMd),
                      Expanded(
                        child: _buildMetricCard(
                          context,
                          'Active Users',
                          '3,456',
                          '+8%',
                          Icons.people,
                          Colors.green,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: DesignTokens.spaceMd),
                  Row(
                    children: [
                      Expanded(
                        child: _buildMetricCard(
                          context,
                          'Revenue',
                          '\$125,430',
                          '+15%',
                          Icons.attach_money,
                          Colors.orange,
                        ),
                      ),
                      const SizedBox(width: DesignTokens.spaceMd),
                      Expanded(
                        child: _buildMetricCard(
                          context,
                          'Conversions',
                          '23.4%',
                          '+3%',
                          Icons.trending_up,
                          Colors.purple,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Charts Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: DesignTokens.spaceLg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Analytics',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: DesignTokens.spaceLg),
                  
                  // Revenue Chart
                  _buildChartCard(
                    context,
                    'Revenue Trend',
                    'Monthly revenue over time',
                    _buildRevenueChart(),
                  ),
                  
                  const SizedBox(height: DesignTokens.spaceLg),
                  
                  // User Growth Chart
                  _buildChartCard(
                    context,
                    'User Growth',
                    'New user registrations',
                    _buildUserGrowthChart(),
                  ),
                  
                  const SizedBox(height: DesignTokens.spaceLg),
                  
                  // Property Views Chart
                  _buildChartCard(
                    context,
                    'Property Views',
                    'Most viewed properties',
                    _buildPropertyViewsChart(),
                  ),
                ],
              ),
            ),

            // Detailed Reports Section
            Padding(
              padding: const EdgeInsets.all(DesignTokens.spaceLg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Detailed Reports',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: DesignTokens.spaceLg),
                  
                  _buildReportCard(
                    context,
                    'Property Performance Report',
                    'Analysis of property listing performance',
                    Icons.analytics,
                    () => _viewPropertyReport(),
                  ),
                  
                  const SizedBox(height: DesignTokens.spaceMd),
                  
                  _buildReportCard(
                    context,
                    'User Engagement Report',
                    'User behavior and engagement metrics',
                    Icons.people_alt,
                    () => _viewUserReport(),
                  ),
                  
                  const SizedBox(height: DesignTokens.spaceMd),
                  
                  _buildReportCard(
                    context,
                    'Financial Report',
                    'Revenue, expenses, and profit analysis',
                    Icons.account_balance,
                    () => _viewFinancialReport(),
                  ),
                  
                  const SizedBox(height: DesignTokens.spaceMd),
                  
                  _buildReportCard(
                    context,
                    'Marketing Report',
                    'Marketing campaigns and ROI analysis',
                    Icons.campaign,
                    () => _viewMarketingReport(),
                  ),
                ],
              ),
            ),

            const SizedBox(height: DesignTokens.spaceLg),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricCard(
    BuildContext context,
    String title,
    String value,
    String change,
    IconData icon,
    Color color,
  ) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
      ),
      child: Padding(
        padding: const EdgeInsets.all(DesignTokens.spaceMd),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Icon(
                  icon,
                  color: color,
                  size: DesignTokens.iconSizeLg,
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: DesignTokens.spaceSm,
                    vertical: DesignTokens.spaceXs,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.green.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(DesignTokens.radiusSm),
                  ),
                  child: Text(
                    change,
                    style: TextStyle(
                      color: Colors.green,
                      fontSize: DesignTokens.fontSizeSm,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: DesignTokens.spaceSm),
            Text(
              value,
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            Text(
              title,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChartCard(
    BuildContext context,
    String title,
    String subtitle,
    Widget chart,
  ) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
      ),
      child: Padding(
        padding: const EdgeInsets.all(DesignTokens.spaceLg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              subtitle,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
              ),
            ),
            const SizedBox(height: DesignTokens.spaceLg),
            chart,
          ],
        ),
      ),
    );
  }

  Widget _buildRevenueChart() {
    return Container(
      height: 200,
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceVariant.withOpacity(0.3),
        borderRadius: BorderRadius.circular(DesignTokens.radiusSm),
      ),
      child: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.bar_chart, size: 48, color: Colors.grey),
            SizedBox(height: DesignTokens.spaceSm),
            Text('Revenue Chart'),
            Text('(Chart implementation needed)'),
          ],
        ),
      ),
    );
  }

  Widget _buildUserGrowthChart() {
    return Container(
      height: 200,
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceVariant.withOpacity(0.3),
        borderRadius: BorderRadius.circular(DesignTokens.radiusSm),
      ),
      child: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.trending_up, size: 48, color: Colors.grey),
            SizedBox(height: DesignTokens.spaceSm),
            Text('User Growth Chart'),
            Text('(Chart implementation needed)'),
          ],
        ),
      ),
    );
  }

  Widget _buildPropertyViewsChart() {
    return Container(
      height: 200,
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceVariant.withOpacity(0.3),
        borderRadius: BorderRadius.circular(DesignTokens.radiusSm),
      ),
      child: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.visibility, size: 48, color: Colors.grey),
            SizedBox(height: DesignTokens.spaceSm),
            Text('Property Views Chart'),
            Text('(Chart implementation needed)'),
          ],
        ),
      ),
    );
  }

  Widget _buildReportCard(
    BuildContext context,
    String title,
    String description,
    IconData icon,
    VoidCallback onTap,
  ) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
      ),
      child: ListTile(
        leading: Icon(
          icon,
          color: Theme.of(context).colorScheme.primary,
          size: DesignTokens.iconSizeLg,
        ),
        title: Text(
          title,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Text(description),
        trailing: const Icon(Icons.arrow_forward_ios),
        onTap: onTap,
      ),
    );
  }

  void _exportReport() {
    // TODO: Implement report export
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Report export functionality not implemented yet')),
    );
  }

  void _refreshData() {
    // TODO: Implement data refresh
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Data refreshed')),
    );
  }

  void _viewPropertyReport() {
    // TODO: Implement property report view
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Property report functionality not implemented yet')),
    );
  }

  void _viewUserReport() {
    // TODO: Implement user report view
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('User report functionality not implemented yet')),
    );
  }

  void _viewFinancialReport() {
    // TODO: Implement financial report view
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Financial report functionality not implemented yet')),
    );
  }

  void _viewMarketingReport() {
    // TODO: Implement marketing report view
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Marketing report functionality not implemented yet')),
    );
  }
}

extension StringExtension on String {
  String capitalize() {
    if (isEmpty) return this;
    return this[0].toUpperCase() + substring(1);
  }
}
