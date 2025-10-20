import 'package:json_annotation/json_annotation.dart';

part 'profile_models.g.dart';

/// Enhanced user profile model with verification and documents
@JsonSerializable()
class UserProfile {
  final String id;
  final String email;
  final String firstName;
  final String lastName;
  final String? phone;
  final String? profileImage;
  final String? coverImage;
  final DateTime? dateOfBirth;
  final Gender? gender;
  final String? bio;
  final String? location;
  final String? website;
  final List<String> interests;
  final List<String> languages;
  final List<SocialLink> socialLinks;
  final ProfileVerification verification;
  final List<Document> documents;
  final PrivacySettings privacy;
  final NotificationSettings notifications;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? lastActiveAt;
  final bool isActive;
  final String? preferredLanguage;
  final String? timezone;

  UserProfile({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    this.phone,
    this.profileImage,
    this.coverImage,
    this.dateOfBirth,
    this.gender,
    this.bio,
    this.location,
    this.website,
    this.interests = const [],
    this.languages = const [],
    this.socialLinks = const [],
    required this.verification,
    this.documents = const [],
    required this.privacy,
    required this.notifications,
    required this.createdAt,
    required this.updatedAt,
    this.lastActiveAt,
    this.isActive = true,
    this.preferredLanguage,
    this.timezone,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) => _$UserProfileFromJson(json);
  Map<String, dynamic> toJson() => _$UserProfileToJson(this);

  String get fullName => '$firstName $lastName';
  String get displayName => fullName;
  bool get isVerified => verification.isEmailVerified && verification.isPhoneVerified;
  bool get hasProfileImage => profileImage != null && profileImage!.isNotEmpty;
  bool get hasCoverImage => coverImage != null && coverImage!.isNotEmpty;
}

@JsonEnum()
enum Gender {
  @JsonValue('male')
  male,
  @JsonValue('female')
  female,
  @JsonValue('other')
  other,
  @JsonValue('prefer_not_to_say')
  preferNotToSay,
}

/// Social media link model
@JsonSerializable()
class SocialLink {
  final String platform;
  final String url;
  final bool isPublic;

  SocialLink({
    required this.platform,
    required this.url,
    this.isPublic = true,
  });

  factory SocialLink.fromJson(Map<String, dynamic> json) => _$SocialLinkFromJson(json);
  Map<String, dynamic> toJson() => _$SocialLinkToJson(this);
}

/// Profile verification status
@JsonSerializable()
class ProfileVerification {
  final bool isEmailVerified;
  final bool isPhoneVerified;
  final bool isIdentityVerified;
  final bool isAddressVerified;
  final DateTime? emailVerifiedAt;
  final DateTime? phoneVerifiedAt;
  final DateTime? identityVerifiedAt;
  final DateTime? addressVerifiedAt;
  final String? verificationMethod;
  final List<String> verificationDocuments;

  ProfileVerification({
    this.isEmailVerified = false,
    this.isPhoneVerified = false,
    this.isIdentityVerified = false,
    this.isAddressVerified = false,
    this.emailVerifiedAt,
    this.phoneVerifiedAt,
    this.identityVerifiedAt,
    this.addressVerifiedAt,
    this.verificationMethod,
    this.verificationDocuments = const [],
  });

  factory ProfileVerification.fromJson(Map<String, dynamic> json) => _$ProfileVerificationFromJson(json);
  Map<String, dynamic> toJson() => _$ProfileVerificationToJson(this);

  bool get isFullyVerified => isEmailVerified && isPhoneVerified && isIdentityVerified && isAddressVerified;
  double get verificationProgress {
    int verified = 0;
    if (isEmailVerified) verified++;
    if (isPhoneVerified) verified++;
    if (isIdentityVerified) verified++;
    if (isAddressVerified) verified++;
    return verified / 4.0;
  }
}

/// Document model for verification
@JsonSerializable()
class Document {
  final String id;
  final DocumentType type;
  final String name;
  final String url;
  final String? thumbnailUrl;
  final DocumentStatus status;
  final String? notes;
  final DateTime uploadedAt;
  final DateTime? verifiedAt;
  final String? verifiedBy;
  final Map<String, dynamic> metadata;
  final bool isPublic;

  Document({
    required this.id,
    required this.type,
    required this.name,
    required this.url,
    this.thumbnailUrl,
    required this.status,
    this.notes,
    required this.uploadedAt,
    this.verifiedAt,
    this.verifiedBy,
    this.metadata = const {},
    this.isPublic = false,
  });

  factory Document.fromJson(Map<String, dynamic> json) => _$DocumentFromJson(json);
  Map<String, dynamic> toJson() => _$DocumentToJson(this);
}

@JsonEnum()
enum DocumentType {
  @JsonValue('identity')
  identity,
  @JsonValue('address')
  address,
  @JsonValue('income')
  income,
  @JsonValue('employment')
  employment,
  @JsonValue('bank_statement')
  bankStatement,
  @JsonValue('tax_document')
  taxDocument,
  @JsonValue('other')
  other,
}

@JsonEnum()
enum DocumentStatus {
  @JsonValue('pending')
  pending,
  @JsonValue('under_review')
  underReview,
  @JsonValue('approved')
  approved,
  @JsonValue('rejected')
  rejected,
  @JsonValue('expired')
  expired,
}

/// Privacy settings model
@JsonSerializable()
class PrivacySettings {
  final bool showEmail;
  final bool showPhone;
  final bool showLocation;
  final bool showSocialLinks;
  final bool showInterests;
  final bool showLastActive;
  final bool allowMessages;
  final bool allowCalls;
  final bool showProfileToPublic;
  final bool showProfileToLoggedInUsers;
  final bool showProfileToContacts;

  PrivacySettings({
    this.showEmail = false,
    this.showPhone = false,
    this.showLocation = true,
    this.showSocialLinks = true,
    this.showInterests = true,
    this.showLastActive = true,
    this.allowMessages = true,
    this.allowCalls = true,
    this.showProfileToPublic = false,
    this.showProfileToLoggedInUsers = true,
    this.showProfileToContacts = true,
  });

  factory PrivacySettings.fromJson(Map<String, dynamic> json) => _$PrivacySettingsFromJson(json);
  Map<String, dynamic> toJson() => _$PrivacySettingsToJson(this);
}

/// Notification settings model
@JsonSerializable()
class NotificationSettings {
  final bool emailNotifications;
  final bool pushNotifications;
  final bool smsNotifications;
  final bool propertyAlerts;
  final bool messageNotifications;
  final bool inquiryNotifications;
  final bool marketingEmails;
  final bool systemUpdates;
  final bool securityAlerts;
  final String frequency;
  final List<String> quietHours;

  NotificationSettings({
    this.emailNotifications = true,
    this.pushNotifications = true,
    this.smsNotifications = false,
    this.propertyAlerts = true,
    this.messageNotifications = true,
    this.inquiryNotifications = true,
    this.marketingEmails = false,
    this.systemUpdates = true,
    this.securityAlerts = true,
    this.frequency = 'immediate',
    this.quietHours = const [],
  });

  factory NotificationSettings.fromJson(Map<String, dynamic> json) => _$NotificationSettingsFromJson(json);
  Map<String, dynamic> toJson() => _$NotificationSettingsToJson(this);
}

/// Image crop settings model
@JsonSerializable()
class CropSettings {
  final double x;
  final double y;
  final double width;
  final double height;
  final double rotation;
  final double scale;

  CropSettings({
    required this.x,
    required this.y,
    required this.width,
    required this.height,
    this.rotation = 0.0,
    this.scale = 1.0,
  });

  factory CropSettings.fromJson(Map<String, dynamic> json) => _$CropSettingsFromJson(json);
  Map<String, dynamic> toJson() => _$CropSettingsToJson(this);
}

/// Profile update request model
@JsonSerializable()
class ProfileUpdateRequest {
  final String? firstName;
  final String? lastName;
  final String? phone;
  final String? bio;
  final String? location;
  final String? website;
  final List<String>? interests;
  final List<String>? languages;
  final List<SocialLink>? socialLinks;
  final PrivacySettings? privacy;
  final NotificationSettings? notifications;
  final String? preferredLanguage;
  final String? timezone;

  ProfileUpdateRequest({
    this.firstName,
    this.lastName,
    this.phone,
    this.bio,
    this.location,
    this.website,
    this.interests,
    this.languages,
    this.socialLinks,
    this.privacy,
    this.notifications,
    this.preferredLanguage,
    this.timezone,
  });

  factory ProfileUpdateRequest.fromJson(Map<String, dynamic> json) => _$ProfileUpdateRequestFromJson(json);
  Map<String, dynamic> toJson() => _$ProfileUpdateRequestToJson(this);
}

/// Image upload result model
@JsonSerializable()
class ImageUploadResult {
  final String id;
  final String url;
  final String? thumbnailUrl;
  final int size;
  final String mimeType;
  final CropSettings? cropSettings;
  final DateTime uploadedAt;

  ImageUploadResult({
    required this.id,
    required this.url,
    this.thumbnailUrl,
    required this.size,
    required this.mimeType,
    this.cropSettings,
    required this.uploadedAt,
  });

  factory ImageUploadResult.fromJson(Map<String, dynamic> json) => _$ImageUploadResultFromJson(json);
  Map<String, dynamic> toJson() => _$ImageUploadResultToJson(this);
}

/// Document upload result model
@JsonSerializable()
class DocumentUploadResult {
  final String id;
  final String url;
  final String? thumbnailUrl;
  final DocumentType type;
  final String name;
  final int size;
  final String mimeType;
  final DateTime uploadedAt;

  DocumentUploadResult({
    required this.id,
    required this.url,
    this.thumbnailUrl,
    required this.type,
    required this.name,
    required this.size,
    required this.mimeType,
    required this.uploadedAt,
  });

  factory DocumentUploadResult.fromJson(Map<String, dynamic> json) => _$DocumentUploadResultFromJson(json);
  Map<String, dynamic> toJson() => _$DocumentUploadResultToJson(this);
}


