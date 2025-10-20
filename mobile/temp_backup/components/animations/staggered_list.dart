import 'package:flutter/material.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import '../../config/design_tokens.dart';
import '../../config/animation_config.dart';

/// Staggered list animation widget
class StaggeredList extends StatelessWidget {
  final List<Widget> children;
  final Duration? duration;
  final Curve? curve;
  final Duration? delay;
  final AnimationDirection? direction;
  final double? verticalOffset;
  final double? horizontalOffset;
  final bool enableFade;
  final bool enableSlide;
  final bool enableScale;
  final bool enableRotation;
  final double? beginOpacity;
  final double? endOpacity;
  final double? beginScale;
  final double? endScale;
  final double? beginRotation;
  final double? endRotation;

  const StaggeredList({
    super.key,
    required this.children,
    this.duration,
    this.curve,
    this.delay,
    this.direction,
    this.verticalOffset,
    this.horizontalOffset,
    this.enableFade = true,
    this.enableSlide = true,
    this.enableScale = false,
    this.enableRotation = false,
    this.beginOpacity,
    this.endOpacity,
    this.beginScale,
    this.endScale,
    this.beginRotation,
    this.endRotation,
  });

  @override
  Widget build(BuildContext context) {
    return AnimationLimiter(
      child: ListView.builder(
        itemCount: children.length,
        itemBuilder: (context, index) {
          return AnimationConfiguration.staggeredList(
            position: index,
            duration: duration ?? AnimationConfig.listItemDuration,
            child: _buildAnimation(children[index]),
          );
        },
      ),
    );
  }

  Widget _buildAnimation(Widget child) {
    Widget animatedChild = child;

    if (enableSlide) {
      animatedChild = SlideAnimation(
        verticalOffset: verticalOffset ?? _getVerticalOffset(),
        horizontalOffset: horizontalOffset ?? _getHorizontalOffset(),
        child: animatedChild,
      );
    }

    if (enableFade) {
      animatedChild = FadeInAnimation(
        opacity: Tween<double>(
          begin: beginOpacity ?? 0.0,
          end: endOpacity ?? 1.0,
        ),
        child: animatedChild,
      );
    }

    if (enableScale) {
      animatedChild = ScaleAnimation(
        scale: Tween<double>(
          begin: beginScale ?? 0.8,
          end: endScale ?? 1.0,
        ),
        child: animatedChild,
      );
    }

    if (enableRotation) {
      animatedChild = RotationAnimation(
        turns: Tween<double>(
          begin: beginRotation ?? 0.0,
          end: endRotation ?? 1.0,
        ),
        child: animatedChild,
      );
    }

    return animatedChild;
  }

  double _getVerticalOffset() {
    switch (direction) {
      case AnimationDirection.up:
        return 50.0;
      case AnimationDirection.down:
        return -50.0;
      case AnimationDirection.left:
      case AnimationDirection.right:
      case AnimationDirection.upLeft:
      case AnimationDirection.upRight:
      case AnimationDirection.downLeft:
      case AnimationDirection.downRight:
        return 0.0;
      default:
        return 50.0;
    }
  }

  double _getHorizontalOffset() {
    switch (direction) {
      case AnimationDirection.left:
        return 50.0;
      case AnimationDirection.right:
        return -50.0;
      case AnimationDirection.upLeft:
        return 50.0;
      case AnimationDirection.upRight:
        return -50.0;
      case AnimationDirection.downLeft:
        return 50.0;
      case AnimationDirection.downRight:
        return -50.0;
      case AnimationDirection.up:
      case AnimationDirection.down:
      default:
        return 0.0;
    }
  }
}

/// Staggered grid animation widget
class StaggeredGrid extends StatelessWidget {
  final List<Widget> children;
  final int crossAxisCount;
  final double? mainAxisSpacing;
  final double? crossAxisSpacing;
  final Duration? duration;
  final Curve? curve;
  final Duration? delay;
  final AnimationDirection? direction;
  final double? verticalOffset;
  final double? horizontalOffset;
  final bool enableFade;
  final bool enableSlide;
  final bool enableScale;
  final bool enableRotation;
  final double? beginOpacity;
  final double? endOpacity;
  final double? beginScale;
  final double? endScale;
  final double? beginRotation;
  final double? endRotation;

  const StaggeredGrid({
    super.key,
    required this.children,
    required this.crossAxisCount,
    this.mainAxisSpacing,
    this.crossAxisSpacing,
    this.duration,
    this.curve,
    this.delay,
    this.direction,
    this.verticalOffset,
    this.horizontalOffset,
    this.enableFade = true,
    this.enableSlide = true,
    this.enableScale = true,
    this.enableRotation = false,
    this.beginOpacity,
    this.endOpacity,
    this.beginScale,
    this.endScale,
    this.beginRotation,
    this.endRotation,
  });

  @override
  Widget build(BuildContext context) {
    return AnimationLimiter(
      child: GridView.builder(
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: crossAxisCount,
          mainAxisSpacing: mainAxisSpacing ?? DesignTokens.spacingSm,
          crossAxisSpacing: crossAxisSpacing ?? DesignTokens.spacingSm,
        ),
        itemCount: children.length,
        itemBuilder: (context, index) {
          return AnimationConfiguration.staggeredGrid(
            position: index,
            duration: duration ?? AnimationConfig.listItemDuration,
            columnCount: crossAxisCount,
            child: _buildAnimation(children[index]),
          );
        },
      ),
    );
  }

  Widget _buildAnimation(Widget child) {
    Widget animatedChild = child;

    if (enableSlide) {
      animatedChild = SlideAnimation(
        verticalOffset: verticalOffset ?? _getVerticalOffset(),
        horizontalOffset: horizontalOffset ?? _getHorizontalOffset(),
        child: animatedChild,
      );
    }

    if (enableFade) {
      animatedChild = FadeInAnimation(
        opacity: Tween<double>(
          begin: beginOpacity ?? 0.0,
          end: endOpacity ?? 1.0,
        ),
        child: animatedChild,
      );
    }

    if (enableScale) {
      animatedChild = ScaleAnimation(
        scale: Tween<double>(
          begin: beginScale ?? 0.8,
          end: endScale ?? 1.0,
        ),
        child: animatedChild,
      );
    }

    if (enableRotation) {
      animatedChild = RotationAnimation(
        turns: Tween<double>(
          begin: beginRotation ?? 0.0,
          end: endRotation ?? 1.0,
        ),
        child: animatedChild,
      );
    }

    return animatedChild;
  }

  double _getVerticalOffset() {
    switch (direction) {
      case AnimationDirection.up:
        return 50.0;
      case AnimationDirection.down:
        return -50.0;
      case AnimationDirection.left:
      case AnimationDirection.right:
      case AnimationDirection.upLeft:
      case AnimationDirection.upRight:
      case AnimationDirection.downLeft:
      case AnimationDirection.downRight:
        return 0.0;
      default:
        return 50.0;
    }
  }

  double _getHorizontalOffset() {
    switch (direction) {
      case AnimationDirection.left:
        return 50.0;
      case AnimationDirection.right:
        return -50.0;
      case AnimationDirection.upLeft:
        return 50.0;
      case AnimationDirection.upRight:
        return -50.0;
      case AnimationDirection.downLeft:
        return 50.0;
      case AnimationDirection.downRight:
        return -50.0;
      case AnimationDirection.up:
      case AnimationDirection.down:
      default:
        return 0.0;
    }
  }
}

/// Staggered column animation widget
class StaggeredColumn extends StatelessWidget {
  final List<Widget> children;
  final MainAxisAlignment mainAxisAlignment;
  final CrossAxisAlignment crossAxisAlignment;
  final MainAxisSize mainAxisSize;
  final Duration? duration;
  final Curve? curve;
  final Duration? delay;
  final AnimationDirection? direction;
  final double? verticalOffset;
  final double? horizontalOffset;
  final bool enableFade;
  final bool enableSlide;
  final bool enableScale;
  final bool enableRotation;
  final double? beginOpacity;
  final double? endOpacity;
  final double? beginScale;
  final double? endScale;
  final double? beginRotation;
  final double? endRotation;

  const StaggeredColumn({
    super.key,
    required this.children,
    this.mainAxisAlignment = MainAxisAlignment.start,
    this.crossAxisAlignment = CrossAxisAlignment.center,
    this.mainAxisSize = MainAxisSize.max,
    this.duration,
    this.curve,
    this.delay,
    this.direction,
    this.verticalOffset,
    this.horizontalOffset,
    this.enableFade = true,
    this.enableSlide = true,
    this.enableScale = false,
    this.enableRotation = false,
    this.beginOpacity,
    this.endOpacity,
    this.beginScale,
    this.endScale,
    this.beginRotation,
    this.endRotation,
  });

  @override
  Widget build(BuildContext context) {
    return AnimationLimiter(
      child: Column(
        mainAxisAlignment: mainAxisAlignment,
        crossAxisAlignment: crossAxisAlignment,
        mainAxisSize: mainAxisSize,
        children: children.asMap().entries.map((entry) {
          final index = entry.key;
          final child = entry.value;
          
          return AnimationConfiguration.staggeredList(
            position: index,
            duration: duration ?? AnimationConfig.listItemDuration,
            child: _buildAnimation(child),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildAnimation(Widget child) {
    Widget animatedChild = child;

    if (enableSlide) {
      animatedChild = SlideAnimation(
        verticalOffset: verticalOffset ?? _getVerticalOffset(),
        horizontalOffset: horizontalOffset ?? _getHorizontalOffset(),
        child: animatedChild,
      );
    }

    if (enableFade) {
      animatedChild = FadeInAnimation(
        opacity: Tween<double>(
          begin: beginOpacity ?? 0.0,
          end: endOpacity ?? 1.0,
        ),
        child: animatedChild,
      );
    }

    if (enableScale) {
      animatedChild = ScaleAnimation(
        scale: Tween<double>(
          begin: beginScale ?? 0.8,
          end: endScale ?? 1.0,
        ),
        child: animatedChild,
      );
    }

    if (enableRotation) {
      animatedChild = RotationAnimation(
        turns: Tween<double>(
          begin: beginRotation ?? 0.0,
          end: endRotation ?? 1.0,
        ),
        child: animatedChild,
      );
    }

    return animatedChild;
  }

  double _getVerticalOffset() {
    switch (direction) {
      case AnimationDirection.up:
        return 50.0;
      case AnimationDirection.down:
        return -50.0;
      case AnimationDirection.left:
      case AnimationDirection.right:
      case AnimationDirection.upLeft:
      case AnimationDirection.upRight:
      case AnimationDirection.downLeft:
      case AnimationDirection.downRight:
        return 0.0;
      default:
        return 50.0;
    }
  }

  double _getHorizontalOffset() {
    switch (direction) {
      case AnimationDirection.left:
        return 50.0;
      case AnimationDirection.right:
        return -50.0;
      case AnimationDirection.upLeft:
        return 50.0;
      case AnimationDirection.upRight:
        return -50.0;
      case AnimationDirection.downLeft:
        return 50.0;
      case AnimationDirection.downRight:
        return -50.0;
      case AnimationDirection.up:
      case AnimationDirection.down:
      default:
        return 0.0;
    }
  }
}

/// Staggered row animation widget
class StaggeredRow extends StatelessWidget {
  final List<Widget> children;
  final MainAxisAlignment mainAxisAlignment;
  final CrossAxisAlignment crossAxisAlignment;
  final MainAxisSize mainAxisSize;
  final Duration? duration;
  final Curve? curve;
  final Duration? delay;
  final AnimationDirection? direction;
  final double? verticalOffset;
  final double? horizontalOffset;
  final bool enableFade;
  final bool enableSlide;
  final bool enableScale;
  final bool enableRotation;
  final double? beginOpacity;
  final double? endOpacity;
  final double? beginScale;
  final double? endScale;
  final double? beginRotation;
  final double? endRotation;

  const StaggeredRow({
    super.key,
    required this.children,
    this.mainAxisAlignment = MainAxisAlignment.start,
    this.crossAxisAlignment = CrossAxisAlignment.center,
    this.mainAxisSize = MainAxisSize.max,
    this.duration,
    this.curve,
    this.delay,
    this.direction,
    this.verticalOffset,
    this.horizontalOffset,
    this.enableFade = true,
    this.enableSlide = true,
    this.enableScale = false,
    this.enableRotation = false,
    this.beginOpacity,
    this.endOpacity,
    this.beginScale,
    this.endScale,
    this.beginRotation,
    this.endRotation,
  });

  @override
  Widget build(BuildContext context) {
    return AnimationLimiter(
      child: Row(
        mainAxisAlignment: mainAxisAlignment,
        crossAxisAlignment: crossAxisAlignment,
        mainAxisSize: mainAxisSize,
        children: children.asMap().entries.map((entry) {
          final index = entry.key;
          final child = entry.value;
          
          return AnimationConfiguration.staggeredList(
            position: index,
            duration: duration ?? AnimationConfig.listItemDuration,
            child: _buildAnimation(child),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildAnimation(Widget child) {
    Widget animatedChild = child;

    if (enableSlide) {
      animatedChild = SlideAnimation(
        verticalOffset: verticalOffset ?? _getVerticalOffset(),
        horizontalOffset: horizontalOffset ?? _getHorizontalOffset(),
        child: animatedChild,
      );
    }

    if (enableFade) {
      animatedChild = FadeInAnimation(
        opacity: Tween<double>(
          begin: beginOpacity ?? 0.0,
          end: endOpacity ?? 1.0,
        ),
        child: animatedChild,
      );
    }

    if (enableScale) {
      animatedChild = ScaleAnimation(
        scale: Tween<double>(
          begin: beginScale ?? 0.8,
          end: endScale ?? 1.0,
        ),
        child: animatedChild,
      );
    }

    if (enableRotation) {
      animatedChild = RotationAnimation(
        turns: Tween<double>(
          begin: beginRotation ?? 0.0,
          end: endRotation ?? 1.0,
        ),
        child: animatedChild,
      );
    }

    return animatedChild;
  }

  double _getVerticalOffset() {
    switch (direction) {
      case AnimationDirection.up:
        return 50.0;
      case AnimationDirection.down:
        return -50.0;
      case AnimationDirection.left:
      case AnimationDirection.right:
      case AnimationDirection.upLeft:
      case AnimationDirection.upRight:
      case AnimationDirection.downLeft:
      case AnimationDirection.downRight:
        return 0.0;
      default:
        return 0.0;
    }
  }

  double _getHorizontalOffset() {
    switch (direction) {
      case AnimationDirection.left:
        return 50.0;
      case AnimationDirection.right:
        return -50.0;
      case AnimationDirection.upLeft:
        return 50.0;
      case AnimationDirection.upRight:
        return -50.0;
      case AnimationDirection.downLeft:
        return 50.0;
      case AnimationDirection.downRight:
        return -50.0;
      case AnimationDirection.up:
      case AnimationDirection.down:
      default:
        return 0.0;
    }
  }
}

/// Staggered animation configuration
class StaggeredAnimationConfig {
  final Duration duration;
  final Curve curve;
  final Duration delay;
  final AnimationDirection direction;
  final double verticalOffset;
  final double horizontalOffset;
  final bool enableFade;
  final bool enableSlide;
  final bool enableScale;
  final bool enableRotation;
  final double beginOpacity;
  final double endOpacity;
  final double beginScale;
  final double endScale;
  final double beginRotation;
  final double endRotation;

  const StaggeredAnimationConfig({
    this.duration = AnimationConfig.listItemDuration,
    this.curve = AnimationConfig.easeOut,
    this.delay = AnimationConfig.staggerDelay,
    this.direction = AnimationDirection.up,
    this.verticalOffset = 50.0,
    this.horizontalOffset = 0.0,
    this.enableFade = true,
    this.enableSlide = true,
    this.enableScale = false,
    this.enableRotation = false,
    this.beginOpacity = 0.0,
    this.endOpacity = 1.0,
    this.beginScale = 0.8,
    this.endScale = 1.0,
    this.beginRotation = 0.0,
    this.endRotation = 1.0,
  });
}


