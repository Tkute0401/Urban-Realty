import 'package:flutter/material.dart';
import '../../config/design_tokens.dart';

/// EmptyState - For no data scenarios
class EmptyState extends StatelessWidget {
  final String title;
  final String? description;
  final IconData? icon;
  final String? imagePath;
  final Widget? action;
  final VoidCallback? onAction;
  final String? actionText;
  final EmptyStateType type;

  const EmptyState({
    super.key,
    required this.title,
    this.description,
    this.icon,
    this.imagePath,
    this.action,
    this.onAction,
    this.actionText,
    this.type = EmptyStateType.generic,
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
                color: theme.colorScheme.onSurface,
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
            if (action != null || (onAction != null && actionText != null)) ...[
              const SizedBox(height: DesignTokens.space8),
              action ?? _buildActionButton(theme),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildIcon(ThemeData theme) {
    if (imagePath != null) {
      return Image.asset(
        imagePath!,
        width: 120,
        height: 120,
        color: theme.colorScheme.onSurfaceVariant.withValues(alpha: 0.5),
      );
    }

    return Container(
      width: 120,
      height: 120,
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerHighest,
        shape: BoxShape.circle,
      ),
      child: Icon(
        icon ?? _getDefaultIcon(),
        size: DesignTokens.iconSize3xl,
        color: theme.colorScheme.onSurfaceVariant.withValues(alpha: 0.5),
      ),
    );
  }

  Widget _buildActionButton(ThemeData theme) {
    return ElevatedButton(
      onPressed: onAction,
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(
          horizontal: DesignTokens.space8,
          vertical: DesignTokens.space5,
        ),
      ),
      child: Text(actionText!),
    );
  }

  IconData _getDefaultIcon() {
    return switch (type) {
      EmptyStateType.generic => Icons.inbox_outlined,
      EmptyStateType.search => Icons.search_off,
      EmptyStateType.favorites => Icons.favorite_border,
      EmptyStateType.properties => Icons.home_outlined,
      EmptyStateType.projects => Icons.business_outlined,
      EmptyStateType.developers => Icons.apartment_outlined,
      EmptyStateType.agents => Icons.person_outline,
      EmptyStateType.leads => Icons.lead_pencil_outlined,
      EmptyStateType.inquiries => Icons.question_answer_outlined,
      EmptyStateType.notifications => Icons.notifications_none,
      EmptyStateType.messages => Icons.message_outlined,
      EmptyStateType.visits => Icons.calendar_today_outlined,
      EmptyStateType.reports => Icons.assessment_outlined,
      EmptyStateType.analytics => Icons.analytics_outlined,
      EmptyStateType.settings => Icons.settings_outlined,
      EmptyStateType.error => Icons.error_outline,
      EmptyStateType.network => Icons.wifi_off_outlined,
    };
  }
}

enum EmptyStateType {
  generic,
  search,
  favorites,
  properties,
  projects,
  developers,
  agents,
  leads,
  inquiries,
  notifications,
  messages,
  visits,
  reports,
  analytics,
  settings,
  error,
  network,
}

/// EmptyState variants for common use cases
class EmptyStateVariants {
  /// No properties found
  static Widget noProperties({VoidCallback? onRefresh}) {
    return EmptyState(
      title: 'No Properties Found',
      description: 'Try adjusting your search criteria or browse all properties.',
      type: EmptyStateType.properties,
      onAction: onRefresh,
      actionText: 'Browse All Properties',
    );
  }

  /// No search results
  static Widget noSearchResults({VoidCallback? onClearFilters}) {
    return EmptyState(
      title: 'No Results Found',
      description: 'Try adjusting your search terms or filters.',
      type: EmptyStateType.search,
      onAction: onClearFilters,
      actionText: 'Clear Filters',
    );
  }

  /// No favorites
  static Widget noFavorites({VoidCallback? onBrowse}) {
    return EmptyState(
      title: 'No Favorites Yet',
      description: 'Start exploring properties and add them to your favorites.',
      type: EmptyStateType.favorites,
      onAction: onBrowse,
      actionText: 'Browse Properties',
    );
  }

  /// No projects
  static Widget noProjects({VoidCallback? onBrowse}) {
    return EmptyState(
      title: 'No Projects Available',
      description: 'Check back later for new project launches.',
      type: EmptyStateType.projects,
      onAction: onBrowse,
      actionText: 'Browse Properties',
    );
  }

  /// No developers
  static Widget noDevelopers({VoidCallback? onRefresh}) {
    return EmptyState(
      title: 'No Developers Found',
      description: 'Try adjusting your search criteria.',
      type: EmptyStateType.developers,
      onAction: onRefresh,
      actionText: 'Refresh',
    );
  }

  /// No agents
  static Widget noAgents({VoidCallback? onRefresh}) {
    return EmptyState(
      title: 'No Agents Available',
      description: 'Try refreshing or contact support for assistance.',
      type: EmptyStateType.agents,
      onAction: onRefresh,
      actionText: 'Refresh',
    );
  }

  /// No leads
  static Widget noLeads({VoidCallback? onRefresh}) {
    return EmptyState(
      title: 'No Leads Yet',
      description: 'Start promoting your properties to get leads.',
      type: EmptyStateType.leads,
      onAction: onRefresh,
      actionText: 'Refresh',
    );
  }

  /// No inquiries
  static Widget noInquiries({VoidCallback? onRefresh}) {
    return EmptyState(
      title: 'No Inquiries',
      description: 'Property inquiries will appear here.',
      type: EmptyStateType.inquiries,
      onAction: onRefresh,
      actionText: 'Refresh',
    );
  }

  /// No notifications
  static Widget noNotifications({VoidCallback? onRefresh}) {
    return EmptyState(
      title: 'No Notifications',
      description: 'You\'re all caught up! New notifications will appear here.',
      type: EmptyStateType.notifications,
      onAction: onRefresh,
      actionText: 'Refresh',
    );
  }

  /// No messages
  static Widget noMessages({VoidCallback? onRefresh}) {
    return EmptyState(
      title: 'No Messages',
      description: 'Your conversations will appear here.',
      type: EmptyStateType.messages,
      onAction: onRefresh,
      actionText: 'Refresh',
    );
  }

  /// No visits
  static Widget noVisits({VoidCallback? onSchedule}) {
    return EmptyState(
      title: 'No Site Visits',
      description: 'Schedule your first property visit.',
      type: EmptyStateType.visits,
      onAction: onSchedule,
      actionText: 'Schedule Visit',
    );
  }

  /// No reports
  static Widget noReports({VoidCallback? onGenerate}) {
    return EmptyState(
      title: 'No Reports Available',
      description: 'Generate your first report to get insights.',
      type: EmptyStateType.reports,
      onAction: onGenerate,
      actionText: 'Generate Report',
    );
  }

  /// No analytics
  static Widget noAnalytics({VoidCallback? onRefresh}) {
    return EmptyState(
      title: 'No Analytics Data',
      description: 'Analytics data will appear here once available.',
      type: EmptyStateType.analytics,
      onAction: onRefresh,
      actionText: 'Refresh',
    );
  }

  /// Network error
  static Widget networkError({VoidCallback? onRetry}) {
    return EmptyState(
      title: 'Connection Error',
      description: 'Please check your internet connection and try again.',
      type: EmptyStateType.network,
      onAction: onRetry,
      actionText: 'Retry',
    );
  }

  /// Generic error
  static Widget error({VoidCallback? onRetry}) {
    return EmptyState(
      title: 'Something Went Wrong',
      description: 'We encountered an error. Please try again.',
      type: EmptyStateType.error,
      onAction: onRetry,
      actionText: 'Try Again',
    );
  }
}
