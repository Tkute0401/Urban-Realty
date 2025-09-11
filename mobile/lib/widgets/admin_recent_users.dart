import "package:flutter/material.dart";

class AdminRecentUsers extends StatelessWidget {
  final List<dynamic> users;

  const AdminRecentUsers({
    super.key,
    required this.users,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    if (users.isEmpty) {
      return Card(
        elevation: 2,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Center(
            child: Text(
              "No recent users",
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
            ),
          ),
        ),
      );
    }

    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Recent Users",
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: users.length,
              itemBuilder: (context, index) {
                final user = users[index];
                return ListTile(
                  leading: CircleAvatar(
                    backgroundColor: user["role"] == "agent" 
                        ? theme.colorScheme.secondary 
                        : theme.colorScheme.primary,
                    child: Text(
                      (user["name"] ?? "")[0].toUpperCase(),
                      style: TextStyle(
                        color: user["role"] == "agent" 
                            ? theme.colorScheme.onSecondary 
                            : theme.colorScheme.onPrimary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  title: Text(
                    user["name"] ?? "",
                    style: theme.textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  subtitle: Text(
                    user["email"] ?? "",
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                  trailing: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: user["role"] == "agent" 
                          ? theme.colorScheme.secondary 
                          : theme.colorScheme.primary,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      user["role"] ?? "",
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: user["role"] == "agent" 
                            ? theme.colorScheme.onSecondary 
                            : theme.colorScheme.onPrimary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
