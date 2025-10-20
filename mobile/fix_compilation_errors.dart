import 'dart:io';

void main() async {
  print('Fixing compilation errors...');
  
  // Fix AuthState usage in UI screens
  await fixAuthStateUsage();
  
  // Fix ApiResponse calls
  await fixApiResponseCalls();
  
  // Fix service constructors
  await fixServiceConstructors();
  
  // Fix other common issues
  await fixOtherIssues();
  
  print('Compilation errors fixed!');
}

Future<void> fixAuthStateUsage() async {
  print('Fixing AuthState usage...');
  
  // Fix home_tabs.dart
  await fixFile('lib/screens/home_tabs.dart', [
    (content) => content.replaceAll(
      'return authProvider.when(',
      'return authProvider.when(',
    ),
    (content) => content.replaceAll(
      'Consumer<AuthState>(',
      'Consumer<AsyncValue<AuthData?>>(',
    ),
  ]);
  
  // Fix settings_screen.dart
  await fixFile('lib/screens/settings_screen.dart', [
    (content) => content.replaceAll(
      'Consumer<AuthState>(',
      'Consumer<AsyncValue<AuthData?>>(',
    ),
    (content) => content.replaceAll(
      'Consumer<ThemeProvider>(',
      'Consumer<ThemeMode>(',
    ),
  ]);
  
  // Fix other screens
  await fixFile('lib/screens/profile_screen.dart', [
    (content) => content.replaceAll(
      'class _ProfileScreenState extends State<ProfileScreen>',
      'class _ProfileScreenState extends ConsumerState<ProfileScreen>',
    ),
    (content) => content.replaceAll(
      'Consumer<AuthState>(',
      'Consumer<AsyncValue<AuthData?>>(',
    ),
  ]);
  
  await fixFile('lib/screens/dashboard_screen.dart', [
    (content) => content.replaceAll(
      'class _DashboardScreenState extends State<DashboardScreen>',
      'class _DashboardScreenState extends ConsumerState<DashboardScreen>',
    ),
    (content) => content.replaceAll(
      'Consumer<AuthState>(',
      'Consumer<AsyncValue<AuthData?>>(',
    ),
  ]);
  
  await fixFile('lib/screens/search_screen.dart', [
    (content) => content.replaceAll(
      'Consumer<AuthProvider>(',
      'Consumer<AsyncValue<AuthData?>>(',
    ),
  ]);
}

Future<void> fixApiResponseCalls() async {
  print('Fixing ApiResponse calls...');
  
  // Fix remaining ApiResponse.error calls
  await fixFile('lib/services/profile_service.dart', [
    (content) => content.replaceAllMapped(
      RegExp(r'ApiResponse\.error\(([^)]+)\);'),
      (match) {
        final param = match.group(1)!;
        if (param.contains('message:') && param.contains('statusCode:')) {
          return 'ApiResponse.error($param);';
        } else if (param.contains('message:')) {
          return 'ApiResponse.error($param, statusCode: 500);';
        } else {
          return 'ApiResponse.error(message: $param, statusCode: 500);';
        }
      },
    ),
  ]);
  
  await fixFile('lib/services/mappls_service.dart', [
    (content) => content.replaceAllMapped(
      RegExp(r'ApiResponse\.error\(([^)]+)\);'),
      (match) {
        final param = match.group(1)!;
        if (param.contains('message:') && param.contains('statusCode:')) {
          return 'ApiResponse.error($param);';
        } else if (param.contains('message:')) {
          return 'ApiResponse.error($param, statusCode: 500);';
        } else {
          return 'ApiResponse.error(message: $param, statusCode: 500);';
        }
      },
    ),
  ]);
}

Future<void> fixServiceConstructors() async {
  print('Fixing service constructors...');
  
  // Fix ApiService constructor calls
  await fixFile('lib/services/http_client.dart', [
    (content) => content.replaceAll(
      'static final ApiService _api = ApiService();',
      'static final ApiService _api = ApiService(dio: Dio());',
    ),
  ]);
  
  await fixFile('lib/services/favorites_service.dart', [
    (content) => content.replaceAll(
      'final ApiService _apiService = ApiService();',
      'final ApiService _apiService = ApiService(dio: Dio());',
    ),
  ]);
  
  await fixFile('lib/services/recently_viewed_service.dart', [
    (content) => content.replaceAll(
      'final ApiService _apiService = ApiService();',
      'final ApiService _apiService = ApiService(dio: Dio());',
    ),
  ]);
  
  // Fix other service constructors
  await fixFile('lib/services/property_service.dart', [
    (content) => content.replaceAll(
      'PropertyService({',
      'PropertyService({\n    required EnhancedApiService apiService,',
    ),
  ]);
  
  await fixFile('lib/services/admin_service.dart', [
    (content) => content.replaceAll(
      'AdminService({',
      'AdminService({\n    required EnhancedApiService apiService,',
    ),
  ]);
}

Future<void> fixOtherIssues() async {
  print('Fixing other issues...');
  
  // Fix cache service issues
  await fixFile('lib/services/cache_service.dart', [
    (content) => content.replaceAll(
      'json.map((item) => Map<String, dynamic>.from(item)),',
      'json.map((item) => Map<String, dynamic>.from(item as Map)).toList(),',
    ),
  ]);
  
  // Fix List.from issues
  await fixFile('lib/services/mappls_service.dart', [
    (content) => content.replaceAll(
      'List<Map<String, dynamic>>.from(json),',
      'List<Map<String, dynamic>>.from(json as List),',
    ),
  ]);
  
  await fixFile('lib/services/admin_service.dart', [
    (content) => content.replaceAll(
      'List<Map<String, dynamic>>.from(json),',
      'List<Map<String, dynamic>>.from(json as List),',
    ),
  ]);
  
  await fixFile('lib/services/project_service.dart', [
    (content) => content.replaceAll(
      'List<Map<String, dynamic>>.from(json),',
      'List<Map<String, dynamic>>.from(json as List),',
    ),
  ]);
  
  await fixFile('lib/services/user_service.dart', [
    (content) => content.replaceAll(
      'List<Map<String, dynamic>>.from(json),',
      'List<Map<String, dynamic>>.from(json as List),',
    ),
  ]);
}

Future<void> fixFile(String filePath, List<Function> fixes) async {
  final file = File(filePath);
  if (!await file.exists()) {
    print('File $filePath does not exist');
    return;
  }
  
  String content = await file.readAsString();
  
  for (final fix in fixes) {
    content = fix(content);
  }
  
  await file.writeAsString(content);
  print('Fixed $filePath');
}


