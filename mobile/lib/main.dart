import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'shared/providers/index.dart';
import 'core/config/index.dart';
import 'screens/home_tabs.dart';
import 'screens/login_screen.dart';
import 'screens/splash_screen.dart';
import 'screens/register_screen.dart';
import 'screens/settings_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/search_screen.dart';
import 'screens/subscription_screen.dart';
import 'screens/add_property_screen.dart';
import 'screens/static_pages.dart';
import 'screens/admin/admin_dashboard_screen.dart';
import 'screens/admin/admin_users_screen.dart';
import 'screens/admin/admin_properties_screen.dart';
import 'screens/admin/admin_agents_screen.dart';
import 'screens/admin/admin_analytics_screen.dart';
import 'screens/agent/agent_dashboard_screen.dart';
import 'screens/agent/agent_analytics_screen.dart';
import 'screens/agent/agent_inquiries_screen.dart';
import 'screens/agent/agent_leads_screen.dart';
import 'screens/agent/agent_properties_screen.dart';
import 'screens/developer/developers_list_screen.dart';
import 'screens/notifications_screen.dart';
import 'screens/properties_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");
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
              builder: (context, auth, _) {
                if (auth.isLoading) {
                  return const SplashScreen();
                }
                return auth.isAuthenticated ? const HomeTabs() : const LoginScreen();
              },
            ),
            routes: {
              '/home': (context) => const HomeTabs(),
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
              '/admin/dashboard': (context) => const AdminDashboardScreen(),
              '/admin/users': (context) => const AdminUsersScreen(),
              '/admin/properties': (context) => const AdminPropertiesScreen(),
              '/admin/agents': (context) => const AdminAgentsScreen(),
              '/admin/analytics': (context) => const AdminAnalyticsScreen(),
              '/agent/dashboard': (context) => const AgentDashboardScreen(),
              '/agent/analytics': (context) => const AgentAnalyticsScreen(),
              '/agent/inquiries': (context) => const AgentInquiriesScreen(),
              '/agent/leads': (context) => const AgentLeadsScreen(),
              '/agent/properties': (context) => const AgentPropertiesScreen(),
              '/notifications': (context) => const NotificationsScreen(),
              '/developers': (context) => const DevelopersListScreen(),
            },
            debugShowCheckedModeBanner: EnvironmentConfig.enableDebugBanner,
          );
        },
      ),
    );
  }
}
