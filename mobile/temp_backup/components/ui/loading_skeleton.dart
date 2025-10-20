import 'package:flutter/material.dart';
import '../../config/design_tokens.dart';

/// LoadingSkeleton - Matches Next.js LoadingSkeleton.tsx with shimmer effect
class LoadingSkeleton extends StatefulWidget {
  final double? width;
  final double? height;
  final double? borderRadius;
  final Color? baseColor;
  final Color? highlightColor;
  final Duration? duration;
  final LoadingSkeletonType type;

  const LoadingSkeleton({
    super.key,
    this.width,
    this.height,
    this.borderRadius,
    this.baseColor,
    this.highlightColor,
    this.duration,
    this.type = LoadingSkeletonType.rectangle,
  });

  @override
  State<LoadingSkeleton> createState() => _LoadingSkeletonState();
}

class _LoadingSkeletonState extends State<LoadingSkeleton>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: widget.duration ?? const Duration(milliseconds: 1500),
      vsync: this,
    );
    _animation = Tween<double>(
      begin: -1.0,
      end: 2.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));
    _animationController.repeat();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final baseColor = widget.baseColor ?? 
        theme.colorScheme.surfaceContainerHighest;
    final highlightColor = widget.highlightColor ?? 
        theme.colorScheme.surface;

    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Container(
          width: widget.width,
          height: widget.height,
          decoration: BoxDecoration(
            color: baseColor,
            borderRadius: BorderRadius.circular(
              widget.borderRadius ?? _getDefaultBorderRadius(),
            ),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(
              widget.borderRadius ?? _getDefaultBorderRadius(),
            ),
          child: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
                colors: [
                  baseColor,
                  highlightColor,
                  baseColor,
                ],
                stops: [
                  _animation.value - 0.3,
                  _animation.value,
                  _animation.value + 0.3,
                ].map((stop) => stop.clamp(0.0, 1.0)).toList(),
              ),
            ),
          ),
          ),
        );
      },
    );
  }

  double _getDefaultBorderRadius() {
    return switch (widget.type) {
      LoadingSkeletonType.rectangle => DesignTokens.radiusLg,
      LoadingSkeletonType.circle => DesignTokens.radiusRound,
      LoadingSkeletonType.rounded => DesignTokens.radiusXl,
    };
  }
}

enum LoadingSkeletonType {
  rectangle,
  circle,
  rounded,
}

/// LoadingSkeleton variants for common use cases
class LoadingSkeletonVariants {
  /// Property card skeleton
  static Widget propertyCard() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        LoadingSkeleton(
          width: double.infinity,
          height: 200,
          type: LoadingSkeletonType.rounded,
        ),
        const SizedBox(height: DesignTokens.space4),
        LoadingSkeleton(
          width: double.infinity,
          height: 20,
          type: LoadingSkeletonType.rectangle,
        ),
        const SizedBox(height: DesignTokens.space2),
        LoadingSkeleton(
          width: 120,
          height: 16,
          type: LoadingSkeletonType.rectangle,
        ),
        const SizedBox(height: DesignTokens.space2),
        LoadingSkeleton(
          width: 80,
          height: 16,
          type: LoadingSkeletonType.rectangle,
        ),
      ],
    );
  }

  /// Property list skeleton
  static Widget propertyList({int count = 3}) {
    return Column(
      children: List.generate(
        count,
        (index) => Padding(
          padding: const EdgeInsets.only(bottom: DesignTokens.space5),
          child: propertyCard(),
        ),
      ),
    );
  }

  /// User profile skeleton
  static Widget userProfile() {
    return Row(
      children: [
        LoadingSkeleton(
          width: 60,
          height: 60,
          type: LoadingSkeletonType.circle,
        ),
        const SizedBox(width: DesignTokens.space4),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              LoadingSkeleton(
                width: double.infinity,
                height: 20,
                type: LoadingSkeletonType.rectangle,
              ),
              const SizedBox(height: DesignTokens.space2),
              LoadingSkeleton(
                width: 100,
                height: 16,
                type: LoadingSkeletonType.rectangle,
              ),
            ],
          ),
        ),
      ],
    );
  }

  /// Stats card skeleton
  static Widget statsCard() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        LoadingSkeleton(
          width: 40,
          height: 40,
          type: LoadingSkeletonType.rounded,
        ),
        const SizedBox(height: DesignTokens.space4),
        LoadingSkeleton(
          width: 60,
          height: 24,
          type: LoadingSkeletonType.rectangle,
        ),
        const SizedBox(height: DesignTokens.space2),
        LoadingSkeleton(
          width: 80,
          height: 16,
          type: LoadingSkeletonType.rectangle,
        ),
      ],
    );
  }

  /// Text skeleton
  static Widget text({double? width, double height = 16}) {
    return LoadingSkeleton(
      width: width,
      height: height,
      type: LoadingSkeletonType.rectangle,
    );
  }

  /// Avatar skeleton
  static Widget avatar({double size = 40}) {
    return LoadingSkeleton(
      width: size,
      height: size,
      type: LoadingSkeletonType.circle,
    );
  }

  /// Button skeleton
  static Widget button({double? width, double height = 48}) {
    return LoadingSkeleton(
      width: width,
      height: height,
      type: LoadingSkeletonType.rounded,
    );
  }

  /// Input skeleton
  static Widget input({double? width, double height = 56}) {
    return LoadingSkeleton(
      width: width,
      height: height,
      type: LoadingSkeletonType.rounded,
    );
  }

  /// Card skeleton
  static Widget card({double? width, double? height}) {
    return LoadingSkeleton(
      width: width,
      height: height,
      type: LoadingSkeletonType.rounded,
    );
  }

  /// List item skeleton
  static Widget listItem() {
    return Row(
      children: [
        LoadingSkeleton(
          width: 50,
          height: 50,
          type: LoadingSkeletonType.rounded,
        ),
        const SizedBox(width: DesignTokens.space4),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              LoadingSkeleton(
                width: double.infinity,
                height: 18,
                type: LoadingSkeletonType.rectangle,
              ),
              const SizedBox(height: DesignTokens.space2),
              LoadingSkeleton(
                width: 120,
                height: 14,
                type: LoadingSkeletonType.rectangle,
              ),
            ],
          ),
        ),
      ],
    );
  }

  /// Grid skeleton
  static Widget grid({
    int columns = 2,
    int rows = 3,
    double spacing = DesignTokens.space4,
  }) {
    return Column(
      children: List.generate(
        rows,
        (rowIndex) => Padding(
          padding: EdgeInsets.only(
            bottom: rowIndex < rows - 1 ? spacing : 0,
          ),
          child: Row(
            children: List.generate(
              columns,
              (colIndex) => Expanded(
                child: Padding(
                  padding: EdgeInsets.only(
                    right: colIndex < columns - 1 ? spacing : 0,
                  ),
                  child: propertyCard(),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
