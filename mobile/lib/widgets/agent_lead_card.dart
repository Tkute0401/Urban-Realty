import "package:flutter/material.dart";

class AgentLeadCard extends StatelessWidget {
  final Map<String, dynamic> lead;
  final VoidCallback? onTap;

  const AgentLeadCard({
    super.key,
    required this.lead,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Card(
      elevation: 2,
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    backgroundColor: theme.colorScheme.primary,
                    child: Text(
                      (lead["name"] ?? "")[0].toUpperCase(),
                      style: TextStyle(
                        color: theme.colorScheme.onPrimary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          lead["name"] ?? "",
                          style: theme.textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          lead["email"] ?? "",
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getStatusColor(lead["status"]),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      lead["status"] ?? "",
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              if (lead["phone"] != null) ...[
                const SizedBox(height: 12),
                Row(
                  children: [
                    Icon(
                      Icons.phone,
                      size: 16,
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      lead["phone"] ?? "",
                      style: theme.textTheme.bodyMedium,
                    ),
                  ],
                ),
              ],
              if (lead["property"] != null) ...[
                const SizedBox(height: 8),
                Row(
                  children: [
                    Icon(
                      Icons.home,
                      size: 16,
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        lead["property"] ?? "",
                        style: theme.textTheme.bodyMedium?.copyWith(
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
              if (lead["message"] != null) ...[
                const SizedBox(height: 12),
                Text(
                  lead["message"] ?? "",
                  style: theme.textTheme.bodyMedium,
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
              const SizedBox(height: 8),
              Text(
                _formatDate(lead["createdAt"]),
                style: theme.textTheme.bodySmall?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Color _getStatusColor(String? status) {
    switch (status?.toLowerCase()) {
      case "new":
        return Colors.blue;
      case "contacted":
        return Colors.orange;
      case "responded":
        return Colors.green;
      case "converted":
        return Colors.purple;
      default:
        return Colors.grey;
    }
  }

  String _formatDate(dynamic date) {
    try {
      final dt = date is DateTime ? date : DateTime.tryParse(date.toString());
      if (dt == null) return "Unknown date";
      return "${dt.day}/${dt.month}/${dt.year} at ${dt.hour}:${dt.minute}";
    } catch (_) {
      return "Unknown date";
    }
  }
}
