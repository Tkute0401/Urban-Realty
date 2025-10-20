import 'package:json_annotation/json_annotation.dart';

part 'property_calculator_models.g.dart';

/// Property calculator model for various calculations
@JsonSerializable()
class PropertyCalculator {
  final String id;
  final String propertyId;
  final double propertyPrice;
  final double downPayment;
  final double loanAmount;
  final double interestRate;
  final int loanTenure; // in months
  final double monthlyEMI;
  final double totalInterest;
  final double totalAmount;
  final double processingFee;
  final double registrationFee;
  final double stampDuty;
  final double gst;
  final double totalCharges;
  final double totalCost;
  final DateTime createdAt;
  final DateTime updatedAt;

  const PropertyCalculator({
    required this.id,
    required this.propertyId,
    required this.propertyPrice,
    required this.downPayment,
    required this.loanAmount,
    required this.interestRate,
    required this.loanTenure,
    required this.monthlyEMI,
    required this.totalInterest,
    required this.totalAmount,
    required this.processingFee,
    required this.registrationFee,
    required this.stampDuty,
    required this.gst,
    required this.totalCharges,
    required this.totalCost,
    required this.createdAt,
    required this.updatedAt,
  });

  factory PropertyCalculator.fromJson(Map<String, dynamic> json) => _$PropertyCalculatorFromJson(json);
  Map<String, dynamic> toJson() => _$PropertyCalculatorToJson(this);

  PropertyCalculator copyWith({
    String? id,
    String? propertyId,
    double? propertyPrice,
    double? downPayment,
    double? loanAmount,
    double? interestRate,
    int? loanTenure,
    double? monthlyEMI,
    double? totalInterest,
    double? totalAmount,
    double? processingFee,
    double? registrationFee,
    double? stampDuty,
    double? gst,
    double? totalCharges,
    double? totalCost,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return PropertyCalculator(
      id: id ?? this.id,
      propertyId: propertyId ?? this.propertyId,
      propertyPrice: propertyPrice ?? this.propertyPrice,
      downPayment: downPayment ?? this.downPayment,
      loanAmount: loanAmount ?? this.loanAmount,
      interestRate: interestRate ?? this.interestRate,
      loanTenure: loanTenure ?? this.loanTenure,
      monthlyEMI: monthlyEMI ?? this.monthlyEMI,
      totalInterest: totalInterest ?? this.totalInterest,
      totalAmount: totalAmount ?? this.totalAmount,
      processingFee: processingFee ?? this.processingFee,
      registrationFee: registrationFee ?? this.registrationFee,
      stampDuty: stampDuty ?? this.stampDuty,
      gst: gst ?? this.gst,
      totalCharges: totalCharges ?? this.totalCharges,
      totalCost: totalCost ?? this.totalCost,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

/// EMI calculation model
@JsonSerializable()
class EMICalculation {
  final double principal;
  final double interestRate;
  final int tenureMonths;
  final double monthlyEMI;
  final double totalInterest;
  final double totalAmount;
  final List<EMISchedule> schedule;

  const EMICalculation({
    required this.principal,
    required this.interestRate,
    required this.tenureMonths,
    required this.monthlyEMI,
    required this.totalInterest,
    required this.totalAmount,
    required this.schedule,
  });

  factory EMICalculation.fromJson(Map<String, dynamic> json) => _$EMICalculationFromJson(json);
  Map<String, dynamic> toJson() => _$EMICalculationToJson(this);
}

/// EMI schedule entry
@JsonSerializable()
class EMISchedule {
  final int month;
  final double principal;
  final double interest;
  final double emi;
  final double balance;

  const EMISchedule({
    required this.month,
    required this.principal,
    required this.interest,
    required this.emi,
    required this.balance,
  });

  factory EMISchedule.fromJson(Map<String, dynamic> json) => _$EMIScheduleFromJson(json);
  Map<String, dynamic> toJson() => _$EMIScheduleToJson(this);
}

/// Property investment analysis model
@JsonSerializable()
class InvestmentAnalysis {
  final String id;
  final String propertyId;
  final double currentValue;
  final double purchasePrice;
  final double appreciationRate;
  final double rentalYield;
  final double monthlyRent;
  final double annualRent;
  final double netYield;
  final double roi;
  final int holdingPeriod; // in years
  final double futureValue;
  final double totalGain;
  final double annualizedReturn;
  final DateTime analysisDate;

  const InvestmentAnalysis({
    required this.id,
    required this.propertyId,
    required this.currentValue,
    required this.purchasePrice,
    required this.appreciationRate,
    required this.rentalYield,
    required this.monthlyRent,
    required this.annualRent,
    required this.netYield,
    required this.roi,
    required this.holdingPeriod,
    required this.futureValue,
    required this.totalGain,
    required this.annualizedReturn,
    required this.analysisDate,
  });

  factory InvestmentAnalysis.fromJson(Map<String, dynamic> json) => _$InvestmentAnalysisFromJson(json);
  Map<String, dynamic> toJson() => _$InvestmentAnalysisToJson(this);
}

/// Property comparison model
@JsonSerializable()
class PropertyComparison {
  final String id;
  final List<String> propertyIds;
  final List<PropertyComparisonItem> properties;
  final ComparisonCriteria criteria;
  final DateTime createdAt;

  const PropertyComparison({
    required this.id,
    required this.propertyIds,
    required this.properties,
    required this.criteria,
    required this.createdAt,
  });

  factory PropertyComparison.fromJson(Map<String, dynamic> json) => _$PropertyComparisonFromJson(json);
  Map<String, dynamic> toJson() => _$PropertyComparisonToJson(this);
}

/// Property comparison item
@JsonSerializable()
class PropertyComparisonItem {
  final String propertyId;
  final String propertyName;
  final double price;
  final double pricePerSqFt;
  final double area;
  final String location;
  final double rating;
  final List<String> amenities;
  final Map<String, dynamic> features;

  const PropertyComparisonItem({
    required this.propertyId,
    required this.propertyName,
    required this.price,
    required this.pricePerSqFt,
    required this.area,
    required this.location,
    required this.rating,
    required this.amenities,
    required this.features,
  });

  factory PropertyComparisonItem.fromJson(Map<String, dynamic> json) => _$PropertyComparisonItemFromJson(json);
  Map<String, dynamic> toJson() => _$PropertyComparisonItemToJson(this);
}

/// Comparison criteria
@JsonSerializable()
class ComparisonCriteria {
  final List<String> priceRange;
  final List<String> location;
  final List<String> propertyType;
  final List<String> amenities;
  final double minRating;
  final double maxPrice;
  final double minArea;
  final double maxArea;

  const ComparisonCriteria({
    required this.priceRange,
    required this.location,
    required this.propertyType,
    required this.amenities,
    required this.minRating,
    required this.maxPrice,
    required this.minArea,
    required this.maxArea,
  });

  factory ComparisonCriteria.fromJson(Map<String, dynamic> json) => _$ComparisonCriteriaFromJson(json);
  Map<String, dynamic> toJson() => _$ComparisonCriteriaToJson(this);
}

/// Virtual tour model
@JsonSerializable()
class VirtualTour {
  final String id;
  final String propertyId;
  final String title;
  final String description;
  final String thumbnailUrl;
  final String tourUrl;
  final VirtualTourType type;
  final int duration; // in seconds
  final List<String> hotspots;
  final Map<String, dynamic> metadata;
  final DateTime createdAt;
  final DateTime updatedAt;

  const VirtualTour({
    required this.id,
    required this.propertyId,
    required this.title,
    required this.description,
    required this.thumbnailUrl,
    required this.tourUrl,
    required this.type,
    required this.duration,
    required this.hotspots,
    required this.metadata,
    required this.createdAt,
    required this.updatedAt,
  });

  factory VirtualTour.fromJson(Map<String, dynamic> json) => _$VirtualTourFromJson(json);
  Map<String, dynamic> toJson() => _$VirtualTourToJson(this);
}

/// Virtual tour hotspot
@JsonSerializable()
class VirtualTourHotspot {
  final String id;
  final String tourId;
  final String title;
  final String description;
  final double x;
  final double y;
  final double z;
  final String? imageUrl;
  final String? videoUrl;
  final String? audioUrl;
  final Map<String, dynamic> metadata;

  const VirtualTourHotspot({
    required this.id,
    required this.tourId,
    required this.title,
    required this.description,
    required this.x,
    required this.y,
    required this.z,
    this.imageUrl,
    this.videoUrl,
    this.audioUrl,
    required this.metadata,
  });

  factory VirtualTourHotspot.fromJson(Map<String, dynamic> json) => _$VirtualTourHotspotFromJson(json);
  Map<String, dynamic> toJson() => _$VirtualTourHotspotToJson(this);
}

/// Neighborhood insights model
@JsonSerializable()
class NeighborhoodInsights {
  final String id;
  final String propertyId;
  final String area;
  final String city;
  final String state;
  final String country;
  final double latitude;
  final double longitude;
  final List<NearbyAmenity> amenities;
  final List<Transportation> transportation;
  final List<Education> education;
  final List<Healthcare> healthcare;
  final List<Shopping> shopping;
  final List<Entertainment> entertainment;
  final SafetyScore safetyScore;
  final CrimeRate crimeRate;
  final PropertyTrends propertyTrends;
  final MarketAnalysis marketAnalysis;
  final DateTime lastUpdated;

  const NeighborhoodInsights({
    required this.id,
    required this.propertyId,
    required this.area,
    required this.city,
    required this.state,
    required this.country,
    required this.latitude,
    required this.longitude,
    required this.amenities,
    required this.transportation,
    required this.education,
    required this.healthcare,
    required this.shopping,
    required this.entertainment,
    required this.safetyScore,
    required this.crimeRate,
    required this.propertyTrends,
    required this.marketAnalysis,
    required this.lastUpdated,
  });

  factory NeighborhoodInsights.fromJson(Map<String, dynamic> json) => _$NeighborhoodInsightsFromJson(json);
  Map<String, dynamic> toJson() => _$NeighborhoodInsightsToJson(this);
}

/// Nearby amenity model
@JsonSerializable()
class NearbyAmenity {
  final String id;
  final String name;
  final String type;
  final String category;
  final double distance; // in km
  final double rating;
  final String? address;
  final String? phone;
  final String? website;
  final List<String> features;
  final Map<String, dynamic> metadata;

  const NearbyAmenity({
    required this.id,
    required this.name,
    required this.type,
    required this.category,
    required this.distance,
    required this.rating,
    this.address,
    this.phone,
    this.website,
    required this.features,
    required this.metadata,
  });

  factory NearbyAmenity.fromJson(Map<String, dynamic> json) => _$NearbyAmenityFromJson(json);
  Map<String, dynamic> toJson() => _$NearbyAmenityToJson(this);
}

/// Transportation model
@JsonSerializable()
class Transportation {
  final String id;
  final String name;
  final String type;
  final double distance;
  final double walkingTime; // in minutes
  final double drivingTime; // in minutes
  final String? route;
  final String? frequency;
  final double? fare;
  final Map<String, dynamic> metadata;

  const Transportation({
    required this.id,
    required this.name,
    required this.type,
    required this.distance,
    required this.walkingTime,
    required this.drivingTime,
    this.route,
    this.frequency,
    this.fare,
    required this.metadata,
  });

  factory Transportation.fromJson(Map<String, dynamic> json) => _$TransportationFromJson(json);
  Map<String, dynamic> toJson() => _$TransportationToJson(this);
}

/// Education model
@JsonSerializable()
class Education {
  final String id;
  final String name;
  final String type;
  final String level;
  final double distance;
  final double rating;
  final String? address;
  final String? phone;
  final String? website;
  final List<String> programs;
  final Map<String, dynamic> metadata;

  const Education({
    required this.id,
    required this.name,
    required this.type,
    required this.level,
    required this.distance,
    required this.rating,
    this.address,
    this.phone,
    this.website,
    required this.programs,
    required this.metadata,
  });

  factory Education.fromJson(Map<String, dynamic> json) => _$EducationFromJson(json);
  Map<String, dynamic> toJson() => _$EducationToJson(this);
}

/// Healthcare model
@JsonSerializable()
class Healthcare {
  final String id;
  final String name;
  final String type;
  final String specialty;
  final double distance;
  final double rating;
  final String? address;
  final String? phone;
  final String? website;
  final List<String> services;
  final Map<String, dynamic> metadata;

  const Healthcare({
    required this.id,
    required this.name,
    required this.type,
    required this.specialty,
    required this.distance,
    required this.rating,
    this.address,
    this.phone,
    this.website,
    required this.services,
    required this.metadata,
  });

  factory Healthcare.fromJson(Map<String, dynamic> json) => _$HealthcareFromJson(json);
  Map<String, dynamic> toJson() => _$HealthcareToJson(this);
}

/// Shopping model
@JsonSerializable()
class Shopping {
  final String id;
  final String name;
  final String type;
  final String category;
  final double distance;
  final double rating;
  final String? address;
  final String? phone;
  final String? website;
  final List<String> brands;
  final Map<String, dynamic> metadata;

  const Shopping({
    required this.id,
    required this.name,
    required this.type,
    required this.category,
    required this.distance,
    required this.rating,
    this.address,
    this.phone,
    this.website,
    required this.brands,
    required this.metadata,
  });

  factory Shopping.fromJson(Map<String, dynamic> json) => _$ShoppingFromJson(json);
  Map<String, dynamic> toJson() => _$ShoppingToJson(this);
}

/// Entertainment model
@JsonSerializable()
class Entertainment {
  final String id;
  final String name;
  final String type;
  final String category;
  final double distance;
  final double rating;
  final String? address;
  final String? phone;
  final String? website;
  final List<String> activities;
  final Map<String, dynamic> metadata;

  const Entertainment({
    required this.id,
    required this.name,
    required this.type,
    required this.category,
    required this.distance,
    required this.rating,
    this.address,
    this.phone,
    this.website,
    required this.activities,
    required this.metadata,
  });

  factory Entertainment.fromJson(Map<String, dynamic> json) => _$EntertainmentFromJson(json);
  Map<String, dynamic> toJson() => _$EntertainmentToJson(this);
}

/// Safety score model
@JsonSerializable()
class SafetyScore {
  final double overall;
  final double walking;
  final double driving;
  final double night;
  final double publicTransport;
  final String description;

  const SafetyScore({
    required this.overall,
    required this.walking,
    required this.driving,
    required this.night,
    required this.publicTransport,
    required this.description,
  });

  factory SafetyScore.fromJson(Map<String, dynamic> json) => _$SafetyScoreFromJson(json);
  Map<String, dynamic> toJson() => _$SafetyScoreToJson(this);
}

/// Crime rate model
@JsonSerializable()
class CrimeRate {
  final double overall;
  final double violent;
  final double property;
  final double theft;
  final double burglary;
  final String description;

  const CrimeRate({
    required this.overall,
    required this.violent,
    required this.property,
    required this.theft,
    required this.burglary,
    required this.description,
  });

  factory CrimeRate.fromJson(Map<String, dynamic> json) => _$CrimeRateFromJson(json);
  Map<String, dynamic> toJson() => _$CrimeRateToJson(this);
}

/// Property trends model
@JsonSerializable()
class PropertyTrends {
  final double currentPrice;
  final double priceChange;
  final double priceChangePercent;
  final List<PriceHistory> priceHistory;
  final double averagePrice;
  final double medianPrice;
  final int daysOnMarket;
  final double pricePerSqFt;
  final String trend;

  const PropertyTrends({
    required this.currentPrice,
    required this.priceChange,
    required this.priceChangePercent,
    required this.priceHistory,
    required this.averagePrice,
    required this.medianPrice,
    required this.daysOnMarket,
    required this.pricePerSqFt,
    required this.trend,
  });

  factory PropertyTrends.fromJson(Map<String, dynamic> json) => _$PropertyTrendsFromJson(json);
  Map<String, dynamic> toJson() => _$PropertyTrendsToJson(this);
}

/// Price history model
@JsonSerializable()
class PriceHistory {
  final DateTime date;
  final double price;
  final String source;

  const PriceHistory({
    required this.date,
    required this.price,
    required this.source,
  });

  factory PriceHistory.fromJson(Map<String, dynamic> json) => _$PriceHistoryFromJson(json);
  Map<String, dynamic> toJson() => _$PriceHistoryToJson(this);
}

/// Market analysis model
@JsonSerializable()
class MarketAnalysis {
  final String marketType;
  final double demandScore;
  final double supplyScore;
  final double investmentScore;
  final double rentalYield;
  final double appreciationRate;
  final String outlook;
  final List<String> keyFactors;

  const MarketAnalysis({
    required this.marketType,
    required this.demandScore,
    required this.supplyScore,
    required this.investmentScore,
    required this.rentalYield,
    required this.appreciationRate,
    required this.outlook,
    required this.keyFactors,
  });

  factory MarketAnalysis.fromJson(Map<String, dynamic> json) => _$MarketAnalysisFromJson(json);
  Map<String, dynamic> toJson() => _$MarketAnalysisToJson(this);
}

/// Virtual tour types enum
enum VirtualTourType {
  @JsonValue('360')
  threeSixty,
  @JsonValue('panorama')
  panorama,
  @JsonValue('video')
  video,
  @JsonValue('interactive')
  interactive,
}


