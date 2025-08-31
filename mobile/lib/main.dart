import "package:flutter/material.dart";
import "package:provider/provider.dart";
import "package:flutter_dotenv/flutter_dotenv.dart";
import "providers/auth_provider.dart";
import "providers/properties_provider.dart";
import "providers/theme_provider.dart";
import "config/app_theme.dart";
import "config/environment_config.dart";
import "screens/home_tabs.dart";
import "screens/login_screen.dart";

void main() async {
  // Load environment variables
  await dotenv.load(fileName: ".env");
  
  // Set environment for development
  EnvironmentConfig.setEnvironment(Environment.development);
  
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => PropertiesProvider()),
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
      ],
      child: Consumer<ThemeProvider>(
        builder: (context, themeProvider, child) {
          return MaterialApp(
            title: 'Urban Realty Mobile',
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: themeProvider.themeMode,
            home: Consumer<AuthProvider>(
              builder: (context, authProvider, child) {
                // Check if user is authenticated
                if (authProvider.isAuthenticated) {
                  return const HomeTabs();
                } else {
                  return const LoginScreen();
                }
              },
            ),
            debugShowCheckedModeBanner: EnvironmentConfig.enableDebugBanner,
          );
        },
      ),
    );
  }
}
