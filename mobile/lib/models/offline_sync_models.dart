import 'package:json_annotation/json_annotation.dart';

part 'offline_sync_models.g.dart';

/// Offline sync operation model
@JsonSerializable()
class SyncOperation {
  final String id;
  final String type;
  final String action;
  final String entityType;
  final String entityId;
  final Map<String, dynamic> data;
  final SyncStatus status;
  final int priority;
  final int retryCount;
  final int maxRetries;
  final DateTime createdAt;
  final DateTime? scheduledAt;
  final DateTime? completedAt;
  final DateTime? failedAt;
  final String? errorMessage;
  final Map<String, dynamic> metadata;
  final String? userId;
  final String? deviceId;

  const SyncOperation({
    required this.id,
    required this.type,
    required this.action,
    required this.entityType,
    required this.entityId,
    required this.data,
    required this.status,
    required this.priority,
    required this.retryCount,
    required this.maxRetries,
    required this.createdAt,
    this.scheduledAt,
    this.completedAt,
    this.failedAt,
    this.errorMessage,
    required this.metadata,
    this.userId,
    this.deviceId,
  });

  factory SyncOperation.fromJson(Map<String, dynamic> json) => _$SyncOperationFromJson(json);
  Map<String, dynamic> toJson() => _$SyncOperationToJson(this);

  SyncOperation copyWith({
    String? id,
    String? type,
    String? action,
    String? entityType,
    String? entityId,
    Map<String, dynamic>? data,
    SyncStatus? status,
    int? priority,
    int? retryCount,
    int? maxRetries,
    DateTime? createdAt,
    DateTime? scheduledAt,
    DateTime? completedAt,
    DateTime? failedAt,
    String? errorMessage,
    Map<String, dynamic>? metadata,
    String? userId,
    String? deviceId,
  }) {
    return SyncOperation(
      id: id ?? this.id,
      type: type ?? this.type,
      action: action ?? this.action,
      entityType: entityType ?? this.entityType,
      entityId: entityId ?? this.entityId,
      data: data ?? this.data,
      status: status ?? this.status,
      priority: priority ?? this.priority,
      retryCount: retryCount ?? this.retryCount,
      maxRetries: maxRetries ?? this.maxRetries,
      createdAt: createdAt ?? this.createdAt,
      scheduledAt: scheduledAt ?? this.scheduledAt,
      completedAt: completedAt ?? this.completedAt,
      failedAt: failedAt ?? this.failedAt,
      errorMessage: errorMessage ?? this.errorMessage,
      metadata: metadata ?? this.metadata,
      userId: userId ?? this.userId,
      deviceId: deviceId ?? this.deviceId,
    );
  }
}

/// Sync queue model
@JsonSerializable()
class SyncQueue {
  final String id;
  final String name;
  final String description;
  final bool isActive;
  final int maxConcurrentOperations;
  final int maxRetries;
  final Duration retryDelay;
  final Duration timeout;
  final List<String> entityTypes;
  final Map<String, dynamic> filters;
  final Map<String, dynamic> metadata;
  final DateTime createdAt;
  final DateTime updatedAt;

  const SyncQueue({
    required this.id,
    required this.name,
    required this.description,
    required this.isActive,
    required this.maxConcurrentOperations,
    required this.maxRetries,
    required this.retryDelay,
    required this.timeout,
    required this.entityTypes,
    required this.filters,
    required this.metadata,
    required this.createdAt,
    required this.updatedAt,
  });

  factory SyncQueue.fromJson(Map<String, dynamic> json) => _$SyncQueueFromJson(json);
  Map<String, dynamic> toJson() => _$SyncQueueToJson(this);
}

/// Sync conflict model
@JsonSerializable()
class SyncConflict {
  final String id;
  final String operationId;
  final String entityType;
  final String entityId;
  final ConflictType type;
  final Map<String, dynamic> localData;
  final Map<String, dynamic> remoteData;
  final ConflictResolution resolution;
  final String? resolutionReason;
  final DateTime createdAt;
  final DateTime? resolvedAt;
  final String? resolvedBy;
  final Map<String, dynamic> metadata;

  const SyncConflict({
    required this.id,
    required this.operationId,
    required this.entityType,
    required this.entityId,
    required this.type,
    required this.localData,
    required this.remoteData,
    required this.resolution,
    this.resolutionReason,
    required this.createdAt,
    this.resolvedAt,
    this.resolvedBy,
    required this.metadata,
  });

  factory SyncConflict.fromJson(Map<String, dynamic> json) => _$SyncConflictFromJson(json);
  Map<String, dynamic> toJson() => _$SyncConflictToJson(this);
}

/// Sync batch model
@JsonSerializable()
class SyncBatch {
  final String id;
  final String queueId;
  final List<String> operationIds;
  final BatchStatus status;
  final int totalOperations;
  final int completedOperations;
  final int failedOperations;
  final DateTime createdAt;
  final DateTime? startedAt;
  final DateTime? completedAt;
  final String? errorMessage;
  final Map<String, dynamic> metadata;

  const SyncBatch({
    required this.id,
    required this.queueId,
    required this.operationIds,
    required this.status,
    required this.totalOperations,
    required this.completedOperations,
    required this.failedOperations,
    required this.createdAt,
    this.startedAt,
    this.completedAt,
    this.errorMessage,
    required this.metadata,
  });

  factory SyncBatch.fromJson(Map<String, dynamic> json) => _$SyncBatchFromJson(json);
  Map<String, dynamic> toJson() => _$SyncBatchToJson(this);
}

/// Sync statistics model
@JsonSerializable()
class SyncStatistics {
  final String id;
  final String userId;
  final String deviceId;
  final DateTime date;
  final int totalOperations;
  final int successfulOperations;
  final int failedOperations;
  final int pendingOperations;
  final Duration averageSyncTime;
  final Duration totalSyncTime;
  final Map<String, int> operationsByType;
  final Map<String, int> operationsByEntity;
  final Map<String, dynamic> metadata;

  const SyncStatistics({
    required this.id,
    required this.userId,
    required this.deviceId,
    required this.date,
    required this.totalOperations,
    required this.successfulOperations,
    required this.failedOperations,
    required this.pendingOperations,
    required this.averageSyncTime,
    required this.totalSyncTime,
    required this.operationsByType,
    required this.operationsByEntity,
    required this.metadata,
  });

  factory SyncStatistics.fromJson(Map<String, dynamic> json) => _$SyncStatisticsFromJson(json);
  Map<String, dynamic> toJson() => _$SyncStatisticsToJson(this);
}

/// Offline data model
@JsonSerializable()
class OfflineData {
  final String id;
  final String entityType;
  final String entityId;
  final Map<String, dynamic> data;
  final DataStatus status;
  final DateTime lastModified;
  final DateTime? lastSynced;
  final String? syncVersion;
  final Map<String, dynamic> metadata;
  final String? userId;
  final String? deviceId;

  const OfflineData({
    required this.id,
    required this.entityType,
    required this.entityId,
    required this.data,
    required this.status,
    required this.lastModified,
    this.lastSynced,
    this.syncVersion,
    required this.metadata,
    this.userId,
    this.deviceId,
  });

  factory OfflineData.fromJson(Map<String, dynamic> json) => _$OfflineDataFromJson(json);
  Map<String, dynamic> toJson() => _$OfflineDataToJson(this);
}

/// Sync status enum
enum SyncStatus {
  @JsonValue('pending')
  pending,
  @JsonValue('in_progress')
  inProgress,
  @JsonValue('completed')
  completed,
  @JsonValue('failed')
  failed,
  @JsonValue('cancelled')
  cancelled,
  @JsonValue('retrying')
  retrying,
}

/// Conflict type enum
enum ConflictType {
  @JsonValue('data_conflict')
  dataConflict,
  @JsonValue('version_conflict')
  versionConflict,
  @JsonValue('deletion_conflict')
  deletionConflict,
  @JsonValue('creation_conflict')
  creationConflict,
  @JsonValue('update_conflict')
  updateConflict,
}

/// Conflict resolution enum
enum ConflictResolution {
  @JsonValue('use_local')
  useLocal,
  @JsonValue('use_remote')
  useRemote,
  @JsonValue('merge')
  merge,
  @JsonValue('manual')
  manual,
  @JsonValue('skip')
  skip,
}

/// Batch status enum
enum BatchStatus {
  @JsonValue('pending')
  pending,
  @JsonValue('in_progress')
  inProgress,
  @JsonValue('completed')
  completed,
  @JsonValue('failed')
  failed,
  @JsonValue('cancelled')
  cancelled,
}

/// Data status enum
enum DataStatus {
  @JsonValue('local')
  local,
  @JsonValue('synced')
  synced,
  @JsonValue('pending_sync')
  pendingSync,
  @JsonValue('conflict')
  conflict,
  @JsonValue('deleted')
  deleted,
}


