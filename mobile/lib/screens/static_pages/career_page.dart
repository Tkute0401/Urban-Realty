import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/design_tokens.dart';

class CareerPage extends ConsumerStatefulWidget {
  const CareerPage({super.key});

  @override
  ConsumerState<CareerPage> createState() => _CareerPageState();
}

class _CareerPageState extends ConsumerState<CareerPage> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _positionController = TextEditingController();
  final TextEditingController _experienceController = TextEditingController();
  final TextEditingController _coverLetterController = TextEditingController();

  final List<JobPosition> _openPositions = [
    JobPosition(
      title: 'Senior Real Estate Agent',
      department: 'Sales',
      location: 'New York, NY',
      type: 'Full-time',
      experience: '3-5 years',
      description: 'We are looking for an experienced real estate agent to join our growing team. You will be responsible for helping clients buy and sell properties, building relationships, and achieving sales targets.',
      requirements: [
        'Valid real estate license',
        '3+ years of sales experience',
        'Excellent communication skills',
        'Strong network in the local market',
        'Proven track record of sales success',
      ],
      benefits: [
        'Competitive commission structure',
        'Health insurance',
        '401(k) matching',
        'Professional development opportunities',
        'Flexible work schedule',
      ],
    ),
    JobPosition(
      title: 'Mobile App Developer',
      department: 'Technology',
      location: 'Remote',
      type: 'Full-time',
      experience: '2-4 years',
      description: 'Join our technology team to help build and maintain our mobile applications. You will work with Flutter, React Native, and native iOS/Android development.',
      requirements: [
        'Experience with Flutter or React Native',
        '2+ years of mobile development',
        'Knowledge of REST APIs',
        'Experience with state management',
        'Strong problem-solving skills',
      ],
      benefits: [
        'Competitive salary',
        'Remote work flexibility',
        'Health insurance',
        'Stock options',
        'Learning budget',
      ],
    ),
    JobPosition(
      title: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Los Angeles, CA',
      type: 'Full-time',
      experience: '1-3 years',
      description: 'Help us grow our brand and reach new customers through digital marketing campaigns, social media, and content creation.',
      requirements: [
        'Bachelor\'s degree in Marketing or related field',
        '1+ years of marketing experience',
        'Social media management skills',
        'Content creation abilities',
        'Analytics and reporting experience',
      ],
      benefits: [
        'Competitive salary',
        'Health insurance',
        'Dental and vision coverage',
        'Paid time off',
        'Career growth opportunities',
      ],
    ),
    JobPosition(
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Chicago, IL',
      type: 'Full-time',
      experience: '2-3 years',
      description: 'Ensure our customers have the best possible experience by providing support, gathering feedback, and helping them achieve their goals.',
      requirements: [
        '2+ years of customer success experience',
        'Excellent communication skills',
        'Problem-solving abilities',
        'CRM experience',
        'Real estate knowledge preferred',
      ],
      benefits: [
        'Competitive salary',
        'Health insurance',
        '401(k) matching',
        'Flexible work arrangements',
        'Professional development',
      ],
    ),
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _positionController.dispose();
    _experienceController.dispose();
    _coverLetterController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Careers'),
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
                    'Join Our Team',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: DesignTokens.spaceSm),
                  Text(
                    'Build the future of real estate with us',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),

            // Why Work With Us Section
            Padding(
              padding: const EdgeInsets.all(DesignTokens.spaceLg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Why Work With Us?',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: DesignTokens.spaceLg),
                  _buildBenefitCard(
                    context,
                    Icons.rocket_launch,
                    'Innovation',
                    'Work with cutting-edge technology and be part of the digital transformation of real estate.',
                  ),
                  const SizedBox(height: DesignTokens.spaceMd),
                  _buildBenefitCard(
                    context,
                    Icons.people,
                    'Great Team',
                    'Join a diverse, talented team of professionals who are passionate about what they do.',
                  ),
                  const SizedBox(height: DesignTokens.spaceMd),
                  _buildBenefitCard(
                    context,
                    Icons.trending_up,
                    'Growth Opportunities',
                    'Advance your career with opportunities for professional development and growth.',
                  ),
                  const SizedBox(height: DesignTokens.spaceMd),
                  _buildBenefitCard(
                    context,
                    Icons.balance,
                    'Work-Life Balance',
                    'We believe in maintaining a healthy balance between work and personal life.',
                  ),
                ],
              ),
            ),

            // Open Positions Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: DesignTokens.spaceLg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Open Positions',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: DesignTokens.spaceLg),
                  ..._openPositions.map((position) => _buildJobCard(context, position)),
                ],
              ),
            ),

            const SizedBox(height: DesignTokens.spaceLg),

            // Apply Now Section
            Container(
              margin: const EdgeInsets.all(DesignTokens.spaceLg),
              padding: const EdgeInsets.all(DesignTokens.spaceLg),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surfaceVariant,
                borderRadius: BorderRadius.circular(DesignTokens.radiusLg),
              ),
              child: Column(
                children: [
                  Text(
                    'Don\'t See Your Role?',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: DesignTokens.spaceMd),
                  Text(
                    'We\'re always looking for talented individuals. Send us your resume and let us know how you can contribute to our team.',
                    style: Theme.of(context).textTheme.bodyLarge,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: DesignTokens.spaceLg),
                  ElevatedButton(
                    onPressed: _showApplicationForm,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(
                        horizontal: DesignTokens.spaceLg,
                        vertical: DesignTokens.spaceMd,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
                      ),
                    ),
                    child: const Text('Apply Now'),
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

  Widget _buildBenefitCard(
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

  Widget _buildJobCard(BuildContext context, JobPosition position) {
    return Card(
      margin: const EdgeInsets.only(bottom: DesignTokens.spaceMd),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
      ),
      child: ExpansionTile(
        title: Text(
          position.title,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('${position.department} • ${position.location}'),
            Row(
              children: [
                _buildJobChip(context, position.type, Colors.blue),
                const SizedBox(width: DesignTokens.spaceXs),
                _buildJobChip(context, position.experience, Colors.green),
              ],
            ),
          ],
        ),
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(
              DesignTokens.spaceLg,
              0,
              DesignTokens.spaceLg,
              DesignTokens.spaceLg,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Description',
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: DesignTokens.spaceXs),
                Text(position.description),
                const SizedBox(height: DesignTokens.spaceMd),
                
                Text(
                  'Requirements',
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: DesignTokens.spaceXs),
                ...position.requirements.map((req) => Padding(
                  padding: const EdgeInsets.only(left: DesignTokens.spaceMd, bottom: DesignTokens.spaceXs),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('• '),
                      Expanded(child: Text(req)),
                    ],
                  ),
                )),
                const SizedBox(height: DesignTokens.spaceMd),
                
                Text(
                  'Benefits',
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: DesignTokens.spaceXs),
                ...position.benefits.map((benefit) => Padding(
                  padding: const EdgeInsets.only(left: DesignTokens.spaceMd, bottom: DesignTokens.spaceXs),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('• '),
                      Expanded(child: Text(benefit)),
                    ],
                  ),
                )),
                const SizedBox(height: DesignTokens.spaceMd),
                
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => _applyForPosition(position),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Apply for this position'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildJobChip(BuildContext context, String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: DesignTokens.spaceSm,
        vertical: DesignTokens.spaceXs,
      ),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(DesignTokens.radiusSm),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: color,
          fontSize: DesignTokens.fontSizeSm,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  void _showApplicationForm() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.8,
        maxChildSize: 0.95,
        minChildSize: 0.5,
        builder: (context, scrollController) => Container(
          padding: const EdgeInsets.all(DesignTokens.spaceLg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Apply Now',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: DesignTokens.spaceLg),
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      TextFormField(
                        controller: _nameController,
                        decoration: const InputDecoration(
                          labelText: 'Full Name',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: DesignTokens.spaceMd),
                      TextFormField(
                        controller: _emailController,
                        decoration: const InputDecoration(
                          labelText: 'Email',
                          border: OutlineInputBorder(),
                        ),
                        keyboardType: TextInputType.emailAddress,
                      ),
                      const SizedBox(height: DesignTokens.spaceMd),
                      TextFormField(
                        controller: _phoneController,
                        decoration: const InputDecoration(
                          labelText: 'Phone Number',
                          border: OutlineInputBorder(),
                        ),
                        keyboardType: TextInputType.phone,
                      ),
                      const SizedBox(height: DesignTokens.spaceMd),
                      TextFormField(
                        controller: _positionController,
                        decoration: const InputDecoration(
                          labelText: 'Position of Interest',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: DesignTokens.spaceMd),
                      TextFormField(
                        controller: _experienceController,
                        decoration: const InputDecoration(
                          labelText: 'Years of Experience',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: DesignTokens.spaceMd),
                      TextFormField(
                        controller: _coverLetterController,
                        decoration: const InputDecoration(
                          labelText: 'Cover Letter',
                          border: OutlineInputBorder(),
                          alignLabelWithHint: true,
                        ),
                        maxLines: 4,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: DesignTokens.spaceLg),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Cancel'),
                    ),
                  ),
                  const SizedBox(width: DesignTokens.spaceMd),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _submitApplication,
                      child: const Text('Submit Application'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _applyForPosition(JobPosition position) {
    _positionController.text = position.title;
    _showApplicationForm();
  }

  void _submitApplication() {
    // TODO: Implement application submission
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Thank you for your application! We\'ll review it and get back to you soon.'),
        backgroundColor: Colors.green,
      ),
    );
    Navigator.pop(context);
    
    // Clear form
    _nameController.clear();
    _emailController.clear();
    _phoneController.clear();
    _positionController.clear();
    _experienceController.clear();
    _coverLetterController.clear();
  }
}

class JobPosition {
  final String title;
  final String department;
  final String location;
  final String type;
  final String experience;
  final String description;
  final List<String> requirements;
  final List<String> benefits;

  JobPosition({
    required this.title,
    required this.department,
    required this.location,
    required this.type,
    required this.experience,
    required this.description,
    required this.requirements,
    required this.benefits,
  });
}
