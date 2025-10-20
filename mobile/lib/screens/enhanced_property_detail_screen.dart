import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/property.dart';
import '../config/design_tokens.dart';

class EnhancedPropertyDetailScreen extends StatefulWidget {
  final Property property;

  const EnhancedPropertyDetailScreen({
    super.key,
    required this.property,
  });

  @override
  State<EnhancedPropertyDetailScreen> createState() => _EnhancedPropertyDetailScreenState();
}

class _EnhancedPropertyDetailScreenState extends State<EnhancedPropertyDetailScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;
  bool _isFavorite = false;
  int _currentImageIndex = 0;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // App Bar with Images
          _buildSliverAppBar(context),
          
          // Property Info
          SliverToBoxAdapter(
            child: _buildPropertyInfo(context),
          ),
          
          // Tab Bar
          SliverToBoxAdapter(
            child: _buildTabBar(context),
          ),
          
          // Tab Content
          SliverFillRemaining(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildOverviewTab(context),
                _buildAmenitiesTab(context),
                _buildLocationTab(context),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomBar(context),
    );
  }

  Widget _buildSliverAppBar(BuildContext context) {
    return SliverAppBar(
      expandedHeight: 300,
      pinned: true,
      flexibleSpace: FlexibleSpaceBar(
        background: Stack(
          fit: StackFit.expand,
          children: [
            // Image Carousel
            PageView.builder(
              onPageChanged: (index) {
                setState(() {
                  _currentImageIndex = index;
                });
              },
              itemCount: widget.property.images.length,
              itemBuilder: (context, index) {
                return CachedNetworkImage(
                  imageUrl: widget.property.images[index],
                  fit: BoxFit.cover,
                  placeholder: (context, url) => Container(
                    color: Colors.grey[300],
                    child: const Center(child: CircularProgressIndicator()),
                  ),
                  errorWidget: (context, url, error) => Container(
                    color: Colors.grey[300],
                    child: const Icon(Icons.home, size: 100),
                  ),
                );
              },
            ),
            
            // Gradient Overlay
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Colors.black.withOpacity(0.3),
                  ],
                ),
              ),
            ),
            
            // Image Indicators
            if (widget.property.images.length > 1)
              Positioned(
                bottom: 16,
                left: 0,
                right: 0,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(
                    widget.property.images.length,
                    (index) => Container(
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: _currentImageIndex == index
                            ? Colors.white
                            : Colors.white.withOpacity(0.5),
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
      actions: [
        IconButton(
          icon: Icon(
            _isFavorite ? Icons.favorite : Icons.favorite_border,
            color: _isFavorite ? Colors.red : Colors.white,
          ),
          onPressed: () {
            setState(() {
              _isFavorite = !_isFavorite;
            });
          },
        ),
        IconButton(
          icon: const Icon(Icons.share, color: Colors.white),
          onPressed: _shareProperty,
        ),
      ],
    );
  }

  Widget _buildPropertyInfo(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(DesignTokens.spacingM),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Price and Title
          Text(
            _formatPrice(widget.property.price, widget.property.currency),
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              fontWeight: DesignTokens.fontWeightBold,
              color: DesignTokens.primary,
            ),
          ),
          
          const SizedBox(height: DesignTokens.spacingS),
          
          Text(
            widget.property.title,
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: DesignTokens.fontWeightSemiBold,
            ),
          ),
          
          const SizedBox(height: DesignTokens.spacingS),
          
          // Location
          Row(
            children: [
              Icon(Icons.location_on, size: 20, color: Colors.grey[600]),
              const SizedBox(width: DesignTokens.spacingXS),
              Expanded(
                child: Text(
                  '${widget.property.location.address}, ${widget.property.location.neighborhood}, ${widget.property.location.city}',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: Colors.grey[600],
                  ),
                ),
              ),
            ],
          ),
          
          const SizedBox(height: DesignTokens.spacingM),
          
          // Property Details
          _buildPropertyDetails(context),
          
          const SizedBox(height: DesignTokens.spacingM),
          
          // Status and Type
          _buildStatusAndType(context),
        ],
      ),
    );
  }

  Widget _buildPropertyDetails(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(DesignTokens.spacingM),
      decoration: BoxDecoration(
        color: DesignTokens.primary.withOpacity(0.05),
        borderRadius: BorderRadius.circular(DesignTokens.radiusM),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildDetailItem(
            context,
            Icons.bed,
            '${widget.property.specifications.bedrooms}',
            'Bedrooms',
          ),
          _buildDetailItem(
            context,
            Icons.bathroom,
            '${widget.property.specifications.bathrooms}',
            'Bathrooms',
          ),
          _buildDetailItem(
            context,
            Icons.square_foot,
            '${widget.property.specifications.area.toInt()}',
            'Sq Ft',
          ),
          _buildDetailItem(
            context,
            Icons.local_parking,
            '${widget.property.specifications.parkingSpaces}',
            'Parking',
          ),
        ],
      ),
    );
  }

  Widget _buildDetailItem(BuildContext context, IconData icon, String value, String label) {
    return Column(
      children: [
        Icon(icon, size: 24, color: DesignTokens.primary),
        const SizedBox(height: DesignTokens.spacingXS),
        Text(
          value,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: DesignTokens.fontWeightBold,
            color: DesignTokens.primary,
          ),
        ),
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: Colors.grey[600],
          ),
        ),
      ],
    );
  }

  Widget _buildStatusAndType(BuildContext context) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.symmetric(
            horizontal: DesignTokens.spacingM,
            vertical: DesignTokens.spacingS,
          ),
          decoration: BoxDecoration(
            color: _getStatusColor(widget.property.status).withOpacity(0.1),
            borderRadius: BorderRadius.circular(DesignTokens.radiusS),
          ),
          child: Text(
            widget.property.status.toUpperCase(),
            style: TextStyle(
              color: _getStatusColor(widget.property.status),
              fontWeight: DesignTokens.fontWeightBold,
            ),
          ),
        ),
        
        const SizedBox(width: DesignTokens.spacingM),
        
        Container(
          padding: const EdgeInsets.symmetric(
            horizontal: DesignTokens.spacingM,
            vertical: DesignTokens.spacingS,
          ),
          decoration: BoxDecoration(
            color: DesignTokens.accent.withOpacity(0.1),
            borderRadius: BorderRadius.circular(DesignTokens.radiusS),
          ),
          child: Text(
            widget.property.type.toUpperCase(),
            style: TextStyle(
              color: DesignTokens.accent,
              fontWeight: DesignTokens.fontWeightBold,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTabBar(BuildContext context) {
    return Container(
      color: Colors.white,
      child: TabBar(
        controller: _tabController,
        labelColor: DesignTokens.primary,
        unselectedLabelColor: Colors.grey[600],
        indicatorColor: DesignTokens.primary,
        tabs: const [
          Tab(text: 'Overview'),
          Tab(text: 'Amenities'),
          Tab(text: 'Location'),
        ],
      ),
    );
  }

  Widget _buildOverviewTab(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(DesignTokens.spacingM),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Description
          Text(
            'Description',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: DesignTokens.fontWeightBold,
            ),
          ),
          const SizedBox(height: DesignTokens.spacingS),
          Text(
            widget.property.description,
            style: Theme.of(context).textTheme.bodyLarge,
          ),
          
          const SizedBox(height: DesignTokens.spacingL),
          
          // Specifications
          Text(
            'Specifications',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: DesignTokens.fontWeightBold,
            ),
          ),
          const SizedBox(height: DesignTokens.spacingS),
          _buildSpecificationsList(context),
          
          const SizedBox(height: DesignTokens.spacingL),
          
          // Agent Info
          _buildAgentInfo(context),
        ],
      ),
    );
  }

  Widget _buildSpecificationsList(BuildContext context) {
    final specs = widget.property.specifications;
    return Container(
      padding: const EdgeInsets.all(DesignTokens.spacingM),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(DesignTokens.radiusM),
      ),
      child: Column(
        children: [
          _buildSpecItem('Floors', '${specs.floors}'),
          _buildSpecItem('Furnishing', specs.furnishing),
          _buildSpecItem('Age', '${specs.age} years'),
          _buildSpecItem('Facing', specs.facing),
          _buildSpecItem('Floor Type', specs.floorType),
          _buildSpecItem('Balconies', '${specs.balconies}'),
        ],
      ),
    );
  }

  Widget _buildSpecItem(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: DesignTokens.spacingXS),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(fontWeight: DesignTokens.fontWeightMedium),
          ),
          Text(
            value,
            style: TextStyle(color: Colors.grey[600]),
          ),
        ],
      ),
    );
  }

  Widget _buildAmenitiesTab(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(DesignTokens.spacingM),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Amenities',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: DesignTokens.fontWeightBold,
            ),
          ),
          const SizedBox(height: DesignTokens.spacingM),
          Wrap(
            spacing: DesignTokens.spacingS,
            runSpacing: DesignTokens.spacingS,
            children: widget.property.amenities.map((amenity) {
              return Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: DesignTokens.spacingM,
                  vertical: DesignTokens.spacingS,
                ),
                decoration: BoxDecoration(
                  color: DesignTokens.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(DesignTokens.radiusS),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.check_circle,
                      size: 16,
                      color: DesignTokens.primary,
                    ),
                    const SizedBox(width: DesignTokens.spacingXS),
                    Text(
                      amenity,
                      style: TextStyle(
                        color: DesignTokens.primary,
                        fontWeight: DesignTokens.fontWeightMedium,
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildLocationTab(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(DesignTokens.spacingM),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Location',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: DesignTokens.fontWeightBold,
            ),
          ),
          const SizedBox(height: DesignTokens.spacingM),
          
          // Map Placeholder
          Container(
            height: 200,
            width: double.infinity,
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(DesignTokens.radiusM),
            ),
            child: const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.map, size: 50, color: Colors.grey),
                  SizedBox(height: DesignTokens.spacingS),
                  Text('Map View Coming Soon'),
                ],
              ),
            ),
          ),
          
          const SizedBox(height: DesignTokens.spacingM),
          
          // Address Details
          _buildAddressDetails(context),
        ],
      ),
    );
  }

  Widget _buildAddressDetails(BuildContext context) {
    final location = widget.property.location;
    return Container(
      padding: const EdgeInsets.all(DesignTokens.spacingM),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(DesignTokens.radiusM),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildAddressItem('Address', location.address),
          _buildAddressItem('Neighborhood', location.neighborhood),
          _buildAddressItem('City', location.city),
          _buildAddressItem('State', location.state),
          _buildAddressItem('Country', location.country),
          _buildAddressItem('ZIP Code', location.zipCode),
        ],
      ),
    );
  }

  Widget _buildAddressItem(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: DesignTokens.spacingXS),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: const TextStyle(fontWeight: DesignTokens.fontWeightMedium),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(color: Colors.grey[600]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAgentInfo(BuildContext context) {
    final agent = widget.property.agent;
    return Container(
      padding: const EdgeInsets.all(DesignTokens.spacingM),
      decoration: BoxDecoration(
        color: DesignTokens.primary.withOpacity(0.05),
        borderRadius: BorderRadius.circular(DesignTokens.radiusM),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 30,
            backgroundImage: CachedNetworkImageProvider(agent.profileImage),
            child: agent.profileImage.isEmpty
                ? const Icon(Icons.person, size: 30)
                : null,
          ),
          const SizedBox(width: DesignTokens.spacingM),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  agent.name,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: DesignTokens.fontWeightBold,
                  ),
                ),
                Text(
                  agent.company,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.grey[600],
                  ),
                ),
                Row(
                  children: [
                    Icon(Icons.star, size: 16, color: Colors.amber),
                    const SizedBox(width: DesignTokens.spacingXS),
                    Text('${agent.rating.toStringAsFixed(1)}'),
                    const SizedBox(width: DesignTokens.spacingM),
                    Text('${agent.totalProperties} properties'),
                  ],
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.phone),
            onPressed: () => _callAgent(agent.phone),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomBar(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(DesignTokens.spacingM),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: DesignTokens.shadowMedium,
      ),
      child: Row(
        children: [
          Expanded(
            child: OutlinedButton.icon(
              onPressed: () => _callAgent(widget.property.agent.phone),
              icon: const Icon(Icons.phone),
              label: const Text('Call Agent'),
            ),
          ),
          const SizedBox(width: DesignTokens.spacingM),
          Expanded(
            child: ElevatedButton.icon(
              onPressed: _scheduleVisit,
              icon: const Icon(Icons.calendar_today),
              label: const Text('Schedule Visit'),
            ),
          ),
        ],
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'available':
        return DesignTokens.success;
      case 'sold':
        return DesignTokens.error;
      case 'rented':
        return DesignTokens.warning;
      case 'under_construction':
        return DesignTokens.info;
      default:
        return Colors.grey;
    }
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

  void _shareProperty() {
    // TODO: Implement sharing functionality
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Sharing functionality coming soon')),
    );
  }

  void _callAgent(String phone) {
    // TODO: Implement phone call functionality
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Calling $phone...')),
    );
  }

  void _scheduleVisit() {
    // TODO: Implement schedule visit functionality
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Schedule visit functionality coming soon')),
    );
  }
}
