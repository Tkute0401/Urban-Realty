import 'environment_config.dart';

class ApiConfig {
  // Always use production URL - no development or staging allowed
  static String get baseUrl => EnvironmentConfig.apiBaseUrl;
  
  // Production-only configuration
  static String get productionBaseUrl => 'https://urban-realty-production.up.railway.app/api/v1';
  
  // Check if running in development mode (always false)
  static bool get isDevelopment => false;
}

