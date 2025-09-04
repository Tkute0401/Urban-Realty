import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../providers/auth_provider.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {

  bool _loading = true;
  String? _error;
  Map<String, dynamic>? _me;

  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _name = TextEditingController();
  final TextEditingController _email = TextEditingController();
  final TextEditingController _mobile = TextEditingController();

  @override
  void initState() {
    super.initState();
    _fetch();
  }

  Future<void> _fetch() async {
    setState(() { _loading = true; _error = null; });
    try {
      final me = await AuthService().getCurrentUser();
      _me = me.toJson();
      _name.text = me.name;
      _email.text = me.email;
      _mobile.text = _me?['mobile']?.toString() ?? '';
    } catch (e) {
      _error = e.toString();
    } finally {
      if (mounted) setState(() { _loading = false; });
    }
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _loading = true; _error = null; });
    try {
      await AuthService().updateProfile({
        'name': _name.text.trim(),
        'email': _email.text.trim(),
        'mobile': _mobile.text.trim(),
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Profile updated')));
      }
    } catch (e) {
      if (mounted) setState(() { _error = e.toString(); });
    } finally {
      if (mounted) setState(() { _loading = false; });
    }
  }

  Widget _buildProfileActionTile(BuildContext context, String title, IconData icon, VoidCallback onTap) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(icon, color: Theme.of(context).colorScheme.primary),
        title: Text(title),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: onTap,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.pushNamed(context, '/settings'),
        icon: const Icon(Icons.settings),
        label: const Text('Settings'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Theme.of(context).colorScheme.onPrimary,
      ),
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () => Navigator.pushNamed(context, '/settings'),
            tooltip: 'Settings',
          ),
          IconButton(
            icon: const Icon(Icons.help_outline),
            onPressed: () => Navigator.pushNamed(context, '/help'),
            tooltip: 'Help',
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 480),
                  child: Form(
                    key: _formKey,
                    child: ListView(
                      children: [
                        if (_error != null)
                          Padding(
                            padding: const EdgeInsets.only(bottom: 8.0),
                            child: Text(_error!, style: const TextStyle(color: Colors.red)),
                          ),
                        TextFormField(
                          controller: _name,
                          decoration: const InputDecoration(labelText: 'Name'),
                          validator: (v) => (v == null || v.isEmpty) ? 'Enter name' : null,
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _email,
                          decoration: const InputDecoration(labelText: 'Email'),
                          keyboardType: TextInputType.emailAddress,
                          validator: (v) => (v == null || v.isEmpty) ? 'Enter email' : null,
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _mobile,
                          decoration: const InputDecoration(labelText: 'Mobile'),
                          keyboardType: TextInputType.phone,
                        ),
                        const SizedBox(height: 20),
                        ElevatedButton(onPressed: _save, child: const Text('Save changes')),
                        const SizedBox(height: 20),
                        
                        // Role-based Navigation Options
                        Consumer<AuthProvider>(
                          builder: (context, authProvider, child) {
                            final user = authProvider.user;
                            if (user == null) return const SizedBox.shrink();
                            
                            return Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Quick Access',
                                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                const SizedBox(height: 16),
                                
                                // Agent options
                                if (user.role.toLowerCase() == 'agent') ...[
                                  _buildProfileActionTile(
                                    context,
                                    'Agent Dashboard',
                                    Icons.dashboard,
                                    () => Navigator.pushNamed(context, '/agent/dashboard'),
                                  ),
                                  _buildProfileActionTile(
                                    context,
                                    'My Properties',
                                    Icons.home_work,
                                    () => Navigator.pushNamed(context, '/agent/properties'),
                                  ),
                                  _buildProfileActionTile(
                                    context,
                                    'Analytics',
                                    Icons.analytics,
                                    () => Navigator.pushNamed(context, '/agent/analytics'),
                                  ),
                                  _buildProfileActionTile(
                                    context,
                                    'Inquiries',
                                    Icons.inbox,
                                    () => Navigator.pushNamed(context, '/agent/inquiries'),
                                  ),
                                  _buildProfileActionTile(
                                    context,
                                    'Leads',
                                    Icons.leaderboard,
                                    () => Navigator.pushNamed(context, '/agent/leads'),
                                  ),
                                ],
                                
                                // Admin options
                                if (user.role.toLowerCase() == 'admin') ...[
                                  _buildProfileActionTile(
                                    context,
                                    'Admin Dashboard',
                                    Icons.admin_panel_settings,
                                    () => Navigator.pushNamed(context, '/admin/dashboard'),
                                  ),
                                  _buildProfileActionTile(
                                    context,
                                    'Manage Users',
                                    Icons.people,
                                    () => Navigator.pushNamed(context, '/admin/users'),
                                  ),
                                ],
                                
                                // Developer options
                                if (user.role.toLowerCase() == 'developer') ...[
                                  _buildProfileActionTile(
                                    context,
                                    'Developers List',
                                    Icons.developer_mode,
                                    () => Navigator.pushNamed(context, '/developers'),
                                  ),
                                  _buildProfileActionTile(
                                    context,
                                    'Add Property',
                                    Icons.add_home,
                                    () => Navigator.pushNamed(context, '/add-property'),
                                  ),
                                ],
                                
                                // Regular user options
                                if (user.role.toLowerCase() == 'user' || user.role.toLowerCase() == 'buyer' || user.role.toLowerCase() == 'seller') ...[
                                  _buildProfileActionTile(
                                    context,
                                    'Add Property',
                                    Icons.add_home,
                                    () => Navigator.pushNamed(context, '/add-property'),
                                  ),
                                  _buildProfileActionTile(
                                    context,
                                    'Favorites',
                                    Icons.favorite,
                                    () => Navigator.pushNamed(context, '/favorites'),
                                  ),
                                  _buildProfileActionTile(
                                    context,
                                    'Recently Viewed',
                                    Icons.history,
                                    () => Navigator.pushNamed(context, '/recently-viewed'),
                                  ),
                                  _buildProfileActionTile(
                                    context,
                                    'Subscription',
                                    Icons.card_membership,
                                    () => Navigator.pushNamed(context, '/subscription/manage'),
                                  ),
                                ],
                                
                                // Common options for all users
                                const SizedBox(height: 16),
                                _buildProfileActionTile(
                                  context,
                                  'Settings',
                                  Icons.settings,
                                  () => Navigator.pushNamed(context, '/settings'),
                                ),
                                _buildProfileActionTile(
                                  context,
                                  'Favorites',
                                  Icons.favorite,
                                  () => Navigator.pushNamed(context, '/favorites'),
                                ),
                                _buildProfileActionTile(
                                  context,
                                  'Help & Support',
                                  Icons.help,
                                  () => Navigator.pushNamed(context, '/help'),
                                ),
                                _buildProfileActionTile(
                                  context,
                                  'About Us',
                                  Icons.info,
                                  () => Navigator.pushNamed(context, '/about'),
                                ),
                                _buildProfileActionTile(
                                  context,
                                  'Privacy Policy',
                                  Icons.privacy_tip,
                                  () => Navigator.pushNamed(context, '/privacy'),
                                ),
                                _buildProfileActionTile(
                                  context,
                                  'Terms of Service',
                                  Icons.description,
                                  () => Navigator.pushNamed(context, '/terms'),
                                ),
                                const SizedBox(height: 20),
                                ElevatedButton(
                                  onPressed: () async {
                                    final navigator = Navigator.of(context);
                                    await authProvider.logout();
                                    if (mounted) {
                                      navigator.pushReplacementNamed('/');
                                    }
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.red,
                                    foregroundColor: Colors.white,
                                  ),
                                  child: const Text('Logout'),
                                ),
                                const SizedBox(height: 8),
                              ],
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
    );
  }
}

