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
import 'features/properties/add_property_screen.dart';
import 'features/static_pages/static_pages.dart';
import 'features/admin/admin_dashboard_screen.dart';
import 'features/admin/admin_users_screen.dart';
import 'features/admin/admin_properties_screen.dart';
import 'features/admin/admin_agents_screen.dart';
import 'features/admin/admin_analytics_screen.dart';
import 'features/agent/agent_dashboard_screen.dart';
import 'features/agent/agent_analytics_screen.dart';
import 'features/agent/agent_inquiries_screen.dart';
import 'features/agent/agent_leads_screen.dart';
import 'features/agent/agent_properties_screen.dart';
import 'features/developers/developers_list_screen.dart';
import 'features/notifications/notifications_screen.dart';
import 'features/splash/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");
  EnvironmentConfig.setEnvironment(Environment.development);
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
