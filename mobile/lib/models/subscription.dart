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
    // Flexible features parsing: support List<String>, List<dynamic>, or Map<String, bool>
    List<String> parseFeatures(dynamic raw) {
      if (raw == null) return const [];
      if (raw is List) {
        return raw.map((e) => e.toString()).toList();
      }
      if (raw is Map) {
        final map = Map<String, dynamic>.from(raw as Map);
        return map.entries
            .where((e) => e.value == true || e.value?.toString().toLowerCase() == 'true')
            .map((e) => e.key)
            .toList();
      }
      return const [];
    }

    DateTime parseDate(dynamic value) {
      try {
        if (value == null) return DateTime.now();
        if (value is DateTime) return value;
        if (value is int) {
          final isSeconds = value.toString().length <= 10;
          return DateTime.fromMillisecondsSinceEpoch(isSeconds ? value * 1000 : value);
        }
        if (value is String) {
          final numVal = int.tryParse(value);
          if (numVal != null) {
            final isSeconds = value.length <= 10;
            return DateTime.fromMillisecondsSinceEpoch(isSeconds ? numVal * 1000 : numVal);
          }
          return DateTime.tryParse(value) ?? DateTime.now();
        }
        if (value is Map) {
          final map = Map<String, dynamic>.from(value as Map);
          if (map['seconds'] is int) {
            return DateTime.fromMillisecondsSinceEpoch((map['seconds'] as int) * 1000);
          }
          if (map['milliseconds'] is int) {
            return DateTime.fromMillisecondsSinceEpoch(map['milliseconds'] as int);
          }
          if (map['ms'] is int) {
            return DateTime.fromMillisecondsSinceEpoch(map['ms'] as int);
          }
          if (map['iso'] is String) {
            return DateTime.tryParse(map['iso'] as String) ?? DateTime.now();
          }
        }
        return DateTime.now();
      } catch (_) {
        return DateTime.now();
      }
    }

    double parsePrice(dynamic value) {
      if (value is num) return value.toDouble();
      if (value is String) return double.tryParse(value) ?? 0.0;
      return 0.0;
    }

    return Subscription(
      id: (json["_id"] ?? json["id"] ?? '').toString(),
      name: json["name"]?.toString() ?? 'Plan',
      type: json["type"]?.toString() ?? 'basic',
      price: parsePrice(json["price"]),
      billingCycle: json["billingCycle"]?.toString() ?? 'monthly',
      features: parseFeatures(json["features"]),
      listingLimit: (json["listingLimit"] is int) ? json["listingLimit"] as int : int.tryParse('${json["listingLimit"]}') ?? 0,
      createdAt: parseDate(json["createdAt"]),
      updatedAt: parseDate(json["updatedAt"]),
      duration: (json["duration"] is int) ? json["duration"] as int : int.tryParse('${json["duration"]}') ?? 1,
      maxProperties: (json["maxProperties"] is int) ? json["maxProperties"] as int : int.tryParse('${json["maxProperties"]}') ?? -1,
      featuredProperties: (json["featuredProperties"] is int) ? json["featuredProperties"] as int : int.tryParse('${json["featuredProperties"]}') ?? 0,
      prioritySupport: json["prioritySupport"] == true || json["prioritySupport"]?.toString().toLowerCase() == 'true',
      analytics: json["analytics"] == true || json["analytics"]?.toString().toLowerCase() == 'true',
      customBranding: json["customBranding"] == true || json["customBranding"]?.toString().toLowerCase() == 'true',
    );
  }
}
