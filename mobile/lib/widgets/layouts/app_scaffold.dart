import 'package:flutter/material.dart';
import '../../config/design_tokens.dart';

/// AppScaffold - Standardized scaffold with safe areas
class AppScaffold extends StatelessWidget {
  final Widget body;
  final PreferredSizeWidget? appBar;
  final Widget? bottomNavigationBar;
  final Widget? floatingActionButton;
  final FloatingActionButtonLocation? floatingActionButtonLocation;
  final Widget? drawer;
  final Widget? endDrawer;
  final Color? backgroundColor;
  final bool extendBody;
  final bool extendBodyBehindAppBar;
  final bool resizeToAvoidBottomInset;
  final AppScaffoldType type;

  const AppScaffold({
    super.key,
    required this.body,
    this.appBar,
    this.bottomNavigationBar,
    this.floatingActionButton,
    this.floatingActionButtonLocation,
    this.drawer,
    this.endDrawer,
    this.backgroundColor,
    this.extendBody = false,
    this.extendBodyBehindAppBar = false,
    this.resizeToAvoidBottomInset = true,
    this.type = AppScaffoldType.standard,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scaffoldBackgroundColor = backgroundColor ?? theme.colorScheme.surface;

    return Scaffold(
      backgroundColor: scaffoldBackgroundColor,
      appBar: appBar,
      body: _buildBody(context),
      bottomNavigationBar: bottomNavigationBar,
      floatingActionButton: floatingActionButton,
      floatingActionButtonLocation: floatingActionButtonLocation,
      drawer: drawer,
      endDrawer: endDrawer,
      extendBody: extendBody,
      extendBodyBehindAppBar: extendBodyBehindAppBar,
      resizeToAvoidBottomInset: resizeToAvoidBottomInset,
    );
  }

  Widget _buildBody(BuildContext context) {
    return switch (type) {
      AppScaffoldType.standard => body,
      AppScaffoldType.safeArea => SafeArea(child: body),
      AppScaffoldType.padded => SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(DesignTokens.space5),
            child: body,
          ),
        ),
      AppScaffoldType.scrollable => SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(DesignTokens.space5),
            child: body,
          ),
        ),
      AppScaffoldType.centered => SafeArea(
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 600),
              child: body,
            ),
          ),
        ),
    };
  }
}

enum AppScaffoldType {
  standard,
  safeArea,
  padded,
  scrollable,
  centered,
}

/// AppScaffold variants for common use cases
class AppScaffoldVariants {
  /// Standard page scaffold
  static Widget page({
    required Widget body,
    PreferredSizeWidget? appBar,
    Widget? bottomNavigationBar,
    Widget? floatingActionButton,
  }) {
    return AppScaffold(
      body: body,
      appBar: appBar,
      bottomNavigationBar: bottomNavigationBar,
      floatingActionButton: floatingActionButton,
      type: AppScaffoldType.safeArea,
    );
  }

  /// Scrollable page scaffold
  static Widget scrollablePage({
    required Widget body,
    PreferredSizeWidget? appBar,
    Widget? bottomNavigationBar,
    EdgeInsetsGeometry? padding,
  }) {
    return AppScaffold(
      body: padding != null
          ? Padding(
              padding: padding,
              child: body,
            )
          : body,
      appBar: appBar,
      bottomNavigationBar: bottomNavigationBar,
      type: AppScaffoldType.scrollable,
    );
  }

  /// Centered content scaffold
  static Widget centeredPage({
    required Widget body,
    PreferredSizeWidget? appBar,
  }) {
    return AppScaffold(
      body: body,
      appBar: appBar,
      type: AppScaffoldType.centered,
    );
  }

  /// Full screen scaffold (for splash, onboarding)
  static Widget fullScreen({
    required Widget body,
    Color? backgroundColor,
  }) {
    return AppScaffold(
      body: body,
      backgroundColor: backgroundColor,
      type: AppScaffoldType.standard,
      extendBodyBehindAppBar: true,
    );
  }

  /// Modal scaffold (for bottom sheets, dialogs)
  static Widget modal({
    required Widget body,
    PreferredSizeWidget? appBar,
    Color? backgroundColor,
  }) {
    return AppScaffold(
      body: body,
      appBar: appBar,
      backgroundColor: backgroundColor,
      type: AppScaffoldType.safeArea,
    );
  }
}
