List<String> _extractStringList(dynamic input) {
  if (input is List) {
    final List<String> results = [];
    for (final dynamic item in input) {
      if (item is String) {
        results.add(item);
      } else if (item is Map && item['url'] is String) {
        results.add(item['url'] as String);
      }
    }
    return results;
  }
  return const [];
}

class Property {
  final String id;
  final String title;
  final String description;
  final String type;
  final String status;
  final double price;
  final int bedrooms;
  final int bathrooms;
  final double area;
  final String address;
  final String city;
  final String state;
  final String zipcode;
  final List<String> images;
  final List<String> amenities;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool isFavorite;

  Property({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.status,
    required this.price,
    required this.bedrooms,
    required this.bathrooms,
    required this.area,
    required this.address,
    required this.city,
    required this.state,
    required this.zipcode,
    this.images = const [],
    this.amenities = const [],
    required this.createdAt,
    required this.updatedAt,
    this.isFavorite = false,
  });

  factory Property.fromJson(Map<String, dynamic> json) {
    return Property(
      id: json["_id"] ?? json["id"],
      title: json["title"] ?? '',
      description: json["description"] ?? '',
      type: json["type"] ?? '',
      status: json["status"] ?? '',
      price: (json["price"] == null)
          ? 0
          : (json["price"] is num)
              ? (json["price"] as num).toDouble()
              : (double.tryParse(json["price"].toString()) ?? 0),
      bedrooms: (json["bedrooms"] is num)
          ? (json["bedrooms"] as num).toInt()
          : int.tryParse(json["bedrooms"].toString()) ?? 0,
      bathrooms: (json["bathrooms"] is num)
          ? (json["bathrooms"] as num).toInt()
          : int.tryParse(json["bathrooms"].toString()) ?? 0,
      area: (json["area"] == null)
          ? 0
          : (json["area"] is num)
              ? (json["area"] as num).toDouble()
              : (double.tryParse(json["area"].toString()) ?? 0),
      address: json["address"] ?? '',
      city: json["city"] ?? '',
      state: json["state"] ?? '',
      zipcode: json["zipcode"] ?? '',
      images: _extractStringList(json["images"] ?? json["photos"] ?? json["gallery"]),
      amenities: _extractStringList(json["amenities"]),
      createdAt: DateTime.tryParse(json["createdAt"] ?? '') ?? DateTime.now(),
      updatedAt: DateTime.tryParse(json["updatedAt"] ?? '') ?? DateTime.now(),
      isFavorite: json["isFavorite"] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'id': id,
      'title': title,
      'description': description,
      'type': type,
      'status': status,
      'price': price,
      'bedrooms': bedrooms,
      'bathrooms': bathrooms,
      'area': area,
      'address': address,
      'city': city,
      'state': state,
      'zipcode': zipcode,
      'images': images,
      'amenities': amenities,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'isFavorite': isFavorite,
    };
  }

  Property copyWith({
    String? id,
    String? title,
    String? description,
    String? type,
    String? status,
    double? price,
    int? bedrooms,
    int? bathrooms,
    double? area,
    String? address,
    String? city,
    String? state,
    String? zipcode,
    List<String>? images,
    List<String>? amenities,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? isFavorite,
  }) {
    return Property(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      type: type ?? this.type,
      status: status ?? this.status,
      price: price ?? this.price,
      bedrooms: bedrooms ?? this.bedrooms,
      bathrooms: bathrooms ?? this.bathrooms,
      area: area ?? this.area,
      address: address ?? this.address,
      city: city ?? this.city,
      state: state ?? this.state,
      zipcode: zipcode ?? this.zipcode,
      images: images ?? this.images,
      amenities: amenities ?? this.amenities,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isFavorite: isFavorite ?? this.isFavorite,
    );
  }
}