import 'package:json_annotation/json_annotation.dart';

part 'mappls_models.g.dart';

/// MAPPLS address model
@JsonSerializable()
class MapplsAddress {
  final String formattedAddress;
  final MapplsLocation location;
  final String? placeId;
  final List<MapplsAddressComponent> addressComponents;
  final String? postalCode;
  final String? country;
  final String? state;
  final String? city;
  final String? locality;
  final String? subLocality;
  final String? streetNumber;
  final String? route;
  final String? neighborhood;
  final String? administrativeAreaLevel1;
  final String? administrativeAreaLevel2;
  final String? administrativeAreaLevel3;
  final String? administrativeAreaLevel4;
  final String? administrativeAreaLevel5;
  final String? subPremise;
  final String? premise;
  final String? countryCode;
  final String? stateCode;
  final double? confidence;
  final Map<String, dynamic> metadata;

  MapplsAddress({
    required this.formattedAddress,
    required this.location,
    this.placeId,
    this.addressComponents = const [],
    this.postalCode,
    this.country,
    this.state,
    this.city,
    this.locality,
    this.subLocality,
    this.streetNumber,
    this.route,
    this.neighborhood,
    this.administrativeAreaLevel1,
    this.administrativeAreaLevel2,
    this.administrativeAreaLevel3,
    this.administrativeAreaLevel4,
    this.administrativeAreaLevel5,
    this.subPremise,
    this.premise,
    this.countryCode,
    this.stateCode,
    this.confidence,
    this.metadata = const {},
  });

  factory MapplsAddress.fromJson(Map<String, dynamic> json) => _$MapplsAddressFromJson(json);
  Map<String, dynamic> toJson() => _$MapplsAddressToJson(this);

  String get shortAddress {
    final parts = <String>[];
    if (streetNumber != null) parts.add(streetNumber!);
    if (route != null) parts.add(route!);
    if (locality != null) parts.add(locality!);
    if (city != null) parts.add(city!);
    return parts.join(', ');
  }

  String get cityState {
    final parts = <String>[];
    if (city != null) parts.add(city!);
    if (state != null) parts.add(state!);
    return parts.join(', ');
  }
}

/// MAPPLS address component model
@JsonSerializable()
class MapplsAddressComponent {
  final String longName;
  final String shortName;
  final List<String> types;
  final String? placeId;

  MapplsAddressComponent({
    required this.longName,
    required this.shortName,
    required this.types,
    this.placeId,
  });

  factory MapplsAddressComponent.fromJson(Map<String, dynamic> json) => _$MapplsAddressComponentFromJson(json);
  Map<String, dynamic> toJson() => _$MapplsAddressComponentToJson(this);
}

/// MAPPLS location model
@JsonSerializable()
class MapplsLocation {
  final double latitude;
  final double longitude;

  MapplsLocation({
    required this.latitude,
    required this.longitude,
  });

  factory MapplsLocation.fromJson(Map<String, dynamic> json) => _$MapplsLocationFromJson(json);
  Map<String, dynamic> toJson() => _$MapplsLocationToJson(this);

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is MapplsLocation &&
        other.latitude == latitude &&
        other.longitude == longitude;
  }

  @override
  int get hashCode => latitude.hashCode ^ longitude.hashCode;

  @override
  String toString() => 'MapplsLocation(lat: $latitude, lng: $longitude)';
}

/// MAPPLS place model
@JsonSerializable()
class MapplsPlace {
  final String placeId;
  final String name;
  final MapplsLocation location;
  final String? formattedAddress;
  final String? phoneNumber;
  final String? website;
  final double? rating;
  final int? userRatingsTotal;
  final List<String> types;
  final String? businessStatus;
  final MapplsPlaceOpeningHours? openingHours;
  final List<MapplsPlacePhoto> photos;
  final MapplsPlacePriceLevel? priceLevel;
  final String? vicinity;
  final String? internationalPhoneNumber;
  final String? url;
  final String? scope;
  final Map<String, dynamic> metadata;

  MapplsPlace({
    required this.placeId,
    required this.name,
    required this.location,
    this.formattedAddress,
    this.phoneNumber,
    this.website,
    this.rating,
    this.userRatingsTotal,
    this.types = const [],
    this.businessStatus,
    this.openingHours,
    this.photos = const [],
    this.priceLevel,
    this.vicinity,
    this.internationalPhoneNumber,
    this.url,
    this.scope,
    this.metadata = const {},
  });

  factory MapplsPlace.fromJson(Map<String, dynamic> json) => _$MapplsPlaceFromJson(json);
  Map<String, dynamic> toJson() => _$MapplsPlaceToJson(this);

  bool get isOpen {
    if (openingHours == null) return true;
    return openingHours!.isOpen;
  }

  String get primaryType {
    if (types.isEmpty) return 'establishment';
    return types.first;
  }

  String get displayAddress {
    return formattedAddress ?? vicinity ?? 'Address not available';
  }
}

/// MAPPLS place opening hours model
@JsonSerializable()
class MapplsPlaceOpeningHours {
  final bool isOpen;
  final List<MapplsPlacePeriod> periods;
  final List<String> weekdayText;

  MapplsPlaceOpeningHours({
    required this.isOpen,
    this.periods = const [],
    this.weekdayText = const [],
  });

  factory MapplsPlaceOpeningHours.fromJson(Map<String, dynamic> json) => _$MapplsPlaceOpeningHoursFromJson(json);
  Map<String, dynamic> toJson() => _$MapplsPlaceOpeningHoursToJson(this);
}

/// MAPPLS place period model
@JsonSerializable()
class MapplsPlacePeriod {
  final MapplsPlaceTime? open;
  final MapplsPlaceTime? close;

  MapplsPlacePeriod({
    this.open,
    this.close,
  });

  factory MapplsPlacePeriod.fromJson(Map<String, dynamic> json) => _$MapplsPlacePeriodFromJson(json);
  Map<String, dynamic> toJson() => _$MapplsPlacePeriodToJson(this);
}

/// MAPPLS place time model
@JsonSerializable()
class MapplsPlaceTime {
  final int day;
  final String time;

  MapplsPlaceTime({
    required this.day,
    required this.time,
  });

  factory MapplsPlaceTime.fromJson(Map<String, dynamic> json) => _$MapplsPlaceTimeFromJson(json);
  Map<String, dynamic> toJson() => _$MapplsPlaceTimeToJson(this);
}

/// MAPPLS place photo model
@JsonSerializable()
class MapplsPlacePhoto {
  final String photoReference;
  final int height;
  final int width;
  final List<String> htmlAttributions;

  MapplsPlacePhoto({
    required this.photoReference,
    required this.height,
    required this.width,
    this.htmlAttributions = const [],
  });

  factory MapplsPlacePhoto.fromJson(Map<String, dynamic> json) => _$MapplsPlacePhotoFromJson(json);
  Map<String, dynamic> toJson() => _$MapplsPlacePhotoToJson(this);

  String get photoUrl {
    return 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=$width&photoreference=$photoReference&key=YOUR_API_KEY';
  }
}

@JsonEnum()
enum MapplsPlacePriceLevel {
  @JsonValue(0)
  free,
  @JsonValue(1)
  inexpensive,
  @JsonValue(2)
  moderate,
  @JsonValue(3)
  expensive,
  @JsonValue(4)
  veryExpensive,
}

/// MAPPLS route model
@JsonSerializable()
class MapplsRoute {
  final List<MapplsLocation> overviewPath;
  final List<MapplsRouteLeg> legs;
  final MapplsRouteBounds bounds;
  final String copyrights;
  final List<String> warnings;
  final String? summary;
  final Map<String, dynamic> metadata;

  MapplsRoute({
    required this.overviewPath,
    required this.legs,
    required this.bounds,
    required this.copyrights,
    this.warnings = const [],
    this.summary,
    this.metadata = const {},
  });

  factory MapplsRoute.fromJson(Map<String, dynamic> json) => _$MapplsRouteFromJson(json);
  Map<String, dynamic> toJson() => _$MapplsRouteToJson(this);

  Duration get totalDuration {
    return legs.fold(Duration.zero, (total, leg) => total + Duration(seconds: leg.duration.value));
  }

  int get totalDistance {
    return legs.fold(0, (total, leg) => total + leg.distance.value);
  }

  String get formattedDuration {
    final duration = totalDuration;
    if (duration.inHours > 0) {
      return '${duration.inHours}h ${duration.inMinutes % 60}m';
    } else {
      return '${duration.inMinutes}m';
    }
  }

  String get formattedDistance {
    final distance = totalDistance;
    if (distance >= 1000) {
      return '${(distance / 1000).toStringAsFixed(1)} km';
    } else {
      return '$distance m';
    }
  }
}

/// MAPPLS route leg model
@JsonSerializable()
class MapplsRouteLeg {
  final MapplsRouteDistance distance;
  final MapplsRouteDuration duration;
  final String? durationInTraffic;
  final MapplsLocation startLocation;
  final MapplsLocation endLocation;
  final String startAddress;
  final String endAddress;
  final List<MapplsRouteStep> steps;

  MapplsRouteLeg({
    required this.distance,
    required this.duration,
    this.durationInTraffic,
    required this.startLocation,
    required this.endLocation,
    required this.startAddress,
    required this.endAddress,
    this.steps = const [],
  });

  factory MapplsRouteLeg.fromJson(Map<String, dynamic> json) => _$MapplsRouteLegFromJson(json);
  Map<String, dynamic> toJson() => _$MapplsRouteLegToJson(this);
}

/// MAPPLS route step model
@JsonSerializable()
class MapplsRouteStep {
  final MapplsRouteDistance distance;
  final MapplsRouteDuration duration;
  final MapplsLocation startLocation;
  final MapplsLocation endLocation;
  final String htmlInstructions;
  final String? maneuver;
  final MapplsRoutePolyline polyline;

  MapplsRouteStep({
    required this.distance,
    required this.duration,
    required this.startLocation,
    required this.endLocation,
    required this.htmlInstructions,
    this.maneuver,
    required this.polyline,
  });

  factory MapplsRouteStep.fromJson(Map<String, dynamic> json) => _$MapplsRouteStepFromJson(json);
  Map<String, dynamic> toJson() => _$MapplsRouteStepToJson(this);
}

/// MAPPLS route distance model
@JsonSerializable()
class MapplsRouteDistance {
  final int value;
  final String text;

  MapplsRouteDistance({
    required this.value,
    required this.text,
  });

  factory MapplsRouteDistance.fromJson(Map<String, dynamic> json) => _$MapplsRouteDistanceFromJson(json);
  Map<String, dynamic> toJson() => _$MapplsRouteDistanceToJson(this);
}

/// MAPPLS route duration model
@JsonSerializable()
class MapplsRouteDuration {
  final int value;
  final String text;

  MapplsRouteDuration({
    required this.value,
    required this.text,
  });

  factory MapplsRouteDuration.fromJson(Map<String, dynamic> json) => _$MapplsRouteDurationFromJson(json);
  Map<String, dynamic> toJson() => _$MapplsRouteDurationToJson(this);
}

/// MAPPLS route bounds model
@JsonSerializable()
class MapplsRouteBounds {
  final MapplsLocation northeast;
  final MapplsLocation southwest;

  MapplsRouteBounds({
    required this.northeast,
    required this.southwest,
  });

  factory MapplsRouteBounds.fromJson(Map<String, dynamic> json) => _$MapplsRouteBoundsFromJson(json);
  Map<String, dynamic> toJson() => _$MapplsRouteBoundsToJson(this);
}

/// MAPPLS route polyline model
@JsonSerializable()
class MapplsRoutePolyline {
  final String points;

  MapplsRoutePolyline({
    required this.points,
  });

  factory MapplsRoutePolyline.fromJson(Map<String, dynamic> json) => _$MapplsRoutePolylineFromJson(json);
  Map<String, dynamic> toJson() => _$MapplsRoutePolylineToJson(this);
}

/// MAPPLS waypoint model
@JsonSerializable()
class MapplsWaypoint {
  final double latitude;
  final double longitude;
  final bool? stopover;

  MapplsWaypoint({
    required this.latitude,
    required this.longitude,
    this.stopover,
  });

  factory MapplsWaypoint.fromJson(Map<String, dynamic> json) => _$MapplsWaypointFromJson(json);
  Map<String, dynamic> toJson() => _$MapplsWaypointToJson(this);
}

/// MAPPLS distance model
@JsonSerializable()
class MapplsDistance {
  final MapplsRouteDistance distance;
  final MapplsRouteDuration duration;
  final String status;

  MapplsDistance({
    required this.distance,
    required this.duration,
    required this.status,
  });

  factory MapplsDistance.fromJson(Map<String, dynamic> json) => _$MapplsDistanceFromJson(json);
  Map<String, dynamic> toJson() => _$MapplsDistanceToJson(this);

  bool get isSuccessful => status == 'OK';
}

/// MAPPLS marker model
@JsonSerializable()
class MapplsMarker {
  final String id;
  final MapplsLocation position;
  final String? title;
  final String? snippet;
  final String? icon;
  final double? anchorU;
  final double? anchorV;
  final double? infoWindowAnchorU;
  final double? infoWindowAnchorV;
  final bool? draggable;
  final bool? visible;
  final double? alpha;
  final double? rotation;
  final Map<String, dynamic> metadata;

  MapplsMarker({
    required this.id,
    required this.position,
    this.title,
    this.snippet,
    this.icon,
    this.anchorU,
    this.anchorV,
    this.infoWindowAnchorU,
    this.infoWindowAnchorV,
    this.draggable,
    this.visible,
    this.alpha,
    this.rotation,
    this.metadata = const {},
  });

  factory MapplsMarker.fromJson(Map<String, dynamic> json) => _$MapplsMarkerFromJson(json);
  Map<String, dynamic> toJson() => _$MapplsMarkerToJson(this);
}

/// MAPPLS cluster model
@JsonSerializable()
class MapplsCluster {
  final String id;
  final MapplsLocation position;
  final List<MapplsMarker> markers;
  final int count;
  final String? title;
  final String? snippet;
  final Map<String, dynamic> metadata;

  MapplsCluster({
    required this.id,
    required this.position,
    required this.markers,
    required this.count,
    this.title,
    this.snippet,
    this.metadata = const {},
  });

  factory MapplsCluster.fromJson(Map<String, dynamic> json) => _$MapplsClusterFromJson(json);
  Map<String, dynamic> toJson() => _$MapplsClusterToJson(this);
}

/// MAPPLS search result model
@JsonSerializable()
class MapplsSearchResult {
  final List<MapplsPlace> places;
  final String? nextPageToken;
  final String? status;
  final String? errorMessage;
  final Map<String, dynamic> metadata;

  MapplsSearchResult({
    required this.places,
    this.nextPageToken,
    this.status,
    this.errorMessage,
    this.metadata = const {},
  });

  factory MapplsSearchResult.fromJson(Map<String, dynamic> json) => _$MapplsSearchResultFromJson(json);
  Map<String, dynamic> toJson() => _$MapplsSearchResultToJson(this);

  bool get isSuccessful => status == 'OK';
  bool get hasNextPage => nextPageToken != null && nextPageToken!.isNotEmpty;
}
