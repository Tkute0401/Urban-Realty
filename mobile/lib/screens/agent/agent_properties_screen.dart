import 'package:flutter/material.dart';
import '../../services/agent_service.dart';

class AgentPropertiesScreen extends StatefulWidget {
  const AgentPropertiesScreen({super.key});

  @override
  State<AgentPropertiesScreen> createState() => _AgentPropertiesScreenState();
}

class _AgentPropertiesScreenState extends State<AgentPropertiesScreen> {
  final AgentService _agentService = AgentService();
  List<Map<String, dynamic>> _properties = [];
  bool _isLoading = true;
  int _currentPage = 1;
  final int _limit = 10;
  bool _hasMoreData = true;

  @override
  void initState() {
    super.initState();
    _loadProperties();
  }

  Future<void> _loadProperties({bool refresh = false}) async {
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

      final properties = await _agentService.getAgentProperties(page: _currentPage, limit: _limit);
      
      setState(() {
        if (refresh) {
          _properties = properties;
        } else {
          _properties.addAll(properties);
        }
        _isLoading = false;
        _hasMoreData = properties.length == _limit;
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
        title: const Text('My Properties'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => Navigator.pushNamed(context, '/add-property'),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => _loadProperties(refresh: true),
        child: _properties.isEmpty && !_isLoading
            ? const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.home_outlined, size: 64, color: Colors.grey),
                    SizedBox(height: 16),
                    Text('No properties found'),
                    SizedBox(height: 8),
                    Text('Add your first property to get started'),
                  ],
                ),
              )
            : ListView.builder(
                padding: const EdgeInsets.all(16.0),
                itemCount: _properties.length + (_hasMoreData ? 1 : 0),
                itemBuilder: (context, index) {
                  if (index == _properties.length) {
                    return _buildLoadMoreButton();
                  }
                  return _buildPropertyCard(_properties[index]);
                },
              ),
      ),
    );
  }

  Widget _buildPropertyCard(Map<String, dynamic> property) {
    final status = property['status'] ?? 'active';
    final statusColor = status == 'active' ? Colors.green : Colors.orange;
    
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () => Navigator.pushNamed(
          context,
          '/property-detail',
          arguments: property['id'],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (property['images'] != null && property['images'].isNotEmpty)
              Container(
                height: 200,
                width: double.infinity,
                decoration: BoxDecoration(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(8)),
                  image: DecorationImage(
                    image: NetworkImage(property['images'][0]),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          property['title'] ?? 'Untitled Property',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: statusColor.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: statusColor),
                        ),
                        child: Text(
                          status.toUpperCase(),
                          style: TextStyle(
                            color: statusColor,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    property['location'] ?? 'Location not specified',
                    style: const TextStyle(color: Colors.grey),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Text(
                        '₹${property['price']?.toString() ?? '0'}',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.green,
                        ),
                      ),
                      const Spacer(),
                      IconButton(
                        icon: const Icon(Icons.edit),
                        onPressed: () => _editProperty(property['id']),
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete, color: Colors.red),
                        onPressed: () => _deleteProperty(property),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
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
                onPressed: () => _loadProperties(),
                child: const Text('Load More'),
              ),
      ),
    );
  }

  void _editProperty(String propertyId) {
    Navigator.pushNamed(
      context,
      '/edit-property',
      arguments: propertyId,
    );
  }

  void _deleteProperty(Map<String, dynamic> property) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Property'),
        content: Text('Are you sure you want to delete ${property['title']}? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              // Implement delete property functionality
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Delete functionality to be implemented')),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}