import 'package:flutter/material.dart';

/// Animation configuration for consistent animations across the app
class AnimationConfig {
  // Durations
  static const Duration fast = Duration(milliseconds: 150);
  static const Duration normal = Duration(milliseconds: 300);
  static const Duration slow = Duration(milliseconds: 500);
  static const Duration verySlow = Duration(milliseconds: 800);
  
  // Curves
  static const Curve easeIn = Curves.easeIn;
  static const Curve easeOut = Curves.easeOut;
  static const Curve easeInOut = Curves.easeInOut;
  static const Curve bounceIn = Curves.bounceIn;
  static const Curve bounceOut = Curves.bounceOut;
  static const Curve elasticIn = Curves.elasticIn;
  static const Curve elasticOut = Curves.elasticOut;
  static const Curve fastOutSlowIn = Curves.fastOutSlowIn;
  static const Curve decelerate = Curves.decelerate;
  static const Curve accelerate = Curves.easeIn;
  
  // Common animation configurations
  static const Duration fadeInDuration = fast;
  static const Duration fadeOutDuration = fast;
  static const Duration slideInDuration = normal;
  static const Duration slideOutDuration = normal;
  static const Duration scaleInDuration = normal;
  static const Duration scaleOutDuration = normal;
  static const Duration rotationDuration = normal;
  
  // Page transition durations
  static const Duration pageTransitionDuration = normal;
  static const Duration modalTransitionDuration = normal;
  static const Duration bottomSheetTransitionDuration = normal;
  
  // Button animation durations
  static const Duration buttonPressDuration = fast;
  static const Duration buttonHoverDuration = fast;
  
  // List animation durations
  static const Duration listItemAnimationDuration = normal;
  static const Duration staggeredAnimationDelay = Duration(milliseconds: 100);
  
  // Loading animation durations
  static const Duration loadingAnimationDuration = Duration(milliseconds: 1200);
  static const Duration shimmerAnimationDuration = Duration(milliseconds: 1500);
  
  // Micro-interaction durations
  static const Duration microInteractionDuration = Duration(milliseconds: 200);
  static const Duration rippleDuration = Duration(milliseconds: 300);
  static const Duration focusDuration = Duration(milliseconds: 200);
  
  // Common curve combinations
  static const Curve fadeInCurve = easeOut;
  static const Curve fadeOutCurve = easeIn;
  static const Curve slideInCurve = easeOut;
  static const Curve slideOutCurve = easeIn;
  static const Curve scaleInCurve = easeOut;
  static const Curve scaleOutCurve = easeIn;
  static const Curve bounceInCurve = bounceIn;
  static const Curve bounceOutCurve = bounceOut;
  
  // Page transition curves
  static const Curve pageTransitionCurve = fastOutSlowIn;
  static const Curve modalTransitionCurve = fastOutSlowIn;
  static const Curve bottomSheetTransitionCurve = fastOutSlowIn;
  
  // Button animation curves
  static const Curve buttonPressCurve = easeInOut;
  static const Curve buttonHoverCurve = easeInOut;
  
  // List animation curves
  static const Curve listItemAnimationCurve = easeOut;
  static const Curve staggeredAnimationCurve = easeOut;
  
  // Loading animation curves
  static const Curve loadingAnimationCurve = easeInOut;
  static const Curve shimmerAnimationCurve = easeInOut;
  
  // Micro-interaction curves
  static const Curve microInteractionCurve = easeInOut;
  static const Curve rippleCurve = easeOut;
  static const Curve focusCurve = easeInOut;
}
