import "package:flutter/material.dart";

class PropertyMap extends StatelessWidget {
  final double? latitude;
  final double? longitude;
  final String address;

  const PropertyMap({
    super.key,
    this.latitude,
    this.longitude,
    required this.address,
  });

  @override
  Widget build(BuildContext context) {
    if (latitude == null || longitude == null) {
      return Container(
        height: 200,
        color: Colors.grey[300],
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.location_off, size: 48, color: Colors.grey[600]),
              const SizedBox(height: 8),
              Text(
                "Location not available",
                style: TextStyle(color: Colors.grey[600]),
              ),
            ],
          ),
        ),
      );
    }

    return Container(
      height: 200,
      decoration: BoxDecoration(
        color: Colors.grey[300],
        borderRadius: BorderRadius.circular(8),
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.map, size: 48, color: Colors.grey[600]),
            const SizedBox(height: 8),
            Text(
              "Map View",
              style: TextStyle(color: Colors.grey[600]),
            ),
            const SizedBox(height: 4),
            Text(
              address,
              style: TextStyle(color: Colors.grey[600], fontSize: 12),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
