import 'package:json_annotation/json_annotation.dart';

part 'admin_models.g.dart';

/// Report model for admin analytics
@JsonSerializable()
class Report {
  final String id;
  final String title;
  final String description;
  final ReportType type;
  final ReportStatus status;
  final Map<String, dynamic> data;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String createdBy;
  final String? updatedBy;
  final List<String> tags;
  final bool isPublic;
  final String? notes;

  Report({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.status,
    required this.data,
    required this.createdAt,
    required this.updatedAt,
    required this.createdBy,
    this.updatedBy,
    this.tags = const [],
    this.isPublic = false,
    this.notes,
  });

  factory Report.fromJson(Map<String, dynamic> json) => _$ReportFromJson(json);
  Map<String, dynamic> toJson() => _$ReportToJson(this);
}

@JsonEnum()
enum ReportType {
  @JsonValue('analytics')
  analytics,
  @JsonValue('financial')
  financial,
  @JsonValue('user_activity')
  userActivity,
  @JsonValue('property_performance')
  propertyPerformance,
  @JsonValue('system_health')
  systemHealth,
  @JsonValue('custom')
  custom,
}

@JsonEnum()
enum ReportStatus {
  @JsonValue('draft')
  draft,
  @JsonValue('generating')
  generating,
  @JsonValue('completed')
  completed,
  @JsonValue('failed')
  failed,
  @JsonValue('archived')
  archived,
}

/// Media model for file management
@JsonSerializable()
class Media {
  final String id;
  final String filename;
  final String originalName;
  final String mimeType;
  final int size;
  final String url;
  final String? thumbnailUrl;
  final MediaType type;
  final String? description;
  final List<String> tags;
  final String uploadedBy;
  final DateTime uploadedAt;
  final DateTime? lastAccessedAt;
  final int accessCount;
  final bool isPublic;
  final Map<String, dynamic> metadata;
  final String? folderId;
  final List<String> usedIn;

  Media({
    required this.id,
    required this.filename,
    required this.originalName,
    required this.mimeType,
    required this.size,
    required this.url,
    this.thumbnailUrl,
    required this.type,
    this.description,
    this.tags = const [],
    required this.uploadedBy,
    required this.uploadedAt,
    this.lastAccessedAt,
    this.accessCount = 0,
    this.isPublic = false,
    this.metadata = const {},
    this.folderId,
    this.usedIn = const [],
  });

  factory Media.fromJson(Map<String, dynamic> json) => _$MediaFromJson(json);
  Map<String, dynamic> toJson() => _$MediaToJson(this);
}

@JsonEnum()
enum MediaType {
  @JsonValue('image')
  image,
  @JsonValue('video')
  video,
  @JsonValue('document')
  document,
  @JsonValue('audio')
  audio,
  @JsonValue('archive')
  archive,
  @JsonValue('other')
  other,
}

/// Contact model for contact management
@JsonSerializable()
class Contact {
  final String id;
  final String name;
  final String email;
  final String? phone;
  final String? company;
  final String? position;
  final ContactType type;
  final ContactStatus status;
  final String? notes;
  final List<String> tags;
  final Map<String, dynamic> customFields;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String createdBy;
  final String? assignedTo;
  final DateTime? lastContactedAt;
  final int contactCount;
  final String? source;
  final Map<String, dynamic> metadata;

  Contact({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    this.company,
    this.position,
    required this.type,
    required this.status,
    this.notes,
    this.tags = const [],
    this.customFields = const {},
    required this.createdAt,
    required this.updatedAt,
    required this.createdBy,
    this.assignedTo,
    this.lastContactedAt,
    this.contactCount = 0,
    this.source,
    this.metadata = const {},
  });

  factory Contact.fromJson(Map<String, dynamic> json) => _$ContactFromJson(json);
  Map<String, dynamic> toJson() => _$ContactToJson(this);
}

@JsonEnum()
enum ContactType {
  @JsonValue('lead')
  lead,
  @JsonValue('customer')
  customer,
  @JsonValue('vendor')
  vendor,
  @JsonValue('partner')
  partner,
  @JsonValue('employee')
  employee,
  @JsonValue('other')
  other,
}

@JsonEnum()
enum ContactStatus {
  @JsonValue('new')
  new_,
  @JsonValue('contacted')
  contacted,
  @JsonValue('qualified')
  qualified,
  @JsonValue('converted')
  converted,
  @JsonValue('lost')
  lost,
  @JsonValue('inactive')
  inactive,
}

/// Inquiry model for inquiry management
@JsonSerializable()
class Inquiry {
  final String id;
  final String name;
  final String email;
  final String? phone;
  final String subject;
  final String message;
  final InquiryType type;
  final InquiryStatus status;
  final String? propertyId;
  final String? assignedTo;
  final String? notes;
  final List<String> tags;
  final Map<String, dynamic> customFields;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String createdBy;
  final DateTime? lastResponseAt;
  final int responseCount;
  final String? source;
  final Map<String, dynamic> metadata;
  final List<InquiryResponse> responses;

  Inquiry({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    required this.subject,
    required this.message,
    required this.type,
    required this.status,
    this.propertyId,
    this.assignedTo,
    this.notes,
    this.tags = const [],
    this.customFields = const {},
    required this.createdAt,
    required this.updatedAt,
    required this.createdBy,
    this.lastResponseAt,
    this.responseCount = 0,
    this.source,
    this.metadata = const {},
    this.responses = const [],
  });

  factory Inquiry.fromJson(Map<String, dynamic> json) => _$InquiryFromJson(json);
  Map<String, dynamic> toJson() => _$InquiryToJson(this);
}

@JsonEnum()
enum InquiryType {
  @JsonValue('general')
  general,
  @JsonValue('property')
  property,
  @JsonValue('support')
  support,
  @JsonValue('partnership')
  partnership,
  @JsonValue('media')
  media,
  @JsonValue('other')
  other,
}

@JsonEnum()
enum InquiryStatus {
  @JsonValue('new')
  new_,
  @JsonValue('in_progress')
  inProgress,
  @JsonValue('responded')
  responded,
  @JsonValue('resolved')
  resolved,
  @JsonValue('closed')
  closed,
  @JsonValue('spam')
  spam,
}

/// Inquiry response model
@JsonSerializable()
class InquiryResponse {
  final String id;
  final String inquiryId;
  final String message;
  final String respondedBy;
  final DateTime respondedAt;
  final bool isInternal;
  final List<String> attachments;

  InquiryResponse({
    required this.id,
    required this.inquiryId,
    required this.message,
    required this.respondedBy,
    required this.respondedAt,
    this.isInternal = false,
    this.attachments = const [],
  });

  factory InquiryResponse.fromJson(Map<String, dynamic> json) => _$InquiryResponseFromJson(json);
  Map<String, dynamic> toJson() => _$InquiryResponseToJson(this);
}

/// Subscription model for subscription management
@JsonSerializable()
class Subscription {
  final String id;
  final String userId;
  final String planId;
  final String planName;
  final SubscriptionStatus status;
  final DateTime startDate;
  final DateTime endDate;
  final DateTime? nextBillingDate;
  final double amount;
  final String currency;
  final BillingCycle cycle;
  final PaymentMethod paymentMethod;
  final String? paymentId;
  final Map<String, dynamic> features;
  final Map<String, dynamic> limits;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String createdBy;
  final String? notes;
  final List<SubscriptionHistory> history;

  Subscription({
    required this.id,
    required this.userId,
    required this.planId,
    required this.planName,
    required this.status,
    required this.startDate,
    required this.endDate,
    this.nextBillingDate,
    required this.amount,
    this.currency = 'INR',
    required this.cycle,
    required this.paymentMethod,
    this.paymentId,
    this.features = const {},
    this.limits = const {},
    required this.createdAt,
    required this.updatedAt,
    required this.createdBy,
    this.notes,
    this.history = const [],
  });

  factory Subscription.fromJson(Map<String, dynamic> json) => _$SubscriptionFromJson(json);
  Map<String, dynamic> toJson() => _$SubscriptionToJson(this);
}

@JsonEnum()
enum SubscriptionStatus {
  @JsonValue('active')
  active,
  @JsonValue('inactive')
  inactive,
  @JsonValue('cancelled')
  cancelled,
  @JsonValue('expired')
  expired,
  @JsonValue('suspended')
  suspended,
  @JsonValue('pending')
  pending,
}

@JsonEnum()
enum BillingCycle {
  @JsonValue('monthly')
  monthly,
  @JsonValue('quarterly')
  quarterly,
  @JsonValue('yearly')
  yearly,
  @JsonValue('lifetime')
  lifetime,
}

@JsonEnum()
enum PaymentMethod {
  @JsonValue('credit_card')
  creditCard,
  @JsonValue('debit_card')
  debitCard,
  @JsonValue('net_banking')
  netBanking,
  @JsonValue('upi')
  upi,
  @JsonValue('wallet')
  wallet,
  @JsonValue('bank_transfer')
  bankTransfer,
  @JsonValue('other')
  other,
}

/// Subscription history model
@JsonSerializable()
class SubscriptionHistory {
  final String id;
  final String subscriptionId;
  final String action;
  final String description;
  final Map<String, dynamic> data;
  final DateTime timestamp;
  final String performedBy;

  SubscriptionHistory({
    required this.id,
    required this.subscriptionId,
    required this.action,
    required this.description,
    this.data = const {},
    required this.timestamp,
    required this.performedBy,
  });

  factory SubscriptionHistory.fromJson(Map<String, dynamic> json) => _$SubscriptionHistoryFromJson(json);
  Map<String, dynamic> toJson() => _$SubscriptionHistoryToJson(this);
}

/// Admin dashboard stats model
@JsonSerializable()
class AdminStats {
  final int totalUsers;
  final int activeUsers;
  final int totalProperties;
  final int activeProperties;
  final int totalInquiries;
  final int pendingInquiries;
  final int totalContacts;
  final int totalSubscriptions;
  final int activeSubscriptions;
  final double totalRevenue;
  final double monthlyRevenue;
  final Map<String, int> userGrowth;
  final Map<String, int> propertyGrowth;
  final Map<String, double> revenueGrowth;
  final List<Map<String, dynamic>> topProperties;
  final List<Map<String, dynamic>> recentActivities;

  AdminStats({
    required this.totalUsers,
    required this.activeUsers,
    required this.totalProperties,
    required this.activeProperties,
    required this.totalInquiries,
    required this.pendingInquiries,
    required this.totalContacts,
    required this.totalSubscriptions,
    required this.activeSubscriptions,
    required this.totalRevenue,
    required this.monthlyRevenue,
    this.userGrowth = const {},
    this.propertyGrowth = const {},
    this.revenueGrowth = const {},
    this.topProperties = const [],
    this.recentActivities = const [],
  });

  factory AdminStats.fromJson(Map<String, dynamic> json) => _$AdminStatsFromJson(json);
  Map<String, dynamic> toJson() => _$AdminStatsToJson(this);
}


