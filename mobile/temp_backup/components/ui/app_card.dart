import 'package:flutter/material.dart';
import '../../config/design_tokens.dart';

/// AppCard - Matches Next.js Card.tsx with elevation and hover effects
class AppCard extends StatefulWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double? elevation;
  final Color? backgroundColor;
  final BorderRadius? borderRadius;
  final Border? border;
  final VoidCallback? onTap;
  final bool enableHover;
  final bool enableRipple;

  const AppCard({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.elevation,
    this.backgroundColor,
    this.borderRadius,
    this.border,
    this.onTap,
    this.enableHover = true,
    this.enableRipple = true,
  });

  @override
  State<AppCard> createState() => _AppCardState();
}

class _AppCardState extends State<AppCard> with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;
  bool _isHovered = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: DesignTokens.durationFast,
      vsync: this,
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.98,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: DesignTokens.curveEaseOut,
    ));
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cardElevation = widget.elevation ?? DesignTokens.elevation2;
    final cardBackgroundColor = widget.backgroundColor ?? theme.colorScheme.surface;
    final cardBorderRadius = widget.borderRadius ?? BorderRadius.circular(DesignTokens.radius2xl);
    final cardPadding = widget.padding ?? const EdgeInsets.all(DesignTokens.space5);
    final cardMargin = widget.margin ?? const EdgeInsets.symmetric(
      horizontal: DesignTokens.space5,
      vertical: DesignTokens.space3,
    );

    Widget cardChild = Container(
      padding: cardPadding,
      child: widget.child,
    );

    if (widget.onTap != null) {
      cardChild = InkWell(
        onTap: widget.onTap,
        borderRadius: cardBorderRadius,
        enableFeedback: widget.enableRipple,
        onTapDown: widget.enableHover ? (_) => _onTapDown() : null,
        onTapUp: widget.enableHover ? (_) => _onTapUp() : null,
        onTapCancel: widget.enableHover ? () => _onTapUp() : null,
        child: cardChild,
      );
    }

    return AnimatedBuilder(
      animation: _scaleAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: _scaleAnimation.value,
          child: Container(
            margin: cardMargin,
            decoration: BoxDecoration(
              color: cardBackgroundColor,
              borderRadius: cardBorderRadius,
              border: widget.border,
              boxShadow: _getBoxShadow(theme, cardElevation),
            ),
            child: cardChild,
          ),
        );
      },
    );
  }

  void _onTapDown() {
    if (widget.enableHover) {
      _animationController.forward();
    }
  }

  void _onTapUp() {
    if (widget.enableHover) {
      _animationController.reverse();
    }
  }

  List<BoxShadow> _getBoxShadow(ThemeData theme, double elevation) {
    if (elevation == DesignTokens.elevation0) {
      return [];
    }

    final shadowColor = theme.colorScheme.shadow.withValues(
      alpha: elevation == DesignTokens.elevation1 ? 0.05 : 0.1,
    );

    return [
      BoxShadow(
        color: shadowColor,
        blurRadius: elevation * 2,
        offset: Offset(0, elevation),
      ),
      if (elevation > DesignTokens.elevation2)
        BoxShadow(
          color: shadowColor.withValues(alpha: 0.06),
          blurRadius: elevation,
          offset: Offset(0, elevation / 2),
        ),
    ];
  }
}

/// AppCard variants for common use cases
class AppCardVariants {
  /// Property card with image and content
  static Widget property({
    required Widget image,
    required Widget content,
    VoidCallback? onTap,
    EdgeInsetsGeometry? margin,
  }) {
    return AppCard(
      onTap: onTap,
      margin: margin,
      padding: EdgeInsets.zero,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.vertical(
              top: Radius.circular(DesignTokens.radius2xl),
            ),
            child: image,
          ),
          Padding(
            padding: const EdgeInsets.all(DesignTokens.space5),
            child: content,
          ),
        ],
      ),
    );
  }

  /// Stats card with icon, title, and value
  static Widget stats({
    required IconData icon,
    required String title,
    required String value,
    Color? iconColor,
    VoidCallback? onTap,
  }) {
    return AppCard(
      onTap: onTap,
      padding: const EdgeInsets.all(DesignTokens.space6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            icon,
            size: DesignTokens.iconSize2xl,
            color: iconColor,
          ),
          const SizedBox(height: DesignTokens.space4),
          Text(
            value,
            style: const TextStyle(
              fontSize: DesignTokens.fontSize2xl,
              fontWeight: DesignTokens.fontWeightBold,
            ),
          ),
          const SizedBox(height: DesignTokens.space2),
          Text(
            title,
            style: const TextStyle(
              fontSize: DesignTokens.fontSizeSm,
              fontWeight: DesignTokens.fontWeightMedium,
            ),
          ),
        ],
      ),
    );
  }

  /// Simple content card
  static Widget content({
    required Widget child,
    EdgeInsetsGeometry? padding,
    VoidCallback? onTap,
  }) {
    return AppCard(
      onTap: onTap,
      padding: padding ?? const EdgeInsets.all(DesignTokens.space5),
      child: child,
    );
  }

  /// Loading card with shimmer effect
  static Widget loading({
    double? height,
    EdgeInsetsGeometry? margin,
  }) {
    return AppCard(
      margin: margin,
      padding: const EdgeInsets.all(DesignTokens.space5),
      child: Container(
        height: height ?? DesignTokens.space20,
        decoration: BoxDecoration(
          color: Colors.grey.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(DesignTokens.radiusLg),
        ),
        child: const Center(
          child: CircularProgressIndicator(),
        ),
      ),
    );
  }
}


