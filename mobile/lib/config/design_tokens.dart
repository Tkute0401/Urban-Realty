import 'package:flutter/material.dart';

/// Design tokens matching the Next.js app design system
class DesignTokens {
  // Spacing system (8px grid)
  static const double space0 = 0;
  static const double space1 = 2;
  static const double space2 = 4;
  static const double space3 = 8;
  static const double space4 = 12;
  static const double space5 = 16;
  static const double space6 = 20;
  static const double space7 = 24;
  static const double space8 = 32;
  static const double space9 = 40;
  static const double space10 = 48;
  static const double space11 = 56;
  static const double space12 = 64;
  static const double space16 = 80;
  static const double space20 = 96;
  static const double space24 = 128;

  // Border radius system
  static const double radiusNone = 0;
  static const double radiusSm = 2;
  static const double radiusMd = 4;
  static const double radiusLg = 8;
  static const double radiusXl = 12;
  static const double radius2xl = 16;
  static const double radius3xl = 20;
  static const double radiusPill = 999;
  static const double radiusRound = 50;

  // Elevation system
  static const double elevation0 = 0;
  static const double elevation1 = 1;
  static const double elevation2 = 2;
  static const double elevation4 = 4;
  static const double elevation6 = 6;
  static const double elevation8 = 8;
  static const double elevation12 = 12;
  static const double elevation16 = 16;
  static const double elevation24 = 24;

  // Font sizes
  static const double fontSizeXs = 10;
  static const double fontSizeSm = 12;
  static const double fontSizeMd = 14;
  static const double fontSizeLg = 16;
  static const double fontSizeXl = 18;
  static const double fontSize2xl = 20;
  static const double fontSize3xl = 24;
  static const double fontSize4xl = 28;
  static const double fontSize5xl = 32;
  static const double fontSize6xl = 36;
  static const double fontSize7xl = 42;
  static const double fontSize8xl = 48;
  static const double fontSize9xl = 56;

  // Font weights
  static const FontWeight fontWeightThin = FontWeight.w100;
  static const FontWeight fontWeightLight = FontWeight.w300;
  static const FontWeight fontWeightNormal = FontWeight.w400;
  static const FontWeight fontWeightMedium = FontWeight.w500;
  static const FontWeight fontWeightSemibold = FontWeight.w600;
  static const FontWeight fontWeightBold = FontWeight.w700;
  static const FontWeight fontWeightExtrabold = FontWeight.w800;
  static const FontWeight fontWeightBlack = FontWeight.w900;

  // Line heights
  static const double lineHeightTight = 1.25;
  static const double lineHeightSnug = 1.375;
  static const double lineHeightNormal = 1.5;
  static const double lineHeightRelaxed = 1.625;
  static const double lineHeightLoose = 2;

  // Letter spacing
  static const double letterSpacingTighter = -0.05;
  static const double letterSpacingTight = -0.025;
  static const double letterSpacingNormal = 0;
  static const double letterSpacingWide = 0.025;
  static const double letterSpacingWider = 0.05;
  static const double letterSpacingWidest = 0.1;

  // Animation durations
  static const Duration durationFast = Duration(milliseconds: 150);
  static const Duration durationNormal = Duration(milliseconds: 300);
  static const Duration durationSlow = Duration(milliseconds: 500);
  static const Duration durationSlower = Duration(milliseconds: 700);

  // Animation curves
  static const Curve curveEaseIn = Curves.easeIn;
  static const Curve curveEaseOut = Curves.easeOut;
  static const Curve curveEaseInOut = Curves.easeInOut;
  static const Curve curveFastOutSlowIn = Curves.fastOutSlowIn;
  static const Curve curveLinearOutSlowIn = Curves.linearOutSlowIn;
  static const Curve curveSlowMiddle = Curves.slowMiddle;

  // Z-index system
  static const int zIndexDropdown = 1000;
  static const int zIndexSticky = 1020;
  static const int zIndexOverlay = 1030;
  static const int zIndexModal = 1040;
  static const int zIndexPopover = 1060;
  static const int zIndexTooltip = 1070;

  // Breakpoints for responsive design
  static const double breakpointSm = 640;
  static const double breakpointMd = 768;
  static const double breakpointLg = 1024;
  static const double breakpointXl = 1280;
  static const double breakpoint2xl = 1536;

  // Touch target minimum size
  static const double touchTargetMin = 48;

  // Icon sizes
  static const double iconSizeXs = 12;
  static const double iconSizeSm = 16;
  static const double iconSizeMd = 20;
  static const double iconSizeLg = 24;
  static const double iconSizeXl = 32;
  static const double iconSize2xl = 40;
  static const double iconSize3xl = 48;

  // Shadow definitions
  static List<BoxShadow> get shadowSm => [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.05),
      blurRadius: 1,
      offset: const Offset(0, 1),
    ),
  ];

  static List<BoxShadow> get shadowMd => [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.1),
      blurRadius: 3,
      offset: const Offset(0, 1),
    ),
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.06),
      blurRadius: 1,
      offset: const Offset(0, 1),
    ),
  ];

  static List<BoxShadow> get shadowLg => [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.1),
      blurRadius: 10,
      offset: const Offset(0, 4),
    ),
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.06),
      blurRadius: 2,
      offset: const Offset(0, 2),
    ),
  ];

  static List<BoxShadow> get shadowXl => [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.1),
      blurRadius: 20,
      offset: const Offset(0, 10),
    ),
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.06),
      blurRadius: 4,
      offset: const Offset(0, 4),
    ),
  ];

  static List<BoxShadow> get shadow2xl => [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.25),
      blurRadius: 25,
      offset: const Offset(0, 25),
    ),
  ];

  // Gradient definitions
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFF76B1C), Color(0xFFEA580C)],
  );

  static const LinearGradient secondaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF1A2BFF), Color(0xFF3B82F6)],
  );

  static const LinearGradient surfaceGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0xFFFAFAFA), Color(0xFFF7F7F7)],
  );

  // Opacity levels
  static const double opacity0 = 0;
  static const double opacity5 = 0.05;
  static const double opacity10 = 0.1;
  static const double opacity20 = 0.2;
  static const double opacity25 = 0.25;
  static const double opacity30 = 0.3;
  static const double opacity40 = 0.4;
  static const double opacity50 = 0.5;
  static const double opacity60 = 0.6;
  static const double opacity70 = 0.7;
  static const double opacity75 = 0.75;
  static const double opacity80 = 0.8;
  static const double opacity90 = 0.9;
  static const double opacity95 = 0.95;
  static const double opacity100 = 1;

  // Border widths
  static const double borderWidth0 = 0;
  static const double borderWidth1 = 1;
  static const double borderWidth2 = 2;
  static const double borderWidth4 = 4;
  static const double borderWidth8 = 8;

  // Aspect ratios
  static const double aspectRatioSquare = 1;
  static const double aspectRatioVideo = 16 / 9;
  static const double aspectRatioPhoto = 4 / 3;
  static const double aspectRatioWide = 21 / 9;
  static const double aspectRatioGolden = 1.618;
}
