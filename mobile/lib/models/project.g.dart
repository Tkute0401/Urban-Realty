// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Project _$ProjectFromJson(Map<String, dynamic> json) => Project(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      shortDescription: json['shortDescription'] as String?,
      developerId: json['developerId'] as String,
      developerName: json['developerName'] as String,
      developerLogo: json['developerLogo'] as String?,
      status: $enumDecode(_$ProjectStatusEnumMap, json['status']),
      type: $enumDecode(_$ProjectTypeEnumMap, json['type']),
      category: $enumDecode(_$ProjectCategoryEnumMap, json['category']),
      location: json['location'] as String,
      address: json['address'] as String?,
      latitude: (json['latitude'] as num?)?.toDouble(),
      longitude: (json['longitude'] as num?)?.toDouble(),
      city: json['city'] as String,
      state: json['state'] as String,
      country: json['country'] as String,
      pincode: json['pincode'] as String?,
      amenities: (json['amenities'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      features: (json['features'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      tags:
          (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList() ??
              const [],
      pricing: ProjectPricing.fromJson(json['pricing'] as Map<String, dynamic>),
      timeline:
          ProjectTimeline.fromJson(json['timeline'] as Map<String, dynamic>),
      specifications: ProjectSpecifications.fromJson(
          json['specifications'] as Map<String, dynamic>),
      images: (json['images'] as List<dynamic>?)
              ?.map((e) => ProjectImage.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      documents: (json['documents'] as List<dynamic>?)
              ?.map((e) => ProjectDocument.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      contact: ProjectContact.fromJson(json['contact'] as Map<String, dynamic>),
      social: ProjectSocial.fromJson(json['social'] as Map<String, dynamic>),
      seo: ProjectSEO.fromJson(json['seo'] as Map<String, dynamic>),
      analytics:
          ProjectAnalytics.fromJson(json['analytics'] as Map<String, dynamic>),
      isActive: json['isActive'] as bool? ?? true,
      isFeatured: json['isFeatured'] as bool? ?? false,
      isVerified: json['isVerified'] as bool? ?? false,
      viewCount: (json['viewCount'] as num?)?.toInt() ?? 0,
      inquiryCount: (json['inquiryCount'] as num?)?.toInt() ?? 0,
      favoriteCount: (json['favoriteCount'] as num?)?.toInt() ?? 0,
      rating: (json['rating'] as num?)?.toDouble(),
      reviewCount: (json['reviewCount'] as num?)?.toInt() ?? 0,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      createdBy: json['createdBy'] as String?,
      updatedBy: json['updatedBy'] as String?,
    );

Map<String, dynamic> _$ProjectToJson(Project instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'shortDescription': instance.shortDescription,
      'developerId': instance.developerId,
      'developerName': instance.developerName,
      'developerLogo': instance.developerLogo,
      'status': _$ProjectStatusEnumMap[instance.status]!,
      'type': _$ProjectTypeEnumMap[instance.type]!,
      'category': _$ProjectCategoryEnumMap[instance.category]!,
      'location': instance.location,
      'address': instance.address,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'city': instance.city,
      'state': instance.state,
      'country': instance.country,
      'pincode': instance.pincode,
      'amenities': instance.amenities,
      'features': instance.features,
      'tags': instance.tags,
      'pricing': instance.pricing,
      'timeline': instance.timeline,
      'specifications': instance.specifications,
      'images': instance.images,
      'documents': instance.documents,
      'contact': instance.contact,
      'social': instance.social,
      'seo': instance.seo,
      'analytics': instance.analytics,
      'isActive': instance.isActive,
      'isFeatured': instance.isFeatured,
      'isVerified': instance.isVerified,
      'viewCount': instance.viewCount,
      'inquiryCount': instance.inquiryCount,
      'favoriteCount': instance.favoriteCount,
      'rating': instance.rating,
      'reviewCount': instance.reviewCount,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'createdBy': instance.createdBy,
      'updatedBy': instance.updatedBy,
    };

const _$ProjectStatusEnumMap = {
  ProjectStatus.planning: 'planning',
  ProjectStatus.underConstruction: 'under_construction',
  ProjectStatus.completed: 'completed',
  ProjectStatus.launched: 'launched',
  ProjectStatus.soldOut: 'sold_out',
  ProjectStatus.cancelled: 'cancelled',
};

const _$ProjectTypeEnumMap = {
  ProjectType.residential: 'residential',
  ProjectType.commercial: 'commercial',
  ProjectType.mixedUse: 'mixed_use',
  ProjectType.industrial: 'industrial',
  ProjectType.retail: 'retail',
  ProjectType.hospitality: 'hospitality',
};

const _$ProjectCategoryEnumMap = {
  ProjectCategory.luxury: 'luxury',
  ProjectCategory.premium: 'premium',
  ProjectCategory.midRange: 'mid_range',
  ProjectCategory.affordable: 'affordable',
  ProjectCategory.budget: 'budget',
};

ProjectPricing _$ProjectPricingFromJson(Map<String, dynamic> json) =>
    ProjectPricing(
      minPrice: (json['minPrice'] as num?)?.toDouble(),
      maxPrice: (json['maxPrice'] as num?)?.toDouble(),
      pricePerSqft: (json['pricePerSqft'] as num?)?.toDouble(),
      currency: json['currency'] as String? ?? 'INR',
      breakdown: (json['breakdown'] as List<dynamic>?)
              ?.map((e) => PriceBreakdown.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      paymentPlans: (json['paymentPlans'] as List<dynamic>?)
              ?.map((e) => PaymentPlan.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      offers: (json['offers'] as List<dynamic>?)
              ?.map((e) => Offer.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
    );

Map<String, dynamic> _$ProjectPricingToJson(ProjectPricing instance) =>
    <String, dynamic>{
      'minPrice': instance.minPrice,
      'maxPrice': instance.maxPrice,
      'pricePerSqft': instance.pricePerSqft,
      'currency': instance.currency,
      'breakdown': instance.breakdown,
      'paymentPlans': instance.paymentPlans,
      'offers': instance.offers,
    };

PriceBreakdown _$PriceBreakdownFromJson(Map<String, dynamic> json) =>
    PriceBreakdown(
      name: json['name'] as String,
      amount: (json['amount'] as num).toDouble(),
      description: json['description'] as String,
    );

Map<String, dynamic> _$PriceBreakdownToJson(PriceBreakdown instance) =>
    <String, dynamic>{
      'name': instance.name,
      'amount': instance.amount,
      'description': instance.description,
    };

PaymentPlan _$PaymentPlanFromJson(Map<String, dynamic> json) => PaymentPlan(
      name: json['name'] as String,
      description: json['description'] as String,
      milestones: (json['milestones'] as List<dynamic>)
          .map((e) => PaymentMilestone.fromJson(e as Map<String, dynamic>))
          .toList(),
      totalPercentage: (json['totalPercentage'] as num).toDouble(),
    );

Map<String, dynamic> _$PaymentPlanToJson(PaymentPlan instance) =>
    <String, dynamic>{
      'name': instance.name,
      'description': instance.description,
      'milestones': instance.milestones,
      'totalPercentage': instance.totalPercentage,
    };

PaymentMilestone _$PaymentMilestoneFromJson(Map<String, dynamic> json) =>
    PaymentMilestone(
      name: json['name'] as String,
      percentage: (json['percentage'] as num).toDouble(),
      description: json['description'] as String,
      dueDate: json['dueDate'] == null
          ? null
          : DateTime.parse(json['dueDate'] as String),
    );

Map<String, dynamic> _$PaymentMilestoneToJson(PaymentMilestone instance) =>
    <String, dynamic>{
      'name': instance.name,
      'percentage': instance.percentage,
      'description': instance.description,
      'dueDate': instance.dueDate?.toIso8601String(),
    };

Offer _$OfferFromJson(Map<String, dynamic> json) => Offer(
      title: json['title'] as String,
      description: json['description'] as String,
      type: json['type'] as String,
      discount: (json['discount'] as num?)?.toDouble(),
      validUntil: json['validUntil'] == null
          ? null
          : DateTime.parse(json['validUntil'] as String),
      terms:
          (json['terms'] as List<dynamic>?)?.map((e) => e as String).toList() ??
              const [],
    );

Map<String, dynamic> _$OfferToJson(Offer instance) => <String, dynamic>{
      'title': instance.title,
      'description': instance.description,
      'type': instance.type,
      'discount': instance.discount,
      'validUntil': instance.validUntil?.toIso8601String(),
      'terms': instance.terms,
    };

ProjectTimeline _$ProjectTimelineFromJson(Map<String, dynamic> json) =>
    ProjectTimeline(
      startDate: DateTime.parse(json['startDate'] as String),
      completionDate: json['completionDate'] == null
          ? null
          : DateTime.parse(json['completionDate'] as String),
      phases: (json['phases'] as List<dynamic>?)
              ?.map((e) => ProjectPhase.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      description: json['description'] as String?,
    );

Map<String, dynamic> _$ProjectTimelineToJson(ProjectTimeline instance) =>
    <String, dynamic>{
      'startDate': instance.startDate.toIso8601String(),
      'completionDate': instance.completionDate?.toIso8601String(),
      'phases': instance.phases,
      'description': instance.description,
    };

ProjectPhase _$ProjectPhaseFromJson(Map<String, dynamic> json) => ProjectPhase(
      name: json['name'] as String,
      description: json['description'] as String,
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: json['endDate'] == null
          ? null
          : DateTime.parse(json['endDate'] as String),
      completionPercentage: (json['completionPercentage'] as num).toDouble(),
      milestones: (json['milestones'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
    );

Map<String, dynamic> _$ProjectPhaseToJson(ProjectPhase instance) =>
    <String, dynamic>{
      'name': instance.name,
      'description': instance.description,
      'startDate': instance.startDate.toIso8601String(),
      'endDate': instance.endDate?.toIso8601String(),
      'completionPercentage': instance.completionPercentage,
      'milestones': instance.milestones,
    };

ProjectSpecifications _$ProjectSpecificationsFromJson(
        Map<String, dynamic> json) =>
    ProjectSpecifications(
      totalUnits: (json['totalUnits'] as num).toInt(),
      totalFloors: (json['totalFloors'] as num).toInt(),
      totalTowers: (json['totalTowers'] as num).toInt(),
      totalArea: (json['totalArea'] as num).toDouble(),
      builtUpArea: (json['builtUpArea'] as num).toDouble(),
      carpetArea: (json['carpetArea'] as num).toDouble(),
      plotArea: (json['plotArea'] as num).toDouble(),
      unitType: json['unitType'] as String,
      configuration: json['configuration'] as String,
      unitSpecifications: (json['unitSpecifications'] as List<dynamic>?)
              ?.map(
                  (e) => UnitSpecification.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      floorPlans: (json['floorPlans'] as List<dynamic>?)
              ?.map((e) => FloorPlan.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
    );

Map<String, dynamic> _$ProjectSpecificationsToJson(
        ProjectSpecifications instance) =>
    <String, dynamic>{
      'totalUnits': instance.totalUnits,
      'totalFloors': instance.totalFloors,
      'totalTowers': instance.totalTowers,
      'totalArea': instance.totalArea,
      'builtUpArea': instance.builtUpArea,
      'carpetArea': instance.carpetArea,
      'plotArea': instance.plotArea,
      'unitType': instance.unitType,
      'configuration': instance.configuration,
      'unitSpecifications': instance.unitSpecifications,
      'floorPlans': instance.floorPlans,
    };

UnitSpecification _$UnitSpecificationFromJson(Map<String, dynamic> json) =>
    UnitSpecification(
      type: json['type'] as String,
      area: (json['area'] as num).toDouble(),
      bedrooms: (json['bedrooms'] as num).toInt(),
      bathrooms: (json['bathrooms'] as num).toInt(),
      balconies: (json['balconies'] as num).toInt(),
      facing: json['facing'] as String,
      price: (json['price'] as num).toDouble(),
      availableUnits: (json['availableUnits'] as num).toInt(),
    );

Map<String, dynamic> _$UnitSpecificationToJson(UnitSpecification instance) =>
    <String, dynamic>{
      'type': instance.type,
      'area': instance.area,
      'bedrooms': instance.bedrooms,
      'bathrooms': instance.bathrooms,
      'balconies': instance.balconies,
      'facing': instance.facing,
      'price': instance.price,
      'availableUnits': instance.availableUnits,
    };

FloorPlan _$FloorPlanFromJson(Map<String, dynamic> json) => FloorPlan(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      imageUrl: json['imageUrl'] as String,
      unitType: json['unitType'] as String,
      area: (json['area'] as num).toDouble(),
      bedrooms: (json['bedrooms'] as num).toInt(),
      bathrooms: (json['bathrooms'] as num).toInt(),
    );

Map<String, dynamic> _$FloorPlanToJson(FloorPlan instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'imageUrl': instance.imageUrl,
      'unitType': instance.unitType,
      'area': instance.area,
      'bedrooms': instance.bedrooms,
      'bathrooms': instance.bathrooms,
    };

ProjectImage _$ProjectImageFromJson(Map<String, dynamic> json) => ProjectImage(
      id: json['id'] as String,
      url: json['url'] as String,
      thumbnailUrl: json['thumbnailUrl'] as String?,
      caption: json['caption'] as String?,
      type: $enumDecode(_$ImageTypeEnumMap, json['type']),
      isPrimary: json['isPrimary'] as bool? ?? false,
      order: (json['order'] as num?)?.toInt() ?? 0,
    );

Map<String, dynamic> _$ProjectImageToJson(ProjectImage instance) =>
    <String, dynamic>{
      'id': instance.id,
      'url': instance.url,
      'thumbnailUrl': instance.thumbnailUrl,
      'caption': instance.caption,
      'type': _$ImageTypeEnumMap[instance.type]!,
      'isPrimary': instance.isPrimary,
      'order': instance.order,
    };

const _$ImageTypeEnumMap = {
  ImageType.exterior: 'exterior',
  ImageType.interior: 'interior',
  ImageType.amenity: 'amenity',
  ImageType.floorPlan: 'floor_plan',
  ImageType.location: 'location',
  ImageType.other: 'other',
};

ProjectDocument _$ProjectDocumentFromJson(Map<String, dynamic> json) =>
    ProjectDocument(
      id: json['id'] as String,
      name: json['name'] as String,
      url: json['url'] as String,
      type: json['type'] as String,
      description: json['description'] as String?,
      size: (json['size'] as num).toInt(),
      uploadedAt: DateTime.parse(json['uploadedAt'] as String),
    );

Map<String, dynamic> _$ProjectDocumentToJson(ProjectDocument instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'url': instance.url,
      'type': instance.type,
      'description': instance.description,
      'size': instance.size,
      'uploadedAt': instance.uploadedAt.toIso8601String(),
    };

ProjectContact _$ProjectContactFromJson(Map<String, dynamic> json) =>
    ProjectContact(
      phone: json['phone'] as String,
      email: json['email'] as String,
      website: json['website'] as String?,
      address: json['address'] as String?,
      city: json['city'] as String?,
      state: json['state'] as String?,
      pincode: json['pincode'] as String?,
      country: json['country'] as String?,
    );

Map<String, dynamic> _$ProjectContactToJson(ProjectContact instance) =>
    <String, dynamic>{
      'phone': instance.phone,
      'email': instance.email,
      'website': instance.website,
      'address': instance.address,
      'city': instance.city,
      'state': instance.state,
      'pincode': instance.pincode,
      'country': instance.country,
    };

ProjectSocial _$ProjectSocialFromJson(Map<String, dynamic> json) =>
    ProjectSocial(
      facebook: json['facebook'] as String?,
      twitter: json['twitter'] as String?,
      instagram: json['instagram'] as String?,
      linkedin: json['linkedin'] as String?,
      youtube: json['youtube'] as String?,
      website: json['website'] as String?,
    );

Map<String, dynamic> _$ProjectSocialToJson(ProjectSocial instance) =>
    <String, dynamic>{
      'facebook': instance.facebook,
      'twitter': instance.twitter,
      'instagram': instance.instagram,
      'linkedin': instance.linkedin,
      'youtube': instance.youtube,
      'website': instance.website,
    };

ProjectSEO _$ProjectSEOFromJson(Map<String, dynamic> json) => ProjectSEO(
      title: json['title'] as String,
      description: json['description'] as String,
      keywords: (json['keywords'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      canonicalUrl: json['canonicalUrl'] as String?,
      ogImage: json['ogImage'] as String?,
      twitterCard: json['twitterCard'] as String?,
    );

Map<String, dynamic> _$ProjectSEOToJson(ProjectSEO instance) =>
    <String, dynamic>{
      'title': instance.title,
      'description': instance.description,
      'keywords': instance.keywords,
      'canonicalUrl': instance.canonicalUrl,
      'ogImage': instance.ogImage,
      'twitterCard': instance.twitterCard,
    };

ProjectAnalytics _$ProjectAnalyticsFromJson(Map<String, dynamic> json) =>
    ProjectAnalytics(
      totalViews: (json['totalViews'] as num?)?.toInt() ?? 0,
      uniqueViews: (json['uniqueViews'] as num?)?.toInt() ?? 0,
      inquiries: (json['inquiries'] as num?)?.toInt() ?? 0,
      favorites: (json['favorites'] as num?)?.toInt() ?? 0,
      shares: (json['shares'] as num?)?.toInt() ?? 0,
      averageTimeOnPage: (json['averageTimeOnPage'] as num?)?.toDouble() ?? 0.0,
      topSources: (json['topSources'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      viewsByDate: (json['viewsByDate'] as Map<String, dynamic>?)?.map(
            (k, e) => MapEntry(k, (e as num).toInt()),
          ) ??
          const {},
    );

Map<String, dynamic> _$ProjectAnalyticsToJson(ProjectAnalytics instance) =>
    <String, dynamic>{
      'totalViews': instance.totalViews,
      'uniqueViews': instance.uniqueViews,
      'inquiries': instance.inquiries,
      'favorites': instance.favorites,
      'shares': instance.shares,
      'averageTimeOnPage': instance.averageTimeOnPage,
      'topSources': instance.topSources,
      'viewsByDate': instance.viewsByDate,
    };
