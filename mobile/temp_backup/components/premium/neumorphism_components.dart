import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../config/design_tokens.dart';
import '../../config/animation_config.dart';

/// Neumorphism card component
class NeumorphismCard extends StatelessWidget {
  final Widget child;
  final double? width;
  final double? height;
  final EdgeInsets? padding;
  final EdgeInsets? margin;
  final BorderRadius? borderRadius;
  final NeumorphismStyle? style;
  final bool enableAnimation;
  final Duration? animationDuration;
  final Curve? animationCurve;
  final bool enableHover;
  final bool enablePress;

  const NeumorphismCard({
    super.key,
    required this.child,
    this.width,
    this.height,
    this.padding,
    this.margin,
    this.borderRadius,
    this.style,
    this.enableAnimation = true,
    this.animationDuration,
    this.animationCurve,
    this.enableHover = true,
    this.enablePress = true,
  });

  @override
  Widget build(BuildContext context) {
    final card = Container(
      width: width,
      height: height,
      margin: margin,
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: borderRadius ?? BorderRadius.circular(DesignTokens.radiusLg),
        boxShadow: [
          BoxShadow(
            color: Colors.grey[800]!.withOpacity(0.3),
            blurRadius: 8,
            offset: const Offset(4, 4),
          ),
          BoxShadow(
            color: Colors.white.withOpacity(0.3),
            blurRadius: 8,
            offset: const Offset(-4, -4),
          ),
        ],
      ),
      child: Container(
        padding: padding ?? const EdgeInsets.all(DesignTokens.spacingLg),
        child: child,
      ),
    );

    if (enableAnimation) {
      return card.animate().fadeIn(
        duration: animationDuration ?? AnimationConfig.normal,
        curve: animationCurve ?? AnimationConfig.easeInOut,
      ).slideY(
        begin: 0.1,
        end: 0,
        duration: animationDuration ?? AnimationConfig.normal,
        curve: animationCurve ?? AnimationConfig.easeOut,
      );
    }

    return card;
  }
}

/// Neumorphism button component
class NeumorphismButton extends StatefulWidget {
  final String text;
  final VoidCallback? onPressed;
  final IconData? icon;
  final double? width;
  final double? height;
  final EdgeInsets? padding;
  final BorderRadius? borderRadius;
  final BoxDecoration? style;
  final BoxDecoration? pressedStyle;
  final Color? textColor;
  final double? fontSize;
  final FontWeight? fontWeight;
  final bool enableAnimation;
  final Duration? animationDuration;
  final Curve? animationCurve;
  final bool enableHover;
  final bool enablePress;

  const NeumorphismButton({
    super.key,
    required this.text,
    this.onPressed,
    this.icon,
    this.width,
    this.height,
    this.padding,
    this.borderRadius,
    this.style,
    this.pressedStyle,
    this.textColor,
    this.fontSize,
    this.fontWeight,
    this.enableAnimation = true,
    this.animationDuration,
    this.animationCurve,
    this.enableHover = true,
    this.enablePress = true,
  });

  @override
  State<NeumorphismButton> createState() => _NeumorphismButtonState();
}

class _NeumorphismButtonState extends State<NeumorphismButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _depthAnimation;
  bool _isPressed = false;
  bool _isHovered = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: widget.animationDuration ?? AnimationConfig.microNormal,
      vsync: this,
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.95,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));
    _depthAnimation = Tween<double>(
      begin: 8.0,
      end: 4.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
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
              scale: _isHovered ? 1.05 : _scaleAnimation.value,
              child: _buildButton(),
            );
          },
        ),
      ),
    );
  }

  Widget _buildButton() {
    final currentStyle = _isPressed 
        ? (widget.pressedStyle ?? _getPressedStyle())
        : (widget.style ?? _getDefaultStyle());

    return Neumorphism(
      style: currentStyle,
      child: Container(
        width: widget.width ?? double.infinity,
        height: widget.height ?? 56,
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
                color: widget.textColor ?? Theme.of(context).colorScheme.onSurface,
                size: widget.fontSize ?? 18,
              ),
              const SizedBox(width: DesignTokens.spacingSm),
            ],
            Text(
              widget.text,
              style: TextStyle(
                color: widget.textColor ?? Theme.of(context).colorScheme.onSurface,
                fontSize: widget.fontSize ?? 16,
                fontWeight: widget.fontWeight ?? FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  NeumorphismStyle _getDefaultStyle() {
    return NeumorphismStyle(
      depth: 8,
      intensity: 0.5,
      surfaceIntensity: 0.5,
      shape: NeumorphismShape.flat,
      lightSource: LightSource.topLeft,
      color: Theme.of(context).colorScheme.surface,
      shadowDarkColor: Colors.grey[800]!,
      shadowLightColor: Colors.white,
    );
  }

  NeumorphismStyle _getPressedStyle() {
    return NeumorphismStyle(
      depth: 4,
      intensity: 0.3,
      surfaceIntensity: 0.3,
      shape: NeumorphismShape.flat,
      lightSource: LightSource.topLeft,
      color: Theme.of(context).colorScheme.surface,
      shadowDarkColor: Colors.grey[800]!,
      shadowLightColor: Colors.white,
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

/// Neumorphism input field component
class NeumorphismInputField extends StatefulWidget {
  final String? hintText;
  final String? labelText;
  final TextEditingController? controller;
  final String? Function(String?)? validator;
  final void Function(String)? onChanged;
  final void Function(String)? onSubmitted;
  final TextInputType? keyboardType;
  final bool obscureText;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final int? maxLines;
  final int? maxLength;
  final bool enabled;
  final double? width;
  final double? height;
  final EdgeInsets? padding;
  final BorderRadius? borderRadius;
  final NeumorphismStyle? style;
  final NeumorphismStyle? focusedStyle;
  final Color? textColor;
  final Color? hintColor;
  final double? fontSize;
  final bool enableAnimation;
  final Duration? animationDuration;
  final Curve? animationCurve;

  const NeumorphismInputField({
    super.key,
    this.hintText,
    this.labelText,
    this.controller,
    this.validator,
    this.onChanged,
    this.onSubmitted,
    this.keyboardType,
    this.obscureText = false,
    this.prefixIcon,
    this.suffixIcon,
    this.maxLines = 1,
    this.maxLength,
    this.enabled = true,
    this.width,
    this.height,
    this.padding,
    this.borderRadius,
    this.style,
    this.focusedStyle,
    this.textColor,
    this.hintColor,
    this.fontSize,
    this.enableAnimation = true,
    this.animationDuration,
    this.animationCurve,
  });

  @override
  State<NeumorphismInputField> createState() => _NeumorphismInputFieldState();
}

class _NeumorphismInputFieldState extends State<NeumorphismInputField>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _focusAnimation;
  late FocusNode _focusNode;
  bool _isFocused = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: widget.animationDuration ?? AnimationConfig.normal,
      vsync: this,
    );
    _focusAnimation = Tween<double>(
      begin: 1.0,
      end: 1.02,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeOut,
    ));
    _focusNode = FocusNode();
    _focusNode.addListener(_onFocusChange);
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _onFocusChange() {
    setState(() {
      _isFocused = _focusNode.hasFocus;
    });
    if (_isFocused) {
      _controller.forward();
    } else {
      _controller.reverse();
    }
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Transform.scale(
          scale: _focusAnimation.value,
          child: _buildInputField(),
        );
      },
    );
  }

  Widget _buildInputField() {
    final currentStyle = _isFocused 
        ? (widget.focusedStyle ?? _getFocusedStyle())
        : (widget.style ?? _getDefaultStyle());

    return Neumorphism(
      style: currentStyle,
      child: Container(
        width: widget.width ?? double.infinity,
        height: widget.height ?? 56,
        padding: widget.padding ?? const EdgeInsets.symmetric(
          horizontal: DesignTokens.spacingLg,
          vertical: DesignTokens.spacingMd,
        ),
        child: TextFormField(
          controller: widget.controller,
          focusNode: _focusNode,
          validator: widget.validator,
          onChanged: widget.onChanged,
          onFieldSubmitted: widget.onSubmitted,
          keyboardType: widget.keyboardType,
          obscureText: widget.obscureText,
          maxLines: widget.maxLines,
          maxLength: widget.maxLength,
          enabled: widget.enabled,
          style: TextStyle(
            color: widget.textColor ?? Theme.of(context).colorScheme.onSurface,
            fontSize: widget.fontSize ?? 16,
          ),
          decoration: InputDecoration(
            hintText: widget.hintText,
            labelText: widget.labelText,
            prefixIcon: widget.prefixIcon,
            suffixIcon: widget.suffixIcon,
            border: InputBorder.none,
            hintStyle: TextStyle(
              color: widget.hintColor ?? Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
              fontSize: widget.fontSize ?? 16,
            ),
            labelStyle: TextStyle(
              color: widget.hintColor ?? Theme.of(context).colorScheme.onSurface.withOpacity(0.8),
              fontSize: widget.fontSize ?? 16,
            ),
          ),
        ),
      ),
    );
  }

  NeumorphismStyle _getDefaultStyle() {
    return NeumorphismStyle(
      depth: 8,
      intensity: 0.5,
      surfaceIntensity: 0.5,
      shape: NeumorphismShape.flat,
      lightSource: LightSource.topLeft,
      color: Theme.of(context).colorScheme.surface,
      shadowDarkColor: Colors.grey[800]!,
      shadowLightColor: Colors.white,
    );
  }

  NeumorphismStyle _getFocusedStyle() {
    return NeumorphismStyle(
      depth: 12,
      intensity: 0.7,
      surfaceIntensity: 0.7,
      shape: NeumorphismShape.flat,
      lightSource: LightSource.topLeft,
      color: Theme.of(context).colorScheme.surface,
      shadowDarkColor: Colors.grey[800]!,
      shadowLightColor: Colors.white,
    );
  }
}

/// Neumorphism container component
class NeumorphismContainer extends StatelessWidget {
  final Widget child;
  final double? width;
  final double? height;
  final EdgeInsets? padding;
  final EdgeInsets? margin;
  final BorderRadius? borderRadius;
  final NeumorphismStyle? style;
  final bool enableAnimation;
  final Duration? animationDuration;
  final Curve? animationCurve;

  const NeumorphismContainer({
    super.key,
    required this.child,
    this.width,
    this.height,
    this.padding,
    this.margin,
    this.borderRadius,
    this.style,
    this.enableAnimation = true,
    this.animationDuration,
    this.animationCurve,
  });

  @override
  Widget build(BuildContext context) {
    final container = Container(
      width: width,
      height: height,
      margin: margin,
      child: Neumorphism(
        style: style ?? NeumorphismStyle(
          depth: 8,
          intensity: 0.5,
          surfaceIntensity: 0.5,
          shape: NeumorphismShape.flat,
          lightSource: LightSource.topLeft,
          color: Theme.of(context).colorScheme.surface,
          shadowDarkColor: Colors.grey[800]!,
          shadowLightColor: Colors.white,
        ),
        child: Container(
          padding: padding ?? const EdgeInsets.all(DesignTokens.spacingLg),
          child: child,
        ),
      ),
    );

    if (enableAnimation) {
      return container.animate().fadeIn(
        duration: animationDuration ?? AnimationConfig.normal,
        curve: animationCurve ?? AnimationConfig.easeInOut,
      ).slideY(
        begin: 0.1,
        end: 0,
        duration: animationDuration ?? AnimationConfig.normal,
        curve: animationCurve ?? AnimationConfig.easeOut,
      );
    }

    return container;
  }
}

/// Neumorphism switch component
class NeumorphismSwitch extends StatefulWidget {
  final bool value;
  final ValueChanged<bool>? onChanged;
  final Color? activeColor;
  final Color? inactiveColor;
  final double? width;
  final double? height;
  final NeumorphismStyle? style;
  final bool enableAnimation;
  final Duration? animationDuration;
  final Curve? animationCurve;

  const NeumorphismSwitch({
    super.key,
    required this.value,
    this.onChanged,
    this.activeColor,
    this.inactiveColor,
    this.width,
    this.height,
    this.style,
    this.enableAnimation = true,
    this.animationDuration,
    this.animationCurve,
  });

  @override
  State<NeumorphismSwitch> createState() => _NeumorphismSwitchState();
}

class _NeumorphismSwitchState extends State<NeumorphismSwitch>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: widget.animationDuration ?? AnimationConfig.normal,
      vsync: this,
    );
    _animation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeInOut,
    ));
    
    if (widget.value) {
      _controller.value = 1.0;
    }
  }

  @override
  void didUpdateWidget(NeumorphismSwitch oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.value != oldWidget.value) {
      if (widget.value) {
        _controller.forward();
      } else {
        _controller.reverse();
      }
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => widget.onChanged?.call(!widget.value),
      child: AnimatedBuilder(
        animation: _animation,
        builder: (context, child) {
          return _buildSwitch();
        },
      ),
    );
  }

  Widget _buildSwitch() {
    return Neumorphism(
      style: widget.style ?? NeumorphismStyle(
        depth: 8,
        intensity: 0.5,
        surfaceIntensity: 0.5,
        shape: NeumorphismShape.flat,
        lightSource: LightSource.topLeft,
        color: Theme.of(context).colorScheme.surface,
        shadowDarkColor: Colors.grey[800]!,
        shadowLightColor: Colors.white,
      ),
      child: Container(
        width: widget.width ?? 60,
        height: widget.height ?? 30,
        child: Stack(
          children: [
            // Track
            Container(
              decoration: BoxDecoration(
                color: widget.value 
                    ? (widget.activeColor ?? Theme.of(context).colorScheme.primary)
                    : (widget.inactiveColor ?? Colors.grey[400]),
                borderRadius: BorderRadius.circular(15),
              ),
            ),
            // Thumb
            AnimatedPositioned(
              duration: widget.animationDuration ?? AnimationConfig.normal,
              curve: widget.animationCurve ?? AnimationConfig.easeInOut,
              left: widget.value ? 30 : 0,
              top: 0,
              child: Container(
                width: 30,
                height: 30,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(15),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey[400]!,
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Neumorphism slider component
class NeumorphismSlider extends StatefulWidget {
  final double value;
  final double min;
  final double max;
  final ValueChanged<double>? onChanged;
  final ValueChanged<double>? onChangeEnd;
  final Color? activeColor;
  final Color? inactiveColor;
  final double? width;
  final double? height;
  final NeumorphismStyle? style;
  final bool enableAnimation;
  final Duration? animationDuration;
  final Curve? animationCurve;

  const NeumorphismSlider({
    super.key,
    required this.value,
    this.min = 0.0,
    this.max = 1.0,
    this.onChanged,
    this.onChangeEnd,
    this.activeColor,
    this.inactiveColor,
    this.width,
    this.height,
    this.style,
    this.enableAnimation = true,
    this.animationDuration,
    this.animationCurve,
  });

  @override
  State<NeumorphismSlider> createState() => _NeumorphismSliderState();
}

class _NeumorphismSliderState extends State<NeumorphismSlider>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  double _currentValue = 0.0;

  @override
  void initState() {
    super.initState();
    _currentValue = widget.value;
    _controller = AnimationController(
      duration: widget.animationDuration ?? AnimationConfig.normal,
      vsync: this,
    );
    _animation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve ?? AnimationConfig.easeInOut,
    ));
  }

  @override
  void didUpdateWidget(NeumorphismSlider oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.value != oldWidget.value) {
      _currentValue = widget.value;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onPanUpdate: (details) {
        final RenderBox box = context.findRenderObject() as RenderBox;
        final localPosition = box.globalToLocal(details.globalPosition);
        final width = box.size.width;
        final newValue = (localPosition.dx / width).clamp(0.0, 1.0);
        final scaledValue = widget.min + (newValue * (widget.max - widget.min));
        
        setState(() {
          _currentValue = scaledValue;
        });
        
        widget.onChanged?.call(scaledValue);
      },
      onPanEnd: (details) {
        widget.onChangeEnd?.call(_currentValue);
      },
      child: _buildSlider(),
    );
  }

  Widget _buildSlider() {
    final progress = (_currentValue - widget.min) / (widget.max - widget.min);
    
    return Neumorphism(
      style: widget.style ?? NeumorphismStyle(
        depth: 8,
        intensity: 0.5,
        surfaceIntensity: 0.5,
        shape: NeumorphismShape.flat,
        lightSource: LightSource.topLeft,
        color: Theme.of(context).colorScheme.surface,
        shadowDarkColor: Colors.grey[800]!,
        shadowLightColor: Colors.white,
      ),
      child: Container(
        width: widget.width ?? double.infinity,
        height: widget.height ?? 20,
        child: Stack(
          children: [
            // Track
            Container(
              decoration: BoxDecoration(
                color: widget.inactiveColor ?? Colors.grey[300],
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            // Progress
            Container(
              width: (widget.width ?? double.infinity) * progress,
              decoration: BoxDecoration(
                color: widget.activeColor ?? Theme.of(context).colorScheme.primary,
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            // Thumb
            Positioned(
              left: (widget.width ?? double.infinity) * progress - 10,
              top: -5,
              child: Container(
                width: 20,
                height: 20,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey[400]!,
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
