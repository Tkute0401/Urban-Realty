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
  });

  factory Property.fromJson(Map<String, dynamic> json) {
    return Property(
      id: json["_id"] ?? json["id"],
      title: json["title"],
      description: json["description"],
      type: json["type"],
      status: json["status"],
      price: (json["price"] ?? 0).toDouble(),
      bedrooms: json["bedrooms"] ?? 0,
      bathrooms: json["bathrooms"] ?? 0,
      area: (json["area"] ?? 0).toDouble(),
      address: json["address"],
      city: json["city"],
      state: json["state"],
      zipcode: json["zipcode"],
      images: List<String>.from(json["images"] ?? []),
      amenities: List<String>.from(json["amenities"] ?? []),
      createdAt: DateTime.parse(json["createdAt"]),
      updatedAt: DateTime.parse(json["updatedAt"]),
    );
  }
}
