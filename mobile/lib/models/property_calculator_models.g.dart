// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'property_calculator_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PropertyCalculator _$PropertyCalculatorFromJson(Map<String, dynamic> json) =>
    PropertyCalculator(
      id: json['id'] as String,
      propertyId: json['propertyId'] as String,
      propertyPrice: (json['propertyPrice'] as num).toDouble(),
      downPayment: (json['downPayment'] as num).toDouble(),
      loanAmount: (json['loanAmount'] as num).toDouble(),
      interestRate: (json['interestRate'] as num).toDouble(),
      loanTenure: (json['loanTenure'] as num).toInt(),
      monthlyEMI: (json['monthlyEMI'] as num).toDouble(),
      totalInterest: (json['totalInterest'] as num).toDouble(),
      totalAmount: (json['totalAmount'] as num).toDouble(),
      processingFee: (json['processingFee'] as num).toDouble(),
      registrationFee: (json['registrationFee'] as num).toDouble(),
      stampDuty: (json['stampDuty'] as num).toDouble(),
      gst: (json['gst'] as num).toDouble(),
      totalCharges: (json['totalCharges'] as num).toDouble(),
      totalCost: (json['totalCost'] as num).toDouble(),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$PropertyCalculatorToJson(PropertyCalculator instance) =>
    <String, dynamic>{
      'id': instance.id,
      'propertyId': instance.propertyId,
      'propertyPrice': instance.propertyPrice,
      'downPayment': instance.downPayment,
      'loanAmount': instance.loanAmount,
      'interestRate': instance.interestRate,
      'loanTenure': instance.loanTenure,
      'monthlyEMI': instance.monthlyEMI,
      'totalInterest': instance.totalInterest,
      'totalAmount': instance.totalAmount,
      'processingFee': instance.processingFee,
      'registrationFee': instance.registrationFee,
      'stampDuty': instance.stampDuty,
      'gst': instance.gst,
      'totalCharges': instance.totalCharges,
      'totalCost': instance.totalCost,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

EMICalculation _$EMICalculationFromJson(Map<String, dynamic> json) =>
    EMICalculation(
      principal: (json['principal'] as num).toDouble(),
      interestRate: (json['interestRate'] as num).toDouble(),
      tenureMonths: (json['tenureMonths'] as num).toInt(),
      monthlyEMI: (json['monthlyEMI'] as num).toDouble(),
      totalInterest: (json['totalInterest'] as num).toDouble(),
      totalAmount: (json['totalAmount'] as num).toDouble(),
      schedule: (json['schedule'] as List<dynamic>)
          .map((e) => EMISchedule.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$EMICalculationToJson(EMICalculation instance) =>
    <String, dynamic>{
      'principal': instance.principal,
      'interestRate': instance.interestRate,
      'tenureMonths': instance.tenureMonths,
      'monthlyEMI': instance.monthlyEMI,
      'totalInterest': instance.totalInterest,
      'totalAmount': instance.totalAmount,
      'schedule': instance.schedule,
    };

EMISchedule _$EMIScheduleFromJson(Map<String, dynamic> json) => EMISchedule(
      month: (json['month'] as num).toInt(),
      principal: (json['principal'] as num).toDouble(),
      interest: (json['interest'] as num).toDouble(),
      emi: (json['emi'] as num).toDouble(),
      balance: (json['balance'] as num).toDouble(),
    );

Map<String, dynamic> _$EMIScheduleToJson(EMISchedule instance) =>
    <String, dynamic>{
      'month': instance.month,
      'principal': instance.principal,
      'interest': instance.interest,
      'emi': instance.emi,
      'balance': instance.balance,
    };

InvestmentAnalysis _$InvestmentAnalysisFromJson(Map<String, dynamic> json) =>
    InvestmentAnalysis(
      id: json['id'] as String,
      propertyId: json['propertyId'] as String,
      currentValue: (json['currentValue'] as num).toDouble(),
      purchasePrice: (json['purchasePrice'] as num).toDouble(),
      appreciationRate: (json['appreciationRate'] as num).toDouble(),
      rentalYield: (json['rentalYield'] as num).toDouble(),
      monthlyRent: (json['monthlyRent'] as num).toDouble(),
      annualRent: (json['annualRent'] as num).toDouble(),
      netYield: (json['netYield'] as num).toDouble(),
      roi: (json['roi'] as num).toDouble(),
      holdingPeriod: (json['holdingPeriod'] as num).toInt(),
      futureValue: (json['futureValue'] as num).toDouble(),
      totalGain: (json['totalGain'] as num).toDouble(),
      annualizedReturn: (json['annualizedReturn'] as num).toDouble(),
      analysisDate: DateTime.parse(json['analysisDate'] as String),
    );

Map<String, dynamic> _$InvestmentAnalysisToJson(InvestmentAnalysis instance) =>
    <String, dynamic>{
      'id': instance.id,
      'propertyId': instance.propertyId,
      'currentValue': instance.currentValue,
      'purchasePrice': instance.purchasePrice,
      'appreciationRate': instance.appreciationRate,
      'rentalYield': instance.rentalYield,
      'monthlyRent': instance.monthlyRent,
      'annualRent': instance.annualRent,
      'netYield': instance.netYield,
      'roi': instance.roi,
      'holdingPeriod': instance.holdingPeriod,
      'futureValue': instance.futureValue,
      'totalGain': instance.totalGain,
      'annualizedReturn': instance.annualizedReturn,
      'analysisDate': instance.analysisDate.toIso8601String(),
    };

PropertyComparison _$PropertyComparisonFromJson(Map<String, dynamic> json) =>
    PropertyComparison(
      id: json['id'] as String,
      propertyIds: (json['propertyIds'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      properties: (json['properties'] as List<dynamic>)
          .map(
              (e) => PropertyComparisonItem.fromJson(e as Map<String, dynamic>))
          .toList(),
      criteria:
          ComparisonCriteria.fromJson(json['criteria'] as Map<String, dynamic>),
      createdAt: DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$PropertyComparisonToJson(PropertyComparison instance) =>
    <String, dynamic>{
      'id': instance.id,
      'propertyIds': instance.propertyIds,
      'properties': instance.properties,
      'criteria': instance.criteria,
      'createdAt': instance.createdAt.toIso8601String(),
    };

PropertyComparisonItem _$PropertyComparisonItemFromJson(
        Map<String, dynamic> json) =>
    PropertyComparisonItem(
      propertyId: json['propertyId'] as String,
      propertyName: json['propertyName'] as String,
      price: (json['price'] as num).toDouble(),
      pricePerSqFt: (json['pricePerSqFt'] as num).toDouble(),
      area: (json['area'] as num).toDouble(),
      location: json['location'] as String,
      rating: (json['rating'] as num).toDouble(),
      amenities:
          (json['amenities'] as List<dynamic>).map((e) => e as String).toList(),
      features: json['features'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$PropertyComparisonItemToJson(
        PropertyComparisonItem instance) =>
    <String, dynamic>{
      'propertyId': instance.propertyId,
      'propertyName': instance.propertyName,
      'price': instance.price,
      'pricePerSqFt': instance.pricePerSqFt,
      'area': instance.area,
      'location': instance.location,
      'rating': instance.rating,
      'amenities': instance.amenities,
      'features': instance.features,
    };

ComparisonCriteria _$ComparisonCriteriaFromJson(Map<String, dynamic> json) =>
    ComparisonCriteria(
      priceRange: (json['priceRange'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      location:
          (json['location'] as List<dynamic>).map((e) => e as String).toList(),
      propertyType: (json['propertyType'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      amenities:
          (json['amenities'] as List<dynamic>).map((e) => e as String).toList(),
      minRating: (json['minRating'] as num).toDouble(),
      maxPrice: (json['maxPrice'] as num).toDouble(),
      minArea: (json['minArea'] as num).toDouble(),
      maxArea: (json['maxArea'] as num).toDouble(),
    );

Map<String, dynamic> _$ComparisonCriteriaToJson(ComparisonCriteria instance) =>
    <String, dynamic>{
      'priceRange': instance.priceRange,
      'location': instance.location,
      'propertyType': instance.propertyType,
      'amenities': instance.amenities,
      'minRating': instance.minRating,
      'maxPrice': instance.maxPrice,
      'minArea': instance.minArea,
      'maxArea': instance.maxArea,
    };

VirtualTour _$VirtualTourFromJson(Map<String, dynamic> json) => VirtualTour(
      id: json['id'] as String,
      propertyId: json['propertyId'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      thumbnailUrl: json['thumbnailUrl'] as String,
      tourUrl: json['tourUrl'] as String,
      type: $enumDecode(_$VirtualTourTypeEnumMap, json['type']),
      duration: (json['duration'] as num).toInt(),
      hotspots:
          (json['hotspots'] as List<dynamic>).map((e) => e as String).toList(),
      metadata: json['metadata'] as Map<String, dynamic>,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$VirtualTourToJson(VirtualTour instance) =>
    <String, dynamic>{
      'id': instance.id,
      'propertyId': instance.propertyId,
      'title': instance.title,
      'description': instance.description,
      'thumbnailUrl': instance.thumbnailUrl,
      'tourUrl': instance.tourUrl,
      'type': _$VirtualTourTypeEnumMap[instance.type]!,
      'duration': instance.duration,
      'hotspots': instance.hotspots,
      'metadata': instance.metadata,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

const _$VirtualTourTypeEnumMap = {
  VirtualTourType.threeSixty: '360',
  VirtualTourType.panorama: 'panorama',
  VirtualTourType.video: 'video',
  VirtualTourType.interactive: 'interactive',
};

VirtualTourHotspot _$VirtualTourHotspotFromJson(Map<String, dynamic> json) =>
    VirtualTourHotspot(
      id: json['id'] as String,
      tourId: json['tourId'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      x: (json['x'] as num).toDouble(),
      y: (json['y'] as num).toDouble(),
      z: (json['z'] as num).toDouble(),
      imageUrl: json['imageUrl'] as String?,
      videoUrl: json['videoUrl'] as String?,
      audioUrl: json['audioUrl'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$VirtualTourHotspotToJson(VirtualTourHotspot instance) =>
    <String, dynamic>{
      'id': instance.id,
      'tourId': instance.tourId,
      'title': instance.title,
      'description': instance.description,
      'x': instance.x,
      'y': instance.y,
      'z': instance.z,
      'imageUrl': instance.imageUrl,
      'videoUrl': instance.videoUrl,
      'audioUrl': instance.audioUrl,
      'metadata': instance.metadata,
    };

NeighborhoodInsights _$NeighborhoodInsightsFromJson(
        Map<String, dynamic> json) =>
    NeighborhoodInsights(
      id: json['id'] as String,
      propertyId: json['propertyId'] as String,
      area: json['area'] as String,
      city: json['city'] as String,
      state: json['state'] as String,
      country: json['country'] as String,
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      amenities: (json['amenities'] as List<dynamic>)
          .map((e) => NearbyAmenity.fromJson(e as Map<String, dynamic>))
          .toList(),
      transportation: (json['transportation'] as List<dynamic>)
          .map((e) => Transportation.fromJson(e as Map<String, dynamic>))
          .toList(),
      education: (json['education'] as List<dynamic>)
          .map((e) => Education.fromJson(e as Map<String, dynamic>))
          .toList(),
      healthcare: (json['healthcare'] as List<dynamic>)
          .map((e) => Healthcare.fromJson(e as Map<String, dynamic>))
          .toList(),
      shopping: (json['shopping'] as List<dynamic>)
          .map((e) => Shopping.fromJson(e as Map<String, dynamic>))
          .toList(),
      entertainment: (json['entertainment'] as List<dynamic>)
          .map((e) => Entertainment.fromJson(e as Map<String, dynamic>))
          .toList(),
      safetyScore:
          SafetyScore.fromJson(json['safetyScore'] as Map<String, dynamic>),
      crimeRate: CrimeRate.fromJson(json['crimeRate'] as Map<String, dynamic>),
      propertyTrends: PropertyTrends.fromJson(
          json['propertyTrends'] as Map<String, dynamic>),
      marketAnalysis: MarketAnalysis.fromJson(
          json['marketAnalysis'] as Map<String, dynamic>),
      lastUpdated: DateTime.parse(json['lastUpdated'] as String),
    );

Map<String, dynamic> _$NeighborhoodInsightsToJson(
        NeighborhoodInsights instance) =>
    <String, dynamic>{
      'id': instance.id,
      'propertyId': instance.propertyId,
      'area': instance.area,
      'city': instance.city,
      'state': instance.state,
      'country': instance.country,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'amenities': instance.amenities,
      'transportation': instance.transportation,
      'education': instance.education,
      'healthcare': instance.healthcare,
      'shopping': instance.shopping,
      'entertainment': instance.entertainment,
      'safetyScore': instance.safetyScore,
      'crimeRate': instance.crimeRate,
      'propertyTrends': instance.propertyTrends,
      'marketAnalysis': instance.marketAnalysis,
      'lastUpdated': instance.lastUpdated.toIso8601String(),
    };

NearbyAmenity _$NearbyAmenityFromJson(Map<String, dynamic> json) =>
    NearbyAmenity(
      id: json['id'] as String,
      name: json['name'] as String,
      type: json['type'] as String,
      category: json['category'] as String,
      distance: (json['distance'] as num).toDouble(),
      rating: (json['rating'] as num).toDouble(),
      address: json['address'] as String?,
      phone: json['phone'] as String?,
      website: json['website'] as String?,
      features:
          (json['features'] as List<dynamic>).map((e) => e as String).toList(),
      metadata: json['metadata'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$NearbyAmenityToJson(NearbyAmenity instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'type': instance.type,
      'category': instance.category,
      'distance': instance.distance,
      'rating': instance.rating,
      'address': instance.address,
      'phone': instance.phone,
      'website': instance.website,
      'features': instance.features,
      'metadata': instance.metadata,
    };

Transportation _$TransportationFromJson(Map<String, dynamic> json) =>
    Transportation(
      id: json['id'] as String,
      name: json['name'] as String,
      type: json['type'] as String,
      distance: (json['distance'] as num).toDouble(),
      walkingTime: (json['walkingTime'] as num).toDouble(),
      drivingTime: (json['drivingTime'] as num).toDouble(),
      route: json['route'] as String?,
      frequency: json['frequency'] as String?,
      fare: (json['fare'] as num?)?.toDouble(),
      metadata: json['metadata'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$TransportationToJson(Transportation instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'type': instance.type,
      'distance': instance.distance,
      'walkingTime': instance.walkingTime,
      'drivingTime': instance.drivingTime,
      'route': instance.route,
      'frequency': instance.frequency,
      'fare': instance.fare,
      'metadata': instance.metadata,
    };

Education _$EducationFromJson(Map<String, dynamic> json) => Education(
      id: json['id'] as String,
      name: json['name'] as String,
      type: json['type'] as String,
      level: json['level'] as String,
      distance: (json['distance'] as num).toDouble(),
      rating: (json['rating'] as num).toDouble(),
      address: json['address'] as String?,
      phone: json['phone'] as String?,
      website: json['website'] as String?,
      programs:
          (json['programs'] as List<dynamic>).map((e) => e as String).toList(),
      metadata: json['metadata'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$EducationToJson(Education instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'type': instance.type,
      'level': instance.level,
      'distance': instance.distance,
      'rating': instance.rating,
      'address': instance.address,
      'phone': instance.phone,
      'website': instance.website,
      'programs': instance.programs,
      'metadata': instance.metadata,
    };

Healthcare _$HealthcareFromJson(Map<String, dynamic> json) => Healthcare(
      id: json['id'] as String,
      name: json['name'] as String,
      type: json['type'] as String,
      specialty: json['specialty'] as String,
      distance: (json['distance'] as num).toDouble(),
      rating: (json['rating'] as num).toDouble(),
      address: json['address'] as String?,
      phone: json['phone'] as String?,
      website: json['website'] as String?,
      services:
          (json['services'] as List<dynamic>).map((e) => e as String).toList(),
      metadata: json['metadata'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$HealthcareToJson(Healthcare instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'type': instance.type,
      'specialty': instance.specialty,
      'distance': instance.distance,
      'rating': instance.rating,
      'address': instance.address,
      'phone': instance.phone,
      'website': instance.website,
      'services': instance.services,
      'metadata': instance.metadata,
    };

Shopping _$ShoppingFromJson(Map<String, dynamic> json) => Shopping(
      id: json['id'] as String,
      name: json['name'] as String,
      type: json['type'] as String,
      category: json['category'] as String,
      distance: (json['distance'] as num).toDouble(),
      rating: (json['rating'] as num).toDouble(),
      address: json['address'] as String?,
      phone: json['phone'] as String?,
      website: json['website'] as String?,
      brands:
          (json['brands'] as List<dynamic>).map((e) => e as String).toList(),
      metadata: json['metadata'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$ShoppingToJson(Shopping instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'type': instance.type,
      'category': instance.category,
      'distance': instance.distance,
      'rating': instance.rating,
      'address': instance.address,
      'phone': instance.phone,
      'website': instance.website,
      'brands': instance.brands,
      'metadata': instance.metadata,
    };

Entertainment _$EntertainmentFromJson(Map<String, dynamic> json) =>
    Entertainment(
      id: json['id'] as String,
      name: json['name'] as String,
      type: json['type'] as String,
      category: json['category'] as String,
      distance: (json['distance'] as num).toDouble(),
      rating: (json['rating'] as num).toDouble(),
      address: json['address'] as String?,
      phone: json['phone'] as String?,
      website: json['website'] as String?,
      activities: (json['activities'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      metadata: json['metadata'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$EntertainmentToJson(Entertainment instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'type': instance.type,
      'category': instance.category,
      'distance': instance.distance,
      'rating': instance.rating,
      'address': instance.address,
      'phone': instance.phone,
      'website': instance.website,
      'activities': instance.activities,
      'metadata': instance.metadata,
    };

SafetyScore _$SafetyScoreFromJson(Map<String, dynamic> json) => SafetyScore(
      overall: (json['overall'] as num).toDouble(),
      walking: (json['walking'] as num).toDouble(),
      driving: (json['driving'] as num).toDouble(),
      night: (json['night'] as num).toDouble(),
      publicTransport: (json['publicTransport'] as num).toDouble(),
      description: json['description'] as String,
    );

Map<String, dynamic> _$SafetyScoreToJson(SafetyScore instance) =>
    <String, dynamic>{
      'overall': instance.overall,
      'walking': instance.walking,
      'driving': instance.driving,
      'night': instance.night,
      'publicTransport': instance.publicTransport,
      'description': instance.description,
    };

CrimeRate _$CrimeRateFromJson(Map<String, dynamic> json) => CrimeRate(
      overall: (json['overall'] as num).toDouble(),
      violent: (json['violent'] as num).toDouble(),
      property: (json['property'] as num).toDouble(),
      theft: (json['theft'] as num).toDouble(),
      burglary: (json['burglary'] as num).toDouble(),
      description: json['description'] as String,
    );

Map<String, dynamic> _$CrimeRateToJson(CrimeRate instance) => <String, dynamic>{
      'overall': instance.overall,
      'violent': instance.violent,
      'property': instance.property,
      'theft': instance.theft,
      'burglary': instance.burglary,
      'description': instance.description,
    };

PropertyTrends _$PropertyTrendsFromJson(Map<String, dynamic> json) =>
    PropertyTrends(
      currentPrice: (json['currentPrice'] as num).toDouble(),
      priceChange: (json['priceChange'] as num).toDouble(),
      priceChangePercent: (json['priceChangePercent'] as num).toDouble(),
      priceHistory: (json['priceHistory'] as List<dynamic>)
          .map((e) => PriceHistory.fromJson(e as Map<String, dynamic>))
          .toList(),
      averagePrice: (json['averagePrice'] as num).toDouble(),
      medianPrice: (json['medianPrice'] as num).toDouble(),
      daysOnMarket: (json['daysOnMarket'] as num).toInt(),
      pricePerSqFt: (json['pricePerSqFt'] as num).toDouble(),
      trend: json['trend'] as String,
    );

Map<String, dynamic> _$PropertyTrendsToJson(PropertyTrends instance) =>
    <String, dynamic>{
      'currentPrice': instance.currentPrice,
      'priceChange': instance.priceChange,
      'priceChangePercent': instance.priceChangePercent,
      'priceHistory': instance.priceHistory,
      'averagePrice': instance.averagePrice,
      'medianPrice': instance.medianPrice,
      'daysOnMarket': instance.daysOnMarket,
      'pricePerSqFt': instance.pricePerSqFt,
      'trend': instance.trend,
    };

PriceHistory _$PriceHistoryFromJson(Map<String, dynamic> json) => PriceHistory(
      date: DateTime.parse(json['date'] as String),
      price: (json['price'] as num).toDouble(),
      source: json['source'] as String,
    );

Map<String, dynamic> _$PriceHistoryToJson(PriceHistory instance) =>
    <String, dynamic>{
      'date': instance.date.toIso8601String(),
      'price': instance.price,
      'source': instance.source,
    };

MarketAnalysis _$MarketAnalysisFromJson(Map<String, dynamic> json) =>
    MarketAnalysis(
      marketType: json['marketType'] as String,
      demandScore: (json['demandScore'] as num).toDouble(),
      supplyScore: (json['supplyScore'] as num).toDouble(),
      investmentScore: (json['investmentScore'] as num).toDouble(),
      rentalYield: (json['rentalYield'] as num).toDouble(),
      appreciationRate: (json['appreciationRate'] as num).toDouble(),
      outlook: json['outlook'] as String,
      keyFactors: (json['keyFactors'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
    );

Map<String, dynamic> _$MarketAnalysisToJson(MarketAnalysis instance) =>
    <String, dynamic>{
      'marketType': instance.marketType,
      'demandScore': instance.demandScore,
      'supplyScore': instance.supplyScore,
      'investmentScore': instance.investmentScore,
      'rentalYield': instance.rentalYield,
      'appreciationRate': instance.appreciationRate,
      'outlook': instance.outlook,
      'keyFactors': instance.keyFactors,
    };
