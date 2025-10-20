// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'notification_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AppNotification _$AppNotificationFromJson(Map<String, dynamic> json) =>
    AppNotification(
      id: json['id'] as String,
      title: json['title'] as String,
      body: json['body'] as String,
      imageUrl: json['imageUrl'] as String?,
      iconUrl: json['iconUrl'] as String?,
      type: $enumDecode(_$NotificationTypeEnumMap, json['type']),
      priority: $enumDecode(_$NotificationPriorityEnumMap, json['priority']),
      data: json['data'] as Map<String, dynamic>,
      scheduledAt: DateTime.parse(json['scheduledAt'] as String),
      deliveredAt: json['deliveredAt'] == null
          ? null
          : DateTime.parse(json['deliveredAt'] as String),
      readAt: json['readAt'] == null
          ? null
          : DateTime.parse(json['readAt'] as String),
      isRead: json['isRead'] as bool? ?? false,
      isDelivered: json['isDelivered'] as bool? ?? false,
      userId: json['userId'] as String?,
      categoryId: json['categoryId'] as String?,
      tags:
          (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList() ??
              const [],
      metadata: json['metadata'] as Map<String, dynamic>? ?? const {},
    );

Map<String, dynamic> _$AppNotificationToJson(AppNotification instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'body': instance.body,
      'imageUrl': instance.imageUrl,
      'iconUrl': instance.iconUrl,
      'type': _$NotificationTypeEnumMap[instance.type]!,
      'priority': _$NotificationPriorityEnumMap[instance.priority]!,
      'data': instance.data,
      'scheduledAt': instance.scheduledAt.toIso8601String(),
      'deliveredAt': instance.deliveredAt?.toIso8601String(),
      'readAt': instance.readAt?.toIso8601String(),
      'isRead': instance.isRead,
      'isDelivered': instance.isDelivered,
      'userId': instance.userId,
      'categoryId': instance.categoryId,
      'tags': instance.tags,
      'metadata': instance.metadata,
    };

const _$NotificationTypeEnumMap = {
  NotificationType.property: 'property',
  NotificationType.project: 'project',
  NotificationType.agent: 'agent',
  NotificationType.message: 'message',
  NotificationType.reminder: 'reminder',
  NotificationType.promotion: 'promotion',
  NotificationType.system: 'system',
  NotificationType.security: 'security',
  NotificationType.general: 'general',
};

const _$NotificationPriorityEnumMap = {
  NotificationPriority.min: 'min',
  NotificationPriority.low: 'low',
  NotificationPriority.defaultPriority: 'default',
  NotificationPriority.high: 'high',
  NotificationPriority.max: 'max',
};

NotificationCategory _$NotificationCategoryFromJson(
        Map<String, dynamic> json) =>
    NotificationCategory(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      icon: json['icon'] as String,
      isEnabled: json['isEnabled'] as bool,
      defaultPriority:
          $enumDecode(_$NotificationPriorityEnumMap, json['defaultPriority']),
      enableSound: json['enableSound'] as bool,
      enableVibration: json['enableVibration'] as bool,
      enableLights: json['enableLights'] as bool,
      soundFile: json['soundFile'] as String?,
      lightColor: json['lightColor'] as String?,
      vibrationPattern: (json['vibrationPattern'] as num).toInt(),
      metadata: json['metadata'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$NotificationCategoryToJson(
        NotificationCategory instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'icon': instance.icon,
      'isEnabled': instance.isEnabled,
      'defaultPriority':
          _$NotificationPriorityEnumMap[instance.defaultPriority]!,
      'enableSound': instance.enableSound,
      'enableVibration': instance.enableVibration,
      'enableLights': instance.enableLights,
      'soundFile': instance.soundFile,
      'lightColor': instance.lightColor,
      'vibrationPattern': instance.vibrationPattern,
      'metadata': instance.metadata,
    };

NotificationPreferences _$NotificationPreferencesFromJson(
        Map<String, dynamic> json) =>
    NotificationPreferences(
      id: json['id'] as String,
      userId: json['userId'] as String,
      enableNotifications: json['enableNotifications'] as bool,
      enablePushNotifications: json['enablePushNotifications'] as bool,
      enableEmailNotifications: json['enableEmailNotifications'] as bool,
      enableSMSNotifications: json['enableSMSNotifications'] as bool,
      enableInAppNotifications: json['enableInAppNotifications'] as bool,
      categoryPreferences:
          Map<String, bool>.from(json['categoryPreferences'] as Map),
      typePreferences: Map<String, bool>.from(json['typePreferences'] as Map),
      schedule: NotificationSchedule.fromJson(
          json['schedule'] as Map<String, dynamic>),
      metadata: json['metadata'] as Map<String, dynamic>,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$NotificationPreferencesToJson(
        NotificationPreferences instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'enableNotifications': instance.enableNotifications,
      'enablePushNotifications': instance.enablePushNotifications,
      'enableEmailNotifications': instance.enableEmailNotifications,
      'enableSMSNotifications': instance.enableSMSNotifications,
      'enableInAppNotifications': instance.enableInAppNotifications,
      'categoryPreferences': instance.categoryPreferences,
      'typePreferences': instance.typePreferences,
      'schedule': instance.schedule,
      'metadata': instance.metadata,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

NotificationSchedule _$NotificationScheduleFromJson(
        Map<String, dynamic> json) =>
    NotificationSchedule(
      enableQuietHours: json['enableQuietHours'] as bool,
      startHour: (json['startHour'] as num).toInt(),
      startMinute: (json['startMinute'] as num).toInt(),
      endHour: (json['endHour'] as num).toInt(),
      endMinute: (json['endMinute'] as num).toInt(),
      enabledDays: (json['enabledDays'] as List<dynamic>)
          .map((e) => (e as num).toInt())
          .toList(),
      timezone: json['timezone'] as String,
    );

Map<String, dynamic> _$NotificationScheduleToJson(
        NotificationSchedule instance) =>
    <String, dynamic>{
      'enableQuietHours': instance.enableQuietHours,
      'startHour': instance.startHour,
      'startMinute': instance.startMinute,
      'endHour': instance.endHour,
      'endMinute': instance.endMinute,
      'enabledDays': instance.enabledDays,
      'timezone': instance.timezone,
    };

RichNotification _$RichNotificationFromJson(Map<String, dynamic> json) =>
    RichNotification(
      id: json['id'] as String,
      title: json['title'] as String,
      body: json['body'] as String,
      bigText: json['bigText'] as String?,
      summaryText: json['summaryText'] as String?,
      imageUrl: json['imageUrl'] as String?,
      largeIconUrl: json['largeIconUrl'] as String?,
      bigPictureUrl: json['bigPictureUrl'] as String?,
      actions: (json['actions'] as List<dynamic>)
          .map((e) => NotificationAction.fromJson(e as Map<String, dynamic>))
          .toList(),
      style: $enumDecode(_$NotificationStyleEnumMap, json['style']),
      data: json['data'] as Map<String, dynamic>,
      scheduledAt: DateTime.parse(json['scheduledAt'] as String),
    );

Map<String, dynamic> _$RichNotificationToJson(RichNotification instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'body': instance.body,
      'bigText': instance.bigText,
      'summaryText': instance.summaryText,
      'imageUrl': instance.imageUrl,
      'largeIconUrl': instance.largeIconUrl,
      'bigPictureUrl': instance.bigPictureUrl,
      'actions': instance.actions,
      'style': _$NotificationStyleEnumMap[instance.style]!,
      'data': instance.data,
      'scheduledAt': instance.scheduledAt.toIso8601String(),
    };

const _$NotificationStyleEnumMap = {
  NotificationStyle.defaultStyle: 'default',
  NotificationStyle.bigText: 'big_text',
  NotificationStyle.bigPicture: 'big_picture',
  NotificationStyle.inbox: 'inbox',
  NotificationStyle.media: 'media',
  NotificationStyle.messaging: 'messaging',
};

NotificationAction _$NotificationActionFromJson(Map<String, dynamic> json) =>
    NotificationAction(
      id: json['id'] as String,
      title: json['title'] as String,
      icon: json['icon'] as String?,
      actionId: json['actionId'] as String?,
      isDismissible: json['isDismissible'] as bool? ?? true,
      isDestructive: json['isDestructive'] as bool? ?? false,
      data: json['data'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$NotificationActionToJson(NotificationAction instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'icon': instance.icon,
      'actionId': instance.actionId,
      'isDismissible': instance.isDismissible,
      'isDestructive': instance.isDestructive,
      'data': instance.data,
    };

NotificationTemplate _$NotificationTemplateFromJson(
        Map<String, dynamic> json) =>
    NotificationTemplate(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      type: $enumDecode(_$NotificationTypeEnumMap, json['type']),
      categoryId: json['categoryId'] as String,
      titleTemplate: json['titleTemplate'] as String,
      bodyTemplate: json['bodyTemplate'] as String,
      imageTemplate: json['imageTemplate'] as String?,
      defaultActions: (json['defaultActions'] as List<dynamic>)
          .map((e) => NotificationAction.fromJson(e as Map<String, dynamic>))
          .toList(),
      defaultStyle:
          $enumDecode(_$NotificationStyleEnumMap, json['defaultStyle']),
      variables: json['variables'] as Map<String, dynamic>,
      isActive: json['isActive'] as bool,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$NotificationTemplateToJson(
        NotificationTemplate instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'type': _$NotificationTypeEnumMap[instance.type]!,
      'categoryId': instance.categoryId,
      'titleTemplate': instance.titleTemplate,
      'bodyTemplate': instance.bodyTemplate,
      'imageTemplate': instance.imageTemplate,
      'defaultActions': instance.defaultActions,
      'defaultStyle': _$NotificationStyleEnumMap[instance.defaultStyle]!,
      'variables': instance.variables,
      'isActive': instance.isActive,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

NotificationAnalytics _$NotificationAnalyticsFromJson(
        Map<String, dynamic> json) =>
    NotificationAnalytics(
      id: json['id'] as String,
      notificationId: json['notificationId'] as String,
      userId: json['userId'] as String,
      event: $enumDecode(_$NotificationEventEnumMap, json['event']),
      timestamp: DateTime.parse(json['timestamp'] as String),
      metadata: json['metadata'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$NotificationAnalyticsToJson(
        NotificationAnalytics instance) =>
    <String, dynamic>{
      'id': instance.id,
      'notificationId': instance.notificationId,
      'userId': instance.userId,
      'event': _$NotificationEventEnumMap[instance.event]!,
      'timestamp': instance.timestamp.toIso8601String(),
      'metadata': instance.metadata,
    };

const _$NotificationEventEnumMap = {
  NotificationEvent.sent: 'sent',
  NotificationEvent.delivered: 'delivered',
  NotificationEvent.opened: 'opened',
  NotificationEvent.dismissed: 'dismissed',
  NotificationEvent.actionTaken: 'action_taken',
  NotificationEvent.failed: 'failed',
};
