import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/design_tokens.dart';

class HelpPage extends ConsumerStatefulWidget {
  const HelpPage({super.key});

  @override
  ConsumerState<HelpPage> createState() => _HelpPageState();
}

class _HelpPageState extends ConsumerState<HelpPage> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  int _selectedCategoryIndex = 0;

  final List<String> _categories = [
    'All',
    'Getting Started',
    'Account',
    'Properties',
    'Payments',
    'Technical',
  ];

  final List<FAQItem> _faqs = [
    FAQItem(
      category: 'Getting Started',
      question: 'How do I create an account?',
      answer: 'To create an account, tap the "Sign Up" button on the login screen and fill in your details. You\'ll need to provide your name, email, phone number, and create a password.',
    ),
    FAQItem(
      category: 'Getting Started',
      question: 'How do I search for properties?',
      answer: 'Use the search tab at the bottom of the screen. You can search by location, property type, price range, and other filters. Tap the filter icon to access advanced search options.',
    ),
    FAQItem(
      category: 'Account',
      question: 'How do I update my profile?',
      answer: 'Go to the Profile tab and tap "Edit Profile". You can update your personal information, profile picture, and contact details.',
    ),
    FAQItem(
      category: 'Account',
      question: 'How do I change my password?',
      answer: 'In the Profile tab, tap "Settings" and then "Change Password". You\'ll need to enter your current password and create a new one.',
    ),
    FAQItem(
      category: 'Properties',
      question: 'How do I save properties to favorites?',
      answer: 'When viewing a property, tap the heart icon in the top right corner. You can view all your favorite properties in the Favorites tab.',
    ),
    FAQItem(
      category: 'Properties',
      question: 'How do I contact an agent?',
      answer: 'On any property detail page, you\'ll find the agent\'s contact information. You can call them directly or send a message through the app.',
    ),
    FAQItem(
      category: 'Properties',
      question: 'How do I schedule a property viewing?',
      answer: 'On the property detail page, tap "Schedule Visit" and select your preferred date and time. The agent will confirm the appointment.',
    ),
    FAQItem(
      category: 'Payments',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, bank transfers, and digital payment methods. Payment options may vary by property and location.',
    ),
    FAQItem(
      category: 'Payments',
      question: 'Is my payment information secure?',
      answer: 'Yes, we use industry-standard encryption to protect your payment information. We never store your full card details on our servers.',
    ),
    FAQItem(
      category: 'Technical',
      question: 'The app is running slowly. What should I do?',
      answer: 'Try closing and reopening the app, or restart your device. Make sure you have a stable internet connection. If the problem persists, contact our support team.',
    ),
    FAQItem(
      category: 'Technical',
      question: 'I\'m not receiving notifications. How do I fix this?',
      answer: 'Check your device\'s notification settings for the Urban Realty app. Make sure notifications are enabled in both the app and your device settings.',
    ),
    FAQItem(
      category: 'Technical',
      question: 'How do I report a bug?',
      answer: 'Go to the Profile tab, tap "Help & Support", and select "Report a Bug". Provide as much detail as possible about the issue you\'re experiencing.',
    ),
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final filteredFAQs = _getFilteredFAQs();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Help & Support'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        elevation: 0,
      ),
      body: Column(
        children: [
          // Search Bar
          Container(
            padding: const EdgeInsets.all(DesignTokens.spaceLg),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search help articles...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          setState(() {
                            _searchQuery = '';
                          });
                        },
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
                ),
              ),
              onChanged: (value) {
                setState(() {
                  _searchQuery = value;
                });
              },
            ),
          ),

          // Category Filter
          Container(
            height: 50,
            padding: const EdgeInsets.symmetric(horizontal: DesignTokens.spaceLg),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: _categories.length,
              itemBuilder: (context, index) {
                final isSelected = _selectedCategoryIndex == index;
                return Padding(
                  padding: const EdgeInsets.only(right: DesignTokens.spaceSm),
                  child: FilterChip(
                    label: Text(_categories[index]),
                    selected: isSelected,
                    onSelected: (selected) {
                      setState(() {
                        _selectedCategoryIndex = index;
                      });
                    },
                    selectedColor: Theme.of(context).colorScheme.primary.withOpacity(0.2),
                    checkmarkColor: Theme.of(context).colorScheme.primary,
                  ),
                );
              },
            ),
          ),

          // FAQ List
          Expanded(
            child: filteredFAQs.isEmpty
                ? _buildEmptyState(context)
                : ListView.builder(
                    padding: const EdgeInsets.all(DesignTokens.spaceLg),
                    itemCount: filteredFAQs.length,
                    itemBuilder: (context, index) {
                      return _buildFAQCard(context, filteredFAQs[index]);
                    },
                  ),
          ),

          // Contact Support Button
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(DesignTokens.spaceLg),
            child: ElevatedButton.icon(
              onPressed: _contactSupport,
              icon: const Icon(Icons.support_agent),
              label: const Text('Contact Support'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: DesignTokens.spaceMd),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  List<FAQItem> _getFilteredFAQs() {
    List<FAQItem> filtered = _faqs;

    // Filter by category
    if (_selectedCategoryIndex > 0) {
      final selectedCategory = _categories[_selectedCategoryIndex];
      filtered = filtered.where((faq) => faq.category == selectedCategory).toList();
    }

    // Filter by search query
    if (_searchQuery.isNotEmpty) {
      filtered = filtered.where((faq) =>
          faq.question.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().contains(_searchQuery.toLowerCase())).toList();
    }

    return filtered;
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.search_off,
            size: DesignTokens.iconSize2xl,
            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.5),
          ),
          const SizedBox(height: DesignTokens.spaceLg),
          Text(
            'No help articles found',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
            ),
          ),
          const SizedBox(height: DesignTokens.spaceSm),
          Text(
            'Try adjusting your search or category filter',
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.5),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFAQCard(BuildContext context, FAQItem faq) {
    return Card(
      margin: const EdgeInsets.only(bottom: DesignTokens.spaceMd),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
      ),
      child: ExpansionTile(
        title: Text(
          faq.question,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        subtitle: Text(
          faq.category,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: Theme.of(context).colorScheme.primary,
            fontWeight: FontWeight.w500,
          ),
        ),
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(
              DesignTokens.spaceLg,
              0,
              DesignTokens.spaceLg,
              DesignTokens.spaceLg,
            ),
            child: Text(
              faq.answer,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ),
        ],
      ),
    );
  }

  void _contactSupport() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.6,
        maxChildSize: 0.9,
        minChildSize: 0.3,
        builder: (context, scrollController) => Container(
          padding: const EdgeInsets.all(DesignTokens.spaceLg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Contact Support',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: DesignTokens.spaceLg),
              Text(
                'Choose how you\'d like to get help:',
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              const SizedBox(height: DesignTokens.spaceLg),
              _buildSupportOption(
                context,
                Icons.phone,
                'Call Us',
                '+1 (555) 123-4567',
                'Speak directly with our support team',
                () => Navigator.pop(context),
              ),
              const SizedBox(height: DesignTokens.spaceMd),
              _buildSupportOption(
                context,
                Icons.email,
                'Email Us',
                'support@urbanrealty.com',
                'Send us a detailed message',
                () => Navigator.pop(context),
              ),
              const SizedBox(height: DesignTokens.spaceMd),
              _buildSupportOption(
                context,
                Icons.chat,
                'Live Chat',
                'Available 9AM-6PM',
                'Chat with us in real-time',
                () => Navigator.pop(context),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSupportOption(
    BuildContext context,
    IconData icon,
    String title,
    String subtitle,
    String description,
    VoidCallback onTap,
  ) {
    return Card(
      child: ListTile(
        leading: Icon(
          icon,
          color: Theme.of(context).colorScheme.primary,
          size: DesignTokens.iconSizeLg,
        ),
        title: Text(
          title,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(subtitle),
            Text(
              description,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
              ),
            ),
          ],
        ),
        onTap: onTap,
      ),
    );
  }
}

class FAQItem {
  final String category;
  final String question;
  final String answer;

  FAQItem({
    required this.category,
    required this.question,
    required this.answer,
  });
}
