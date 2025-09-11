import 'package:flutter/material.dart';
import '../../services/developer_service.dart';

class DevelopersListScreen extends StatefulWidget {
  const DevelopersListScreen({super.key});

  @override
  State<DevelopersListScreen> createState() => _DevelopersListScreenState();
}

class _DevelopersListScreenState extends State<DevelopersListScreen> {
  final DeveloperService _developerService = DeveloperService();
  List<Map<String, dynamic>> _developers = [];
  bool _isLoading = true;
  int _currentPage = 1;
  final int _limit = 10;
  bool _hasMoreData = true;

  @override
  void initState() {
    super.initState();
    _loadDevelopers();
  }

  Future<void> _loadDevelopers({bool refresh = false}) async {
    try {
      if (refresh) {
        setState(() {
          _currentPage = 1;
          _hasMoreData = true;
        });
      }

      if (!_hasMoreData) return;

      setState(() {
        _isLoading = true;
      });

      final developers = await _developerService.getDevelopers(page: _currentPage, limit: _limit);
      
      setState(() {
        if (refresh) {
          _developers = developers;
        } else {
          _developers.addAll(developers);
        }
        _isLoading = false;
        _hasMoreData = developers.length == _limit;
        if (_hasMoreData) _currentPage++;
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
        title: const Text('Developers'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => Navigator.pushNamed(context, '/developer-add'),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => _loadDevelopers(refresh: true),
        child: _developers.isEmpty && !_isLoading
            ? const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.business_outlined, size: 64, color: Colors.grey),
                    SizedBox(height: 16),
                    Text('No developers found'),
                  ],
                ),
              )
            : ListView.builder(
                padding: const EdgeInsets.all(16.0),
                itemCount: _developers.length + (_hasMoreData ? 1 : 0),
                itemBuilder: (context, index) {
                  if (index == _developers.length) {
                    return _buildLoadMoreButton();
                  }
                  return _buildDeveloperCard(_developers[index]);
                },
              ),
      ),
    );
  }

  Widget _buildDeveloperCard(Map<String, dynamic> developer) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () => _navigateToDeveloperDetails(developer['id']),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 30,
                    backgroundColor: Theme.of(context).primaryColor,
                    child: Text(
                      (developer['name'] ?? 'D')[0].toUpperCase(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          developer['name'] ?? 'Unknown Developer',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          developer['location'] ?? 'Location not specified',
                          style: const TextStyle(color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.more_vert),
                    onPressed: () => _showDeveloperOptions(developer),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              if (developer['description'] != null && developer['description'].isNotEmpty)
                Text(
                  developer['description'],
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(color: Colors.grey),
                ),
              const SizedBox(height: 12),
              Row(
                children: [
                  _buildInfoChip(
                    'Properties',
                    developer['propertyCount']?.toString() ?? '0',
                    Icons.home,
                  ),
                  const SizedBox(width: 8),
                  _buildInfoChip(
                    'Rating',
                    '${developer['rating']?.toString() ?? '0'}/5',
                    Icons.star,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInfoChip(String label, String value, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.grey.shade100,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: Colors.grey),
          const SizedBox(width: 4),
          Text(
            '$label: $value',
            style: const TextStyle(fontSize: 12, color: Colors.grey),
          ),
        ],
      ),
    );
  }

  Widget _buildLoadMoreButton() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Center(
        child: _isLoading
            ? const CircularProgressIndicator()
            : ElevatedButton(
                onPressed: () => _loadDevelopers(),
                child: const Text('Load More'),
              ),
      ),
    );
  }

  void _showDeveloperOptions(Map<String, dynamic> developer) {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.visibility),
              title: const Text('View Details'),
              onTap: () {
                Navigator.pop(context);
                _navigateToDeveloperDetails(developer['id']);
              },
            ),
            ListTile(
              leading: const Icon(Icons.edit),
              title: const Text('Edit Developer'),
              onTap: () {
                Navigator.pop(context);
                _navigateToEditDeveloper(developer['id']);
              },
            ),
            ListTile(
              leading: const Icon(Icons.delete, color: Colors.red),
              title: const Text('Delete Developer', style: TextStyle(color: Colors.red)),
              onTap: () {
                Navigator.pop(context);
                _showDeleteConfirmation(developer);
              },
            ),
          ],
        ),
      ),
    );
  }

  void _navigateToDeveloperDetails(String developerId) {
    Navigator.pushNamed(
      context,
      '/developer-detail',
      arguments: developerId,
    );
  }

  void _navigateToEditDeveloper(String developerId) {
    Navigator.pushNamed(
      context,
      '/developer-edit',
      arguments: developerId,
    );
  }

  void _showDeleteConfirmation(Map<String, dynamic> developer) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Developer'),
        content: Text('Are you sure you want to delete ${developer['name']}? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context);
              try {
                await _developerService.deleteDeveloper(developer['id']);
                if (mounted) {
                  _loadDevelopers(refresh: true);
                  ScaffoldMessenger.of(this.context).showSnackBar(
                    const SnackBar(content: Text('Developer deleted successfully')),
                  );
                }
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(this.context).showSnackBar(
                    SnackBar(content: Text('Error: $e')),
                  );
                }
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}