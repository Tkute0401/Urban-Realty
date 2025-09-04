import 'package:flutter/material.dart';
import '../models/property.dart';

class PropertyNearbySection extends StatelessWidget {
  final NearbyLocalities nearbyLocalities;

  const PropertyNearbySection({
    super.key,
    required this.nearbyLocalities,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.location_on,
                  color: theme.colorScheme.primary,
                  size: 24,
                ),
                const SizedBox(width: 8),
                Text(
                  'Nearby Facilities',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildNearbyItem(
              Icons.school,
              'School',
              nearbyLocalities.hasSchool ? nearbyLocalities.school : 'No school nearby',
              nearbyLocalities.hasSchool,
              theme,
            ),
            _buildNearbyItem(
              Icons.local_hospital,
              'Hospital',
              nearbyLocalities.hasHospital ? nearbyLocalities.hospital : 'No hospital nearby',
              nearbyLocalities.hasHospital,
              theme,
            ),
            _buildNearbyItem(
              Icons.shopping_cart,
              'Mall',
              nearbyLocalities.hasMall ? nearbyLocalities.mall : 'No mall nearby',
              nearbyLocalities.hasMall,
              theme,
            ),
            _buildNearbyItem(
              Icons.park,
              'Park',
              nearbyLocalities.hasPark ? nearbyLocalities.park : 'No park nearby',
              nearbyLocalities.hasPark,
              theme,
            ),
            _buildNearbyItem(
              Icons.directions_bus,
              'Transport',
              nearbyLocalities.hasTransport ? nearbyLocalities.transport : 'No transport nearby',
              nearbyLocalities.hasTransport,
              theme,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNearbyItem(
    IconData icon,
    String title,
    String value,
    bool isAvailable,
    ThemeData theme,
  ) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Icon(
            icon,
            color: isAvailable ? theme.colorScheme.primary : theme.colorScheme.onSurfaceVariant,
            size: 20,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w500,
                    color: isAvailable ? theme.colorScheme.onSurface : theme.colorScheme.onSurfaceVariant,
                  ),
                ),
                Text(
                  value,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
          Icon(
            isAvailable ? Icons.check_circle : Icons.cancel,
            color: isAvailable ? Colors.green : Colors.red,
            size: 16,
          ),
        ],
      ),
    );
  }
}