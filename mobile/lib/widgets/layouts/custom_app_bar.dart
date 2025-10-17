import 'package:flutter/material.dart';
import '../../config/design_tokens.dart';

/// CustomAppBar - Matches Header.tsx functionality
class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String? title;
  final Widget? titleWidget;
  final List<Widget>? actions;
  final Widget? leading;
  final bool centerTitle;
  final double? elevation;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final bool automaticallyImplyLeading;
  final VoidCallback? onBackPressed;
  final AppBarType type;

  const CustomAppBar({
    super.key,
    this.title,
    this.titleWidget,
    this.actions,
    this.leading,
    this.centerTitle = true,
    this.elevation,
    this.backgroundColor,
    this.foregroundColor,
    this.automaticallyImplyLeading = true,
    this.onBackPressed,
    this.type = AppBarType.standard,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final appBarBackgroundColor = backgroundColor ?? theme.colorScheme.surface;
    final appBarForegroundColor = foregroundColor ?? theme.colorScheme.onSurface;

    return AppBar(
      title: titleWidget ?? (title != null ? Text(title!) : null),
      actions: actions,
      leading: leading ?? _buildLeading(context),
      centerTitle: centerTitle,
      elevation: elevation ?? 0,
      backgroundColor: appBarBackgroundColor,
      foregroundColor: appBarForegroundColor,
      automaticallyImplyLeading: automaticallyImplyLeading,
      surfaceTintColor: Colors.transparent,
      shadowColor: Colors.transparent,
      titleTextStyle: _getTitleTextStyle(theme),
      toolbarHeight: _getToolbarHeight(),
    );
  }

  Widget? _buildLeading(BuildContext context) {
    if (!automaticallyImplyLeading) return null;

    return switch (type) {
      AppBarType.standard => IconButton(
          icon: const Icon(Icons.arrow_back_ios),
          onPressed: onBackPressed ?? () => Navigator.of(context).pop(),
        ),
      AppBarType.close => IconButton(
          icon: const Icon(Icons.close),
          onPressed: onBackPressed ?? () => Navigator.of(context).pop(),
        ),
      AppBarType.menu => IconButton(
          icon: const Icon(Icons.menu),
          onPressed: onBackPressed,
        ),
      AppBarType.none => null,
    };
  }

  TextStyle? _getTitleTextStyle(ThemeData theme) {
    return switch (type) {
      AppBarType.standard => theme.textTheme.headlineSmall?.copyWith(
          fontWeight: DesignTokens.fontWeightSemibold,
        ),
      AppBarType.large => theme.textTheme.headlineMedium?.copyWith(
          fontWeight: DesignTokens.fontWeightBold,
        ),
      AppBarType.small => theme.textTheme.titleLarge?.copyWith(
          fontWeight: DesignTokens.fontWeightMedium,
        ),
      _ => theme.textTheme.headlineSmall?.copyWith(
          fontWeight: DesignTokens.fontWeightSemibold,
        ),
    };
  }

  double _getToolbarHeight() {
    return switch (type) {
      AppBarType.standard => kToolbarHeight,
      AppBarType.large => kToolbarHeight + DesignTokens.space4,
      AppBarType.small => kToolbarHeight - DesignTokens.space2,
      _ => kToolbarHeight,
    };
  }

  @override
  Size get preferredSize => Size.fromHeight(_getToolbarHeight());
}

enum AppBarType {
  standard,
  large,
  small,
  close,
  menu,
  none,
}

/// CustomAppBar variants for common use cases
class CustomAppBarVariants {
  /// Standard app bar with back button
  static Widget standard({
    required String title,
    List<Widget>? actions,
    VoidCallback? onBackPressed,
  }) {
    return CustomAppBar(
      title: title,
      actions: actions,
      onBackPressed: onBackPressed,
      type: AppBarType.standard,
    );
  }

  /// Large app bar for important pages
  static Widget large({
    required String title,
    List<Widget>? actions,
    VoidCallback? onBackPressed,
  }) {
    return CustomAppBar(
      title: title,
      actions: actions,
      onBackPressed: onBackPressed,
      type: AppBarType.large,
    );
  }

  /// Small app bar for secondary pages
  static Widget small({
    required String title,
    List<Widget>? actions,
    VoidCallback? onBackPressed,
  }) {
    return CustomAppBar(
      title: title,
      actions: actions,
      onBackPressed: onBackPressed,
      type: AppBarType.small,
    );
  }

  /// Close app bar for modals
  static Widget close({
    required String title,
    List<Widget>? actions,
    VoidCallback? onClosePressed,
  }) {
    return CustomAppBar(
      title: title,
      actions: actions,
      onBackPressed: onClosePressed,
      type: AppBarType.close,
    );
  }

  /// Menu app bar for main pages
  static Widget menu({
    required String title,
    List<Widget>? actions,
    VoidCallback? onMenuPressed,
  }) {
    return CustomAppBar(
      title: title,
      actions: actions,
      onBackPressed: onMenuPressed,
      type: AppBarType.menu,
    );
  }

  /// Transparent app bar for overlays
  static Widget transparent({
    required String title,
    List<Widget>? actions,
    VoidCallback? onBackPressed,
  }) {
    return CustomAppBar(
      title: title,
      actions: actions,
      onBackPressed: onBackPressed,
      backgroundColor: Colors.transparent,
      elevation: 0,
    );
  }

  /// Search app bar with search field
  static Widget search({
    required TextEditingController searchController,
    required ValueChanged<String> onSearchChanged,
    List<Widget>? actions,
    VoidCallback? onBackPressed,
  }) {
    return CustomAppBar(
      titleWidget: TextField(
        controller: searchController,
        onChanged: onSearchChanged,
        decoration: const InputDecoration(
          hintText: 'Search...',
          border: InputBorder.none,
          contentPadding: EdgeInsets.zero,
        ),
        style: const TextStyle(fontSize: DesignTokens.fontSizeLg),
      ),
      actions: actions,
      onBackPressed: onBackPressed,
      type: AppBarType.standard,
    );
  }

  /// Profile app bar with avatar
  static Widget profile({
    required String title,
    required String? avatarUrl,
    required String? userName,
    List<Widget>? actions,
    VoidCallback? onBackPressed,
    VoidCallback? onAvatarTap,
  }) {
    return CustomAppBar(
      titleWidget: Row(
        children: [
          GestureDetector(
            onTap: onAvatarTap,
            child: CircleAvatar(
              radius: DesignTokens.space4,
              backgroundImage: avatarUrl != null ? NetworkImage(avatarUrl) : null,
              child: avatarUrl == null
                  ? Text(
                      userName?.isNotEmpty == true ? userName![0].toUpperCase() : 'U',
                      style: const TextStyle(
                        fontSize: DesignTokens.fontSizeLg,
                        fontWeight: DesignTokens.fontWeightSemibold,
                      ),
                    )
                  : null,
            ),
          ),
          const SizedBox(width: DesignTokens.space3),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: DesignTokens.fontSizeLg,
                    fontWeight: DesignTokens.fontWeightSemibold,
                  ),
                ),
                if (userName != null)
                  Text(
                    userName,
                    style: const TextStyle(
                      fontSize: DesignTokens.fontSizeSm,
                      color: Colors.grey,
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
      actions: actions,
      onBackPressed: onBackPressed,
      type: AppBarType.standard,
    );
  }
}
