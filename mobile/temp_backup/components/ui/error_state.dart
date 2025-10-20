import 'package:flutter/material.dart';
import '../../config/design_tokens.dart';

/// ErrorState - For error scenarios with retry
class ErrorState extends StatelessWidget {
  final String title;
  final String? description;
  final IconData? icon;
  final Widget? action;
  final VoidCallback? onRetry;
  final String? retryText;
  final ErrorStateType type;
  final String? errorCode;

  const ErrorState({
    super.key,
    required this.title,
    this.description,
    this.icon,
    this.action,
    this.onRetry,
    this.retryText,
    this.type = ErrorStateType.generic,
    this.errorCode,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(DesignTokens.space8),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _buildIcon(theme),
            const SizedBox(height: DesignTokens.space6),
            Text(
              title,
              style: theme.textTheme.headlineSmall?.copyWith(
                color: theme.colorScheme.error,
                fontWeight: DesignTokens.fontWeightSemibold,
              ),
              textAlign: TextAlign.center,
            ),
            if (description != null) ...[
              const SizedBox(height: DesignTokens.space4),
              Text(
                description!,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
                textAlign: TextAlign.center,
              ),
            ],
            if (errorCode != null) ...[
              const SizedBox(height: DesignTokens.space2),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: DesignTokens.space3,
                  vertical: DesignTokens.space1,
                ),
                decoration: BoxDecoration(
                  color: theme.colorScheme.errorContainer,
                  borderRadius: BorderRadius.circular(DesignTokens.radiusSm),
                ),
                child: Text(
                  'Error Code: $errorCode',
                  style: theme.textTheme.labelSmall?.copyWith(
                    color: theme.colorScheme.onErrorContainer,
                    fontFamily: 'monospace',
                  ),
                ),
              ),
            ],
            if (action != null || (onRetry != null && retryText != null)) ...[
              const SizedBox(height: DesignTokens.space8),
              action ?? _buildRetryButton(theme),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildIcon(ThemeData theme) {
    return Container(
      width: 120,
      height: 120,
      decoration: BoxDecoration(
        color: theme.colorScheme.errorContainer,
        shape: BoxShape.circle,
      ),
      child: Icon(
        icon ?? _getDefaultIcon(),
        size: DesignTokens.iconSize3xl,
        color: theme.colorScheme.error,
      ),
    );
  }

  Widget _buildRetryButton(ThemeData theme) {
    return Column(
      children: [
        ElevatedButton(
          onPressed: onRetry,
          style: ElevatedButton.styleFrom(
            backgroundColor: theme.colorScheme.error,
            foregroundColor: theme.colorScheme.onError,
            padding: const EdgeInsets.symmetric(
              horizontal: DesignTokens.space8,
              vertical: DesignTokens.space5,
            ),
          ),
          child: Text(retryText!),
        ),
        const SizedBox(height: DesignTokens.space4),
        TextButton(
          onPressed: () {
            // Navigate back or to home
            // Note: This would need to be passed as a callback parameter
          },
          child: const Text('Go Back'),
        ),
      ],
    );
  }

  IconData _getDefaultIcon() {
    return switch (type) {
      ErrorStateType.generic => Icons.error_outline,
      ErrorStateType.network => Icons.wifi_off,
      ErrorStateType.server => Icons.dns_outlined,
      ErrorStateType.notFound => Icons.search_off,
      ErrorStateType.unauthorized => Icons.lock_outline,
      ErrorStateType.forbidden => Icons.block,
      ErrorStateType.validation => Icons.warning_outlined,
      ErrorStateType.timeout => Icons.schedule,
      ErrorStateType.loading => Icons.hourglass_empty,
      ErrorStateType.permission => Icons.security,
      ErrorStateType.payment => Icons.payment,
      ErrorStateType.subscription => Icons.subscriptions,
      ErrorStateType.upload => Icons.cloud_upload_outlined,
      ErrorStateType.download => Icons.cloud_download_outlined,
    };
  }
}

enum ErrorStateType {
  generic,
  network,
  server,
  notFound,
  unauthorized,
  forbidden,
  validation,
  timeout,
  loading,
  permission,
  payment,
  subscription,
  upload,
  download,
}

/// ErrorState variants for common use cases
class ErrorStateVariants {
  /// Network error
  static Widget networkError({VoidCallback? onRetry}) {
    return ErrorState(
      title: 'Connection Error',
      description: 'Please check your internet connection and try again.',
      type: ErrorStateType.network,
      onRetry: onRetry,
      retryText: 'Retry',
    );
  }

  /// Server error
  static Widget serverError({VoidCallback? onRetry, String? errorCode}) {
    return ErrorState(
      title: 'Server Error',
      description: 'Something went wrong on our end. Please try again later.',
      type: ErrorStateType.server,
      onRetry: onRetry,
      retryText: 'Retry',
      errorCode: errorCode,
    );
  }

  /// Not found error
  static Widget notFound({VoidCallback? onGoHome}) {
    return ErrorState(
      title: 'Page Not Found',
      description: 'The page you\'re looking for doesn\'t exist.',
      type: ErrorStateType.notFound,
      onRetry: onGoHome,
      retryText: 'Go Home',
    );
  }

  /// Unauthorized error
  static Widget unauthorized({VoidCallback? onLogin}) {
    return ErrorState(
      title: 'Access Denied',
      description: 'Please log in to continue.',
      type: ErrorStateType.unauthorized,
      onRetry: onLogin,
      retryText: 'Log In',
    );
  }

  /// Forbidden error
  static Widget forbidden({VoidCallback? onGoBack}) {
    return ErrorState(
      title: 'Access Forbidden',
      description: 'You don\'t have permission to access this resource.',
      type: ErrorStateType.forbidden,
      onRetry: onGoBack,
      retryText: 'Go Back',
    );
  }

  /// Validation error
  static Widget validationError({
    required String message,
    VoidCallback? onRetry,
  }) {
    return ErrorState(
      title: 'Validation Error',
      description: message,
      type: ErrorStateType.validation,
      onRetry: onRetry,
      retryText: 'Try Again',
    );
  }

  /// Timeout error
  static Widget timeoutError({VoidCallback? onRetry}) {
    return ErrorState(
      title: 'Request Timeout',
      description: 'The request took too long to complete. Please try again.',
      type: ErrorStateType.timeout,
      onRetry: onRetry,
      retryText: 'Retry',
    );
  }

  /// Loading error
  static Widget loadingError({VoidCallback? onRetry}) {
    return ErrorState(
      title: 'Loading Failed',
      description: 'Failed to load data. Please try again.',
      type: ErrorStateType.loading,
      onRetry: onRetry,
      retryText: 'Retry',
    );
  }

  /// Permission error
  static Widget permissionError({
    required String permission,
    VoidCallback? onGrant,
  }) {
    return ErrorState(
      title: 'Permission Required',
      description: 'Please grant $permission permission to continue.',
      type: ErrorStateType.permission,
      onRetry: onGrant,
      retryText: 'Grant Permission',
    );
  }

  /// Payment error
  static Widget paymentError({VoidCallback? onRetry}) {
    return ErrorState(
      title: 'Payment Failed',
      description: 'Your payment could not be processed. Please try again.',
      type: ErrorStateType.payment,
      onRetry: onRetry,
      retryText: 'Retry Payment',
    );
  }

  /// Subscription error
  static Widget subscriptionError({VoidCallback? onManage}) {
    return ErrorState(
      title: 'Subscription Error',
      description: 'There was an issue with your subscription. Please manage it.',
      type: ErrorStateType.subscription,
      onRetry: onManage,
      retryText: 'Manage Subscription',
    );
  }

  /// Upload error
  static Widget uploadError({VoidCallback? onRetry}) {
    return ErrorState(
      title: 'Upload Failed',
      description: 'Failed to upload file. Please try again.',
      type: ErrorStateType.upload,
      onRetry: onRetry,
      retryText: 'Retry Upload',
    );
  }

  /// Download error
  static Widget downloadError({VoidCallback? onRetry}) {
    return ErrorState(
      title: 'Download Failed',
      description: 'Failed to download file. Please try again.',
      type: ErrorStateType.download,
      onRetry: onRetry,
      retryText: 'Retry Download',
    );
  }

  /// Generic error with custom message
  static Widget customError({
    required String title,
    required String description,
    VoidCallback? onRetry,
    String? retryText,
    String? errorCode,
  }) {
    return ErrorState(
      title: title,
      description: description,
      type: ErrorStateType.generic,
      onRetry: onRetry,
      retryText: retryText ?? 'Retry',
      errorCode: errorCode,
    );
  }
}
