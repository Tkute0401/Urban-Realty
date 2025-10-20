import 'package:flutter/material.dart';
import 'package:glassmorphism/glassmorphism.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../config/design_tokens.dart';
import '../../config/animation_config.dart';

/// Glassmorphism card component
class GlassmorphismCard extends StatelessWidget {
  final Widget child;
  final double? width;
  final double? height;
  final EdgeInsets? padding;
  final EdgeInsets? margin;
  final BorderRadius? borderRadius;
  final double? blur;
  final double? opacity;
  final Color? color;
  final Border? border;
  final bool enableAnimation;
  final Duration? animationDuration;
  final Curve? animationCurve;

  const GlassmorphismCard({
    super.key,
    required this.child,
    this.width,
    this.height,
    this.padding,
    this.margin,
    this.borderRadius,
    this.blur,
    this.opacity,
    this.color,
    this.border,
    this.enableAnimation = true,
    this.animationDuration,
    this.animationCurve,
  });

  @override
  Widget build(BuildContext context) {
    final card = GlassmorphicContainer(
      width: width ?? double.infinity,
      height: height,
      borderRadius: borderRadius?.value ?? DesignTokens.radiusLg,
      blur: blur ?? 20,
      alignment: Alignment.bottomCenter,
      border: border?.width ?? 1.5,
      linearGradient: LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          color?.withOpacity(opacity ?? 0.1) ?? Colors.white.withOpacity(0.1),
          color?.withOpacity(opacity ?? 0.05) ?? Colors.white.withOpacity(0.05),
        ],
      ),
      borderGradient: LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          Colors.white.withOpacity(0.2),
          Colors.white.withOpacity(0.1),
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

/// Glassmorphism button component
class GlassmorphismButton extends StatefulWidget {
  final String text;
  final VoidCallback? onPressed;
  final IconData? icon;
  final double? width;
  final double? height;
  final EdgeInsets? padding;
  final BorderRadius? borderRadius;
  final double? blur;
  final double? opacity;
  final Color? color;
  final Color? textColor;
  final double? fontSize;
  final FontWeight? fontWeight;
  final bool enableAnimation;
  final Duration? animationDuration;
  final Curve? animationCurve;
  final bool enableHover;
  final bool enablePress;

  const GlassmorphismButton({
    super.key,
    required this.text,
    this.onPressed,
    this.icon,
    this.width,
    this.height,
    this.padding,
    this.borderRadius,
    this.blur,
    this.opacity,
    this.color,
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
  State<GlassmorphismButton> createState() => _GlassmorphismButtonState();
}

class _GlassmorphismButtonState extends State<GlassmorphismButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;
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
    _opacityAnimation = Tween<double>(
      begin: 1.0,
      end: 0.8,
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
              child: Opacity(
                opacity: _opacityAnimation.value,
                child: _buildButton(),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildButton() {
    return GlassmorphicContainer(
      width: widget.width ?? double.infinity,
      height: widget.height ?? 56,
      borderRadius: widget.borderRadius?.value ?? DesignTokens.radiusMd,
      blur: widget.blur ?? 15,
      alignment: Alignment.center,
      border: 1.5,
      linearGradient: LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          widget.color?.withOpacity(widget.opacity ?? 0.2) ?? Colors.white.withOpacity(0.2),
          widget.color?.withOpacity(widget.opacity ?? 0.1) ?? Colors.white.withOpacity(0.1),
        ],
      ),
      borderGradient: LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          Colors.white.withOpacity(0.3),
          Colors.white.withOpacity(0.1),
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

/// Glassmorphism input field component
class GlassmorphismInputField extends StatefulWidget {
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
  final double? blur;
  final double? opacity;
  final Color? color;
  final Color? textColor;
  final Color? hintColor;
  final double? fontSize;
  final bool enableAnimation;
  final Duration? animationDuration;
  final Curve? animationCurve;

  const GlassmorphismInputField({
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
    this.blur,
    this.opacity,
    this.color,
    this.textColor,
    this.hintColor,
    this.fontSize,
    this.enableAnimation = true,
    this.animationDuration,
    this.animationCurve,
  });

  @override
  State<GlassmorphismInputField> createState() => _GlassmorphismInputFieldState();
}

class _GlassmorphismInputFieldState extends State<GlassmorphismInputField>
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
      end: 1.05,
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
    return GlassmorphicContainer(
      width: widget.width ?? double.infinity,
      height: widget.height ?? 56,
      borderRadius: widget.borderRadius?.value ?? DesignTokens.radiusMd,
      blur: widget.blur ?? 15,
      alignment: Alignment.center,
      border: _isFocused ? 2.0 : 1.5,
      linearGradient: LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          widget.color?.withOpacity(widget.opacity ?? 0.1) ?? Colors.white.withOpacity(0.1),
          widget.color?.withOpacity(widget.opacity ?? 0.05) ?? Colors.white.withOpacity(0.05),
        ],
      ),
      borderGradient: LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          Colors.white.withOpacity(_isFocused ? 0.4 : 0.2),
          Colors.white.withOpacity(_isFocused ? 0.2 : 0.1),
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
            color: widget.textColor ?? Colors.white,
            fontSize: widget.fontSize ?? 16,
          ),
          decoration: InputDecoration(
            hintText: widget.hintText,
            labelText: widget.labelText,
            prefixIcon: widget.prefixIcon,
            suffixIcon: widget.suffixIcon,
            border: InputBorder.none,
            hintStyle: TextStyle(
              color: widget.hintColor ?? Colors.white.withOpacity(0.6),
              fontSize: widget.fontSize ?? 16,
            ),
            labelStyle: TextStyle(
              color: widget.hintColor ?? Colors.white.withOpacity(0.8),
              fontSize: widget.fontSize ?? 16,
            ),
          ),
        ),
      ),
    );
  }
}

/// Glassmorphism container component
class GlassmorphismContainer extends StatelessWidget {
  final Widget child;
  final double? width;
  final double? height;
  final EdgeInsets? padding;
  final EdgeInsets? margin;
  final BorderRadius? borderRadius;
  final double? blur;
  final double? opacity;
  final Color? color;
  final Border? border;
  final bool enableAnimation;
  final Duration? animationDuration;
  final Curve? animationCurve;
  final Alignment? alignment;

  const GlassmorphismContainer({
    super.key,
    required this.child,
    this.width,
    this.height,
    this.padding,
    this.margin,
    this.borderRadius,
    this.blur,
    this.opacity,
    this.color,
    this.border,
    this.enableAnimation = true,
    this.animationDuration,
    this.animationCurve,
    this.alignment,
  });

  @override
  Widget build(BuildContext context) {
    final container = GlassmorphicContainer(
      width: width ?? double.infinity,
      height: height,
      borderRadius: borderRadius?.value ?? DesignTokens.radiusLg,
      blur: blur ?? 20,
      alignment: alignment ?? Alignment.center,
      border: border?.width ?? 1.5,
      linearGradient: LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          color?.withOpacity(opacity ?? 0.1) ?? Colors.white.withOpacity(0.1),
          color?.withOpacity(opacity ?? 0.05) ?? Colors.white.withOpacity(0.05),
        ],
      ),
      borderGradient: LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          Colors.white.withOpacity(0.2),
          Colors.white.withOpacity(0.1),
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

/// Glassmorphism app bar component
class GlassmorphismAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String? title;
  final List<Widget>? actions;
  final Widget? leading;
  final bool automaticallyImplyLeading;
  final double? elevation;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final double? blur;
  final double? opacity;
  final bool enableAnimation;
  final Duration? animationDuration;
  final Curve? animationCurve;

  const GlassmorphismAppBar({
    super.key,
    this.title,
    this.actions,
    this.leading,
    this.automaticallyImplyLeading = true,
    this.elevation,
    this.backgroundColor,
    this.foregroundColor,
    this.blur,
    this.opacity,
    this.enableAnimation = true,
    this.animationDuration,
    this.animationCurve,
  });

  @override
  Widget build(BuildContext context) {
    final appBar = AppBar(
      title: title != null ? Text(title!) : null,
      actions: actions,
      leading: leading,
      automaticallyImplyLeading: automaticallyImplyLeading,
      elevation: elevation ?? 0,
      backgroundColor: Colors.transparent,
      foregroundColor: foregroundColor ?? Colors.white,
      flexibleSpace: GlassmorphicContainer(
        width: double.infinity,
        height: double.infinity,
        borderRadius: 0,
        blur: blur ?? 20,
        alignment: Alignment.center,
        border: 0,
        linearGradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            backgroundColor?.withOpacity(opacity ?? 0.1) ?? Colors.white.withOpacity(0.1),
            backgroundColor?.withOpacity(opacity ?? 0.05) ?? Colors.white.withOpacity(0.05),
          ],
        ),
        borderGradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.white.withOpacity(0.2),
            Colors.white.withOpacity(0.1),
          ],
        ),
        child: Container(),
      ),
    );

    if (enableAnimation) {
      return appBar.animate().fadeIn(
        duration: animationDuration ?? AnimationConfig.normal,
        curve: animationCurve ?? AnimationConfig.easeInOut,
      ).slideY(
        begin: -0.1,
        end: 0,
        duration: animationDuration ?? AnimationConfig.normal,
        curve: animationCurve ?? AnimationConfig.easeOut,
      );
    }

    return appBar;
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}


