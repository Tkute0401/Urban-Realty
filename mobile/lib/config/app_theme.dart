import 'package:flutter/material.dart';

class AppTheme {
  // Light Theme Colors - Based on SQUARE FOOOT logo
  static const ColorScheme lightColorScheme = ColorScheme(
    brightness: Brightness.light,
    primary: Color(0xFFFF6B35), // Vibrant orange from logo
    onPrimary: Color(0xFFFFFFFF), // White text/icons on orange
    primaryContainer: Color(0xFFFFE8D6), // Light orange container
    onPrimaryContainer: Color(0xFFCC4A1A), // Dark orange text on light orange
    secondary: Color(0xFF1A00CD), // Deep blue accent
    onSecondary: Color(0xFFFFFFFF),
    secondaryContainer: Color(0xFFE6E0FF),
    onSecondaryContainer: Color(0xFF0D0066),
    tertiary: Color(0xFF059669), // Green
    onTertiary: Color(0xFFFFFFFF),
    tertiaryContainer: Color(0xFFD1FAE5),
    onTertiaryContainer: Color(0xFF047857),
    error: Color(0xFFDC2626),
    onError: Color(0xFFFFFFFF),
    errorContainer: Color(0xFFFEE2E2),
    onErrorContainer: Color(0xFF991B1B),
    surface: Color(0xFFFFFFFF), // White surface
    onSurface: Color(0xFF1F2937), // Dark text on white
    surfaceVariant: Color(0xFFF8F9FA), // Light gray surface variant
    onSurfaceVariant: Color(0xFF6B7280),
    outline: Color(0xFFD1D5DB),
    outlineVariant: Color(0xFFE5E7EB),
    shadow: Color(0x00000000),
    scrim: Color(0x00000000),
    inverseSurface: Color(0xFF1F2937),
    onInverseSurface: Color(0xFFF9FAFB),
    inversePrimary: Color(0xFFFFB366), // Light orange inverse
    surfaceTint: Color(0xFFFF6B35), // Orange surface tint
  );

  // Dark Theme Colors - Based on logo with dark variant
  static const ColorScheme darkColorScheme = ColorScheme(
    brightness: Brightness.dark,
    primary: Color(0xFFFF6B35), // Keep the vibrant orange
    onPrimary: Color(0xFFFFFFFF),
    primaryContainer: Color(0xFFCC4A1A), // Darker orange container
    onPrimaryContainer: Color(0xFFFFE8D6),
    secondary: Color(0xFF4A90E2), // Lighter blue for dark theme
    onSecondary: Color(0xFF0D0066),
    secondaryContainer: Color(0xFF1A00CD),
    onSecondaryContainer: Color(0xFFE6E0FF),
    tertiary: Color(0xFF34D399), // Lighter green for dark theme
    onTertiary: Color(0xFF064E3B),
    tertiaryContainer: Color(0xFF047857),
    onTertiaryContainer: Color(0xFFD1FAE5),
    error: Color(0xFFF87171),
    onError: Color(0xFF7F1D1D),
    errorContainer: Color(0xFF991B1B),
    onErrorContainer: Color(0xFFFEE2E2),
    surface: Color(0xFF1E293B), // Dark surface
    onSurface: Color(0xFFF1F5F9), // Light text on dark surface
    surfaceVariant: Color(0xFF334155),
    onSurfaceVariant: Color(0xFFCBD5E1),
    outline: Color(0xFF475569),
    outlineVariant: Color(0xFF334155),
    shadow: Color(0x00000000),
    scrim: Color(0x00000000),
    inverseSurface: Color(0xFFF1F5F9),
    onInverseSurface: Color(0xFF0F172A),
    inversePrimary: Color(0xFFCC4A1A),
    surfaceTint: Color(0xFFFF6B35), // Keep orange surface tint
  );

  // Light Theme
  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    colorScheme: lightColorScheme,
    brightness: Brightness.light,
    
    // App Bar Theme
    appBarTheme: const AppBarTheme(
      elevation: 0,
      centerTitle: true,
      backgroundColor: Colors.transparent,
      foregroundColor: Color(0xFF1F2937),
      surfaceTintColor: Colors.transparent,
    ),
    
    // Card Theme
    cardTheme: CardThemeData(
      elevation: 2,
      shadowColor: const Color(0xFF000000).withOpacity(0.1),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
    ),
    
    // Elevated Button Theme
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        elevation: 2,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        backgroundColor: lightColorScheme.primary,
        foregroundColor: lightColorScheme.onPrimary,
      ),
    ),
    
    // Outlined Button Theme
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        side: BorderSide(color: lightColorScheme.outline),
      ),
    ),
    
    // Text Button Theme
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    ),
    
    // Input Decoration Theme
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: lightColorScheme.surfaceVariant,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: lightColorScheme.outlineVariant),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: lightColorScheme.primary, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: lightColorScheme.error),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
    ),
    
    // Bottom Navigation Bar Theme
    navigationBarTheme: NavigationBarThemeData(
      elevation: 8,
      backgroundColor: lightColorScheme.surface,
      indicatorColor: lightColorScheme.primaryContainer,
      labelTextStyle: MaterialStateProperty.all(
        TextStyle(color: lightColorScheme.onSurfaceVariant, fontSize: 12),
      ),
    ),
    
    // Floating Action Button Theme
    floatingActionButtonTheme: FloatingActionButtonThemeData(
      backgroundColor: lightColorScheme.primary,
      foregroundColor: lightColorScheme.onPrimary,
      elevation: 6,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    ),
    
    // Chip Theme
    chipTheme: ChipThemeData(
      backgroundColor: lightColorScheme.surfaceVariant,
      selectedColor: lightColorScheme.primaryContainer,
      labelStyle: TextStyle(color: lightColorScheme.onSurfaceVariant),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
    ),
    
    // Divider Theme
    dividerTheme: DividerThemeData(
      color: lightColorScheme.outlineVariant,
      thickness: 1,
      space: 1,
    ),
    
    // Icon Theme
    iconTheme: IconThemeData(
      color: lightColorScheme.onSurfaceVariant,
      size: 24,
    ),
    
    // Text Theme
    textTheme: const TextTheme(
      displayLarge: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
      displayMedium: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
      displaySmall: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
      headlineLarge: TextStyle(fontSize: 22, fontWeight: FontWeight.w600),
      headlineMedium: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
      headlineSmall: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
      titleLarge: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
      titleMedium: TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
      titleSmall: TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
      bodyLarge: TextStyle(fontSize: 16, fontWeight: FontWeight.normal),
      bodyMedium: TextStyle(fontSize: 14, fontWeight: FontWeight.normal),
      bodySmall: TextStyle(fontSize: 12, fontWeight: FontWeight.normal),
      labelLarge: TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
      labelMedium: TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
      labelSmall: TextStyle(fontSize: 10, fontWeight: FontWeight.w500),
    ),
  );

  // Dark Theme
  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    colorScheme: darkColorScheme,
    brightness: Brightness.dark,
    
    // App Bar Theme
    appBarTheme: const AppBarTheme(
      elevation: 0,
      centerTitle: true,
      backgroundColor: Colors.transparent,
      foregroundColor: Color(0xFFF1F5F9),
      surfaceTintColor: Colors.transparent,
    ),
    
    // Card Theme
    cardTheme: CardThemeData(
      elevation: 4,
      shadowColor: const Color(0xFF000000).withOpacity(0.3),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
    ),
    
    // Elevated Button Theme
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        elevation: 4,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        backgroundColor: darkColorScheme.primary,
        foregroundColor: darkColorScheme.onPrimary,
      ),
    ),
    
    // Outlined Button Theme
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        side: BorderSide(color: darkColorScheme.outline),
      ),
    ),
    
    // Text Button Theme
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    ),
    
    // Input Decoration Theme
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: darkColorScheme.surfaceVariant,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: darkColorScheme.outlineVariant),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: darkColorScheme.primary, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: darkColorScheme.error),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
    ),
    
    // Bottom Navigation Bar Theme
    navigationBarTheme: NavigationBarThemeData(
      elevation: 8,
      backgroundColor: darkColorScheme.surface,
      indicatorColor: darkColorScheme.primaryContainer,
      labelTextStyle: MaterialStateProperty.all(
        TextStyle(color: darkColorScheme.onSurfaceVariant, fontSize: 12),
      ),
    ),
    
    // Floating Action Button Theme
    floatingActionButtonTheme: FloatingActionButtonThemeData(
      backgroundColor: darkColorScheme.primary,
      foregroundColor: darkColorScheme.onPrimary,
      elevation: 6,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    ),
    
    // Chip Theme
    chipTheme: ChipThemeData(
      backgroundColor: darkColorScheme.surfaceVariant,
      selectedColor: darkColorScheme.primaryContainer,
      labelStyle: TextStyle(color: darkColorScheme.onSurfaceVariant),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
    ),
    
    // Divider Theme
    dividerTheme: DividerThemeData(
      color: darkColorScheme.outlineVariant,
      thickness: 1,
      space: 1,
    ),
    
    // Icon Theme
    iconTheme: IconThemeData(
      color: darkColorScheme.onSurfaceVariant,
      size: 24,
    ),
    
    // Text Theme
    textTheme: const TextTheme(
      displayLarge: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
      displayMedium: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
      displaySmall: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
      headlineLarge: TextStyle(fontSize: 22, fontWeight: FontWeight.w600),
      headlineMedium: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
      headlineSmall: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
      titleLarge: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
      titleMedium: TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
      titleSmall: TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
      bodyLarge: TextStyle(fontSize: 16, fontWeight: FontWeight.normal),
      bodyMedium: TextStyle(fontSize: 14, fontWeight: FontWeight.normal),
      bodySmall: TextStyle(fontSize: 12, fontWeight: FontWeight.normal),
      labelLarge: TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
      labelMedium: TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
      labelSmall: TextStyle(fontSize: 10, fontWeight: FontWeight.w500),
    ),
  );
}