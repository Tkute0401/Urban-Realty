import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../config/design_tokens.dart';
import '../../config/animation_config.dart';

/// Simple neumorphism card component
class SimpleNeumorphismCard extends StatelessWidget {
  final Widget child;
  final double? width;
  final double? height;
  final EdgeInsets? padding;
  final EdgeInsets? margin;
  final BorderRadius? borderRadius;
  final Color? backgroundColor;
  final bool enableAnimation;
  final Duration? animationDuration;
  final Curve? animationCurve;
  final bool enableHover;
  final bool enablePress;

  const SimpleNeumorphismCard({
    super.key,
    required this.child,
    this.width,
    this.height,
    this.padding,
    this.margin,
    this.borderRadius,
    this.backgroundColor,
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
        color: backgroundColor ?? Theme.of(context).colorScheme.surface,
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

/// Simple neumorphism button component
class SimpleNeumorphismButton extends StatefulWidget {
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
  final bool enableAnimation;
  final Duration? animationDuration;
  final Curve? animationCurve;
  final bool enableHover;
  final bool enablePress;

  const SimpleNeumorphismButton({
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
    this.enableAnimation = true,
    this.animationDuration,
    this.animationCurve,
    this.enableHover = true,
    this.enablePress = true,
  });

  @override
  State<SimpleNeumorphismButton> createState() => _SimpleNeumorphismButtonState();
}

class _SimpleNeumorphismButtonState extends State<SimpleNeumorphismButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
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
    return Container(
      width: widget.width ?? double.infinity,
      height: widget.height ?? 56,
      decoration: BoxDecoration(
        color: widget.backgroundColor ?? Theme.of(context).colorScheme.primary,
        borderRadius: widget.borderRadius ?? BorderRadius.circular(DesignTokens.radiusMd),
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

/// Simple neumorphism input field component
class SimpleNeumorphismInputField extends StatefulWidget {
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
  final Color? backgroundColor;
  final Color? textColor;
  final Color? hintColor;
  final double? fontSize;
  final bool enableAnimation;
  final Duration? animationDuration;
  final Curve? animationCurve;

  const SimpleNeumorphismInputField({
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
    this.backgroundColor,
    this.textColor,
    this.hintColor,
    this.fontSize,
    this.enableAnimation = true,
    this.animationDuration,
    this.animationCurve,
  });

  @override
  State<SimpleNeumorphismInputField> createState() => _SimpleNeumorphismInputFieldState();
}

class _SimpleNeumorphismInputFieldState extends State<SimpleNeumorphismInputField>
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
    return Container(
      width: widget.width ?? double.infinity,
      height: widget.height ?? 56,
      decoration: BoxDecoration(
        color: widget.backgroundColor ?? Theme.of(context).colorScheme.surface,
        borderRadius: widget.borderRadius ?? BorderRadius.circular(DesignTokens.radiusMd),
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
}

/// Simple neumorphism container component
class SimpleNeumorphismContainer extends StatelessWidget {
  final Widget child;
  final double? width;
  final double? height;
  final EdgeInsets? padding;
  final EdgeInsets? margin;
  final BorderRadius? borderRadius;
  final Color? backgroundColor;
  final bool enableAnimation;
  final Duration? animationDuration;
  final Curve? animationCurve;

  const SimpleNeumorphismContainer({
    super.key,
    required this.child,
    this.width,
    this.height,
    this.padding,
    this.margin,
    this.borderRadius,
    this.backgroundColor,
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
      decoration: BoxDecoration(
        color: backgroundColor ?? Theme.of(context).colorScheme.surface,
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


