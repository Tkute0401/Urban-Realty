import 'package:flutter/material.dart';
import '../../services/developer_service.dart';

class DeveloperDetailScreen extends StatefulWidget {
  final String developerId;
  
  const DeveloperDetailScreen({super.key, required this.developerId});

  @override
  State<DeveloperDetailScreen> createState() => _DeveloperDetailScreenState();
}

class _DeveloperDetailScreenState extends State<DeveloperDetailScreen> {
  final DeveloperService _developerService = DeveloperService();
  Map<String, dynamic>? _developer;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadDeveloperDetails();
  }

  Future<void> _loadDeveloperDetails() async {
    try {
      setState(() {
        _isLoading = true;
      });

      final developer = await _developerService.getDeveloperDetails(widget.developerId);
      
      setState(() {
        _developer = developer;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Developer Details'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () => Navigator.pushNamed(
              context,
              '/developer-edit',
              arguments: widget.developerId,
            ),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _developer == null
              ? const Center(child: Text('Developer not found'))
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildHeader(),
                      const SizedBox(height: 24),
                      _buildInfoSection(),
                      const SizedBox(height: 24),
                      _buildPropertiesSection(),
                      const SizedBox(height: 24),
                      _buildContactSection(),
                    ],
                  ),
                ),
    );
  }

  Widget _buildHeader() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            CircleAvatar(
              radius: 50,
              backgroundColor: Theme.of(context).primaryColor,
              child: Text(
                (_developer!['name'] ?? 'D')[0].toUpperCase(),
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              _developer!['name'] ?? 'Unknown Developer',
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              _developer!['location'] ?? 'Location not specified',
              style: const TextStyle(
                fontSize: 16,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildStatCard(
                  'Properties',
                  _developer!['propertyCount']?.toString() ?? '0',
                  Icons.home,
                ),
                _buildStatCard(
                  'Rating',
                  '${_developer!['rating']?.toString() ?? '0'}/5',
                  Icons.star,
                ),
                _buildStatCard(
                  'Experience',
                  '${_developer!['experience']?.toString() ?? '0'} years',
                  Icons.work,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, size: 32, color: Theme.of(context).primaryColor),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            color: Colors.grey,
          ),
        ),
      ],
    );
  }

  Widget _buildInfoSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'About',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              _developer!['description'] ?? 'No description available',
              style: const TextStyle(fontSize: 14),
            ),
            const SizedBox(height: 16),
            if (_developer!['website'] != null) ...[
              _buildInfoRow(Icons.language, 'Website', _developer!['website']),
              const SizedBox(height: 8),
            ],
            if (_developer!['phone'] != null) ...[
              _buildInfoRow(Icons.phone, 'Phone', _developer!['phone']),
              const SizedBox(height: 8),
            ],
            if (_developer!['email'] != null) ...[
              _buildInfoRow(Icons.email, 'Email', _developer!['email']),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 20, color: Colors.grey),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontSize: 12,
                  color: Colors.grey,
                ),
              ),
              Text(
                value,
                style: const TextStyle(fontSize: 14),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildPropertiesSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Properties',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                TextButton(
                  onPressed: () {
                    // Navigate to developer's properties
                  },
                  child: const Text('View All'),
                ),
              ],
            ),
            const SizedBox(height: 12),
            // Placeholder for properties list
            Container(
              height: 100,
              decoration: BoxDecoration(
                color: Colors.grey.shade100,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Center(
                child: Text('Properties will be listed here'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContactSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Contact Developer',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      // Implement call functionality
                    },
                    icon: const Icon(Icons.phone),
                    label: const Text('Call'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      // Implement email functionality
                    },
                    icon: const Icon(Icons.email),
                    label: const Text('Email'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}