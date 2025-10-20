import 'package:flutter/material.dart';
import 'package:simple_animations/simple_animations.dart';
import '../../config/design_tokens.dart';
import '../../config/animation_config.dart';
import '../ui/app_card.dart';

/// Animated card with hover and press effects
class AnimatedCard extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  final Color? backgroundColor;
  final Color? hoverColor;
  final Color? pressedColor;
  final double? elevation;
  final double? hoverElevation;
  final double? pressedElevation;
  final BorderRadius? borderRadius;
  final EdgeInsets? padding;
  final EdgeInsets? margin;
  final Duration? animationDuration;
  final Curve? animationCurve;
  final double? scaleOnHover;
  final double? scaleOnPress;
  final bool enableHover;
  final bool enablePress;
  final bool enableShimmer;
  final bool enablePulse;
  final String? tooltip;

  const AnimatedCard({
    super.key,
    required this.child,
    this.onTap,
    this.backgroundColor,
    this.hoverColor,
    this.pressedColor,
    this.elevation,
    this.hoverElevation,
    this.pressedElevation,
    this.borderRadius,
    this.padding,
    this.margin,
    this.animationDuration,
    this.animationCurve,
    this.scaleOnHover = 1.02,
    this.scaleOnPress = 0.98,
    this.enableHover = true,
    this.enablePress = true,
    this.enableShimmer = false,
    this.enablePulse = false,
    this.tooltip,
  });

  @override
  State<AnimatedCard> createState() => _AnimatedCardState();
}

class _AnimatedCardState extends State<AnimatedCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _elevationAnimation;
  late Animation<Color?> _colorAnimation;
  late Animation<double> _shimmerAnimation;
  late Animation<double> _pulseAnimation;
  
  bool _isPressed = false;
  bool _isHovered = false;

  @override
  void initState() {
    super.initState();
    _setupAnimations();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _setupAnimations() {
    _controller = AnimationController(
      duration: widget.animationDuration ?? AnimationConfig.hoverDuration,
      vsync: this,
    );

    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: widget.scaleOnHover ?? 1.02,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));

    _elevationAnimation = Tween<double>(
      begin: widget.elevation ?? 2.0,
      end: widget.hoverElevation ?? (widget.elevation ?? 2.0) * 1.5,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));

    _colorAnimation = ColorTween(
      begin: widget.backgroundColor,
      end: widget.hoverColor,
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

    _pulseAnimation = Tween<double>(
      begin: 0.8,
      end: 1.2,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));
  }

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: widget.tooltip ?? '',
      child: MouseRegion(
        onEnter: widget.enableHover ? _onHoverEnter : null,
        onExit: widget.enableHover ? _onHoverExit : null,
        child: GestureDetector(
          onTapDown: widget.enablePress ? _onTapDown : null,
          onTapUp: widget.enablePress ? _onTapUp : null,
          onTapCancel: widget.enablePress ? _onTapCancel : null,
          onTap: widget.onTap,
          child: AnimatedBuilder(
            animation: _controller,
            builder: (context, child) {
              return Transform.scale(
                scale: _isPressed 
                    ? (widget.scaleOnPress ?? 0.98)
                    : _scaleAnimation.value,
                child: _buildCard(),
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _buildCard() {
    return Container(
      margin: widget.margin,
      child: Material(
        elevation: _elevationAnimation.value,
        borderRadius: widget.borderRadius ?? BorderRadius.circular(DesignTokens.radiusMd),
        color: _colorAnimation.value ?? widget.backgroundColor,
        child: InkWell(
          borderRadius: widget.borderRadius ?? BorderRadius.circular(DesignTokens.radiusMd),
          onTap: widget.onTap,
          child: Container(
            padding: widget.padding ?? const EdgeInsets.all(DesignTokens.spacingMd),
            child: Stack(
              children: [
                widget.child,
                if (widget.enableShimmer) _buildShimmerEffect(),
                if (widget.enablePulse) _buildPulseEffect(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildShimmerEffect() {
    return Positioned.fill(
      child: ShaderMask(
        blendMode: BlendMode.srcATop,
        shaderCallback: (bounds) {
          return LinearGradient(
            begin: Alignment.centerLeft,
            end: Alignment.centerRight,
            colors: [
              Colors.transparent,
              Colors.white.withOpacity(0.3),
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
  }

  Widget _buildPulseEffect() {
    return Positioned.fill(
      child: Transform.scale(
        scale: _pulseAnimation.value,
        child: Container(
          decoration: BoxDecoration(
            borderRadius: widget.borderRadius ?? BorderRadius.circular(DesignTokens.radiusMd),
            border: Border.all(
              color: Colors.white.withOpacity(0.3),
              width: 2,
            ),
          ),
        ),
      ),
    );
  }

  void _onHoverEnter(PointerEnterEvent event) {
    if (widget.enableHover && widget.onTap != null) {
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

/// Animated container with various effects
class AnimatedContainer extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  final Color? backgroundColor;
  final Color? hoverColor;
  final Color? pressedColor;
  final double? width;
  final double? height;
  final EdgeInsets? padding;
  final EdgeInsets? margin;
  final BorderRadius? borderRadius;
  final BoxBorder? border;
  final List<BoxShadow>? boxShadow;
  final Duration? animationDuration;
  final Curve? animationCurve;
  final double? scaleOnHover;
  final double? scaleOnPress;
  final bool enableHover;
  final bool enablePress;
  final bool enableRotation;
  final bool enableBounce;
  final String? tooltip;

  const AnimatedContainer({
    super.key,
    required this.child,
    this.onTap,
    this.backgroundColor,
    this.hoverColor,
    this.pressedColor,
    this.width,
    this.height,
    this.padding,
    this.margin,
    this.borderRadius,
    this.border,
    this.boxShadow,
    this.animationDuration,
    this.animationCurve,
    this.scaleOnHover = 1.05,
    this.scaleOnPress = 0.95,
    this.enableHover = true,
    this.enablePress = true,
    this.enableRotation = false,
    this.enableBounce = false,
    this.tooltip,
  });

  @override
  State<AnimatedContainer> createState() => _AnimatedContainerState();
}

class _AnimatedContainerState extends State<AnimatedContainer>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _rotationAnimation;
  late Animation<Color?> _colorAnimation;
  late Animation<double> _bounceAnimation;
  
  bool _isPressed = false;
  bool _isHovered = false;

  @override
  void initState() {
    super.initState();
    _setupAnimations();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _setupAnimations() {
    _controller = AnimationController(
      duration: widget.animationDuration ?? AnimationConfig.hoverDuration,
      vsync: this,
    );

    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: widget.scaleOnHover ?? 1.05,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));

    _rotationAnimation = Tween<double>(
      begin: 0.0,
      end: widget.enableRotation ? 0.1 : 0.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));

    _colorAnimation = ColorTween(
      begin: widget.backgroundColor,
      end: widget.hoverColor,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));

    _bounceAnimation = Tween<double>(
      begin: 0.0,
      end: widget.enableBounce ? 0.1 : 0.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.elasticOut,
    ));
  }

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: widget.tooltip ?? '',
      child: MouseRegion(
        onEnter: widget.enableHover ? _onHoverEnter : null,
        onExit: widget.enableHover ? _onHoverExit : null,
        child: GestureDetector(
          onTapDown: widget.enablePress ? _onTapDown : null,
          onTapUp: widget.enablePress ? _onTapUp : null,
          onTapCancel: widget.enablePress ? _onTapCancel : null,
          onTap: widget.onTap,
          child: AnimatedBuilder(
            animation: _controller,
            builder: (context, child) {
              return Transform.scale(
                scale: _isPressed 
                    ? (widget.scaleOnPress ?? 0.95)
                    : _scaleAnimation.value,
                child: Transform.rotate(
                  angle: _rotationAnimation.value,
                  child: Transform.translate(
                    offset: Offset(0, _bounceAnimation.value * 10),
                    child: _buildContainer(),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _buildContainer() {
    return Container(
      width: widget.width,
      height: widget.height,
      padding: widget.padding,
      margin: widget.margin,
      decoration: BoxDecoration(
        color: _colorAnimation.value ?? widget.backgroundColor,
        borderRadius: widget.borderRadius,
        border: widget.border,
        boxShadow: widget.boxShadow,
      ),
      child: widget.child,
    );
  }

  void _onHoverEnter(PointerEnterEvent event) {
    if (widget.enableHover && widget.onTap != null) {
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

/// Animated list tile with hover effects
class AnimatedListTile extends StatefulWidget {
  final Widget? leading;
  final Widget? title;
  final Widget? subtitle;
  final Widget? trailing;
  final VoidCallback? onTap;
  final Color? backgroundColor;
  final Color? hoverColor;
  final Color? pressedColor;
  final EdgeInsets? contentPadding;
  final Duration? animationDuration;
  final Curve? animationCurve;
  final double? scaleOnHover;
  final double? scaleOnPress;
  final bool enableHover;
  final bool enablePress;
  final bool enableSlide;
  final String? tooltip;

  const AnimatedListTile({
    super.key,
    this.leading,
    this.title,
    this.subtitle,
    this.trailing,
    this.onTap,
    this.backgroundColor,
    this.hoverColor,
    this.pressedColor,
    this.contentPadding,
    this.animationDuration,
    this.animationCurve,
    this.scaleOnHover = 1.02,
    this.scaleOnPress = 0.98,
    this.enableHover = true,
    this.enablePress = true,
    this.enableSlide = true,
    this.tooltip,
  });

  @override
  State<AnimatedListTile> createState() => _AnimatedListTileState();
}

class _AnimatedListTileState extends State<AnimatedListTile>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<Offset> _slideAnimation;
  late Animation<Color?> _colorAnimation;
  
  bool _isPressed = false;
  bool _isHovered = false;

  @override
  void initState() {
    super.initState();
    _setupAnimations();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _setupAnimations() {
    _controller = AnimationController(
      duration: widget.animationDuration ?? AnimationConfig.hoverDuration,
      vsync: this,
    );

    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: widget.scaleOnHover ?? 1.02,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));

    _slideAnimation = Tween<Offset>(
      begin: Offset.zero,
      end: widget.enableSlide ? const Offset(0.1, 0) : Offset.zero,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));

    _colorAnimation = ColorTween(
      begin: widget.backgroundColor,
      end: widget.hoverColor,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));
  }

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: widget.tooltip ?? '',
      child: MouseRegion(
        onEnter: widget.enableHover ? _onHoverEnter : null,
        onExit: widget.enableHover ? _onHoverExit : null,
        child: GestureDetector(
          onTapDown: widget.enablePress ? _onTapDown : null,
          onTapUp: widget.enablePress ? _onTapUp : null,
          onTapCancel: widget.enablePress ? _onTapCancel : null,
          onTap: widget.onTap,
          child: AnimatedBuilder(
            animation: _controller,
            builder: (context, child) {
              return Transform.scale(
                scale: _isPressed 
                    ? (widget.scaleOnPress ?? 0.98)
                    : _scaleAnimation.value,
                child: Transform.translate(
                  offset: _slideAnimation.value * 10,
                  child: _buildListTile(),
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _buildListTile() {
    return Container(
      color: _colorAnimation.value ?? widget.backgroundColor,
      child: ListTile(
        leading: widget.leading,
        title: widget.title,
        subtitle: widget.subtitle,
        trailing: widget.trailing,
        contentPadding: widget.contentPadding,
        onTap: widget.onTap,
      ),
    );
  }

  void _onHoverEnter(PointerEnterEvent event) {
    if (widget.enableHover && widget.onTap != null) {
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


