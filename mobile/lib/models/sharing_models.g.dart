// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sharing_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ShareContent _$ShareContentFromJson(Map<String, dynamic> json) => ShareContent(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      imageUrl: json['imageUrl'] as String?,
      videoUrl: json['videoUrl'] as String?,
      url: json['url'] as String?,
      type: $enumDecode(_$ShareTypeEnumMap, json['type']),
      metadata: json['metadata'] as Map<String, dynamic>,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$ShareContentToJson(ShareContent instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'description': instance.description,
      'imageUrl': instance.imageUrl,
      'videoUrl': instance.videoUrl,
      'url': instance.url,
      'type': _$ShareTypeEnumMap[instance.type]!,
      'metadata': instance.metadata,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

const _$ShareTypeEnumMap = {
  ShareType.property: 'property',
  ShareType.project: 'project',
  ShareType.agent: 'agent',
  ShareType.search: 'search',
  ShareType.general: 'general',
};

DeepLink _$DeepLinkFromJson(Map<String, dynamic> json) => DeepLink(
      id: json['id'] as String,
      url: json['url'] as String,
      shortUrl: json['shortUrl'] as String?,
      type: $enumDecode(_$DeepLinkTypeEnumMap, json['type']),
      parameters: json['parameters'] as Map<String, dynamic>,
      title: json['title'] as String?,
      description: json['description'] as String?,
      imageUrl: json['imageUrl'] as String?,
      clickCount: (json['clickCount'] as num).toInt(),
      createdAt: DateTime.parse(json['createdAt'] as String),
      expiresAt: json['expiresAt'] == null
          ? null
          : DateTime.parse(json['expiresAt'] as String),
      isActive: json['isActive'] as bool? ?? true,
      userId: json['userId'] as String?,
    );

Map<String, dynamic> _$DeepLinkToJson(DeepLink instance) => <String, dynamic>{
      'id': instance.id,
      'url': instance.url,
      'shortUrl': instance.shortUrl,
      'type': _$DeepLinkTypeEnumMap[instance.type]!,
      'parameters': instance.parameters,
      'title': instance.title,
      'description': instance.description,
      'imageUrl': instance.imageUrl,
      'clickCount': instance.clickCount,
      'createdAt': instance.createdAt.toIso8601String(),
      'expiresAt': instance.expiresAt?.toIso8601String(),
      'isActive': instance.isActive,
      'userId': instance.userId,
    };

const _$DeepLinkTypeEnumMap = {
  DeepLinkType.property: 'property',
  DeepLinkType.project: 'project',
  DeepLinkType.agent: 'agent',
  DeepLinkType.search: 'search',
  DeepLinkType.profile: 'profile',
  DeepLinkType.referral: 'referral',
  DeepLinkType.general: 'general',
};

Referral _$ReferralFromJson(Map<String, dynamic> json) => Referral(
      id: json['id'] as String,
      referrerId: json['referrerId'] as String,
      referredId: json['referredId'] as String?,
      referralCode: json['referralCode'] as String,
      status: $enumDecode(_$ReferralStatusEnumMap, json['status']),
      rewardAmount: (json['rewardAmount'] as num).toDouble(),
      rewardType: json['rewardType'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      completedAt: json['completedAt'] == null
          ? null
          : DateTime.parse(json['completedAt'] as String),
      metadata: json['metadata'] as Map<String, dynamic>,
      notes: json['notes'] as String?,
    );

Map<String, dynamic> _$ReferralToJson(Referral instance) => <String, dynamic>{
      'id': instance.id,
      'referrerId': instance.referrerId,
      'referredId': instance.referredId,
      'referralCode': instance.referralCode,
      'status': _$ReferralStatusEnumMap[instance.status]!,
      'rewardAmount': instance.rewardAmount,
      'rewardType': instance.rewardType,
      'createdAt': instance.createdAt.toIso8601String(),
      'completedAt': instance.completedAt?.toIso8601String(),
      'metadata': instance.metadata,
      'notes': instance.notes,
    };

const _$ReferralStatusEnumMap = {
  ReferralStatus.pending: 'pending',
  ReferralStatus.completed: 'completed',
  ReferralStatus.cancelled: 'cancelled',
  ReferralStatus.expired: 'expired',
};

ReferralProgram _$ReferralProgramFromJson(Map<String, dynamic> json) =>
    ReferralProgram(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      referrerReward: (json['referrerReward'] as num).toDouble(),
      referredReward: (json['referredReward'] as num).toDouble(),
      rewardType: json['rewardType'] as String,
      maxReferrals: (json['maxReferrals'] as num).toInt(),
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: DateTime.parse(json['endDate'] as String),
      isActive: json['isActive'] as bool,
      terms: json['terms'] as Map<String, dynamic>,
      eligibleUserTypes: (json['eligibleUserTypes'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      metadata: json['metadata'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$ReferralProgramToJson(ReferralProgram instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'referrerReward': instance.referrerReward,
      'referredReward': instance.referredReward,
      'rewardType': instance.rewardType,
      'maxReferrals': instance.maxReferrals,
      'startDate': instance.startDate.toIso8601String(),
      'endDate': instance.endDate.toIso8601String(),
      'isActive': instance.isActive,
      'terms': instance.terms,
      'eligibleUserTypes': instance.eligibleUserTypes,
      'metadata': instance.metadata,
    };

QRCode _$QRCodeFromJson(Map<String, dynamic> json) => QRCode(
      id: json['id'] as String,
      data: json['data'] as String,
      title: json['title'] as String?,
      description: json['description'] as String?,
      type: $enumDecode(_$QRCodeTypeEnumMap, json['type']),
      metadata: json['metadata'] as Map<String, dynamic>,
      createdAt: DateTime.parse(json['createdAt'] as String),
      expiresAt: json['expiresAt'] == null
          ? null
          : DateTime.parse(json['expiresAt'] as String),
      scanCount: (json['scanCount'] as num).toInt(),
      isActive: json['isActive'] as bool? ?? true,
    );

Map<String, dynamic> _$QRCodeToJson(QRCode instance) => <String, dynamic>{
      'id': instance.id,
      'data': instance.data,
      'title': instance.title,
      'description': instance.description,
      'type': _$QRCodeTypeEnumMap[instance.type]!,
      'metadata': instance.metadata,
      'createdAt': instance.createdAt.toIso8601String(),
      'expiresAt': instance.expiresAt?.toIso8601String(),
      'scanCount': instance.scanCount,
      'isActive': instance.isActive,
    };

const _$QRCodeTypeEnumMap = {
  QRCodeType.property: 'property',
  QRCodeType.project: 'project',
  QRCodeType.agent: 'agent',
  QRCodeType.referral: 'referral',
  QRCodeType.url: 'url',
  QRCodeType.contact: 'contact',
  QRCodeType.general: 'general',
};

ShareAnalytics _$ShareAnalyticsFromJson(Map<String, dynamic> json) =>
    ShareAnalytics(
      id: json['id'] as String,
      contentId: json['contentId'] as String,
      platform: json['platform'] as String,
      shareCount: (json['shareCount'] as num).toInt(),
      clickCount: (json['clickCount'] as num).toInt(),
      viewCount: (json['viewCount'] as num).toInt(),
      conversionRate: (json['conversionRate'] as num).toDouble(),
      date: DateTime.parse(json['date'] as String),
      metadata: json['metadata'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$ShareAnalyticsToJson(ShareAnalytics instance) =>
    <String, dynamic>{
      'id': instance.id,
      'contentId': instance.contentId,
      'platform': instance.platform,
      'shareCount': instance.shareCount,
      'clickCount': instance.clickCount,
      'viewCount': instance.viewCount,
      'conversionRate': instance.conversionRate,
      'date': instance.date.toIso8601String(),
      'metadata': instance.metadata,
    };

SharePlatform _$SharePlatformFromJson(Map<String, dynamic> json) =>
    SharePlatform(
      id: json['id'] as String,
      name: json['name'] as String,
      displayName: json['displayName'] as String,
      icon: json['icon'] as String,
      isEnabled: json['isEnabled'] as bool,
      configuration: json['configuration'] as Map<String, dynamic>,
      priority: (json['priority'] as num).toInt(),
    );

Map<String, dynamic> _$SharePlatformToJson(SharePlatform instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'displayName': instance.displayName,
      'icon': instance.icon,
      'isEnabled': instance.isEnabled,
      'configuration': instance.configuration,
      'priority': instance.priority,
    };
