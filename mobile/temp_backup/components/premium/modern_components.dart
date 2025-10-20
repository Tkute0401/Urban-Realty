import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:liquid_swipe/liquid_swipe.dart';
import '../../config/design_tokens.dart';
import '../../config/animation_config.dart';

/// Modern card component with advanced animations
class ModernCard extends StatefulWidget {
  final Widget child;
  final double? width;
  final double? height;
  final EdgeInsets? padding;
  final EdgeInsets? margin;
  final BorderRadius? borderRadius;
  final Color? backgroundColor;
  final List<BoxShadow>? boxShadow;
  final bool enableHover;
  final bool enablePress;
  final bool enableParallax;
  final double? parallaxOffset;
  final bool enableGlow;
  final Color? glowColor;
  final double? glowRadius;
  final bool enableShimmer;
  final Color? shimmerColor;
  final Duration? shimmerDuration;
  final bool enableTilt;
  final double? tiltAngle;
  final bool enableScale;
  final double? scaleFactor;
  final bool enableRotation;
  final double? rotationAngle;
  final bool enableBlur;
  final double? blurRadius;
  final bool enableGradient;
  final List<Color>? gradientColors;
  final Alignment? gradientBegin;
  final Alignment? gradientEnd;
  final bool enableAnimation;
  final Duration? animationDuration;
  final Curve? animationCurve;
  final String? animationType;

  const ModernCard({
    super.key,
    required this.child,
    this.width,
    this.height,
    this.padding,
    this.margin,
    this.borderRadius,
    this.backgroundColor,
    this.boxShadow,
    this.enableHover = true,
    this.enablePress = true,
    this.enableParallax = false,
    this.parallaxOffset,
    this.enableGlow = false,
    this.glowColor,
    this.glowRadius,
    this.enableShimmer = false,
    this.shimmerColor,
    this.shimmerDuration,
    this.enableTilt = false,
    this.tiltAngle,
    this.enableScale = true,
    this.scaleFactor,
    this.enableRotation = false,
    this.rotationAngle,
    this.enableBlur = false,
    this.blurRadius,
    this.enableGradient = false,
    this.gradientColors,
    this.gradientBegin,
    this.gradientEnd,
    this.enableAnimation = true,
    this.animationDuration,
    this.animationCurve,
    this.animationType,
  });

  @override
  State<ModernCard> createState() => _ModernCardState();
}

class _ModernCardState extends State<ModernCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _rotationAnimation;
  late Animation<double> _tiltAnimation;
  late Animation<double> _glowAnimation;
  late Animation<double> _shimmerAnimation;
  bool _isHovered = false;
  bool _isPressed = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: widget.animationDuration ?? AnimationConfig.normal,
      vsync: this,
    );
    _setupAnimations();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _setupAnimations() {
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: widget.scaleFactor ?? 1.05,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));

    _rotationAnimation = Tween<double>(
      begin: 0.0,
      end: widget.rotationAngle ?? 0.1,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));

    _tiltAnimation = Tween<double>(
      begin: 0.0,
      end: widget.tiltAngle ?? 0.05,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));

    _glowAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));

    _shimmerAnimation = Tween<double>(
      begin: -1.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));
  }

  @override
  Widget build(BuildContext context) {
    Widget card = _buildCard();

    // Parallax functionality removed due to dependency issues

    if (widget.enableAnimation) {
      card = _applyAnimations(card);
    }

    return MouseRegion(
      onEnter: widget.enableHover ? _onHoverEnter : null,
      onExit: widget.enableHover ? _onHoverExit : null,
      child: GestureDetector(
        onTapDown: widget.enablePress ? _onTapDown : null,
        onTapUp: widget.enablePress ? _onTapUp : null,
        onTapCancel: widget.enablePress ? _onTapCancel : null,
        child: card,
      ),
    );
  }

  Widget _buildCard() {
    return Container(
      width: widget.width,
      height: widget.height,
      margin: widget.margin,
      decoration: BoxDecoration(
        color: widget.backgroundColor,
        borderRadius: widget.borderRadius ?? BorderRadius.circular(DesignTokens.radiusLg),
        boxShadow: widget.boxShadow ?? [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
        gradient: widget.enableGradient ? LinearGradient(
          begin: widget.gradientBegin ?? Alignment.topLeft,
          end: widget.gradientEnd ?? Alignment.bottomRight,
          colors: widget.gradientColors ?? [
            Colors.blue.withOpacity(0.1),
            Colors.purple.withOpacity(0.1),
          ],
        ) : null,
      ),
      child: ClipRRect(
        borderRadius: widget.borderRadius ?? BorderRadius.circular(DesignTokens.radiusLg),
        child: Stack(
          children: [
            Container(
              padding: widget.padding ?? const EdgeInsets.all(DesignTokens.spacingLg),
              child: widget.child,
            ),
            if (widget.enableShimmer) _buildShimmerEffect(),
            if (widget.enableGlow) _buildGlowEffect(),
          ],
        ),
      ),
    );
  }

  Widget _buildShimmerEffect() {
    return AnimatedBuilder(
      animation: _shimmerAnimation,
      builder: (context, child) {
        return Positioned.fill(
          child: ShaderMask(
            blendMode: BlendMode.srcATop,
            shaderCallback: (bounds) {
              return LinearGradient(
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
                colors: [
                  Colors.transparent,
                  widget.shimmerColor?.withOpacity(0.3) ?? Colors.white.withOpacity(0.3),
                  Colors.transparent,
                ],
                stops: [
                  _shimmerAnimation.value - 0.3,
                  _shimmerAnimation.value,
                  _shimmerAnimation.value + 0.3,
                ].map((stop) => stop.clamp(0.0, 1.0)).toList(),
              ).createShader(bounds);
            },
            child: Container(
              color: Colors.white,
            ),
          ),
        );
      },
    );
  }

  Widget _buildGlowEffect() {
    return AnimatedBuilder(
      animation: _glowAnimation,
      builder: (context, child) {
        return Positioned.fill(
          child: Container(
            decoration: BoxDecoration(
              borderRadius: widget.borderRadius ?? BorderRadius.circular(DesignTokens.radiusLg),
              boxShadow: [
                BoxShadow(
                  color: (widget.glowColor ?? Colors.blue).withOpacity(_glowAnimation.value * 0.5),
                  blurRadius: (widget.glowRadius ?? 20) * _glowAnimation.value,
                  spreadRadius: 5 * _glowAnimation.value,
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _applyAnimations(Widget child) {
    switch (widget.animationType) {
      case 'fadeIn':
        return child.animate().fadeIn(
          duration: widget.animationDuration ?? AnimationConfig.normal,
          curve: widget.animationCurve ?? AnimationConfig.easeInOut,
        );
      case 'slideInUp':
        return child.animate().slideY(
          begin: 0.1,
          end: 0,
          duration: widget.animationDuration ?? AnimationConfig.normal,
          curve: widget.animationCurve ?? AnimationConfig.easeOut,
        );
      case 'slideInDown':
        return child.animate().slideY(
          begin: -0.1,
          end: 0,
          duration: widget.animationDuration ?? AnimationConfig.normal,
          curve: widget.animationCurve ?? AnimationConfig.easeOut,
        );
      case 'slideInLeft':
        return child.animate().slideX(
          begin: -0.1,
          end: 0,
          duration: widget.animationDuration ?? AnimationConfig.normal,
          curve: widget.animationCurve ?? AnimationConfig.easeOut,
        );
      case 'slideInRight':
        return child.animate().slideX(
          begin: 0.1,
          end: 0,
          duration: widget.animationDuration ?? AnimationConfig.normal,
          curve: widget.animationCurve ?? AnimationConfig.easeOut,
        );
      case 'scaleIn':
        return child.animate().scale(
          begin: const Offset(0.8, 0.8),
          end: const Offset(1.0, 1.0),
          duration: widget.animationDuration ?? AnimationConfig.normal,
          curve: widget.animationCurve ?? AnimationConfig.easeOut,
        );
      case 'rotateIn':
        return child.animate().rotate(
          begin: 0.1,
          end: 0,
          duration: widget.animationDuration ?? AnimationConfig.normal,
          curve: widget.animationCurve ?? AnimationConfig.easeOut,
        );
      case 'bounceIn':
        return child.animate().scale(
          begin: const Offset(0.8, 0.8),
          end: const Offset(1.0, 1.0),
          duration: widget.animationDuration ?? AnimationConfig.slow,
          curve: Curves.bounceOut,
        );
      case 'elasticIn':
        return child.animate().scale(
          begin: const Offset(0.8, 0.8),
          end: const Offset(1.0, 1.0),
          duration: widget.animationDuration ?? AnimationConfig.verySlow,
          curve: Curves.elasticOut,
        );
      default:
        return child.animate().fadeIn(
          duration: widget.animationDuration ?? AnimationConfig.normal,
          curve: widget.animationCurve ?? AnimationConfig.easeInOut,
        );
    }
  }

  void _onHoverEnter(PointerEnterEvent event) {
    if (widget.enableHover) {
      setState(() {
        _isHovered = true;
      });
      _controller.forward();
    }
  }

  void _onHoverExit(PointerExitEvent event) {
    if (widget.enableHover) {
      setState(() {
        _isHovered = false;
      });
      _controller.reverse();
    }
  }

  void _onTapDown(TapDownDetails details) {
    if (widget.enablePress) {
      setState(() {
        _isPressed = true;
      });
    }
  }

  void _onTapUp(TapUpDetails details) {
    if (widget.enablePress) {
      setState(() {
        _isPressed = false;
      });
    }
  }

  void _onTapCancel(TapCancelDetails details) {
    if (widget.enablePress) {
      setState(() {
        _isPressed = false;
      });
    }
  }
}

/// Modern button component with advanced animations
class ModernButton extends StatefulWidget {
  final String text;
  final VoidCallback? onPressed;
  final IconData? icon;
  final double? width;
  final double? height;
  final EdgeInsets? padding;
  final BorderRadius? borderRadius;
  final Color? backgroundColor;
  final Color? textColor;
  final double? fontSize;
  final FontWeight? fontWeight;
  final bool enableHover;
  final bool enablePress;
  final bool enableGlow;
  final Color? glowColor;
  final double? glowRadius;
  final bool enableShimmer;
  final Color? shimmerColor;
  final Duration? shimmerDuration;
  final bool enableTilt;
  final double? tiltAngle;
  final bool enableScale;
  final double? scaleFactor;
  final bool enableRotation;
  final double? rotationAngle;
  final bool enableGradient;
  final List<Color>? gradientColors;
  final Alignment? gradientBegin;
  final Alignment? gradientEnd;
  final bool enableAnimation;
  final Duration? animationDuration;
  final Curve? animationCurve;
  final String? animationType;

  const ModernButton({
    super.key,
    required this.text,
    this.onPressed,
    this.icon,
    this.width,
    this.height,
    this.padding,
    this.borderRadius,
    this.backgroundColor,
    this.textColor,
    this.fontSize,
    this.fontWeight,
    this.enableHover = true,
    this.enablePress = true,
    this.enableGlow = false,
    this.glowColor,
    this.glowRadius,
    this.enableShimmer = false,
    this.shimmerColor,
    this.shimmerDuration,
    this.enableTilt = false,
    this.tiltAngle,
    this.enableScale = true,
    this.scaleFactor,
    this.enableRotation = false,
    this.rotationAngle,
    this.enableGradient = false,
    this.gradientColors,
    this.gradientBegin,
    this.gradientEnd,
    this.enableAnimation = true,
    this.animationDuration,
    this.animationCurve,
    this.animationType,
  });

  @override
  State<ModernButton> createState() => _ModernButtonState();
}

class _ModernButtonState extends State<ModernButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _rotationAnimation;
  late Animation<double> _tiltAnimation;
  late Animation<double> _glowAnimation;
  late Animation<double> _shimmerAnimation;
  bool _isHovered = false;
  bool _isPressed = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: widget.animationDuration ?? AnimationConfig.microNormal,
      vsync: this,
    );
    _setupAnimations();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _setupAnimations() {
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: widget.scaleFactor ?? 0.95,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));

    _rotationAnimation = Tween<double>(
      begin: 0.0,
      end: widget.rotationAngle ?? 0.1,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));

    _tiltAnimation = Tween<double>(
      begin: 0.0,
      end: widget.tiltAngle ?? 0.05,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));

    _glowAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));

    _shimmerAnimation = Tween<double>(
      begin: -1.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));
  }

  @override
  Widget build(BuildContext context) {
    Widget button = _buildButton();

    if (widget.enableAnimation) {
      button = _applyAnimations(button);
    }

    return MouseRegion(
      onEnter: widget.enableHover ? _onHoverEnter : null,
      onExit: widget.enableHover ? _onHoverExit : null,
      child: GestureDetector(
        onTapDown: widget.enablePress ? _onTapDown : null,
        onTapUp: widget.enablePress ? _onTapUp : null,
        onTapCancel: widget.enablePress ? _onTapCancel : null,
        onTap: widget.onPressed,
        child: button,
      ),
    );
  }

  Widget _buildButton() {
    return Container(
      width: widget.width ?? double.infinity,
      height: widget.height ?? 56,
      decoration: BoxDecoration(
        color: widget.backgroundColor ?? Theme.of(context).colorScheme.primary,
        borderRadius: widget.borderRadius ?? BorderRadius.circular(DesignTokens.radiusMd),
        gradient: widget.enableGradient ? LinearGradient(
          begin: widget.gradientBegin ?? Alignment.topLeft,
          end: widget.gradientEnd ?? Alignment.bottomRight,
          colors: widget.gradientColors ?? [
            Colors.blue,
            Colors.purple,
          ],
        ) : null,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: widget.borderRadius ?? BorderRadius.circular(DesignTokens.radiusMd),
        child: Stack(
          children: [
            Container(
              padding: widget.padding ?? const EdgeInsets.symmetric(
                horizontal: DesignTokens.spacingLg,
                vertical: DesignTokens.spacingMd,
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (widget.icon != null) ...[
                    Icon(
                      widget.icon,
                      color: widget.textColor ?? Colors.white,
                      size: widget.fontSize ?? 18,
                    ),
                    const SizedBox(width: DesignTokens.spacingSm),
                  ],
                  Text(
                    widget.text,
                    style: TextStyle(
                      color: widget.textColor ?? Colors.white,
                      fontSize: widget.fontSize ?? 16,
                      fontWeight: widget.fontWeight ?? FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
            if (widget.enableShimmer) _buildShimmerEffect(),
            if (widget.enableGlow) _buildGlowEffect(),
          ],
        ),
      ),
    );
  }

  Widget _buildShimmerEffect() {
    return AnimatedBuilder(
      animation: _shimmerAnimation,
      builder: (context, child) {
        return Positioned.fill(
          child: ShaderMask(
            blendMode: BlendMode.srcATop,
            shaderCallback: (bounds) {
              return LinearGradient(
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
                colors: [
                  Colors.transparent,
                  widget.shimmerColor?.withOpacity(0.3) ?? Colors.white.withOpacity(0.3),
                  Colors.transparent,
                ],
                stops: [
                  _shimmerAnimation.value - 0.3,
                  _shimmerAnimation.value,
                  _shimmerAnimation.value + 0.3,
                ].map((stop) => stop.clamp(0.0, 1.0)).toList(),
              ).createShader(bounds);
            },
            child: Container(
              color: Colors.white,
            ),
          ),
        );
      },
    );
  }

  Widget _buildGlowEffect() {
    return AnimatedBuilder(
      animation: _glowAnimation,
      builder: (context, child) {
        return Positioned.fill(
          child: Container(
            decoration: BoxDecoration(
              borderRadius: widget.borderRadius ?? BorderRadius.circular(DesignTokens.radiusMd),
              boxShadow: [
                BoxShadow(
                  color: (widget.glowColor ?? Colors.blue).withOpacity(_glowAnimation.value * 0.5),
                  blurRadius: (widget.glowRadius ?? 20) * _glowAnimation.value,
                  spreadRadius: 5 * _glowAnimation.value,
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _applyAnimations(Widget child) {
    switch (widget.animationType) {
      case 'fadeIn':
        return child.animate().fadeIn(
          duration: widget.animationDuration ?? AnimationConfig.normal,
          curve: widget.animationCurve ?? AnimationConfig.easeInOut,
        );
      case 'slideInUp':
        return child.animate().slideY(
          begin: 0.1,
          end: 0,
          duration: widget.animationDuration ?? AnimationConfig.normal,
          curve: widget.animationCurve ?? AnimationConfig.easeOut,
        );
      case 'scaleIn':
        return child.animate().scale(
          begin: const Offset(0.8, 0.8),
          end: const Offset(1.0, 1.0),
          duration: widget.animationDuration ?? AnimationConfig.normal,
          curve: widget.animationCurve ?? AnimationConfig.easeOut,
        );
      case 'bounceIn':
        return child.animate().scale(
          begin: const Offset(0.8, 0.8),
          end: const Offset(1.0, 1.0),
          duration: widget.animationDuration ?? AnimationConfig.slow,
          curve: Curves.bounceOut,
        );
      case 'elasticIn':
        return child.animate().scale(
          begin: const Offset(0.8, 0.8),
          end: const Offset(1.0, 1.0),
          duration: widget.animationDuration ?? AnimationConfig.verySlow,
          curve: Curves.elasticOut,
        );
      default:
        return child.animate().fadeIn(
          duration: widget.animationDuration ?? AnimationConfig.normal,
          curve: widget.animationCurve ?? AnimationConfig.easeInOut,
        );
    }
  }

  void _onHoverEnter(PointerEnterEvent event) {
    if (widget.enableHover && widget.onPressed != null) {
      setState(() {
        _isHovered = true;
      });
      _controller.forward();
    }
  }

  void _onHoverExit(PointerExitEvent event) {
    if (widget.enableHover) {
      setState(() {
        _isHovered = false;
      });
      _controller.reverse();
    }
  }

  void _onTapDown(TapDownDetails details) {
    if (widget.enablePress) {
      setState(() {
        _isPressed = true;
      });
      _controller.forward();
    }
  }

  void _onTapUp(TapUpDetails details) {
    if (widget.enablePress) {
      setState(() {
        _isPressed = false;
      });
      _controller.reverse();
    }
  }

  void _onTapCancel(TapCancelDetails details) {
    if (widget.enablePress) {
      setState(() {
        _isPressed = false;
      });
      _controller.reverse();
    }
  }
}

/// Modern liquid swipe component
class ModernLiquidSwipe extends StatelessWidget {
  final List<Widget> pages;
  final bool enableSwipe;
  final Duration? animationDuration;
  final Curve? animationCurve;
  final bool enableParallax;
  final double? parallaxOffset;
  final bool enableGlow;
  final Color? glowColor;
  final double? glowRadius;
  final bool enableShimmer;
  final Color? shimmerColor;
  final Duration? shimmerDuration;
  final bool enableAnimation;
  final String? animationType;

  const ModernLiquidSwipe({
    super.key,
    required this.pages,
    this.enableSwipe = true,
    this.animationDuration,
    this.animationCurve,
    this.enableParallax = false,
    this.parallaxOffset,
    this.enableGlow = false,
    this.glowColor,
    this.glowRadius,
    this.enableShimmer = false,
    this.shimmerColor,
    this.shimmerDuration,
    this.enableAnimation = true,
    this.animationType,
  });

  @override
  Widget build(BuildContext context) {
    Widget liquidSwipe = LiquidSwipe(
      pages: pages,
      enableSlideIcon: enableSwipe,
      slideIconWidget: const Icon(Icons.arrow_back_ios),
      positionSlideIcon: 0.5,
      waveType: WaveType.liquidReveal,
      onPageChangeCallback: (page) {
        // Handle page change if needed
      },
    );

    // Parallax functionality removed due to dependency issues

    if (enableAnimation) {
      liquidSwipe = _applyAnimations(liquidSwipe);
    }

    return liquidSwipe;
  }

  Widget _applyAnimations(Widget child) {
    switch (animationType) {
      case 'fadeIn':
        return child.animate().fadeIn(
          duration: animationDuration ?? AnimationConfig.normal,
          curve: animationCurve ?? AnimationConfig.easeInOut,
        );
      case 'slideInUp':
        return child.animate().slideY(
          begin: 0.1,
          end: 0,
          duration: animationDuration ?? AnimationConfig.normal,
          curve: animationCurve ?? AnimationConfig.easeOut,
        );
      case 'scaleIn':
        return child.animate().scale(
          begin: const Offset(0.8, 0.8),
          end: const Offset(1.0, 1.0),
          duration: animationDuration ?? AnimationConfig.normal,
          curve: animationCurve ?? AnimationConfig.easeOut,
        );
      default:
        return child.animate().fadeIn(
          duration: animationDuration ?? AnimationConfig.normal,
          curve: animationCurve ?? AnimationConfig.easeInOut,
        );
    }
  }
}

// Modern parallax component removed due to dependency issues
