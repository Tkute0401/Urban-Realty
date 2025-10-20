import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/design_tokens.dart';

class PrivacyPolicyPage extends ConsumerWidget {
  const PrivacyPolicyPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Privacy Policy'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(DesignTokens.spaceLg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Privacy Policy',
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: DesignTokens.spaceSm),
            Text(
              'Last updated: ${DateTime.now().toString().split(' ')[0]}',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
              ),
            ),
            const SizedBox(height: DesignTokens.spaceLg),

            _buildSection(
              context,
              '1. Information We Collect',
              [
                'We collect information you provide directly to us, such as when you create an account, search for properties, or contact us.',
                'Personal information includes your name, email address, phone number, and any other information you choose to provide.',
                'We also collect information about your use of our services, including property searches, favorites, and interactions with our app.',
                'Location information may be collected when you use location-based features of our app.',
              ],
            ),

            _buildSection(
              context,
              '2. How We Use Your Information',
              [
                'To provide, maintain, and improve our services',
                'To process transactions and send related information',
                'To send you technical notices, updates, and support messages',
                'To respond to your comments and questions',
                'To personalize your experience and provide relevant content',
                'To analyze usage patterns and improve our app',
              ],
            ),

            _buildSection(
              context,
              '3. Information Sharing',
              [
                'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent.',
                'We may share your information with service providers who assist us in operating our app and conducting our business.',
                'We may share information when required by law or to protect our rights and safety.',
                'We may share aggregated, non-personally identifiable information for business purposes.',
              ],
            ),

            _buildSection(
              context,
              '4. Data Security',
              [
                'We implement appropriate security measures to protect your personal information.',
                'We use encryption to protect sensitive information transmitted online.',
                'We regularly review our security practices and update them as necessary.',
                'However, no method of transmission over the internet is 100% secure.',
              ],
            ),

            _buildSection(
              context,
              '5. Your Rights',
              [
                'You have the right to access, update, or delete your personal information.',
                'You can opt out of receiving promotional communications from us.',
                'You can control your privacy settings within the app.',
                'You can request a copy of your data or have it deleted.',
              ],
            ),

            _buildSection(
              context,
              '6. Cookies and Tracking',
              [
                'We use cookies and similar technologies to enhance your experience.',
                'You can control cookie settings through your device or browser.',
                'We may use analytics tools to understand how our app is used.',
                'Third-party services may also use cookies on our behalf.',
              ],
            ),

            _buildSection(
              context,
              '7. Children\'s Privacy',
              [
                'Our services are not intended for children under 13 years of age.',
                'We do not knowingly collect personal information from children under 13.',
                'If we become aware that we have collected information from a child under 13, we will delete it promptly.',
                'Parents can contact us if they believe their child has provided personal information.',
              ],
            ),

            _buildSection(
              context,
              '8. Changes to This Policy',
              [
                'We may update this privacy policy from time to time.',
                'We will notify you of any material changes by posting the new policy in our app.',
                'Your continued use of our services after changes constitutes acceptance of the new policy.',
                'We encourage you to review this policy periodically.',
              ],
            ),

            _buildSection(
              context,
              '9. Contact Us',
              [
                'If you have any questions about this privacy policy, please contact us:',
                'Email: privacy@urbanrealty.com',
                'Phone: +1 (555) 123-4567',
                'Address: 123 Real Estate Ave, New York, NY 10001',
              ],
            ),

            const SizedBox(height: DesignTokens.spaceLg),

            // Consent Section
            Container(
              padding: const EdgeInsets.all(DesignTokens.spaceLg),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surfaceVariant,
                borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Your Consent',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: DesignTokens.spaceSm),
                  Text(
                    'By using our app, you consent to the collection and use of information as described in this privacy policy.',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ],
              ),
            ),

            const SizedBox(height: DesignTokens.spaceLg),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(BuildContext context, String title, List<String> points) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.bold,
            color: Theme.of(context).colorScheme.primary,
          ),
        ),
        const SizedBox(height: DesignTokens.spaceMd),
        ...points.map((point) => Padding(
          padding: const EdgeInsets.only(
            left: DesignTokens.spaceMd,
            bottom: DesignTokens.spaceSm,
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '• ',
                style: TextStyle(
                  color: Theme.of(context).colorScheme.primary,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Expanded(
                child: Text(
                  point,
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ),
            ],
          ),
        )),
        const SizedBox(height: DesignTokens.spaceLg),
      ],
    );
  }
}
