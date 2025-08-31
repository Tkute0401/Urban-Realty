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
import "screens/profile_screen.dart";
import "screens/search_screen.dart";
import "screens/subscription_screen.dart";
import "screens/add_property_screen.dart";
import "screens/static_pages.dart";
import "screens/admin/admin_dashboard_screen.dart";
import "screens/admin/admin_users_screen.dart";
import "screens/admin/admin_properties_screen.dart";
import "screens/admin/admin_agents_screen.dart";
import "screens/admin/admin_analytics_screen.dart";
import "screens/agent/agent_dashboard_screen.dart";
import "screens/agent/agent_analytics_screen.dart";
import "screens/agent/agent_inquiries_screen.dart";
import "screens/agent/agent_leads_screen.dart";
import "screens/agent/agent_properties_screen.dart";
import "screens/developer/developers_list_screen.dart";
import "screens/notifications_screen.dart";
import "screens/properties_screen.dart";

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
              '/profile': (context) => const ProfileScreen(),
              '/subscription': (context) => const SubscriptionScreen(),
              '/add-property': (context) => const AddPropertyScreen(),
              '/search': (context) => const SearchScreen(),
              '/about': (context) => const AboutPage(),
              '/privacy': (context) => const PrivacyPolicyPage(),
              '/terms': (context) => const TermsConditionsPage(),
              '/contact': (context) => const ContactPage(),
              '/help': (context) => const HelpCenterPage(),
              // Admin routes
              '/admin/dashboard': (context) => const AdminDashboardScreen(),
              '/admin/users': (context) => const AdminUsersScreen(),
              '/admin/properties': (context) => const AdminPropertiesScreen(),
              '/admin/agents': (context) => const AdminAgentsScreen(),
              '/admin/analytics': (context) => const AdminAnalyticsScreen(),
              // Agent routes
              '/agent/dashboard': (context) => const AgentDashboardScreen(),
              '/agent/analytics': (context) => const AgentAnalyticsScreen(),
              '/agent/inquiries': (context) => const AgentInquiriesScreen(),
              '/agent/leads': (context) => const AgentLeadsScreen(),
              '/agent/properties': (context) => const AgentPropertiesScreen(),
              // Agent routes without prefix (for backward compatibility)
              '/agent-properties': (context) => const AgentPropertiesScreen(),
              '/agent-leads': (context) => const AgentLeadsScreen(),
              '/agent-inquiries': (context) => const AgentInquiriesScreen(),
              '/agent-analytics': (context) => const AgentAnalyticsScreen(),
              // Notifications route
              '/notifications': (context) => const NotificationsScreen(),
              // Property routes
              '/property-detail': (context) => PropertyDetailScreen(
                propertyId: ModalRoute.of(context)!.settings.arguments as String,
              ),
              '/edit-property': (context) => const EditPropertyPage(),
              // Developer routes
              '/developers': (context) => const DevelopersListScreen(),
              // Developer routes (placeholder - to be implemented)
              '/developer-add': (context) => const Scaffold(
                body: Center(child: Text('Add Developer - Coming Soon')),
              ),
              '/developer-detail': (context) => const Scaffold(
                body: Center(child: Text('Developer Details - Coming Soon')),
              ),
              '/developer-edit': (context) => const Scaffold(
                body: Center(child: Text('Edit Developer - Coming Soon')),
              ),
            },
            debugShowCheckedModeBanner: EnvironmentConfig.enableDebugBanner,
          );
        },
      ),
    );
  }
}
