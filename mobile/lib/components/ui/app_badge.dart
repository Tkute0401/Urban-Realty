import 'package:flutter/material.dart';
import '../../config/design_tokens.dart';

/// AppBadge - Matches Next.js Badge.tsx for property tags, status indicators
class AppBadge extends StatelessWidget {
  final String text;
  final AppBadgeVariant variant;
  final AppBadgeSize size;
  final Color? backgroundColor;
  final Color? textColor;
  final IconData? icon;
  final VoidCallback? onTap;
  final bool showDot;
  final Color? dotColor;

  const AppBadge({
    super.key,
    required this.text,
    this.variant = AppBadgeVariant.primary,
    this.size = AppBadgeSize.medium,
    this.backgroundColor,
    this.textColor,
    this.icon,
    this.onTap,
    this.showDot = false,
    this.dotColor,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final badgeColors = _getBadgeColors(theme);
    final badgeSize = _getBadgeSize();

    Widget badgeChild = Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (showDot) ...[
          Container(
            width: _getDotSize(),
            height: _getDotSize(),
            decoration: BoxDecoration(
              color: dotColor ?? badgeColors.textColor,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: DesignTokens.space2),
        ],
        if (icon != null) ...[
          Icon(
            icon,
            size: _getIconSize(),
            color: badgeColors.textColor,
          ),
          const SizedBox(width: DesignTokens.space2),
        ],
        Text(
          text,
          style: _getTextStyle(theme, badgeColors.textColor),
        ),
      ],
    );

    if (onTap != null) {
      badgeChild = InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(_getBorderRadius()),
        child: badgeChild,
      );
    }

    return Container(
      padding: _getPadding(),
      decoration: BoxDecoration(
        color: badgeColors.backgroundColor,
        borderRadius: BorderRadius.circular(_getBorderRadius()),
        border: variant == AppBadgeVariant.outline
            ? Border.all(
                color: badgeColors.textColor,
                width: DesignTokens.borderWidth1,
              )
            : null,
      ),
      child: badgeChild,
    );
  }

  _BadgeColors _getBadgeColors(ThemeData theme) {
    if (backgroundColor != null && textColor != null) {
      return _BadgeColors(backgroundColor!, textColor!);
    }

    return switch (variant) {
      AppBadgeVariant.primary => _BadgeColors(
          theme.colorScheme.primary,
          theme.colorScheme.onPrimary,
        ),
      AppBadgeVariant.secondary => _BadgeColors(
          theme.colorScheme.secondary,
          theme.colorScheme.onSecondary,
        ),
      AppBadgeVariant.success => _BadgeColors(
          theme.colorScheme.tertiary,
          theme.colorScheme.onTertiary,
        ),
      AppBadgeVariant.warning => _BadgeColors(
          const Color(0xFFF59E0B),
          Colors.white,
        ),
      AppBadgeVariant.danger => _BadgeColors(
          theme.colorScheme.error,
          theme.colorScheme.onError,
        ),
      AppBadgeVariant.outline => _BadgeColors(
          Colors.transparent,
          theme.colorScheme.primary,
        ),
      AppBadgeVariant.neutral => _BadgeColors(
          theme.colorScheme.surfaceContainerHighest,
          theme.colorScheme.onSurfaceVariant,
        ),
    };
  }

  double _getBadgeSize() {
    return switch (size) {
      AppBadgeSize.small => DesignTokens.space6,
      AppBadgeSize.medium => DesignTokens.space8,
      AppBadgeSize.large => DesignTokens.space10,
    };
  }

  EdgeInsets _getPadding() {
    return switch (size) {
      AppBadgeSize.small => const EdgeInsets.symmetric(
          horizontal: DesignTokens.space3,
          vertical: DesignTokens.space1,
        ),
      AppBadgeSize.medium => const EdgeInsets.symmetric(
          horizontal: DesignTokens.space4,
          vertical: DesignTokens.space2,
        ),
      AppBadgeSize.large => const EdgeInsets.symmetric(
          horizontal: DesignTokens.space5,
          vertical: DesignTokens.space3,
        ),
    };
  }

  double _getBorderRadius() {
    return switch (size) {
      AppBadgeSize.small => DesignTokens.radiusSm,
      AppBadgeSize.medium => DesignTokens.radiusMd,
      AppBadgeSize.large => DesignTokens.radiusLg,
    };
  }

  double _getIconSize() {
    return switch (size) {
      AppBadgeSize.small => DesignTokens.iconSizeXs,
      AppBadgeSize.medium => DesignTokens.iconSizeSm,
      AppBadgeSize.large => DesignTokens.iconSizeMd,
    };
  }

  double _getDotSize() {
    return switch (size) {
      AppBadgeSize.small => DesignTokens.space1,
      AppBadgeSize.medium => DesignTokens.space2,
      AppBadgeSize.large => DesignTokens.space3,
    };
  }

  TextStyle _getTextStyle(ThemeData theme, Color textColor) {
    final baseStyle = switch (size) {
      AppBadgeSize.small => theme.textTheme.labelSmall,
      AppBadgeSize.medium => theme.textTheme.labelMedium,
      AppBadgeSize.large => theme.textTheme.labelLarge,
    };

    return baseStyle?.copyWith(
      color: textColor,
      fontWeight: DesignTokens.fontWeightMedium,
    ) ?? TextStyle(
      color: textColor,
      fontWeight: DesignTokens.fontWeightMedium,
    );
  }
}

class _BadgeColors {
  final Color backgroundColor;
  final Color textColor;

  _BadgeColors(this.backgroundColor, this.textColor);
}

enum AppBadgeVariant {
  primary,
  secondary,
  success,
  warning,
  danger,
  outline,
  neutral,
}

enum AppBadgeSize {
  small,
  medium,
  large,
}

/// AppBadge variants for common use cases
class AppBadgeVariants {
  /// Property status badge
  static Widget propertyStatus(String status) {
    final variant = switch (status.toLowerCase()) {
      'active' => AppBadgeVariant.success,
      'pending' => AppBadgeVariant.warning,
      'sold' => AppBadgeVariant.neutral,
      'rented' => AppBadgeVariant.neutral,
      'inactive' => AppBadgeVariant.danger,
      _ => AppBadgeVariant.neutral,
    };

    return AppBadge(
      text: status.toUpperCase(),
      variant: variant,
      size: AppBadgeSize.small,
    );
  }

  /// Property type badge
  static Widget propertyType(String type) {
    return AppBadge(
      text: type,
      variant: AppBadgeVariant.outline,
      size: AppBadgeSize.small,
    );
  }

  /// Price badge
  static Widget price(String price) {
    return AppBadge(
      text: price,
      variant: AppBadgeVariant.primary,
      size: AppBadgeSize.medium,
      icon: Icons.currency_rupee,
    );
  }

  /// BHK badge
  static Widget bhk(String bhk) {
    return AppBadge(
      text: bhk,
      variant: AppBadgeVariant.secondary,
      size: AppBadgeSize.small,
    );
  }

  /// Area badge
  static Widget area(String area) {
    return AppBadge(
      text: area,
      variant: AppBadgeVariant.neutral,
      size: AppBadgeSize.small,
      icon: Icons.square_foot,
    );
  }

  /// Featured badge
  static Widget featured() {
    return AppBadge(
      text: 'FEATURED',
      variant: AppBadgeVariant.warning,
      size: AppBadgeSize.small,
      icon: Icons.star,
    );
  }

  /// New badge
  static Widget newBadge() {
    return AppBadge(
      text: 'NEW',
      variant: AppBadgeVariant.success,
      size: AppBadgeSize.small,
    );
  }

  /// Online status badge
  static Widget onlineStatus(bool isOnline) {
    return AppBadge(
      text: isOnline ? 'ONLINE' : 'OFFLINE',
      variant: isOnline ? AppBadgeVariant.success : AppBadgeVariant.neutral,
      size: AppBadgeSize.small,
      showDot: true,
      dotColor: isOnline ? Colors.green : Colors.grey,
    );
  }

  /// User role badge
  static Widget userRole(String role) {
    final variant = switch (role.toLowerCase()) {
      'admin' => AppBadgeVariant.danger,
      'agent' => AppBadgeVariant.primary,
      'developer' => AppBadgeVariant.secondary,
      'user' => AppBadgeVariant.neutral,
      _ => AppBadgeVariant.neutral,
    };

    return AppBadge(
      text: role.toUpperCase(),
      variant: variant,
      size: AppBadgeSize.small,
    );
  }
}
