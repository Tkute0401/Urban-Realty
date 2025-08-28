import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shimmer/shimmer.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:intl/intl.dart';
import 'package:photo_view/photo_view.dart';
import 'package:photo_view/photo_view_gallery.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:share_plus/share_plus.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:lottie/lottie.dart';

class EnhancedPropertyDetailScreen extends StatefulWidget {
  final String id;
  final Map<String, dynamic>? propertyData;

  const EnhancedPropertyDetailScreen({
    super.key,
    required this.id,
    this.propertyData,
  });

  @override
  State<EnhancedPropertyDetailScreen> createState() => _EnhancedPropertyDetailScreenState();
}

class _EnhancedPropertyDetailScreenState extends State<EnhancedPropertyDetailScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;
  late PageController _imagePageController;
  late AnimationController _fadeController;
  late AnimationController _slideController;
  late AnimationController _scaleController;
  
  int _currentImageIndex = 0;
  bool _isFavorite = false;
  bool _isLoading = true;
  bool _showFullScreenGallery = false;
  bool _showMortgageCalculator = false;
  bool _showNeighborhoodInsights = false;
  
  // Mock property data - in real app, this would come from API
  late Map<String, dynamic> _property;
  late GoogleMapController _mapController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 6, vsync: this);
    _imagePageController = PageController();
    _fadeController = AnimationController(duration: const Duration(milliseconds: 800), vsync: this);
    _slideController = AnimationController(duration: const Duration(milliseconds: 600), vsync: this);
    _scaleController = AnimationController(duration: const Duration(milliseconds: 400), vsync: this);
    
    _loadPropertyData();
    
    // Start animations
    _fadeController.forward();
    _slideController.forward();
    _scaleController.forward();
  }

  void _loadPropertyData() {
    // Simulate API call
    Future.delayed(const Duration(seconds: 2), () {
      setState(() {
        _property = widget.propertyData ?? {
          'id': widget.id,
          'title': 'Modern Luxury Apartment with Smart Home Features',
          'price': 2500000,
          'location': 'Downtown Business District, San Francisco',
          'bedrooms': 3,
          'bathrooms': 2,
          'area': 1800,
          'description': 'This stunning modern apartment offers the perfect blend of luxury and comfort. Located in the heart of the city, it features high-end finishes, smart home technology, and breathtaking city views. The open-concept design maximizes space and natural light, while premium appliances and fixtures ensure a sophisticated lifestyle.',
          'images': [
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
            'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800',
            'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800',
            'https://images.unsplash.com/photo-1560448204-5c3a73e7c4b8?w=800',
            'https://images.unsplash.com/photo-1560448204-8c3b3fc33ddc?w=800',
            'https://images.unsplash.com/photo-1560448204-9c3b3fc33ddc?w=800',
          ],
          'amenities': [
            'Swimming Pool',
            'Gym & Fitness Center',
            'Underground Parking',
            '24/7 Security',
            'Rooftop Garden',
            'Private Balcony',
            'Smart Home System',
            'Air Conditioning',
            'Central Heating',
            'High-Speed Internet',
            'Concierge Service',
            'Pet Friendly',
          ],
          'latitude': 37.7749,
          'longitude': -122.4194,
          'agent': {
            'name': 'Sarah Johnson',
            'phone': '+1-555-0123',
            'email': 'sarah.johnson@squarefoot.com',
            'avatar': 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200',
            'rating': 4.8,
            'reviews': 127,
            'experience': '8 years',
            'specializations': ['Luxury Properties', 'Smart Homes', 'Downtown Real Estate'],
          },
          'propertyType': 'Luxury Apartment',
          'yearBuilt': 2020,
          'parkingSpaces': 2,
          'furnished': true,
          'energyRating': 'A+',
          'floor': 15,
          'totalFloors': 25,
          'virtualTour': 'https://example.com/virtual-tour',
          '3dModel': 'https://example.com/3d-model',
          'neighborhood': {
            'walkScore': 95,
            'transitScore': 88,
            'bikeScore': 92,
            'crimeRate': 'Low',
            'schools': [
              {'name': 'Downtown Elementary', 'rating': 9.2, 'distance': '0.3 mi'},
              {'name': 'City High School', 'rating': 8.8, 'distance': '0.8 mi'},
            ],
            'restaurants': 45,
            'shopping': 23,
            'entertainment': 18,
          },
          'marketData': {
            'pricePerSqFt': 1389,
            'avgDaysOnMarket': 12,
            'priceHistory': [
              {'date': '2024-01', 'price': 2400000},
              {'date': '2024-02', 'price': 2450000},
              {'date': '2024-03', 'price': 2500000},
            ],
            'comparableProperties': [
              {'address': '123 Main St', 'price': 2450000, 'sqft': 1750},
              {'address': '456 Oak Ave', 'price': 2550000, 'sqft': 1850},
              {'address': '789 Pine St', 'price': 2480000, 'sqft': 1800},
            ],
          },
        };
        _isLoading = false;
      });
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    _imagePageController.dispose();
    _fadeController.dispose();
    _slideController.dispose();
    _scaleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return _buildLoadingScreen();
    }

    return Scaffold(
      body: CustomScrollView(
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
                    _buildPropertyInfo(),
                    _buildQuickActions(),
                    _buildTabBar(),
                    _buildTabBarView(),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomBar(),
    );
  }

  Widget _buildLoadingScreen() {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Shimmer.fromColors(
        baseColor: Colors.grey[300]!,
        highlightColor: Colors.grey[100]!,
        child: Column(
          children: [
            Container(height: 300, color: Colors.white),
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
      expandedHeight: 350,
      pinned: true,
      backgroundColor: Theme.of(context).colorScheme.surface,
      leading: IconButton(
        icon: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.black.withOpacity(0.3),
            borderRadius: BorderRadius.circular(20),
          ),
          child: const Icon(Icons.arrow_back, color: Colors.white),
        ),
        onPressed: () => Navigator.pop(context),
      ),
      actions: [
        IconButton(
          icon: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.3),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Icon(
              _isFavorite ? Icons.favorite : Icons.favorite_border,
              color: _isFavorite ? Colors.red : Colors.white,
            ),
          ),
          onPressed: () {
            setState(() {
              _isFavorite = !_isFavorite;
            });
            _scaleController.forward(from: 0.0);
          },
        ),
        IconButton(
          icon: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.3),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Icon(Icons.share, color: Colors.white),
          ),
          onPressed: _shareProperty,
        ),
        IconButton(
          icon: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.3),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Icon(Icons.qr_code, color: Colors.white),
          ),
          onPressed: _showQRCode,
        ),
      ],
      flexibleSpace: FlexibleSpaceBar(
        background: Stack(
          children: [
            CarouselSlider(
              options: CarouselOptions(
                height: 350,
                viewportFraction: 1.0,
                enableInfiniteScroll: true,
                autoPlay: true,
                autoPlayInterval: const Duration(seconds: 5),
                onPageChanged: (index, reason) {
                  setState(() {
                    _currentImageIndex = index;
                  });
                },
              ),
              items: _property['images'].map<Widget>((imageUrl) {
                return GestureDetector(
                  onTap: () => _openFullScreenGallery(),
                  child: CachedNetworkImage(
                    imageUrl: imageUrl,
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Shimmer.fromColors(
                      baseColor: Colors.grey[300]!,
                      highlightColor: Colors.grey[100]!,
                      child: Container(color: Colors.white),
                    ),
                    errorWidget: (context, url, error) => Container(
                      color: Colors.grey[300],
                      child: const Icon(Icons.error),
                    ),
                  ),
                );
              }).toList(),
            ),
            // Image counter
            Positioned(
              top: 16,
              right: 16,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.6),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  '${_currentImageIndex + 1}/${_property['images'].length}',
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
                ),
              ),
            ),
            // Page indicators
            Positioned(
              bottom: 16,
              left: 0,
              right: 0,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  _property['images'].length,
                  (index) => AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    width: _currentImageIndex == index ? 24 : 8,
                    height: 8,
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(4),
                      color: _currentImageIndex == index
                          ? Theme.of(context).colorScheme.primary
                          : Colors.white.withOpacity(0.5),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPropertyInfo() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  _property['title'],
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.primaryContainer,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  _property['propertyType'],
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onPrimaryContainer,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Icon(Icons.location_on, size: 16, color: Theme.of(context).colorScheme.primary),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  _property['location'],
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Text(
                NumberFormat.currency(symbol: '\$').format(_property['price']),
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  color: Theme.of(context).colorScheme.primary,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const Spacer(),
              _buildPropertyFeature(Icons.bed, '${_property['bedrooms']} Beds'),
              const SizedBox(width: 16),
              _buildPropertyFeature(Icons.bathtub_outlined, '${_property['bathrooms']} Baths'),
              const SizedBox(width: 16),
              _buildPropertyFeature(Icons.square_foot, '${_property['area']} sq ft'),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              _buildPropertyFeature(Icons.apartment, 'Floor ${_property['floor']}'),
              const SizedBox(width: 16),
              _buildPropertyFeature(Icons.eco, _property['energyRating']),
              const SizedBox(width: 16),
              _buildPropertyFeature(Icons.parking, '${_property['parkingSpaces']} spaces'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          Expanded(
            child: _buildActionButton(
              Icons.view_in_ar,
              '3D Tour',
              _open3DTour,
              Theme.of(context).colorScheme.primary,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: _buildActionButton(
              Icons.video_camera_front,
              'VR Walk',
              _openVRWalkthrough,
              Theme.of(context).colorScheme.secondary,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: _buildActionButton(
              Icons.calculate,
              'Mortgage',
              _toggleMortgageCalculator,
              Theme.of(context).colorScheme.tertiary,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: _buildActionButton(
              Icons.analytics,
              'Insights',
              _toggleNeighborhoodInsights,
              Theme.of(context).colorScheme.error,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(IconData icon, String label, VoidCallback onTap, Color color) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                color: color,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPropertyFeature(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 20, color: Theme.of(context).colorScheme.onSurfaceVariant),
        const SizedBox(width: 4),
        Text(
          text,
          style: TextStyle(
            color: Theme.of(context).colorScheme.onSurfaceVariant,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildTabBar() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceVariant,
        borderRadius: BorderRadius.circular(12),
      ),
      child: TabBar(
        controller: _tabController,
        indicator: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          color: Theme.of(context).colorScheme.primary,
        ),
        labelColor: Theme.of(context).colorScheme.onPrimary,
        unselectedLabelColor: Theme.of(context).colorScheme.onSurfaceVariant,
        isScrollable: true,
        tabs: const [
          Tab(text: 'Overview'),
          Tab(text: 'Photos'),
          Tab(text: 'Location'),
          Tab(text: 'Market'),
          Tab(text: 'Neighborhood'),
          Tab(text: 'Contact'),
        ],
      ),
    );
  }

  Widget _buildTabBarView() {
    return SizedBox(
      height: 500,
      child: TabBarView(
        controller: _tabController,
        children: [
          _buildOverviewTab(),
          _buildPhotosTab(),
          _buildLocationTab(),
          _buildMarketTab(),
          _buildNeighborhoodTab(),
          _buildContactTab(),
        ],
      ),
    );
  }

  Widget _buildOverviewTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Description Section
          _buildSectionHeader('Description', Icons.description),
          const SizedBox(height: 12),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surfaceVariant,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              _property['description'],
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                height: 1.6,
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Property Details Section
          _buildSectionHeader('Property Details', Icons.home),
          const SizedBox(height: 12),
          _buildPropertyDetailsGrid(),
          const SizedBox(height: 24),

          // Key Features Section
          _buildSectionHeader('Key Features', Icons.star),
          const SizedBox(height: 12),
          _buildKeyFeaturesGrid(),
          const SizedBox(height: 24),

          // Amenities Section
          _buildSectionHeader('Amenities', Icons.amenities),
          const SizedBox(height: 12),
          _buildAmenitiesGrid(),
          const SizedBox(height: 24),

          // Additional Information Section
          _buildSectionHeader('Additional Information', Icons.info),
          const SizedBox(height: 12),
          _buildAdditionalInfoGrid(),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, IconData icon) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.primaryContainer,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            icon,
            color: Theme.of(context).colorScheme.primary,
            size: 20,
          ),
        ),
        const SizedBox(width: 12),
        Text(
          title,
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildPropertyDetailsGrid() {
    final details = [
      {'label': 'Property Type', 'value': _property['propertyType'], 'icon': Icons.home},
      {'label': 'Year Built', 'value': '${_property['yearBuilt']}', 'icon': Icons.calendar_today},
      {'label': 'Floor', 'value': '${_property['floor']} of ${_property['totalFloors']}', 'icon': Icons.apartment},
      {'label': 'Area', 'value': '${_property['area']} sq ft', 'icon': Icons.square_foot},
      {'label': 'Bedrooms', 'value': '${_property['bedrooms']}', 'icon': Icons.bed},
      {'label': 'Bathrooms', 'value': '${_property['bathrooms']}', 'icon': Icons.bathtub_outlined},
      {'label': 'Parking', 'value': '${_property['parkingSpaces']} spaces', 'icon': Icons.local_parking},
      {'label': 'Furnished', 'value': _property['furnished'] ? 'Yes' : 'No', 'icon': Icons.chair},
      {'label': 'Energy Rating', 'value': _property['energyRating'], 'icon': Icons.eco},
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 2.5,
      ),
      itemCount: details.length,
      itemBuilder: (context, index) {
        final detail = details[index];
        return _buildDetailCard(detail['label']!, detail['value']!, detail['icon']!);
      },
    );
  }

  Widget _buildDetailCard(String label, String value, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Theme.of(context).colorScheme.outlineVariant,
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              Icon(
                icon,
                color: Theme.of(context).colorScheme.primary,
                size: 20,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  label,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                    fontWeight: FontWeight.w500,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: Theme.of(context).colorScheme.onSurface,
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildKeyFeaturesGrid() {
    final features = [
      {'label': 'Smart Home System', 'icon': Icons.smart_home, 'available': true},
      {'label': 'Balcony', 'icon': Icons.balcony, 'available': true},
      {'label': 'Garden View', 'icon': Icons.garden, 'available': true},
      {'label': 'City View', 'icon': Icons.location_city, 'available': true},
      {'label': 'High Ceilings', 'icon': Icons.height, 'available': false},
      {'label': 'Fireplace', 'icon': Icons.local_fire_department, 'available': false},
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 2.2,
      ),
      itemCount: features.length,
      itemBuilder: (context, index) {
        final feature = features[index];
        return _buildFeatureCard(
          feature['label']!,
          feature['icon']!,
          feature['available']!,
        );
      },
    );
  }

  Widget _buildFeatureCard(String label, IconData icon, bool available) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: available 
            ? Theme.of(context).colorScheme.primaryContainer.withOpacity(0.3)
            : Theme.of(context).colorScheme.surfaceVariant,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: available 
              ? Theme.of(context).colorScheme.primary.withOpacity(0.3)
              : Theme.of(context).colorScheme.outlineVariant,
          width: 1,
        ),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: available 
                ? Theme.of(context).colorScheme.primary
                : Theme.of(context).colorScheme.onSurfaceVariant,
            size: 32,
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w600,
              color: available 
                  ? Theme.of(context).colorScheme.onSurface
                  : Theme.of(context).colorScheme.onSurfaceVariant,
            ),
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: available 
                  ? Theme.of(context).colorScheme.primary
                  : Theme.of(context).colorScheme.surfaceVariant,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              available ? 'Available' : 'Not Available',
              style: TextStyle(
                color: available 
                    ? Theme.of(context).colorScheme.onPrimary
                    : Theme.of(context).colorScheme.onSurfaceVariant,
                fontSize: 10,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAmenitiesGrid() {
    final amenities = _property['amenities'] as List<String>;
    
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 3.5,
      ),
      itemCount: amenities.length,
      itemBuilder: (context, index) {
        final amenity = amenities[index];
        return _buildAmenityCard(amenity);
      },
    );
  }

  Widget _buildAmenityCard(String amenity) {
    final amenityIcons = {
      'Swimming Pool': Icons.pool,
      'Gym & Fitness Center': Icons.fitness_center,
      'Underground Parking': Icons.local_parking,
      '24/7 Security': Icons.security,
      'Rooftop Garden': Icons.garden,
      'Private Balcony': Icons.balcony,
      'Smart Home System': Icons.smart_home,
      'Air Conditioning': Icons.ac_unit,
      'Central Heating': Icons.thermostat,
      'High-Speed Internet': Icons.wifi,
      'Concierge Service': Icons.concierge,
      'Pet Friendly': Icons.pets,
    };

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Theme.of(context).colorScheme.outlineVariant,
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primaryContainer,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              amenityIcons[amenity] ?? Icons.check_circle,
              color: Theme.of(context).colorScheme.primary,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              amenity,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.w500,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAdditionalInfoGrid() {
    final additionalInfo = [
      {'label': 'Property ID', 'value': _property['id'], 'icon': Icons.tag},
      {'label': 'Listed Date', 'value': 'December 2024', 'icon': Icons.schedule},
      {'label': 'Last Updated', 'value': 'Today', 'icon': Icons.update},
      {'label': 'Property Status', 'value': 'Active', 'icon': Icons.status},
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 2.5,
      ),
      itemCount: additionalInfo.length,
      itemBuilder: (context, index) {
        final info = additionalInfo[index];
        return _buildDetailCard(info['label']!, info['value']!, info['icon']!);
      },
    );
  }

  Widget _buildPhotosTab() {
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 8,
        mainAxisSpacing: 8,
      ),
      itemCount: _property['images'].length,
      itemBuilder: (context, index) {
        return GestureDetector(
          onTap: () => _openFullScreenGallery(initialIndex: index),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: CachedNetworkImage(
              imageUrl: _property['images'][index],
              fit: BoxFit.cover,
              placeholder: (context, url) => Shimmer.fromColors(
                baseColor: Colors.grey[300]!,
                highlightColor: Colors.grey[100]!,
                child: Container(color: Colors.white),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildLocationTab() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Location',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            _property['location'],
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          const SizedBox(height: 16),
          Container(
            height: 200,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              color: Theme.of(context).colorScheme.surfaceVariant,
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: GoogleMap(
                initialCameraPosition: CameraPosition(
                  target: LatLng(_property['latitude'], _property['longitude']),
                  zoom: 15,
                ),
                onMapCreated: (GoogleMapController controller) {
                  _mapController = controller;
                },
                markers: {
                  Marker(
                    markerId: MarkerId(_property['id']),
                    position: LatLng(_property['latitude'], _property['longitude']),
                    infoWindow: InfoWindow(
                      title: _property['title'],
                      snippet: _property['location'],
                    ),
                  ),
                },
              ),
            ),
          ),
          const SizedBox(height: 16),
          ElevatedButton.icon(
            onPressed: _openInMaps,
            icon: const Icon(Icons.directions),
            label: const Text('Get Directions'),
            style: ElevatedButton.styleFrom(
              minimumSize: const Size(double.infinity, 48),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMarketTab() {
    final marketData = _property['marketData'];
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Market Overview Section
          _buildSectionHeader('Market Overview', Icons.analytics),
          const SizedBox(height: 12),
          _buildMarketOverviewGrid(marketData),
          const SizedBox(height: 24),

          // Price History Section
          _buildSectionHeader('Price History', Icons.trending_up),
          const SizedBox(height: 12),
          _buildPriceHistoryChart(marketData),
          const SizedBox(height: 24),

          // Comparable Properties Section
          _buildSectionHeader('Comparable Properties', Icons.compare),
          const SizedBox(height: 12),
          _buildComparablePropertiesList(marketData),
          const SizedBox(height: 24),

          // Market Insights Section
          _buildSectionHeader('Market Insights', Icons.lightbulb),
          const SizedBox(height: 12),
          _buildMarketInsightsGrid(marketData),
        ],
      ),
    );
  }

  Widget _buildMarketOverviewGrid(Map<String, dynamic> marketData) {
    final overviewData = [
      {
        'label': 'Price per Sq Ft',
        'value': '\$${marketData['pricePerSqFt']}',
        'icon': Icons.attach_money,
        'color': Theme.of(context).colorScheme.primary,
      },
      {
        'label': 'Days on Market',
        'value': '${marketData['avgDaysOnMarket']} days',
        'icon': Icons.schedule,
        'color': Theme.of(context).colorScheme.secondary,
      },
      {
        'label': 'Market Trend',
        'value': 'Rising',
        'icon': Icons.trending_up,
        'color': Colors.green,
      },
      {
        'label': 'Property Value',
        'value': '\$${(marketData['pricePerSqFt'] * _property['area'] / 1000000).toStringAsFixed(1)}M',
        'icon': Icons.home,
        'color': Theme.of(context).colorScheme.tertiary,
      },
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 2.2,
      ),
      itemCount: overviewData.length,
      itemBuilder: (context, index) {
        final data = overviewData[index];
        return _buildMarketOverviewCard(
          data['label']!,
          data['value']!,
          data['icon']!,
          data['color']!,
        );
      },
    );
  }

  Widget _buildMarketOverviewCard(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: color.withOpacity(0.3),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: color,
            size: 32,
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
              color: color,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: color.withOpacity(0.8),
              fontWeight: FontWeight.w600,
            ),
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildPriceHistoryChart(Map<String, dynamic> marketData) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Theme.of(context).colorScheme.outlineVariant,
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Price Trend (Last 3 Months)',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.green.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.trending_up,
                      color: Colors.green,
                      size: 16,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '+5.2%',
                      style: TextStyle(
                        color: Colors.green,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 200,
            child: LineChart(
              LineChartData(
                gridData: FlGridData(
                  show: true,
                  drawVerticalLine: false,
                  horizontalInterval: 0.5,
                  getDrawingHorizontalLine: (value) {
                    return FlLine(
                      color: Theme.of(context).colorScheme.outlineVariant.withOpacity(0.3),
                      strokeWidth: 1,
                    );
                  },
                ),
                titlesData: FlTitlesData(
                  show: true,
                  rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      reservedSize: 30,
                      interval: 1,
                      getTitlesWidget: (value, meta) {
                        const months = ['Jan', 'Feb', 'Mar'];
                        if (value.toInt() < months.length) {
                          return Text(
                            months[value.toInt()],
                            style: TextStyle(
                              color: Theme.of(context).colorScheme.onSurfaceVariant,
                              fontSize: 12,
                            ),
                          );
                        }
                        return const Text('');
                      },
                    ),
                  ),
                  leftTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      interval: 0.5,
                      reservedSize: 50,
                      getTitlesWidget: (value, meta) {
                        return Text(
                          '\$${value.toStringAsFixed(1)}M',
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.onSurfaceVariant,
                            fontSize: 10,
                          ),
                        );
                      },
                    ),
                  ),
                ),
                borderData: FlBorderData(show: false),
                minX: 0,
                maxX: 2,
                minY: 2.0,
                maxY: 2.6,
                lineBarsData: [
                  LineChartBarData(
                    spots: marketData['priceHistory'].asMap().entries.map((entry) {
                      return FlSpot(entry.key.toDouble(), entry.value['price'] / 1000000);
                    }).toList(),
                    isCurved: true,
                    color: Theme.of(context).colorScheme.primary,
                    barWidth: 4,
                    dotData: FlDotData(
                      show: true,
                      getDotPainter: (spot, percent, barData, index) {
                        return FlDotCirclePainter(
                          radius: 6,
                          color: Theme.of(context).colorScheme.primary,
                          strokeWidth: 3,
                          strokeColor: Colors.white,
                        );
                      },
                    ),
                    belowBarData: BarAreaData(
                      show: true,
                      color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildComparablePropertiesList(Map<String, dynamic> marketData) {
    return Column(
      children: marketData['comparableProperties'].map<Widget>((comp) {
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: Theme.of(context).colorScheme.outlineVariant,
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 8,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.primaryContainer,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  Icons.home,
                  color: Theme.of(context).colorScheme.primary,
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      comp['address'],
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(
                          Icons.square_foot,
                          size: 16,
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          '${comp['sqft']} sq ft',
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: Theme.of(context).colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    NumberFormat.currency(symbol: '\$').format(comp['price']),
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.primaryContainer,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      '${((comp['price'] / comp['sqft']).round())} /sq ft',
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.onPrimaryContainer,
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildMarketInsightsGrid(Map<String, dynamic> marketData) {
    final insights = [
      {
        'label': 'Market Demand',
        'value': 'High',
        'icon': Icons.trending_up,
        'color': Colors.green,
        'description': 'Strong buyer interest in this area',
      },
      {
        'label': 'Price Stability',
        'value': 'Stable',
        'icon': Icons.balance,
        'color': Colors.blue,
        'description': 'Prices have remained consistent',
      },
      {
        'label': 'Investment Potential',
        'value': 'Excellent',
        'icon': Icons.investment,
        'color': Colors.orange,
        'description': 'High potential for value appreciation',
      },
      {
        'label': 'Market Competition',
        'value': 'Moderate',
        'icon': Icons.people,
        'color': Colors.purple,
        'description': 'Balanced supply and demand',
      },
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 1.8,
      ),
      itemCount: insights.length,
      itemBuilder: (context, index) {
        final insight = insights[index];
        return _buildMarketInsightCard(
          insight['label']!,
          insight['value']!,
          insight['icon']!,
          insight['color']!,
          insight['description']!,
        );
      },
    );
  }

  Widget _buildMarketInsightCard(String label, String value, IconData icon, Color color, String description) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: color.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                icon,
                color: color,
                size: 24,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  label,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: color.withOpacity(0.8),
                    fontWeight: FontWeight.w600,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            description,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: color.withOpacity(0.8),
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildNeighborhoodTab() {
    final neighborhood = _property['neighborhood'];
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Neighborhood Scores Section
          _buildSectionHeader('Neighborhood Scores', Icons.location_on),
          const SizedBox(height: 12),
          _buildNeighborhoodScoresGrid(neighborhood),
          const SizedBox(height: 24),

          // Local Amenities Section
          _buildSectionHeader('Local Amenities', Icons.local_activity),
          const SizedBox(height: 12),
          _buildLocalAmenitiesGrid(neighborhood),
          const SizedBox(height: 24),

          // Nearby Schools Section
          _buildSectionHeader('Nearby Schools', Icons.school),
          const SizedBox(height: 12),
          _buildNearbySchoolsList(neighborhood),
          const SizedBox(height: 24),

          // Safety & Community Section
          _buildSectionHeader('Safety & Community', Icons.security),
          const SizedBox(height: 12),
          _buildSafetyCommunityGrid(neighborhood),
        ],
      ),
    );
  }

  Widget _buildNeighborhoodScoresGrid(Map<String, dynamic> neighborhood) {
    final scores = [
      {
        'label': 'Walk Score',
        'score': neighborhood['walkScore'],
        'icon': Icons.directions_walk,
        'color': Colors.green,
        'description': 'Very Walkable',
      },
      {
        'label': 'Transit Score',
        'score': neighborhood['transitScore'],
        'icon': Icons.directions_bus,
        'color': Colors.blue,
        'description': 'Good Transit',
      },
      {
        'label': 'Bike Score',
        'score': neighborhood['bikeScore'],
        'icon': Icons.directions_bike,
        'color': Colors.orange,
        'description': 'Very Bikeable',
      },
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 1.2,
      ),
      itemCount: scores.length,
      itemBuilder: (context, index) {
        final score = scores[index];
        return _buildNeighborhoodScoreCard(
          score['label']!,
          score['score']!,
          score['icon']!,
          score['color']!,
          score['description']!,
        );
      },
    );
  }

  Widget _buildNeighborhoodScoreCard(String label, int score, IconData icon, Color color, String description) {
    final scoreColor = score >= 90 ? Colors.green : 
                      score >= 70 ? Colors.orange : 
                      score >= 50 ? Colors.yellow : Colors.red;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: color.withOpacity(0.3),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: color,
            size: 32,
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: scoreColor,
              shape: BoxShape.circle,
            ),
            child: Text(
              '$score',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: color.withOpacity(0.8),
              fontWeight: FontWeight.w600,
            ),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4),
          Text(
            description,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: color.withOpacity(0.8),
            ),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildLocalAmenitiesGrid(Map<String, dynamic> neighborhood) {
    final amenities = [
      {
        'label': 'Restaurants',
        'count': neighborhood['restaurants'],
        'icon': Icons.restaurant,
        'color': Colors.red,
        'description': 'Dining options',
      },
      {
        'label': 'Shopping',
        'count': neighborhood['shopping'],
        'icon': Icons.shopping_bag,
        'color': Colors.purple,
        'description': 'Retail stores',
      },
      {
        'label': 'Entertainment',
        'count': neighborhood['entertainment'],
        'icon': Icons.movie,
        'color': Colors.blue,
        'description': 'Fun activities',
      },
      {
        'label': 'Parks',
        'count': 8,
        'icon': Icons.park,
        'color': Colors.green,
        'description': 'Green spaces',
      },
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 2.2,
      ),
      itemCount: amenities.length,
      itemBuilder: (context, index) {
        final amenity = amenities[index];
        return _buildLocalAmenityCard(
          amenity['label']!,
          amenity['count']!,
          amenity['icon']!,
          amenity['color']!,
          amenity['description']!,
        );
      },
    );
  }

  Widget _buildLocalAmenityCard(String label, int count, IconData icon, Color color, String description) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: color.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              icon,
              color: Colors.white,
              size: 24,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '$count',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
              ),
              Text(
                'nearby',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: color.withOpacity(0.8),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildNearbySchoolsList(Map<String, dynamic> neighborhood) {
    return Column(
      children: neighborhood['schools'].map<Widget>((school) {
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: Theme.of(context).colorScheme.outlineVariant,
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 8,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.primaryContainer,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  Icons.school,
                  color: Theme.of(context).colorScheme.primary,
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      school['name'],
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(
                          Icons.location_on,
                          size: 16,
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          school['distance'],
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: Theme.of(context).colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: _getSchoolRatingColor(school['rating']),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      '${school['rating']}/10',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Rating',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Color _getSchoolRatingColor(double rating) {
    if (rating >= 9.0) return Colors.green;
    if (rating >= 8.0) return Colors.blue;
    if (rating >= 7.0) return Colors.orange;
    return Colors.red;
  }

  Widget _buildSafetyCommunityGrid(Map<String, dynamic> neighborhood) {
    final safetyData = [
      {
        'label': 'Crime Rate',
        'value': neighborhood['crimeRate'],
        'icon': Icons.security,
        'color': Colors.green,
        'description': 'Low crime area',
      },
      {
        'label': 'Community Rating',
        'value': '4.8/5',
        'icon': Icons.people,
        'color': Colors.blue,
        'description': 'Friendly neighborhood',
      },
      {
        'label': 'Noise Level',
        'value': 'Low',
        'icon': Icons.volume_down,
        'color': Colors.green,
        'description': 'Peaceful area',
      },
      {
        'label': 'Family Friendly',
        'value': 'Yes',
        'icon': Icons.family_restroom,
        'color': Colors.orange,
        'description': 'Great for families',
      },
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 2.2,
      ),
      itemCount: safetyData.length,
      itemBuilder: (context, index) {
        final data = safetyData[index];
        return _buildSafetyCommunityCard(
          data['label']!,
          data['value']!,
          data['icon']!,
          data['color']!,
          data['description']!,
        );
      },
    );
  }

  Widget _buildSafetyCommunityCard(String label, String value, IconData icon, Color color, String description) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: color.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                icon,
                color: color,
                size: 24,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  label,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: color.withOpacity(0.8),
                    fontWeight: FontWeight.w600,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            description,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: color.withOpacity(0.8),
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildContactTab() {
    final agent = _property['agent'];
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Agent Profile Section
          _buildSectionHeader('Agent Profile', Icons.person),
          const SizedBox(height: 12),
          _buildAgentProfileCard(agent),
          const SizedBox(height: 24),

          // Agent Specializations Section
          _buildSectionHeader('Specializations', Icons.star),
          const SizedBox(height: 12),
          _buildAgentSpecializationsGrid(agent),
          const SizedBox(height: 24),

          // Contact Methods Section
          _buildSectionHeader('Contact Methods', Icons.contact_phone),
          const SizedBox(height: 12),
          _buildContactMethodsList(agent),
          const SizedBox(height: 24),

          // Response Time Section
          _buildSectionHeader('Response Time', Icons.schedule),
          const SizedBox(height: 12),
          _buildResponseTimeGrid(),
        ],
      ),
    );
  }

  Widget _buildAgentProfileCard(Map<String, dynamic> agent) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Theme.of(context).colorScheme.outlineVariant,
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: Theme.of(context).colorScheme.primary,
                    width: 3,
                  ),
                ),
                child: ClipOval(
                  child: CachedNetworkImage(
                    imageUrl: agent['avatar'],
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Container(
                      color: Theme.of(context).colorScheme.surfaceVariant,
                      child: Icon(
                        Icons.person,
                        size: 40,
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      agent['name'],
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Real Estate Agent',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Icon(Icons.star, color: Colors.amber, size: 20),
                        const SizedBox(width: 4),
                        Text(
                          '${agent['rating']}',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          '(${agent['reviews']} reviews)',
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: Theme.of(context).colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Icon(
                          Icons.work,
                          color: Theme.of(context).colorScheme.primary,
                          size: 16,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          '${agent['experience']} experience',
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: Theme.of(context).colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primaryContainer.withOpacity(0.3),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.verified,
                  color: Theme.of(context).colorScheme.primary,
                  size: 24,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Verified Agent - Licensed and Insured',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAgentSpecializationsGrid(Map<String, dynamic> agent) {
    final specializations = agent['specializations'] as List<String>;
    
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 3.5,
      ),
      itemCount: specializations.length,
      itemBuilder: (context, index) {
        final specialization = specializations[index];
        return _buildSpecializationCard(specialization);
      },
    );
  }

  Widget _buildSpecializationCard(String specialization) {
    final specializationIcons = {
      'Luxury Properties': Icons.luxury,
      'Smart Homes': Icons.smart_home,
      'Downtown Real Estate': Icons.location_city,
      'Investment Properties': Icons.trending_up,
      'First-time Buyers': Icons.family,
      'International Clients': Icons.language,
    };

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Theme.of(context).colorScheme.outlineVariant,
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primaryContainer,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              specializationIcons[specialization] ?? Icons.star,
              color: Theme.of(context).colorScheme.primary,
              size: 24,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              specialization,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w600,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContactMethodsList(Map<String, dynamic> agent) {
    final contactMethods = [
      {
        'title': 'Call Agent',
        'subtitle': agent['phone'],
        'icon': Icons.phone,
        'color': Colors.green,
        'onTap': _callAgent,
      },
      {
        'title': 'Email Agent',
        'subtitle': agent['email'],
        'icon': Icons.email,
        'color': Colors.blue,
        'onTap': _emailAgent,
      },
      {
        'title': 'Send Message',
        'subtitle': 'Open chat conversation',
        'icon': Icons.message,
        'color': Colors.orange,
        'onTap': _sendMessage,
      },
      {
        'title': 'Schedule Meeting',
        'subtitle': 'Book a consultation',
        'icon': Icons.calendar_today,
        'color': Colors.purple,
        'onTap': _scheduleViewing,
      },
    ];

    return Column(
      children: contactMethods.map<Widget>((method) {
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          child: _buildContactMethodCard(
            method['title']!,
            method['subtitle']!,
            method['icon']!,
            method['color']!,
            method['onTap']!,
          ),
        );
      }).toList(),
    );
  }

  Widget _buildContactMethodCard(String title, String subtitle, IconData icon, Color color, VoidCallback onTap) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: color.withOpacity(0.3),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    icon,
                    color: color,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        subtitle,
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(
                  Icons.arrow_forward_ios,
                  color: color.withOpacity(0.6),
                  size: 20,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildResponseTimeGrid() {
    final responseData = [
      {
        'label': 'Phone Calls',
        'value': '< 5 min',
        'icon': Icons.phone,
        'color': Colors.green,
        'description': 'Quick response time',
      },
      {
        'label': 'Emails',
        'value': '< 2 hours',
        'icon': Icons.email,
        'color': Colors.blue,
        'description': 'Professional communication',
      },
      {
        'label': 'Messages',
        'value': '< 1 hour',
        'icon': Icons.message,
        'color': Colors.orange,
        'description': 'Fast chat responses',
      },
      {
        'label': 'Viewings',
        'value': '24 hours',
        'icon': Icons.calendar_today,
        'color': Colors.purple,
        'description': 'Flexible scheduling',
      },
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 2.2,
      ),
      itemCount: responseData.length,
      itemBuilder: (context, index) {
        final data = responseData[index];
        return _buildResponseTimeCard(
          data['label']!,
          data['value']!,
          data['icon']!,
          data['color']!,
          data['description']!,
        );
      },
    );
  }

  Widget _buildResponseTimeCard(String label, String value, IconData icon, Color color, String description) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: color.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                icon,
                color: color,
                size: 24,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  label,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: color.withOpacity(0.8),
                    fontWeight: FontWeight.w600,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            description,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: color.withOpacity(0.8),
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }







  Widget _buildScoreCard(String title, String score, IconData icon) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, color: Theme.of(context).colorScheme.primary, size: 32),
            const SizedBox(height: 8),
            Text(
              score,
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
                color: Theme.of(context).colorScheme.primary,
              ),
            ),
            Text(
              title,
              style: Theme.of(context).textTheme.bodySmall,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNeighborhoodCard(String title, String value, IconData icon) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(icon, color: Theme.of(context).colorScheme.primary),
        title: Text(title),
        subtitle: Text(value),
      ),
    );
  }

  Widget _buildSchoolCard(Map<String, dynamic> school) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(Icons.school, color: Theme.of(context).colorScheme.primary),
        title: Text(school['name']),
        subtitle: Text('${school['distance']} away'),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.primaryContainer,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            '${school['rating']}/10',
            style: TextStyle(
              color: Theme.of(context).colorScheme.onPrimaryContainer,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildContactButton(IconData icon, String title, String subtitle, VoidCallback onTap) {
    return Card(
      child: ListTile(
        leading: Icon(icon, color: Theme.of(context).colorScheme.primary),
        title: Text(title),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: onTap,
      ),
    );
  }

  Widget _buildBottomBar() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: ElevatedButton.icon(
                onPressed: _scheduleViewing,
                icon: const Icon(Icons.calendar_today),
                label: const Text('Schedule Viewing'),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 48),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: OutlinedButton.icon(
                onPressed: _makeOffer,
                icon: const Icon(Icons.attach_money),
                label: const Text('Make Offer'),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 48),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Enhanced functionality methods
  void _openFullScreenGallery({int initialIndex = 0}) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => FullScreenGallery(
          images: _property['images'],
          initialIndex: initialIndex,
        ),
      ),
    );
  }

  void _open3DTour() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('3D Property Tour'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Lottie.asset('assets/animations/3d-tour.json', height: 200),
            const SizedBox(height: 16),
            const Text('Experience this property in immersive 3D!'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _launchURL(_property['3dModel']);
            },
            child: const Text('Start Tour'),
          ),
        ],
      ),
    );
  }

  void _openVRWalkthrough() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('VR Walkthrough'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Lottie.asset('assets/animations/vr-walk.json', height: 200),
            const SizedBox(height: 16),
            const Text('Take a virtual reality tour of this property!'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _launchURL(_property['virtualTour']);
            },
            child: const Text('Start VR Tour'),
          ),
        ],
      ),
    );
  }

  void _toggleMortgageCalculator() {
    setState(() {
      _showMortgageCalculator = !_showMortgageCalculator;
    });
  }

  void _toggleNeighborhoodInsights() {
    setState(() {
      _showNeighborhoodInsights = !_showNeighborhoodInsights;
    });
  }

  void _showQRCode() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Property QR Code'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            QrImageView(
              data: 'https://squarefoot.com/property/${_property['id']}',
              version: QrVersions.auto,
              size: 200.0,
            ),
            const SizedBox(height: 16),
            const Text('Scan to view this property on your device'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  void _shareProperty() {
    Share.share(
      'Check out this amazing property: ${_property['title']} - ${_property['location']} for ${NumberFormat.currency(symbol: '\$').format(_property['price'])}',
      subject: 'Amazing Property Found!',
    );
  }

  void _openInMaps() async {
    final url = 'https://www.google.com/maps/search/?api=1&query=${_property['latitude']},${_property['longitude']}';
    await _launchURL(url);
  }

  void _callAgent() async {
    final url = 'tel:${_property['agent']['phone']}';
    await _launchURL(url);
  }

  void _emailAgent() async {
    final url = 'mailto:${_property['agent']['email']}?subject=Inquiry about ${_property['title']}';
    await _launchURL(url);
  }

  void _sendMessage() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Messaging functionality coming soon!')),
    );
  }

  void _scheduleViewing() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Schedule viewing functionality coming soon!')),
    );
  }

  void _makeOffer() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Make offer functionality coming soon!')),
    );
  }

  Future<void> _launchURL(String url) async {
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url));
    }
  }
}

// Full Screen Gallery Widget
class FullScreenGallery extends StatefulWidget {
  final List<String> images;
  final int initialIndex;

  const FullScreenGallery({
    super.key,
    required this.images,
    required this.initialIndex,
  });

  @override
  State<FullScreenGallery> createState() => _FullScreenGalleryState();
}

class _FullScreenGalleryState extends State<FullScreenGallery> {
  late PageController _pageController;
  late int _currentIndex;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _pageController = PageController(initialPage: widget.initialIndex);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          '${_currentIndex + 1}/${widget.images.length}',
          style: const TextStyle(color: Colors.white),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.share, color: Colors.white),
            onPressed: () {
              Share.share(widget.images[_currentIndex]);
            },
          ),
        ],
      ),
      body: PhotoViewGallery.builder(
        scrollPhysics: const BouncingScrollPhysics(),
        builder: (BuildContext context, int index) {
          return PhotoViewGalleryPageOptions(
            imageProvider: CachedNetworkImageProvider(widget.images[index]),
            initialScale: PhotoViewComputedScale.contained,
            minScale: PhotoViewComputedScale.contained * 0.8,
            maxScale: PhotoViewComputedScale.covered * 2.0,
          );
        },
        itemCount: widget.images.length,
        loadingBuilder: (context, event) => const Center(
          child: CircularProgressIndicator(color: Colors.white),
        ),
        pageController: _pageController,
        onPageChanged: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }
}