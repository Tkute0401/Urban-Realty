import 'package:json_annotation/json_annotation.dart';

part 'sharing_models.g.dart';

/// Share content model
@JsonSerializable()
class ShareContent {
  final String id;
  final String title;
  final String description;
  final String? imageUrl;
  final String? videoUrl;
  final String? url;
  final ShareType type;
  final Map<String, dynamic> metadata;
  final DateTime createdAt;
  final DateTime updatedAt;

  const ShareContent({
    required this.id,
    required this.title,
    required this.description,
    this.imageUrl,
    this.videoUrl,
    this.url,
    required this.type,
    required this.metadata,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ShareContent.fromJson(Map<String, dynamic> json) => _$ShareContentFromJson(json);
  Map<String, dynamic> toJson() => _$ShareContentToJson(this);

  ShareContent copyWith({
    String? id,
    String? title,
    String? description,
    String? imageUrl,
    String? videoUrl,
    String? url,
    ShareType? type,
    Map<String, dynamic>? metadata,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return ShareContent(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      imageUrl: imageUrl ?? this.imageUrl,
      videoUrl: videoUrl ?? this.videoUrl,
      url: url ?? this.url,
      type: type ?? this.type,
      metadata: metadata ?? this.metadata,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

/// Deep link model
@JsonSerializable()
class DeepLink {
  final String id;
  final String url;
  final String? shortUrl;
  final DeepLinkType type;
  final Map<String, dynamic> parameters;
  final String? title;
  final String? description;
  final String? imageUrl;
  final int clickCount;
  final DateTime createdAt;
  final DateTime? expiresAt;
  final bool isActive;
  final String? userId;

  const DeepLink({
    required this.id,
    required this.url,
    this.shortUrl,
    required this.type,
    required this.parameters,
    this.title,
    this.description,
    this.imageUrl,
    required this.clickCount,
    required this.createdAt,
    this.expiresAt,
    this.isActive = true,
    this.userId,
  });

  factory DeepLink.fromJson(Map<String, dynamic> json) => _$DeepLinkFromJson(json);
  Map<String, dynamic> toJson() => _$DeepLinkToJson(this);

  DeepLink copyWith({
    String? id,
    String? url,
    String? shortUrl,
    DeepLinkType? type,
    Map<String, dynamic>? parameters,
    String? title,
    String? description,
    String? imageUrl,
    int? clickCount,
    DateTime? createdAt,
    DateTime? expiresAt,
    bool? isActive,
    String? userId,
  }) {
    return DeepLink(
      id: id ?? this.id,
      url: url ?? this.url,
      shortUrl: shortUrl ?? this.shortUrl,
      type: type ?? this.type,
      parameters: parameters ?? this.parameters,
      title: title ?? this.title,
      description: description ?? this.description,
      imageUrl: imageUrl ?? this.imageUrl,
      clickCount: clickCount ?? this.clickCount,
      createdAt: createdAt ?? this.createdAt,
      expiresAt: expiresAt ?? this.expiresAt,
      isActive: isActive ?? this.isActive,
      userId: userId ?? this.userId,
    );
  }
}

/// Referral model
@JsonSerializable()
class Referral {
  final String id;
  final String referrerId;
  final String? referredId;
  final String referralCode;
  final ReferralStatus status;
  final double rewardAmount;
  final String? rewardType;
  final DateTime createdAt;
  final DateTime? completedAt;
  final Map<String, dynamic> metadata;
  final String? notes;

  const Referral({
    required this.id,
    required this.referrerId,
    this.referredId,
    required this.referralCode,
    required this.status,
    required this.rewardAmount,
    this.rewardType,
    required this.createdAt,
    this.completedAt,
    required this.metadata,
    this.notes,
  });

  factory Referral.fromJson(Map<String, dynamic> json) => _$ReferralFromJson(json);
  Map<String, dynamic> toJson() => _$ReferralToJson(this);

  Referral copyWith({
    String? id,
    String? referrerId,
    String? referredId,
    String? referralCode,
    ReferralStatus? status,
    double? rewardAmount,
    String? rewardType,
    DateTime? createdAt,
    DateTime? completedAt,
    Map<String, dynamic>? metadata,
    String? notes,
  }) {
    return Referral(
      id: id ?? this.id,
      referrerId: referrerId ?? this.referrerId,
      referredId: referredId ?? this.referredId,
      referralCode: referralCode ?? this.referralCode,
      status: status ?? this.status,
      rewardAmount: rewardAmount ?? this.rewardAmount,
      rewardType: rewardType ?? this.rewardType,
      createdAt: createdAt ?? this.createdAt,
      completedAt: completedAt ?? this.completedAt,
      metadata: metadata ?? this.metadata,
      notes: notes ?? this.notes,
    );
  }
}

/// Referral program model
@JsonSerializable()
class ReferralProgram {
  final String id;
  final String name;
  final String description;
  final double referrerReward;
  final double referredReward;
  final String rewardType;
  final int maxReferrals;
  final DateTime startDate;
  final DateTime endDate;
  final bool isActive;
  final Map<String, dynamic> terms;
  final List<String> eligibleUserTypes;
  final Map<String, dynamic> metadata;

  const ReferralProgram({
    required this.id,
    required this.name,
    required this.description,
    required this.referrerReward,
    required this.referredReward,
    required this.rewardType,
    required this.maxReferrals,
    required this.startDate,
    required this.endDate,
    required this.isActive,
    required this.terms,
    required this.eligibleUserTypes,
    required this.metadata,
  });

  factory ReferralProgram.fromJson(Map<String, dynamic> json) => _$ReferralProgramFromJson(json);
  Map<String, dynamic> toJson() => _$ReferralProgramToJson(this);
}

/// QR code model
@JsonSerializable()
class QRCode {
  final String id;
  final String data;
  final String? title;
  final String? description;
  final QRCodeType type;
  final Map<String, dynamic> metadata;
  final DateTime createdAt;
  final DateTime? expiresAt;
  final int scanCount;
  final bool isActive;

  const QRCode({
    required this.id,
    required this.data,
    this.title,
    this.description,
    required this.type,
    required this.metadata,
    required this.createdAt,
    this.expiresAt,
    required this.scanCount,
    this.isActive = true,
  });

  factory QRCode.fromJson(Map<String, dynamic> json) => _$QRCodeFromJson(json);
  Map<String, dynamic> toJson() => _$QRCodeToJson(this);
}

/// Share analytics model
@JsonSerializable()
class ShareAnalytics {
  final String id;
  final String contentId;
  final String platform;
  final int shareCount;
  final int clickCount;
  final int viewCount;
  final double conversionRate;
  final DateTime date;
  final Map<String, dynamic> metadata;

  const ShareAnalytics({
    required this.id,
    required this.contentId,
    required this.platform,
    required this.shareCount,
    required this.clickCount,
    required this.viewCount,
    required this.conversionRate,
    required this.date,
    required this.metadata,
  });

  factory ShareAnalytics.fromJson(Map<String, dynamic> json) => _$ShareAnalyticsFromJson(json);
  Map<String, dynamic> toJson() => _$ShareAnalyticsToJson(this);
}

/// Share platform model
@JsonSerializable()
class SharePlatform {
  final String id;
  final String name;
  final String displayName;
  final String icon;
  final bool isEnabled;
  final Map<String, dynamic> configuration;
  final int priority;

  const SharePlatform({
    required this.id,
    required this.name,
    required this.displayName,
    required this.icon,
    required this.isEnabled,
    required this.configuration,
    required this.priority,
  });

  factory SharePlatform.fromJson(Map<String, dynamic> json) => _$SharePlatformFromJson(json);
  Map<String, dynamic> toJson() => _$SharePlatformToJson(this);
}

/// Share types enum
enum ShareType {
  @JsonValue('property')
  property,
  @JsonValue('project')
  project,
  @JsonValue('agent')
  agent,
  @JsonValue('search')
  search,
  @JsonValue('general')
  general,
}

/// Deep link types enum
enum DeepLinkType {
  @JsonValue('property')
  property,
  @JsonValue('project')
  project,
  @JsonValue('agent')
  agent,
  @JsonValue('search')
  search,
  @JsonValue('profile')
  profile,
  @JsonValue('referral')
  referral,
  @JsonValue('general')
  general,
}

/// Referral status enum
enum ReferralStatus {
  @JsonValue('pending')
  pending,
  @JsonValue('completed')
  completed,
  @JsonValue('cancelled')
  cancelled,
  @JsonValue('expired')
  expired,
}

/// QR code types enum
enum QRCodeType {
  @JsonValue('property')
  property,
  @JsonValue('project')
  project,
  @JsonValue('agent')
  agent,
  @JsonValue('referral')
  referral,
  @JsonValue('url')
  url,
  @JsonValue('contact')
  contact,
  @JsonValue('general')
  general,
}


