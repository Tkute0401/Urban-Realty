import 'package:flutter/material.dart';
import 'package:simple_animations/simple_animations.dart';
import '../../config/design_tokens.dart';
import '../../config/animation_config.dart';
import '../ui/app_button.dart';

/// Animated button with micro-interactions
class AnimatedButton extends StatefulWidget {
  final String text;
  final VoidCallback? onPressed;
  final AppButtonVariant variant;
  final AppButtonSize size;
  final bool fullWidth;
  final bool isLoading;
  final IconData? icon;
  final Color? backgroundColor;
  final Color? textColor;
  final Duration? animationDuration;
  final Curve? animationCurve;
  final double? scaleOnPress;
  final double? scaleOnHover;
  final bool enableHover;
  final bool enablePress;
  final String? tooltip;

  const AnimatedButton({
    super.key,
    required this.text,
    this.onPressed,
    this.variant = AppButtonVariant.primary,
    this.size = AppButtonSize.medium,
    this.fullWidth = false,
    this.isLoading = false,
    this.icon,
    this.backgroundColor,
    this.textColor,
    this.animationDuration,
    this.animationCurve,
    this.scaleOnPress = 0.95,
    this.scaleOnHover = 1.05,
    this.enableHover = true,
    this.enablePress = true,
    this.tooltip,
  });

  @override
  State<AnimatedButton> createState() => _AnimatedButtonState();
}

class _AnimatedButtonState extends State<AnimatedButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;
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
      duration: widget.animationDuration ?? AnimationConfig.microNormal,
      vsync: this,
    );

    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: widget.scaleOnPress ?? 0.95,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));

    _opacityAnimation = Tween<double>(
      begin: 1.0,
      end: 0.8,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));

    _colorAnimation = ColorTween(
      begin: widget.backgroundColor,
      end: widget.backgroundColor?.withOpacity(0.8),
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
          onTap: widget.onPressed,
          child: AnimatedBuilder(
            animation: _controller,
            builder: (context, child) {
              return Transform.scale(
                scale: _isHovered 
                    ? (widget.scaleOnHover ?? 1.05)
                    : _scaleAnimation.value,
                child: Opacity(
                  opacity: _opacityAnimation.value,
                  child: _buildButton(),
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _buildButton() {
    return AppButton(
      text: widget.text,
      onPressed: widget.onPressed,
      variant: widget.variant,
      size: widget.size,
      fullWidth: widget.fullWidth,
      isLoading: widget.isLoading,
      icon: widget.icon,
      backgroundColor: _colorAnimation.value ?? widget.backgroundColor,
      textColor: widget.textColor,
    );
  }

  void _onHoverEnter(PointerEnterEvent event) {
    if (widget.enableHover && widget.onPressed != null) {
      setState(() {
        _isHovered = true;
      });
    }
  }

  void _onHoverExit(PointerExitEvent event) {
    if (widget.enableHover) {
      setState(() {
        _isHovered = false;
      });
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

/// Animated floating action button
class AnimatedFloatingActionButton extends StatefulWidget {
  final VoidCallback? onPressed;
  final IconData icon;
  final String? tooltip;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final double? elevation;
  final Duration? animationDuration;
  final Curve? animationCurve;
  final double? scaleOnPress;
  final bool enableHover;
  final bool enablePress;

  const AnimatedFloatingActionButton({
    super.key,
    this.onPressed,
    required this.icon,
    this.tooltip,
    this.backgroundColor,
    this.foregroundColor,
    this.elevation,
    this.animationDuration,
    this.animationCurve,
    this.scaleOnPress = 0.9,
    this.enableHover = true,
    this.enablePress = true,
  });

  @override
  State<AnimatedFloatingActionButton> createState() => _AnimatedFloatingActionButtonState();
}

class _AnimatedFloatingActionButtonState extends State<AnimatedFloatingActionButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _rotationAnimation;
  late Animation<double> _elevationAnimation;
  
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
      duration: widget.animationDuration ?? AnimationConfig.microNormal,
      vsync: this,
    );

    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: widget.scaleOnPress ?? 0.9,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));

    _rotationAnimation = Tween<double>(
      begin: 0.0,
      end: 0.1,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));

    _elevationAnimation = Tween<double>(
      begin: widget.elevation ?? 6.0,
      end: (widget.elevation ?? 6.0) * 0.5,
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
          onTap: widget.onPressed,
          child: AnimatedBuilder(
            animation: _controller,
            builder: (context, child) {
              return Transform.scale(
                scale: _isHovered ? 1.1 : _scaleAnimation.value,
                child: Transform.rotate(
                  angle: _rotationAnimation.value,
                  child: Material(
                    elevation: _elevationAnimation.value,
                    borderRadius: BorderRadius.circular(28),
                    color: widget.backgroundColor ?? Theme.of(context).primaryColor,
                    child: InkWell(
                      borderRadius: BorderRadius.circular(28),
                      onTap: widget.onPressed,
                      child: Container(
                        width: 56,
                        height: 56,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(28),
                        ),
                        child: Icon(
                          widget.icon,
                          color: widget.foregroundColor ?? Colors.white,
                          size: 24,
                        ),
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  void _onHoverEnter(PointerEnterEvent event) {
    if (widget.enableHover && widget.onPressed != null) {
      setState(() {
        _isHovered = true;
      });
    }
  }

  void _onHoverExit(PointerExitEvent event) {
    if (widget.enableHover) {
      setState(() {
        _isHovered = false;
      });
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
  final Duration? animationDuration;
  final Curve? animationCurve;
  final double? scaleOnPress;
  final bool enableHover;
  final bool enablePress;
  final bool enableRotation;

  const AnimatedIconButton({
    super.key,
    this.onPressed,
    required this.icon,
    this.tooltip,
    this.color,
    this.backgroundColor,
    this.size = 48,
    this.iconSize = 24,
    this.animationDuration,
    this.animationCurve,
    this.scaleOnPress = 0.9,
    this.enableHover = true,
    this.enablePress = true,
    this.enableRotation = false,
  });

  @override
  State<AnimatedIconButton> createState() => _AnimatedIconButtonState();
}

class _AnimatedIconButtonState extends State<AnimatedIconButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _rotationAnimation;
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
      duration: widget.animationDuration ?? AnimationConfig.microNormal,
      vsync: this,
    );

    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: widget.scaleOnPress ?? 0.9,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));

    _rotationAnimation = Tween<double>(
      begin: 0.0,
      end: widget.enableRotation ? 0.5 : 0.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));

    _colorAnimation = ColorTween(
      begin: widget.color,
      end: widget.color?.withOpacity(0.7),
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
          onTap: widget.onPressed,
          child: AnimatedBuilder(
            animation: _controller,
            builder: (context, child) {
              return Transform.scale(
                scale: _isHovered ? 1.1 : _scaleAnimation.value,
                child: Transform.rotate(
                  angle: _rotationAnimation.value,
                  child: Container(
                    width: widget.size,
                    height: widget.size,
                    decoration: BoxDecoration(
                      color: widget.backgroundColor,
                      borderRadius: BorderRadius.circular(widget.size / 2),
                    ),
                    child: Icon(
                      widget.icon,
                      color: _colorAnimation.value ?? widget.color,
                      size: widget.iconSize,
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  void _onHoverEnter(PointerEnterEvent event) {
    if (widget.enableHover && widget.onPressed != null) {
      setState(() {
        _isHovered = true;
      });
    }
  }

  void _onHoverExit(PointerExitEvent event) {
    if (widget.enableHover) {
      setState(() {
        _isHovered = false;
      });
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


