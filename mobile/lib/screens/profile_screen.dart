import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/auth_provider.dart';
import '../config/design_tokens.dart';
import 'static_pages/index.dart';
import 'profile_edit_screen.dart';
import 'user_edit_screen.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

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
        title: const Text('Profile'),
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
          children: [
            // Profile Header
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
                children: [
                  CircleAvatar(
                    radius: 50,
                    backgroundImage: user.profileImage != null && user.profileImage!.isNotEmpty
                        ? NetworkImage(user.profileImage!)
                        : null,
                    child: user.profileImage == null || user.profileImage!.isEmpty
                        ? const Icon(Icons.person, size: 50)
                        : null,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    user.name,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    user.email,
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: Colors.white70,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(
                      user.role.toUpperCase(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Profile Options
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                children: [
                  _buildProfileOption(
                    context,
                    Icons.person,
                    'Edit Profile',
                    'Update your personal information',
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const ProfileEditScreen()),
                      );
                    },
                  ),
                  _buildProfileOption(
                    context,
                    Icons.settings,
                    'Account Settings',
                    'Manage your account preferences',
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const UserEditScreen()),
                      );
                    },
                  ),
                  _buildProfileOption(
                    context,
                    Icons.favorite,
                    'My Favorites',
                    'View your favorite properties',
                    () {
                      // TODO: Implement favorites
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Favorites functionality not implemented yet')),
                      );
                    },
                  ),
                  _buildProfileOption(
                    context,
                    Icons.history,
                    'Viewing History',
                    'Properties you\'ve viewed recently',
                    () {
                      // TODO: Implement viewing history
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Viewing history functionality not implemented yet')),
                      );
                    },
                  ),
                  _buildProfileOption(
                    context,
                    Icons.settings,
                    'Settings',
                    'App preferences and notifications',
                    () {
                      // TODO: Implement settings
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Settings functionality not implemented yet')),
                      );
                    },
                  ),
                  _buildProfileOption(
                    context,
                    Icons.help,
                    'Help & Support',
                    'Get help and contact support',
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const HelpPage()),
                      );
                    },
                  ),
                  _buildProfileOption(
                    context,
                    Icons.info,
                    'About',
                    'App version and information',
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const AboutPage()),
                      );
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: DesignTokens.spaceLg),

            // Legal Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Legal',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: DesignTokens.spaceMd),
                  _buildProfileOption(
                    context,
                    Icons.privacy_tip,
                    'Privacy Policy',
                    'How we collect and use your data',
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const PrivacyPolicyPage()),
                      );
                    },
                  ),
                  _buildProfileOption(
                    context,
                    Icons.description,
                    'Terms of Service',
                    'Terms and conditions of use',
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const TermsOfServicePage()),
                      );
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: DesignTokens.spaceLg),

            // Company Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Company',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: DesignTokens.spaceMd),
                  _buildProfileOption(
                    context,
                    Icons.work,
                    'Careers',
                    'Join our team',
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const CareerPage()),
                      );
                    },
                  ),
                  _buildProfileOption(
                    context,
                    Icons.contact_mail,
                    'Contact Us',
                    'Get in touch with us',
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const ContactPage()),
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

  Widget _buildProfileOption(
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
