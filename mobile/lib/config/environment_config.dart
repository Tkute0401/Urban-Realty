import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

enum Environment {
  development,
  staging,
  production,
}

class EnvironmentConfig {
  // Force production environment - no development or staging allowed
  static Environment _environment = Environment.production;
  
  // Disable environment switching - always production
  static void setEnvironment(Environment env) {
    // Ignore any attempts to change environment - always stay in production
    _environment = Environment.production;
  }
  
  static Environment get environment => _environment;
  
  // Always return false for development and staging
  static bool get isDevelopment => false;
  static bool get isStaging => false;
  static bool get isProduction => true;
  
  static String get apiBaseUrl {
    // Always return production URL regardless of environment setting
    return 'https://urban-realty-production.up.railway.app/api/v1';
  }
  
  static String get appName {
    // Always return production app name
    return 'SQUARE FOOOT';
  }
  
  static bool get enableLogging {
    // Disable logging in production for security
    return false;
  }
  
  static bool get enableDebugBanner {
    // Never show debug banner
    return false;
  }
}