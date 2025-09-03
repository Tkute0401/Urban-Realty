import "dart:convert";

class Property {
  final String id;
  final String title;
  final String description;
  final String type;
  final String status;
  final int price;
  final int bedrooms;
  final int bathrooms;
  final int area;
  final PropertyAddress address;
  final PropertyLocation location;
  final NearbyLocalities nearbyLocalities;
  final ProjectDetails projectDetails;
  final String buildingName;
  final String floorNumber;
  final List<String> amenities;
  final List<String> highlights;
  final List<PropertyImage> images;
  final bool featured;
  final PropertyAgent agent;
  final int views;
  final DateTime createdAt;
  final String slug;
  final List<String> approvals;
  final String constructionStatus;
  final List<String> floorPlanImages;

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
    required this.location,
    required this.nearbyLocalities,
    required this.projectDetails,
    required this.buildingName,
    required this.floorNumber,
    required this.amenities,
    required this.highlights,
    required this.images,
    required this.featured,
    required this.agent,
    required this.views,
    required this.createdAt,
    required this.slug,
    required this.approvals,
    required this.constructionStatus,
    required this.floorPlanImages,
  });

  factory Property.fromJson(Map<String, dynamic> json) {
    return Property(
      id: json["_id"] ?? json["id"] ?? "",
      title: json["title"] ?? "",
      description: json["description"] ?? "",
      type: json["type"] ?? "",
      status: json["status"] ?? "",
      price: json["price"] ?? 0,
      bedrooms: json["bedrooms"] ?? 0,
      bathrooms: json["bathrooms"] ?? 0,
      area: json["area"] ?? 0,
      address: PropertyAddress.fromJson(json["address"] ?? {}),
      location: PropertyLocation.fromJson(json["location"] ?? {}),
      nearbyLocalities: NearbyLocalities.fromJson(json["nearbyLocalities"] ?? {}),
      projectDetails: ProjectDetails.fromJson(json["projectDetails"] ?? {}),
      buildingName: json["buildingName"] ?? "",
      floorNumber: json["floorNumber"] ?? "",
      amenities: List<String>.from(json["amenities"] ?? []),
      highlights: List<String>.from(json["highlights"] ?? []),
      images: (json["images"] as List<dynamic>?)
          ?.map((img) => PropertyImage.fromJson(img))
          .toList() ?? [],
      featured: json["featured"] ?? false,
      agent: PropertyAgent.fromJson(json["agent"] ?? {}),
      views: json["views"] ?? 0,
      createdAt: DateTime.tryParse(json["createdAt"] ?? "") ?? DateTime.now(),
      slug: json["slug"] ?? "",
      approvals: List<String>.from(json["approvals"] ?? []),
      constructionStatus: json["constructionStatus"] ?? "",
      floorPlanImages: List<String>.from(json["floorPlanImages"] ?? []),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "_id": id,
      "title": title,
      "description": description,
      "type": type,
      "status": status,
      "price": price,
      "bedrooms": bedrooms,
      "bathrooms": bathrooms,
      "area": area,
      "address": address.toJson(),
      "location": location.toJson(),
      "nearbyLocalities": nearbyLocalities.toJson(),
      "projectDetails": projectDetails.toJson(),
      "buildingName": buildingName,
      "floorNumber": floorNumber,
      "amenities": amenities,
      "highlights": highlights,
      "images": images.map((img) => img.toJson()).toList(),
      "featured": featured,
      "agent": agent.toJson(),
      "views": views,
      "createdAt": createdAt.toIso8601String(),
      "slug": slug,
      "approvals": approvals,
      "constructionStatus": constructionStatus,
      "floorPlanImages": floorPlanImages,
    };
  }
}

class PropertyAddress {
  final String line1;
  final String street;
  final String city;
  final String locality;
  final String state;
  final String zipCode;
  final String country;
  final String formattedAddress;

  PropertyAddress({
    required this.line1,
    required this.street,
    required this.city,
    required this.locality,
    required this.state,
    required this.zipCode,
    required this.country,
    required this.formattedAddress,
  });

  factory PropertyAddress.fromJson(Map<String, dynamic> json) {
    return PropertyAddress(
      line1: json["line1"] ?? "",
      street: json["street"] ?? "",
      city: json["city"] ?? "",
      locality: json["locality"] ?? "",
      state: json["state"] ?? "",
      zipCode: json["zipCode"] ?? "",
      country: json["country"] ?? "",
      formattedAddress: json["formattedAddress"] ?? "",
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "line1": line1,
      "street": street,
      "city": city,
      "locality": locality,
      "state": state,
      "zipCode": zipCode,
      "country": country,
      "formattedAddress": formattedAddress,
    };
  }
}

class PropertyLocation {
  final String type;
  final List<double> coordinates;
  final String formattedAddress;
  final String street;
  final String city;
  final String state;
  final String zipCode;
  final String country;

  PropertyLocation({
    required this.type,
    required this.coordinates,
    required this.formattedAddress,
    required this.street,
    required this.city,
    required this.state,
    required this.zipCode,
    required this.country,
  });

  factory PropertyLocation.fromJson(Map<String, dynamic> json) {
    return PropertyLocation(
      type: json["type"] ?? "",
      coordinates: List<double>.from(json["coordinates"] ?? []),
      formattedAddress: json["formattedAddress"] ?? "",
      street: json["street"] ?? "",
      city: json["city"] ?? "",
      state: json["state"] ?? "",
      zipCode: json["zipCode"] ?? "",
      country: json["country"] ?? "",
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "type": type,
      "coordinates": coordinates,
      "formattedAddress": formattedAddress,
      "street": street,
      "city": city,
      "state": state,
      "zipCode": zipCode,
      "country": country,
    };
  }
}

class NearbyLocalities {
  final bool hasSchool;
  final String school;
  final bool hasHospital;
  final String hospital;
  final bool hasMall;
  final String mall;
  final bool hasPark;
  final String park;
  final bool hasTransport;
  final String transport;

  NearbyLocalities({
    required this.hasSchool,
    required this.school,
    required this.hasHospital,
    required this.hospital,
    required this.hasMall,
    required this.mall,
    required this.hasPark,
    required this.park,
    required this.hasTransport,
    required this.transport,
  });

  factory NearbyLocalities.fromJson(Map<String, dynamic> json) {
    return NearbyLocalities(
      hasSchool: json["hasSchool"] ?? false,
      school: json["school"] ?? "",
      hasHospital: json["hasHospital"] ?? false,
      hospital: json["hospital"] ?? "",
      hasMall: json["hasMall"] ?? false,
      mall: json["mall"] ?? "",
      hasPark: json["hasPark"] ?? false,
      park: json["park"] ?? "",
      hasTransport: json["hasTransport"] ?? false,
      transport: json["transport"] ?? "",
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "hasSchool": hasSchool,
      "school": school,
      "hasHospital": hasHospital,
      "hospital": hospital,
      "hasMall": hasMall,
      "mall": mall,
      "hasPark": hasPark,
      "park": park,
      "hasTransport": hasTransport,
      "transport": transport,
    };
  }
}

class ProjectDetails {
  final String projectArea;
  final String totalUnits;
  final DateTime? launchDate;
  final String reraId;
  final String configurations;

  ProjectDetails({
    required this.projectArea,
    required this.totalUnits,
    this.launchDate,
    required this.reraId,
    required this.configurations,
  });

  factory ProjectDetails.fromJson(Map<String, dynamic> json) {
    return ProjectDetails(
      projectArea: json["projectArea"] ?? "",
      totalUnits: json["totalUnits"] ?? "",
      launchDate: json["launchDate"] != null 
          ? DateTime.tryParse(json["launchDate"]) 
          : null,
      reraId: json["reraId"] ?? "",
      configurations: json["configurations"] ?? "",
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "projectArea": projectArea,
      "totalUnits": totalUnits,
      "launchDate": launchDate?.toIso8601String(),
      "reraId": reraId,
      "configurations": configurations,
    };
  }
}

class PropertyImage {
  final String url;
  final String publicId;
  final int width;
  final int height;
  final String id;
  final DateTime uploadedAt;

  PropertyImage({
    required this.url,
    required this.publicId,
    required this.width,
    required this.height,
    required this.id,
    required this.uploadedAt,
  });

  factory PropertyImage.fromJson(Map<String, dynamic> json) {
    return PropertyImage(
      url: json["url"] ?? "",
      publicId: json["publicId"] ?? "",
      width: json["width"] ?? 0,
      height: json["height"] ?? 0,
      id: json["_id"] ?? json["id"] ?? "",
      uploadedAt: DateTime.tryParse(json["uploadedAt"] ?? "") ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "url": url,
      "publicId": publicId,
      "width": width,
      "height": height,
      "id": id,
      "uploadedAt": uploadedAt.toIso8601String(),
    };
  }
}

class PropertyAgent {
  final String id;
  final String name;
  final String email;
  final String mobile;

  PropertyAgent({
    required this.id,
    required this.name,
    required this.email,
    required this.mobile,
  });

  factory PropertyAgent.fromJson(Map<String, dynamic> json) {
    return PropertyAgent(
      id: json["_id"] ?? json["id"] ?? "",
      name: json["name"] ?? "",
      email: json["email"] ?? "",
      mobile: json["mobile"] ?? "",
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "id": id,
      "name": name,
      "email": email,
      "mobile": mobile,
    };
  }
}
