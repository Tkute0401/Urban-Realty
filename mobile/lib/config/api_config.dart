import 'environment_config.dart';

class ApiConfig {
  // Get base URL from environment configuration
  static String get baseUrl => EnvironmentConfig.apiBaseUrl;
  
  // Legacy getters for backward compatibility
  static String get productionBaseUrl => 'https://urban-realty-production.up.railway.app/api/v1';
  static String get stagingBaseUrl => 'https://urban-realty-staging.up.railway.app/api/v1';
  static String get developmentBaseUrl => 'http://10.0.2.2:5000/api/v1';
  
  // Check if running in development mode
  static bool get isDevelopment => EnvironmentConfig.isDevelopment;
}

