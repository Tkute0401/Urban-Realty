import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'providers/auth_provider.dart';
import 'screens/login_screen.dart';
import 'screens/home_tabs.dart';

void main() {
  runApp(const ProviderScope(child: UrbanRealtyApp()));
}

class UrbanRealtyApp extends ConsumerWidget {
  const UrbanRealtyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateProvider);

    return MaterialApp(
      title: 'Urban Realty',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
        textTheme: GoogleFonts.interTextTheme(),
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.blue,
          brightness: Brightness.light,
        ),
      ),
      home: _buildHome(authState),
      routes: {
        '/login': (context) => const LoginScreen(),
        '/home': (context) => const HomeTabs(),
      },
      debugShowCheckedModeBanner: false,
    );
  }

  Widget _buildHome(AuthState authState) {
    // Show loading while checking authentication
    if (authState.isLoading) {
      return const Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(),
              SizedBox(height: 16),
              Text('Loading...'),
            ],
          ),
        ),
      );
    }

    // Show login screen if no user is authenticated
    if (authState.user == null) {
      return const LoginScreen();
    }

    // Show home tabs if user is authenticated
    return const HomeTabs();
  }
}

