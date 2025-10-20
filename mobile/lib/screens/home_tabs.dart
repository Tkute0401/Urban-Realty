import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/auth_provider.dart';
import '../providers/property_provider.dart';
import '../models/property.dart';
import 'property_list_screen.dart';
import 'property_detail_screen.dart';
import 'property_search_screen.dart';
import 'dashboard_screen.dart';
import 'search_screen.dart';
import 'favorites_screen.dart';
import 'notifications_screen.dart';
import 'profile_screen.dart';
import 'admin/admin_dashboard_screen.dart';
import 'developer/developer_dashboard_screen.dart';
import 'maps_screen.dart';
import 'location_search_screen.dart';

class HomeTabs extends ConsumerStatefulWidget {
  const HomeTabs({super.key});

  @override
  ConsumerState<HomeTabs> createState() => _HomeTabsState();
}

class _HomeTabsState extends ConsumerState<HomeTabs> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authStateProvider);
    final user = authState.user;

    if (user == null) {
      // If user is null, navigate to login screen
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
      });
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final isAgent = user.role.toLowerCase() == 'agent';
    final isAdmin = user.role.toLowerCase() == 'admin';
    final isDeveloper = user.role.toLowerCase() == 'developer';

        List<Widget> tabs;
        List<NavigationDestination> destinations;
        
        if (isAdmin) {
          tabs = [
            _buildAdminDashboardTab(),
            _buildSearchTab(),
            _buildMapsTab(),
            _buildNotificationsTab(),
            _buildProfileTab(),
          ];
          destinations = const [
            NavigationDestination(
              icon: Icon(Icons.admin_panel_settings_outlined),
              selectedIcon: Icon(Icons.admin_panel_settings),
              label: 'Admin',
            ),
            NavigationDestination(
              icon: Icon(Icons.search_outlined),
              selectedIcon: Icon(Icons.search),
              label: 'Search',
            ),
            NavigationDestination(
              icon: Icon(Icons.map_outlined),
              selectedIcon: Icon(Icons.map),
              label: 'Map',
            ),
            NavigationDestination(
              icon: Icon(Icons.notifications_outlined),
              selectedIcon: Icon(Icons.notifications),
              label: 'Notifications',
            ),
            NavigationDestination(
              icon: Icon(Icons.person_outline),
              selectedIcon: Icon(Icons.person),
              label: 'Profile',
            ),
          ];
        } else if (isDeveloper) {
          tabs = [
            _buildDeveloperDashboardTab(),
            _buildSearchTab(),
            _buildMapsTab(),
            _buildFavoritesTab(),
            _buildNotificationsTab(),
            _buildProfileTab(),
          ];
          destinations = const [
            NavigationDestination(
              icon: Icon(Icons.developer_mode_outlined),
              selectedIcon: Icon(Icons.developer_mode),
              label: 'Developer',
            ),
            NavigationDestination(
              icon: Icon(Icons.search_outlined),
              selectedIcon: Icon(Icons.search),
              label: 'Search',
            ),
            NavigationDestination(
              icon: Icon(Icons.map_outlined),
              selectedIcon: Icon(Icons.map),
              label: 'Map',
            ),
            NavigationDestination(
              icon: Icon(Icons.favorite_border),
              selectedIcon: Icon(Icons.favorite),
              label: 'Favorites',
            ),
            NavigationDestination(
              icon: Icon(Icons.notifications_outlined),
              selectedIcon: Icon(Icons.notifications),
              label: 'Notifications',
            ),
            NavigationDestination(
              icon: Icon(Icons.person_outline),
              selectedIcon: Icon(Icons.person),
              label: 'Profile',
            ),
          ];
        } else if (isAgent) {
          tabs = [
            _buildDashboardTab(user),
            _buildSearchTab(),
            _buildMapsTab(),
            _buildFavoritesTab(),
            _buildNotificationsTab(),
            _buildProfileTab(),
          ];
          destinations = const [
            NavigationDestination(
              icon: Icon(Icons.dashboard_outlined),
              selectedIcon: Icon(Icons.dashboard),
              label: 'Home',
            ),
            NavigationDestination(
              icon: Icon(Icons.search_outlined),
              selectedIcon: Icon(Icons.search),
              label: 'Search',
            ),
            NavigationDestination(
              icon: Icon(Icons.map_outlined),
              selectedIcon: Icon(Icons.map),
              label: 'Map',
            ),
            NavigationDestination(
              icon: Icon(Icons.favorite_border),
              selectedIcon: Icon(Icons.favorite),
              label: 'Favorites',
            ),
            NavigationDestination(
              icon: Icon(Icons.notifications_outlined),
              selectedIcon: Icon(Icons.notifications),
              label: 'Notifications',
            ),
            NavigationDestination(
              icon: Icon(Icons.person_outline),
              selectedIcon: Icon(Icons.person),
              label: 'Profile',
            ),
          ];
        } else {
          // Regular user tabs
          tabs = [
            _buildDashboardTab(user),
            _buildSearchTab(),
            _buildMapsTab(),
            _buildFavoritesTab(),
            _buildNotificationsTab(),
            _buildProfileTab(),
          ];
          destinations = const [
            NavigationDestination(
              icon: Icon(Icons.dashboard_outlined),
              selectedIcon: Icon(Icons.dashboard),
              label: 'Home',
            ),
            NavigationDestination(
              icon: Icon(Icons.search_outlined),
              selectedIcon: Icon(Icons.search),
              label: 'Search',
            ),
            NavigationDestination(
              icon: Icon(Icons.map_outlined),
              selectedIcon: Icon(Icons.map),
              label: 'Map',
            ),
            NavigationDestination(
              icon: Icon(Icons.favorite_border),
              selectedIcon: Icon(Icons.favorite),
              label: 'Favorites',
            ),
            NavigationDestination(
              icon: Icon(Icons.notifications_outlined),
              selectedIcon: Icon(Icons.notifications),
              label: 'Notifications',
            ),
            NavigationDestination(
              icon: Icon(Icons.person_outline),
              selectedIcon: Icon(Icons.person),
              label: 'Profile',
            ),
          ];
        }
        
        // Update current index if it's out of bounds for the new tab count
        if (_currentIndex >= tabs.length) {
          _currentIndex = 0;
        }
        
        return Scaffold(
          body: tabs[_currentIndex],
          bottomNavigationBar: NavigationBar(
            selectedIndex: _currentIndex,
            onDestinationSelected: (index) => setState(() => _currentIndex = index),
            destinations: destinations,
      ),
    );
  }

  Widget _buildAdminDashboardTab() {
    return const AdminDashboardScreen();
  }

  Widget _buildDeveloperDashboardTab() {
    return const DeveloperDashboardScreen();
  }

  Widget _buildDashboardTab(user) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Urban Realty'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await ref.read(authStateProvider.notifier).logout();
              if (mounted) {
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
                    'Find your dream property',
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: Colors.white70,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(
                      'Role: ${user.role.toUpperCase()}',
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

            // Quick Actions
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                'Quick Actions',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),

            const SizedBox(height: 16),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  Expanded(
                    child: _buildQuickActionCard(
                      context,
                      'Search Properties',
                      Icons.search,
                      Colors.blue,
                      () => _navigateToSearch(),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildQuickActionCard(
                      context,
                      'Featured',
                      Icons.star,
                      Colors.orange,
                      () => _navigateToFeatured(),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  Expanded(
                    child: _buildQuickActionCard(
                      context,
                      'Nearby',
                      Icons.location_on,
                      Colors.green,
                      () => _navigateToNearby(),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildQuickActionCard(
                      context,
                      'Favorites',
                      Icons.favorite,
                      Colors.red,
                      () => _navigateToFavorites(),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Featured Properties
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Featured Properties',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  TextButton(
                    onPressed: () => _navigateToFeatured(),
                    child: const Text('View All'),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Featured Properties List
            Consumer(
              builder: (context, ref, child) {
                final featuredAsync = ref.watch(featuredPropertiesProvider);

                return featuredAsync.when(
                  data: (properties) {
                    if (properties.isEmpty) {
                      return const Padding(
                        padding: EdgeInsets.all(16),
                        child: Center(
                          child: Text('No featured properties available'),
                        ),
                      );
                    }

                    return SizedBox(
                      height: 200,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        itemCount: properties.take(5).length,
                        itemBuilder: (context, index) {
                          final property = properties[index];
                          return Container(
                            width: 280,
                            margin: const EdgeInsets.only(right: 16),
                            child: Card(
                              child: InkWell(
                                onTap: () => _navigateToPropertyDetail(property),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    // Property Image
                                    ClipRRect(
                                      borderRadius: const BorderRadius.vertical(top: Radius.circular(8)),
                                      child: Container(
                                        height: 120,
                                        width: double.infinity,
                                        color: Colors.grey[300],
                                        child: property.images.isNotEmpty
                                            ? Image.network(
                                                property.images.first,
                                                fit: BoxFit.cover,
                                                errorBuilder: (context, error, stackTrace) => const Icon(Icons.home, size: 40),
                                              )
                                            : const Icon(Icons.home, size: 40),
                                      ),
                                    ),

                                    // Property Info
                                    Padding(
                                      padding: const EdgeInsets.all(12),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            _formatPrice(property.price, property.currency),
                                            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                              fontWeight: FontWeight.bold,
                                              color: Theme.of(context).colorScheme.primary,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            property.title,
                                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                              fontWeight: FontWeight.w600,
                                            ),
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            '${property.location.neighborhood}, ${property.location.city}',
                                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                              color: Colors.grey[600],
                                            ),
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    );
                  },
                  loading: () => const Padding(
                    padding: EdgeInsets.all(16),
                    child: Center(child: CircularProgressIndicator()),
                  ),
                  error: (error, stack) => Padding(
                    padding: const EdgeInsets.all(16),
                    child: Center(
                      child: Text('Error loading featured properties: $error'),
                    ),
          ),
        );
      },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActionCard(
    BuildContext context,
    String title,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Icon(
                icon,
                size: 32,
                color: color,
              ),
              const SizedBox(height: 8),
              Text(
                title,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _navigateToSearch() {
    // Switch to search tab
    setState(() {
      _currentIndex = 1; // Search tab index
    });
  }

  void _navigateToFeatured() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const PropertyListScreen(
          title: 'Featured Properties',
          initialFilters: PropertyFilters(featured: true),
        ),
      ),
    );
  }

  void _navigateToNearby() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const PropertyListScreen(
          title: 'Nearby Properties',
        ),
      ),
    );
  }

  void _navigateToFavorites() {
    // Switch to favorites tab
    setState(() {
      _currentIndex = 2; // Favorites tab index
    });
  }

  void _navigateToPropertyDetail(Property property) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => PropertyDetailScreen(property: property),
      ),
    );
  }

  String _formatPrice(double price, String currency) {
    if (price >= 1000000) {
      return '${currency}${(price / 1000000).toStringAsFixed(1)}M';
    } else if (price >= 1000) {
      return '${currency}${(price / 1000).toStringAsFixed(0)}K';
    } else {
      return '$currency${price.toStringAsFixed(0)}';
    }
  }

  Widget _buildSearchTab() {
    return const PropertySearchScreen();
  }

  Widget _buildMapsTab() {
    return const MapsScreen();
  }

  Widget _buildFavoritesTab() {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Favorites'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: const Center(
        child: Text('Favorites Screen Content'),
      ),
    );
  }

  Widget _buildNotificationsTab() {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: const Center(
        child: Text('Notifications Screen Content'),
      ),
    );
  }

  Widget _buildProfileTab() {
    return const ProfileScreen();
  }
}
