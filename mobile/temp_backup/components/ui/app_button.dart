import 'package:flutter/material.dart';
import '../../config/design_tokens.dart';

/// AppButton - Matches Next.js Button.tsx with all variants
class AppButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final AppButtonVariant variant;
  final AppButtonSize size;
  final bool isLoading;
  final bool isFullWidth;
  final IconData? icon;
  final Widget? child;

  const AppButton({
    super.key,
    required this.text,
    this.onPressed,
    this.variant = AppButtonVariant.primary,
    this.size = AppButtonSize.medium,
    this.isLoading = false,
    this.isFullWidth = false,
    this.icon,
    this.child,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDisabled = onPressed == null || isLoading;

    Widget buttonChild = child ?? Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (isLoading) ...[
          SizedBox(
            width: DesignTokens.iconSizeSm,
            height: DesignTokens.iconSizeSm,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(
                _getTextColor(theme, isDisabled),
              ),
            ),
          ),
          const SizedBox(width: DesignTokens.space3),
        ] else if (icon != null) ...[
          Icon(icon, size: _getIconSize()),
          const SizedBox(width: DesignTokens.space3),
        ],
        Text(
          text,
          style: _getTextStyle(theme, isDisabled),
        ),
      ],
    );

    if (isFullWidth) {
      buttonChild = SizedBox(
        width: double.infinity,
        child: buttonChild,
      );
    }

    switch (variant) {
      case AppButtonVariant.primary:
        return ElevatedButton(
          onPressed: isDisabled ? null : onPressed,
          style: _getElevatedButtonStyle(theme, isDisabled),
          child: buttonChild,
        );
      case AppButtonVariant.secondary:
        return OutlinedButton(
          onPressed: isDisabled ? null : onPressed,
          style: _getOutlinedButtonStyle(theme, isDisabled),
          child: buttonChild,
        );
      case AppButtonVariant.text:
        return TextButton(
          onPressed: isDisabled ? null : onPressed,
          style: _getTextButtonStyle(theme, isDisabled),
          child: buttonChild,
        );
      case AppButtonVariant.danger:
        return ElevatedButton(
          onPressed: isDisabled ? null : onPressed,
          style: _getDangerButtonStyle(theme, isDisabled),
          child: buttonChild,
        );
    }
  }

  ButtonStyle _getElevatedButtonStyle(ThemeData theme, bool isDisabled) {
    return ElevatedButton.styleFrom(
      backgroundColor: isDisabled 
          ? theme.colorScheme.onSurface.withValues(alpha: DesignTokens.opacity20)
          : theme.colorScheme.primary,
      foregroundColor: isDisabled
          ? theme.colorScheme.onSurface.withValues(alpha: DesignTokens.opacity40)
          : theme.colorScheme.onPrimary,
      elevation: isDisabled ? DesignTokens.elevation0 : DesignTokens.elevation2,
      padding: _getPadding(),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(_getBorderRadius()),
      ),
      textStyle: _getTextStyle(theme, isDisabled),
    );
  }

  ButtonStyle _getOutlinedButtonStyle(ThemeData theme, bool isDisabled) {
    return OutlinedButton.styleFrom(
      foregroundColor: isDisabled
          ? theme.colorScheme.onSurface.withValues(alpha: DesignTokens.opacity40)
          : theme.colorScheme.primary,
      side: BorderSide(
        color: isDisabled
            ? theme.colorScheme.outline.withValues(alpha: DesignTokens.opacity40)
            : theme.colorScheme.primary,
        width: DesignTokens.borderWidth1,
      ),
      padding: _getPadding(),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(_getBorderRadius()),
      ),
      textStyle: _getTextStyle(theme, isDisabled),
    );
  }

  ButtonStyle _getTextButtonStyle(ThemeData theme, bool isDisabled) {
    return TextButton.styleFrom(
      foregroundColor: isDisabled
          ? theme.colorScheme.onSurface.withValues(alpha: DesignTokens.opacity40)
          : theme.colorScheme.primary,
      padding: _getPadding(),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(_getBorderRadius()),
      ),
      textStyle: _getTextStyle(theme, isDisabled),
    );
  }

  ButtonStyle _getDangerButtonStyle(ThemeData theme, bool isDisabled) {
    return ElevatedButton.styleFrom(
      backgroundColor: isDisabled 
          ? theme.colorScheme.onSurface.withValues(alpha: DesignTokens.opacity20)
          : theme.colorScheme.error,
      foregroundColor: isDisabled
          ? theme.colorScheme.onSurface.withValues(alpha: DesignTokens.opacity40)
          : theme.colorScheme.onError,
      elevation: isDisabled ? DesignTokens.elevation0 : DesignTokens.elevation2,
      padding: _getPadding(),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(_getBorderRadius()),
      ),
      textStyle: _getTextStyle(theme, isDisabled),
    );
  }

  EdgeInsets _getPadding() {
    switch (size) {
      case AppButtonSize.small:
        return const EdgeInsets.symmetric(
          horizontal: DesignTokens.space5,
          vertical: DesignTokens.space3,
        );
      case AppButtonSize.medium:
        return const EdgeInsets.symmetric(
          horizontal: DesignTokens.space7,
          vertical: DesignTokens.space5,
        );
      case AppButtonSize.large:
        return const EdgeInsets.symmetric(
          horizontal: DesignTokens.space8,
          vertical: DesignTokens.space6,
        );
    }
  }

  double _getBorderRadius() {
    switch (size) {
      case AppButtonSize.small:
        return DesignTokens.radiusLg;
      case AppButtonSize.medium:
        return DesignTokens.radiusXl;
      case AppButtonSize.large:
        return DesignTokens.radius2xl;
    }
  }

  double _getIconSize() {
    switch (size) {
      case AppButtonSize.small:
        return DesignTokens.iconSizeSm;
      case AppButtonSize.medium:
        return DesignTokens.iconSizeMd;
      case AppButtonSize.large:
        return DesignTokens.iconSizeLg;
    }
  }

  TextStyle _getTextStyle(ThemeData theme, bool isDisabled) {
    final baseStyle = switch (size) {
      AppButtonSize.small => theme.textTheme.labelMedium,
      AppButtonSize.medium => theme.textTheme.labelLarge,
      AppButtonSize.large => theme.textTheme.titleMedium,
    };

    return baseStyle?.copyWith(
      color: isDisabled
          ? theme.colorScheme.onSurface.withValues(alpha: DesignTokens.opacity40)
          : _getTextColor(theme, isDisabled),
    ) ?? const TextStyle();
  }

  Color _getTextColor(ThemeData theme, bool isDisabled) {
    if (isDisabled) {
      return theme.colorScheme.onSurface.withValues(alpha: DesignTokens.opacity40);
    }

    return switch (variant) {
      AppButtonVariant.primary => theme.colorScheme.onPrimary,
      AppButtonVariant.secondary => theme.colorScheme.primary,
      AppButtonVariant.text => theme.colorScheme.primary,
      AppButtonVariant.danger => theme.colorScheme.onError,
    };
  }
}

enum AppButtonVariant {
  primary,
  secondary,
  text,
  danger,
}

enum AppButtonSize {
  small,
  medium,
  large,
}


