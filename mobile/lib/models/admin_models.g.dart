// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'admin_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Report _$ReportFromJson(Map<String, dynamic> json) => Report(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      type: $enumDecode(_$ReportTypeEnumMap, json['type']),
      status: $enumDecode(_$ReportStatusEnumMap, json['status']),
      data: json['data'] as Map<String, dynamic>,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      createdBy: json['createdBy'] as String,
      updatedBy: json['updatedBy'] as String?,
      tags:
          (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList() ??
              const [],
      isPublic: json['isPublic'] as bool? ?? false,
      notes: json['notes'] as String?,
    );

Map<String, dynamic> _$ReportToJson(Report instance) => <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'description': instance.description,
      'type': _$ReportTypeEnumMap[instance.type]!,
      'status': _$ReportStatusEnumMap[instance.status]!,
      'data': instance.data,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'createdBy': instance.createdBy,
      'updatedBy': instance.updatedBy,
      'tags': instance.tags,
      'isPublic': instance.isPublic,
      'notes': instance.notes,
    };

const _$ReportTypeEnumMap = {
  ReportType.analytics: 'analytics',
  ReportType.financial: 'financial',
  ReportType.userActivity: 'user_activity',
  ReportType.propertyPerformance: 'property_performance',
  ReportType.systemHealth: 'system_health',
  ReportType.custom: 'custom',
};

const _$ReportStatusEnumMap = {
  ReportStatus.draft: 'draft',
  ReportStatus.generating: 'generating',
  ReportStatus.completed: 'completed',
  ReportStatus.failed: 'failed',
  ReportStatus.archived: 'archived',
};

Media _$MediaFromJson(Map<String, dynamic> json) => Media(
      id: json['id'] as String,
      filename: json['filename'] as String,
      originalName: json['originalName'] as String,
      mimeType: json['mimeType'] as String,
      size: (json['size'] as num).toInt(),
      url: json['url'] as String,
      thumbnailUrl: json['thumbnailUrl'] as String?,
      type: $enumDecode(_$MediaTypeEnumMap, json['type']),
      description: json['description'] as String?,
      tags:
          (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList() ??
              const [],
      uploadedBy: json['uploadedBy'] as String,
      uploadedAt: DateTime.parse(json['uploadedAt'] as String),
      lastAccessedAt: json['lastAccessedAt'] == null
          ? null
          : DateTime.parse(json['lastAccessedAt'] as String),
      accessCount: (json['accessCount'] as num?)?.toInt() ?? 0,
      isPublic: json['isPublic'] as bool? ?? false,
      metadata: json['metadata'] as Map<String, dynamic>? ?? const {},
      folderId: json['folderId'] as String?,
      usedIn: (json['usedIn'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
    );

Map<String, dynamic> _$MediaToJson(Media instance) => <String, dynamic>{
      'id': instance.id,
      'filename': instance.filename,
      'originalName': instance.originalName,
      'mimeType': instance.mimeType,
      'size': instance.size,
      'url': instance.url,
      'thumbnailUrl': instance.thumbnailUrl,
      'type': _$MediaTypeEnumMap[instance.type]!,
      'description': instance.description,
      'tags': instance.tags,
      'uploadedBy': instance.uploadedBy,
      'uploadedAt': instance.uploadedAt.toIso8601String(),
      'lastAccessedAt': instance.lastAccessedAt?.toIso8601String(),
      'accessCount': instance.accessCount,
      'isPublic': instance.isPublic,
      'metadata': instance.metadata,
      'folderId': instance.folderId,
      'usedIn': instance.usedIn,
    };

const _$MediaTypeEnumMap = {
  MediaType.image: 'image',
  MediaType.video: 'video',
  MediaType.document: 'document',
  MediaType.audio: 'audio',
  MediaType.archive: 'archive',
  MediaType.other: 'other',
};

Contact _$ContactFromJson(Map<String, dynamic> json) => Contact(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      phone: json['phone'] as String?,
      company: json['company'] as String?,
      position: json['position'] as String?,
      type: $enumDecode(_$ContactTypeEnumMap, json['type']),
      status: $enumDecode(_$ContactStatusEnumMap, json['status']),
      notes: json['notes'] as String?,
      tags:
          (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList() ??
              const [],
      customFields: json['customFields'] as Map<String, dynamic>? ?? const {},
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      createdBy: json['createdBy'] as String,
      assignedTo: json['assignedTo'] as String?,
      lastContactedAt: json['lastContactedAt'] == null
          ? null
          : DateTime.parse(json['lastContactedAt'] as String),
      contactCount: (json['contactCount'] as num?)?.toInt() ?? 0,
      source: json['source'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>? ?? const {},
    );

Map<String, dynamic> _$ContactToJson(Contact instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'email': instance.email,
      'phone': instance.phone,
      'company': instance.company,
      'position': instance.position,
      'type': _$ContactTypeEnumMap[instance.type]!,
      'status': _$ContactStatusEnumMap[instance.status]!,
      'notes': instance.notes,
      'tags': instance.tags,
      'customFields': instance.customFields,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'createdBy': instance.createdBy,
      'assignedTo': instance.assignedTo,
      'lastContactedAt': instance.lastContactedAt?.toIso8601String(),
      'contactCount': instance.contactCount,
      'source': instance.source,
      'metadata': instance.metadata,
    };

const _$ContactTypeEnumMap = {
  ContactType.lead: 'lead',
  ContactType.customer: 'customer',
  ContactType.vendor: 'vendor',
  ContactType.partner: 'partner',
  ContactType.employee: 'employee',
  ContactType.other: 'other',
};

const _$ContactStatusEnumMap = {
  ContactStatus.new_: 'new',
  ContactStatus.contacted: 'contacted',
  ContactStatus.qualified: 'qualified',
  ContactStatus.converted: 'converted',
  ContactStatus.lost: 'lost',
  ContactStatus.inactive: 'inactive',
};

Inquiry _$InquiryFromJson(Map<String, dynamic> json) => Inquiry(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      phone: json['phone'] as String?,
      subject: json['subject'] as String,
      message: json['message'] as String,
      type: $enumDecode(_$InquiryTypeEnumMap, json['type']),
      status: $enumDecode(_$InquiryStatusEnumMap, json['status']),
      propertyId: json['propertyId'] as String?,
      assignedTo: json['assignedTo'] as String?,
      notes: json['notes'] as String?,
      tags:
          (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList() ??
              const [],
      customFields: json['customFields'] as Map<String, dynamic>? ?? const {},
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      createdBy: json['createdBy'] as String,
      lastResponseAt: json['lastResponseAt'] == null
          ? null
          : DateTime.parse(json['lastResponseAt'] as String),
      responseCount: (json['responseCount'] as num?)?.toInt() ?? 0,
      source: json['source'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>? ?? const {},
      responses: (json['responses'] as List<dynamic>?)
              ?.map((e) => InquiryResponse.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
    );

Map<String, dynamic> _$InquiryToJson(Inquiry instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'email': instance.email,
      'phone': instance.phone,
      'subject': instance.subject,
      'message': instance.message,
      'type': _$InquiryTypeEnumMap[instance.type]!,
      'status': _$InquiryStatusEnumMap[instance.status]!,
      'propertyId': instance.propertyId,
      'assignedTo': instance.assignedTo,
      'notes': instance.notes,
      'tags': instance.tags,
      'customFields': instance.customFields,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'createdBy': instance.createdBy,
      'lastResponseAt': instance.lastResponseAt?.toIso8601String(),
      'responseCount': instance.responseCount,
      'source': instance.source,
      'metadata': instance.metadata,
      'responses': instance.responses,
    };

const _$InquiryTypeEnumMap = {
  InquiryType.general: 'general',
  InquiryType.property: 'property',
  InquiryType.support: 'support',
  InquiryType.partnership: 'partnership',
  InquiryType.media: 'media',
  InquiryType.other: 'other',
};

const _$InquiryStatusEnumMap = {
  InquiryStatus.new_: 'new',
  InquiryStatus.inProgress: 'in_progress',
  InquiryStatus.responded: 'responded',
  InquiryStatus.resolved: 'resolved',
  InquiryStatus.closed: 'closed',
  InquiryStatus.spam: 'spam',
};

InquiryResponse _$InquiryResponseFromJson(Map<String, dynamic> json) =>
    InquiryResponse(
      id: json['id'] as String,
      inquiryId: json['inquiryId'] as String,
      message: json['message'] as String,
      respondedBy: json['respondedBy'] as String,
      respondedAt: DateTime.parse(json['respondedAt'] as String),
      isInternal: json['isInternal'] as bool? ?? false,
      attachments: (json['attachments'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
    );

Map<String, dynamic> _$InquiryResponseToJson(InquiryResponse instance) =>
    <String, dynamic>{
      'id': instance.id,
      'inquiryId': instance.inquiryId,
      'message': instance.message,
      'respondedBy': instance.respondedBy,
      'respondedAt': instance.respondedAt.toIso8601String(),
      'isInternal': instance.isInternal,
      'attachments': instance.attachments,
    };

Subscription _$SubscriptionFromJson(Map<String, dynamic> json) => Subscription(
      id: json['id'] as String,
      userId: json['userId'] as String,
      planId: json['planId'] as String,
      planName: json['planName'] as String,
      status: $enumDecode(_$SubscriptionStatusEnumMap, json['status']),
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: DateTime.parse(json['endDate'] as String),
      nextBillingDate: json['nextBillingDate'] == null
          ? null
          : DateTime.parse(json['nextBillingDate'] as String),
      amount: (json['amount'] as num).toDouble(),
      currency: json['currency'] as String? ?? 'INR',
      cycle: $enumDecode(_$BillingCycleEnumMap, json['cycle']),
      paymentMethod: $enumDecode(_$PaymentMethodEnumMap, json['paymentMethod']),
      paymentId: json['paymentId'] as String?,
      features: json['features'] as Map<String, dynamic>? ?? const {},
      limits: json['limits'] as Map<String, dynamic>? ?? const {},
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      createdBy: json['createdBy'] as String,
      notes: json['notes'] as String?,
      history: (json['history'] as List<dynamic>?)
              ?.map((e) =>
                  SubscriptionHistory.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
    );

Map<String, dynamic> _$SubscriptionToJson(Subscription instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'planId': instance.planId,
      'planName': instance.planName,
      'status': _$SubscriptionStatusEnumMap[instance.status]!,
      'startDate': instance.startDate.toIso8601String(),
      'endDate': instance.endDate.toIso8601String(),
      'nextBillingDate': instance.nextBillingDate?.toIso8601String(),
      'amount': instance.amount,
      'currency': instance.currency,
      'cycle': _$BillingCycleEnumMap[instance.cycle]!,
      'paymentMethod': _$PaymentMethodEnumMap[instance.paymentMethod]!,
      'paymentId': instance.paymentId,
      'features': instance.features,
      'limits': instance.limits,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'createdBy': instance.createdBy,
      'notes': instance.notes,
      'history': instance.history,
    };

const _$SubscriptionStatusEnumMap = {
  SubscriptionStatus.active: 'active',
  SubscriptionStatus.inactive: 'inactive',
  SubscriptionStatus.cancelled: 'cancelled',
  SubscriptionStatus.expired: 'expired',
  SubscriptionStatus.suspended: 'suspended',
  SubscriptionStatus.pending: 'pending',
};

const _$BillingCycleEnumMap = {
  BillingCycle.monthly: 'monthly',
  BillingCycle.quarterly: 'quarterly',
  BillingCycle.yearly: 'yearly',
  BillingCycle.lifetime: 'lifetime',
};

const _$PaymentMethodEnumMap = {
  PaymentMethod.creditCard: 'credit_card',
  PaymentMethod.debitCard: 'debit_card',
  PaymentMethod.netBanking: 'net_banking',
  PaymentMethod.upi: 'upi',
  PaymentMethod.wallet: 'wallet',
  PaymentMethod.bankTransfer: 'bank_transfer',
  PaymentMethod.other: 'other',
};

SubscriptionHistory _$SubscriptionHistoryFromJson(Map<String, dynamic> json) =>
    SubscriptionHistory(
      id: json['id'] as String,
      subscriptionId: json['subscriptionId'] as String,
      action: json['action'] as String,
      description: json['description'] as String,
      data: json['data'] as Map<String, dynamic>? ?? const {},
      timestamp: DateTime.parse(json['timestamp'] as String),
      performedBy: json['performedBy'] as String,
    );

Map<String, dynamic> _$SubscriptionHistoryToJson(
        SubscriptionHistory instance) =>
    <String, dynamic>{
      'id': instance.id,
      'subscriptionId': instance.subscriptionId,
      'action': instance.action,
      'description': instance.description,
      'data': instance.data,
      'timestamp': instance.timestamp.toIso8601String(),
      'performedBy': instance.performedBy,
    };

AdminStats _$AdminStatsFromJson(Map<String, dynamic> json) => AdminStats(
      totalUsers: (json['totalUsers'] as num).toInt(),
      activeUsers: (json['activeUsers'] as num).toInt(),
      totalProperties: (json['totalProperties'] as num).toInt(),
      activeProperties: (json['activeProperties'] as num).toInt(),
      totalInquiries: (json['totalInquiries'] as num).toInt(),
      pendingInquiries: (json['pendingInquiries'] as num).toInt(),
      totalContacts: (json['totalContacts'] as num).toInt(),
      totalSubscriptions: (json['totalSubscriptions'] as num).toInt(),
      activeSubscriptions: (json['activeSubscriptions'] as num).toInt(),
      totalRevenue: (json['totalRevenue'] as num).toDouble(),
      monthlyRevenue: (json['monthlyRevenue'] as num).toDouble(),
      userGrowth: (json['userGrowth'] as Map<String, dynamic>?)?.map(
            (k, e) => MapEntry(k, (e as num).toInt()),
          ) ??
          const {},
      propertyGrowth: (json['propertyGrowth'] as Map<String, dynamic>?)?.map(
            (k, e) => MapEntry(k, (e as num).toInt()),
          ) ??
          const {},
      revenueGrowth: (json['revenueGrowth'] as Map<String, dynamic>?)?.map(
            (k, e) => MapEntry(k, (e as num).toDouble()),
          ) ??
          const {},
      topProperties: (json['topProperties'] as List<dynamic>?)
              ?.map((e) => e as Map<String, dynamic>)
              .toList() ??
          const [],
      recentActivities: (json['recentActivities'] as List<dynamic>?)
              ?.map((e) => e as Map<String, dynamic>)
              .toList() ??
          const [],
    );

Map<String, dynamic> _$AdminStatsToJson(AdminStats instance) =>
    <String, dynamic>{
      'totalUsers': instance.totalUsers,
      'activeUsers': instance.activeUsers,
      'totalProperties': instance.totalProperties,
      'activeProperties': instance.activeProperties,
      'totalInquiries': instance.totalInquiries,
      'pendingInquiries': instance.pendingInquiries,
      'totalContacts': instance.totalContacts,
      'totalSubscriptions': instance.totalSubscriptions,
      'activeSubscriptions': instance.activeSubscriptions,
      'totalRevenue': instance.totalRevenue,
      'monthlyRevenue': instance.monthlyRevenue,
      'userGrowth': instance.userGrowth,
      'propertyGrowth': instance.propertyGrowth,
      'revenueGrowth': instance.revenueGrowth,
      'topProperties': instance.topProperties,
      'recentActivities': instance.recentActivities,
    };
