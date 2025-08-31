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
import "screens/register_screen.dart";
import "screens/settings_screen.dart";
import "screens/subscription_screen.dart";
import "screens/add_property_screen.dart";
import "screens/static_pages.dart";
import "screens/admin/admin_dashboard_screen.dart";
import "screens/admin/admin_users_screen.dart";
import "screens/agent/agent_dashboard_screen.dart";
import "screens/agent/agent_analytics_screen.dart";
import "screens/agent/agent_inquiries_screen.dart";
import "screens/agent/agent_leads_screen.dart";
import "screens/agent/agent_properties_screen.dart";
import "screens/developer/developers_list_screen.dart";

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
            initialRoute: '/',
            routes: {
              '/': (context) => Consumer<AuthProvider>(
                builder: (context, authProvider, child) {
                  if (authProvider.isAuthenticated) {
                    return const HomeTabs();
                  } else {
                    return const LoginScreen();
                  }
                },
              ),
              '/login': (context) => const LoginScreen(),
              '/register': (context) => const RegisterScreen(),
              '/settings': (context) => const SettingsScreen(),
              '/subscription': (context) => const SubscriptionScreen(),
              '/add-property': (context) => const AddPropertyScreen(),
              '/about': (context) => const StaticPages(title: 'About Us'),
              '/privacy': (context) => const StaticPages(title: 'Privacy Policy'),
              '/terms': (context) => const StaticPages(title: 'Terms of Service'),
              '/contact': (context) => const StaticPages(title: 'Contact Us'),
              '/help': (context) => const StaticPages(title: 'Help & Support'),
              // Admin routes
              '/admin/dashboard': (context) => const AdminDashboardScreen(),
              '/admin/users': (context) => const AdminUsersScreen(),
              // Agent routes
              '/agent/dashboard': (context) => const AgentDashboardScreen(),
              '/agent/analytics': (context) => const AgentAnalyticsScreen(),
              '/agent/inquiries': (context) => const AgentInquiriesScreen(),
              '/agent/leads': (context) => const AgentLeadsScreen(),
              '/agent/properties': (context) => const AgentPropertiesScreen(),
              // Developer routes
              '/developers': (context) => const DevelopersListScreen(),
            },
            debugShowCheckedModeBanner: EnvironmentConfig.enableDebugBanner,
          );
        },
      ),
    );
  }
}
