import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:animate_do/animate_do.dart';
import '../../config/design_tokens.dart';
import '../../config/animation_config.dart';

/// Animated floating action button
class AnimatedFloatingActionButton extends StatefulWidget {
  final VoidCallback? onPressed;
  final IconData icon;
  final String? tooltip;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final double? elevation;
  final bool enableAnimation;
  final Duration? animationDuration;
  final Curve? animationCurve;
  final String? animationType;
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

  const AnimatedFloatingActionButton({
    super.key,
    this.onPressed,
    required this.icon,
    this.tooltip,
    this.backgroundColor,
    this.foregroundColor,
    this.elevation,
    this.enableAnimation = true,
    this.animationDuration,
    this.animationCurve,
    this.animationType,
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
  });

  @override
  State<AnimatedFloatingActionButton> createState() => _AnimatedFloatingActionButtonState();
}

class _AnimatedFloatingActionButtonState extends State<AnimatedFloatingActionButton>
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
      end: widget.scaleFactor ?? 0.9,
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
    Widget fab = _buildFloatingActionButton();

    if (widget.enableAnimation) {
      fab = _applyAnimations(fab);
    }

    return MouseRegion(
      onEnter: widget.enableHover ? _onHoverEnter : null,
      onExit: widget.enableHover ? _onHoverExit : null,
      child: GestureDetector(
        onTapDown: widget.enablePress ? _onTapDown : null,
        onTapUp: widget.enablePress ? _onTapUp : null,
        onTapCancel: widget.enablePress ? _onTapCancel : null,
        onTap: widget.onPressed,
        child: fab,
      ),
    );
  }

  Widget _buildFloatingActionButton() {
    return Container(
      width: 56,
      height: 56,
      decoration: BoxDecoration(
        color: widget.backgroundColor ?? Theme.of(context).colorScheme.primary,
        borderRadius: BorderRadius.circular(28),
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
            color: Colors.black.withOpacity(0.2),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(28),
        child: Stack(
          children: [
            Container(
              child: Icon(
                widget.icon,
                color: widget.foregroundColor ?? Colors.white,
                size: 24,
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
              borderRadius: BorderRadius.circular(28),
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
      case 'rotateIn':
        return child.animate().rotate(
          begin: 0.1,
          end: 0,
          duration: widget.animationDuration ?? AnimationConfig.normal,
          curve: widget.animationCurve ?? AnimationConfig.easeOut,
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

/// Animated icon button
class AnimatedIconButton extends StatefulWidget {
  final VoidCallback? onPressed;
  final IconData icon;
  final String? tooltip;
  final Color? color;
  final Color? backgroundColor;
  final double? size;
  final double? iconSize;
  final bool enableAnimation;
  final Duration? animationDuration;
  final Curve? animationCurve;
  final String? animationType;
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

  const AnimatedIconButton({
    super.key,
    this.onPressed,
    required this.icon,
    this.tooltip,
    this.color,
    this.backgroundColor,
    this.size = 48,
    this.iconSize = 24,
    this.enableAnimation = true,
    this.animationDuration,
    this.animationCurve,
    this.animationType,
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
  });

  @override
  State<AnimatedIconButton> createState() => _AnimatedIconButtonState();
}

class _AnimatedIconButtonState extends State<AnimatedIconButton>
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
      end: widget.scaleFactor ?? 0.9,
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
    Widget iconButton = _buildIconButton();

    if (widget.enableAnimation) {
      iconButton = _applyAnimations(iconButton);
    }

    return MouseRegion(
      onEnter: widget.enableHover ? _onHoverEnter : null,
      onExit: widget.enableHover ? _onHoverExit : null,
      child: GestureDetector(
        onTapDown: widget.enablePress ? _onTapDown : null,
        onTapUp: widget.enablePress ? _onTapUp : null,
        onTapCancel: widget.enablePress ? _onTapCancel : null,
        onTap: widget.onPressed,
        child: iconButton,
      ),
    );
  }

  Widget _buildIconButton() {
    return Container(
      width: widget.size,
      height: widget.size,
      decoration: BoxDecoration(
        color: widget.backgroundColor,
        borderRadius: BorderRadius.circular(widget.size / 2),
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
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(widget.size / 2),
        child: Stack(
          children: [
            Container(
              child: Icon(
                widget.icon,
                color: widget.color ?? Theme.of(context).colorScheme.onSurface,
                size: widget.iconSize,
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
              borderRadius: BorderRadius.circular(widget.size / 2),
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
      case 'rotateIn':
        return child.animate().rotate(
          begin: 0.1,
          end: 0,
          duration: widget.animationDuration ?? AnimationConfig.normal,
          curve: widget.animationCurve ?? AnimationConfig.easeOut,
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

/// Animated text widget
class AnimatedText extends StatelessWidget {
  final String text;
  final TextStyle? style;
  final TextAlign? textAlign;
  final int? maxLines;
  final TextOverflow? overflow;
  final bool enableAnimation;
  final Duration? animationDuration;
  final Curve? animationCurve;
  final String? animationType;
  final bool enableShimmer;
  final Color? shimmerColor;
  final Duration? shimmerDuration;
  final bool enableGlow;
  final Color? glowColor;
  final double? glowRadius;
  final bool enableGradient;
  final List<Color>? gradientColors;
  final Alignment? gradientBegin;
  final Alignment? gradientEnd;

  const AnimatedText({
    super.key,
    required this.text,
    this.style,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.enableAnimation = true,
    this.animationDuration,
    this.animationCurve,
    this.animationType,
    this.enableShimmer = false,
    this.shimmerColor,
    this.shimmerDuration,
    this.enableGlow = false,
    this.glowColor,
    this.glowRadius,
    this.enableGradient = false,
    this.gradientColors,
    this.gradientBegin,
    this.gradientEnd,
  });

  @override
  Widget build(BuildContext context) {
    Widget textWidget = _buildText();

    if (enableAnimation) {
      textWidget = _applyAnimations(textWidget);
    }

    return textWidget;
  }

  Widget _buildText() {
    if (enableGradient) {
      return ShaderMask(
        shaderCallback: (bounds) {
          return LinearGradient(
            begin: gradientBegin ?? Alignment.topLeft,
            end: gradientEnd ?? Alignment.bottomRight,
            colors: gradientColors ?? [
              Colors.blue,
              Colors.purple,
            ],
          ).createShader(bounds);
        },
        child: Text(
          text,
          style: style,
          textAlign: textAlign,
          maxLines: maxLines,
          overflow: overflow,
        ),
      );
    }

    return Text(
      text,
      style: style,
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
    );
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
      case 'bounceIn':
        return child.animate().scale(
          begin: const Offset(0.8, 0.8),
          end: const Offset(1.0, 1.0),
          duration: animationDuration ?? AnimationConfig.slow,
          curve: Curves.bounceOut,
        );
      case 'elasticIn':
        return child.animate().scale(
          begin: const Offset(0.8, 0.8),
          end: const Offset(1.0, 1.0),
          duration: animationDuration ?? AnimationConfig.verySlow,
          curve: Curves.elasticOut,
        );
      case 'rotateIn':
        return child.animate().rotate(
          begin: 0.1,
          end: 0,
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


