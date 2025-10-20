import 'package:flutter/material.dart';
import '../../config/design_tokens.dart';

/// AppAvatar - Matches Next.js Avatar.tsx
class AppAvatar extends StatelessWidget {
  final String? imageUrl;
  final String? name;
  final IconData? fallbackIcon;
  final Color? backgroundColor;
  final Color? textColor;
  final AppAvatarSize size;
  final double? radius;
  final VoidCallback? onTap;
  final bool showBorder;
  final Color? borderColor;
  final double? borderWidth;

  const AppAvatar({
    super.key,
    this.imageUrl,
    this.name,
    this.fallbackIcon,
    this.backgroundColor,
    this.textColor,
    this.size = AppAvatarSize.medium,
    this.radius,
    this.onTap,
    this.showBorder = false,
    this.borderColor,
    this.borderWidth,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final avatarSize = _getSize();
    final avatarRadius = radius ?? (avatarSize / 2);
    final avatarBackgroundColor = backgroundColor ?? theme.colorScheme.primary;
    final avatarTextColor = textColor ?? theme.colorScheme.onPrimary;
    final avatarBorderColor = borderColor ?? theme.colorScheme.outline;
    final avatarBorderWidth = borderWidth ?? DesignTokens.borderWidth1;

    Widget avatarChild = _buildAvatarContent(theme, avatarTextColor);

    if (onTap != null) {
      avatarChild = InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(avatarRadius),
        child: avatarChild,
      );
    }

    return Container(
      width: avatarSize,
      height: avatarSize,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: avatarBackgroundColor,
        border: showBorder
            ? Border.all(
                color: avatarBorderColor,
                width: avatarBorderWidth,
              )
            : null,
        boxShadow: [
          BoxShadow(
            color: theme.colorScheme.shadow.withValues(alpha: 0.1),
            blurRadius: DesignTokens.elevation2,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: ClipOval(
        child: avatarChild,
      ),
    );
  }

  Widget _buildAvatarContent(ThemeData theme, Color textColor) {
    if (imageUrl != null && imageUrl!.isNotEmpty) {
      return Image.network(
        imageUrl!,
        width: double.infinity,
        height: double.infinity,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) {
          return _buildFallbackContent(theme, textColor);
        },
        loadingBuilder: (context, child, loadingProgress) {
          if (loadingProgress == null) return child;
          return Center(
            child: SizedBox(
              width: _getSize() * 0.4,
              height: _getSize() * 0.4,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation<Color>(textColor),
              ),
            ),
          );
        },
      );
    }

    return _buildFallbackContent(theme, textColor);
  }

  Widget _buildFallbackContent(ThemeData theme, Color textColor) {
    if (name != null && name!.isNotEmpty) {
      return Center(
        child: Text(
          _getInitials(name!),
          style: TextStyle(
            fontSize: _getFontSize(),
            fontWeight: DesignTokens.fontWeightSemibold,
            color: textColor,
          ),
        ),
      );
    }

    if (fallbackIcon != null) {
      return Center(
        child: Icon(
          fallbackIcon,
          size: _getIconSize(),
          color: textColor,
        ),
      );
    }

    return Center(
      child: Icon(
        Icons.person,
        size: _getIconSize(),
        color: textColor,
      ),
    );
  }

  String _getInitials(String name) {
    final words = name.trim().split(' ');
    if (words.isEmpty) return '';
    if (words.length == 1) return words[0][0].toUpperCase();
    return '${words[0][0]}${words[1][0]}'.toUpperCase();
  }

  double _getSize() {
    return switch (size) {
      AppAvatarSize.small => DesignTokens.space10,
      AppAvatarSize.medium => DesignTokens.space12,
      AppAvatarSize.large => DesignTokens.space16,
      AppAvatarSize.extraLarge => DesignTokens.space20,
    };
  }

  double _getFontSize() {
    return switch (size) {
      AppAvatarSize.small => DesignTokens.fontSizeSm,
      AppAvatarSize.medium => DesignTokens.fontSizeMd,
      AppAvatarSize.large => DesignTokens.fontSizeLg,
      AppAvatarSize.extraLarge => DesignTokens.fontSizeXl,
    };
  }

  double _getIconSize() {
    return switch (size) {
      AppAvatarSize.small => DesignTokens.iconSizeSm,
      AppAvatarSize.medium => DesignTokens.iconSizeMd,
      AppAvatarSize.large => DesignTokens.iconSizeLg,
      AppAvatarSize.extraLarge => DesignTokens.iconSizeXl,
    };
  }
}

enum AppAvatarSize {
  small,
  medium,
  large,
  extraLarge,
}

/// AppAvatar variants for common use cases
class AppAvatarVariants {
  /// User avatar with name
  static Widget user({
    required String name,
    String? imageUrl,
    AppAvatarSize size = AppAvatarSize.medium,
    VoidCallback? onTap,
  }) {
    return AppAvatar(
      name: name,
      imageUrl: imageUrl,
      size: size,
      onTap: onTap,
    );
  }

  /// Agent avatar with special styling
  static Widget agent({
    required String name,
    String? imageUrl,
    AppAvatarSize size = AppAvatarSize.medium,
    VoidCallback? onTap,
  }) {
    return AppAvatar(
      name: name,
      imageUrl: imageUrl,
      size: size,
      onTap: onTap,
      showBorder: true,
      borderColor: const Color(0xFFF76B1C),
      borderWidth: 2,
    );
  }

  /// Developer avatar with company logo
  static Widget developer({
    required String companyName,
    String? logoUrl,
    AppAvatarSize size = AppAvatarSize.medium,
    VoidCallback? onTap,
  }) {
    return AppAvatar(
      name: companyName,
      imageUrl: logoUrl,
      size: size,
      onTap: onTap,
      fallbackIcon: Icons.business,
    );
  }

  /// Property avatar for property images
  static Widget property({
    required String imageUrl,
    AppAvatarSize size = AppAvatarSize.medium,
    VoidCallback? onTap,
  }) {
    return AppAvatar(
      imageUrl: imageUrl,
      size: size,
      onTap: onTap,
      fallbackIcon: Icons.home,
    );
  }
}


