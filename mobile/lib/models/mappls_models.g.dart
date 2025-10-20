// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'mappls_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MapplsAddress _$MapplsAddressFromJson(Map<String, dynamic> json) =>
    MapplsAddress(
      formattedAddress: json['formattedAddress'] as String,
      location:
          MapplsLocation.fromJson(json['location'] as Map<String, dynamic>),
      placeId: json['placeId'] as String?,
      addressComponents: (json['addressComponents'] as List<dynamic>?)
              ?.map((e) =>
                  MapplsAddressComponent.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      postalCode: json['postalCode'] as String?,
      country: json['country'] as String?,
      state: json['state'] as String?,
      city: json['city'] as String?,
      locality: json['locality'] as String?,
      subLocality: json['subLocality'] as String?,
      streetNumber: json['streetNumber'] as String?,
      route: json['route'] as String?,
      neighborhood: json['neighborhood'] as String?,
      administrativeAreaLevel1: json['administrativeAreaLevel1'] as String?,
      administrativeAreaLevel2: json['administrativeAreaLevel2'] as String?,
      administrativeAreaLevel3: json['administrativeAreaLevel3'] as String?,
      administrativeAreaLevel4: json['administrativeAreaLevel4'] as String?,
      administrativeAreaLevel5: json['administrativeAreaLevel5'] as String?,
      subPremise: json['subPremise'] as String?,
      premise: json['premise'] as String?,
      countryCode: json['countryCode'] as String?,
      stateCode: json['stateCode'] as String?,
      confidence: (json['confidence'] as num?)?.toDouble(),
      metadata: json['metadata'] as Map<String, dynamic>? ?? const {},
    );

Map<String, dynamic> _$MapplsAddressToJson(MapplsAddress instance) =>
    <String, dynamic>{
      'formattedAddress': instance.formattedAddress,
      'location': instance.location,
      'placeId': instance.placeId,
      'addressComponents': instance.addressComponents,
      'postalCode': instance.postalCode,
      'country': instance.country,
      'state': instance.state,
      'city': instance.city,
      'locality': instance.locality,
      'subLocality': instance.subLocality,
      'streetNumber': instance.streetNumber,
      'route': instance.route,
      'neighborhood': instance.neighborhood,
      'administrativeAreaLevel1': instance.administrativeAreaLevel1,
      'administrativeAreaLevel2': instance.administrativeAreaLevel2,
      'administrativeAreaLevel3': instance.administrativeAreaLevel3,
      'administrativeAreaLevel4': instance.administrativeAreaLevel4,
      'administrativeAreaLevel5': instance.administrativeAreaLevel5,
      'subPremise': instance.subPremise,
      'premise': instance.premise,
      'countryCode': instance.countryCode,
      'stateCode': instance.stateCode,
      'confidence': instance.confidence,
      'metadata': instance.metadata,
    };

MapplsAddressComponent _$MapplsAddressComponentFromJson(
        Map<String, dynamic> json) =>
    MapplsAddressComponent(
      longName: json['longName'] as String,
      shortName: json['shortName'] as String,
      types: (json['types'] as List<dynamic>).map((e) => e as String).toList(),
      placeId: json['placeId'] as String?,
    );

Map<String, dynamic> _$MapplsAddressComponentToJson(
        MapplsAddressComponent instance) =>
    <String, dynamic>{
      'longName': instance.longName,
      'shortName': instance.shortName,
      'types': instance.types,
      'placeId': instance.placeId,
    };

MapplsLocation _$MapplsLocationFromJson(Map<String, dynamic> json) =>
    MapplsLocation(
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
    );

Map<String, dynamic> _$MapplsLocationToJson(MapplsLocation instance) =>
    <String, dynamic>{
      'latitude': instance.latitude,
      'longitude': instance.longitude,
    };

MapplsPlace _$MapplsPlaceFromJson(Map<String, dynamic> json) => MapplsPlace(
      placeId: json['placeId'] as String,
      name: json['name'] as String,
      location:
          MapplsLocation.fromJson(json['location'] as Map<String, dynamic>),
      formattedAddress: json['formattedAddress'] as String?,
      phoneNumber: json['phoneNumber'] as String?,
      website: json['website'] as String?,
      rating: (json['rating'] as num?)?.toDouble(),
      userRatingsTotal: (json['userRatingsTotal'] as num?)?.toInt(),
      types:
          (json['types'] as List<dynamic>?)?.map((e) => e as String).toList() ??
              const [],
      businessStatus: json['businessStatus'] as String?,
      openingHours: json['openingHours'] == null
          ? null
          : MapplsPlaceOpeningHours.fromJson(
              json['openingHours'] as Map<String, dynamic>),
      photos: (json['photos'] as List<dynamic>?)
              ?.map((e) => MapplsPlacePhoto.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      priceLevel: $enumDecodeNullable(
          _$MapplsPlacePriceLevelEnumMap, json['priceLevel']),
      vicinity: json['vicinity'] as String?,
      internationalPhoneNumber: json['internationalPhoneNumber'] as String?,
      url: json['url'] as String?,
      scope: json['scope'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>? ?? const {},
    );

Map<String, dynamic> _$MapplsPlaceToJson(MapplsPlace instance) =>
    <String, dynamic>{
      'placeId': instance.placeId,
      'name': instance.name,
      'location': instance.location,
      'formattedAddress': instance.formattedAddress,
      'phoneNumber': instance.phoneNumber,
      'website': instance.website,
      'rating': instance.rating,
      'userRatingsTotal': instance.userRatingsTotal,
      'types': instance.types,
      'businessStatus': instance.businessStatus,
      'openingHours': instance.openingHours,
      'photos': instance.photos,
      'priceLevel': _$MapplsPlacePriceLevelEnumMap[instance.priceLevel],
      'vicinity': instance.vicinity,
      'internationalPhoneNumber': instance.internationalPhoneNumber,
      'url': instance.url,
      'scope': instance.scope,
      'metadata': instance.metadata,
    };

const _$MapplsPlacePriceLevelEnumMap = {
  MapplsPlacePriceLevel.free: 0,
  MapplsPlacePriceLevel.inexpensive: 1,
  MapplsPlacePriceLevel.moderate: 2,
  MapplsPlacePriceLevel.expensive: 3,
  MapplsPlacePriceLevel.veryExpensive: 4,
};

MapplsPlaceOpeningHours _$MapplsPlaceOpeningHoursFromJson(
        Map<String, dynamic> json) =>
    MapplsPlaceOpeningHours(
      isOpen: json['isOpen'] as bool,
      periods: (json['periods'] as List<dynamic>?)
              ?.map(
                  (e) => MapplsPlacePeriod.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      weekdayText: (json['weekdayText'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
    );

Map<String, dynamic> _$MapplsPlaceOpeningHoursToJson(
        MapplsPlaceOpeningHours instance) =>
    <String, dynamic>{
      'isOpen': instance.isOpen,
      'periods': instance.periods,
      'weekdayText': instance.weekdayText,
    };

MapplsPlacePeriod _$MapplsPlacePeriodFromJson(Map<String, dynamic> json) =>
    MapplsPlacePeriod(
      open: json['open'] == null
          ? null
          : MapplsPlaceTime.fromJson(json['open'] as Map<String, dynamic>),
      close: json['close'] == null
          ? null
          : MapplsPlaceTime.fromJson(json['close'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$MapplsPlacePeriodToJson(MapplsPlacePeriod instance) =>
    <String, dynamic>{
      'open': instance.open,
      'close': instance.close,
    };

MapplsPlaceTime _$MapplsPlaceTimeFromJson(Map<String, dynamic> json) =>
    MapplsPlaceTime(
      day: (json['day'] as num).toInt(),
      time: json['time'] as String,
    );

Map<String, dynamic> _$MapplsPlaceTimeToJson(MapplsPlaceTime instance) =>
    <String, dynamic>{
      'day': instance.day,
      'time': instance.time,
    };

MapplsPlacePhoto _$MapplsPlacePhotoFromJson(Map<String, dynamic> json) =>
    MapplsPlacePhoto(
      photoReference: json['photoReference'] as String,
      height: (json['height'] as num).toInt(),
      width: (json['width'] as num).toInt(),
      htmlAttributions: (json['htmlAttributions'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
    );

Map<String, dynamic> _$MapplsPlacePhotoToJson(MapplsPlacePhoto instance) =>
    <String, dynamic>{
      'photoReference': instance.photoReference,
      'height': instance.height,
      'width': instance.width,
      'htmlAttributions': instance.htmlAttributions,
    };

MapplsRoute _$MapplsRouteFromJson(Map<String, dynamic> json) => MapplsRoute(
      overviewPath: (json['overviewPath'] as List<dynamic>)
          .map((e) => MapplsLocation.fromJson(e as Map<String, dynamic>))
          .toList(),
      legs: (json['legs'] as List<dynamic>)
          .map((e) => MapplsRouteLeg.fromJson(e as Map<String, dynamic>))
          .toList(),
      bounds:
          MapplsRouteBounds.fromJson(json['bounds'] as Map<String, dynamic>),
      copyrights: json['copyrights'] as String,
      warnings: (json['warnings'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      summary: json['summary'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>? ?? const {},
    );

Map<String, dynamic> _$MapplsRouteToJson(MapplsRoute instance) =>
    <String, dynamic>{
      'overviewPath': instance.overviewPath,
      'legs': instance.legs,
      'bounds': instance.bounds,
      'copyrights': instance.copyrights,
      'warnings': instance.warnings,
      'summary': instance.summary,
      'metadata': instance.metadata,
    };

MapplsRouteLeg _$MapplsRouteLegFromJson(Map<String, dynamic> json) =>
    MapplsRouteLeg(
      distance: MapplsRouteDistance.fromJson(
          json['distance'] as Map<String, dynamic>),
      duration: MapplsRouteDuration.fromJson(
          json['duration'] as Map<String, dynamic>),
      durationInTraffic: json['durationInTraffic'] as String?,
      startLocation: MapplsLocation.fromJson(
          json['startLocation'] as Map<String, dynamic>),
      endLocation:
          MapplsLocation.fromJson(json['endLocation'] as Map<String, dynamic>),
      startAddress: json['startAddress'] as String,
      endAddress: json['endAddress'] as String,
      steps: (json['steps'] as List<dynamic>?)
              ?.map((e) => MapplsRouteStep.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
    );

Map<String, dynamic> _$MapplsRouteLegToJson(MapplsRouteLeg instance) =>
    <String, dynamic>{
      'distance': instance.distance,
      'duration': instance.duration,
      'durationInTraffic': instance.durationInTraffic,
      'startLocation': instance.startLocation,
      'endLocation': instance.endLocation,
      'startAddress': instance.startAddress,
      'endAddress': instance.endAddress,
      'steps': instance.steps,
    };

MapplsRouteStep _$MapplsRouteStepFromJson(Map<String, dynamic> json) =>
    MapplsRouteStep(
      distance: MapplsRouteDistance.fromJson(
          json['distance'] as Map<String, dynamic>),
      duration: MapplsRouteDuration.fromJson(
          json['duration'] as Map<String, dynamic>),
      startLocation: MapplsLocation.fromJson(
          json['startLocation'] as Map<String, dynamic>),
      endLocation:
          MapplsLocation.fromJson(json['endLocation'] as Map<String, dynamic>),
      htmlInstructions: json['htmlInstructions'] as String,
      maneuver: json['maneuver'] as String?,
      polyline: MapplsRoutePolyline.fromJson(
          json['polyline'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$MapplsRouteStepToJson(MapplsRouteStep instance) =>
    <String, dynamic>{
      'distance': instance.distance,
      'duration': instance.duration,
      'startLocation': instance.startLocation,
      'endLocation': instance.endLocation,
      'htmlInstructions': instance.htmlInstructions,
      'maneuver': instance.maneuver,
      'polyline': instance.polyline,
    };

MapplsRouteDistance _$MapplsRouteDistanceFromJson(Map<String, dynamic> json) =>
    MapplsRouteDistance(
      value: (json['value'] as num).toInt(),
      text: json['text'] as String,
    );

Map<String, dynamic> _$MapplsRouteDistanceToJson(
        MapplsRouteDistance instance) =>
    <String, dynamic>{
      'value': instance.value,
      'text': instance.text,
    };

MapplsRouteDuration _$MapplsRouteDurationFromJson(Map<String, dynamic> json) =>
    MapplsRouteDuration(
      value: (json['value'] as num).toInt(),
      text: json['text'] as String,
    );

Map<String, dynamic> _$MapplsRouteDurationToJson(
        MapplsRouteDuration instance) =>
    <String, dynamic>{
      'value': instance.value,
      'text': instance.text,
    };

MapplsRouteBounds _$MapplsRouteBoundsFromJson(Map<String, dynamic> json) =>
    MapplsRouteBounds(
      northeast:
          MapplsLocation.fromJson(json['northeast'] as Map<String, dynamic>),
      southwest:
          MapplsLocation.fromJson(json['southwest'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$MapplsRouteBoundsToJson(MapplsRouteBounds instance) =>
    <String, dynamic>{
      'northeast': instance.northeast,
      'southwest': instance.southwest,
    };

MapplsRoutePolyline _$MapplsRoutePolylineFromJson(Map<String, dynamic> json) =>
    MapplsRoutePolyline(
      points: json['points'] as String,
    );

Map<String, dynamic> _$MapplsRoutePolylineToJson(
        MapplsRoutePolyline instance) =>
    <String, dynamic>{
      'points': instance.points,
    };

MapplsWaypoint _$MapplsWaypointFromJson(Map<String, dynamic> json) =>
    MapplsWaypoint(
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      stopover: json['stopover'] as bool?,
    );

Map<String, dynamic> _$MapplsWaypointToJson(MapplsWaypoint instance) =>
    <String, dynamic>{
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'stopover': instance.stopover,
    };

MapplsDistance _$MapplsDistanceFromJson(Map<String, dynamic> json) =>
    MapplsDistance(
      distance: MapplsRouteDistance.fromJson(
          json['distance'] as Map<String, dynamic>),
      duration: MapplsRouteDuration.fromJson(
          json['duration'] as Map<String, dynamic>),
      status: json['status'] as String,
    );

Map<String, dynamic> _$MapplsDistanceToJson(MapplsDistance instance) =>
    <String, dynamic>{
      'distance': instance.distance,
      'duration': instance.duration,
      'status': instance.status,
    };

MapplsMarker _$MapplsMarkerFromJson(Map<String, dynamic> json) => MapplsMarker(
      id: json['id'] as String,
      position:
          MapplsLocation.fromJson(json['position'] as Map<String, dynamic>),
      title: json['title'] as String?,
      snippet: json['snippet'] as String?,
      icon: json['icon'] as String?,
      anchorU: (json['anchorU'] as num?)?.toDouble(),
      anchorV: (json['anchorV'] as num?)?.toDouble(),
      infoWindowAnchorU: (json['infoWindowAnchorU'] as num?)?.toDouble(),
      infoWindowAnchorV: (json['infoWindowAnchorV'] as num?)?.toDouble(),
      draggable: json['draggable'] as bool?,
      visible: json['visible'] as bool?,
      alpha: (json['alpha'] as num?)?.toDouble(),
      rotation: (json['rotation'] as num?)?.toDouble(),
      metadata: json['metadata'] as Map<String, dynamic>? ?? const {},
    );

Map<String, dynamic> _$MapplsMarkerToJson(MapplsMarker instance) =>
    <String, dynamic>{
      'id': instance.id,
      'position': instance.position,
      'title': instance.title,
      'snippet': instance.snippet,
      'icon': instance.icon,
      'anchorU': instance.anchorU,
      'anchorV': instance.anchorV,
      'infoWindowAnchorU': instance.infoWindowAnchorU,
      'infoWindowAnchorV': instance.infoWindowAnchorV,
      'draggable': instance.draggable,
      'visible': instance.visible,
      'alpha': instance.alpha,
      'rotation': instance.rotation,
      'metadata': instance.metadata,
    };

MapplsCluster _$MapplsClusterFromJson(Map<String, dynamic> json) =>
    MapplsCluster(
      id: json['id'] as String,
      position:
          MapplsLocation.fromJson(json['position'] as Map<String, dynamic>),
      markers: (json['markers'] as List<dynamic>)
          .map((e) => MapplsMarker.fromJson(e as Map<String, dynamic>))
          .toList(),
      count: (json['count'] as num).toInt(),
      title: json['title'] as String?,
      snippet: json['snippet'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>? ?? const {},
    );

Map<String, dynamic> _$MapplsClusterToJson(MapplsCluster instance) =>
    <String, dynamic>{
      'id': instance.id,
      'position': instance.position,
      'markers': instance.markers,
      'count': instance.count,
      'title': instance.title,
      'snippet': instance.snippet,
      'metadata': instance.metadata,
    };

MapplsSearchResult _$MapplsSearchResultFromJson(Map<String, dynamic> json) =>
    MapplsSearchResult(
      places: (json['places'] as List<dynamic>)
          .map((e) => MapplsPlace.fromJson(e as Map<String, dynamic>))
          .toList(),
      nextPageToken: json['nextPageToken'] as String?,
      status: json['status'] as String?,
      errorMessage: json['errorMessage'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>? ?? const {},
    );

Map<String, dynamic> _$MapplsSearchResultToJson(MapplsSearchResult instance) =>
    <String, dynamic>{
      'places': instance.places,
      'nextPageToken': instance.nextPageToken,
      'status': instance.status,
      'errorMessage': instance.errorMessage,
      'metadata': instance.metadata,
    };
