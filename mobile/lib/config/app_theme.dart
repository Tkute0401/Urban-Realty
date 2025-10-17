import 'package:flutter/material.dart';
import 'design_tokens.dart';

class AppTheme {
  // SQUARE FOOOT Brand Colors - Matching Next.js exactly
  static const Color brandOrange = Color(0xFFF76B1C); // Primary orange from Next.js
  static const Color brandOrangeLight = Color(0xFFFB923C); // Lighter orange variant
  static const Color brandOrangeDark = Color(0xFFEA580C); // Darker orange variant
  static const Color brandWhite = Color(0xFFFFFFFF); // Clean white
  static const Color brandBlack = Color(0xFF000000); // Black for contrast
  static const Color brandBlue = Color(0xFF1A2BFF); // Deep blue from Next.js
  static const Color brandBlueLight = Color(0xFF3B82F6); // Lighter blue variant

  // Light Theme Colors - Matching Next.js exactly
  static const ColorScheme lightColorScheme = ColorScheme(
    brightness: Brightness.light,
    primary: Color(0xFFF76B1C), // Primary orange from Next.js
    onPrimary: Color(0xFFFFFFFF), // White text on orange
    primaryContainer: Color(0xFFFFE8D6), // Light orange background
    onPrimaryContainer: Color(0xFFEA580C), // Dark orange text
    secondary: Color(0xFF1A2BFF), // Deep blue from Next.js
    onSecondary: Color(0xFFFFFFFF), // White text on blue
    secondaryContainer: Color(0xFFE6E0FF), // Light blue background
    onSecondaryContainer: Color(0xFF1A2BFF), // Blue text
    tertiary: Color(0xFF16A34A), // Green for success states
    onTertiary: Color(0xFFFFFFFF),
    tertiaryContainer: Color(0xFFD1FAE5),
    onTertiaryContainer: Color(0xFF047857),
    error: Color(0xFFEF4444), // Red for errors
    onError: Color(0xFFFFFFFF),
    errorContainer: Color(0xFFFEE2E2),
    onErrorContainer: Color(0xFF991B1B),
    surface: Color(0xFFFFFFFF), // White background
    onSurface: Color(0xFF111827), // Dark text from Next.js
    surfaceContainerHighest: Color(0xFFF7F7F7), // Light gray surface
    onSurfaceVariant: Color(0xFF6B7280), // Medium gray text
    outline: Color(0xFFE5E7EB), // Light gray outline
    outlineVariant: Color(0xFFF3F4F6), // Very light gray outline
    shadow: Color(0x00000000),
    scrim: Color(0x00000000),
    inverseSurface: Color(0xFF111827),
    onInverseSurface: Color(0xFFF9FAFB),
    inversePrimary: Color(0xFFFFB366), // Light orange for inverse
    surfaceTint: Color(0xFFF76B1C), // Orange tint
  );

  // Dark Theme Colors - Matching Next.js exactly
  static const ColorScheme darkColorScheme = ColorScheme(
    brightness: Brightness.dark,
    primary: Color(0xFFF76B1C), // Same orange for consistency
    onPrimary: Color(0xFF000000), // Black text on orange
    primaryContainer: Color(0xFFEA580C), // Darker orange container
    onPrimaryContainer: Color(0xFFFFE8D6), // Light orange text
    secondary: Color(0xFF1A2BFF), // Same blue for consistency
    onSecondary: Color(0xFFFFFFFF), // White text on blue
    secondaryContainer: Color(0xFF1A2BFF), // Dark blue container
    onSecondaryContainer: Color(0xFFE6E0FF), // Light blue text
    tertiary: Color(0xFF22C55E), // Lighter green for dark theme
    onTertiary: Color(0xFF064E3B),
    tertiaryContainer: Color(0xFF047857),
    onTertiaryContainer: Color(0xFFD1FAE5),
    error: Color(0xFFF87171), // Lighter red for dark theme
    onError: Color(0xFF7F1D1D),
    errorContainer: Color(0xFF991B1B),
    onErrorContainer: Color(0xFFFEE2E2),
    surface: Color(0xFF0B132B), // Dark background from Next.js
    onSurface: Color(0xFFF9FAFB), // Light text from Next.js
    surfaceContainerHighest: Color(0xFF1F2937), // Medium dark surface
    onSurfaceVariant: Color(0xFF9CA3AF), // Light gray text from Next.js
    outline: Color(0xFF374151), // Medium gray outline from Next.js
    outlineVariant: Color(0xFF374151), // Dark gray outline
    shadow: Color(0x00000000),
    scrim: Color(0x00000000),
    inverseSurface: Color(0xFFF9FAFB),
    onInverseSurface: Color(0xFF0B132B),
    inversePrimary: Color(0xFFEA580C), // Dark orange for inverse
    surfaceTint: Color(0xFFF76B1C), // Orange tint
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
      elevation: DesignTokens.elevation2,
      shadowColor: const Color(0xFF000000).withValues(alpha: 0.1),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(DesignTokens.radius2xl)),
      margin: const EdgeInsets.symmetric(horizontal: DesignTokens.space5, vertical: DesignTokens.space3),
    ),
    
    // Elevated Button Theme
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        elevation: DesignTokens.elevation2,
        padding: const EdgeInsets.symmetric(horizontal: DesignTokens.space7, vertical: DesignTokens.space5),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(DesignTokens.radiusXl)),
        backgroundColor: lightColorScheme.primary,
        foregroundColor: lightColorScheme.onPrimary,
        textStyle: const TextStyle(
          fontSize: DesignTokens.fontSizeLg,
          fontWeight: DesignTokens.fontWeightMedium,
        ),
      ),
    ),
    
    // Outlined Button Theme
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: DesignTokens.space7, vertical: DesignTokens.space5),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(DesignTokens.radiusXl)),
        side: BorderSide(color: lightColorScheme.outline),
        textStyle: const TextStyle(
          fontSize: DesignTokens.fontSizeLg,
          fontWeight: DesignTokens.fontWeightMedium,
        ),
      ),
    ),
    
    // Text Button Theme
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: DesignTokens.space5, vertical: DesignTokens.space4),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(DesignTokens.radiusLg)),
        textStyle: const TextStyle(
          fontSize: DesignTokens.fontSizeLg,
          fontWeight: DesignTokens.fontWeightMedium,
        ),
      ),
    ),
    
    // Input Decoration Theme
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: lightColorScheme.surfaceContainerHighest,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(DesignTokens.radiusXl),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(DesignTokens.radiusXl),
        borderSide: BorderSide(color: lightColorScheme.outlineVariant),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(DesignTokens.radiusXl),
        borderSide: BorderSide(color: lightColorScheme.primary, width: DesignTokens.borderWidth2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(DesignTokens.radiusXl),
        borderSide: BorderSide(color: lightColorScheme.error),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: DesignTokens.space5, vertical: DesignTokens.space5),
      labelStyle: const TextStyle(
        fontSize: DesignTokens.fontSizeMd,
        fontWeight: DesignTokens.fontWeightNormal,
      ),
      hintStyle: const TextStyle(
        fontSize: DesignTokens.fontSizeMd,
        fontWeight: DesignTokens.fontWeightNormal,
      ),
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
    
    // Text Theme - Matching Next.js typography
    textTheme: const TextTheme(
      displayLarge: TextStyle(
        fontSize: DesignTokens.fontSize5xl,
        fontWeight: DesignTokens.fontWeightBold,
        height: DesignTokens.lineHeightTight,
        letterSpacing: DesignTokens.letterSpacingTight,
      ),
      displayMedium: TextStyle(
        fontSize: DesignTokens.fontSize4xl,
        fontWeight: DesignTokens.fontWeightBold,
        height: DesignTokens.lineHeightTight,
        letterSpacing: DesignTokens.letterSpacingTight,
      ),
      displaySmall: TextStyle(
        fontSize: DesignTokens.fontSize3xl,
        fontWeight: DesignTokens.fontWeightBold,
        height: DesignTokens.lineHeightTight,
        letterSpacing: DesignTokens.letterSpacingTight,
      ),
      headlineLarge: TextStyle(
        fontSize: DesignTokens.fontSize2xl,
        fontWeight: DesignTokens.fontWeightSemibold,
        height: DesignTokens.lineHeightSnug,
        letterSpacing: DesignTokens.letterSpacingNormal,
      ),
      headlineMedium: TextStyle(
        fontSize: DesignTokens.fontSizeXl,
        fontWeight: DesignTokens.fontWeightSemibold,
        height: DesignTokens.lineHeightSnug,
        letterSpacing: DesignTokens.letterSpacingNormal,
      ),
      headlineSmall: TextStyle(
        fontSize: DesignTokens.fontSizeLg,
        fontWeight: DesignTokens.fontWeightSemibold,
        height: DesignTokens.lineHeightSnug,
        letterSpacing: DesignTokens.letterSpacingNormal,
      ),
      titleLarge: TextStyle(
        fontSize: DesignTokens.fontSizeLg,
        fontWeight: DesignTokens.fontWeightSemibold,
        height: DesignTokens.lineHeightNormal,
        letterSpacing: DesignTokens.letterSpacingNormal,
      ),
      titleMedium: TextStyle(
        fontSize: DesignTokens.fontSizeMd,
        fontWeight: DesignTokens.fontWeightMedium,
        height: DesignTokens.lineHeightNormal,
        letterSpacing: DesignTokens.letterSpacingNormal,
      ),
      titleSmall: TextStyle(
        fontSize: DesignTokens.fontSizeSm,
        fontWeight: DesignTokens.fontWeightMedium,
        height: DesignTokens.lineHeightNormal,
        letterSpacing: DesignTokens.letterSpacingWide,
      ),
      bodyLarge: TextStyle(
        fontSize: DesignTokens.fontSizeLg,
        fontWeight: DesignTokens.fontWeightNormal,
        height: DesignTokens.lineHeightRelaxed,
        letterSpacing: DesignTokens.letterSpacingNormal,
      ),
      bodyMedium: TextStyle(
        fontSize: DesignTokens.fontSizeMd,
        fontWeight: DesignTokens.fontWeightNormal,
        height: DesignTokens.lineHeightRelaxed,
        letterSpacing: DesignTokens.letterSpacingNormal,
      ),
      bodySmall: TextStyle(
        fontSize: DesignTokens.fontSizeSm,
        fontWeight: DesignTokens.fontWeightNormal,
        height: DesignTokens.lineHeightNormal,
        letterSpacing: DesignTokens.letterSpacingWide,
      ),
      labelLarge: TextStyle(
        fontSize: DesignTokens.fontSizeMd,
        fontWeight: DesignTokens.fontWeightMedium,
        height: DesignTokens.lineHeightNormal,
        letterSpacing: DesignTokens.letterSpacingWide,
      ),
      labelMedium: TextStyle(
        fontSize: DesignTokens.fontSizeSm,
        fontWeight: DesignTokens.fontWeightMedium,
        height: DesignTokens.lineHeightNormal,
        letterSpacing: DesignTokens.letterSpacingWide,
      ),
      labelSmall: TextStyle(
        fontSize: DesignTokens.fontSizeXs,
        fontWeight: DesignTokens.fontWeightMedium,
        height: DesignTokens.lineHeightNormal,
        letterSpacing: DesignTokens.letterSpacingWider,
      ),
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
      shadowColor: const Color(0xFF000000).withValues(alpha: 0.3),
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
    
    // Text Theme - Matching Next.js typography
    textTheme: const TextTheme(
      displayLarge: TextStyle(
        fontSize: DesignTokens.fontSize5xl,
        fontWeight: DesignTokens.fontWeightBold,
        height: DesignTokens.lineHeightTight,
        letterSpacing: DesignTokens.letterSpacingTight,
      ),
      displayMedium: TextStyle(
        fontSize: DesignTokens.fontSize4xl,
        fontWeight: DesignTokens.fontWeightBold,
        height: DesignTokens.lineHeightTight,
        letterSpacing: DesignTokens.letterSpacingTight,
      ),
      displaySmall: TextStyle(
        fontSize: DesignTokens.fontSize3xl,
        fontWeight: DesignTokens.fontWeightBold,
        height: DesignTokens.lineHeightTight,
        letterSpacing: DesignTokens.letterSpacingTight,
      ),
      headlineLarge: TextStyle(
        fontSize: DesignTokens.fontSize2xl,
        fontWeight: DesignTokens.fontWeightSemibold,
        height: DesignTokens.lineHeightSnug,
        letterSpacing: DesignTokens.letterSpacingNormal,
      ),
      headlineMedium: TextStyle(
        fontSize: DesignTokens.fontSizeXl,
        fontWeight: DesignTokens.fontWeightSemibold,
        height: DesignTokens.lineHeightSnug,
        letterSpacing: DesignTokens.letterSpacingNormal,
      ),
      headlineSmall: TextStyle(
        fontSize: DesignTokens.fontSizeLg,
        fontWeight: DesignTokens.fontWeightSemibold,
        height: DesignTokens.lineHeightSnug,
        letterSpacing: DesignTokens.letterSpacingNormal,
      ),
      titleLarge: TextStyle(
        fontSize: DesignTokens.fontSizeLg,
        fontWeight: DesignTokens.fontWeightSemibold,
        height: DesignTokens.lineHeightNormal,
        letterSpacing: DesignTokens.letterSpacingNormal,
      ),
      titleMedium: TextStyle(
        fontSize: DesignTokens.fontSizeMd,
        fontWeight: DesignTokens.fontWeightMedium,
        height: DesignTokens.lineHeightNormal,
        letterSpacing: DesignTokens.letterSpacingNormal,
      ),
      titleSmall: TextStyle(
        fontSize: DesignTokens.fontSizeSm,
        fontWeight: DesignTokens.fontWeightMedium,
        height: DesignTokens.lineHeightNormal,
        letterSpacing: DesignTokens.letterSpacingWide,
      ),
      bodyLarge: TextStyle(
        fontSize: DesignTokens.fontSizeLg,
        fontWeight: DesignTokens.fontWeightNormal,
        height: DesignTokens.lineHeightRelaxed,
        letterSpacing: DesignTokens.letterSpacingNormal,
      ),
      bodyMedium: TextStyle(
        fontSize: DesignTokens.fontSizeMd,
        fontWeight: DesignTokens.fontWeightNormal,
        height: DesignTokens.lineHeightRelaxed,
        letterSpacing: DesignTokens.letterSpacingNormal,
      ),
      bodySmall: TextStyle(
        fontSize: DesignTokens.fontSizeSm,
        fontWeight: DesignTokens.fontWeightNormal,
        height: DesignTokens.lineHeightNormal,
        letterSpacing: DesignTokens.letterSpacingWide,
      ),
      labelLarge: TextStyle(
        fontSize: DesignTokens.fontSizeMd,
        fontWeight: DesignTokens.fontWeightMedium,
        height: DesignTokens.lineHeightNormal,
        letterSpacing: DesignTokens.letterSpacingWide,
      ),
      labelMedium: TextStyle(
        fontSize: DesignTokens.fontSizeSm,
        fontWeight: DesignTokens.fontWeightMedium,
        height: DesignTokens.lineHeightNormal,
        letterSpacing: DesignTokens.letterSpacingWide,
      ),
      labelSmall: TextStyle(
        fontSize: DesignTokens.fontSizeXs,
        fontWeight: DesignTokens.fontWeightMedium,
        height: DesignTokens.lineHeightNormal,
        letterSpacing: DesignTokens.letterSpacingWider,
      ),
    ),
  );
}