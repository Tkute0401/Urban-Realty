import 'package:flutter/material.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final List<NotificationItem> _notifications = [
    NotificationItem(
      id: '1',
      title: 'Property Viewing Scheduled',
      message: 'Your property viewing for "Luxury Villa in Bandra" has been scheduled for tomorrow at 2:00 PM.',
      type: NotificationType.info,
      timestamp: DateTime.now().subtract(const Duration(hours: 2)),
      isRead: false,
    ),
    NotificationItem(
      id: '2',
      title: 'Price Update',
      message: 'The price for "Modern Apartment in Andheri" has been updated to ₹85,00,000.',
      type: NotificationType.price,
      timestamp: DateTime.now().subtract(const Duration(days: 1)),
      isRead: false,
    ),
    NotificationItem(
      id: '3',
      title: 'New Property Match',
      message: 'We found a new property that matches your criteria: "Spacious 3BHK in Powai".',
      type: NotificationType.match,
      timestamp: DateTime.now().subtract(const Duration(days: 2)),
      isRead: true,
    ),
    NotificationItem(
      id: '4',
      title: 'Agent Response',
      message: 'Agent Sarah has responded to your inquiry about "Beachfront Villa in Goa".',
      type: NotificationType.message,
      timestamp: DateTime.now().subtract(const Duration(days: 3)),
      isRead: true,
    ),
    NotificationItem(
      id: '5',
      title: 'Document Upload Required',
      message: 'Please upload your income proof documents to complete your loan application.',
      type: NotificationType.urgent,
      timestamp: DateTime.now().subtract(const Duration(days: 4)),
      isRead: true,
    ),
  ];

  bool _showOnlyUnread = false;

  List<NotificationItem> get _filteredNotifications {
    if (_showOnlyUnread) {
      return _notifications.where((notification) => !notification.isRead).toList();
    }
    return _notifications;
  }

  void _markAsRead(String id) {
    setState(() {
      final notification = _notifications.firstWhere((n) => n.id == id);
      notification.isRead = true;
    });
  }

  void _markAllAsRead() {
    setState(() {
      for (final notification in _notifications) {
        notification.isRead = true;
      }
    });
  }

  void _deleteNotification(String id) {
    setState(() {
      _notifications.removeWhere((n) => n.id == id);
    });
  }

  String _getTimeAgo(DateTime timestamp) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);

    if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'Just now';
    }
  }

  IconData _getNotificationIcon(NotificationType type) {
    switch (type) {
      case NotificationType.info:
        return Icons.info_outline;
      case NotificationType.price:
        return Icons.attach_money;
      case NotificationType.match:
        return Icons.home_outlined;
      case NotificationType.message:
        return Icons.message_outlined;
      case NotificationType.urgent:
        return Icons.priority_high;
    }
  }

  Color _getNotificationColor(NotificationType type, ThemeData theme) {
    switch (type) {
      case NotificationType.info:
        return theme.colorScheme.primary;
      case NotificationType.price:
        return theme.colorScheme.tertiary;
      case NotificationType.match:
        return theme.colorScheme.secondary;
      case NotificationType.message:
        return theme.colorScheme.primary;
      case NotificationType.urgent:
        return theme.colorScheme.error;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          if (_notifications.any((n) => !n.isRead))
            TextButton(
              onPressed: _markAllAsRead,
              child: const Text('Mark All Read'),
            ),
        ],
      ),
      body: Column(
        children: [
          // Filter Toggle
          Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: theme.colorScheme.surfaceVariant,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.filter_list,
                  color: theme.colorScheme.onSurfaceVariant,
                ),
                const SizedBox(width: 12),
                Text(
                  'Show only unread',
                  style: theme.textTheme.titleMedium,
                ),
                const Spacer(),
                Switch(
                  value: _showOnlyUnread,
                  onChanged: (value) {
                    setState(() {
                      _showOnlyUnread = value;
                    });
                  },
                ),
              ],
            ),
          ),
          
          // Notifications List
          Expanded(
            child: _filteredNotifications.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.notifications_none,
                          size: 64,
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          _showOnlyUnread ? 'No unread notifications' : 'No notifications',
                          style: theme.textTheme.titleLarge?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _showOnlyUnread 
                              ? 'You\'re all caught up!'
                              : 'You\'ll see important updates here',
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: _filteredNotifications.length,
                    itemBuilder: (context, index) {
                      final notification = _filteredNotifications[index];
                      return Dismissible(
                        key: Key(notification.id),
                        direction: DismissDirection.endToStart,
                        background: Container(
                          alignment: Alignment.centerRight,
                          padding: const EdgeInsets.only(right: 20),
                          color: theme.colorScheme.error,
                          child: Icon(
                            Icons.delete,
                            color: theme.colorScheme.onError,
                          ),
                        ),
                        onDismissed: (_) => _deleteNotification(notification.id),
                        child: Card(
                          margin: const EdgeInsets.only(bottom: 12),
                          child: ListTile(
                            contentPadding: const EdgeInsets.all(16),
                            leading: Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                color: _getNotificationColor(notification.type, theme).withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Icon(
                                _getNotificationIcon(notification.type),
                                color: _getNotificationColor(notification.type, theme),
                                size: 24,
                              ),
                            ),
                            title: Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    notification.title,
                                    style: theme.textTheme.titleMedium?.copyWith(
                                      fontWeight: notification.isRead ? FontWeight.normal : FontWeight.w600,
                                    ),
                                  ),
                                ),
                                if (!notification.isRead)
                                  Container(
                                    width: 8,
                                    height: 8,
                                    decoration: BoxDecoration(
                                      color: theme.colorScheme.primary,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                              ],
                            ),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const SizedBox(height: 8),
                                Text(
                                  notification.message,
                                  style: theme.textTheme.bodyMedium?.copyWith(
                                    color: theme.colorScheme.onSurfaceContainerHighest,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    Icon(
                                      Icons.access_time,
                                      size: 16,
                                      color: theme.colorScheme.onSurfaceVariant,
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      _getTimeAgo(notification.timestamp),
                                      style: theme.textTheme.bodySmall?.copyWith(
                                        color: const Color(0xFF6B7280),
                                      ),
                                    ),
                                    const Spacer(),
                                    if (!notification.isRead)
                                      TextButton(
                                        onPressed: () => _markAsRead(notification.id),
                                        child: const Text('Mark as Read'),
                                      ),
                                  ],
                                ),
                              ],
                            ),
                            onTap: () {
                              if (!notification.isRead) {
                                _markAsRead(notification.id);
                              }
                              // Handle notification tap based on type
                              _handleNotificationTap(notification);
                            },
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  void _handleNotificationTap(NotificationItem notification) {
    // Handle different notification types
    switch (notification.type) {
      case NotificationType.info:
        // Navigate to property details or viewing schedule
        break;
      case NotificationType.price:
        // Navigate to property details
        break;
      case NotificationType.match:
        // Navigate to new property
        break;
      case NotificationType.message:
        // Navigate to chat/messages
        break;
      case NotificationType.urgent:
        // Navigate to document upload or urgent action
        break;
    }
    
    // Show a snackbar for now
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Handling ${notification.title}'),
        duration: const Duration(seconds: 2),
      ),
    );
  }
}

enum NotificationType {
  info,
  price,
  match,
  message,
  urgent,
}

class NotificationItem {
  final String id;
  final String title;
  final String message;
  final NotificationType type;
  final DateTime timestamp;
  bool isRead;

  NotificationItem({
    required this.id,
    required this.title,
    required this.message,
    required this.type,
    required this.timestamp,
    this.isRead = false,
  });
}