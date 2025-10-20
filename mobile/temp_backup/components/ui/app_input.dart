import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../config/design_tokens.dart';

/// AppInput - Matches Next.js Input.tsx with validation states
class AppInput extends StatefulWidget {
  final String? label;
  final String? hint;
  final String? helperText;
  final String? errorText;
  final TextEditingController? controller;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final bool obscureText;
  final bool enabled;
  final bool readOnly;
  final int? maxLines;
  final int? maxLength;
  final List<TextInputFormatter>? inputFormatters;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final VoidCallback? onTap;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final VoidCallback? onEditingComplete;
  final FocusNode? focusNode;
  final AppInputVariant variant;
  final AppInputSize size;
  final bool isRequired;
  final String? Function(String?)? validator;

  const AppInput({
    super.key,
    this.label,
    this.hint,
    this.helperText,
    this.errorText,
    this.controller,
    this.keyboardType,
    this.textInputAction,
    this.obscureText = false,
    this.enabled = true,
    this.readOnly = false,
    this.maxLines = 1,
    this.maxLength,
    this.inputFormatters,
    this.prefixIcon,
    this.suffixIcon,
    this.onTap,
    this.onChanged,
    this.onSubmitted,
    this.onEditingComplete,
    this.focusNode,
    this.variant = AppInputVariant.outlined,
    this.size = AppInputSize.medium,
    this.isRequired = false,
    this.validator,
  });

  @override
  State<AppInput> createState() => _AppInputState();
}

class _AppInputState extends State<AppInput> {
  late FocusNode _focusNode;
  bool _isFocused = false;
  bool _hasError = false;

  @override
  void initState() {
    super.initState();
    _focusNode = widget.focusNode ?? FocusNode();
    _focusNode.addListener(_onFocusChange);
  }

  @override
  void dispose() {
    if (widget.focusNode == null) {
      _focusNode.dispose();
    }
    super.dispose();
  }

  void _onFocusChange() {
    setState(() {
      _isFocused = _focusNode.hasFocus;
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    _hasError = widget.errorText != null && widget.errorText!.isNotEmpty;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.label != null) ...[
          _buildLabel(theme),
          const SizedBox(height: DesignTokens.space3),
        ],
        _buildInput(theme),
        if (widget.helperText != null || _hasError) ...[
          const SizedBox(height: DesignTokens.space2),
          _buildHelperText(theme),
        ],
      ],
    );
  }

  Widget _buildLabel(ThemeData theme) {
    return RichText(
      text: TextSpan(
        text: widget.label,
        style: theme.textTheme.labelLarge?.copyWith(
          color: _hasError 
              ? theme.colorScheme.error 
              : theme.colorScheme.onSurface,
        ),
        children: [
          if (widget.isRequired)
            TextSpan(
              text: ' *',
              style: TextStyle(
                color: theme.colorScheme.error,
                fontWeight: DesignTokens.fontWeightBold,
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildInput(ThemeData theme) {
    final inputDecoration = _getInputDecoration(theme);
    
    return TextFormField(
      controller: widget.controller,
      focusNode: _focusNode,
      keyboardType: widget.keyboardType,
      textInputAction: widget.textInputAction,
      obscureText: widget.obscureText,
      enabled: widget.enabled,
      readOnly: widget.readOnly,
      maxLines: widget.maxLines,
      maxLength: widget.maxLength,
      inputFormatters: widget.inputFormatters,
      onTap: widget.onTap,
      onChanged: widget.onChanged,
      onFieldSubmitted: widget.onSubmitted,
      onEditingComplete: widget.onEditingComplete,
      validator: widget.validator,
      decoration: inputDecoration,
      style: _getTextStyle(theme),
    );
  }

  InputDecoration _getInputDecoration(ThemeData theme) {
    final baseDecoration = InputDecoration(
      hintText: widget.hint,
      prefixIcon: widget.prefixIcon,
      suffixIcon: widget.suffixIcon,
      counterText: '', // Hide character counter
    );

    switch (widget.variant) {
      case AppInputVariant.outlined:
        return baseDecoration.copyWith(
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(_getBorderRadius()),
            borderSide: BorderSide(
              color: theme.colorScheme.outline,
              width: DesignTokens.borderWidth1,
            ),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(_getBorderRadius()),
            borderSide: BorderSide(
              color: theme.colorScheme.primary,
              width: DesignTokens.borderWidth2,
            ),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(_getBorderRadius()),
            borderSide: BorderSide(
              color: theme.colorScheme.error,
              width: DesignTokens.borderWidth1,
            ),
          ),
          focusedErrorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(_getBorderRadius()),
            borderSide: BorderSide(
              color: theme.colorScheme.error,
              width: DesignTokens.borderWidth2,
            ),
          ),
          contentPadding: _getContentPadding(),
        );
      case AppInputVariant.filled:
        return baseDecoration.copyWith(
          filled: true,
          fillColor: _hasError
              ? theme.colorScheme.errorContainer.withValues(alpha: 0.1)
              : theme.colorScheme.surfaceContainerHighest,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(_getBorderRadius()),
            borderSide: BorderSide.none,
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(_getBorderRadius()),
            borderSide: BorderSide.none,
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(_getBorderRadius()),
            borderSide: BorderSide(
              color: theme.colorScheme.primary,
              width: DesignTokens.borderWidth2,
            ),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(_getBorderRadius()),
            borderSide: BorderSide(
              color: theme.colorScheme.error,
              width: DesignTokens.borderWidth1,
            ),
          ),
          focusedErrorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(_getBorderRadius()),
            borderSide: BorderSide(
              color: theme.colorScheme.error,
              width: DesignTokens.borderWidth2,
            ),
          ),
          contentPadding: _getContentPadding(),
        );
      case AppInputVariant.underlined:
        return baseDecoration.copyWith(
          border: UnderlineInputBorder(
            borderSide: BorderSide(
              color: theme.colorScheme.outline,
              width: DesignTokens.borderWidth1,
            ),
          ),
          enabledBorder: UnderlineInputBorder(
            borderSide: BorderSide(
              color: theme.colorScheme.outline,
              width: DesignTokens.borderWidth1,
            ),
          ),
          focusedBorder: UnderlineInputBorder(
            borderSide: BorderSide(
              color: theme.colorScheme.primary,
              width: DesignTokens.borderWidth2,
            ),
          ),
          errorBorder: UnderlineInputBorder(
            borderSide: BorderSide(
              color: theme.colorScheme.error,
              width: DesignTokens.borderWidth1,
            ),
          ),
          focusedErrorBorder: UnderlineInputBorder(
            borderSide: BorderSide(
              color: theme.colorScheme.error,
              width: DesignTokens.borderWidth2,
            ),
          ),
          contentPadding: _getContentPadding(),
        );
    }
  }

  Widget _buildHelperText(ThemeData theme) {
    if (_hasError) {
      return Row(
        children: [
          Icon(
            Icons.error_outline,
            size: DesignTokens.iconSizeSm,
            color: theme.colorScheme.error,
          ),
          const SizedBox(width: DesignTokens.space2),
          Expanded(
            child: Text(
              widget.errorText!,
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.colorScheme.error,
              ),
            ),
          ),
        ],
      );
    }

    return Text(
      widget.helperText!,
      style: theme.textTheme.bodySmall?.copyWith(
        color: theme.colorScheme.onSurfaceVariant,
      ),
    );
  }

  EdgeInsets _getContentPadding() {
    final horizontalPadding = switch (widget.size) {
      AppInputSize.small => DesignTokens.space4,
      AppInputSize.medium => DesignTokens.space5,
      AppInputSize.large => DesignTokens.space6,
    };

    final verticalPadding = switch (widget.size) {
      AppInputSize.small => DesignTokens.space3,
      AppInputSize.medium => DesignTokens.space4,
      AppInputSize.large => DesignTokens.space5,
    };

    return EdgeInsets.symmetric(
      horizontal: horizontalPadding,
      vertical: verticalPadding,
    );
  }

  double _getBorderRadius() {
    return switch (widget.size) {
      AppInputSize.small => DesignTokens.radiusLg,
      AppInputSize.medium => DesignTokens.radiusXl,
      AppInputSize.large => DesignTokens.radius2xl,
    };
  }

  TextStyle _getTextStyle(ThemeData theme) {
    return switch (widget.size) {
      AppInputSize.small => theme.textTheme.bodySmall ?? const TextStyle(),
      AppInputSize.medium => theme.textTheme.bodyMedium ?? const TextStyle(),
      AppInputSize.large => theme.textTheme.bodyLarge ?? const TextStyle(),
    };
  }
}

enum AppInputVariant {
  outlined,
  filled,
  underlined,
}

enum AppInputSize {
  small,
  medium,
  large,
}


