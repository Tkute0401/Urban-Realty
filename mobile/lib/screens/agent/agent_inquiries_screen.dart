import 'package:flutter/material.dart';
import '../../services/agent_service.dart';

class AgentInquiriesScreen extends StatefulWidget {
  const AgentInquiriesScreen({super.key});

  @override
  State<AgentInquiriesScreen> createState() => _AgentInquiriesScreenState();
}

class _AgentInquiriesScreenState extends State<AgentInquiriesScreen> {
  final AgentService _agentService = AgentService();
  List<Map<String, dynamic>> _inquiries = [];
  bool _isLoading = true;
  int _currentPage = 1;
  final int _limit = 10;
  bool _hasMoreData = true;

  @override
  void initState() {
    super.initState();
    _loadInquiries();
  }

  Future<void> _loadInquiries({bool refresh = false}) async {
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

      final inquiries = await _agentService.getAgentInquiries(page: _currentPage, limit: _limit);
      
      setState(() {
        if (refresh) {
          _inquiries = inquiries;
        } else {
          _inquiries.addAll(inquiries);
        }
        _isLoading = false;
        _hasMoreData = inquiries.length == _limit;
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
        title: const Text('Inquiries'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
      ),
      body: RefreshIndicator(
        onRefresh: () => _loadInquiries(refresh: true),
        child: _inquiries.isEmpty && !_isLoading
            ? const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.message_outlined, size: 64, color: Colors.grey),
                    SizedBox(height: 16),
                    Text('No inquiries found'),
                  ],
                ),
              )
            : ListView.builder(
                padding: const EdgeInsets.all(16.0),
                itemCount: _inquiries.length + (_hasMoreData ? 1 : 0),
                itemBuilder: (context, index) {
                  if (index == _inquiries.length) {
                    return _buildLoadMoreButton();
                  }
                  return _buildInquiryCard(_inquiries[index]);
                },
              ),
      ),
    );
  }

  Widget _buildInquiryCard(Map<String, dynamic> inquiry) {
    final status = inquiry['status'] ?? 'new';
    final statusColor = _getInquiryStatusColor(status);
    
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Theme.of(context).primaryColor,
          child: const Icon(Icons.message, color: Colors.white, size: 16),
        ),
        title: Text(
          inquiry['subject'] ?? 'No Subject',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(inquiry['message'] ?? '', maxLines: 2, overflow: TextOverflow.ellipsis),
            const SizedBox(height: 4),
            Text('From: ${inquiry['name'] ?? 'Unknown'}'),
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
          onSelected: (value) => _handleInquiryAction(value, inquiry),
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
              value: 'reply',
              child: Row(
                children: [
                  Icon(Icons.reply),
                  SizedBox(width: 8),
                  Text('Reply'),
                ],
              ),
            ),
            const PopupMenuItem(
              value: 'mark',
              child: Row(
                children: [
                  Icon(Icons.check),
                  SizedBox(width: 8),
                  Text('Mark as Read'),
                ],
              ),
            ),
          ],
        ),
        onTap: () => _showInquiryDetails(inquiry),
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
                onPressed: () => _loadInquiries(),
                child: const Text('Load More'),
              ),
      ),
    );
  }

  Color _getInquiryStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'new':
        return Colors.red;
      case 'read':
        return Colors.blue;
      case 'replied':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  void _showInquiryDetails(Map<String, dynamic> inquiry) {
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
                  child: const Icon(Icons.message, color: Colors.white),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        inquiry['subject'] ?? 'No Subject',
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        'From: ${inquiry['name'] ?? 'Unknown'}',
                        style: const TextStyle(color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildDetailRow('Email', inquiry['email'] ?? 'Not provided'),
            _buildDetailRow('Phone', inquiry['phone'] ?? 'Not provided'),
            _buildDetailRow('Date', inquiry['date'] ?? 'Unknown'),
            _buildDetailRow('Status', inquiry['status'] ?? 'new'),
            const SizedBox(height: 16),
            const Text(
              'Message:',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(inquiry['message'] ?? 'No message content'),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      _handleInquiryAction('reply', inquiry);
                    },
                    child: const Text('Reply'),
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

  void _handleInquiryAction(String action, Map<String, dynamic> inquiry) {
    switch (action) {
      case 'view':
        _showInquiryDetails(inquiry);
        break;
      case 'reply':
        _replyToInquiry(inquiry);
        break;
      case 'mark':
        _markInquiryAsRead(inquiry);
        break;
    }
  }

  void _replyToInquiry(Map<String, dynamic> inquiry) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Reply to Inquiry'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Reply to: ${inquiry['name'] ?? 'Unknown'}'),
            const SizedBox(height: 16),
            const TextField(
              maxLines: 4,
              decoration: InputDecoration(
                hintText: 'Enter your reply...',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              // Implement reply functionality
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Reply functionality to be implemented')),
              );
            },
            child: const Text('Send Reply'),
          ),
        ],
      ),
    );
  }

  void _markInquiryAsRead(Map<String, dynamic> inquiry) {
    _updateInquiryStatus(inquiry, 'contacted');
  }

  Future<void> _updateInquiryStatus(Map<String, dynamic> inquiry, String status) async {
    try {
      final id = (inquiry['_id'] ?? inquiry['id'] ?? '').toString();
      if (id.isEmpty) throw Exception('Invalid contact id');
      await _agentService.updateContactStatus(contactId: id, status: status);
      if (!mounted) return;
      setState(() {
        final index = _inquiries.indexWhere((q) => (q['_id'] ?? q['id']).toString() == id);
        if (index != -1) {
          _inquiries[index] = {
            ..._inquiries[index],
            'status': status,
          };
        }
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Inquiry marked as ' + status)),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to update status: ' + e.toString())),
      );
    }
  }
}