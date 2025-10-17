import 'package:flutter/material.dart';
import '../../config/design_tokens.dart';

/// ResponsiveLayout - Handles different screen sizes
class ResponsiveLayout extends StatelessWidget {
  final Widget mobile;
  final Widget? tablet;
  final Widget? desktop;
  final double? breakpointTablet;
  final double? breakpointDesktop;

  const ResponsiveLayout({
    super.key,
    required this.mobile,
    this.tablet,
    this.desktop,
    this.breakpointTablet,
    this.breakpointDesktop,
  });

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final tabletBreakpoint = breakpointTablet ?? DesignTokens.breakpointMd;
    final desktopBreakpoint = breakpointDesktop ?? DesignTokens.breakpointLg;

    if (screenWidth >= desktopBreakpoint && desktop != null) {
      return desktop!;
    } else if (screenWidth >= tabletBreakpoint && tablet != null) {
      return tablet!;
    } else {
      return mobile;
    }
  }
}

/// ResponsiveBuilder - Builds different widgets based on screen size
class ResponsiveBuilder extends StatelessWidget {
  final Widget Function(BuildContext context, ResponsiveBreakpoint breakpoint) builder;

  const ResponsiveBuilder({
    super.key,
    required this.builder,
  });

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final breakpoint = _getBreakpoint(screenWidth);
    
    return builder(context, breakpoint);
  }

  ResponsiveBreakpoint _getBreakpoint(double screenWidth) {
    if (screenWidth >= DesignTokens.breakpointLg) {
      return ResponsiveBreakpoint.desktop;
    } else if (screenWidth >= DesignTokens.breakpointMd) {
      return ResponsiveBreakpoint.tablet;
    } else {
      return ResponsiveBreakpoint.mobile;
    }
  }
}

enum ResponsiveBreakpoint {
  mobile,
  tablet,
  desktop,
}

/// Responsive utilities
class ResponsiveUtils {
  static bool isMobile(BuildContext context) {
    return MediaQuery.of(context).size.width < DesignTokens.breakpointMd;
  }

  static bool isTablet(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    return width >= DesignTokens.breakpointMd && width < DesignTokens.breakpointLg;
  }

  static bool isDesktop(BuildContext context) {
    return MediaQuery.of(context).size.width >= DesignTokens.breakpointLg;
  }

  static double getResponsiveValue(
    BuildContext context, {
    required double mobile,
    double? tablet,
    double? desktop,
  }) {
    if (isDesktop(context) && desktop != null) {
      return desktop;
    } else if (isTablet(context) && tablet != null) {
      return tablet;
    } else {
      return mobile;
    }
  }

  static int getResponsiveColumns(BuildContext context) {
    if (isDesktop(context)) return 3;
    if (isTablet(context)) return 2;
    return 1;
  }

  static EdgeInsets getResponsivePadding(BuildContext context) {
    if (isDesktop(context)) {
      return const EdgeInsets.symmetric(horizontal: DesignTokens.space12);
    } else if (isTablet(context)) {
      return const EdgeInsets.symmetric(horizontal: DesignTokens.space8);
    } else {
      return const EdgeInsets.symmetric(horizontal: DesignTokens.space5);
    }
  }

  static double getResponsiveFontSize(
    BuildContext context, {
    required double mobile,
    double? tablet,
    double? desktop,
  }) {
    return getResponsiveValue(
      context,
      mobile: mobile,
      tablet: tablet ?? mobile * 1.1,
      desktop: desktop ?? mobile * 1.2,
    );
  }
}
