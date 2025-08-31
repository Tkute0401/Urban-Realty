import 'package:flutter/material.dart';
import '../services/property_service.dart';
import '../config/api_config.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {

  bool _loading = true;
  String? _error;
  List<dynamic> _featuredProperties = const [];
  List<dynamic> _recentProperties = const [];
  final TextEditingController _searchController = TextEditingController();
  String _selectedPropertyType = 'ALL';

  final List<Map<String, dynamic>> _propertyCategories = [
    {'type': 'ALL', 'title': 'All Properties', 'icon': Icons.home, 'color': const Color(0xFFF75B00)},
    {'type': 'House', 'title': 'Houses', 'icon': Icons.house, 'color': const Color(0xFF1A00FF)},
    {'type': 'Apartment', 'title': 'Apartments', 'icon': Icons.apartment, 'color': const Color(0xFF059669)},
    {'type': 'Villa', 'title': 'Villas', 'icon': Icons.villa, 'color': const Color(0xFFFF6600)},
    {'type': 'Land', 'title': 'Land', 'icon': Icons.landscape, 'color': const Color(0xFF8B5CF6)},
    {'type': 'Commercial', 'title': 'Commercial', 'icon': Icons.business, 'color': const Color(0xFFDC2626)},
  ];

  @override
  void initState() {
    super.initState();
    _fetchDashboardData();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _fetchDashboardData() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final res = await PropertyService.list();
      final List<dynamic> data = (res['data'] ?? res) as List<dynamic>? ?? 
          (res['data']?['data'] as List<dynamic>? ?? []);
      
      setState(() {
        _featuredProperties = data.take(3).toList();
        _recentProperties = data.take(6).toList();
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  String? _pickPrimaryImage(Map<String, dynamic> property) {
    final dynamic images = property['images'] ?? property['photos'] ?? property['gallery'];
    String? url;
    
    if (property['coverImage'] is String && (property['coverImage'] as String).isNotEmpty) {
      url = property['coverImage'] as String;
    } else if (images is List && images.isNotEmpty) {
      final first = images.first;
      if (first is String) url = first;
      if (first is Map && first['url'] is String) url = first['url'] as String;
    } else if (property['image'] is String) {
      url = property['image'] as String;
    }
    
    if (url == null || url.isEmpty) return null;
    if (url.startsWith('http')) return url;
    
    final base = ApiConfig.baseUrl.replaceFirst(RegExp(r"/api/.*$"), '');
    if (!url.startsWith('/')) url = '/$url';
    return '$base$url';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.error_outline,
                        size: 64,
                        color: theme.colorScheme.error,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Failed to load dashboard',
                        style: theme.textTheme.titleLarge?.copyWith(
                          color: theme.colorScheme.error,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        _error!,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _fetchDashboardData,
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _fetchDashboardData,
                  child: CustomScrollView(
                    slivers: [
                      // Enhanced App Bar with Hero Section
                      SliverAppBar(
                        expandedHeight: 200,
                        floating: false,
                        pinned: true,
                        backgroundColor: theme.colorScheme.surface,
                        surfaceTintColor: Colors.transparent,
                        flexibleSpace: FlexibleSpaceBar(
                          title: Text(
                            'SQUARE FOOOT',
                            style: theme.textTheme.headlineSmall?.copyWith(
                              color: theme.colorScheme.onSurface,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          background: Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [
                                  theme.colorScheme.primary.withValues(alpha: 0.1),
                                  theme.colorScheme.primaryContainer.withValues(alpha: 0.1),
                                  theme.colorScheme.secondary.withValues(alpha: 0.05),
                                ],
                              ),
                            ),
                            child: Stack(
                              children: [
                                Positioned(
                                  top: 60,
                                  left: 20,
                                  child: Text(
                                    'Find Your Dream\nProperty',
                                    style: theme.textTheme.headlineMedium?.copyWith(
                                      color: theme.colorScheme.primary,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                                Positioned(
                                  bottom: 20,
                                  right: 20,
                                  child: Icon(
                                    Icons.home_rounded,
                                    size: 80,
                                    color: theme.colorScheme.primary.withValues(alpha: 0.3),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        actions: [
                          IconButton(
                            icon: const Icon(Icons.notifications_outlined),
                            onPressed: () {
                              Navigator.of(context).pushNamed('/notifications');
                            },
                          ),
                          IconButton(
                            icon: const Icon(Icons.settings_outlined),
                            onPressed: () {
                              Navigator.of(context).pushNamed('/settings');
                            },
                          ),
                        ],
                      ),
                      
                      // Search Bar
                      SliverToBoxAdapter(
                        child: Container(
                          margin: const EdgeInsets.all(16),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: theme.colorScheme.surface,
                            borderRadius: BorderRadius.circular(16),
                            boxShadow: [
                              BoxShadow(
                                color: theme.colorScheme.shadow.withValues(alpha: 0.1),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Row(
                            children: [
                              Expanded(
                                child: TextField(
                                  controller: _searchController,
                                  decoration: InputDecoration(
                                    hintText: 'Search properties, locations...',
                                    prefixIcon: Icon(Icons.search, color: theme.colorScheme.primary),
                                    border: InputBorder.none,
                                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                  ),
                                  onSubmitted: (value) {
                                    if (value.isNotEmpty) {
                                      Navigator.of(context).pushNamed('/search', arguments: {'query': value});
                                    }
                                  },
                                ),
                              ),
                              IconButton(
                                icon: Icon(Icons.tune, color: theme.colorScheme.primary),
                                onPressed: () {
                                  Navigator.of(context).pushNamed('/search');
                                },
                              ),
                            ],
                          ),
                        ),
                      ),
                      
                      // Property Categories
                      SliverToBoxAdapter(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Property Types',
                                style: theme.textTheme.titleLarge?.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 16),
                              SizedBox(
                                height: 100,
                                child: ListView.builder(
                                  scrollDirection: Axis.horizontal,
                                  itemCount: _propertyCategories.length,
                                  itemBuilder: (context, index) {
                                    final category = _propertyCategories[index];
                                    final isSelected = _selectedPropertyType == category['type'];
                                    
                                    return GestureDetector(
                                      onTap: () {
                                        setState(() {
                                          _selectedPropertyType = category['type'];
                                        });
                                        Navigator.of(context).pushNamed('/search', arguments: {
                                          'propertyType': category['type']
                                        });
                                      },
                                      child: Container(
                                        width: 100,
                                        margin: const EdgeInsets.only(right: 12),
                                        decoration: BoxDecoration(
                                          color: isSelected 
                                              ? category['color'].withValues(alpha: 0.1)
                                              : theme.colorScheme.surfaceContainerHighest,
                                          borderRadius: BorderRadius.circular(16),
                                          border: isSelected 
                                              ? Border.all(color: category['color'], width: 2)
                                              : null,
                                        ),
                                        child: Column(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            Icon(
                                              category['icon'],
                                              color: isSelected ? category['color'] : theme.colorScheme.onSurfaceVariant,
                                              size: 32,
                                            ),
                                            const SizedBox(height: 8),
                                            Text(
                                              category['title'],
                                              style: theme.textTheme.bodySmall?.copyWith(
                                                color: isSelected ? category['color'] : theme.colorScheme.onSurfaceVariant,
                                                fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                                              ),
                                              textAlign: TextAlign.center,
                                              maxLines: 2,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ],
                                        ),
                                      ),
                                    );
                                  },
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      
                      // Quick Actions
                      SliverToBoxAdapter(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Quick Actions',
                                style: theme.textTheme.titleLarge?.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 16),
                              Row(
                                children: [
                                  Expanded(
                                    child: _buildQuickActionCard(
                                      context,
                                      'Search Properties',
                                      Icons.search,
                                      theme.colorScheme.primary,
                                      () => Navigator.of(context).pushNamed('/search'),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: _buildQuickActionCard(
                                      context,
                                      'My Favorites',
                                      Icons.favorite,
                                      theme.colorScheme.secondary,
                                      () => Navigator.of(context).pushNamed('/favorites'),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Row(
                                children: [
                                  Expanded(
                                    child: _buildQuickActionCard(
                                      context,
                                      'Contact Agent',
                                      Icons.contact_support,
                                      theme.colorScheme.tertiary,
                                      () {
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          const SnackBar(content: Text('Contact Agent feature coming soon')),
                                        );
                                      },
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: _buildQuickActionCard(
                                      context,
                                      'Schedule Viewing',
                                      Icons.calendar_today,
                                      theme.colorScheme.primary,
                                      () {
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          const SnackBar(content: Text('Schedule Viewing feature coming soon')),
                                        );
                                      },
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                      
                      // Featured Properties
                      if (_featuredProperties.isNotEmpty)
                        SliverToBoxAdapter(
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      'Featured Properties',
                                      style: theme.textTheme.titleLarge?.copyWith(
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                    TextButton(
                                      onPressed: () => Navigator.of(context).pushNamed('/properties'),
                                      child: const Text('View All'),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 16),
                                SizedBox(
                                  height: 320,
                                  child: ListView.builder(
                                    scrollDirection: Axis.horizontal,
                                    itemCount: _featuredProperties.length,
                                    itemBuilder: (context, index) {
                                      final property = _featuredProperties[index];
                                      return _buildFeaturedPropertyCard(context, property, theme);
                                    },
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      
                      // Recent Properties
                      if (_recentProperties.isNotEmpty)
                        SliverToBoxAdapter(
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      'Recent Properties',
                                      style: theme.textTheme.titleLarge?.copyWith(
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                    TextButton(
                                      onPressed: () => Navigator.of(context).pushNamed('/properties'),
                                      child: const Text('View All'),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 16),
                                ListView.builder(
                                  shrinkWrap: true,
                                  physics: const NeverScrollableScrollPhysics(),
                                  itemCount: _recentProperties.length,
                                  itemBuilder: (context, index) {
                                    final property = _recentProperties[index];
                                    return _buildRecentPropertyCard(context, property, theme);
                                  },
                                ),
                              ],
                            ),
                          ),
                        ),
                      
                      // Bottom Padding
                      const SliverToBoxAdapter(
                        child: SizedBox(height: 32),
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
    final theme = Theme.of(context);
    
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  icon,
                  color: color,
                  size: 24,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                title,
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w500,
                ),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFeaturedPropertyCard(BuildContext context, Map<String, dynamic> property, ThemeData theme) {
    final title = property['title']?.toString() ?? 'Untitled';
    final address = property['address']?.toString() ?? '';
    final price = (property['price']?.toString() ?? '').isEmpty ? '' : '₹${property['price']}';
    final imageUrl = _pickPrimaryImage(property);
    final propertyType = property['type']?.toString() ?? '';
    final bedrooms = property['bedrooms']?.toString() ?? '';
    final bathrooms = property['bathrooms']?.toString() ?? '';
    final area = property['area']?.toString() ?? '';
    
    return Container(
      width: 300,
      margin: const EdgeInsets.only(right: 16),
      child: Card(
        elevation: 4,
        child: InkWell(
          onTap: () {
            Navigator.of(context).pushNamed(
              '/property-detail',
              arguments: property['_id']?.toString() ?? '',
            );
          },
          borderRadius: BorderRadius.circular(16),
                      child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Stack(
                  children: [
                    ClipRRect(
                      borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                      child: AspectRatio(
                        aspectRatio: 16 / 9,
                        child: imageUrl == null
                            ? Container(
                                color: theme.colorScheme.surfaceContainerHighest,
                                child: Icon(
                                  Icons.home_outlined,
                                  size: 48,
                                  color: theme.colorScheme.onSurfaceVariant,
                                ),
                              )
                            : Image.network(
                                imageUrl,
                                fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) => Container(
                                  color: theme.colorScheme.surfaceContainerHighest,
                                  child: Icon(
                                    Icons.broken_image,
                                    size: 48,
                                    color: theme.colorScheme.onSurfaceVariant,
                                  ),
                                ),
                              ),
                      ),
                    ),
                    Positioned(
                      top: 12,
                      left: 12,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primary,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          propertyType,
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.colorScheme.onPrimary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                    if (price.isNotEmpty)
                      Positioned(
                        bottom: 12,
                        right: 12,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                                                            color: theme.colorScheme.surface.withValues(alpha: 0.9),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            price,
                            style: theme.textTheme.bodySmall?.copyWith(
                              color: theme.colorScheme.primary,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
                              Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Icon(
                            Icons.location_on_outlined,
                            size: 16,
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              address,
                              style: theme.textTheme.bodyMedium?.copyWith(
                                color: theme.colorScheme.onSurfaceVariant,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          if (bedrooms.isNotEmpty) ...[
                            Icon(
                              Icons.bed_outlined,
                              size: 16,
                              color: theme.colorScheme.onSurfaceVariant,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              '$bedrooms Beds',
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: theme.colorScheme.onSurfaceVariant,
                              ),
                            ),
                            const SizedBox(width: 12),
                          ],
                          if (bathrooms.isNotEmpty) ...[
                            Icon(
                              Icons.bathroom_outlined,
                              size: 16,
                              color: theme.colorScheme.onSurfaceVariant,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              '$bathrooms Baths',
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: theme.colorScheme.onSurfaceVariant,
                              ),
                            ),
                            const SizedBox(width: 12),
                          ],
                          if (area.isNotEmpty) ...[
                            Icon(
                              Icons.square_foot_outlined,
                              size: 16,
                              color: theme.colorScheme.onSurfaceVariant,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              '$area sq ft',
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: theme.colorScheme.onSurfaceVariant,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRecentPropertyCard(BuildContext context, Map<String, dynamic> property, ThemeData theme) {
    final title = property['title']?.toString() ?? 'Untitled';
    final address = property['address']?.toString() ?? '';
    final price = (property['price']?.toString() ?? '').isEmpty ? '' : '₹${property['price']}';
    final imageUrl = _pickPrimaryImage(property);
    final propertyType = property['type']?.toString() ?? '';
    final bedrooms = property['bedrooms']?.toString() ?? '';
    final bathrooms = property['bathrooms']?.toString() ?? '';
    
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
              child: ListTile(
          contentPadding: const EdgeInsets.all(16),
          leading: Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: SizedBox(
                  width: 80,
                  height: 80,
                  child: imageUrl == null
                      ? Container(
                          color: theme.colorScheme.surfaceContainerHighest,
                          child: Icon(
                            Icons.home_outlined,
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                        )
                      : Image.network(
                          imageUrl,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(
                            color: theme.colorScheme.surfaceContainerHighest,
                            child: Icon(
                              Icons.broken_image,
                              color: theme.colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ),
                ),
              ),
              Positioned(
                top: 4,
                left: 4,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primary,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    propertyType,
                    style: theme.textTheme.labelSmall?.copyWith(
                      color: theme.colorScheme.onPrimary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ),
        title: Text(
          title,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
          style: theme.textTheme.titleMedium,
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Row(
              children: [
                Icon(
                  Icons.location_on_outlined,
                  size: 14,
                  color: theme.colorScheme.onSurfaceVariant,
                ),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    address,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                if (bedrooms.isNotEmpty) ...[
                  Icon(
                    Icons.bed_outlined,
                    size: 14,
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    '$bedrooms Beds',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                  const SizedBox(width: 8),
                ],
                if (bathrooms.isNotEmpty) ...[
                  Icon(
                    Icons.bathroom_outlined,
                    size: 14,
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    '$bathrooms Baths',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ],
            ),
            if (price.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(
                price,
                style: theme.textTheme.titleMedium?.copyWith(
                  color: theme.colorScheme.primary,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ],
        ),
        onTap: () {
          Navigator.of(context).pushNamed(
            '/property-detail',
            arguments: property['_id']?.toString() ?? '',
          );
        },
      ),
    );
  }
}