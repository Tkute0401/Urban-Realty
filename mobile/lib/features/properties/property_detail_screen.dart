import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/properties_provider.dart';
import '../../models/property.dart';
import '../../widgets/property_image_gallery.dart';
import '../../widgets/property_map.dart';
import '../../utils/format_utils.dart';

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

  @override
  void initState() {
    super.initState();
    _loadProperty();
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
      
      setState(() {
        property = loadedProperty;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        error = e.toString();
        isLoading = false;
      });
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
            icon: const Icon(Icons.favorite_border),
            onPressed: () {
              // TODO: Implement favorite functionality
            },
          ),
          IconButton(
            icon: const Icon(Icons.share),
            onPressed: () {
              // TODO: Implement share functionality
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Property Images
            if (property!.images.isNotEmpty)
              SizedBox(
                height: 250,
                child: PageView.builder(
                  itemCount: property!.images.length,
                  itemBuilder: (context, index) {
                    return Image.network(
                      property!.images[index],
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return Container(
                          color: theme.colorScheme.surfaceContainerHighest,
                          child: Icon(
                            Icons.image_not_supported,
                            size: 64,
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                        );
                      },
                    );
                  },
                ),
              )
            else
              Container(
                height: 250,
                color: theme.colorScheme.surfaceContainerHighest,
                child: Icon(
                  Icons.image_not_supported,
                  size: 64,
                  color: theme.colorScheme.onSurfaceVariant,
                ),
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
                  Text(
                    '₹${property!.price.toStringAsFixed(0)}',
                    style: theme.textTheme.headlineMedium?.copyWith(
                      color: theme.colorScheme.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Property Details
                  _buildDetailRow(Icons.location_on, 'Address', property!.address),
                  _buildDetailRow(Icons.home, 'Type', property!.type),
                  _buildDetailRow(Icons.square_foot, 'Area', '${property!.area} sq ft'),
                  _buildDetailRow(Icons.bed, 'Bedrooms', property!.bedrooms.toString()),
                  _buildDetailRow(Icons.bathtub, 'Bathrooms', property!.bathrooms.toString()),
                  
                  if (property!.amenities.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    Text(
                      'Amenities',
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: property!.amenities.map((amenity) {
                        return Chip(
                          label: Text(amenity),
                          backgroundColor: theme.colorScheme.primaryContainer,
                        );
                      }).toList(),
                    ),
                  ],

                  if (property!.description.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    Text(
                      'Description',
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      property!.description,
                      style: theme.textTheme.bodyMedium,
                    ),
                  ],

                  const SizedBox(height: 24),
                  
                  // Contact Button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () {
                        // TODO: Implement contact functionality
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Contact functionality coming soon!')),
                        );
                      },
                      icon: const Icon(Icons.phone),
                      label: const Text('Contact Agent'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                    ),
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