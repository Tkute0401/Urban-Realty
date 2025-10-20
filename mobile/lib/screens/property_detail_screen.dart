import 'package:flutter/material.dart';
import '../models/property.dart';

class PropertyDetailScreen extends StatelessWidget {
  final Property property;

  const PropertyDetailScreen({
    super.key,
    required this.property,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Property Details'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Property Images
            Container(
              height: 300,
              width: double.infinity,
              color: Colors.grey[300],
              child: property.images.isNotEmpty
                  ? Image.network(
                      property.images.first,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => const Icon(Icons.home, size: 100),
                    )
                  : const Icon(Icons.home, size: 100),
            ),

            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Price and Title
                  Text(
                    _formatPrice(property.price, property.currency),
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ),

                  const SizedBox(height: 8),

                  Text(
                    property.title,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),

                  const SizedBox(height: 8),

                  Text(
                    '${property.location.address}, ${property.location.neighborhood}, ${property.location.city}',
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: Colors.grey[600],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Property Details
                  Row(
                    children: [
                      _buildDetailChip(Icons.bed, '${property.specifications.bedrooms} bed'),
                      const SizedBox(width: 8),
                      _buildDetailChip(Icons.bathroom, '${property.specifications.bathrooms} bath'),
                      const SizedBox(width: 8),
                      _buildDetailChip(Icons.square_foot, '${property.specifications.area.toInt()} sqft'),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Property Type and Status
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Text(
                          property.type.toUpperCase(),
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.primary,
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: property.status == 'available' ? Colors.green.withOpacity(0.1) : Colors.orange.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Text(
                          property.status.toUpperCase(),
                          style: TextStyle(
                            color: property.status == 'available' ? Colors.green : Colors.orange,
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Description
                  Text(
                    'Description',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 8),

                  Text(
                    property.description,
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),

                  const SizedBox(height: 24),

                  // Specifications
                  Text(
                    'Specifications',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 8),

                  _buildSpecificationRow('Bedrooms', '${property.specifications.bedrooms}'),
                  _buildSpecificationRow('Bathrooms', '${property.specifications.bathrooms}'),
                  _buildSpecificationRow('Area', '${property.specifications.area.toInt()} ${property.specifications.areaUnit}'),
                  _buildSpecificationRow('Floors', '${property.specifications.floors}'),
                  _buildSpecificationRow('Parking', '${property.specifications.parkingSpaces} spaces'),
                  _buildSpecificationRow('Balconies', '${property.specifications.balconies}'),
                  _buildSpecificationRow('Furnishing', property.specifications.furnishing),
                  _buildSpecificationRow('Age', '${property.specifications.age} years'),
                  _buildSpecificationRow('Facing', property.specifications.facing),
                  _buildSpecificationRow('Floor Type', property.specifications.floorType),

                  const SizedBox(height: 24),

                  // Amenities
                  Text(
                    'Amenities',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 8),

                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: property.amenities.map((amenity) => Chip(
                      label: Text(amenity),
                      backgroundColor: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                    )).toList(),
                  ),

                  const SizedBox(height: 24),

                  // Agent Info
                  Text(
                    'Agent Information',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 8),

                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          CircleAvatar(
                            radius: 30,
                            backgroundImage: property.agent.profileImage.isNotEmpty
                                ? NetworkImage(property.agent.profileImage)
                                : null,
                            child: property.agent.profileImage.isEmpty
                                ? const Icon(Icons.person, size: 30)
                                : null,
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  property.agent.name,
                                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                Text(
                                  property.agent.company,
                                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                    color: Colors.grey[600],
                                  ),
                                ),
                                Text(
                                  property.agent.phone,
                                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                    color: Colors.grey[600],
                                  ),
                                ),
                                Row(
                                  children: [
                                    const Icon(Icons.star, color: Colors.amber, size: 16),
                                    const SizedBox(width: 4),
                                    Text(
                                      property.agent.rating.toStringAsFixed(1),
                                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      '(${property.agent.totalProperties} properties)',
                                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                        color: Colors.grey[600],
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Action Buttons
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () {
                            // TODO: Implement contact agent
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Contact agent functionality not implemented yet')),
                            );
                          },
                          icon: const Icon(Icons.phone),
                          label: const Text('Contact Agent'),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () {
                            // TODO: Implement add to favorites
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Add to favorites functionality not implemented yet')),
                            );
                          },
                          icon: const Icon(Icons.favorite_border),
                          label: const Text('Add to Favorites'),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailChip(IconData icon, String text) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 16, color: Colors.grey[600]),
        const SizedBox(width: 4),
        Text(
          text,
          style: TextStyle(
            color: Colors.grey[600],
            fontSize: 14,
          ),
        ),
      ],
    );
  }

  Widget _buildSpecificationRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontWeight: FontWeight.w500,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              color: Colors.grey[600],
            ),
          ),
        ],
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
}
