import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

enum Environment {
  development,
  staging,
  production,
}

class EnvironmentConfig {
  static Environment _environment = Environment.production;
  
  static void setEnvironment(Environment env) {
    _environment = env;
  }
  
  static Environment get environment => _environment;
  
  static bool get isDevelopment => _environment == Environment.development;
  static bool get isStaging => _environment == Environment.staging;
  static bool get isProduction => _environment == Environment.production;
  
  static String get apiBaseUrl {
    switch (_environment) {
      case Environment.development:
        return dotenv.env['API_BASE_URL'] ?? 'http://10.0.2.2:5000/api/v1'; // Android emulator
      case Environment.staging:
        return 'https://urban-realty-staging.up.railway.app/api/v1';
      case Environment.production:
        return 'https://urban-realty-production.up.railway.app/api/v1';
    }
  }
  
  static String get appName {
    switch (_environment) {
      case Environment.development:
        return 'SQUARE FOOOT (DEV)';
      case Environment.staging:
        return 'SQUARE FOOOT (STAGING)';
      case Environment.production:
        return 'SQUARE FOOOT';
    }
  }
  
  static bool get enableLogging {
    return !isProduction;
  }
  
  static bool get enableDebugBanner {
    return isDevelopment;
  }
}