import 'package:json_annotation/json_annotation.dart';

part 'project.g.dart';

/// Project model representing a real estate development project
@JsonSerializable()
class Project {
  final String id;
  final String name;
  final String description;
  final String? shortDescription;
  final String developerId;
  final String developerName;
  final String? developerLogo;
  final ProjectStatus status;
  final ProjectType type;
  final ProjectCategory category;
  final String location;
  final String? address;
  final double? latitude;
  final double? longitude;
  final String city;
  final String state;
  final String country;
  final String? pincode;
  final List<String> amenities;
  final List<String> features;
  final List<String> tags;
  final ProjectPricing pricing;
  final ProjectTimeline timeline;
  final ProjectSpecifications specifications;
  final List<ProjectImage> images;
  final List<ProjectDocument> documents;
  final ProjectContact contact;
  final ProjectSocial social;
  final ProjectSEO seo;
  final ProjectAnalytics analytics;
  final bool isActive;
  final bool isFeatured;
  final bool isVerified;
  final int viewCount;
  final int inquiryCount;
  final int favoriteCount;
  final double? rating;
  final int reviewCount;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String? createdBy;
  final String? updatedBy;

  Project({
    required this.id,
    required this.name,
    required this.description,
    this.shortDescription,
    required this.developerId,
    required this.developerName,
    this.developerLogo,
    required this.status,
    required this.type,
    required this.category,
    required this.location,
    this.address,
    this.latitude,
    this.longitude,
    required this.city,
    required this.state,
    required this.country,
    this.pincode,
    this.amenities = const [],
    this.features = const [],
    this.tags = const [],
    required this.pricing,
    required this.timeline,
    required this.specifications,
    this.images = const [],
    this.documents = const [],
    required this.contact,
    required this.social,
    required this.seo,
    required this.analytics,
    this.isActive = true,
    this.isFeatured = false,
    this.isVerified = false,
    this.viewCount = 0,
    this.inquiryCount = 0,
    this.favoriteCount = 0,
    this.rating,
    this.reviewCount = 0,
    required this.createdAt,
    required this.updatedAt,
    this.createdBy,
    this.updatedBy,
  });

  factory Project.fromJson(Map<String, dynamic> json) => _$ProjectFromJson(json);
  Map<String, dynamic> toJson() => _$ProjectToJson(this);

  Project copyWith({
    String? id,
    String? name,
    String? description,
    String? shortDescription,
    String? developerId,
    String? developerName,
    String? developerLogo,
    ProjectStatus? status,
    ProjectType? type,
    ProjectCategory? category,
    String? location,
    String? address,
    double? latitude,
    double? longitude,
    String? city,
    String? state,
    String? country,
    String? pincode,
    List<String>? amenities,
    List<String>? features,
    List<String>? tags,
    ProjectPricing? pricing,
    ProjectTimeline? timeline,
    ProjectSpecifications? specifications,
    List<ProjectImage>? images,
    List<ProjectDocument>? documents,
    ProjectContact? contact,
    ProjectSocial? social,
    ProjectSEO? seo,
    ProjectAnalytics? analytics,
    bool? isActive,
    bool? isFeatured,
    bool? isVerified,
    int? viewCount,
    int? inquiryCount,
    int? favoriteCount,
    double? rating,
    int? reviewCount,
    DateTime? createdAt,
    DateTime? updatedAt,
    String? createdBy,
    String? updatedBy,
  }) {
    return Project(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      shortDescription: shortDescription ?? this.shortDescription,
      developerId: developerId ?? this.developerId,
      developerName: developerName ?? this.developerName,
      developerLogo: developerLogo ?? this.developerLogo,
      status: status ?? this.status,
      type: type ?? this.type,
      category: category ?? this.category,
      location: location ?? this.location,
      address: address ?? this.address,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      city: city ?? this.city,
      state: state ?? this.state,
      country: country ?? this.country,
      pincode: pincode ?? this.pincode,
      amenities: amenities ?? this.amenities,
      features: features ?? this.features,
      tags: tags ?? this.tags,
      pricing: pricing ?? this.pricing,
      timeline: timeline ?? this.timeline,
      specifications: specifications ?? this.specifications,
      images: images ?? this.images,
      documents: documents ?? this.documents,
      contact: contact ?? this.contact,
      social: social ?? this.social,
      seo: seo ?? this.seo,
      analytics: analytics ?? this.analytics,
      isActive: isActive ?? this.isActive,
      isFeatured: isFeatured ?? this.isFeatured,
      isVerified: isVerified ?? this.isVerified,
      viewCount: viewCount ?? this.viewCount,
      inquiryCount: inquiryCount ?? this.inquiryCount,
      favoriteCount: favoriteCount ?? this.favoriteCount,
      rating: rating ?? this.rating,
      reviewCount: reviewCount ?? this.reviewCount,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      createdBy: createdBy ?? this.createdBy,
      updatedBy: updatedBy ?? this.updatedBy,
    );
  }

  /// Get primary image
  String? get primaryImage {
    final primary = images.where((img) => img.isPrimary).firstOrNull;
    return primary?.url ?? images.firstOrNull?.url;
  }

  /// Get formatted price range
  String get formattedPriceRange {
    if (pricing.minPrice == null || pricing.maxPrice == null) {
      return 'Price on request';
    }
    return '₹${_formatPrice(pricing.minPrice!)} - ₹${_formatPrice(pricing.maxPrice!)}';
  }

  /// Get formatted price per sqft
  String get formattedPricePerSqft {
    if (pricing.pricePerSqft == null) {
      return 'Price on request';
    }
    return '₹${_formatPrice(pricing.pricePerSqft!)} per sqft';
  }

  /// Get completion status percentage
  double get completionPercentage {
    if (timeline.completionDate == null) {
      return 0.0;
    }
    final now = DateTime.now();
    final start = timeline.startDate;
    final end = timeline.completionDate!;
    
    if (now.isBefore(start)) return 0.0;
    if (now.isAfter(end)) return 100.0;
    
    final total = end.difference(start).inDays;
    final elapsed = now.difference(start).inDays;
    return (elapsed / total * 100).clamp(0.0, 100.0);
  }

  /// Get status display text
  String get statusDisplayText {
    switch (status) {
      case ProjectStatus.planning:
        return 'Planning';
      case ProjectStatus.underConstruction:
        return 'Under Construction';
      case ProjectStatus.completed:
        return 'Completed';
      case ProjectStatus.launched:
        return 'Launched';
      case ProjectStatus.soldOut:
        return 'Sold Out';
      case ProjectStatus.cancelled:
        return 'Cancelled';
    }
  }

  /// Get type display text
  String get typeDisplayText {
    switch (type) {
      case ProjectType.residential:
        return 'Residential';
      case ProjectType.commercial:
        return 'Commercial';
      case ProjectType.mixedUse:
        return 'Mixed Use';
      case ProjectType.industrial:
        return 'Industrial';
      case ProjectType.retail:
        return 'Retail';
      case ProjectType.hospitality:
        return 'Hospitality';
    }
  }

  /// Get category display text
  String get categoryDisplayText {
    switch (category) {
      case ProjectCategory.luxury:
        return 'Luxury';
      case ProjectCategory.premium:
        return 'Premium';
      case ProjectCategory.midRange:
        return 'Mid Range';
      case ProjectCategory.affordable:
        return 'Affordable';
      case ProjectCategory.budget:
        return 'Budget';
    }
  }

  /// Format price with commas
  String _formatPrice(double price) {
    if (price >= 10000000) {
      return '${(price / 10000000).toStringAsFixed(1)}Cr';
    } else if (price >= 100000) {
      return '${(price / 100000).toStringAsFixed(1)}L';
    } else if (price >= 1000) {
      return '${(price / 1000).toStringAsFixed(1)}K';
    } else {
      return price.toStringAsFixed(0);
    }
  }
}

/// Project status enum
@JsonEnum()
enum ProjectStatus {
  @JsonValue('planning')
  planning,
  @JsonValue('under_construction')
  underConstruction,
  @JsonValue('completed')
  completed,
  @JsonValue('launched')
  launched,
  @JsonValue('sold_out')
  soldOut,
  @JsonValue('cancelled')
  cancelled,
}

/// Project type enum
@JsonEnum()
enum ProjectType {
  @JsonValue('residential')
  residential,
  @JsonValue('commercial')
  commercial,
  @JsonValue('mixed_use')
  mixedUse,
  @JsonValue('industrial')
  industrial,
  @JsonValue('retail')
  retail,
  @JsonValue('hospitality')
  hospitality,
}

/// Project category enum
@JsonEnum()
enum ProjectCategory {
  @JsonValue('luxury')
  luxury,
  @JsonValue('premium')
  premium,
  @JsonValue('mid_range')
  midRange,
  @JsonValue('affordable')
  affordable,
  @JsonValue('budget')
  budget,
}

/// Project pricing information
@JsonSerializable()
class ProjectPricing {
  final double? minPrice;
  final double? maxPrice;
  final double? pricePerSqft;
  final String currency;
  final List<PriceBreakdown> breakdown;
  final List<PaymentPlan> paymentPlans;
  final List<Offer> offers;

  ProjectPricing({
    this.minPrice,
    this.maxPrice,
    this.pricePerSqft,
    this.currency = 'INR',
    this.breakdown = const [],
    this.paymentPlans = const [],
    this.offers = const [],
  });

  factory ProjectPricing.fromJson(Map<String, dynamic> json) => _$ProjectPricingFromJson(json);
  Map<String, dynamic> toJson() => _$ProjectPricingToJson(this);
}

/// Price breakdown
@JsonSerializable()
class PriceBreakdown {
  final String name;
  final double amount;
  final String description;

  PriceBreakdown({
    required this.name,
    required this.amount,
    required this.description,
  });

  factory PriceBreakdown.fromJson(Map<String, dynamic> json) => _$PriceBreakdownFromJson(json);
  Map<String, dynamic> toJson() => _$PriceBreakdownToJson(this);
}

/// Payment plan
@JsonSerializable()
class PaymentPlan {
  final String name;
  final String description;
  final List<PaymentMilestone> milestones;
  final double totalPercentage;

  PaymentPlan({
    required this.name,
    required this.description,
    required this.milestones,
    required this.totalPercentage,
  });

  factory PaymentPlan.fromJson(Map<String, dynamic> json) => _$PaymentPlanFromJson(json);
  Map<String, dynamic> toJson() => _$PaymentPlanToJson(this);
}

/// Payment milestone
@JsonSerializable()
class PaymentMilestone {
  final String name;
  final double percentage;
  final String description;
  final DateTime? dueDate;

  PaymentMilestone({
    required this.name,
    required this.percentage,
    required this.description,
    this.dueDate,
  });

  factory PaymentMilestone.fromJson(Map<String, dynamic> json) => _$PaymentMilestoneFromJson(json);
  Map<String, dynamic> toJson() => _$PaymentMilestoneToJson(this);
}

/// Offer
@JsonSerializable()
class Offer {
  final String title;
  final String description;
  final String type;
  final double? discount;
  final DateTime? validUntil;
  final List<String> terms;

  Offer({
    required this.title,
    required this.description,
    required this.type,
    this.discount,
    this.validUntil,
    this.terms = const [],
  });

  factory Offer.fromJson(Map<String, dynamic> json) => _$OfferFromJson(json);
  Map<String, dynamic> toJson() => _$OfferToJson(this);
}

/// Project timeline
@JsonSerializable()
class ProjectTimeline {
  final DateTime startDate;
  final DateTime? completionDate;
  final List<ProjectPhase> phases;
  final String? description;

  ProjectTimeline({
    required this.startDate,
    this.completionDate,
    this.phases = const [],
    this.description,
  });

  factory ProjectTimeline.fromJson(Map<String, dynamic> json) => _$ProjectTimelineFromJson(json);
  Map<String, dynamic> toJson() => _$ProjectTimelineToJson(this);
}

/// Project phase
@JsonSerializable()
class ProjectPhase {
  final String name;
  final String description;
  final DateTime startDate;
  final DateTime? endDate;
  final double completionPercentage;
  final List<String> milestones;

  ProjectPhase({
    required this.name,
    required this.description,
    required this.startDate,
    this.endDate,
    required this.completionPercentage,
    this.milestones = const [],
  });

  factory ProjectPhase.fromJson(Map<String, dynamic> json) => _$ProjectPhaseFromJson(json);
  Map<String, dynamic> toJson() => _$ProjectPhaseToJson(this);
}

/// Project specifications
@JsonSerializable()
class ProjectSpecifications {
  final int totalUnits;
  final int totalFloors;
  final int totalTowers;
  final double totalArea;
  final double builtUpArea;
  final double carpetArea;
  final double plotArea;
  final String unitType;
  final String configuration;
  final List<UnitSpecification> unitSpecifications;
  final List<FloorPlan> floorPlans;

  ProjectSpecifications({
    required this.totalUnits,
    required this.totalFloors,
    required this.totalTowers,
    required this.totalArea,
    required this.builtUpArea,
    required this.carpetArea,
    required this.plotArea,
    required this.unitType,
    required this.configuration,
    this.unitSpecifications = const [],
    this.floorPlans = const [],
  });

  factory ProjectSpecifications.fromJson(Map<String, dynamic> json) => _$ProjectSpecificationsFromJson(json);
  Map<String, dynamic> toJson() => _$ProjectSpecificationsToJson(this);
}

/// Unit specification
@JsonSerializable()
class UnitSpecification {
  final String type;
  final double area;
  final int bedrooms;
  final int bathrooms;
  final int balconies;
  final String facing;
  final double price;
  final int availableUnits;

  UnitSpecification({
    required this.type,
    required this.area,
    required this.bedrooms,
    required this.bathrooms,
    required this.balconies,
    required this.facing,
    required this.price,
    required this.availableUnits,
  });

  factory UnitSpecification.fromJson(Map<String, dynamic> json) => _$UnitSpecificationFromJson(json);
  Map<String, dynamic> toJson() => _$UnitSpecificationToJson(this);
}

/// Floor plan
@JsonSerializable()
class FloorPlan {
  final String id;
  final String name;
  final String description;
  final String imageUrl;
  final String unitType;
  final double area;
  final int bedrooms;
  final int bathrooms;

  FloorPlan({
    required this.id,
    required this.name,
    required this.description,
    required this.imageUrl,
    required this.unitType,
    required this.area,
    required this.bedrooms,
    required this.bathrooms,
  });

  factory FloorPlan.fromJson(Map<String, dynamic> json) => _$FloorPlanFromJson(json);
  Map<String, dynamic> toJson() => _$FloorPlanToJson(this);
}

/// Project image
@JsonSerializable()
class ProjectImage {
  final String id;
  final String url;
  final String? thumbnailUrl;
  final String? caption;
  final ImageType type;
  final bool isPrimary;
  final int order;

  ProjectImage({
    required this.id,
    required this.url,
    this.thumbnailUrl,
    this.caption,
    required this.type,
    this.isPrimary = false,
    this.order = 0,
  });

  factory ProjectImage.fromJson(Map<String, dynamic> json) => _$ProjectImageFromJson(json);
  Map<String, dynamic> toJson() => _$ProjectImageToJson(this);
}

/// Image type enum
@JsonEnum()
enum ImageType {
  @JsonValue('exterior')
  exterior,
  @JsonValue('interior')
  interior,
  @JsonValue('amenity')
  amenity,
  @JsonValue('floor_plan')
  floorPlan,
  @JsonValue('location')
  location,
  @JsonValue('other')
  other,
}

/// Project document
@JsonSerializable()
class ProjectDocument {
  final String id;
  final String name;
  final String url;
  final String type;
  final String? description;
  final int size;
  final DateTime uploadedAt;

  ProjectDocument({
    required this.id,
    required this.name,
    required this.url,
    required this.type,
    this.description,
    required this.size,
    required this.uploadedAt,
  });

  factory ProjectDocument.fromJson(Map<String, dynamic> json) => _$ProjectDocumentFromJson(json);
  Map<String, dynamic> toJson() => _$ProjectDocumentToJson(this);
}

/// Project contact information
@JsonSerializable()
class ProjectContact {
  final String phone;
  final String email;
  final String? website;
  final String? address;
  final String? city;
  final String? state;
  final String? pincode;
  final String? country;

  ProjectContact({
    required this.phone,
    required this.email,
    this.website,
    this.address,
    this.city,
    this.state,
    this.pincode,
    this.country,
  });

  factory ProjectContact.fromJson(Map<String, dynamic> json) => _$ProjectContactFromJson(json);
  Map<String, dynamic> toJson() => _$ProjectContactToJson(this);
}

/// Project social media
@JsonSerializable()
class ProjectSocial {
  final String? facebook;
  final String? twitter;
  final String? instagram;
  final String? linkedin;
  final String? youtube;
  final String? website;

  ProjectSocial({
    this.facebook,
    this.twitter,
    this.instagram,
    this.linkedin,
    this.youtube,
    this.website,
  });

  factory ProjectSocial.fromJson(Map<String, dynamic> json) => _$ProjectSocialFromJson(json);
  Map<String, dynamic> toJson() => _$ProjectSocialToJson(this);
}

/// Project SEO information
@JsonSerializable()
class ProjectSEO {
  final String title;
  final String description;
  final List<String> keywords;
  final String? canonicalUrl;
  final String? ogImage;
  final String? twitterCard;

  ProjectSEO({
    required this.title,
    required this.description,
    this.keywords = const [],
    this.canonicalUrl,
    this.ogImage,
    this.twitterCard,
  });

  factory ProjectSEO.fromJson(Map<String, dynamic> json) => _$ProjectSEOFromJson(json);
  Map<String, dynamic> toJson() => _$ProjectSEOToJson(this);
}

/// Project analytics
@JsonSerializable()
class ProjectAnalytics {
  final int totalViews;
  final int uniqueViews;
  final int inquiries;
  final int favorites;
  final int shares;
  final double averageTimeOnPage;
  final List<String> topSources;
  final Map<String, int> viewsByDate;

  ProjectAnalytics({
    this.totalViews = 0,
    this.uniqueViews = 0,
    this.inquiries = 0,
    this.favorites = 0,
    this.shares = 0,
    this.averageTimeOnPage = 0.0,
    this.topSources = const [],
    this.viewsByDate = const {},
  });

  factory ProjectAnalytics.fromJson(Map<String, dynamic> json) => _$ProjectAnalyticsFromJson(json);
  Map<String, dynamic> toJson() => _$ProjectAnalyticsToJson(this);
}


