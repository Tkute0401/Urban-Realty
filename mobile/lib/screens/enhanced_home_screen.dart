import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shimmer/shimmer.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:lottie/lottie.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:fl_chart/fl_chart.dart';

class EnhancedHomeScreen extends StatefulWidget {
  const EnhancedHomeScreen({super.key});

  @override
  State<EnhancedHomeScreen> createState() => _EnhancedHomeScreenState();
}

class _EnhancedHomeScreenState extends State<EnhancedHomeScreen>
    with TickerProviderStateMixin {
  late AnimationController _fadeController;
  late AnimationController _slideController;
  late AnimationController _scaleController;
  late AnimationController _pulseController;
  
  final RefreshController _refreshController = RefreshController(initialRefresh: false);
  final TextEditingController _searchController = TextEditingController();
  
  bool _isLoading = true;
  bool _showSearchResults = false;
  String _selectedFilter = 'All';
  
  // Mock data - in real app, this would come from API
  late List<Map<String, dynamic>> _featuredProperties;
  late List<Map<String, dynamic>> _recentProperties;
  late List<Map<String, dynamic>> _searchResults;
  late Map<String, dynamic> _marketStats;

  final List<String> _filters = ['All', 'Buy', 'Rent', 'Sell', 'Commercial'];

  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(duration: const Duration(milliseconds: 1000), vsync: this);
    _slideController = AnimationController(duration: const Duration(milliseconds: 800), vsync: this);
    _scaleController = AnimationController(duration: const Duration(milliseconds: 600), vsync: this);
    _pulseController = AnimationController(duration: const Duration(milliseconds: 2000), vsync: this);
    
    _loadData();
    
    // Start animations
    _fadeController.forward();
    _slideController.forward();
    _scaleController.forward();
    _pulseController.repeat(reverse: true);
  }

  void _loadData() {
    // Simulate API call
    Future.delayed(const Duration(seconds: 2), () {
      setState(() {
        _featuredProperties = [
          {
            'id': '1',
            'title': 'Modern Downtown Apartment',
            'price': 850000,
            'location': 'Downtown, San Francisco',
            'image': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
            'bedrooms': 2,
            'bathrooms': 2,
            'area': 1200,
            'rating': 4.8,
            'reviews': 45,
            'type': 'Buy',
            'featured': true,
          },
          {
            'id': '2',
            'title': 'Luxury Waterfront Villa',
            'price': 2500000,
            'location': 'Marina District, San Francisco',
            'image': 'https://images.unsplash.com/photo-1560448075-bb485b067938?w=400',
            'bedrooms': 4,
            'bathrooms': 3,
            'area': 2800,
            'rating': 4.9,
            'reviews': 67,
            'type': 'Buy',
            'featured': true,
          },
          {
            'id': '3',
            'title': 'Cozy Studio for Rent',
            'price': 2800,
            'location': 'Mission District, San Francisco',
            'image': 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=400',
            'bedrooms': 1,
            'bathrooms': 1,
            'area': 650,
            'rating': 4.6,
            'reviews': 23,
            'type': 'Rent',
            'featured': true,
          },
        ];

        _recentProperties = [
          {
            'id': '4',
            'title': 'Family Home with Garden',
            'price': 1200000,
            'location': 'Pacific Heights, San Francisco',
            'image': 'https://images.unsplash.com/photo-1560448204-5c3a73e7c4b8?w=400',
            'bedrooms': 3,
            'bathrooms': 2,
            'area': 1800,
            'rating': 4.7,
            'reviews': 34,
            'type': 'Buy',
            'featured': false,
          },
          {
            'id': '5',
            'title': 'Modern Office Space',
            'price': 4500,
            'location': 'Financial District, San Francisco',
            'image': 'https://images.unsplash.com/photo-1560448204-8c3b3fc33ddc?w=400',
            'bedrooms': 0,
            'bathrooms': 2,
            'area': 1200,
            'rating': 4.5,
            'reviews': 18,
            'type': 'Commercial',
            'featured': false,
          },
          {
            'id': '6',
            'title': 'Penthouse with City Views',
            'price': 3200000,
            'location': 'Nob Hill, San Francisco',
            'image': 'https://images.unsplash.com/photo-1560448204-9c3b3fc33ddc?w=400',
            'bedrooms': 3,
            'bathrooms': 3,
            'area': 2200,
            'rating': 4.9,
            'reviews': 56,
            'type': 'Buy',
            'featured': false,
          },
        ];

        _marketStats = {
          'totalProperties': 1247,
          'avgPrice': 1250000,
          'avgDaysOnMarket': 18,
          'priceChange': 5.2,
          'marketTrend': 'up',
        };

        _isLoading = false;
      });
    });
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _slideController.dispose();
    _scaleController.dispose();
    _pulseController.dispose();
    _refreshController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  void _onRefresh() async {
    // Simulate refresh
    await Future.delayed(const Duration(seconds: 1));
    _loadData();
    _refreshController.refreshCompleted();
  }

  void _onSearchChanged(String query) {
    if (query.isEmpty) {
      setState(() {
        _showSearchResults = false;
      });
      return;
    }

    // Simulate search
    setState(() {
      _searchResults = _recentProperties.where((property) {
        return property['title'].toLowerCase().contains(query.toLowerCase()) ||
               property['location'].toLowerCase().contains(query.toLowerCase());
      }).toList();
      _showSearchResults = true;
    });
  }

  void _filterProperties(String filter) {
    setState(() {
      _selectedFilter = filter;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return _buildLoadingScreen();
    }

    return Scaffold(
      body: SmartRefresher(
        controller: _refreshController,
        onRefresh: _onRefresh,
        child: CustomScrollView(
          slivers: [
            _buildSliverAppBar(),
            SliverToBoxAdapter(
              child: AnimationLimiter(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: AnimationConfiguration.toStaggeredList(
                    duration: const Duration(milliseconds: 600),
                    childAnimationBuilder: (context, animation, child) => SlideAnimation(
                      horizontalOffset: 50.0,
                      child: FadeInAnimation(child: child),
                    ),
                    children: [
                      _buildSearchSection(),
                      _buildQuickActions(),
                      _buildMarketStats(),
                      _buildFeaturedProperties(),
                      _buildRecentProperties(),
                      const SizedBox(height: 100), // Bottom padding
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLoadingScreen() {
    return Scaffold(
      body: Shimmer.fromColors(
        baseColor: Colors.grey[300]!,
        highlightColor: Colors.grey[100]!,
        child: Column(
          children: [
            Container(height: 200, color: Colors.white),
            const SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(height: 24, color: Colors.white),
                  const SizedBox(height: 8),
                  Container(height: 16, color: Colors.white),
                  const SizedBox(height: 16),
                  Container(height: 100, color: Colors.white),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSliverAppBar() {
    return SliverAppBar(
      expandedHeight: 200,
      pinned: true,
      backgroundColor: Theme.of(context).colorScheme.surface,
      flexibleSpace: FlexibleSpaceBar(
        background: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Theme.of(context).colorScheme.primary,
                Theme.of(context).colorScheme.secondary,
              ],
            ),
          ),
          child: Stack(
            children: [
              // Background pattern
              Positioned.fill(
                child: CustomPaint(
                  painter: BackgroundPatternPainter(),
                ),
              ),
              // Content
              Positioned.fill(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      FadeTransition(
                        opacity: _fadeController,
                        child: Text(
                          'Welcome to',
                          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.w300,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      SlideTransition(
                        position: Tween<Offset>(
                          begin: const Offset(-1, 0),
                          end: Offset.zero,
                        ).animate(_slideController),
                        child: Text(
                          'SQUARE FOOOT',
                          style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 32,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      FadeTransition(
                        opacity: _fadeController,
                        child: Text(
                          'Find your dream property today',
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            color: Colors.white.withOpacity(0.9),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSearchSection() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Search Properties',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Container(
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: TextField(
              controller: _searchController,
              onChanged: _onSearchChanged,
              decoration: InputDecoration(
                hintText: 'Search by location, property type, or features...',
                prefixIcon: Icon(Icons.search, color: Theme.of(context).colorScheme.primary),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: Icon(Icons.clear, color: Theme.of(context).colorScheme.onSurfaceVariant),
                        onPressed: () {
                          _searchController.clear();
                          _onSearchChanged('');
                        },
                      )
                    : null,
                border: InputBorder.none,
                contentPadding: const EdgeInsets.all(16),
              ),
            ),
          ),
          if (_showSearchResults) ...[
            const SizedBox(height: 16),
            Container(
              constraints: const BoxConstraints(maxHeight: 300),
              child: ListView.builder(
                shrinkWrap: true,
                itemCount: _searchResults.length,
                itemBuilder: (context, index) {
                  final property = _searchResults[index];
                  return _buildSearchResultCard(property);
                },
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildQuickActions() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
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
                child: _buildActionCard(
                  Icons.home,
                  'Buy',
                  'Find properties to buy',
                  Theme.of(context).colorScheme.primary,
                  () => _filterProperties('Buy'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildActionCard(
                  Icons.key,
                  'Rent',
                  'Find rental properties',
                  Theme.of(context).colorScheme.secondary,
                  () => _filterProperties('Rent'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildActionCard(
                  Icons.sell,
                  'Sell',
                  'List your property',
                  Theme.of(context).colorScheme.tertiary,
                  () => _filterProperties('Sell'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildActionCard(
                  Icons.business,
                  'Commercial',
                  'Commercial properties',
                  Theme.of(context).colorScheme.error,
                  () => _filterProperties('Commercial'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildActionCard(IconData icon, String title, String subtitle, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 32),
            const SizedBox(height: 12),
            Text(
              title,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: color.withOpacity(0.8),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMarketStats() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Market Overview',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Theme.of(context).colorScheme.primaryContainer,
                  Theme.of(context).colorScheme.secondaryContainer,
                ],
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    Expanded(
                      child: _buildStatItem(
                        'Total Properties',
                        '${_marketStats['totalProperties']}',
                        Icons.home,
                      ),
                    ),
                    Expanded(
                      child: _buildStatItem(
                        'Avg Price',
                        '\$${(_marketStats['avgPrice'] / 1000000).toStringAsFixed(1)}M',
                        Icons.attach_money,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                Row(
                  children: [
                    Expanded(
                      child: _buildStatItem(
                        'Days on Market',
                        '${_marketStats['avgDaysOnMarket']}',
                        Icons.schedule,
                      ),
                    ),
                    Expanded(
                      child: _buildStatItem(
                        'Price Change',
                        '${_marketStats['priceChange']}%',
                        _marketStats['marketTrend'] == 'up' ? Icons.trending_up : Icons.trending_down,
                        color: _marketStats['marketTrend'] == 'up' ? Colors.green : Colors.red,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon, {Color? color}) {
    return Column(
      children: [
        Icon(
          icon,
          color: color ?? Theme.of(context).colorScheme.primary,
          size: 32,
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.bold,
            color: color ?? Theme.of(context).colorScheme.primary,
          ),
        ),
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildFeaturedProperties() {
    return Padding(
      padding: const EdgeInsets.all(16),
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
                onPressed: () {
                  // Navigate to all featured properties
                },
                child: const Text('View All'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 280,
            child: CarouselSlider.builder(
              itemCount: _featuredProperties.length,
              itemBuilder: (context, index, realIndex) {
                return _buildFeaturedPropertyCard(_featuredProperties[index]);
              },
              options: CarouselOptions(
                height: 280,
                viewportFraction: 0.85,
                enableInfiniteScroll: true,
                autoPlay: true,
                autoPlayInterval: const Duration(seconds: 4),
                autoPlayCurve: Curves.easeInOut,
                autoPlayAnimationDuration: const Duration(milliseconds: 800),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeaturedPropertyCard(Map<String, dynamic> property) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 4),
      child: Card(
        elevation: 8,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
              child: Stack(
                children: [
                  CachedNetworkImage(
                    imageUrl: property['image'],
                    height: 160,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Shimmer.fromColors(
                      baseColor: Colors.grey[300]!,
                      highlightColor: Colors.grey[100]!,
                      child: Container(color: Colors.white),
                    ),
                  ),
                  Positioned(
                    top: 12,
                    left: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.primary,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        property['type'],
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                  if (property['featured'])
                    Positioned(
                      top: 12,
                      right: 12,
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.amber,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Icon(
                          Icons.star,
                          color: Colors.white,
                          size: 16,
                        ),
                      ),
                    ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    property['title'],
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    property['location'],
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(Icons.bed, size: 16, color: Theme.of(context).colorScheme.primary),
                      Text(' ${property['bedrooms']}'),
                      const SizedBox(width: 16),
                      Icon(Icons.bathtub_outlined, size: 16, color: Theme.of(context).colorScheme.primary),
                      Text(' ${property['bathrooms']}'),
                      const SizedBox(width: 16),
                      Icon(Icons.square_foot, size: 16, color: Theme.of(context).colorScheme.primary),
                      Text(' ${property['area']}'),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        property['type'] == 'Rent' || property['type'] == 'Commercial'
                            ? '\$${property['price']}/month'
                            : '\$${(property['price'] / 1000).toStringAsFixed(0)}K',
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          color: Theme.of(context).colorScheme.primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Row(
                        children: [
                          Icon(Icons.star, color: Colors.amber, size: 16),
                          Text(' ${property['rating']}'),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentProperties() {
    return Padding(
      padding: const EdgeInsets.all(16),
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
                onPressed: () {
                  // Navigate to all properties
                },
                child: const Text('View All'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ..._recentProperties.map((property) => _buildRecentPropertyCard(property)),
        ],
      ),
    );
  }

  Widget _buildRecentPropertyCard(Map<String, dynamic> property) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: CachedNetworkImage(
                  imageUrl: property['image'],
                  width: 80,
                  height: 80,
                  fit: BoxFit.cover,
                  placeholder: (context, url) => Shimmer.fromColors(
                    baseColor: Colors.grey[300]!,
                    highlightColor: Colors.grey[100]!,
                    child: Container(color: Colors.white),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      property['title'],
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      property['location'],
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Icon(Icons.bed, size: 16, color: Theme.of(context).colorScheme.primary),
                        Text(' ${property['bedrooms']}'),
                        const SizedBox(width: 16),
                        Icon(Icons.bathtub_outlined, size: 16, color: Theme.of(context).colorScheme.primary),
                        Text(' ${property['bathrooms']}'),
                        const SizedBox(width: 16),
                        Icon(Icons.square_foot, size: 16, color: Theme.of(context).colorScheme.primary),
                        Text(' ${property['area']}'),
                      ],
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    property['type'] == 'Rent' || property['type'] == 'Commercial'
                        ? '\$${property['price']}/month'
                        : '\$${(property['price'] / 1000).toStringAsFixed(0)}K',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      color: Theme.of(context).colorScheme.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(Icons.star, color: Colors.amber, size: 16),
                      Text(' ${property['rating']}'),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSearchResultCard(Map<String, dynamic> property) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: CachedNetworkImage(
            imageUrl: property['image'],
            width: 60,
            height: 60,
            fit: BoxFit.cover,
          ),
        ),
        title: Text(property['title']),
        subtitle: Text(property['location']),
        trailing: Text(
          property['type'] == 'Rent' || property['type'] == 'Commercial'
              ? '\$${property['price']}/month'
              : '\$${(property['price'] / 1000).toStringAsFixed(0)}K',
          style: TextStyle(
            color: Theme.of(context).colorScheme.primary,
            fontWeight: FontWeight.bold,
          ),
        ),
        onTap: () {
          // Navigate to property detail
        },
      ),
    );
  }
}

// Custom painter for background pattern
class BackgroundPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withOpacity(0.1)
      ..strokeWidth = 1;

    // Draw diagonal lines
    for (int i = 0; i < size.width + size.height; i += 20) {
      canvas.drawLine(
        Offset(i.toDouble(), 0),
        Offset(0, i.toDouble()),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}