import 'package:json_annotation/json_annotation.dart';

part 'developer_dashboard_models.g.dart';

/// Developer dashboard model
@JsonSerializable()
class DeveloperDashboard {
  final String id;
  final String userId;
  final DashboardOverview overview;
  final List<ProjectAnalytics> projectAnalytics;
  final List<ApiAnalytics> apiAnalytics;
  final List<PerformanceMetrics> performanceMetrics;
  final List<ErrorLog> errorLogs;
  final List<DeploymentInfo> deployments;
  final List<CodeMetrics> codeMetrics;
  final List<TestResults> testResults;
  final Map<String, dynamic> metadata;
  final DateTime lastUpdated;
  final DateTime createdAt;

  const DeveloperDashboard({
    required this.id,
    required this.userId,
    required this.overview,
    required this.projectAnalytics,
    required this.apiAnalytics,
    required this.performanceMetrics,
    required this.errorLogs,
    required this.deployments,
    required this.codeMetrics,
    required this.testResults,
    required this.metadata,
    required this.lastUpdated,
    required this.createdAt,
  });

  factory DeveloperDashboard.fromJson(Map<String, dynamic> json) => _$DeveloperDashboardFromJson(json);
  Map<String, dynamic> toJson() => _$DeveloperDashboardToJson(this);
}

/// Dashboard overview model
@JsonSerializable()
class DashboardOverview {
  final int totalProjects;
  final int activeProjects;
  final int completedProjects;
  final int totalProperties;
  final int totalUsers;
  final int totalRevenue;
  final String currency;
  final double growthRate;
  final int totalApiCalls;
  final int successfulApiCalls;
  final int failedApiCalls;
  final double averageResponseTime;
  final int totalErrors;
  final int criticalErrors;
  final int warnings;
  final double uptime;
  final Map<String, dynamic> metadata;

  const DashboardOverview({
    required this.totalProjects,
    required this.activeProjects,
    required this.completedProjects,
    required this.totalProperties,
    required this.totalUsers,
    required this.totalRevenue,
    required this.currency,
    required this.growthRate,
    required this.totalApiCalls,
    required this.successfulApiCalls,
    required this.failedApiCalls,
    required this.averageResponseTime,
    required this.totalErrors,
    required this.criticalErrors,
    required this.warnings,
    required this.uptime,
    required this.metadata,
  });

  factory DashboardOverview.fromJson(Map<String, dynamic> json) => _$DashboardOverviewFromJson(json);
  Map<String, dynamic> toJson() => _$DashboardOverviewToJson(this);
}

/// Project analytics model
@JsonSerializable()
class ProjectAnalytics {
  final String id;
  final String projectId;
  final String projectName;
  final ProjectStatus status;
  final int totalProperties;
  final int soldProperties;
  final int availableProperties;
  final double totalRevenue;
  final String currency;
  final double completionPercentage;
  final DateTime startDate;
  final DateTime? endDate;
  final DateTime? expectedEndDate;
  final List<ProjectPhase> phases;
  final Map<String, dynamic> metadata;
  final DateTime lastUpdated;

  const ProjectAnalytics({
    required this.id,
    required this.projectId,
    required this.projectName,
    required this.status,
    required this.totalProperties,
    required this.soldProperties,
    required this.availableProperties,
    required this.totalRevenue,
    required this.currency,
    required this.completionPercentage,
    required this.startDate,
    this.endDate,
    this.expectedEndDate,
    required this.phases,
    required this.metadata,
    required this.lastUpdated,
  });

  factory ProjectAnalytics.fromJson(Map<String, dynamic> json) => _$ProjectAnalyticsFromJson(json);
  Map<String, dynamic> toJson() => _$ProjectAnalyticsToJson(this);
}

/// Project phase model
@JsonSerializable()
class ProjectPhase {
  final String id;
  final String name;
  final String description;
  final PhaseStatus status;
  final double completionPercentage;
  final DateTime startDate;
  final DateTime? endDate;
  final DateTime? expectedEndDate;
  final List<String> tasks;
  final Map<String, dynamic> metadata;

  const ProjectPhase({
    required this.id,
    required this.name,
    required this.description,
    required this.status,
    required this.completionPercentage,
    required this.startDate,
    this.endDate,
    this.expectedEndDate,
    required this.tasks,
    required this.metadata,
  });

  factory ProjectPhase.fromJson(Map<String, dynamic> json) => _$ProjectPhaseFromJson(json);
  Map<String, dynamic> toJson() => _$ProjectPhaseToJson(this);
}

/// API analytics model
@JsonSerializable()
class ApiAnalytics {
  final String id;
  final String endpoint;
  final String method;
  final int totalCalls;
  final int successfulCalls;
  final int failedCalls;
  final double averageResponseTime;
  final double minResponseTime;
  final double maxResponseTime;
  final int totalErrors;
  final List<ErrorType> errorTypes;
  final Map<String, int> statusCodes;
  final Map<String, dynamic> metadata;
  final DateTime lastUpdated;

  const ApiAnalytics({
    required this.id,
    required this.endpoint,
    required this.method,
    required this.totalCalls,
    required this.successfulCalls,
    required this.failedCalls,
    required this.averageResponseTime,
    required this.minResponseTime,
    required this.maxResponseTime,
    required this.totalErrors,
    required this.errorTypes,
    required this.statusCodes,
    required this.metadata,
    required this.lastUpdated,
  });

  factory ApiAnalytics.fromJson(Map<String, dynamic> json) => _$ApiAnalyticsFromJson(json);
  Map<String, dynamic> toJson() => _$ApiAnalyticsToJson(this);
}

/// Error type model
@JsonSerializable()
class ErrorType {
  final String type;
  final int count;
  final double percentage;
  final String description;

  const ErrorType({
    required this.type,
    required this.count,
    required this.percentage,
    required this.description,
  });

  factory ErrorType.fromJson(Map<String, dynamic> json) => _$ErrorTypeFromJson(json);
  Map<String, dynamic> toJson() => _$ErrorTypeToJson(this);
}

/// Performance metrics model
@JsonSerializable()
class PerformanceMetrics {
  final String id;
  final String metricName;
  final String metricType;
  final double value;
  final String unit;
  final double threshold;
  final bool isHealthy;
  final String description;
  final Map<String, dynamic> metadata;
  final DateTime timestamp;

  const PerformanceMetrics({
    required this.id,
    required this.metricName,
    required this.metricType,
    required this.value,
    required this.unit,
    required this.threshold,
    required this.isHealthy,
    required this.description,
    required this.metadata,
    required this.timestamp,
  });

  factory PerformanceMetrics.fromJson(Map<String, dynamic> json) => _$PerformanceMetricsFromJson(json);
  Map<String, dynamic> toJson() => _$PerformanceMetricsToJson(this);
}

/// Error log model
@JsonSerializable()
class ErrorLog {
  final String id;
  final String level;
  final String message;
  final String stackTrace;
  final String source;
  final String userId;
  final String? projectId;
  final String? propertyId;
  final Map<String, dynamic> context;
  final Map<String, dynamic> metadata;
  final DateTime timestamp;

  const ErrorLog({
    required this.id,
    required this.level,
    required this.message,
    required this.stackTrace,
    required this.source,
    required this.userId,
    this.projectId,
    this.propertyId,
    required this.context,
    required this.metadata,
    required this.timestamp,
  });

  factory ErrorLog.fromJson(Map<String, dynamic> json) => _$ErrorLogFromJson(json);
  Map<String, dynamic> toJson() => _$ErrorLogToJson(this);
}

/// Deployment info model
@JsonSerializable()
class DeploymentInfo {
  final String id;
  final String version;
  final String environment;
  final DeploymentStatus status;
  final String commitHash;
  final String branch;
  final String author;
  final DateTime deployedAt;
  final DateTime? rollbackAt;
  final String? rollbackReason;
  final List<String> changes;
  final Map<String, dynamic> metadata;

  const DeploymentInfo({
    required this.id,
    required this.version,
    required this.environment,
    required this.status,
    required this.commitHash,
    required this.branch,
    required this.author,
    required this.deployedAt,
    this.rollbackAt,
    this.rollbackReason,
    required this.changes,
    required this.metadata,
  });

  factory DeploymentInfo.fromJson(Map<String, dynamic> json) => _$DeploymentInfoFromJson(json);
  Map<String, dynamic> toJson() => _$DeploymentInfoToJson(this);
}

/// Code metrics model
@JsonSerializable()
class CodeMetrics {
  final String id;
  final String language;
  final int totalLines;
  final int codeLines;
  final int commentLines;
  final int blankLines;
  final int functions;
  final int classes;
  final int files;
  final double complexity;
  final double maintainabilityIndex;
  final double technicalDebt;
  final Map<String, dynamic> metadata;
  final DateTime lastUpdated;

  const CodeMetrics({
    required this.id,
    required this.language,
    required this.totalLines,
    required this.codeLines,
    required this.commentLines,
    required this.blankLines,
    required this.functions,
    required this.classes,
    required this.files,
    required this.complexity,
    required this.maintainabilityIndex,
    required this.technicalDebt,
    required this.metadata,
    required this.lastUpdated,
  });

  factory CodeMetrics.fromJson(Map<String, dynamic> json) => _$CodeMetricsFromJson(json);
  Map<String, dynamic> toJson() => _$CodeMetricsToJson(this);
}

/// Test results model
@JsonSerializable()
class TestResults {
  final String id;
  final String testSuite;
  final String testType;
  final int totalTests;
  final int passedTests;
  final int failedTests;
  final int skippedTests;
  final double coverage;
  final double duration;
  final List<TestFailure> failures;
  final Map<String, dynamic> metadata;
  final DateTime timestamp;

  const TestResults({
    required this.id,
    required this.testSuite,
    required this.testType,
    required this.totalTests,
    required this.passedTests,
    required this.failedTests,
    required this.skippedTests,
    required this.coverage,
    required this.duration,
    required this.failures,
    required this.metadata,
    required this.timestamp,
  });

  factory TestResults.fromJson(Map<String, dynamic> json) => _$TestResultsFromJson(json);
  Map<String, dynamic> toJson() => _$TestResultsToJson(this);
}

/// Test failure model
@JsonSerializable()
class TestFailure {
  final String testName;
  final String message;
  final String stackTrace;
  final String expected;
  final String actual;
  final Map<String, dynamic> metadata;

  const TestFailure({
    required this.testName,
    required this.message,
    required this.stackTrace,
    required this.expected,
    required this.actual,
    required this.metadata,
  });

  factory TestFailure.fromJson(Map<String, dynamic> json) => _$TestFailureFromJson(json);
  Map<String, dynamic> toJson() => _$TestFailureToJson(this);
}

/// Developer activity model
@JsonSerializable()
class DeveloperActivity {
  final String id;
  final String userId;
  final String userName;
  final String userEmail;
  final String activityType;
  final String description;
  final String? projectId;
  final String? propertyId;
  final Map<String, dynamic> metadata;
  final DateTime timestamp;

  const DeveloperActivity({
    required this.id,
    required this.userId,
    required this.userName,
    required this.userEmail,
    required this.activityType,
    required this.description,
    this.projectId,
    this.propertyId,
    required this.metadata,
    required this.timestamp,
  });

  factory DeveloperActivity.fromJson(Map<String, dynamic> json) => _$DeveloperActivityFromJson(json);
  Map<String, dynamic> toJson() => _$DeveloperActivityToJson(this);
}

/// System health model
@JsonSerializable()
class SystemHealth {
  final String id;
  final String component;
  final HealthStatus status;
  final String message;
  final double uptime;
  final double responseTime;
  final int errorCount;
  final Map<String, dynamic> metadata;
  final DateTime lastChecked;

  const SystemHealth({
    required this.id,
    required this.component,
    required this.status,
    required this.message,
    required this.uptime,
    required this.responseTime,
    required this.errorCount,
    required this.metadata,
    required this.lastChecked,
  });

  factory SystemHealth.fromJson(Map<String, dynamic> json) => _$SystemHealthFromJson(json);
  Map<String, dynamic> toJson() => _$SystemHealthToJson(this);
}

/// Project status enum
enum ProjectStatus {
  @JsonValue('planning')
  planning,
  @JsonValue('in_progress')
  inProgress,
  @JsonValue('on_hold')
  onHold,
  @JsonValue('completed')
  completed,
  @JsonValue('cancelled')
  cancelled,
  @JsonValue('archived')
  archived,
}

/// Phase status enum
enum PhaseStatus {
  @JsonValue('not_started')
  notStarted,
  @JsonValue('in_progress')
  inProgress,
  @JsonValue('completed')
  completed,
  @JsonValue('on_hold')
  onHold,
  @JsonValue('cancelled')
  cancelled,
}

/// Deployment status enum
enum DeploymentStatus {
  @JsonValue('pending')
  pending,
  @JsonValue('in_progress')
  inProgress,
  @JsonValue('successful')
  successful,
  @JsonValue('failed')
  failed,
  @JsonValue('rolled_back')
  rolledBack,
}

/// Health status enum
enum HealthStatus {
  @JsonValue('healthy')
  healthy,
  @JsonValue('warning')
  warning,
  @JsonValue('critical')
  critical,
  @JsonValue('down')
  down,
}


