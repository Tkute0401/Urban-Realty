import 'package:flutter/material.dart';

class PropertyContactSection extends StatelessWidget {
  final VoidCallback? onContact;
  final VoidCallback? onInquiry;

  const PropertyContactSection({
    super.key,
    this.onContact,
    this.onInquiry,
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
            Text(
              'Interested in this property?',
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Get in touch with our agent for more information and to schedule a viewing.',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: onContact ?? () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Contact functionality coming soon!')),
                  );
                },
                icon: const Icon(Icons.phone),
                label: const Text('Contact Agent'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: onInquiry ?? () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Inquiry functionality coming soon!')),
                  );
                },
                icon: const Icon(Icons.message),
                label: const Text('Send Inquiry'),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}