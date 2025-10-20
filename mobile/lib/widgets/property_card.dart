import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/property.dart';
import '../config/design_tokens.dart';

class PropertyCard extends StatelessWidget {
  final Property property;
  final VoidCallback onTap;
  final VoidCallback? onFavorite;
  final bool isFavorite;

  const PropertyCard({
    super.key,
    required this.property,
    required this.onTap,
    this.onFavorite,
    this.isFavorite = false,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(
        horizontal: DesignTokens.spaceMd,
        vertical: DesignTokens.spaceSm,
      ),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(DesignTokens.radiusMdd),
      ),
              child: InkWell(
          onTap: onTap,
        borderRadius: BorderRadius.circular(DesignTokens.radiusMdd),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Property Image with Overlay
            _buildImageSection(context),
            
            // Property Info
            Padding(
              padding: const EdgeInsets.all(DesignTokens.spaceMd),
          child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
                  // Price and Title
                  _buildPriceAndTitle(context),
                  
                  const SizedBox(height: DesignTokens.spaceSm),
                  
                  // Location
                  _buildLocation(context),
                  
                  const SizedBox(height: DesignTokens.spaceMd),
                  
                  // Property Details
                  _buildPropertyDetails(context),
                  
                  const SizedBox(height: DesignTokens.spaceMd),
                  
                  // Tags and Actions
                  _buildTagsAndActions(context),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildImageSection(BuildContext context) {
    return Stack(
              children: [
        // Property Image
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(
            top: Radius.circular(DesignTokens.radiusMd),
          ),
          child: Container(
            height: 200,
            width: double.infinity,
            color: Colors.grey[300],
                    child: property.images.isNotEmpty
                        ? CachedNetworkImage(
                    imageUrl: property.images.first,
                            fit: BoxFit.cover,
                            placeholder: (context, url) => Container(
                      color: Colors.grey[300],
                              child: const Center(
                                child: CircularProgressIndicator(),
                              ),
                            ),
                            errorWidget: (context, url, error) => Container(
                      color: Colors.grey[300],
                              child: const Icon(
                                Icons.home,
                        size: 60,
                                color: Colors.grey,
                              ),
                            ),
                          )
                        : Container(
                    color: Colors.grey[300],
                            child: const Icon(
                              Icons.home,
                      size: 60,
                              color: Colors.grey,
                            ),
                          ),
                  ),
                ),

        // Featured Badge
        if (property.featured)
                Positioned(
            top: DesignTokens.spaceSm,
            left: DesignTokens.spaceSm,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                horizontal: DesignTokens.spaceSm,
                vertical: DesignTokens.spacingXS,
                    ),
                    decoration: BoxDecoration(
                color: DesignTokens.warning,
                borderRadius: BorderRadius.circular(DesignTokens.radiusSm),
              ),
              child: const Text(
                'FEATURED',
                style: TextStyle(
                        color: Colors.white,
                  fontSize: DesignTokens.fontSizeXS,
                  fontWeight: DesignTokens.fontWeightBold,
                      ),
                    ),
                  ),
                ),

        // Favorite Button
                if (onFavorite != null)
                  Positioned(
            top: DesignTokens.spaceSm,
            right: DesignTokens.spaceSm,
                    child: GestureDetector(
                      onTap: onFavorite,
                      child: Container(
                padding: const EdgeInsets.all(DesignTokens.spaceSm),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.9),
                          shape: BoxShape.circle,
                  boxShadow: DesignTokens.shadowSmall,
                        ),
                        child: Icon(
                          isFavorite ? Icons.favorite : Icons.favorite_border,
                  color: isFavorite ? Colors.red : Colors.grey[600],
                          size: 20,
                ),
              ),
            ),
          ),

        // Status Badge
        Positioned(
          bottom: DesignTokens.spaceSm,
          right: DesignTokens.spaceSm,
          child: Container(
            padding: const EdgeInsets.symmetric(
              horizontal: DesignTokens.spaceSm,
              vertical: DesignTokens.spacingXS,
            ),
            decoration: BoxDecoration(
              color: _getStatusColor(property.status).withOpacity(0.9),
              borderRadius: BorderRadius.circular(DesignTokens.radiusSm),
            ),
            child: Text(
              property.status.toUpperCase(),
              style: const TextStyle(
                color: Colors.white,
                fontSize: DesignTokens.fontSizeXS,
                fontWeight: DesignTokens.fontWeightBold,
                        ),
                      ),
                    ),
                  ),
              ],
    );
  }

  Widget _buildPriceAndTitle(BuildContext context) {
    return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
        Text(
          _formatPrice(property.price, property.currency),
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
            fontWeight: DesignTokens.fontWeightBold,
            color: DesignTokens.primary,
          ),
        ),
        const SizedBox(height: DesignTokens.spacingXS),
                  Text(
                    property.title,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: DesignTokens.fontWeightSemiBold,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
      ],
    );
  }

  Widget _buildLocation(BuildContext context) {
    return Row(
                      children: [
                        Icon(
          Icons.location_on,
                          size: 16,
          color: Colors.grey[600],
        ),
        const SizedBox(width: DesignTokens.spacingXS),
                      Expanded(
                        child: Text(
            '${property.location.neighborhood}, ${property.location.city}',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: Colors.grey[600],
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
    );
  }

  Widget _buildPropertyDetails(BuildContext context) {
    return Row(
      children: [
        _buildDetailChip(
          context,
          Icons.bed,
          '${property.specifications.bedrooms} bed',
        ),
        const SizedBox(width: DesignTokens.spaceSm),
        _buildDetailChip(
          context,
          Icons.bathroom,
          '${property.specifications.bathrooms} bath',
        ),
        const SizedBox(width: DesignTokens.spaceSm),
        _buildDetailChip(
          context,
          Icons.square_foot,
          '${property.specifications.area.toInt()} ${property.specifications.areaUnit}',
        ),
      ],
    );
  }

  Widget _buildDetailChip(BuildContext context, IconData icon, String text) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: DesignTokens.spaceSm,
        vertical: DesignTokens.spacingXS,
      ),
      decoration: BoxDecoration(
        color: DesignTokens.primary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(DesignTokens.radiusSm),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 14,
            color: DesignTokens.primary,
          ),
          const SizedBox(width: DesignTokens.spacingXS),
                  Text(
            text,
            style: TextStyle(
              color: DesignTokens.primary,
              fontSize: DesignTokens.fontSizeXS,
              fontWeight: DesignTokens.fontWeightMedium,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTagsAndActions(BuildContext context) {
    return Row(
      children: [
        // Property Type Tag
        Container(
          padding: const EdgeInsets.symmetric(
            horizontal: DesignTokens.spaceSm,
            vertical: DesignTokens.spacingXS,
          ),
          decoration: BoxDecoration(
            color: DesignTokens.accent.withOpacity(0.1),
            borderRadius: BorderRadius.circular(DesignTokens.radiusSm),
          ),
          child: Text(
            property.type.toUpperCase(),
                        style: TextStyle(
              color: DesignTokens.accent,
              fontSize: DesignTokens.fontSizeXS,
              fontWeight: DesignTokens.fontWeightBold,
                        ),
                      ),
                    ),
        
        const Spacer(),
        
        // Views Count
        if (property.views > 0)
          Row(
            mainAxisSize: MainAxisSize.min,
                    children: [
              Icon(
                Icons.visibility,
                size: 14,
                color: Colors.grey[600],
              ),
              const SizedBox(width: DesignTokens.spacingXS),
                      Text(
                '${property.views} views',
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: DesignTokens.fontSizeXS,
                ),
                      ),
                    ],
                  ),
                ],
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
}
