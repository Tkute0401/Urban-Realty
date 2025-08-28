import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/theme_provider.dart';
import 'screens/login_screen.dart';
import 'screens/properties_screen.dart';
import 'screens/home_tabs.dart';
import 'screens/search_screen.dart';
import 'screens/notifications_screen.dart';
import 'screens/settings_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/favorites_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/enhanced_home_screen.dart';
import 'screens/enhanced_property_detail_screen.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => ThemeProvider(),
      child: const UrbanRealtyApp(),
    ),
  );
}

class UrbanRealtyApp extends StatelessWidget {
  const UrbanRealtyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<ThemeProvider>(
      builder: (context, themeProvider, child) {
        return MaterialApp(
          title: 'SQUARE FOOOT',
          theme: themeProvider.lightTheme,
          darkTheme: themeProvider.darkTheme,
          themeMode: themeProvider.themeMode,
          initialRoute: '/login',
          routes: {
            '/login': (context) => const LoginScreen(),
            '/properties': (context) => const PropertiesScreen(),
            '/home': (context) => const HomeTabs(),
            '/enhanced-home': (context) => const EnhancedHomeScreen(),
            '/search': (context) => const SearchScreen(),
            '/notifications': (context) => const NotificationsScreen(),
            '/settings': (context) => const SettingsScreen(),
            '/dashboard': (context) => const DashboardScreen(),
            '/favorites': (context) => const FavoritesScreen(),
            '/profile': (context) => const ProfileScreen(),
            '/property-detail': (context) {
              final args = ModalRoute.of(context)!.settings.arguments as String;
              return PropertyDetailScreen(id: args);
            },
            '/enhanced-property-detail': (context) {
              final args = ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
              return EnhancedPropertyDetailScreen(
                id: args['id'],
                propertyData: args['propertyData'],
              );
            },
          },
        );
      },
    );
  }
}

