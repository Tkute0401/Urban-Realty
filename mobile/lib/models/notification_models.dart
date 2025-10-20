import 'package:json_annotation/json_annotation.dart';

part 'notification_models.g.dart';

/// Notification model
@JsonSerializable()
class AppNotification {
  final String id;
  final String title;
  final String body;
  final String? imageUrl;
  final String? iconUrl;
  final NotificationType type;
  final NotificationPriority priority;
  final Map<String, dynamic> data;
  final DateTime scheduledAt;
  final DateTime? deliveredAt;
  final DateTime? readAt;
  final bool isRead;
  final bool isDelivered;
  final String? userId;
  final String? categoryId;
  final List<String> tags;
  final Map<String, dynamic> metadata;

  const AppNotification({
    required this.id,
    required this.title,
    required this.body,
    this.imageUrl,
    this.iconUrl,
    required this.type,
    required this.priority,
    required this.data,
    required this.scheduledAt,
    this.deliveredAt,
    this.readAt,
    this.isRead = false,
    this.isDelivered = false,
    this.userId,
    this.categoryId,
    this.tags = const [],
    this.metadata = const {},
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) => _$AppNotificationFromJson(json);
  Map<String, dynamic> toJson() => _$AppNotificationToJson(this);

  AppNotification copyWith({
    String? id,
    String? title,
    String? body,
    String? imageUrl,
    String? iconUrl,
    NotificationType? type,
    NotificationPriority? priority,
    Map<String, dynamic>? data,
    DateTime? scheduledAt,
    DateTime? deliveredAt,
    DateTime? readAt,
    bool? isRead,
    bool? isDelivered,
    String? userId,
    String? categoryId,
    List<String>? tags,
    Map<String, dynamic>? metadata,
  }) {
    return AppNotification(
      id: id ?? this.id,
      title: title ?? this.title,
      body: body ?? this.body,
      imageUrl: imageUrl ?? this.imageUrl,
      iconUrl: iconUrl ?? this.iconUrl,
      type: type ?? this.type,
      priority: priority ?? this.priority,
      data: data ?? this.data,
      scheduledAt: scheduledAt ?? this.scheduledAt,
      deliveredAt: deliveredAt ?? this.deliveredAt,
      readAt: readAt ?? this.readAt,
      isRead: isRead ?? this.isRead,
      isDelivered: isDelivered ?? this.isDelivered,
      userId: userId ?? this.userId,
      categoryId: categoryId ?? this.categoryId,
      tags: tags ?? this.tags,
      metadata: metadata ?? this.metadata,
    );
  }
}

/// Notification category model
@JsonSerializable()
class NotificationCategory {
  final String id;
  final String name;
  final String description;
  final String icon;
  final bool isEnabled;
  final NotificationPriority defaultPriority;
  final bool enableSound;
  final bool enableVibration;
  final bool enableLights;
  final String? soundFile;
  final String? lightColor;
  final int vibrationPattern;
  final Map<String, dynamic> metadata;

  const NotificationCategory({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    required this.isEnabled,
    required this.defaultPriority,
    required this.enableSound,
    required this.enableVibration,
    required this.enableLights,
    this.soundFile,
    this.lightColor,
    required this.vibrationPattern,
    required this.metadata,
  });

  factory NotificationCategory.fromJson(Map<String, dynamic> json) => _$NotificationCategoryFromJson(json);
  Map<String, dynamic> toJson() => _$NotificationCategoryToJson(this);
}

/// Notification preferences model
@JsonSerializable()
class NotificationPreferences {
  final String id;
  final String userId;
  final bool enableNotifications;
  final bool enablePushNotifications;
  final bool enableEmailNotifications;
  final bool enableSMSNotifications;
  final bool enableInAppNotifications;
  final Map<String, bool> categoryPreferences;
  final Map<String, bool> typePreferences;
  final NotificationSchedule schedule;
  final Map<String, dynamic> metadata;
  final DateTime createdAt;
  final DateTime updatedAt;

  const NotificationPreferences({
    required this.id,
    required this.userId,
    required this.enableNotifications,
    required this.enablePushNotifications,
    required this.enableEmailNotifications,
    required this.enableSMSNotifications,
    required this.enableInAppNotifications,
    required this.categoryPreferences,
    required this.typePreferences,
    required this.schedule,
    required this.metadata,
    required this.createdAt,
    required this.updatedAt,
  });

  factory NotificationPreferences.fromJson(Map<String, dynamic> json) => _$NotificationPreferencesFromJson(json);
  Map<String, dynamic> toJson() => _$NotificationPreferencesToJson(this);

  NotificationPreferences copyWith({
    String? id,
    String? userId,
    bool? enableNotifications,
    bool? enablePushNotifications,
    bool? enableEmailNotifications,
    bool? enableSMSNotifications,
    bool? enableInAppNotifications,
    Map<String, bool>? categoryPreferences,
    Map<String, bool>? typePreferences,
    NotificationSchedule? schedule,
    Map<String, dynamic>? metadata,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return NotificationPreferences(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      enableNotifications: enableNotifications ?? this.enableNotifications,
      enablePushNotifications: enablePushNotifications ?? this.enablePushNotifications,
      enableEmailNotifications: enableEmailNotifications ?? this.enableEmailNotifications,
      enableSMSNotifications: enableSMSNotifications ?? this.enableSMSNotifications,
      enableInAppNotifications: enableInAppNotifications ?? this.enableInAppNotifications,
      categoryPreferences: categoryPreferences ?? this.categoryPreferences,
      typePreferences: typePreferences ?? this.typePreferences,
      schedule: schedule ?? this.schedule,
      metadata: metadata ?? this.metadata,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

/// Notification schedule model
@JsonSerializable()
class NotificationSchedule {
  final bool enableQuietHours;
  final int startHour;
  final int startMinute;
  final int endHour;
  final int endMinute;
  final List<int> enabledDays; // 0 = Sunday, 1 = Monday, etc.
  final String timezone;

  const NotificationSchedule({
    required this.enableQuietHours,
    required this.startHour,
    required this.startMinute,
    required this.endHour,
    required this.endMinute,
    required this.enabledDays,
    required this.timezone,
  });

  factory NotificationSchedule.fromJson(Map<String, dynamic> json) => _$NotificationScheduleFromJson(json);
  Map<String, dynamic> toJson() => _$NotificationScheduleToJson(this);
}

/// Rich notification model
@JsonSerializable()
class RichNotification {
  final String id;
  final String title;
  final String body;
  final String? bigText;
  final String? summaryText;
  final String? imageUrl;
  final String? largeIconUrl;
  final String? bigPictureUrl;
  final List<NotificationAction> actions;
  final NotificationStyle style;
  final Map<String, dynamic> data;
  final DateTime scheduledAt;

  const RichNotification({
    required this.id,
    required this.title,
    required this.body,
    this.bigText,
    this.summaryText,
    this.imageUrl,
    this.largeIconUrl,
    this.bigPictureUrl,
    required this.actions,
    required this.style,
    required this.data,
    required this.scheduledAt,
  });

  factory RichNotification.fromJson(Map<String, dynamic> json) => _$RichNotificationFromJson(json);
  Map<String, dynamic> toJson() => _$RichNotificationToJson(this);
}

/// Notification action model
@JsonSerializable()
class NotificationAction {
  final String id;
  final String title;
  final String? icon;
  final String? actionId;
  final bool isDismissible;
  final bool isDestructive;
  final Map<String, dynamic> data;

  const NotificationAction({
    required this.id,
    required this.title,
    this.icon,
    this.actionId,
    this.isDismissible = true,
    this.isDestructive = false,
    required this.data,
  });

  factory NotificationAction.fromJson(Map<String, dynamic> json) => _$NotificationActionFromJson(json);
  Map<String, dynamic> toJson() => _$NotificationActionToJson(this);
}

/// Notification template model
@JsonSerializable()
class NotificationTemplate {
  final String id;
  final String name;
  final String description;
  final NotificationType type;
  final String categoryId;
  final String titleTemplate;
  final String bodyTemplate;
  final String? imageTemplate;
  final List<NotificationAction> defaultActions;
  final NotificationStyle defaultStyle;
  final Map<String, dynamic> variables;
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;

  const NotificationTemplate({
    required this.id,
    required this.name,
    required this.description,
    required this.type,
    required this.categoryId,
    required this.titleTemplate,
    required this.bodyTemplate,
    this.imageTemplate,
    required this.defaultActions,
    required this.defaultStyle,
    required this.variables,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
  });

  factory NotificationTemplate.fromJson(Map<String, dynamic> json) => _$NotificationTemplateFromJson(json);
  Map<String, dynamic> toJson() => _$NotificationTemplateToJson(this);
}

/// Notification analytics model
@JsonSerializable()
class NotificationAnalytics {
  final String id;
  final String notificationId;
  final String userId;
  final NotificationEvent event;
  final DateTime timestamp;
  final Map<String, dynamic> metadata;

  const NotificationAnalytics({
    required this.id,
    required this.notificationId,
    required this.userId,
    required this.event,
    required this.timestamp,
    required this.metadata,
  });

  factory NotificationAnalytics.fromJson(Map<String, dynamic> json) => _$NotificationAnalyticsFromJson(json);
  Map<String, dynamic> toJson() => _$NotificationAnalyticsToJson(this);
}

/// Notification types enum
enum NotificationType {
  @JsonValue('property')
  property,
  @JsonValue('project')
  project,
  @JsonValue('agent')
  agent,
  @JsonValue('message')
  message,
  @JsonValue('reminder')
  reminder,
  @JsonValue('promotion')
  promotion,
  @JsonValue('system')
  system,
  @JsonValue('security')
  security,
  @JsonValue('general')
  general,
}

/// Notification priority enum
enum NotificationPriority {
  @JsonValue('min')
  min,
  @JsonValue('low')
  low,
  @JsonValue('default')
  defaultPriority,
  @JsonValue('high')
  high,
  @JsonValue('max')
  max,
}

/// Notification style enum
enum NotificationStyle {
  @JsonValue('default')
  defaultStyle,
  @JsonValue('big_text')
  bigText,
  @JsonValue('big_picture')
  bigPicture,
  @JsonValue('inbox')
  inbox,
  @JsonValue('media')
  media,
  @JsonValue('messaging')
  messaging,
}

/// Notification event enum
enum NotificationEvent {
  @JsonValue('sent')
  sent,
  @JsonValue('delivered')
  delivered,
  @JsonValue('opened')
  opened,
  @JsonValue('dismissed')
  dismissed,
  @JsonValue('action_taken')
  actionTaken,
  @JsonValue('failed')
  failed,
}


