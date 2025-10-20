import 'dart:math';
import '../models/property.dart';
import 'api_service.dart';

/// Property service with mock data
class PropertyService {
  final ApiService _apiService;

  PropertyService({required ApiService apiService}) : _apiService = apiService;

  /// Get all properties with mock data
  Future<List<Property>> getProperties({
    int page = 1,
    int limit = 20,
    PropertyFilters? filters,
  }) async {
    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));
      
      // Generate mock properties
      final allProperties = _generateMockProperties();
      
      // Apply filters
      var filteredProperties = allProperties;
      if (filters != null) {
        filteredProperties = _applyFilters(allProperties, filters);
      }
      
      // Apply pagination
      final startIndex = (page - 1) * limit;
      final endIndex = startIndex + limit;
      
      if (startIndex >= filteredProperties.length) {
        return [];
      }
      
      return filteredProperties.sublist(
        startIndex,
        endIndex > filteredProperties.length ? filteredProperties.length : endIndex,
      );
    } catch (e) {
      throw Exception('Failed to load properties: ${e.toString()}');
    }
  }

  /// Search properties
  Future<List<Property>> searchProperties(String query) async {
    try {
      // Simulate network delay
      await Future.delayed(const Duration(milliseconds: 500));
      
      final allProperties = _generateMockProperties();
      final lowercaseQuery = query.toLowerCase();
      
      return allProperties.where((property) {
        return property.title.toLowerCase().contains(lowercaseQuery) ||
               property.description.toLowerCase().contains(lowercaseQuery) ||
               property.location.city.toLowerCase().contains(lowercaseQuery) ||
               property.location.neighborhood.toLowerCase().contains(lowercaseQuery) ||
               property.type.toLowerCase().contains(lowercaseQuery);
      }).toList();
    } catch (e) {
      throw Exception('Failed to search properties: ${e.toString()}');
    }
  }

  /// Get featured properties
  Future<List<Property>> getFeaturedProperties() async {
    try {
      // Simulate network delay
      await Future.delayed(const Duration(milliseconds: 500));
      
      final allProperties = _generateMockProperties();
      return allProperties.where((property) => property.featured).toList();
    } catch (e) {
      throw Exception('Failed to load featured properties: ${e.toString()}');
    }
  }

  /// Generate mock properties
  List<Property> _generateMockProperties() {
    final random = Random();
    final properties = <Property>[];
    
    final propertyTypes = ['apartment', 'house', 'villa', 'commercial', 'land'];
    final statuses = ['available', 'sold', 'rented', 'under_construction'];
    final cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
    final neighborhoods = ['Downtown', 'Midtown', 'Uptown', 'Westside', 'Eastside', 'Northside', 'Southside', 'Central', 'Historic', 'Waterfront'];
    final amenities = ['Swimming Pool', 'Gym', 'Parking', 'Garden', 'Balcony', 'Elevator', 'Security', 'CCTV', 'WiFi', 'Air Conditioning'];
    final furnishingTypes = ['furnished', 'semi-furnished', 'unfurnished'];
    final facingDirections = ['north', 'south', 'east', 'west'];
    final floorTypes = ['marble', 'tiles', 'wooden', 'carpet'];
    final companies = ['Urban Realty', 'Prime Properties', 'Elite Homes', 'Dream Houses', 'Luxury Living'];
    
    for (int i = 0; i < 50; i++) {
      final type = propertyTypes[random.nextInt(propertyTypes.length)];
      final status = statuses[random.nextInt(statuses.length)];
      final city = cities[random.nextInt(cities.length)];
      final neighborhood = neighborhoods[random.nextInt(neighborhoods.length)];
      
      final bedrooms = random.nextInt(5) + 1;
      final bathrooms = random.nextInt(4) + 1;
      final area = (random.nextDouble() * 2000 + 500).roundToDouble();
      final price = (random.nextDouble() * 2000000 + 100000).roundToDouble();
      
      final propertyAmenities = amenities.take(random.nextInt(5) + 2).toList();
      
      final property = Property(
        id: 'property_$i',
        title: '${type.capitalize()} in $neighborhood, $city',
        description: 'Beautiful $type with modern amenities and great location. Perfect for ${random.nextBool() ? 'families' : 'professionals'}.',
        price: price,
        currency: 'USD',
        type: type,
        status: status,
        location: PropertyLocation(
          address: '${random.nextInt(9999) + 1} ${neighborhood} Street',
          city: city,
          state: 'CA',
          country: 'USA',
          zipCode: '${random.nextInt(90000) + 10000}',
          latitude: 37.7749 + (random.nextDouble() - 0.5) * 0.1,
          longitude: -122.4194 + (random.nextDouble() - 0.5) * 0.1,
          neighborhood: neighborhood,
        ),
        specifications: PropertySpecifications(
          bedrooms: bedrooms,
          bathrooms: bathrooms,
          area: area,
          areaUnit: 'sqft',
          floors: random.nextInt(3) + 1,
          parkingSpaces: random.nextInt(3),
          balconies: random.nextInt(3),
          furnishing: furnishingTypes[random.nextInt(furnishingTypes.length)],
          age: random.nextInt(20),
          facing: facingDirections[random.nextInt(facingDirections.length)],
          floorType: floorTypes[random.nextInt(floorTypes.length)],
        ),
        images: List.generate(random.nextInt(5) + 1, (index) => 
          'https://picsum.photos/400/300?random=${i * 10 + index}'
        ),
        amenities: propertyAmenities,
        agent: PropertyAgent(
          id: 'agent_$i',
          name: 'Agent ${i + 1}',
          email: 'agent${i + 1}@urbanrealty.com',
          phone: '+1${random.nextInt(9000000000) + 1000000000}',
          profileImage: 'https://i.pravatar.cc/150?img=${i + 1}',
          company: companies[random.nextInt(companies.length)],
          rating: 3.5 + random.nextDouble() * 1.5,
          totalProperties: random.nextInt(50) + 10,
        ),
        featured: random.nextBool() && random.nextDouble() < 0.3,
        views: random.nextInt(1000),
        createdAt: DateTime.now().subtract(Duration(days: random.nextInt(365))),
        updatedAt: DateTime.now().subtract(Duration(days: random.nextInt(30))),
      );
      
      properties.add(property);
    }
    
    return properties;
  }

  /// Apply filters to properties
  List<Property> _applyFilters(List<Property> properties, PropertyFilters filters) {
    return properties.where((property) {
      if (filters.type != null && property.type != filters.type) return false;
      if (filters.status != null && property.status != filters.status) return false;
      if (filters.minPrice != null && property.price < filters.minPrice!) return false;
      if (filters.maxPrice != null && property.price > filters.maxPrice!) return false;
      if (filters.minBedrooms != null && property.specifications.bedrooms < filters.minBedrooms!) return false;
      if (filters.maxBedrooms != null && property.specifications.bedrooms > filters.maxBedrooms!) return false;
      if (filters.minBathrooms != null && property.specifications.bathrooms < filters.minBathrooms!) return false;
      if (filters.maxBathrooms != null && property.specifications.bathrooms > filters.maxBathrooms!) return false;
      if (filters.city != null && !property.location.city.toLowerCase().contains(filters.city!.toLowerCase())) return false;
      if (filters.featured && !property.featured) return false;
      
      return true;
    }).toList();
  }
}

/// Extension to capitalize strings
extension StringExtension on String {
  String capitalize() {
    if (isEmpty) return this;
    return this[0].toUpperCase() + substring(1).toLowerCase();
  }
}
