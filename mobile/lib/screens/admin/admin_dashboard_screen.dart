import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';
import '../../config/design_tokens.dart';
import 'admin_reports_screen.dart';
import 'admin_media_screen.dart';
import 'admin_contacts_screen.dart';

class AdminDashboardScreen extends ConsumerWidget {
  const AdminDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateProvider);
    final user = authState.user;

    if (user == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Dashboard'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await ref.read(authStateProvider.notifier).logout();
              if (context.mounted) {
                Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
              }
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome Section
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Theme.of(context).colorScheme.primary,
                    Theme.of(context).colorScheme.primary.withOpacity(0.8),
                  ],
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Welcome back,',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: Colors.white70,
                    ),
                  ),
                  Text(
                    user.name,
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Admin Dashboard',
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Admin Options
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                children: [
                  _buildAdminOption(
                    context,
                    Icons.people,
                    'Manage Users',
                    'View and manage all users',
                    () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('User management functionality not implemented yet')),
                      );
                    },
                  ),
                  _buildAdminOption(
                    context,
                    Icons.home,
                    'Manage Properties',
                    'View and manage all properties',
                    () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Property management functionality not implemented yet')),
                      );
                    },
                  ),
                  _buildAdminOption(
                    context,
                    Icons.analytics,
                    'Reports & Analytics',
                    'View app analytics and reports',
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const AdminReportsScreen()),
                      );
                    },
                  ),
                  _buildAdminOption(
                    context,
                    Icons.photo_library,
                    'Media Management',
                    'Manage property images and documents',
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const AdminMediaScreen()),
                      );
                    },
                  ),
                  _buildAdminOption(
                    context,
                    Icons.contacts,
                    'Contacts Management',
                    'Manage leads, clients, and agents',
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const AdminContactsScreen()),
                      );
                    },
                  ),
                  _buildAdminOption(
                    context,
                    Icons.inbox,
                    'Inquiries',
                    'Manage property inquiries and leads',
                    () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Inquiries management functionality not implemented yet')),
                      );
                    },
                  ),
                  _buildAdminOption(
                    context,
                    Icons.subscriptions,
                    'Subscriptions',
                    'Manage user subscriptions and billing',
                    () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Subscriptions management functionality not implemented yet')),
                      );
                    },
                  ),
                  _buildAdminOption(
                    context,
                    Icons.settings,
                    'System Settings',
                    'Configure system settings',
                    () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('System settings functionality not implemented yet')),
                      );
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildAdminOption(
    BuildContext context,
    IconData icon,
    String title,
    String subtitle,
    VoidCallback onTap,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(icon, color: Theme.of(context).colorScheme.primary),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: onTap,
      ),
    );
  }
}
