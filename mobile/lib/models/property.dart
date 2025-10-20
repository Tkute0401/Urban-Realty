import 'package:equatable/equatable.dart';

/// Property model
class Property extends Equatable {
  final String id;
  final String title;
  final String description;
  final double price;
  final String currency;
  final String type; // apartment, house, villa, commercial, land
  final String status; // available, sold, rented, under_construction
  final PropertyLocation location;
  final PropertySpecifications specifications;
  final List<String> images;
  final List<String> amenities;
  final PropertyAgent agent;
  final bool featured;
  final int views;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Property({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    required this.currency,
    required this.type,
    required this.status,
    required this.location,
    required this.specifications,
    required this.images,
    required this.amenities,
    required this.agent,
    required this.featured,
    required this.views,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Property.fromJson(Map<String, dynamic> json) {
    return Property(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      currency: json['currency'] ?? 'USD',
      type: json['type'] ?? 'apartment',
      status: json['status'] ?? 'available',
      location: PropertyLocation.fromJson(json['location'] ?? {}),
      specifications: PropertySpecifications.fromJson(json['specifications'] ?? {}),
      images: List<String>.from(json['images'] ?? []),
      amenities: List<String>.from(json['amenities'] ?? []),
      agent: PropertyAgent.fromJson(json['agent'] ?? {}),
      featured: json['featured'] ?? false,
      views: json['views'] ?? 0,
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'price': price,
      'currency': currency,
      'type': type,
      'status': status,
      'location': location.toJson(),
      'specifications': specifications.toJson(),
      'images': images,
      'amenities': amenities,
      'agent': agent.toJson(),
      'featured': featured,
      'views': views,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  Property copyWith({
    String? id,
    String? title,
    String? description,
    double? price,
    String? currency,
    String? type,
    String? status,
    PropertyLocation? location,
    PropertySpecifications? specifications,
    List<String>? images,
    List<String>? amenities,
    PropertyAgent? agent,
    bool? featured,
    int? views,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Property(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      price: price ?? this.price,
      currency: currency ?? this.currency,
      type: type ?? this.type,
      status: status ?? this.status,
      location: location ?? this.location,
      specifications: specifications ?? this.specifications,
      images: images ?? this.images,
      amenities: amenities ?? this.amenities,
      agent: agent ?? this.agent,
      featured: featured ?? this.featured,
      views: views ?? this.views,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  List<Object?> get props => [
        id,
        title,
        description,
        price,
        currency,
        type,
        status,
        location,
        specifications,
        images,
        amenities,
        agent,
        featured,
        views,
        createdAt,
        updatedAt,
      ];
}

/// Property location
class PropertyLocation extends Equatable {
  final String address;
  final String city;
  final String state;
  final String country;
  final String zipCode;
  final double latitude;
  final double longitude;
  final String neighborhood;

  const PropertyLocation({
    required this.address,
    required this.city,
    required this.state,
    required this.country,
    required this.zipCode,
    required this.latitude,
    required this.longitude,
    required this.neighborhood,
  });

  factory PropertyLocation.fromJson(Map<String, dynamic> json) {
    return PropertyLocation(
      address: json['address'] ?? '',
      city: json['city'] ?? '',
      state: json['state'] ?? '',
      country: json['country'] ?? '',
      zipCode: json['zipCode'] ?? '',
      latitude: (json['latitude'] ?? 0).toDouble(),
      longitude: (json['longitude'] ?? 0).toDouble(),
      neighborhood: json['neighborhood'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'address': address,
      'city': city,
      'state': state,
      'country': country,
      'zipCode': zipCode,
      'latitude': latitude,
      'longitude': longitude,
      'neighborhood': neighborhood,
    };
  }

  @override
  List<Object?> get props => [
        address,
        city,
        state,
        country,
        zipCode,
        latitude,
        longitude,
        neighborhood,
      ];
}

/// Property specifications
class PropertySpecifications extends Equatable {
  final int bedrooms;
  final int bathrooms;
  final double area; // in square feet/meters
  final String areaUnit; // sqft, sqm
  final int floors;
  final int parkingSpaces;
  final int balconies;
  final String furnishing; // furnished, semi-furnished, unfurnished
  final int age; // in years
  final String facing; // north, south, east, west
  final String floorType; // marble, tiles, wooden, etc.

  const PropertySpecifications({
    required this.bedrooms,
    required this.bathrooms,
    required this.area,
    required this.areaUnit,
    required this.floors,
    required this.parkingSpaces,
    required this.balconies,
    required this.furnishing,
    required this.age,
    required this.facing,
    required this.floorType,
  });

  factory PropertySpecifications.fromJson(Map<String, dynamic> json) {
    return PropertySpecifications(
      bedrooms: json['bedrooms'] ?? 0,
      bathrooms: json['bathrooms'] ?? 0,
      area: (json['area'] ?? 0).toDouble(),
      areaUnit: json['areaUnit'] ?? 'sqft',
      floors: json['floors'] ?? 1,
      parkingSpaces: json['parkingSpaces'] ?? 0,
      balconies: json['balconies'] ?? 0,
      furnishing: json['furnishing'] ?? 'unfurnished',
      age: json['age'] ?? 0,
      facing: json['facing'] ?? 'north',
      floorType: json['floorType'] ?? 'tiles',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'bedrooms': bedrooms,
      'bathrooms': bathrooms,
      'area': area,
      'areaUnit': areaUnit,
      'floors': floors,
      'parkingSpaces': parkingSpaces,
      'balconies': balconies,
      'furnishing': furnishing,
      'age': age,
      'facing': facing,
      'floorType': floorType,
    };
  }

  @override
  List<Object?> get props => [
        bedrooms,
        bathrooms,
        area,
        areaUnit,
        floors,
        parkingSpaces,
        balconies,
        furnishing,
        age,
        facing,
        floorType,
      ];
}

/// Property agent
class PropertyAgent extends Equatable {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String profileImage;
  final String company;
  final double rating;
  final int totalProperties;

  const PropertyAgent({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.profileImage,
    required this.company,
    required this.rating,
    required this.totalProperties,
  });

  factory PropertyAgent.fromJson(Map<String, dynamic> json) {
    return PropertyAgent(
      id: json['_id'] ?? json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      profileImage: json['profileImage'] ?? '',
      company: json['company'] ?? '',
      rating: (json['rating'] ?? 0).toDouble(),
      totalProperties: json['totalProperties'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'profileImage': profileImage,
      'company': company,
      'rating': rating,
      'totalProperties': totalProperties,
    };
  }

  @override
  List<Object?> get props => [
        id,
        name,
        email,
        phone,
        profileImage,
        company,
        rating,
        totalProperties,
      ];
}

/// Property search filters
class PropertyFilters extends Equatable {
  final String? type;
  final String? status;
  final double? minPrice;
  final double? maxPrice;
  final int? minBedrooms;
  final int? maxBedrooms;
  final int? minBathrooms;
  final int? maxBathrooms;
  final double? minArea;
  final double? maxArea;
  final String? city;
  final String? neighborhood;
  final List<String> amenities;
  final bool featured;

  const PropertyFilters({
    this.type,
    this.status,
    this.minPrice,
    this.maxPrice,
    this.minBedrooms,
    this.maxBedrooms,
    this.minBathrooms,
    this.maxBathrooms,
    this.minArea,
    this.maxArea,
    this.city,
    this.neighborhood,
    this.amenities = const [],
    this.featured = false,
  });

  PropertyFilters copyWith({
    String? type,
    String? status,
    double? minPrice,
    double? maxPrice,
    int? minBedrooms,
    int? maxBedrooms,
    int? minBathrooms,
    int? maxBathrooms,
    double? minArea,
    double? maxArea,
    String? city,
    String? neighborhood,
    List<String>? amenities,
    bool? featured,
  }) {
    return PropertyFilters(
      type: type ?? this.type,
      status: status ?? this.status,
      minPrice: minPrice ?? this.minPrice,
      maxPrice: maxPrice ?? this.maxPrice,
      minBedrooms: minBedrooms ?? this.minBedrooms,
      maxBedrooms: maxBedrooms ?? this.maxBedrooms,
      minBathrooms: minBathrooms ?? this.minBathrooms,
      maxBathrooms: maxBathrooms ?? this.maxBathrooms,
      minArea: minArea ?? this.minArea,
      maxArea: maxArea ?? this.maxArea,
      city: city ?? this.city,
      neighborhood: neighborhood ?? this.neighborhood,
      amenities: amenities ?? this.amenities,
      featured: featured ?? this.featured,
    );
  }

  @override
  List<Object?> get props => [
        type,
        status,
        minPrice,
        maxPrice,
        minBedrooms,
        maxBedrooms,
        minBathrooms,
        maxBathrooms,
        minArea,
        maxArea,
        city,
        neighborhood,
        amenities,
        featured,
      ];
}