import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeProvider extends ChangeNotifier {
  static const String _themeKey = 'theme_mode';
  static const String _accentColorKey = 'accent_color';
  static const String _fontSizeKey = 'font_size';
  static const String _useSystemThemeKey = 'use_system_theme';
  
  ThemeMode _themeMode = ThemeMode.system;
  Color _accentColor = const Color(0xFFFF6B35); // SQUARE FOOOT orange
  double _fontSize = 1.0;
  bool _useSystemTheme = true;
  
  // Getters
  ThemeMode get themeMode => _themeMode;
  Color get accentColor => _accentColor;
  double get fontSize => _fontSize;
  bool get useSystemTheme => _useSystemTheme;
  bool get isDarkMode => _themeMode == ThemeMode.dark;
  bool get isLightMode => _themeMode == ThemeMode.light;
  
  ThemeProvider() {
    _loadPreferences();
  }
  
  Future<void> _loadPreferences() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      
      // Load theme mode
      final themeIndex = prefs.getInt(_themeKey);
      if (themeIndex != null) {
        _themeMode = ThemeMode.values[themeIndex];
      }
      
      // Load accent color
      final accentColorValue = prefs.getInt(_accentColorKey);
      if (accentColorValue != null) {
        _accentColor = Color(accentColorValue);
      }
      
      // Load font size
      _fontSize = prefs.getDouble(_fontSizeKey) ?? 1.0;
      
      // Load system theme preference
      _useSystemTheme = prefs.getBool(_useSystemThemeKey) ?? true;
      
      notifyListeners();
    } catch (e) {
      // Use default values if loading fails
      debugPrint('Error loading theme preferences: $e');
    }
  }
  
  Future<void> _savePreferences() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      
      await prefs.setInt(_themeKey, _themeMode.index);
      await prefs.setInt(_accentColorKey, _accentColor.value);
      await prefs.setDouble(_fontSizeKey, _fontSize);
      await prefs.setBool(_useSystemThemeKey, _useSystemTheme);
    } catch (e) {
      debugPrint('Error saving theme preferences: $e');
    }
  }
  
  // Theme mode methods
  void setThemeMode(ThemeMode mode) {
    if (_themeMode != mode) {
      _themeMode = mode;
      _useSystemTheme = false;
      notifyListeners();
      _savePreferences();
    }
  }
  
  void toggleTheme() {
    if (_themeMode == ThemeMode.light) {
      setThemeMode(ThemeMode.dark);
    } else if (_themeMode == ThemeMode.dark) {
      setThemeMode(ThemeMode.light);
    } else {
      // If system theme, check current system brightness
      final brightness = WidgetsBinding.instance.platformDispatcher.platformBrightness;
      setThemeMode(brightness == Brightness.dark ? ThemeMode.light : ThemeMode.dark);
    }
  }
  
  void useSystemTheme() {
    if (_themeMode != ThemeMode.system) {
      _themeMode = ThemeMode.system;
      _useSystemTheme = true;
      notifyListeners();
      _savePreferences();
    }
  }
  
  // Accent color methods
  void setAccentColor(Color color) {
    if (_accentColor != color) {
      _accentColor = color;
      notifyListeners();
      _savePreferences();
    }
  }
  
  // Predefined accent colors
  static const List<Color> predefinedColors = [
    Color(0xFFFF6B35), // SQUARE FOOOT Orange
    Color(0xFF1A00CD), // Deep Blue
    Color(0xFF059669), // Green
    Color(0xFFDC2626), // Red
    Color(0xFF7C3AED), // Purple
    Color(0xFFF59E0B), // Amber
    Color(0xFF10B981), // Emerald
    Color(0xFF3B82F6), // Blue
  ];
  
  // Font size methods
  void setFontSize(double size) {
    if (_fontSize != size) {
      _fontSize = size.clamp(0.8, 1.4); // Limit font size range
      notifyListeners();
      _savePreferences();
    }
  }
  
  void increaseFontSize() {
    setFontSize(_fontSize + 0.1);
  }
  
  void decreaseFontSize() {
    setFontSize(_fontSize - 0.1);
  }
  
  void resetFontSize() {
    setFontSize(1.0);
  }
  
  // Theme data getters
  ThemeData get lightTheme {
    return _buildLightTheme();
  }
  
  ThemeData get darkTheme {
    return _buildDarkTheme();
  }
  
  ThemeData _buildLightTheme() {
    final baseTheme = ThemeData.light();
    
    return baseTheme.copyWith(
      useMaterial3: true,
      colorScheme: _buildLightColorScheme(),
      textTheme: _buildTextTheme(baseTheme.textTheme),
      appBarTheme: _buildAppBarTheme(baseTheme.appBarTheme),
      cardTheme: _buildCardTheme(baseTheme.cardTheme),
      elevatedButtonTheme: _buildElevatedButtonTheme(baseTheme.elevatedButtonTheme),
      outlinedButtonTheme: _buildOutlinedButtonTheme(baseTheme.outlinedButtonTheme),
      textButtonTheme: _buildTextButtonTheme(baseTheme.textButtonTheme),
      inputDecorationTheme: _buildInputDecorationTheme(baseTheme.inputDecorationTheme),
      navigationBarTheme: _buildNavigationBarTheme(baseTheme.navigationBarTheme),
      floatingActionButtonTheme: _buildFloatingActionButtonTheme(baseTheme.floatingActionButtonTheme),
      chipTheme: _buildChipTheme(baseTheme.chipTheme),
      dividerTheme: _buildDividerTheme(baseTheme.dividerTheme),
      iconTheme: _buildIconTheme(baseTheme.iconTheme),
    );
  }
  
  ThemeData _buildDarkTheme() {
    final baseTheme = ThemeData.dark();
    
    return baseTheme.copyWith(
      useMaterial3: true,
      colorScheme: _buildDarkColorScheme(),
      textTheme: _buildTextTheme(baseTheme.textTheme),
      appBarTheme: _buildAppBarTheme(baseTheme.appBarTheme),
      cardTheme: _buildCardTheme(baseTheme.cardTheme),
      elevatedButtonTheme: _buildElevatedButtonTheme(baseTheme.elevatedButtonTheme),
      outlinedButtonTheme: _buildOutlinedButtonTheme(baseTheme.outlinedButtonTheme),
      textButtonTheme: _buildTextButtonTheme(baseTheme.textButtonTheme),
      inputDecorationTheme: _buildInputDecorationTheme(baseTheme.inputDecorationTheme),
      navigationBarTheme: _buildNavigationBarTheme(baseTheme.navigationBarTheme),
      floatingActionButtonTheme: _buildFloatingActionButtonTheme(baseTheme.floatingActionButtonTheme),
      chipTheme: _buildChipTheme(baseTheme.chipTheme),
      dividerTheme: _buildDividerTheme(baseTheme.dividerTheme),
      iconTheme: _buildIconTheme(baseTheme.iconTheme),
    );
  }
  
  ColorScheme _buildLightColorScheme() {
    return ColorScheme(
      brightness: Brightness.light,
      primary: _accentColor,
      onPrimary: Colors.white,
      primaryContainer: _accentColor.withOpacity(0.1),
      onPrimaryContainer: _accentColor,
      secondary: _accentColor.withOpacity(0.8),
      onSecondary: Colors.white,
      secondaryContainer: _accentColor.withOpacity(0.1),
      onSecondaryContainer: _accentColor,
      tertiary: _accentColor.withOpacity(0.6),
      onTertiary: Colors.white,
      tertiaryContainer: _accentColor.withOpacity(0.1),
      onTertiaryContainer: _accentColor,
      error: const Color(0xFFDC2626),
      onError: Colors.white,
      errorContainer: const Color(0xFFFEE2E2),
      onErrorContainer: const Color(0xFF991B1B),
      surface: Colors.white,
      onSurface: const Color(0xFF1F2937),
      surfaceVariant: const Color(0xFFF8F9FA),
      onSurfaceVariant: const Color(0xFF6B7280),
      outline: const Color(0xFFD1D5DB),
      outlineVariant: const Color(0xFFE5E7EB),
      shadow: Colors.transparent,
      scrim: Colors.transparent,
      inverseSurface: const Color(0xFF1F2937),
      onInverseSurface: const Color(0xFFF9FAFB),
      inversePrimary: _accentColor.withOpacity(0.8),
      surfaceTint: _accentColor,
    );
  }
  
  ColorScheme _buildDarkColorScheme() {
    return ColorScheme(
      brightness: Brightness.dark,
      primary: _accentColor,
      onPrimary: Colors.white,
      primaryContainer: _accentColor.withOpacity(0.2),
      onPrimaryContainer: _accentColor.withOpacity(0.9),
      secondary: _accentColor.withOpacity(0.8),
      onSecondary: Colors.white,
      secondaryContainer: _accentColor.withOpacity(0.2),
      onSecondaryContainer: _accentColor.withOpacity(0.9),
      tertiary: _accentColor.withOpacity(0.6),
      onTertiary: Colors.white,
      tertiaryContainer: _accentColor.withOpacity(0.2),
      onTertiaryContainer: _accentColor.withOpacity(0.9),
      error: const Color(0xFFF87171),
      onError: const Color(0xFF7F1D1D),
      errorContainer: const Color(0xFF991B1B),
      onErrorContainer: const Color(0xFFFEE2E2),
      surface: const Color(0xFF1E293B),
      onSurface: const Color(0xFFF1F5F9),
      surfaceVariant: const Color(0xFF334155),
      onSurfaceVariant: const Color(0xFFCBD5E1),
      outline: const Color(0xFF475569),
      outlineVariant: const Color(0xFF334155),
      shadow: Colors.transparent,
      scrim: Colors.transparent,
      inverseSurface: const Color(0xFFF1F5F9),
      onInverseSurface: const Color(0xFF0F172A),
      inversePrimary: _accentColor.withOpacity(0.8),
      surfaceTint: _accentColor,
    );
  }
  
  TextTheme _buildTextTheme(TextTheme baseTextTheme) {
    return baseTextTheme.copyWith(
      displayLarge: baseTextTheme.displayLarge?.copyWith(fontSize: 32 * _fontSize),
      displayMedium: baseTextTheme.displayMedium?.copyWith(fontSize: 28 * _fontSize),
      displaySmall: baseTextTheme.displaySmall?.copyWith(fontSize: 24 * _fontSize),
      headlineLarge: baseTextTheme.headlineLarge?.copyWith(fontSize: 22 * _fontSize),
      headlineMedium: baseTextTheme.headlineMedium?.copyWith(fontSize: 20 * _fontSize),
      headlineSmall: baseTextTheme.headlineSmall?.copyWith(fontSize: 18 * _fontSize),
      titleLarge: baseTextTheme.titleLarge?.copyWith(fontSize: 16 * _fontSize),
      titleMedium: baseTextTheme.titleMedium?.copyWith(fontSize: 14 * _fontSize),
      titleSmall: baseTextTheme.titleSmall?.copyWith(fontSize: 12 * _fontSize),
      bodyLarge: baseTextTheme.bodyLarge?.copyWith(fontSize: 16 * _fontSize),
      bodyMedium: baseTextTheme.bodyMedium?.copyWith(fontSize: 14 * _fontSize),
      bodySmall: baseTextTheme.bodySmall?.copyWith(fontSize: 12 * _fontSize),
      labelLarge: baseTextTheme.labelLarge?.copyWith(fontSize: 14 * _fontSize),
      labelMedium: baseTextTheme.labelMedium?.copyWith(fontSize: 12 * _fontSize),
      labelSmall: baseTextTheme.labelSmall?.copyWith(fontSize: 10 * _fontSize),
    );
  }
  
  AppBarTheme _buildAppBarTheme(AppBarTheme baseAppBarTheme) {
    return baseAppBarTheme.copyWith(
      elevation: 0,
      centerTitle: true,
      backgroundColor: Colors.transparent,
      surfaceTintColor: Colors.transparent,
    );
  }
  
  CardTheme _buildCardTheme(CardTheme baseCardTheme) {
    return baseCardTheme.copyWith(
      elevation: 4,
      shadowColor: Colors.black.withOpacity(0.1),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
    );
  }
  
  ElevatedButtonThemeData _buildElevatedButtonTheme(ElevatedButtonThemeData baseElevatedButtonTheme) {
    return ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        elevation: 4,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        backgroundColor: _accentColor,
        foregroundColor: Colors.white,
      ),
    );
  }
  
  OutlinedButtonThemeData _buildOutlinedButtonTheme(OutlinedButtonThemeData baseOutlinedButtonTheme) {
    return OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        side: BorderSide(color: _accentColor),
      ),
    );
  }
  
  TextButtonThemeData _buildTextButtonTheme(TextButtonThemeData baseTextButtonTheme) {
    return TextButtonThemeData(
      style: TextButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        foregroundColor: _accentColor,
      ),
    );
  }
  
  InputDecorationTheme _buildInputDecorationTheme(InputDecorationTheme baseInputDecorationTheme) {
    return InputDecorationTheme(
      filled: true,
      fillColor: Colors.grey.withOpacity(0.1),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Colors.grey.withOpacity(0.3)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: _accentColor, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: const Color(0xFFDC2626)),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
    );
  }
  
  NavigationBarThemeData _buildNavigationBarTheme(NavigationBarThemeData baseNavigationBarTheme) {
    return NavigationBarThemeData(
      elevation: 8,
      backgroundColor: Colors.white,
      indicatorColor: _accentColor.withOpacity(0.1),
      labelTextStyle: MaterialStateProperty.all(
        TextStyle(color: Colors.grey[600], fontSize: 12 * _fontSize),
      ),
    );
  }
  
  FloatingActionButtonThemeData _buildFloatingActionButtonTheme(FloatingActionButtonThemeData baseFloatingActionButtonTheme) {
    return FloatingActionButtonThemeData(
      backgroundColor: _accentColor,
      foregroundColor: Colors.white,
      elevation: 6,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    );
  }
  
  ChipThemeData _buildChipTheme(ChipThemeData baseChipTheme) {
    return ChipThemeData(
      backgroundColor: Colors.grey.withOpacity(0.1),
      selectedColor: _accentColor.withOpacity(0.1),
      labelStyle: TextStyle(color: Colors.grey[600], fontSize: 12 * _fontSize),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
    );
  }
  
  DividerThemeData _buildDividerTheme(DividerThemeData baseDividerTheme) {
    return DividerThemeData(
      color: Colors.grey.withOpacity(0.3),
      thickness: 1,
      space: 1,
    );
  }
  
  IconThemeData _buildIconTheme(IconThemeData baseIconTheme) {
    return IconThemeData(
      color: Colors.grey[600],
      size: 24 * _fontSize,
    );
  }
  
  // Utility methods
  bool get isSystemTheme => _themeMode == ThemeMode.system;
  
  String get currentThemeName {
    switch (_themeMode) {
      case ThemeMode.light:
        return 'Light';
      case ThemeMode.dark:
        return 'Dark';
      case ThemeMode.system:
        return 'System';
    }
  }
  
  // Reset to defaults
  void resetToDefaults() {
    _themeMode = ThemeMode.system;
    _accentColor = const Color(0xFFFF6B35);
    _fontSize = 1.0;
    _useSystemTheme = true;
    notifyListeners();
    _savePreferences();
  }
}