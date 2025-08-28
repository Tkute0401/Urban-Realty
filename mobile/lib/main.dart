import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/theme_provider.dart';
import 'config/app_theme.dart';
import 'screens/login_screen.dart';
import 'screens/properties_screen.dart';
import 'screens/home_tabs.dart';
import 'screens/search_screen.dart';
import 'screens/notifications_screen.dart';
import 'screens/settings_screen.dart';

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
          title: 'Urban Realty',
          theme: AppTheme.lightTheme,
          darkTheme: AppTheme.darkTheme,
          themeMode: themeProvider.themeMode,
          initialRoute: '/login',
          routes: {
            '/login': (context) => const LoginScreen(),
            '/properties': (context) => const PropertiesScreen(),
            '/home': (context) => const HomeTabs(),
            '/search': (context) => const SearchScreen(),
            '/notifications': (context) => const NotificationsScreen(),
            '/settings': (context) => const SettingsScreen(),
            '/property-detail': (context) {
              final args = ModalRoute.of(context)!.settings.arguments as String;
              return PropertyDetailScreen(id: args);
            },
          },
        );
      },
    );
  }
}

