import 'package:flutter/material.dart';
import '../../services/agent_service.dart';

class AgentLeadsScreen extends StatefulWidget {
  const AgentLeadsScreen({super.key});

  @override
  State<AgentLeadsScreen> createState() => _AgentLeadsScreenState();
}

class _AgentLeadsScreenState extends State<AgentLeadsScreen> {
  final AgentService _agentService = AgentService();
  List<Map<String, dynamic>> _leads = [];
  bool _isLoading = true;
  int _currentPage = 1;
  final int _limit = 10;
  bool _hasMoreData = true;

  @override
  void initState() {
    super.initState();
    _loadLeads();
  }

  Future<void> _loadLeads({bool refresh = false}) async {
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

      final leads = await _agentService.getAgentLeads(page: _currentPage, limit: _limit);
      
      setState(() {
        if (refresh) {
          _leads = leads;
        } else {
          _leads.addAll(leads);
        }
        _isLoading = false;
        _hasMoreData = leads.length == _limit;
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
        title: const Text('My Leads'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
      ),
      body: RefreshIndicator(
        onRefresh: () => _loadLeads(refresh: true),
        child: _leads.isEmpty && !_isLoading
            ? const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.people_outline, size: 64, color: Colors.grey),
                    SizedBox(height: 16),
                    Text('No leads found'),
                  ],
                ),
              )
            : ListView.builder(
                padding: const EdgeInsets.all(16.0),
                itemCount: _leads.length + (_hasMoreData ? 1 : 0),
                itemBuilder: (context, index) {
                  if (index == _leads.length) {
                    return _buildLoadMoreButton();
                  }
                  return _buildLeadCard(_leads[index]);
                },
              ),
      ),
    );
  }

  Widget _buildLeadCard(Map<String, dynamic> lead) {
    final status = lead['status'] ?? 'new';
    final statusColor = _getLeadStatusColor(status);
    
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Theme.of(context).primaryColor,
          child: Text(
            (lead['name'] ?? 'L')[0].toUpperCase(),
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
        ),
        title: Text(
          lead['name'] ?? 'Unknown Lead',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(lead['email'] ?? ''),
            const SizedBox(height: 4),
            Text(lead['property'] ?? 'Property not specified'),
            const SizedBox(height: 4),
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
        trailing: PopupMenuButton<String>(
          onSelected: (value) => _handleLeadAction(value, lead),
          itemBuilder: (context) => [
            const PopupMenuItem(
              value: 'view',
              child: Row(
                children: [
                  Icon(Icons.visibility),
                  SizedBox(width: 8),
                  Text('View Details'),
                ],
              ),
            ),
            const PopupMenuItem(
              value: 'contact',
              child: Row(
                children: [
                  Icon(Icons.phone),
                  SizedBox(width: 8),
                  Text('Contact'),
                ],
              ),
            ),
            const PopupMenuItem(
              value: 'update',
              child: Row(
                children: [
                  Icon(Icons.edit),
                  SizedBox(width: 8),
                  Text('Update Status'),
                ],
              ),
            ),
          ],
        ),
        onTap: () => _showLeadDetails(lead),
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
                onPressed: () => _loadLeads(),
                child: const Text('Load More'),
              ),
      ),
    );
  }

  Color _getLeadStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'new':
        return Colors.blue;
      case 'contacted':
        return Colors.orange;
      case 'interested':
        return Colors.green;
      case 'converted':
        return Colors.purple;
      default:
        return Colors.grey;
    }
  }

  void _showLeadDetails(Map<String, dynamic> lead) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundColor: Theme.of(context).primaryColor,
                  child: Text(
                    (lead['name'] ?? 'L')[0].toUpperCase(),
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        lead['name'] ?? 'Unknown Lead',
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        lead['email'] ?? '',
                        style: const TextStyle(color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildDetailRow('Phone', lead['phone'] ?? 'Not provided'),
            _buildDetailRow('Property', lead['property'] ?? 'Not specified'),
            _buildDetailRow('Status', lead['status'] ?? 'new'),
            _buildDetailRow('Date', lead['date'] ?? 'Unknown'),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      _handleLeadAction('contact', lead);
                    },
                    child: const Text('Contact'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Close'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 80,
            child: Text(
              '$label:',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            child: Text(value),
          ),
        ],
      ),
    );
  }

  void _handleLeadAction(String action, Map<String, dynamic> lead) {
    switch (action) {
      case 'view':
        _showLeadDetails(lead);
        break;
      case 'contact':
        _contactLead(lead);
        break;
      case 'update':
        _updateLeadStatus(lead);
        break;
    }
  }

  void _contactLead(Map<String, dynamic> lead) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Contact Lead'),
        content: Text('How would you like to contact ${lead['name']}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              // Implement call functionality
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Call functionality to be implemented')),
              );
            },
            child: const Text('Call'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              // Implement email functionality
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Email functionality to be implemented')),
              );
            },
            child: const Text('Email'),
          ),
        ],
      ),
    );
  }

  void _updateLeadStatus(Map<String, dynamic> lead) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Update Lead Status'),
        content: const Text('Select new status:'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              // Implement status update functionality
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Status update functionality to be implemented')),
              );
            },
            child: const Text('Contacted'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              // Implement status update functionality
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Status update functionality to be implemented')),
              );
            },
            child: const Text('Interested'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              // Implement status update functionality
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Status update functionality to be implemented')),
              );
            },
            child: const Text('Converted'),
          ),
        ],
      ),
    );
  }
}