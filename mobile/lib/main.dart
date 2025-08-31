import "package:flutter/material.dart";
import "package:provider/provider.dart";
import "providers/auth_provider.dart";
import "providers/properties_provider.dart";
import "config/app_theme.dart";

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => PropertiesProvider()),
      ],
      child: MaterialApp(
        title: 'Urban Realty Mobile',
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        home: const Scaffold(
          body: Center(
            child: Text("Hello World"),
          ),
        ),
      ),
    );
  }
}
