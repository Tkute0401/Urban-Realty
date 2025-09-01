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
      price: (json["price"] ?? 0).toDouble(),
      bedrooms: json["bedrooms"] ?? 0,
      bathrooms: json["bathrooms"] ?? 0,
      area: (json["area"] ?? 0).toDouble(),
      address: json["address"] ?? '',
      city: json["city"] ?? '',
      state: json["state"] ?? '',
      zipcode: json["zipcode"] ?? '',
      images: List<String>.from(json["images"] ?? []),
      amenities: List<String>.from(json["amenities"] ?? []),
      createdAt: DateTime.tryParse(json["createdAt"] ?? '') ?? DateTime.now(),
      updatedAt: DateTime.tryParse(json["updatedAt"] ?? '') ?? DateTime.now(),
      isFavorite: json["isFavorite"] ?? false,
    );
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