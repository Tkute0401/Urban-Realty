// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'developer_dashboard_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DeveloperDashboard _$DeveloperDashboardFromJson(Map<String, dynamic> json) =>
    DeveloperDashboard(
      id: json['id'] as String,
      userId: json['userId'] as String,
      overview:
          DashboardOverview.fromJson(json['overview'] as Map<String, dynamic>),
      projectAnalytics: (json['projectAnalytics'] as List<dynamic>)
          .map((e) => ProjectAnalytics.fromJson(e as Map<String, dynamic>))
          .toList(),
      apiAnalytics: (json['apiAnalytics'] as List<dynamic>)
          .map((e) => ApiAnalytics.fromJson(e as Map<String, dynamic>))
          .toList(),
      performanceMetrics: (json['performanceMetrics'] as List<dynamic>)
          .map((e) => PerformanceMetrics.fromJson(e as Map<String, dynamic>))
          .toList(),
      errorLogs: (json['errorLogs'] as List<dynamic>)
          .map((e) => ErrorLog.fromJson(e as Map<String, dynamic>))
          .toList(),
      deployments: (json['deployments'] as List<dynamic>)
          .map((e) => DeploymentInfo.fromJson(e as Map<String, dynamic>))
          .toList(),
      codeMetrics: (json['codeMetrics'] as List<dynamic>)
          .map((e) => CodeMetrics.fromJson(e as Map<String, dynamic>))
          .toList(),
      testResults: (json['testResults'] as List<dynamic>)
          .map((e) => TestResults.fromJson(e as Map<String, dynamic>))
          .toList(),
      metadata: json['metadata'] as Map<String, dynamic>,
      lastUpdated: DateTime.parse(json['lastUpdated'] as String),
      createdAt: DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$DeveloperDashboardToJson(DeveloperDashboard instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'overview': instance.overview,
      'projectAnalytics': instance.projectAnalytics,
      'apiAnalytics': instance.apiAnalytics,
      'performanceMetrics': instance.performanceMetrics,
      'errorLogs': instance.errorLogs,
      'deployments': instance.deployments,
      'codeMetrics': instance.codeMetrics,
      'testResults': instance.testResults,
      'metadata': instance.metadata,
      'lastUpdated': instance.lastUpdated.toIso8601String(),
      'createdAt': instance.createdAt.toIso8601String(),
    };

DashboardOverview _$DashboardOverviewFromJson(Map<String, dynamic> json) =>
    DashboardOverview(
      totalProjects: (json['totalProjects'] as num).toInt(),
      activeProjects: (json['activeProjects'] as num).toInt(),
      completedProjects: (json['completedProjects'] as num).toInt(),
      totalProperties: (json['totalProperties'] as num).toInt(),
      totalUsers: (json['totalUsers'] as num).toInt(),
      totalRevenue: (json['totalRevenue'] as num).toInt(),
      currency: json['currency'] as String,
      growthRate: (json['growthRate'] as num).toDouble(),
      totalApiCalls: (json['totalApiCalls'] as num).toInt(),
      successfulApiCalls: (json['successfulApiCalls'] as num).toInt(),
      failedApiCalls: (json['failedApiCalls'] as num).toInt(),
      averageResponseTime: (json['averageResponseTime'] as num).toDouble(),
      totalErrors: (json['totalErrors'] as num).toInt(),
      criticalErrors: (json['criticalErrors'] as num).toInt(),
      warnings: (json['warnings'] as num).toInt(),
      uptime: (json['uptime'] as num).toDouble(),
      metadata: json['metadata'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$DashboardOverviewToJson(DashboardOverview instance) =>
    <String, dynamic>{
      'totalProjects': instance.totalProjects,
      'activeProjects': instance.activeProjects,
      'completedProjects': instance.completedProjects,
      'totalProperties': instance.totalProperties,
      'totalUsers': instance.totalUsers,
      'totalRevenue': instance.totalRevenue,
      'currency': instance.currency,
      'growthRate': instance.growthRate,
      'totalApiCalls': instance.totalApiCalls,
      'successfulApiCalls': instance.successfulApiCalls,
      'failedApiCalls': instance.failedApiCalls,
      'averageResponseTime': instance.averageResponseTime,
      'totalErrors': instance.totalErrors,
      'criticalErrors': instance.criticalErrors,
      'warnings': instance.warnings,
      'uptime': instance.uptime,
      'metadata': instance.metadata,
    };

ProjectAnalytics _$ProjectAnalyticsFromJson(Map<String, dynamic> json) =>
    ProjectAnalytics(
      id: json['id'] as String,
      projectId: json['projectId'] as String,
      projectName: json['projectName'] as String,
      status: $enumDecode(_$ProjectStatusEnumMap, json['status']),
      totalProperties: (json['totalProperties'] as num).toInt(),
      soldProperties: (json['soldProperties'] as num).toInt(),
      availableProperties: (json['availableProperties'] as num).toInt(),
      totalRevenue: (json['totalRevenue'] as num).toDouble(),
      currency: json['currency'] as String,
      completionPercentage: (json['completionPercentage'] as num).toDouble(),
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: json['endDate'] == null
          ? null
          : DateTime.parse(json['endDate'] as String),
      expectedEndDate: json['expectedEndDate'] == null
          ? null
          : DateTime.parse(json['expectedEndDate'] as String),
      phases: (json['phases'] as List<dynamic>)
          .map((e) => ProjectPhase.fromJson(e as Map<String, dynamic>))
          .toList(),
      metadata: json['metadata'] as Map<String, dynamic>,
      lastUpdated: DateTime.parse(json['lastUpdated'] as String),
    );

Map<String, dynamic> _$ProjectAnalyticsToJson(ProjectAnalytics instance) =>
    <String, dynamic>{
      'id': instance.id,
      'projectId': instance.projectId,
      'projectName': instance.projectName,
      'status': _$ProjectStatusEnumMap[instance.status]!,
      'totalProperties': instance.totalProperties,
      'soldProperties': instance.soldProperties,
      'availableProperties': instance.availableProperties,
      'totalRevenue': instance.totalRevenue,
      'currency': instance.currency,
      'completionPercentage': instance.completionPercentage,
      'startDate': instance.startDate.toIso8601String(),
      'endDate': instance.endDate?.toIso8601String(),
      'expectedEndDate': instance.expectedEndDate?.toIso8601String(),
      'phases': instance.phases,
      'metadata': instance.metadata,
      'lastUpdated': instance.lastUpdated.toIso8601String(),
    };

const _$ProjectStatusEnumMap = {
  ProjectStatus.planning: 'planning',
  ProjectStatus.inProgress: 'in_progress',
  ProjectStatus.onHold: 'on_hold',
  ProjectStatus.completed: 'completed',
  ProjectStatus.cancelled: 'cancelled',
  ProjectStatus.archived: 'archived',
};

ProjectPhase _$ProjectPhaseFromJson(Map<String, dynamic> json) => ProjectPhase(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      status: $enumDecode(_$PhaseStatusEnumMap, json['status']),
      completionPercentage: (json['completionPercentage'] as num).toDouble(),
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: json['endDate'] == null
          ? null
          : DateTime.parse(json['endDate'] as String),
      expectedEndDate: json['expectedEndDate'] == null
          ? null
          : DateTime.parse(json['expectedEndDate'] as String),
      tasks: (json['tasks'] as List<dynamic>).map((e) => e as String).toList(),
      metadata: json['metadata'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$ProjectPhaseToJson(ProjectPhase instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'status': _$PhaseStatusEnumMap[instance.status]!,
      'completionPercentage': instance.completionPercentage,
      'startDate': instance.startDate.toIso8601String(),
      'endDate': instance.endDate?.toIso8601String(),
      'expectedEndDate': instance.expectedEndDate?.toIso8601String(),
      'tasks': instance.tasks,
      'metadata': instance.metadata,
    };

const _$PhaseStatusEnumMap = {
  PhaseStatus.notStarted: 'not_started',
  PhaseStatus.inProgress: 'in_progress',
  PhaseStatus.completed: 'completed',
  PhaseStatus.onHold: 'on_hold',
  PhaseStatus.cancelled: 'cancelled',
};

ApiAnalytics _$ApiAnalyticsFromJson(Map<String, dynamic> json) => ApiAnalytics(
      id: json['id'] as String,
      endpoint: json['endpoint'] as String,
      method: json['method'] as String,
      totalCalls: (json['totalCalls'] as num).toInt(),
      successfulCalls: (json['successfulCalls'] as num).toInt(),
      failedCalls: (json['failedCalls'] as num).toInt(),
      averageResponseTime: (json['averageResponseTime'] as num).toDouble(),
      minResponseTime: (json['minResponseTime'] as num).toDouble(),
      maxResponseTime: (json['maxResponseTime'] as num).toDouble(),
      totalErrors: (json['totalErrors'] as num).toInt(),
      errorTypes: (json['errorTypes'] as List<dynamic>)
          .map((e) => ErrorType.fromJson(e as Map<String, dynamic>))
          .toList(),
      statusCodes: Map<String, int>.from(json['statusCodes'] as Map),
      metadata: json['metadata'] as Map<String, dynamic>,
      lastUpdated: DateTime.parse(json['lastUpdated'] as String),
    );

Map<String, dynamic> _$ApiAnalyticsToJson(ApiAnalytics instance) =>
    <String, dynamic>{
      'id': instance.id,
      'endpoint': instance.endpoint,
      'method': instance.method,
      'totalCalls': instance.totalCalls,
      'successfulCalls': instance.successfulCalls,
      'failedCalls': instance.failedCalls,
      'averageResponseTime': instance.averageResponseTime,
      'minResponseTime': instance.minResponseTime,
      'maxResponseTime': instance.maxResponseTime,
      'totalErrors': instance.totalErrors,
      'errorTypes': instance.errorTypes,
      'statusCodes': instance.statusCodes,
      'metadata': instance.metadata,
      'lastUpdated': instance.lastUpdated.toIso8601String(),
    };

ErrorType _$ErrorTypeFromJson(Map<String, dynamic> json) => ErrorType(
      type: json['type'] as String,
      count: (json['count'] as num).toInt(),
      percentage: (json['percentage'] as num).toDouble(),
      description: json['description'] as String,
    );

Map<String, dynamic> _$ErrorTypeToJson(ErrorType instance) => <String, dynamic>{
      'type': instance.type,
      'count': instance.count,
      'percentage': instance.percentage,
      'description': instance.description,
    };

PerformanceMetrics _$PerformanceMetricsFromJson(Map<String, dynamic> json) =>
    PerformanceMetrics(
      id: json['id'] as String,
      metricName: json['metricName'] as String,
      metricType: json['metricType'] as String,
      value: (json['value'] as num).toDouble(),
      unit: json['unit'] as String,
      threshold: (json['threshold'] as num).toDouble(),
      isHealthy: json['isHealthy'] as bool,
      description: json['description'] as String,
      metadata: json['metadata'] as Map<String, dynamic>,
      timestamp: DateTime.parse(json['timestamp'] as String),
    );

Map<String, dynamic> _$PerformanceMetricsToJson(PerformanceMetrics instance) =>
    <String, dynamic>{
      'id': instance.id,
      'metricName': instance.metricName,
      'metricType': instance.metricType,
      'value': instance.value,
      'unit': instance.unit,
      'threshold': instance.threshold,
      'isHealthy': instance.isHealthy,
      'description': instance.description,
      'metadata': instance.metadata,
      'timestamp': instance.timestamp.toIso8601String(),
    };

ErrorLog _$ErrorLogFromJson(Map<String, dynamic> json) => ErrorLog(
      id: json['id'] as String,
      level: json['level'] as String,
      message: json['message'] as String,
      stackTrace: json['stackTrace'] as String,
      source: json['source'] as String,
      userId: json['userId'] as String,
      projectId: json['projectId'] as String?,
      propertyId: json['propertyId'] as String?,
      context: json['context'] as Map<String, dynamic>,
      metadata: json['metadata'] as Map<String, dynamic>,
      timestamp: DateTime.parse(json['timestamp'] as String),
    );

Map<String, dynamic> _$ErrorLogToJson(ErrorLog instance) => <String, dynamic>{
      'id': instance.id,
      'level': instance.level,
      'message': instance.message,
      'stackTrace': instance.stackTrace,
      'source': instance.source,
      'userId': instance.userId,
      'projectId': instance.projectId,
      'propertyId': instance.propertyId,
      'context': instance.context,
      'metadata': instance.metadata,
      'timestamp': instance.timestamp.toIso8601String(),
    };

DeploymentInfo _$DeploymentInfoFromJson(Map<String, dynamic> json) =>
    DeploymentInfo(
      id: json['id'] as String,
      version: json['version'] as String,
      environment: json['environment'] as String,
      status: $enumDecode(_$DeploymentStatusEnumMap, json['status']),
      commitHash: json['commitHash'] as String,
      branch: json['branch'] as String,
      author: json['author'] as String,
      deployedAt: DateTime.parse(json['deployedAt'] as String),
      rollbackAt: json['rollbackAt'] == null
          ? null
          : DateTime.parse(json['rollbackAt'] as String),
      rollbackReason: json['rollbackReason'] as String?,
      changes:
          (json['changes'] as List<dynamic>).map((e) => e as String).toList(),
      metadata: json['metadata'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$DeploymentInfoToJson(DeploymentInfo instance) =>
    <String, dynamic>{
      'id': instance.id,
      'version': instance.version,
      'environment': instance.environment,
      'status': _$DeploymentStatusEnumMap[instance.status]!,
      'commitHash': instance.commitHash,
      'branch': instance.branch,
      'author': instance.author,
      'deployedAt': instance.deployedAt.toIso8601String(),
      'rollbackAt': instance.rollbackAt?.toIso8601String(),
      'rollbackReason': instance.rollbackReason,
      'changes': instance.changes,
      'metadata': instance.metadata,
    };

const _$DeploymentStatusEnumMap = {
  DeploymentStatus.pending: 'pending',
  DeploymentStatus.inProgress: 'in_progress',
  DeploymentStatus.successful: 'successful',
  DeploymentStatus.failed: 'failed',
  DeploymentStatus.rolledBack: 'rolled_back',
};

CodeMetrics _$CodeMetricsFromJson(Map<String, dynamic> json) => CodeMetrics(
      id: json['id'] as String,
      language: json['language'] as String,
      totalLines: (json['totalLines'] as num).toInt(),
      codeLines: (json['codeLines'] as num).toInt(),
      commentLines: (json['commentLines'] as num).toInt(),
      blankLines: (json['blankLines'] as num).toInt(),
      functions: (json['functions'] as num).toInt(),
      classes: (json['classes'] as num).toInt(),
      files: (json['files'] as num).toInt(),
      complexity: (json['complexity'] as num).toDouble(),
      maintainabilityIndex: (json['maintainabilityIndex'] as num).toDouble(),
      technicalDebt: (json['technicalDebt'] as num).toDouble(),
      metadata: json['metadata'] as Map<String, dynamic>,
      lastUpdated: DateTime.parse(json['lastUpdated'] as String),
    );

Map<String, dynamic> _$CodeMetricsToJson(CodeMetrics instance) =>
    <String, dynamic>{
      'id': instance.id,
      'language': instance.language,
      'totalLines': instance.totalLines,
      'codeLines': instance.codeLines,
      'commentLines': instance.commentLines,
      'blankLines': instance.blankLines,
      'functions': instance.functions,
      'classes': instance.classes,
      'files': instance.files,
      'complexity': instance.complexity,
      'maintainabilityIndex': instance.maintainabilityIndex,
      'technicalDebt': instance.technicalDebt,
      'metadata': instance.metadata,
      'lastUpdated': instance.lastUpdated.toIso8601String(),
    };

TestResults _$TestResultsFromJson(Map<String, dynamic> json) => TestResults(
      id: json['id'] as String,
      testSuite: json['testSuite'] as String,
      testType: json['testType'] as String,
      totalTests: (json['totalTests'] as num).toInt(),
      passedTests: (json['passedTests'] as num).toInt(),
      failedTests: (json['failedTests'] as num).toInt(),
      skippedTests: (json['skippedTests'] as num).toInt(),
      coverage: (json['coverage'] as num).toDouble(),
      duration: (json['duration'] as num).toDouble(),
      failures: (json['failures'] as List<dynamic>)
          .map((e) => TestFailure.fromJson(e as Map<String, dynamic>))
          .toList(),
      metadata: json['metadata'] as Map<String, dynamic>,
      timestamp: DateTime.parse(json['timestamp'] as String),
    );

Map<String, dynamic> _$TestResultsToJson(TestResults instance) =>
    <String, dynamic>{
      'id': instance.id,
      'testSuite': instance.testSuite,
      'testType': instance.testType,
      'totalTests': instance.totalTests,
      'passedTests': instance.passedTests,
      'failedTests': instance.failedTests,
      'skippedTests': instance.skippedTests,
      'coverage': instance.coverage,
      'duration': instance.duration,
      'failures': instance.failures,
      'metadata': instance.metadata,
      'timestamp': instance.timestamp.toIso8601String(),
    };

TestFailure _$TestFailureFromJson(Map<String, dynamic> json) => TestFailure(
      testName: json['testName'] as String,
      message: json['message'] as String,
      stackTrace: json['stackTrace'] as String,
      expected: json['expected'] as String,
      actual: json['actual'] as String,
      metadata: json['metadata'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$TestFailureToJson(TestFailure instance) =>
    <String, dynamic>{
      'testName': instance.testName,
      'message': instance.message,
      'stackTrace': instance.stackTrace,
      'expected': instance.expected,
      'actual': instance.actual,
      'metadata': instance.metadata,
    };

DeveloperActivity _$DeveloperActivityFromJson(Map<String, dynamic> json) =>
    DeveloperActivity(
      id: json['id'] as String,
      userId: json['userId'] as String,
      userName: json['userName'] as String,
      userEmail: json['userEmail'] as String,
      activityType: json['activityType'] as String,
      description: json['description'] as String,
      projectId: json['projectId'] as String?,
      propertyId: json['propertyId'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>,
      timestamp: DateTime.parse(json['timestamp'] as String),
    );

Map<String, dynamic> _$DeveloperActivityToJson(DeveloperActivity instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'userName': instance.userName,
      'userEmail': instance.userEmail,
      'activityType': instance.activityType,
      'description': instance.description,
      'projectId': instance.projectId,
      'propertyId': instance.propertyId,
      'metadata': instance.metadata,
      'timestamp': instance.timestamp.toIso8601String(),
    };

SystemHealth _$SystemHealthFromJson(Map<String, dynamic> json) => SystemHealth(
      id: json['id'] as String,
      component: json['component'] as String,
      status: $enumDecode(_$HealthStatusEnumMap, json['status']),
      message: json['message'] as String,
      uptime: (json['uptime'] as num).toDouble(),
      responseTime: (json['responseTime'] as num).toDouble(),
      errorCount: (json['errorCount'] as num).toInt(),
      metadata: json['metadata'] as Map<String, dynamic>,
      lastChecked: DateTime.parse(json['lastChecked'] as String),
    );

Map<String, dynamic> _$SystemHealthToJson(SystemHealth instance) =>
    <String, dynamic>{
      'id': instance.id,
      'component': instance.component,
      'status': _$HealthStatusEnumMap[instance.status]!,
      'message': instance.message,
      'uptime': instance.uptime,
      'responseTime': instance.responseTime,
      'errorCount': instance.errorCount,
      'metadata': instance.metadata,
      'lastChecked': instance.lastChecked.toIso8601String(),
    };

const _$HealthStatusEnumMap = {
  HealthStatus.healthy: 'healthy',
  HealthStatus.warning: 'warning',
  HealthStatus.critical: 'critical',
  HealthStatus.down: 'down',
};
