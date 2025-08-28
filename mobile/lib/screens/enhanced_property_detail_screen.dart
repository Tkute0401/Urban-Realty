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
          Text(
            'Description',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            _property['description'],
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          const SizedBox(height: 24),
          Text(
            'Property Details',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          _buildDetailRow('Property Type', _property['propertyType']),
          _buildDetailRow('Year Built', _property['yearBuilt'].toString()),
          _buildDetailRow('Floor', '${_property['floor']} of ${_property['totalFloors']}'),
          _buildDetailRow('Parking Spaces', '${_property['parkingSpaces']} spaces'),
          _buildDetailRow('Furnished', _property['furnished'] ? 'Yes' : 'No'),
          _buildDetailRow('Energy Rating', _property['energyRating']),
          const SizedBox(height: 24),
          Text(
            'Amenities',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _property['amenities'].map<Widget>((amenity) {
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.primaryContainer,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  amenity,
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onPrimaryContainer,
                    fontSize: 12,
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
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
          Text(
            'Market Analysis',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          _buildMarketCard('Price per Sq Ft', '\$${marketData['pricePerSqFt']}'),
          _buildMarketCard('Days on Market', '${marketData['avgDaysOnMarket']} days'),
          const SizedBox(height: 24),
          Text(
            'Price History',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 200,
            child: LineChart(
              LineChartData(
                gridData: FlGridData(show: false),
                titlesData: FlTitlesData(show: false),
                borderData: FlBorderData(show: false),
                lineBarsData: [
                  LineChartBarData(
                    spots: marketData['priceHistory'].asMap().entries.map((entry) {
                      return FlSpot(entry.key.toDouble(), entry.value['price'] / 1000000);
                    }).toList(),
                    isCurved: true,
                    color: Theme.of(context).colorScheme.primary,
                    barWidth: 3,
                    dotData: FlDotData(show: true),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'Comparable Properties',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          ...marketData['comparableProperties'].map<Widget>((comp) => 
            _buildComparableProperty(comp)
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
          Text(
            'Neighborhood Insights',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(child: _buildScoreCard('Walk Score', '${neighborhood['walkScore']}', Icons.directions_walk)),
              const SizedBox(width: 12),
              Expanded(child: _buildScoreCard('Transit Score', '${neighborhood['transitScore']}', Icons.directions_bus)),
              const SizedBox(width: 12),
              Expanded(child: _buildScoreCard('Bike Score', '${neighborhood['bikeScore']}', Icons.directions_bike)),
            ],
          ),
          const SizedBox(height: 24),
          _buildNeighborhoodCard('Crime Rate', neighborhood['crimeRate'], Icons.security),
          _buildNeighborhoodCard('Restaurants', '${neighborhood['restaurants']} nearby', Icons.restaurant),
          _buildNeighborhoodCard('Shopping', '${neighborhood['shopping']} options', Icons.shopping_bag),
          _buildNeighborhoodCard('Entertainment', '${neighborhood['entertainment']} venues', Icons.movie),
          const SizedBox(height: 24),
          Text(
            'Nearby Schools',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          ...neighborhood['schools'].map<Widget>((school) => 
            _buildSchoolCard(school)
          ),
        ],
      ),
    );
  }

  Widget _buildContactTab() {
    final agent = _property['agent'];
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Contact Agent',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 30,
                    backgroundImage: CachedNetworkImageProvider(agent['avatar']),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          agent['name'],
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Real Estate Agent • ${agent['experience']} experience',
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.onSurfaceVariant,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Icon(Icons.star, color: Colors.amber, size: 16),
                            Text(' ${agent['rating']} (${agent['reviews']} reviews)'),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: agent['specializations'].map<Widget>((spec) {
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.secondaryContainer,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  spec,
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onSecondaryContainer,
                    fontSize: 12,
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 24),
          _buildContactButton(
            Icons.phone,
            'Call Agent',
            agent['phone'],
            _callAgent,
          ),
          const SizedBox(height: 8),
          _buildContactButton(
            Icons.email,
            'Email Agent',
            agent['email'],
            _emailAgent,
          ),
          const SizedBox(height: 8),
          _buildContactButton(
            Icons.message,
            'Send Message',
            'Open chat',
            _sendMessage,
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
          ),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }

  Widget _buildMarketCard(String title, String value) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(title, style: Theme.of(context).textTheme.titleMedium),
            Text(
              value,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                color: Theme.of(context).colorScheme.primary,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildComparableProperty(Map<String, dynamic> comp) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(Icons.home, color: Theme.of(context).colorScheme.primary),
        title: Text(comp['address']),
        subtitle: Text('${comp['sqft']} sq ft'),
        trailing: Text(
          NumberFormat.currency(symbol: '\$').format(comp['price']),
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
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