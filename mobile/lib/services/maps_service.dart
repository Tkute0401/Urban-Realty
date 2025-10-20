import 'dart:async';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import 'package:location/location.dart';
import '../models/property.dart';

class MapsService {
  static final MapsService _instance = MapsService._internal();
  factory MapsService() => _instance;
  MapsService._internal();

  final Location _location = Location();
  StreamSubscription<LocationData>? _locationSubscription;
  LocationData? _currentLocation;

  /// Get current location
  Future<Position?> getCurrentLocation() async {
    try {
      // Check if location services are enabled
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        throw Exception('Location services are disabled');
      }

      // Check location permissions
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          throw Exception('Location permissions are denied');
        }
      }

      if (permission == LocationPermission.deniedForever) {
        throw Exception('Location permissions are permanently denied');
      }

      // Get current position
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      return position;
    } catch (e) {
      print('Error getting current location: $e');
      return null;
    }
  }

  /// Get location stream for real-time updates
  Stream<Position> getLocationStream() {
    return Geolocator.getPositionStream(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 10, // Update every 10 meters
      ),
    );
  }

  /// Get address from coordinates
  Future<String?> getAddressFromCoordinates(double lat, double lng) async {
    try {
      List<Placemark> placemarks = await placemarkFromCoordinates(lat, lng);
      if (placemarks.isNotEmpty) {
        Placemark place = placemarks[0];
        return '${place.street}, ${place.locality}, ${place.administrativeArea} ${place.postalCode}';
      }
      return null;
    } catch (e) {
      print('Error getting address: $e');
      return null;
    }
  }

  /// Get coordinates from address
  Future<Position?> getCoordinatesFromAddress(String address) async {
    try {
      List<Location> locations = await locationFromAddress(address);
      if (locations.isNotEmpty) {
        Location location = locations.first;
        return Position(
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: DateTime.now(),
          accuracy: 0,
          altitude: 0,
          heading: 0,
          speed: 0,
          speedAccuracy: 0,
        );
      }
      return null;
    } catch (e) {
      print('Error getting coordinates: $e');
      return null;
    }
  }

  /// Calculate distance between two points
  double calculateDistance(double lat1, double lng1, double lat2, double lng2) {
    return Geolocator.distanceBetween(lat1, lng1, lat2, lng2);
  }

  /// Search properties near a location
  Future<List<Property>> searchPropertiesNearLocation({
    required double latitude,
    required double longitude,
    required double radiusInKm,
    required List<Property> allProperties,
  }) async {
    List<Property> nearbyProperties = [];

    for (Property property in allProperties) {
      double distance = calculateDistance(
        latitude,
        longitude,
        property.location.latitude,
        property.location.longitude,
      );

      // Convert meters to kilometers
      double distanceInKm = distance / 1000;

      if (distanceInKm <= radiusInKm) {
        nearbyProperties.add(property);
      }
    }

    // Sort by distance
    nearbyProperties.sort((a, b) {
      double distanceA = calculateDistance(
        latitude,
        longitude,
        a.location.latitude,
        a.location.longitude,
      );
      double distanceB = calculateDistance(
        latitude,
        longitude,
        b.location.latitude,
        b.location.longitude,
      );
      return distanceA.compareTo(distanceB);
    });

    return nearbyProperties;
  }

  /// Get nearby amenities
  Future<List<NearbyAmenity>> getNearbyAmenities({
    required double latitude,
    required double longitude,
    required double radiusInKm,
  }) async {
    // Mock data for nearby amenities
    // In a real app, this would use Google Places API or similar
    List<NearbyAmenity> amenities = [
      NearbyAmenity(
        name: 'Central Park',
        type: 'park',
        distance: 0.5,
        latitude: latitude + 0.001,
        longitude: longitude + 0.001,
        rating: 4.8,
      ),
      NearbyAmenity(
        name: 'Metro Station',
        type: 'transit',
        distance: 0.3,
        latitude: latitude - 0.001,
        longitude: longitude + 0.002,
        rating: 4.2,
      ),
      NearbyAmenity(
        name: 'Shopping Mall',
        type: 'shopping',
        distance: 0.8,
        latitude: latitude + 0.002,
        longitude: longitude - 0.001,
        rating: 4.5,
      ),
      NearbyAmenity(
        name: 'Hospital',
        type: 'healthcare',
        distance: 1.2,
        latitude: latitude - 0.002,
        longitude: longitude - 0.002,
        rating: 4.7,
      ),
      NearbyAmenity(
        name: 'School',
        type: 'education',
        distance: 0.6,
        latitude: latitude + 0.003,
        longitude: longitude + 0.001,
        rating: 4.3,
      ),
    ];

    // Filter by radius
    amenities = amenities.where((amenity) => amenity.distance <= radiusInKm).toList();

    // Sort by distance
    amenities.sort((a, b) => a.distance.compareTo(b.distance));

    return amenities;
  }

  /// Check if location permissions are granted
  Future<bool> hasLocationPermission() async {
    LocationPermission permission = await Geolocator.checkPermission();
    return permission == LocationPermission.whileInUse || 
           permission == LocationPermission.always;
  }

  /// Request location permissions
  Future<bool> requestLocationPermission() async {
    LocationPermission permission = await Geolocator.requestPermission();
    return permission == LocationPermission.whileInUse || 
           permission == LocationPermission.always;
  }

  /// Get location accuracy
  Future<LocationAccuracy> getLocationAccuracy() async {
    try {
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      
      if (position.accuracy <= 10) {
        return LocationAccuracy.high;
      } else if (position.accuracy <= 50) {
        return LocationAccuracy.medium;
      } else {
        return LocationAccuracy.low;
      }
    } catch (e) {
      return LocationAccuracy.low;
    }
  }

  /// Dispose resources
  void dispose() {
    _locationSubscription?.cancel();
  }
}

class NearbyAmenity {
  final String name;
  final String type;
  final double distance; // in kilometers
  final double latitude;
  final double longitude;
  final double rating;

  NearbyAmenity({
    required this.name,
    required this.type,
    required this.distance,
    required this.latitude,
    required this.longitude,
    required this.rating,
  });

  String get icon {
    switch (type) {
      case 'park':
        return '🌳';
      case 'transit':
        return '🚇';
      case 'shopping':
        return '🛍️';
      case 'healthcare':
        return '🏥';
      case 'education':
        return '🏫';
      case 'restaurant':
        return '🍽️';
      case 'gas_station':
        return '⛽';
      default:
        return '📍';
    }
  }
}
