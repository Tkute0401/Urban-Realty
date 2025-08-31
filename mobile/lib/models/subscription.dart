class Subscription {
  final String id;
  final String name;
  final String type;
  final double price;
  final String billingCycle;
  final List<String> features;
  final int listingLimit;
  final DateTime createdAt;
  final DateTime updatedAt;

  Subscription({
    required this.id,
    required this.name,
    required this.type,
    required this.price,
    required this.billingCycle,
    this.features = const [],
    required this.listingLimit,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Subscription.fromJson(Map<String, dynamic> json) {
    return Subscription(
      id: json["_id"] ?? json["id"],
      name: json["name"],
      type: json["type"],
      price: (json["price"] ?? 0).toDouble(),
      billingCycle: json["billingCycle"],
      features: List<String>.from(json["features"] ?? []),
      listingLimit: json["listingLimit"] ?? 0,
      createdAt: DateTime.parse(json["createdAt"]),
      updatedAt: DateTime.parse(json["updatedAt"]),
    );
  }
}
