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
  
  // Additional properties for subscription comparison
  final int duration;
  final int maxProperties;
  final int featuredProperties;
  final bool prioritySupport;
  final bool analytics;
  final bool customBranding;

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
    this.duration = 1,
    this.maxProperties = -1,
    this.featuredProperties = 0,
    this.prioritySupport = false,
    this.analytics = false,
    this.customBranding = false,
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
      duration: json["duration"] ?? 1,
      maxProperties: json["maxProperties"] ?? -1,
      featuredProperties: json["featuredProperties"] ?? 0,
      prioritySupport: json["prioritySupport"] ?? false,
      analytics: json["analytics"] ?? false,
      customBranding: json["customBranding"] ?? false,
    );
  }
}
