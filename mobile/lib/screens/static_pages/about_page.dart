import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/design_tokens.dart';

class AboutPage extends ConsumerWidget {
  const AboutPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('About Urban Realty'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Section
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(DesignTokens.spaceLg),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Theme.of(context).colorScheme.primary,
                    Theme.of(context).colorScheme.primary.withOpacity(0.8),
                  ],
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'About Urban Realty',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: DesignTokens.spaceSm),
                  Text(
                    'Your trusted partner in real estate',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),

            // Company Overview
            Padding(
              padding: const EdgeInsets.all(DesignTokens.spaceLg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Our Story',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: DesignTokens.spaceMd),
                  Text(
                    'Urban Realty was founded in 2020 with a vision to revolutionize the real estate industry through technology and exceptional service. We believe that finding the perfect home should be an exciting and seamless experience.',
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                  const SizedBox(height: DesignTokens.spaceLg),

                  Text(
                    'Our Mission',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: DesignTokens.spaceMd),
                  Text(
                    'To connect people with their dream homes by providing innovative technology, expert guidance, and personalized service that makes the real estate journey enjoyable and successful.',
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                  const SizedBox(height: DesignTokens.spaceLg),

                  Text(
                    'Our Values',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: DesignTokens.spaceMd),
                  _buildValueCard(
                    context,
                    Icons.verified_user,
                    'Trust & Integrity',
                    'We maintain the highest ethical standards in all our dealings.',
                  ),
                  const SizedBox(height: DesignTokens.spaceMd),
                  _buildValueCard(
                    context,
                    Icons.innovation,
                    'Innovation',
                    'We leverage cutting-edge technology to enhance your experience.',
                  ),
                  const SizedBox(height: DesignTokens.spaceMd),
                  _buildValueCard(
                    context,
                    Icons.people,
                    'Customer First',
                    'Your needs and satisfaction are at the heart of everything we do.',
                  ),
                  const SizedBox(height: DesignTokens.spaceMd),
                  _buildValueCard(
                    context,
                    Icons.eco,
                    'Sustainability',
                    'We promote environmentally conscious real estate practices.',
                  ),
                ],
              ),
            ),

            // Statistics Section
            Container(
              width: double.infinity,
              margin: const EdgeInsets.symmetric(horizontal: DesignTokens.spaceLg),
              padding: const EdgeInsets.all(DesignTokens.spaceLg),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surfaceVariant,
                borderRadius: BorderRadius.circular(DesignTokens.radiusLg),
              ),
              child: Column(
                children: [
                  Text(
                    'Our Impact',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: DesignTokens.spaceLg),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildStatCard(context, '500+', 'Properties Sold'),
                      _buildStatCard(context, '1000+', 'Happy Clients'),
                      _buildStatCard(context, '50+', 'Expert Agents'),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: DesignTokens.spaceLg),

            // Team Section
            Padding(
              padding: const EdgeInsets.all(DesignTokens.spaceLg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Our Team',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: DesignTokens.spaceMd),
                  Text(
                    'Meet the passionate professionals who make Urban Realty a trusted name in real estate.',
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                  const SizedBox(height: DesignTokens.spaceLg),
                  _buildTeamMember(
                    context,
                    'Sarah Johnson',
                    'CEO & Founder',
                    'assets/images/team/sarah.jpg',
                    '15+ years in real estate, former VP at major brokerage firm.',
                  ),
                  const SizedBox(height: DesignTokens.spaceMd),
                  _buildTeamMember(
                    context,
                    'Michael Chen',
                    'CTO',
                    'assets/images/team/michael.jpg',
                    'Tech visionary with expertise in real estate technology solutions.',
                  ),
                  const SizedBox(height: DesignTokens.spaceMd),
                  _buildTeamMember(
                    context,
                    'Emily Rodriguez',
                    'Head of Sales',
                    'assets/images/team/emily.jpg',
                    'Top-performing agent with 10+ years of experience.',
                  ),
                ],
              ),
            ),

            // Contact Section
            Container(
              width: double.infinity,
              margin: const EdgeInsets.all(DesignTokens.spaceLg),
              padding: const EdgeInsets.all(DesignTokens.spaceLg),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Theme.of(context).colorScheme.secondary.withOpacity(0.1),
                    Theme.of(context).colorScheme.primary.withOpacity(0.1),
                  ],
                ),
                borderRadius: BorderRadius.circular(DesignTokens.radiusLg),
              ),
              child: Column(
                children: [
                  Text(
                    'Get in Touch',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: DesignTokens.spaceMd),
                  Text(
                    'Ready to find your dream home? Contact us today!',
                    style: Theme.of(context).textTheme.bodyLarge,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: DesignTokens.spaceLg),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildContactButton(
                        context,
                        Icons.phone,
                        'Call Us',
                        '+1 (555) 123-4567',
                      ),
                      _buildContactButton(
                        context,
                        Icons.email,
                        'Email Us',
                        'info@urbanrealty.com',
                      ),
                    ],
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

  Widget _buildValueCard(
    BuildContext context,
    IconData icon,
    String title,
    String description,
  ) {
    return Container(
      padding: const EdgeInsets.all(DesignTokens.spaceMd),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
        border: Border.all(
          color: Theme.of(context).colorScheme.outline.withOpacity(0.2),
        ),
      ),
      child: Row(
        children: [
          Icon(
            icon,
            color: Theme.of(context).colorScheme.primary,
            size: DesignTokens.iconSizeLg,
          ),
          const SizedBox(width: DesignTokens.spaceMd),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: DesignTokens.spaceXs),
                Text(
                  description,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(BuildContext context, String number, String label) {
    return Column(
      children: [
        Text(
          number,
          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
            fontWeight: FontWeight.bold,
            color: Theme.of(context).colorScheme.primary,
          ),
        ),
        const SizedBox(height: DesignTokens.spaceXs),
        Text(
          label,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildTeamMember(
    BuildContext context,
    String name,
    String position,
    String imagePath,
    String description,
  ) {
    return Container(
      padding: const EdgeInsets.all(DesignTokens.spaceMd),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
        border: Border.all(
          color: Theme.of(context).colorScheme.outline.withOpacity(0.2),
        ),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 30,
            backgroundColor: Theme.of(context).colorScheme.primary.withOpacity(0.1),
            child: Icon(
              Icons.person,
              color: Theme.of(context).colorScheme.primary,
              size: DesignTokens.iconSizeLg,
            ),
          ),
          const SizedBox(width: DesignTokens.spaceMd),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  position,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: DesignTokens.spaceXs),
                Text(
                  description,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContactButton(
    BuildContext context,
    IconData icon,
    String label,
    String value,
  ) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(DesignTokens.spaceMd),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.primary,
            borderRadius: BorderRadius.circular(DesignTokens.radiusFull),
          ),
          child: Icon(
            icon,
            color: Colors.white,
            size: DesignTokens.iconSizeLg,
          ),
        ),
        const SizedBox(height: DesignTokens.spaceSm),
        Text(
          label,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          value,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
          ),
        ),
      ],
    );
  }
}
