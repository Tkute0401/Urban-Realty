import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import '../../config/design_tokens.dart';
import '../../config/animation_config.dart';

/// Page transition animations
class PageTransitions {
  /// Slide transition from right to left
  static Widget slideRightToLeft({
    required Widget child,
    Duration? duration,
    Curve? curve,
  }) {
    return SlideTransition(
      position: Tween<Offset>(
        begin: const Offset(1.0, 0.0),
        end: Offset.zero,
      ).animate(CurvedAnimation(
        parent: kAlwaysCompleteAnimation,
        curve: curve ?? AnimationConfig.easeInOut,
      )),
      child: child,
    );
  }

  /// Slide transition from left to right
  static Widget slideLeftToRight({
    required Widget child,
    Duration? duration,
    Curve? curve,
  }) {
    return SlideTransition(
      position: Tween<Offset>(
        begin: const Offset(-1.0, 0.0),
        end: Offset.zero,
      ).animate(CurvedAnimation(
        parent: kAlwaysCompleteAnimation,
        curve: curve ?? AnimationConfig.easeInOut,
      )),
      child: child,
    );
  }

  /// Slide transition from bottom to top
  static Widget slideBottomToTop({
    required Widget child,
    Duration? duration,
    Curve? curve,
  }) {
    return SlideTransition(
      position: Tween<Offset>(
        begin: const Offset(0.0, 1.0),
        end: Offset.zero,
      ).animate(CurvedAnimation(
        parent: kAlwaysCompleteAnimation,
        curve: curve ?? AnimationConfig.easeInOut,
      )),
      child: child,
    );
  }

  /// Slide transition from top to bottom
  static Widget slideTopToBottom({
    required Widget child,
    Duration? duration,
    Curve? curve,
  }) {
    return SlideTransition(
      position: Tween<Offset>(
        begin: const Offset(0.0, -1.0),
        end: Offset.zero,
      ).animate(CurvedAnimation(
        parent: kAlwaysCompleteAnimation,
        curve: curve ?? AnimationConfig.easeInOut,
      )),
      child: child,
    );
  }

  /// Fade transition
  static Widget fade({
    required Widget child,
    Duration? duration,
    Curve? curve,
  }) {
    return FadeTransition(
      opacity: Tween<double>(
        begin: 0.0,
        end: 1.0,
      ).animate(CurvedAnimation(
        parent: kAlwaysCompleteAnimation,
        curve: curve ?? AnimationConfig.easeInOut,
      )),
      child: child,
    );
  }

  /// Scale transition
  static Widget scale({
    required Widget child,
    Duration? duration,
    Curve? curve,
    double? beginScale,
    double? endScale,
  }) {
    return ScaleTransition(
      scale: Tween<double>(
        begin: beginScale ?? 0.0,
        end: endScale ?? 1.0,
      ).animate(CurvedAnimation(
        parent: kAlwaysCompleteAnimation,
        curve: curve ?? AnimationConfig.backOut,
      )),
      child: child,
    );
  }

  /// Rotation transition
  static Widget rotation({
    required Widget child,
    Duration? duration,
    Curve? curve,
    double? beginRotation,
    double? endRotation,
  }) {
    return RotationTransition(
      turns: Tween<double>(
        begin: beginRotation ?? 0.0,
        end: endRotation ?? 1.0,
      ).animate(CurvedAnimation(
        parent: kAlwaysCompleteAnimation,
        curve: curve ?? AnimationConfig.easeInOut,
      )),
      child: child,
    );
  }

  /// Combined slide and fade transition
  static Widget slideAndFade({
    required Widget child,
    Duration? duration,
    Curve? curve,
    Offset? slideOffset,
  }) {
    return SlideTransition(
      position: Tween<Offset>(
        begin: slideOffset ?? const Offset(1.0, 0.0),
        end: Offset.zero,
      ).animate(CurvedAnimation(
        parent: kAlwaysCompleteAnimation,
        curve: curve ?? AnimationConfig.easeInOut,
      )),
      child: FadeTransition(
        opacity: Tween<double>(
          begin: 0.0,
          end: 1.0,
        ).animate(CurvedAnimation(
          parent: kAlwaysCompleteAnimation,
          curve: curve ?? AnimationConfig.easeInOut,
        )),
        child: child,
      ),
    );
  }

  /// Combined scale and fade transition
  static Widget scaleAndFade({
    required Widget child,
    Duration? duration,
    Curve? curve,
    double? beginScale,
    double? endScale,
  }) {
    return ScaleTransition(
      scale: Tween<double>(
        begin: beginScale ?? 0.0,
        end: endScale ?? 1.0,
      ).animate(CurvedAnimation(
        parent: kAlwaysCompleteAnimation,
        curve: curve ?? AnimationConfig.backOut,
      )),
      child: FadeTransition(
        opacity: Tween<double>(
          begin: 0.0,
          end: 1.0,
        ).animate(CurvedAnimation(
          parent: kAlwaysCompleteAnimation,
          curve: curve ?? AnimationConfig.easeInOut,
        )),
        child: child,
      ),
    );
  }

  /// Bounce transition
  static Widget bounce({
    required Widget child,
    Duration? duration,
    Curve? curve,
  }) {
    return BounceIn(
      duration: duration ?? AnimationConfig.slow,
      curve: curve ?? AnimationConfig.bounceIn,
      child: child,
    );
  }

  /// Elastic transition
  static Widget elastic({
    required Widget child,
    Duration? duration,
    Curve? curve,
  }) {
    return ElasticIn(
      duration: duration ?? AnimationConfig.verySlow,
      curve: curve ?? AnimationConfig.elasticIn,
      child: child,
    );
  }

  /// Zoom transition
  static Widget zoom({
    required Widget child,
    Duration? duration,
    Curve? curve,
  }) {
    return ZoomIn(
      duration: duration ?? AnimationConfig.normal,
      curve: curve ?? AnimationConfig.backOut,
      child: child,
    );
  }

  /// Flip transition
  static Widget flip({
    required Widget child,
    Duration? duration,
    Curve? curve,
  }) {
    return FlipInX(
      duration: duration ?? AnimationConfig.normal,
      curve: curve ?? AnimationConfig.easeInOut,
      child: child,
    );
  }

  /// Custom page route with transition
  static PageRouteBuilder customRoute({
    required Widget child,
    required String transitionType,
    Duration? duration,
    Curve? curve,
    Offset? slideOffset,
    double? beginScale,
    double? endScale,
    double? beginRotation,
    double? endRotation,
  }) {
    return PageRouteBuilder(
      pageBuilder: (context, animation, secondaryAnimation) => child,
      transitionDuration: duration ?? AnimationConfig.pageTransition,
      reverseTransitionDuration: duration ?? AnimationConfig.pageTransition,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        final curvedAnimation = CurvedAnimation(
          parent: animation,
          curve: curve ?? AnimationConfig.easeInOut,
        );

        switch (transitionType) {
          case 'slideRight':
            return slideRightToLeft(
              child: child,
              curve: curvedAnimation.curve,
            );
          case 'slideLeft':
            return slideLeftToRight(
              child: child,
              curve: curvedAnimation.curve,
            );
          case 'slideUp':
            return slideBottomToTop(
              child: child,
              curve: curvedAnimation.curve,
            );
          case 'slideDown':
            return slideTopToBottom(
              child: child,
              curve: curvedAnimation.curve,
            );
          case 'fade':
            return fade(
              child: child,
              curve: curvedAnimation.curve,
            );
          case 'scale':
            return scale(
              child: child,
              curve: curvedAnimation.curve,
              beginScale: beginScale,
              endScale: endScale,
            );
          case 'rotation':
            return rotation(
              child: child,
              curve: curvedAnimation.curve,
              beginRotation: beginRotation,
              endRotation: endRotation,
            );
          case 'slideAndFade':
            return slideAndFade(
              child: child,
              curve: curvedAnimation.curve,
              slideOffset: slideOffset,
            );
          case 'scaleAndFade':
            return scaleAndFade(
              child: child,
              curve: curvedAnimation.curve,
              beginScale: beginScale,
              endScale: endScale,
            );
          case 'bounce':
            return bounce(
              child: child,
              curve: curvedAnimation.curve,
            );
          case 'elastic':
            return elastic(
              child: child,
              curve: curvedAnimation.curve,
            );
          case 'zoom':
            return zoom(
              child: child,
              curve: curvedAnimation.curve,
            );
          case 'flip':
            return flip(
              child: child,
              curve: curvedAnimation.curve,
            );
          default:
            return slideRightToLeft(
              child: child,
              curve: curvedAnimation.curve,
            );
        }
      },
    );
  }
}

/// Custom page route with animation
class AnimatedPageRoute<T> extends PageRouteBuilder<T> {
  final Widget child;
  final String transitionType;
  final Duration? duration;
  final Curve? curve;
  final Offset? slideOffset;
  final double? beginScale;
  final double? endScale;
  final double? beginRotation;
  final double? endRotation;

  AnimatedPageRoute({
    required this.child,
    this.transitionType = 'slideRight',
    this.duration,
    this.curve,
    this.slideOffset,
    this.beginScale,
    this.endScale,
    this.beginRotation,
    this.endRotation,
  }) : super(
          pageBuilder: (context, animation, secondaryAnimation) => child,
          transitionDuration: duration ?? AnimationConfig.pageTransition,
          reverseTransitionDuration: duration ?? AnimationConfig.pageTransition,
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            return PageTransitions.customRoute(
              child: child,
              transitionType: transitionType,
              duration: duration,
              curve: curve,
              slideOffset: slideOffset,
              beginScale: beginScale,
              endScale: endScale,
              beginRotation: beginRotation,
              endRotation: endRotation,
            );
          },
        );
}

/// Modal transition animations
class ModalTransitions {
  /// Slide up modal transition
  static Widget slideUp({
    required Widget child,
    Duration? duration,
    Curve? curve,
  }) {
    return SlideTransition(
      position: Tween<Offset>(
        begin: const Offset(0.0, 1.0),
        end: Offset.zero,
      ).animate(CurvedAnimation(
        parent: kAlwaysCompleteAnimation,
        curve: curve ?? AnimationConfig.easeOut,
      )),
      child: child,
    );
  }

  /// Slide down modal transition
  static Widget slideDown({
    required Widget child,
    Duration? duration,
    Curve? curve,
  }) {
    return SlideTransition(
      position: Tween<Offset>(
        begin: const Offset(0.0, -1.0),
        end: Offset.zero,
      ).animate(CurvedAnimation(
        parent: kAlwaysCompleteAnimation,
        curve: curve ?? AnimationConfig.easeOut,
      )),
      child: child,
    );
  }

  /// Scale modal transition
  static Widget scale({
    required Widget child,
    Duration? duration,
    Curve? curve,
  }) {
    return ScaleTransition(
      scale: Tween<double>(
        begin: 0.0,
        end: 1.0,
      ).animate(CurvedAnimation(
        parent: kAlwaysCompleteAnimation,
        curve: curve ?? AnimationConfig.backOut,
      )),
      child: child,
    );
  }

  /// Fade modal transition
  static Widget fade({
    required Widget child,
    Duration? duration,
    Curve? curve,
  }) {
    return FadeTransition(
      opacity: Tween<double>(
        begin: 0.0,
        end: 1.0,
      ).animate(CurvedAnimation(
        parent: kAlwaysCompleteAnimation,
        curve: curve ?? AnimationConfig.easeInOut,
      )),
      child: child,
    );
  }

  /// Combined slide and scale modal transition
  static Widget slideAndScale({
    required Widget child,
    Duration? duration,
    Curve? curve,
  }) {
    return SlideTransition(
      position: Tween<Offset>(
        begin: const Offset(0.0, 1.0),
        end: Offset.zero,
      ).animate(CurvedAnimation(
        parent: kAlwaysCompleteAnimation,
        curve: curve ?? AnimationConfig.easeOut,
      )),
      child: ScaleTransition(
        scale: Tween<double>(
          begin: 0.8,
          end: 1.0,
        ).animate(CurvedAnimation(
          parent: kAlwaysCompleteAnimation,
          curve: curve ?? AnimationConfig.backOut,
        )),
        child: child,
      ),
    );
  }
}

/// Bottom sheet transition animations
class BottomSheetTransitions {
  /// Slide up bottom sheet transition
  static Widget slideUp({
    required Widget child,
    Duration? duration,
    Curve? curve,
  }) {
    return SlideTransition(
      position: Tween<Offset>(
        begin: const Offset(0.0, 1.0),
        end: Offset.zero,
      ).animate(CurvedAnimation(
        parent: kAlwaysCompleteAnimation,
        curve: curve ?? AnimationConfig.easeOut,
      )),
      child: child,
    );
  }

  /// Scale bottom sheet transition
  static Widget scale({
    required Widget child,
    Duration? duration,
    Curve? curve,
  }) {
    return ScaleTransition(
      scale: Tween<double>(
        begin: 0.0,
        end: 1.0,
      ).animate(CurvedAnimation(
        parent: kAlwaysCompleteAnimation,
        curve: curve ?? AnimationConfig.backOut,
      )),
      child: child,
    );
  }

  /// Fade bottom sheet transition
  static Widget fade({
    required Widget child,
    Duration? duration,
    Curve? curve,
  }) {
    return FadeTransition(
      opacity: Tween<double>(
        begin: 0.0,
        end: 1.0,
      ).animate(CurvedAnimation(
        parent: kAlwaysCompleteAnimation,
        curve: curve ?? AnimationConfig.easeInOut,
      )),
      child: child,
    );
  }
}

/// Dialog transition animations
class DialogTransitions {
  /// Scale dialog transition
  static Widget scale({
    required Widget child,
    Duration? duration,
    Curve? curve,
  }) {
    return ScaleTransition(
      scale: Tween<double>(
        begin: 0.0,
        end: 1.0,
      ).animate(CurvedAnimation(
        parent: kAlwaysCompleteAnimation,
        curve: curve ?? AnimationConfig.backOut,
      )),
      child: child,
    );
  }

  /// Fade dialog transition
  static Widget fade({
    required Widget child,
    Duration? duration,
    Curve? curve,
  }) {
    return FadeTransition(
      opacity: Tween<double>(
        begin: 0.0,
        end: 1.0,
      ).animate(CurvedAnimation(
        parent: kAlwaysCompleteAnimation,
        curve: curve ?? AnimationConfig.easeInOut,
      )),
      child: child,
    );
  }

  /// Bounce dialog transition
  static Widget bounce({
    required Widget child,
    Duration? duration,
    Curve? curve,
  }) {
    return BounceIn(
      duration: duration ?? AnimationConfig.slow,
      curve: curve ?? AnimationConfig.bounceIn,
      child: child,
    );
  }

  /// Elastic dialog transition
  static Widget elastic({
    required Widget child,
    Duration? duration,
    Curve? curve,
  }) {
    return ElasticIn(
      duration: duration ?? AnimationConfig.verySlow,
      curve: curve ?? AnimationConfig.elasticIn,
      child: child,
    );
  }
}


