import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../shared/providers/properties_provider.dart';
import '../../models/property.dart';
import '../../widgets/property_image_gallery.dart';
import '../../widgets/property_amenities_section.dart';
import '../../widgets/property_highlights_section.dart';
import '../../widgets/property_nearby_section.dart';
import '../../widgets/property_agent_section.dart';
import '../../widgets/property_contact_section.dart';
import '../../utils/format_utils.dart';
import '../../services/recently_viewed_service.dart';
import '../../services/favorites_service.dart';
import '../../services/analytics_service.dart';

class PropertyDetailScreen extends StatefulWidget {
  final String propertyId;
  
  const PropertyDetailScreen({super.key, required this.propertyId});

  @override
  State<PropertyDetailScreen> createState() => _PropertyDetailScreenState();
}

class _PropertyDetailScreenState extends State<PropertyDetailScreen> {
  Property? property;
  bool isLoading = true;
  String? error;
  bool isFavorite = false;
  bool isTogglingFavorite = false;

  @override
  void initState() {
    super.initState();
    // Use WidgetsBinding to ensure we're not in build phase
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadProperty();
    });
  }

  Future<void> _loadProperty() async {
    try {
      setState(() {
        isLoading = true;
        error = null;
      });

      final provider = Provider.of<PropertiesProvider>(context, listen: false);
      await provider.fetchPropertyById(widget.propertyId);
      final loadedProperty = provider.selectedProperty;
      // Track recently viewed (non-blocking)
      // Fire and forget to avoid delaying UI rendering
      RecentlyViewedService().trackViewed(widget.propertyId);
      // Track analytics for view (non-blocking)
      AnalyticsService().track('property_viewed', {
        'propertyId': widget.propertyId,
      });
      // Fetch favorite status (best-effort)
      try {
        final fav = await FavoritesService().isFavorite(widget.propertyId);
        if (mounted) {
          isFavorite = fav;
        }
      } catch (_) {
        // ignore
      }
      
      if (mounted) {
        setState(() {
          property = loadedProperty;
          isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          error = e.toString();
          isLoading = false;
        });
      }
    }
  }

  Future<void> _toggleFavorite() async {
    if (property == null || isTogglingFavorite) return;
    setState(() {
      isTogglingFavorite = true;
    });
    final service = FavoritesService();
    try {
      if (isFavorite) {
        await service.removeFavorite(widget.propertyId);
        setState(() {
          isFavorite = false;
        });
        AnalyticsService().track('favorite_removed', {
          'propertyId': widget.propertyId,
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Removed from favorites')),
          );
        }
      } else {
        await service.addFavorite(widget.propertyId);
        setState(() {
          isFavorite = true;
        });
        AnalyticsService().track('favorite_added', {
          'propertyId': widget.propertyId,
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Added to favorites')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error updating favorite: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          isTogglingFavorite = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    if (isLoading) {
      return Scaffold(
        appBar: AppBar(title: const Text('Property Details')),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (error != null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Property Details')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.error_outline, size: 64, color: theme.colorScheme.error),
              const SizedBox(height: 16),
              Text('Error loading property', style: theme.textTheme.titleLarge),
              const SizedBox(height: 8),
              Text(error!, style: theme.textTheme.bodyMedium),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _loadProperty,
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }

    if (property == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Property Details')),
        body: const Center(
          child: Text('Property not found'),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Property Details'),
        actions: [
          IconButton(
            icon: Icon(isFavorite ? Icons.favorite : Icons.favorite_border),
            onPressed: isTogglingFavorite ? null : _toggleFavorite,
            tooltip: isFavorite ? 'Remove from favorites' : 'Add to favorites',
          ),
          IconButton(
            icon: const Icon(Icons.share),
            onPressed: () {
              // TODO: Implement share functionality
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Share functionality coming soon!')),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Property Images
            PropertyImageGallery(
              images: property!.images,
              title: property!.title,
            ),

            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title and Price
                  Text(
                    property!.title,
                    style: theme.textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Text(
                        FormatUtils.formatPrice(property!.price),
                        style: theme.textTheme.headlineMedium?.copyWith(
                          color: theme.colorScheme.primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(width: 8),
                      if (property!.featured)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.orange,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            'FEATURED',
                            style: theme.textTheme.bodySmall?.copyWith(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Property Basic Details
                  Card(
                    elevation: 2,
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Property Details',
                            style: theme.textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 16),
                          _buildDetailRow(Icons.location_on, 'Address', property!.address.formattedAddress),
                          _buildDetailRow(Icons.home, 'Type', property!.type),
                          _buildDetailRow(Icons.square_foot, 'Area', '${property!.area} sq ft'),
                          _buildDetailRow(Icons.bed, 'Bedrooms', property!.bedrooms.toString()),
                          _buildDetailRow(Icons.bathtub, 'Bathrooms', property!.bathrooms.toString()),
                          _buildDetailRow(Icons.business, 'Building', property!.buildingName),
                          _buildDetailRow(Icons.layers, 'Floor', property!.floorNumber),
                          _buildDetailRow(Icons.construction, 'Status', property!.constructionStatus),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Description
                  if (property!.description.isNotEmpty) ...[
                    Card(
                      elevation: 2,
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Description',
                              style: theme.textTheme.titleLarge?.copyWith(
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              property!.description,
                              style: theme.textTheme.bodyMedium,
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // Amenities
                  PropertyAmenitiesSection(amenities: property!.amenities),
                  const SizedBox(height: 16),

                  // Highlights
                  PropertyHighlightsSection(highlights: property!.highlights),
                  const SizedBox(height: 16),

                  // Nearby Facilities
                  PropertyNearbySection(nearbyLocalities: property!.nearbyLocalities),
                  const SizedBox(height: 16),

                  // Agent Details
                  PropertyAgentSection(agent: property!.agent),
                  const SizedBox(height: 16),

                  // Contact Section
                  PropertyContactSection(
                    onContact: () {
                      // TODO: Implement contact functionality
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Contact functionality coming soon!')),
                      );
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    final theme = Theme.of(context);
    
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          Icon(icon, size: 20, color: theme.colorScheme.primary),
          const SizedBox(width: 12),
          Text(
            '$label: ',
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w500,
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: theme.textTheme.bodyMedium,
            ),
          ),
        ],
      ),
    );
  }
}