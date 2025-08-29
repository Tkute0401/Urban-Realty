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
import 'screens/property_detail_screen.dart';
import 'screens/static_pages.dart';
import 'screens/favorites_screen.dart';
import 'screens/profile_screen.dart';

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
          theme: AppTheme.lightTheme,
          darkTheme: AppTheme.darkTheme,
          themeMode: themeProvider.themeMode,
          initialRoute: '/login',
          routes: {
            '/login': (context) => const LoginScreen(),
            '/register': (context) => const RegisterScreen(),
            '/properties': (context) => const PropertiesScreen(),
            '/home': (context) => const HomeTabs(),
            '/search': (context) => const SearchScreen(),
            '/notifications': (context) => const NotificationsScreen(),
            '/settings': (context) => const SettingsScreen(),
            '/favorites': (context) => const FavoritesScreen(),
            '/profile': (context) => const ProfileScreen(),
            // Static & Info pages
            '/about': (context) => const AboutPage(),
            '/contact': (context) => const ContactPage(),
            '/help': (context) => const HelpCenterPage(),
            '/privacy-policy': (context) => const PrivacyPolicyPage(),
            '/terms': (context) => const TermsConditionsPage(),
            '/career': (context) => const CareerPage(),
            '/trust': (context) => const TrustSafetyPage(),
            '/how-we-work': (context) => const HowWeWorkPage(),
            // Services
            '/lawyer-consultancy': (context) => const LawyerConsultancyPage(),
            '/packers-and-movers': (context) => const PackersMoversPage(),
            '/interior-design': (context) => const InteriorDesignPage(),
            '/emi-calculator': (context) => const EMICalculatorPage(),
            // Subscriptions
            '/subscriptions': (context) => const SubscriptionPlansPage(),
            '/subscription-management': (context) => const SubscriptionManagementPage(),
            '/subscription-comparison': (context) => const SubscriptionComparisonPage(),
            '/billing-dashboard': (context) => const BillingDashboardPage(),
            // Developers
            '/developers': (context) => const DevelopersListPage(),
            '/developer-add': (context) => const AddDeveloperPageMobile(),
            '/developer-edit': (context) => const EditDeveloperPageMobile(),
            '/developer-detail': (context) => const DeveloperDetailsPage(),
            // Properties
            '/property-detail': (context) {
              final args = ModalRoute.of(context)!.settings.arguments as String;
              return PropertyDetailScreen(id: args);
            },
            '/add-property': (context) => const AddPropertyPage(),
            '/edit-property': (context) => const EditPropertyPage(),
            // Areas
            '/agent': (context) => const AgentDashboardPage(),
            '/admin': (context) => const AdminDashboardPage(),
          },
        );
      },
    );
  }
}

