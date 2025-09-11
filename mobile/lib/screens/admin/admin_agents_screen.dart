import 'package:flutter/material.dart';
import '../../services/admin_service.dart';
import '../../services/agent_service.dart';

class AdminAgentsScreen extends StatefulWidget {
  const AdminAgentsScreen({super.key});

  @override
  State<AdminAgentsScreen> createState() => _AdminAgentsScreenState();
}

class _AdminAgentsScreenState extends State<AdminAgentsScreen> {
  final AdminService _adminService = AdminService();
  List<Map<String, dynamic>> _agents = [];
  bool _isLoading = true;
  int _currentPage = 1;
  final int _limit = 10;
  bool _hasMoreData = true;

  @override
  void initState() {
    super.initState();
    _loadAgents();
  }

  Future<void> _loadAgents({bool refresh = false}) async {
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

      final agents = await _adminService.getUsers(role: 'agent', page: _currentPage, limit: _limit);
      
      setState(() {
        if (refresh) {
          _agents = agents;
        } else {
          _agents.addAll(agents);
        }
        _isLoading = false;
        _hasMoreData = agents.length == _limit;
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
        title: const Text('Manage Agents'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => _loadAgents(refresh: true),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => _loadAgents(refresh: true),
        child: _agents.isEmpty && !_isLoading
            ? const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.person_outline, size: 64, color: Colors.grey),
                    SizedBox(height: 16),
                    Text('No agents found'),
                  ],
                ),
              )
            : ListView.builder(
                padding: const EdgeInsets.all(16.0),
                itemCount: _agents.length + (_hasMoreData ? 1 : 0),
                itemBuilder: (context, index) {
                  if (index == _agents.length) {
                    return _buildLoadMoreButton();
                  }
                  return _buildAgentCard(_agents[index]);
                },
              ),
      ),
    );
  }

  Widget _buildAgentCard(Map<String, dynamic> agent) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 25,
                  backgroundColor: Theme.of(context).primaryColor,
                  child: Text(
                    (agent['name'] ?? 'A')[0].toUpperCase(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
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
                        agent['name'] ?? 'Unknown Agent',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        agent['email'] ?? 'No email',
                        style: const TextStyle(color: Colors.grey),
                      ),
                    ],
                  ),
                ),
                _buildStatusChip(agent['status'] ?? 'pending'),
                PopupMenuButton<String>(
                  onSelected: (value) => _handleAgentAction(value, agent),
                  itemBuilder: (context) => [
                    const PopupMenuItem(
                      value: 'verify',
                      child: Row(
                        children: [
                          Icon(Icons.check_circle, color: Colors.green),
                          SizedBox(width: 8),
                          Text('Verify Agent'),
                        ],
                      ),
                    ),
                    const PopupMenuItem(
                      value: 'suspend',
                      child: Row(
                        children: [
                          Icon(Icons.pause_circle, color: Colors.orange),
                          SizedBox(width: 8),
                          Text('Suspend'),
                        ],
                      ),
                    ),
                    const PopupMenuItem(
                      value: 'delete',
                      child: Row(
                        children: [
                          Icon(Icons.delete, color: Colors.red),
                          SizedBox(width: 8),
                          Text('Delete'),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _buildInfoChip(
                  'Properties',
                  agent['propertyCount']?.toString() ?? '0',
                  Icons.home,
                ),
                const SizedBox(width: 8),
                _buildInfoChip(
                  'Leads',
                  agent['leadCount']?.toString() ?? '0',
                  Icons.people,
                ),
                const SizedBox(width: 8),
                _buildInfoChip(
                  'Joined',
                  _formatDate(agent['createdAt']),
                  Icons.calendar_today,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusChip(String status) {
    Color color;
    switch (status.toLowerCase()) {
      case 'verified':
        color = Colors.green;
        break;
      case 'pending':
        color = Colors.orange;
        break;
      case 'suspended':
        color = Colors.red;
        break;
      default:
        color = Colors.grey;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color),
      ),
      child: Text(
        status.toUpperCase(),
        style: TextStyle(
          color: color,
          fontSize: 10,
          fontWeight: FontWeight.bold,
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
                onPressed: () => _loadAgents(),
                child: const Text('Load More'),
              ),
      ),
    );
  }

  void _handleAgentAction(String action, Map<String, dynamic> agent) async {
    try {
      switch (action) {
        case 'verify':
          await _adminService.verifyAgent(agent['_id']);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Agent verified successfully')),
          );
          break;
        case 'suspend':
          await _adminService.updateUserStatus(agent['_id'], 'suspended');
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Agent suspended successfully')),
          );
          break;
        case 'delete':
          _showDeleteConfirmation(agent);
          break;
      }
      _loadAgents(refresh: true);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
  }

  void _showDeleteConfirmation(Map<String, dynamic> agent) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Agent'),
        content: Text('Are you sure you want to delete ${agent['name']}? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context);
              try {
                await _adminService.deleteUser(agent['_id']);
                if (mounted) {
                  _loadAgents(refresh: true);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Agent deleted successfully')),
                  );
                }
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
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

  String _formatDate(dynamic date) {
    if (date == null) return 'Unknown';
    try {
      final DateTime dateTime = DateTime.parse(date.toString());
      return '${dateTime.day}/${dateTime.month}/${dateTime.year}';
    } catch (e) {
      return 'Unknown';
    }
  }
}