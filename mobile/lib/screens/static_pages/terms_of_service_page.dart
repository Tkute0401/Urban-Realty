import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/design_tokens.dart';

class TermsOfServicePage extends ConsumerWidget {
  const TermsOfServicePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Terms of Service'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(DesignTokens.spaceLg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Terms of Service',
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
              '1. Acceptance of Terms',
              [
                'By accessing and using the Urban Realty mobile application, you accept and agree to be bound by the terms and provision of this agreement.',
                'If you do not agree to abide by the above, please do not use this service.',
                'These terms apply to all visitors, users, and others who access or use the service.',
              ],
            ),

            _buildSection(
              context,
              '2. Description of Service',
              [
                'Urban Realty provides a mobile application that allows users to search, view, and interact with real estate listings.',
                'Our service includes property search, property details, agent contact, and related real estate services.',
                'We reserve the right to modify, suspend, or discontinue the service at any time without notice.',
              ],
            ),

            _buildSection(
              context,
              '3. User Accounts',
              [
                'You must create an account to use certain features of our service.',
                'You are responsible for maintaining the confidentiality of your account credentials.',
                'You agree to provide accurate, current, and complete information during registration.',
                'You are responsible for all activities that occur under your account.',
              ],
            ),

            _buildSection(
              context,
              '4. Acceptable Use',
              [
                'You agree to use the service only for lawful purposes and in accordance with these terms.',
                'You may not use the service in any way that could damage, disable, or impair the service.',
                'You may not attempt to gain unauthorized access to any part of the service.',
                'You may not use the service to transmit any harmful or malicious code.',
              ],
            ),

            _buildSection(
              context,
              '5. Intellectual Property',
              [
                'The service and its original content, features, and functionality are owned by Urban Realty.',
                'All trademarks, service marks, and trade names are proprietary to Urban Realty.',
                'You may not reproduce, distribute, or create derivative works without permission.',
                'Property listings and images are owned by their respective owners.',
              ],
            ),

            _buildSection(
              context,
              '6. Privacy Policy',
              [
                'Your privacy is important to us. Please review our Privacy Policy for information on how we collect and use your data.',
                'By using our service, you consent to the collection and use of information as described in our Privacy Policy.',
                'We may update our Privacy Policy from time to time, and your continued use constitutes acceptance of changes.',
              ],
            ),

            _buildSection(
              context,
              '7. Disclaimers',
              [
                'The information on this service is provided on an "as is" basis.',
                'We make no warranties, expressed or implied, regarding the accuracy, reliability, or completeness of information.',
                'We do not guarantee that the service will be uninterrupted or error-free.',
                'Property information is provided by third parties and may not be accurate or current.',
              ],
            ),

            _buildSection(
              context,
              '8. Limitation of Liability',
              [
                'In no event shall Urban Realty be liable for any indirect, incidental, special, or consequential damages.',
                'Our total liability to you for any damages shall not exceed the amount you paid for the service.',
                'Some jurisdictions do not allow the limitation of liability, so these limitations may not apply to you.',
              ],
            ),

            _buildSection(
              context,
              '9. Indemnification',
              [
                'You agree to indemnify and hold harmless Urban Realty from any claims, damages, or expenses.',
                'This includes claims arising from your use of the service or violation of these terms.',
                'You agree to cooperate with us in the defense of any such claim.',
              ],
            ),

            _buildSection(
              context,
              '10. Termination',
              [
                'We may terminate or suspend your account at any time for any reason.',
                'You may terminate your account at any time by contacting us.',
                'Upon termination, your right to use the service will cease immediately.',
                'All provisions of these terms that should survive termination shall survive.',
              ],
            ),

            _buildSection(
              context,
              '11. Governing Law',
              [
                'These terms shall be governed by and construed in accordance with the laws of the State of New York.',
                'Any disputes arising from these terms shall be resolved in the courts of New York.',
                'If any provision of these terms is found to be unenforceable, the remaining provisions shall remain in effect.',
              ],
            ),

            _buildSection(
              context,
              '12. Changes to Terms',
              [
                'We reserve the right to modify these terms at any time.',
                'We will notify users of any material changes by posting the new terms in our app.',
                'Your continued use of the service after changes constitutes acceptance of the new terms.',
                'We encourage you to review these terms periodically.',
              ],
            ),

            _buildSection(
              context,
              '13. Contact Information',
              [
                'If you have any questions about these terms, please contact us:',
                'Email: legal@urbanrealty.com',
                'Phone: +1 (555) 123-4567',
                'Address: 123 Real Estate Ave, New York, NY 10001',
              ],
            ),

            const SizedBox(height: DesignTokens.spaceLg),

            // Agreement Section
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
                    'Agreement',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: DesignTokens.spaceSm),
                  Text(
                    'By using our app, you acknowledge that you have read, understood, and agree to be bound by these terms of service.',
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
