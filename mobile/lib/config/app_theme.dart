import 'package:flutter/material.dart';

class AppTheme {
  // SQUARE FOOOT Brand Colors
  static const Color brandOrange = Color(0xFFF75B00); // Vibrant orange from logo
  static const Color brandOrangeLight = Color(0xFFFF6600); // Lighter orange variant
  static const Color brandOrangeDark = Color(0xFFE54D00); // Darker orange variant
  static const Color brandWhite = Color(0xFFFFFFFF); // Clean white from logo
  static const Color brandBlack = Color(0xFF000000); // Black for contrast
  static const Color brandBlue = Color(0xFF1A00FF); // Deep blue variant from logo
  static const Color brandBlueLight = Color(0xFF3A20FF); // Lighter blue variant

  // Light Theme Colors - Based on SQUARE FOOOT brand
  static const ColorScheme lightColorScheme = ColorScheme(
    brightness: Brightness.light,
    primary: Color(0xFFF75B00), // SQUARE FOOOT orange
    onPrimary: Color(0xFFFFFFFF), // White text on orange
    primaryContainer: Color(0xFFFFE8D6), // Light orange background
    onPrimaryContainer: Color(0xFFE54D00), // Dark orange text
    secondary: Color(0xFF1A00FF), // Deep blue accent
    onSecondary: Color(0xFFFFFFFF), // White text on blue
    secondaryContainer: Color(0xFFE6E0FF), // Light blue background
    onSecondaryContainer: Color(0xFF1A00FF), // Blue text
    tertiary: Color(0xFF059669), // Green for success states
    onTertiary: Color(0xFFFFFFFF),
    tertiaryContainer: Color(0xFFD1FAE5),
    onTertiaryContainer: Color(0xFF047857),
    error: Color(0xFFDC2626), // Red for errors
    onError: Color(0xFFFFFFFF),
    errorContainer: Color(0xFFFEE2E2),
    onErrorContainer: Color(0xFF991B1B),
    surface: Color(0xFFFAFAFA), // Light gray background
    onSurface: Color(0xFF1F2937), // Dark text
    surfaceContainerHighest: Color(0xFFF8F9FA), // Very light gray
    onSurfaceVariant: Color(0xFF6B7280), // Medium gray text
    outline: Color(0xFFE5E7EB), // Light gray outline
    outlineVariant: Color(0xFFF3F4F6), // Very light gray outline
    shadow: Color(0x00000000),
    scrim: Color(0x00000000),
    inverseSurface: Color(0xFF1F2937),
    onInverseSurface: Color(0xFFF9FAFB),
    inversePrimary: Color(0xFFFFB366), // Light orange for inverse
    surfaceTint: Color(0xFFF75B00), // Orange tint
  );

  // Dark Theme Colors - Based on SQUARE FOOOT brand
  static const ColorScheme darkColorScheme = ColorScheme(
    brightness: Brightness.dark,
    primary: Color(0xFFFF6600), // Lighter orange for dark theme
    onPrimary: Color(0xFF000000), // Black text on orange
    primaryContainer: Color(0xFFE54D00), // Darker orange container
    onPrimaryContainer: Color(0xFFFFE8D6), // Light orange text
    secondary: Color(0xFF3A20FF), // Lighter blue for dark theme
    onSecondary: Color(0xFF000000), // Black text on blue
    secondaryContainer: Color(0xFF1A00FF), // Dark blue container
    onSecondaryContainer: Color(0xFFE6E0FF), // Light blue text
    tertiary: Color(0xFF34D399), // Lighter green for dark theme
    onTertiary: Color(0xFF064E3B),
    tertiaryContainer: Color(0xFF047857),
    onTertiaryContainer: Color(0xFFD1FAE5),
    error: Color(0xFFF87171), // Lighter red for dark theme
    onError: Color(0xFF7F1D1D),
    errorContainer: Color(0xFF991B1B),
    onErrorContainer: Color(0xFFFEE2E2),
    surface: Color(0xFF0F172A), // Dark blue-gray background
    onSurface: Color(0xFFF1F5F9), // Light text
    surfaceContainerHighest: Color(0xFF334155), // Medium dark surface
    onSurfaceVariant: Color(0xFFCBD5E1), // Light gray text
    outline: Color(0xFF475569), // Medium gray outline
    outlineVariant: Color(0xFF334155), // Dark gray outline
    shadow: Color(0x00000000),
    scrim: Color(0x00000000),
    inverseSurface: Color(0xFFF1F5F9),
    onInverseSurface: Color(0xFF0F172A),
    inversePrimary: Color(0xFFE54D00), // Dark orange for inverse
    surfaceTint: Color(0xFFFF6600), // Orange tint
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
      fillColor: lightColorScheme.surfaceContainerHighest,
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
      labelTextStyle: WidgetStateProperty.all(
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
      backgroundColor: lightColorScheme.surfaceContainerHighest,
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
      fillColor: darkColorScheme.surfaceContainerHighest,
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
      labelTextStyle: WidgetStateProperty.all(
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
      backgroundColor: darkColorScheme.surfaceContainerHighest,
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