import 'package:flutter/material.dart';

class RecentActivityCard extends StatelessWidget {
  final String title;
  final List<Map<String, dynamic>> activities;
  final VoidCallback? onViewAll;
  final Widget Function(Map<String, dynamic> activity)? itemBuilder;

  const RecentActivityCard({
    super.key,
    required this.title,
    required this.activities,
    this.onViewAll,
    this.itemBuilder,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: theme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                if (onViewAll != null)
                  TextButton(
                    onPressed: onViewAll,
                    child: const Text('View All'),
                  ),
              ],
            ),
            const SizedBox(height: 16),
            if (activities.isEmpty)
              Center(
                child: Padding(
                  padding: const EdgeInsets.all(32),
                  child: Column(
                    children: [
                      Icon(
                        Icons.inbox_outlined,
                        size: 48,
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'No recent activity',
                        style: theme.textTheme.bodyLarge?.copyWith(
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                ),
              )
            else
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: activities.length > 5 ? 5 : activities.length,
                separatorBuilder: (context, index) => const Divider(height: 1),
                itemBuilder: (context, index) {
                  final activity = activities[index];
                  return itemBuilder?.call(activity) ?? _defaultItemBuilder(context, activity);
                },
              ),
          ],
        ),
      ),
    );
  }

  Widget _defaultItemBuilder(BuildContext context, Map<String, dynamic> activity) {
    final theme = Theme.of(context);
    
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: CircleAvatar(
        backgroundColor: theme.colorScheme.primary.withOpacity(0.1),
        child: Icon(
          _getIconForType(activity['type'] ?? ''),
          color: theme.colorScheme.primary,
          size: 20,
        ),
      ),
      title: Text(
        activity['title'] ?? '',
        style: theme.textTheme.bodyMedium?.copyWith(
          fontWeight: FontWeight.w500,
        ),
      ),
      subtitle: Text(
        activity['subtitle'] ?? '',
        style: theme.textTheme.bodySmall?.copyWith(
          color: theme.colorScheme.onSurfaceVariant,
        ),
      ),
      trailing: Text(
        activity['time'] ?? '',
        style: theme.textTheme.bodySmall?.copyWith(
          color: theme.colorScheme.onSurfaceVariant,
        ),
      ),
    );
  }

  IconData _getIconForType(String type) {
    switch (type.toLowerCase()) {
      case 'user':
        return Icons.person;
      case 'property':
        return Icons.home;
      case 'contact':
        return Icons.contact_mail;
      case 'inquiry':
        return Icons.inbox;
      case 'subscription':
        return Icons.payment;
      default:
        return Icons.notifications;
    }
  }
}