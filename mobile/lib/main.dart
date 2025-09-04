import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'shared/providers/index.dart';
import 'core/config/index.dart';
import 'features/home/home_tabs.dart';
import 'features/auth/login_screen.dart';
import 'features/auth/register_screen.dart';
import 'features/settings/settings_screen.dart';
import 'features/profile/profile_screen.dart';
import 'features/search/search_screen.dart';
import 'features/subscription/subscription_screen.dart';
import 'features/subscription/subscription_management_screen.dart';
import 'features/recently_viewed/recently_viewed_screen.dart';
import 'features/properties/add_property_screen.dart';
import 'features/properties/property_detail_screen.dart';
import 'features/static_pages/static_pages.dart';
import 'features/admin/admin_dashboard_screen.dart';
import 'features/admin/admin_users_screen.dart';
import 'features/admin/admin_properties_screen.dart';
import 'features/admin/admin_agents_screen.dart';
import 'features/admin/admin_analytics_screen.dart';
import 'screens/admin/admin_settings_screen.dart';
import 'screens/admin/admin_reports_screen.dart';
import 'screens/admin/admin_media_screen.dart';
import 'features/agent/agent_dashboard_screen.dart';
import 'features/agent/agent_analytics_screen.dart';
import 'features/agent/agent_inquiries_screen.dart';
import 'features/agent/agent_leads_screen.dart';
import 'features/agent/agent_properties_screen.dart';
import 'features/developers/developers_list_screen.dart';
import 'features/notifications/notifications_screen.dart';
import 'features/splash/splash_screen.dart';
import 'screens/favorites_screen.dart';
import 'screens/properties_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");
  // Force production environment - no development or staging allowed
  EnvironmentConfig.setEnvironment(Environment.production);
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  final bool enableAutoLogin;
  const MyApp({super.key, this.enableAutoLogin = true});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider(autoLogin: enableAutoLogin)),
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
              builder: (context, auth, _) {
                if (auth.isLoading) {
                  return const SplashScreen();
                }
                return auth.isAuthenticated ? const HomeTabs() : const LoginScreen();
              },
            ),
            onGenerateRoute: (settings) {
              switch (settings.name) {
                case '/home':
                  return MaterialPageRoute(builder: (context) => const HomeTabs());
                case '/login':
                  return MaterialPageRoute(builder: (context) => const LoginScreen());
                case '/register':
                  return MaterialPageRoute(builder: (context) => const RegisterScreen());
                case '/settings':
                  return MaterialPageRoute(builder: (context) => const SettingsScreen());
                case '/profile':
                  return MaterialPageRoute(builder: (context) => const ProfileScreen());
                case '/subscription':
                  return MaterialPageRoute(builder: (context) => const SubscriptionScreen());
                case '/subscription/manage':
                  return MaterialPageRoute(builder: (context) => const SubscriptionManagementScreen());
                case '/recently-viewed':
                  return MaterialPageRoute(builder: (context) => const RecentlyViewedScreen());
                case '/add-property':
                  return MaterialPageRoute(builder: (context) => const AddPropertyScreen());
                case '/property-detail':
                  final args = settings.arguments as String?;
                  print('Property detail route called with args: $args');
                  if (args == null || args.isEmpty) {
                    print('No property ID provided, navigating to home');
                    // If no property ID provided, navigate back to home
                    return MaterialPageRoute(builder: (context) => const HomeTabs());
                  }
                  print('Creating PropertyDetailScreen with ID: $args');
                  return MaterialPageRoute(
                    builder: (context) => PropertyDetailScreen(propertyId: args),
                    settings: settings,
                  );
                case '/search':
                  return MaterialPageRoute(builder: (context) => const SearchScreen());
                case '/about':
                  return MaterialPageRoute(builder: (context) => const AboutPage());
                case '/privacy':
                  return MaterialPageRoute(builder: (context) => const PrivacyPolicyPage());
                case '/terms':
                  return MaterialPageRoute(builder: (context) => const TermsConditionsPage());
                case '/contact':
                  return MaterialPageRoute(builder: (context) => const ContactPage());
                case '/help':
                  return MaterialPageRoute(builder: (context) => const HelpCenterPage());
                case '/admin/dashboard':
                  return MaterialPageRoute(builder: (context) => const AdminDashboardScreen());
                case '/admin/users':
                  return MaterialPageRoute(builder: (context) => const AdminUsersScreen());
                case '/admin/properties':
                  return MaterialPageRoute(builder: (context) => const AdminPropertiesScreen());
                case '/admin/agents':
                  return MaterialPageRoute(builder: (context) => const AdminAgentsScreen());
                case '/admin/analytics':
                  return MaterialPageRoute(builder: (context) => const AdminAnalyticsScreen());
                case '/admin/settings':
                  return MaterialPageRoute(builder: (context) => const AdminSettingsScreen());
                case '/admin/reports':
                  return MaterialPageRoute(builder: (context) => const AdminReportsScreen());
                case '/admin/media':
                  return MaterialPageRoute(builder: (context) => const AdminMediaScreen());
                case '/agent/dashboard':
                  return MaterialPageRoute(builder: (context) => const AgentDashboardScreen());
                case '/agent/analytics':
                  return MaterialPageRoute(builder: (context) => const AgentAnalyticsScreen());
                case '/agent/inquiries':
                  return MaterialPageRoute(builder: (context) => const AgentInquiriesScreen());
                case '/agent/leads':
                  return MaterialPageRoute(builder: (context) => const AgentLeadsScreen());
                case '/agent/properties':
                  return MaterialPageRoute(builder: (context) => const AgentPropertiesScreen());
                case '/notifications':
                  return MaterialPageRoute(builder: (context) => const NotificationsScreen());
                case '/developers':
                  return MaterialPageRoute(builder: (context) => const DevelopersListScreen());
                // Add missing routes that are being called with hyphen format
                case '/agent-leads':
                  return MaterialPageRoute(builder: (context) => const AgentLeadsScreen());
                case '/agent-properties':
                  return MaterialPageRoute(builder: (context) => const AgentPropertiesScreen());
                case '/agent-inquiries':
                  return MaterialPageRoute(builder: (context) => const AgentInquiriesScreen());
                case '/agent-analytics':
                  return MaterialPageRoute(builder: (context) => const AgentAnalyticsScreen());
                // Add other missing routes
                case '/favorites':
                  return MaterialPageRoute(builder: (context) => const FavoritesScreen());
                case '/properties':
                  return MaterialPageRoute(builder: (context) => const PropertiesScreen());
                case '/developer-add':
                  return MaterialPageRoute(builder: (context) => const DevelopersListScreen());
                default:
                  return MaterialPageRoute(builder: (context) => const HomeTabs());
              }
            },
            onUnknownRoute: (settings) {
              // Handle unknown routes gracefully
              print('Unknown route: ${settings.name}');
              return MaterialPageRoute(builder: (context) => const HomeTabs());
            },
            debugShowCheckedModeBanner: EnvironmentConfig.enableDebugBanner,
          );
        },
      ),
    );
  }
}
