// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'offline_sync_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SyncOperation _$SyncOperationFromJson(Map<String, dynamic> json) =>
    SyncOperation(
      id: json['id'] as String,
      type: json['type'] as String,
      action: json['action'] as String,
      entityType: json['entityType'] as String,
      entityId: json['entityId'] as String,
      data: json['data'] as Map<String, dynamic>,
      status: $enumDecode(_$SyncStatusEnumMap, json['status']),
      priority: (json['priority'] as num).toInt(),
      retryCount: (json['retryCount'] as num).toInt(),
      maxRetries: (json['maxRetries'] as num).toInt(),
      createdAt: DateTime.parse(json['createdAt'] as String),
      scheduledAt: json['scheduledAt'] == null
          ? null
          : DateTime.parse(json['scheduledAt'] as String),
      completedAt: json['completedAt'] == null
          ? null
          : DateTime.parse(json['completedAt'] as String),
      failedAt: json['failedAt'] == null
          ? null
          : DateTime.parse(json['failedAt'] as String),
      errorMessage: json['errorMessage'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>,
      userId: json['userId'] as String?,
      deviceId: json['deviceId'] as String?,
    );

Map<String, dynamic> _$SyncOperationToJson(SyncOperation instance) =>
    <String, dynamic>{
      'id': instance.id,
      'type': instance.type,
      'action': instance.action,
      'entityType': instance.entityType,
      'entityId': instance.entityId,
      'data': instance.data,
      'status': _$SyncStatusEnumMap[instance.status]!,
      'priority': instance.priority,
      'retryCount': instance.retryCount,
      'maxRetries': instance.maxRetries,
      'createdAt': instance.createdAt.toIso8601String(),
      'scheduledAt': instance.scheduledAt?.toIso8601String(),
      'completedAt': instance.completedAt?.toIso8601String(),
      'failedAt': instance.failedAt?.toIso8601String(),
      'errorMessage': instance.errorMessage,
      'metadata': instance.metadata,
      'userId': instance.userId,
      'deviceId': instance.deviceId,
    };

const _$SyncStatusEnumMap = {
  SyncStatus.pending: 'pending',
  SyncStatus.inProgress: 'in_progress',
  SyncStatus.completed: 'completed',
  SyncStatus.failed: 'failed',
  SyncStatus.cancelled: 'cancelled',
  SyncStatus.retrying: 'retrying',
};

SyncQueue _$SyncQueueFromJson(Map<String, dynamic> json) => SyncQueue(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      isActive: json['isActive'] as bool,
      maxConcurrentOperations: (json['maxConcurrentOperations'] as num).toInt(),
      maxRetries: (json['maxRetries'] as num).toInt(),
      retryDelay: Duration(microseconds: (json['retryDelay'] as num).toInt()),
      timeout: Duration(microseconds: (json['timeout'] as num).toInt()),
      entityTypes: (json['entityTypes'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      filters: json['filters'] as Map<String, dynamic>,
      metadata: json['metadata'] as Map<String, dynamic>,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$SyncQueueToJson(SyncQueue instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'isActive': instance.isActive,
      'maxConcurrentOperations': instance.maxConcurrentOperations,
      'maxRetries': instance.maxRetries,
      'retryDelay': instance.retryDelay.inMicroseconds,
      'timeout': instance.timeout.inMicroseconds,
      'entityTypes': instance.entityTypes,
      'filters': instance.filters,
      'metadata': instance.metadata,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

SyncConflict _$SyncConflictFromJson(Map<String, dynamic> json) => SyncConflict(
      id: json['id'] as String,
      operationId: json['operationId'] as String,
      entityType: json['entityType'] as String,
      entityId: json['entityId'] as String,
      type: $enumDecode(_$ConflictTypeEnumMap, json['type']),
      localData: json['localData'] as Map<String, dynamic>,
      remoteData: json['remoteData'] as Map<String, dynamic>,
      resolution: $enumDecode(_$ConflictResolutionEnumMap, json['resolution']),
      resolutionReason: json['resolutionReason'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      resolvedAt: json['resolvedAt'] == null
          ? null
          : DateTime.parse(json['resolvedAt'] as String),
      resolvedBy: json['resolvedBy'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$SyncConflictToJson(SyncConflict instance) =>
    <String, dynamic>{
      'id': instance.id,
      'operationId': instance.operationId,
      'entityType': instance.entityType,
      'entityId': instance.entityId,
      'type': _$ConflictTypeEnumMap[instance.type]!,
      'localData': instance.localData,
      'remoteData': instance.remoteData,
      'resolution': _$ConflictResolutionEnumMap[instance.resolution]!,
      'resolutionReason': instance.resolutionReason,
      'createdAt': instance.createdAt.toIso8601String(),
      'resolvedAt': instance.resolvedAt?.toIso8601String(),
      'resolvedBy': instance.resolvedBy,
      'metadata': instance.metadata,
    };

const _$ConflictTypeEnumMap = {
  ConflictType.dataConflict: 'data_conflict',
  ConflictType.versionConflict: 'version_conflict',
  ConflictType.deletionConflict: 'deletion_conflict',
  ConflictType.creationConflict: 'creation_conflict',
  ConflictType.updateConflict: 'update_conflict',
};

const _$ConflictResolutionEnumMap = {
  ConflictResolution.useLocal: 'use_local',
  ConflictResolution.useRemote: 'use_remote',
  ConflictResolution.merge: 'merge',
  ConflictResolution.manual: 'manual',
  ConflictResolution.skip: 'skip',
};

SyncBatch _$SyncBatchFromJson(Map<String, dynamic> json) => SyncBatch(
      id: json['id'] as String,
      queueId: json['queueId'] as String,
      operationIds: (json['operationIds'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      status: $enumDecode(_$BatchStatusEnumMap, json['status']),
      totalOperations: (json['totalOperations'] as num).toInt(),
      completedOperations: (json['completedOperations'] as num).toInt(),
      failedOperations: (json['failedOperations'] as num).toInt(),
      createdAt: DateTime.parse(json['createdAt'] as String),
      startedAt: json['startedAt'] == null
          ? null
          : DateTime.parse(json['startedAt'] as String),
      completedAt: json['completedAt'] == null
          ? null
          : DateTime.parse(json['completedAt'] as String),
      errorMessage: json['errorMessage'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$SyncBatchToJson(SyncBatch instance) => <String, dynamic>{
      'id': instance.id,
      'queueId': instance.queueId,
      'operationIds': instance.operationIds,
      'status': _$BatchStatusEnumMap[instance.status]!,
      'totalOperations': instance.totalOperations,
      'completedOperations': instance.completedOperations,
      'failedOperations': instance.failedOperations,
      'createdAt': instance.createdAt.toIso8601String(),
      'startedAt': instance.startedAt?.toIso8601String(),
      'completedAt': instance.completedAt?.toIso8601String(),
      'errorMessage': instance.errorMessage,
      'metadata': instance.metadata,
    };

const _$BatchStatusEnumMap = {
  BatchStatus.pending: 'pending',
  BatchStatus.inProgress: 'in_progress',
  BatchStatus.completed: 'completed',
  BatchStatus.failed: 'failed',
  BatchStatus.cancelled: 'cancelled',
};

SyncStatistics _$SyncStatisticsFromJson(Map<String, dynamic> json) =>
    SyncStatistics(
      id: json['id'] as String,
      userId: json['userId'] as String,
      deviceId: json['deviceId'] as String,
      date: DateTime.parse(json['date'] as String),
      totalOperations: (json['totalOperations'] as num).toInt(),
      successfulOperations: (json['successfulOperations'] as num).toInt(),
      failedOperations: (json['failedOperations'] as num).toInt(),
      pendingOperations: (json['pendingOperations'] as num).toInt(),
      averageSyncTime:
          Duration(microseconds: (json['averageSyncTime'] as num).toInt()),
      totalSyncTime:
          Duration(microseconds: (json['totalSyncTime'] as num).toInt()),
      operationsByType: Map<String, int>.from(json['operationsByType'] as Map),
      operationsByEntity:
          Map<String, int>.from(json['operationsByEntity'] as Map),
      metadata: json['metadata'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$SyncStatisticsToJson(SyncStatistics instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'deviceId': instance.deviceId,
      'date': instance.date.toIso8601String(),
      'totalOperations': instance.totalOperations,
      'successfulOperations': instance.successfulOperations,
      'failedOperations': instance.failedOperations,
      'pendingOperations': instance.pendingOperations,
      'averageSyncTime': instance.averageSyncTime.inMicroseconds,
      'totalSyncTime': instance.totalSyncTime.inMicroseconds,
      'operationsByType': instance.operationsByType,
      'operationsByEntity': instance.operationsByEntity,
      'metadata': instance.metadata,
    };

OfflineData _$OfflineDataFromJson(Map<String, dynamic> json) => OfflineData(
      id: json['id'] as String,
      entityType: json['entityType'] as String,
      entityId: json['entityId'] as String,
      data: json['data'] as Map<String, dynamic>,
      status: $enumDecode(_$DataStatusEnumMap, json['status']),
      lastModified: DateTime.parse(json['lastModified'] as String),
      lastSynced: json['lastSynced'] == null
          ? null
          : DateTime.parse(json['lastSynced'] as String),
      syncVersion: json['syncVersion'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>,
      userId: json['userId'] as String?,
      deviceId: json['deviceId'] as String?,
    );

Map<String, dynamic> _$OfflineDataToJson(OfflineData instance) =>
    <String, dynamic>{
      'id': instance.id,
      'entityType': instance.entityType,
      'entityId': instance.entityId,
      'data': instance.data,
      'status': _$DataStatusEnumMap[instance.status]!,
      'lastModified': instance.lastModified.toIso8601String(),
      'lastSynced': instance.lastSynced?.toIso8601String(),
      'syncVersion': instance.syncVersion,
      'metadata': instance.metadata,
      'userId': instance.userId,
      'deviceId': instance.deviceId,
    };

const _$DataStatusEnumMap = {
  DataStatus.local: 'local',
  DataStatus.synced: 'synced',
  DataStatus.pendingSync: 'pending_sync',
  DataStatus.conflict: 'conflict',
  DataStatus.deleted: 'deleted',
};
