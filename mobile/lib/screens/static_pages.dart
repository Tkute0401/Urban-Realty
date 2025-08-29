import 'package:flutter/material.dart';

class PlaceholderPage extends StatelessWidget {
  final String title;
  const PlaceholderPage({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(child: Text('$title (Coming Soon)')),
    );
  }
}

class AboutPage extends PlaceholderPage { const AboutPage({super.key}) : super(title: 'About Us'); }
class ContactPage extends PlaceholderPage { const ContactPage({super.key}) : super(title: 'Contact Us'); }
class HelpCenterPage extends PlaceholderPage { const HelpCenterPage({super.key}) : super(title: 'Help Center'); }
class PrivacyPolicyPage extends PlaceholderPage { const PrivacyPolicyPage({super.key}) : super(title: 'Privacy Policy'); }
class TermsConditionsPage extends PlaceholderPage { const TermsConditionsPage({super.key}) : super(title: 'Terms & Conditions'); }
class CareerPage extends PlaceholderPage { const CareerPage({super.key}) : super(title: 'Career'); }
class TrustSafetyPage extends PlaceholderPage { const TrustSafetyPage({super.key}) : super(title: 'Trust & Safety'); }
class HowWeWorkPage extends PlaceholderPage { const HowWeWorkPage({super.key}) : super(title: 'How We Work'); }

class LawyerConsultancyPage extends PlaceholderPage { const LawyerConsultancyPage({super.key}) : super(title: 'Lawyer Consultancy'); }
class PackersMoversPage extends PlaceholderPage { const PackersMoversPage({super.key}) : super(title: 'Packers and Movers'); }
class InteriorDesignPage extends PlaceholderPage { const InteriorDesignPage({super.key}) : super(title: 'Interior Design'); }
class EMICalculatorPage extends PlaceholderPage { const EMICalculatorPage({super.key}) : super(title: 'EMI Calculator'); }

class SubscriptionPlansPage extends PlaceholderPage { const SubscriptionPlansPage({super.key}) : super(title: 'Subscription Plans'); }
class SubscriptionManagementPage extends PlaceholderPage { const SubscriptionManagementPage({super.key}) : super(title: 'Subscription Management'); }
class SubscriptionComparisonPage extends PlaceholderPage { const SubscriptionComparisonPage({super.key}) : super(title: 'Subscription Comparison'); }
class BillingDashboardPage extends PlaceholderPage { const BillingDashboardPage({super.key}) : super(title: 'Billing Dashboard'); }

class RegisterScreen extends StatelessWidget {
  const RegisterScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Register')),
      body: const Center(child: Text('Registration (Coming Soon)')),
    );
  }
}

class ProfileEditPage extends PlaceholderPage { const ProfileEditPage({super.key}) : super(title: 'Edit Profile'); }
class AddPropertyPage extends PlaceholderPage { const AddPropertyPage({super.key}) : super(title: 'Add Property'); }
class EditPropertyPage extends StatelessWidget {
  const EditPropertyPage({super.key});
  @override
  Widget build(BuildContext context) {
    final args = ModalRoute.of(context)!.settings.arguments as String?;
    return Scaffold(
      appBar: AppBar(title: const Text('Edit Property')),
      body: Center(child: Text('Edit Property ID: ${args ?? '-'}')),
    );
  }
}

class AgentDashboardPage extends PlaceholderPage { const AgentDashboardPage({super.key}) : super(title: 'Agent Dashboard'); }
class AdminDashboardPage extends PlaceholderPage { const AdminDashboardPage({super.key}) : super(title: 'Admin Dashboard'); }

class DevelopersListPage extends PlaceholderPage { const DevelopersListPage({super.key}) : super(title: 'Developers'); }
class DeveloperDetailsPage extends StatelessWidget {
  const DeveloperDetailsPage({super.key});
  @override
  Widget build(BuildContext context) {
    final id = ModalRoute.of(context)!.settings.arguments as String?;
    return Scaffold(
      appBar: AppBar(title: const Text('Developer Details')),
      body: Center(child: Text('Developer ID: ${id ?? '-'}')),
    );
  }
}
class AddDeveloperPageMobile extends PlaceholderPage { const AddDeveloperPageMobile({super.key}) : super(title: 'Add Developer'); }
class EditDeveloperPageMobile extends StatelessWidget {
  const EditDeveloperPageMobile({super.key});
  @override
  Widget build(BuildContext context) {
    final id = ModalRoute.of(context)!.settings.arguments as String?;
    return Scaffold(
      appBar: AppBar(title: const Text('Edit Developer')),
      body: Center(child: Text('Edit Developer ID: ${id ?? '-'}')),
    );
  }
}

