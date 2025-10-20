// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'profile_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UserProfile _$UserProfileFromJson(Map<String, dynamic> json) => UserProfile(
      id: json['id'] as String,
      email: json['email'] as String,
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      phone: json['phone'] as String?,
      profileImage: json['profileImage'] as String?,
      coverImage: json['coverImage'] as String?,
      dateOfBirth: json['dateOfBirth'] == null
          ? null
          : DateTime.parse(json['dateOfBirth'] as String),
      gender: $enumDecodeNullable(_$GenderEnumMap, json['gender']),
      bio: json['bio'] as String?,
      location: json['location'] as String?,
      website: json['website'] as String?,
      interests: (json['interests'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      languages: (json['languages'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      socialLinks: (json['socialLinks'] as List<dynamic>?)
              ?.map((e) => SocialLink.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      verification: ProfileVerification.fromJson(
          json['verification'] as Map<String, dynamic>),
      documents: (json['documents'] as List<dynamic>?)
              ?.map((e) => Document.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      privacy:
          PrivacySettings.fromJson(json['privacy'] as Map<String, dynamic>),
      notifications: NotificationSettings.fromJson(
          json['notifications'] as Map<String, dynamic>),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      lastActiveAt: json['lastActiveAt'] == null
          ? null
          : DateTime.parse(json['lastActiveAt'] as String),
      isActive: json['isActive'] as bool? ?? true,
      preferredLanguage: json['preferredLanguage'] as String?,
      timezone: json['timezone'] as String?,
    );

Map<String, dynamic> _$UserProfileToJson(UserProfile instance) =>
    <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'firstName': instance.firstName,
      'lastName': instance.lastName,
      'phone': instance.phone,
      'profileImage': instance.profileImage,
      'coverImage': instance.coverImage,
      'dateOfBirth': instance.dateOfBirth?.toIso8601String(),
      'gender': _$GenderEnumMap[instance.gender],
      'bio': instance.bio,
      'location': instance.location,
      'website': instance.website,
      'interests': instance.interests,
      'languages': instance.languages,
      'socialLinks': instance.socialLinks,
      'verification': instance.verification,
      'documents': instance.documents,
      'privacy': instance.privacy,
      'notifications': instance.notifications,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'lastActiveAt': instance.lastActiveAt?.toIso8601String(),
      'isActive': instance.isActive,
      'preferredLanguage': instance.preferredLanguage,
      'timezone': instance.timezone,
    };

const _$GenderEnumMap = {
  Gender.male: 'male',
  Gender.female: 'female',
  Gender.other: 'other',
  Gender.preferNotToSay: 'prefer_not_to_say',
};

SocialLink _$SocialLinkFromJson(Map<String, dynamic> json) => SocialLink(
      platform: json['platform'] as String,
      url: json['url'] as String,
      isPublic: json['isPublic'] as bool? ?? true,
    );

Map<String, dynamic> _$SocialLinkToJson(SocialLink instance) =>
    <String, dynamic>{
      'platform': instance.platform,
      'url': instance.url,
      'isPublic': instance.isPublic,
    };

ProfileVerification _$ProfileVerificationFromJson(Map<String, dynamic> json) =>
    ProfileVerification(
      isEmailVerified: json['isEmailVerified'] as bool? ?? false,
      isPhoneVerified: json['isPhoneVerified'] as bool? ?? false,
      isIdentityVerified: json['isIdentityVerified'] as bool? ?? false,
      isAddressVerified: json['isAddressVerified'] as bool? ?? false,
      emailVerifiedAt: json['emailVerifiedAt'] == null
          ? null
          : DateTime.parse(json['emailVerifiedAt'] as String),
      phoneVerifiedAt: json['phoneVerifiedAt'] == null
          ? null
          : DateTime.parse(json['phoneVerifiedAt'] as String),
      identityVerifiedAt: json['identityVerifiedAt'] == null
          ? null
          : DateTime.parse(json['identityVerifiedAt'] as String),
      addressVerifiedAt: json['addressVerifiedAt'] == null
          ? null
          : DateTime.parse(json['addressVerifiedAt'] as String),
      verificationMethod: json['verificationMethod'] as String?,
      verificationDocuments: (json['verificationDocuments'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
    );

Map<String, dynamic> _$ProfileVerificationToJson(
        ProfileVerification instance) =>
    <String, dynamic>{
      'isEmailVerified': instance.isEmailVerified,
      'isPhoneVerified': instance.isPhoneVerified,
      'isIdentityVerified': instance.isIdentityVerified,
      'isAddressVerified': instance.isAddressVerified,
      'emailVerifiedAt': instance.emailVerifiedAt?.toIso8601String(),
      'phoneVerifiedAt': instance.phoneVerifiedAt?.toIso8601String(),
      'identityVerifiedAt': instance.identityVerifiedAt?.toIso8601String(),
      'addressVerifiedAt': instance.addressVerifiedAt?.toIso8601String(),
      'verificationMethod': instance.verificationMethod,
      'verificationDocuments': instance.verificationDocuments,
    };

Document _$DocumentFromJson(Map<String, dynamic> json) => Document(
      id: json['id'] as String,
      type: $enumDecode(_$DocumentTypeEnumMap, json['type']),
      name: json['name'] as String,
      url: json['url'] as String,
      thumbnailUrl: json['thumbnailUrl'] as String?,
      status: $enumDecode(_$DocumentStatusEnumMap, json['status']),
      notes: json['notes'] as String?,
      uploadedAt: DateTime.parse(json['uploadedAt'] as String),
      verifiedAt: json['verifiedAt'] == null
          ? null
          : DateTime.parse(json['verifiedAt'] as String),
      verifiedBy: json['verifiedBy'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>? ?? const {},
      isPublic: json['isPublic'] as bool? ?? false,
    );

Map<String, dynamic> _$DocumentToJson(Document instance) => <String, dynamic>{
      'id': instance.id,
      'type': _$DocumentTypeEnumMap[instance.type]!,
      'name': instance.name,
      'url': instance.url,
      'thumbnailUrl': instance.thumbnailUrl,
      'status': _$DocumentStatusEnumMap[instance.status]!,
      'notes': instance.notes,
      'uploadedAt': instance.uploadedAt.toIso8601String(),
      'verifiedAt': instance.verifiedAt?.toIso8601String(),
      'verifiedBy': instance.verifiedBy,
      'metadata': instance.metadata,
      'isPublic': instance.isPublic,
    };

const _$DocumentTypeEnumMap = {
  DocumentType.identity: 'identity',
  DocumentType.address: 'address',
  DocumentType.income: 'income',
  DocumentType.employment: 'employment',
  DocumentType.bankStatement: 'bank_statement',
  DocumentType.taxDocument: 'tax_document',
  DocumentType.other: 'other',
};

const _$DocumentStatusEnumMap = {
  DocumentStatus.pending: 'pending',
  DocumentStatus.underReview: 'under_review',
  DocumentStatus.approved: 'approved',
  DocumentStatus.rejected: 'rejected',
  DocumentStatus.expired: 'expired',
};

PrivacySettings _$PrivacySettingsFromJson(Map<String, dynamic> json) =>
    PrivacySettings(
      showEmail: json['showEmail'] as bool? ?? false,
      showPhone: json['showPhone'] as bool? ?? false,
      showLocation: json['showLocation'] as bool? ?? true,
      showSocialLinks: json['showSocialLinks'] as bool? ?? true,
      showInterests: json['showInterests'] as bool? ?? true,
      showLastActive: json['showLastActive'] as bool? ?? true,
      allowMessages: json['allowMessages'] as bool? ?? true,
      allowCalls: json['allowCalls'] as bool? ?? true,
      showProfileToPublic: json['showProfileToPublic'] as bool? ?? false,
      showProfileToLoggedInUsers:
          json['showProfileToLoggedInUsers'] as bool? ?? true,
      showProfileToContacts: json['showProfileToContacts'] as bool? ?? true,
    );

Map<String, dynamic> _$PrivacySettingsToJson(PrivacySettings instance) =>
    <String, dynamic>{
      'showEmail': instance.showEmail,
      'showPhone': instance.showPhone,
      'showLocation': instance.showLocation,
      'showSocialLinks': instance.showSocialLinks,
      'showInterests': instance.showInterests,
      'showLastActive': instance.showLastActive,
      'allowMessages': instance.allowMessages,
      'allowCalls': instance.allowCalls,
      'showProfileToPublic': instance.showProfileToPublic,
      'showProfileToLoggedInUsers': instance.showProfileToLoggedInUsers,
      'showProfileToContacts': instance.showProfileToContacts,
    };

NotificationSettings _$NotificationSettingsFromJson(
        Map<String, dynamic> json) =>
    NotificationSettings(
      emailNotifications: json['emailNotifications'] as bool? ?? true,
      pushNotifications: json['pushNotifications'] as bool? ?? true,
      smsNotifications: json['smsNotifications'] as bool? ?? false,
      propertyAlerts: json['propertyAlerts'] as bool? ?? true,
      messageNotifications: json['messageNotifications'] as bool? ?? true,
      inquiryNotifications: json['inquiryNotifications'] as bool? ?? true,
      marketingEmails: json['marketingEmails'] as bool? ?? false,
      systemUpdates: json['systemUpdates'] as bool? ?? true,
      securityAlerts: json['securityAlerts'] as bool? ?? true,
      frequency: json['frequency'] as String? ?? 'immediate',
      quietHours: (json['quietHours'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
    );

Map<String, dynamic> _$NotificationSettingsToJson(
        NotificationSettings instance) =>
    <String, dynamic>{
      'emailNotifications': instance.emailNotifications,
      'pushNotifications': instance.pushNotifications,
      'smsNotifications': instance.smsNotifications,
      'propertyAlerts': instance.propertyAlerts,
      'messageNotifications': instance.messageNotifications,
      'inquiryNotifications': instance.inquiryNotifications,
      'marketingEmails': instance.marketingEmails,
      'systemUpdates': instance.systemUpdates,
      'securityAlerts': instance.securityAlerts,
      'frequency': instance.frequency,
      'quietHours': instance.quietHours,
    };

CropSettings _$CropSettingsFromJson(Map<String, dynamic> json) => CropSettings(
      x: (json['x'] as num).toDouble(),
      y: (json['y'] as num).toDouble(),
      width: (json['width'] as num).toDouble(),
      height: (json['height'] as num).toDouble(),
      rotation: (json['rotation'] as num?)?.toDouble() ?? 0.0,
      scale: (json['scale'] as num?)?.toDouble() ?? 1.0,
    );

Map<String, dynamic> _$CropSettingsToJson(CropSettings instance) =>
    <String, dynamic>{
      'x': instance.x,
      'y': instance.y,
      'width': instance.width,
      'height': instance.height,
      'rotation': instance.rotation,
      'scale': instance.scale,
    };

ProfileUpdateRequest _$ProfileUpdateRequestFromJson(
        Map<String, dynamic> json) =>
    ProfileUpdateRequest(
      firstName: json['firstName'] as String?,
      lastName: json['lastName'] as String?,
      phone: json['phone'] as String?,
      bio: json['bio'] as String?,
      location: json['location'] as String?,
      website: json['website'] as String?,
      interests: (json['interests'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      languages: (json['languages'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      socialLinks: (json['socialLinks'] as List<dynamic>?)
          ?.map((e) => SocialLink.fromJson(e as Map<String, dynamic>))
          .toList(),
      privacy: json['privacy'] == null
          ? null
          : PrivacySettings.fromJson(json['privacy'] as Map<String, dynamic>),
      notifications: json['notifications'] == null
          ? null
          : NotificationSettings.fromJson(
              json['notifications'] as Map<String, dynamic>),
      preferredLanguage: json['preferredLanguage'] as String?,
      timezone: json['timezone'] as String?,
    );

Map<String, dynamic> _$ProfileUpdateRequestToJson(
        ProfileUpdateRequest instance) =>
    <String, dynamic>{
      'firstName': instance.firstName,
      'lastName': instance.lastName,
      'phone': instance.phone,
      'bio': instance.bio,
      'location': instance.location,
      'website': instance.website,
      'interests': instance.interests,
      'languages': instance.languages,
      'socialLinks': instance.socialLinks,
      'privacy': instance.privacy,
      'notifications': instance.notifications,
      'preferredLanguage': instance.preferredLanguage,
      'timezone': instance.timezone,
    };

ImageUploadResult _$ImageUploadResultFromJson(Map<String, dynamic> json) =>
    ImageUploadResult(
      id: json['id'] as String,
      url: json['url'] as String,
      thumbnailUrl: json['thumbnailUrl'] as String?,
      size: (json['size'] as num).toInt(),
      mimeType: json['mimeType'] as String,
      cropSettings: json['cropSettings'] == null
          ? null
          : CropSettings.fromJson(json['cropSettings'] as Map<String, dynamic>),
      uploadedAt: DateTime.parse(json['uploadedAt'] as String),
    );

Map<String, dynamic> _$ImageUploadResultToJson(ImageUploadResult instance) =>
    <String, dynamic>{
      'id': instance.id,
      'url': instance.url,
      'thumbnailUrl': instance.thumbnailUrl,
      'size': instance.size,
      'mimeType': instance.mimeType,
      'cropSettings': instance.cropSettings,
      'uploadedAt': instance.uploadedAt.toIso8601String(),
    };

DocumentUploadResult _$DocumentUploadResultFromJson(
        Map<String, dynamic> json) =>
    DocumentUploadResult(
      id: json['id'] as String,
      url: json['url'] as String,
      thumbnailUrl: json['thumbnailUrl'] as String?,
      type: $enumDecode(_$DocumentTypeEnumMap, json['type']),
      name: json['name'] as String,
      size: (json['size'] as num).toInt(),
      mimeType: json['mimeType'] as String,
      uploadedAt: DateTime.parse(json['uploadedAt'] as String),
    );

Map<String, dynamic> _$DocumentUploadResultToJson(
        DocumentUploadResult instance) =>
    <String, dynamic>{
      'id': instance.id,
      'url': instance.url,
      'thumbnailUrl': instance.thumbnailUrl,
      'type': _$DocumentTypeEnumMap[instance.type]!,
      'name': instance.name,
      'size': instance.size,
      'mimeType': instance.mimeType,
      'uploadedAt': instance.uploadedAt.toIso8601String(),
    };
