import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shimmer/shimmer.dart';
import 'package:intl/intl.dart';
import 'enhanced_property_detail_screen.dart';

class EnhancedHomeScreen extends StatefulWidget {
  const EnhancedHomeScreen({super.key});

  @override
  State<EnhancedHomeScreen> createState() => _EnhancedHomeScreenState();
}

class _EnhancedHomeScreenState extends State<EnhancedHomeScreen> {
  final TextEditingController _searchController = TextEditingController();
  bool _isLoading = true;
  List<Map<String, dynamic>> _featuredProperties = [];
  List<Map<String, dynamic>> _recentProperties = [];
  List<Map<String, dynamic>> _filteredProperties = [];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  void _loadData() {
    // Simulate API call
    Future.delayed(const Duration(seconds: 2), () {
      setState(() {
        _featuredProperties = [
          {
            'id': '1',
            'title': 'Luxury Penthouse',
            'price': 3500000,
            'location': 'Downtown',
            'bedrooms': 4,
            'bathrooms': 3,
            'area': 2500,
            'image': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
            'isFeatured': true,
            'rating': 4.8,
            'reviews': 24,
          },
          {
            'id': '2',
            'title': 'Modern Villa',
            'price': 2800000,
            'location': 'Suburban Area',
            'bedrooms': 5,
            'bathrooms': 4,
            'area': 3200,
            'image': 'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800',
            'isFeatured': true,
            'rating': 4.9,
            'reviews': 31,
          },
          {
            'id': '3',
            'title': 'Cozy Apartment',
            'price': 850000,
            'location': 'City Center',
            'bedrooms': 2,
            'bathrooms': 2,
            'area': 1200,
            'image': 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800',
            'isFeatured': true,
            'rating': 4.6,
            'reviews': 18,
          },
        ];

        _recentProperties = [
          {
            'id': '4',
            'title': 'Family Home',
            'price': 1200000,
            'location': 'Residential Area',
            'bedrooms': 3,
            'bathrooms': 2,
            'area': 1800,
            'image': 'https://images.unsplash.com/photo-1560448204-5c3a73e7c4b8?w=800',
            'isFeatured': false,
            'rating': 4.7,
            'reviews': 15,
          },
          {
            'id': '5',
            'title': 'Studio Loft',
            'price': 450000,
            'location': 'Arts District',
            'bedrooms': 1,
            'bathrooms': 1,
            'area': 800,
            'image': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
            'isFeatured': false,
            'rating': 4.5,
            'reviews': 12,
          },
          {
            'id': '6',
            'title': 'Townhouse',
            'price': 950000,
            'location': 'Historic District',
            'bedrooms': 3,
            'bathrooms': 2,
            'area': 1600,
            'image': 'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800',
            'isFeatured': false,
            'rating': 4.8,
            'reviews': 22,
          },
        ];

        _filteredProperties = [..._featuredProperties, ..._recentProperties];
        _isLoading = false;
      });
    });
  }

  void _onRefresh() async {
    _loadData();
  }

  void _onSearchChanged(String query) {
    setState(() {
      if (query.isEmpty) {
        _filteredProperties = [..._featuredProperties, ..._recentProperties];
      } else {
        _filteredProperties = [..._featuredProperties, ..._recentProperties]
            .where((property) =>
                property['title'].toLowerCase().contains(query.toLowerCase()) ||
                property['location'].toLowerCase().contains(query.toLowerCase()))
            .toList();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _isLoading ? _buildLoadingScreen() : _buildContent(),
    );
  }

  Widget _buildLoadingScreen() {
    return Shimmer.fromColors(
      baseColor: Colors.grey[300]!,
      highlightColor: Colors.grey[100]!,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: 6,
        itemBuilder: (context, index) {
          return Container(
            height: 200,
            margin: const EdgeInsets.only(bottom: 16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
            ),
          );
        },
      ),
    );
  }

  Widget _buildContent() {
    return CustomScrollView(
      slivers: [
        _buildSliverAppBar(),
        SliverToBoxAdapter(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildSearchBar(),
              _buildQuickActions(),
              _buildFeaturedSection(),
              _buildRecentSection(),
              const SizedBox(height: 100), // Bottom padding
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSliverAppBar() {
    return SliverAppBar(
      expandedHeight: 120,
      pinned: true,
      backgroundColor: Theme.of(context).colorScheme.surface,
      flexibleSpace: FlexibleSpaceBar(
        title: Text(
          'SQUARE FOOOT',
          style: TextStyle(
            color: Theme.of(context).colorScheme.onSurface,
            fontWeight: FontWeight.bold,
          ),
        ),
        background: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Theme.of(context).colorScheme.primary,
                Theme.of(context).colorScheme.primaryContainer,
              ],
            ),
          ),
        ),
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.notifications_outlined),
          onPressed: () {
            Navigator.pushNamed(context, '/notifications');
          },
        ),
        IconButton(
          icon: const Icon(Icons.person_outline),
          onPressed: () {
            Navigator.pushNamed(context, '/profile');
          },
        ),
      ],
    );
  }

  Widget _buildSearchBar() {
    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: TextField(
        controller: _searchController,
        onChanged: _onSearchChanged,
        decoration: InputDecoration(
          hintText: 'Search properties...',
          prefixIcon: const Icon(Icons.search),
          suffixIcon: IconButton(
            icon: const Icon(Icons.tune),
            onPressed: () {
              // Open filters
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Filters coming soon!')),
              );
            },
          ),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide.none,
          ),
          filled: true,
          fillColor: Theme.of(context).colorScheme.surface,
        ),
      ),
    );
  }

  Widget _buildQuickActions() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Quick Actions',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _buildQuickActionCard(
                  Icons.home,
                  'Buy',
                  'Find your dream home',
                  Colors.blue,
                  () => Navigator.pushNamed(context, '/properties'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildQuickActionCard(
                  Icons.key,
                  'Rent',
                  'Find rental properties',
                  Colors.green,
                  () => Navigator.pushNamed(context, '/properties'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildQuickActionCard(
                  Icons.sell,
                  'Sell',
                  'List your property',
                  Colors.orange,
                  () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Sell property feature coming soon!')),
                    );
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildQuickActionCard(
                  Icons.favorite,
                  'Favorites',
                  'Saved properties',
                  Colors.red,
                  () => Navigator.pushNamed(context, '/favorites'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActionCard(IconData icon, String title, String subtitle, Color color, VoidCallback onTap) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 24),
              ),
              const SizedBox(height: 8),
              Text(
                title,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                subtitle,
                style: TextStyle(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                  fontSize: 12,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFeaturedSection() {
    return Container(
      margin: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Featured Properties',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextButton(
                onPressed: () => Navigator.pushNamed(context, '/properties'),
                child: const Text('View All'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 280,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: _featuredProperties.length,
              itemBuilder: (context, index) {
                return _buildPropertyCard(_featuredProperties[index], true);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentSection() {
    return Container(
      margin: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Recent Properties',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextButton(
                onPressed: () => Navigator.pushNamed(context, '/properties'),
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
              return _buildPropertyCard(_recentProperties[index], false);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildPropertyCard(Map<String, dynamic> property, bool isFeatured) {
    return Container(
      width: isFeatured ? 280 : double.infinity,
      margin: EdgeInsets.only(right: isFeatured ? 16 : 0, bottom: 16),
      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: InkWell(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => EnhancedPropertyDetailScreen(
                  id: property['id'],
                  propertyData: property,
                ),
              ),
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
                    child: CachedNetworkImage(
                      imageUrl: property['image'],
                      height: isFeatured ? 160 : 200,
                      width: double.infinity,
                      fit: BoxFit.cover,
                      placeholder: (context, url) => Shimmer.fromColors(
                        baseColor: Colors.grey[300]!,
                        highlightColor: Colors.grey[100]!,
                        child: Container(
                          height: isFeatured ? 160 : 200,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                  if (isFeatured)
                    Positioned(
                      top: 12,
                      left: 12,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Theme.of(context).colorScheme.primary,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          'Featured',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  Positioned(
                    top: 12,
                    right: 12,
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.5),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Icon(
                        Icons.favorite_border,
                        color: Colors.white,
                        size: 20,
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
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            property['title'],
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        Row(
                          children: [
                            const Icon(Icons.star, color: Colors.amber, size: 16),
                            const SizedBox(width: 4),
                            Text(
                              property['rating'].toString(),
                              style: const TextStyle(fontSize: 12),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      property['location'],
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Text(
                          NumberFormat.currency(symbol: '\$').format(property['price']),
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.primary,
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                        const Spacer(),
                        _buildPropertyFeature(Icons.bed, '${property['bedrooms']}'),
                        const SizedBox(width: 8),
                        _buildPropertyFeature(Icons.bathtub_outlined, '${property['bathrooms']}'),
                        const SizedBox(width: 8),
                        _buildPropertyFeature(Icons.square_foot, '${property['area']}'),
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

  Widget _buildPropertyFeature(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 16, color: Theme.of(context).colorScheme.onSurfaceVariant),
        const SizedBox(width: 2),
        Text(
          text,
          style: TextStyle(
            color: Theme.of(context).colorScheme.onSurfaceVariant,
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
}