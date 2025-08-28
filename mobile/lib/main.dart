import 'package:flutter/material.dart';
import 'screens/login_screen.dart';
import 'screens/properties_screen.dart';
import 'screens/home_tabs.dart';

void main() {
  runApp(const UrbanRealtyApp());
}

class UrbanRealtyApp extends StatelessWidget {
  const UrbanRealtyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Urban Realty',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
      ),
      initialRoute: '/login',
      routes: {
        '/login': (context) => const LoginScreen(),
        '/properties': (context) => const PropertiesScreen(),
        '/home': (context) => const HomeTabs(),
      },
    );
  }
}

