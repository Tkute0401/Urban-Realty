import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/design_tokens.dart';

class AdminContactsScreen extends ConsumerStatefulWidget {
  const AdminContactsScreen({super.key});

  @override
  ConsumerState<AdminContactsScreen> createState() => _AdminContactsScreenState();
}

class _AdminContactsScreenState extends ConsumerState<AdminContactsScreen> {
  String _selectedFilter = 'all';
  String _searchQuery = '';
  final TextEditingController _searchController = TextEditingController();

  final List<String> _filters = ['all', 'leads', 'clients', 'agents', 'vendors'];

  final List<Contact> _contacts = [
    Contact(
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      type: 'client',
      status: 'active',
      lastContact: DateTime.now().subtract(const Duration(days: 2)),
      notes: 'Interested in downtown properties',
      source: 'Website',
    ),
    Contact(
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 234-5678',
      type: 'lead',
      status: 'new',
      lastContact: DateTime.now().subtract(const Duration(hours: 5)),
      notes: 'Looking for 3-bedroom house',
      source: 'Referral',
    ),
    Contact(
      id: '3',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '+1 (555) 345-6789',
      type: 'agent',
      status: 'active',
      lastContact: DateTime.now().subtract(const Duration(days: 1)),
      notes: 'Top performing agent',
      source: 'Direct',
    ),
    Contact(
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 456-7890',
      type: 'vendor',
      status: 'active',
      lastContact: DateTime.now().subtract(const Duration(days: 7)),
      notes: 'Home inspection services',
      source: 'Partnership',
    ),
    Contact(
      id: '5',
      name: 'Robert Wilson',
      email: 'robert.w@email.com',
      phone: '+1 (555) 567-8901',
      type: 'client',
      status: 'inactive',
      lastContact: DateTime.now().subtract(const Duration(days: 30)),
      notes: 'Previous client, may be interested in selling',
      source: 'Website',
    ),
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final filteredContacts = _getFilteredContacts();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Contacts Management'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: _addContact,
          ),
          IconButton(
            icon: const Icon(Icons.import_export),
            onPressed: _importContacts,
          ),
        ],
      ),
      body: Column(
        children: [
          // Search and Filter Bar
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
            child: Column(
              children: [
                // Search Bar
                TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: 'Search contacts...',
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
                const SizedBox(height: DesignTokens.spaceMd),
                
                // Filter Chips
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: _filters.map((filter) {
                      final isSelected = _selectedFilter == filter;
                      return Padding(
                        padding: const EdgeInsets.only(right: DesignTokens.spaceSm),
                        child: FilterChip(
                          label: Text(filter.capitalize()),
                          selected: isSelected,
                          onSelected: (selected) {
                            setState(() {
                              _selectedFilter = filter;
                            });
                          },
                          selectedColor: Theme.of(context).colorScheme.primary.withOpacity(0.2),
                          checkmarkColor: Theme.of(context).colorScheme.primary,
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),

          // Contact Stats
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: DesignTokens.spaceLg,
              vertical: DesignTokens.spaceMd,
            ),
            child: Row(
              children: [
                _buildStatChip(context, 'Total', '${_contacts.length}'),
                const SizedBox(width: DesignTokens.spaceSm),
                _buildStatChip(context, 'Active', '${_contacts.where((c) => c.status == 'active').length}'),
                const SizedBox(width: DesignTokens.spaceSm),
                _buildStatChip(context, 'New', '${_contacts.where((c) => c.status == 'new').length}'),
                const SizedBox(width: DesignTokens.spaceSm),
                _buildStatChip(context, 'Clients', '${_contacts.where((c) => c.type == 'client').length}'),
              ],
            ),
          ),

          // Contacts List
          Expanded(
            child: filteredContacts.isEmpty
                ? _buildEmptyState(context)
                : ListView.builder(
                    padding: const EdgeInsets.all(DesignTokens.spaceLg),
                    itemCount: filteredContacts.length,
                    itemBuilder: (context, index) {
                      return _buildContactCard(context, filteredContacts[index]);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  List<Contact> _getFilteredContacts() {
    List<Contact> filtered = _contacts;

    // Filter by type
    if (_selectedFilter != 'all') {
      filtered = filtered.where((contact) => contact.type == _selectedFilter).toList();
    }

    // Filter by search query
    if (_searchQuery.isNotEmpty) {
      filtered = filtered.where((contact) =>
          contact.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          contact.email.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          contact.phone.contains(_searchQuery)).toList();
    }

    return filtered;
  }

  Widget _buildStatChip(BuildContext context, String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: DesignTokens.spaceSm,
        vertical: DesignTokens.spaceXs,
      ),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(DesignTokens.radiusSm),
        border: Border.all(
          color: Theme.of(context).colorScheme.primary.withOpacity(0.3),
        ),
      ),
      child: Text(
        '$label: $value',
        style: TextStyle(
          color: Theme.of(context).colorScheme.primary,
          fontSize: DesignTokens.fontSizeSm,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.people_outline,
            size: DesignTokens.iconSize2xl,
            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.5),
          ),
          const SizedBox(height: DesignTokens.spaceLg),
          Text(
            'No contacts found',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
            ),
          ),
          const SizedBox(height: DesignTokens.spaceSm),
          Text(
            'Add some contacts to get started',
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.5),
            ),
          ),
          const SizedBox(height: DesignTokens.spaceLg),
          ElevatedButton.icon(
            onPressed: _addContact,
            icon: const Icon(Icons.add),
            label: const Text('Add Contact'),
          ),
        ],
      ),
    );
  }

  Widget _buildContactCard(BuildContext context, Contact contact) {
    return Card(
      margin: const EdgeInsets.only(bottom: DesignTokens.spaceMd),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
      ),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: _getContactColor(contact.type),
          child: Text(
            contact.name[0].toUpperCase(),
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        title: Text(
          contact.name,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(contact.email),
            Text(contact.phone),
            Row(
              children: [
                _buildStatusChip(context, contact.status),
                const SizedBox(width: DesignTokens.spaceXs),
                _buildTypeChip(context, contact.type),
              ],
            ),
          ],
        ),
        trailing: PopupMenuButton(
          itemBuilder: (context) => [
            const PopupMenuItem(
              value: 'view',
              child: Text('View Details'),
            ),
            const PopupMenuItem(
              value: 'edit',
              child: Text('Edit'),
            ),
            const PopupMenuItem(
              value: 'call',
              child: Text('Call'),
            ),
            const PopupMenuItem(
              value: 'email',
              child: Text('Send Email'),
            ),
            const PopupMenuItem(
              value: 'delete',
              child: Text('Delete'),
            ),
          ],
          onSelected: (value) => _handleContactAction(value, contact),
        ),
        onTap: () => _viewContactDetails(contact),
      ),
    );
  }

  Widget _buildStatusChip(BuildContext context, String status) {
    Color color;
    switch (status) {
      case 'active':
        color = Colors.green;
        break;
      case 'new':
        color = Colors.blue;
        break;
      case 'inactive':
        color = Colors.grey;
        break;
      default:
        color = Colors.grey;
    }

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: DesignTokens.spaceXs,
        vertical: 2,
      ),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(DesignTokens.radiusSm),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Text(
        status.capitalize(),
        style: TextStyle(
          color: color,
          fontSize: DesignTokens.fontSizeXs,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildTypeChip(BuildContext context, String type) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: DesignTokens.spaceXs,
        vertical: 2,
      ),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(DesignTokens.radiusSm),
        border: Border.all(
          color: Theme.of(context).colorScheme.primary.withOpacity(0.3),
        ),
      ),
      child: Text(
        type.capitalize(),
        style: TextStyle(
          color: Theme.of(context).colorScheme.primary,
          fontSize: DesignTokens.fontSizeXs,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Color _getContactColor(String type) {
    switch (type) {
      case 'client':
        return Colors.blue;
      case 'lead':
        return Colors.green;
      case 'agent':
        return Colors.orange;
      case 'vendor':
        return Colors.purple;
      default:
        return Colors.grey;
    }
  }

  void _addContact() {
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
                'Add New Contact',
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
                        decoration: const InputDecoration(
                          labelText: 'Full Name',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: DesignTokens.spaceMd),
                      TextFormField(
                        decoration: const InputDecoration(
                          labelText: 'Email',
                          border: OutlineInputBorder(),
                        ),
                        keyboardType: TextInputType.emailAddress,
                      ),
                      const SizedBox(height: DesignTokens.spaceMd),
                      TextFormField(
                        decoration: const InputDecoration(
                          labelText: 'Phone',
                          border: OutlineInputBorder(),
                        ),
                        keyboardType: TextInputType.phone,
                      ),
                      const SizedBox(height: DesignTokens.spaceMd),
                      DropdownButtonFormField<String>(
                        decoration: const InputDecoration(
                          labelText: 'Contact Type',
                          border: OutlineInputBorder(),
                        ),
                        items: ['client', 'lead', 'agent', 'vendor'].map((String type) {
                          return DropdownMenuItem<String>(
                            value: type,
                            child: Text(type.capitalize()),
                          );
                        }).toList(),
                        onChanged: (String? newValue) {},
                      ),
                      const SizedBox(height: DesignTokens.spaceMd),
                      DropdownButtonFormField<String>(
                        decoration: const InputDecoration(
                          labelText: 'Status',
                          border: OutlineInputBorder(),
                        ),
                        items: ['active', 'new', 'inactive'].map((String status) {
                          return DropdownMenuItem<String>(
                            value: status,
                            child: Text(status.capitalize()),
                          );
                        }).toList(),
                        onChanged: (String? newValue) {},
                      ),
                      const SizedBox(height: DesignTokens.spaceMd),
                      TextFormField(
                        decoration: const InputDecoration(
                          labelText: 'Notes',
                          border: OutlineInputBorder(),
                          alignLabelWithHint: true,
                        ),
                        maxLines: 3,
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
                      onPressed: _saveContact,
                      child: const Text('Save Contact'),
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

  void _viewContactDetails(Contact contact) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(contact.name),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Email: ${contact.email}'),
            Text('Phone: ${contact.phone}'),
            Text('Type: ${contact.type.capitalize()}'),
            Text('Status: ${contact.status.capitalize()}'),
            Text('Source: ${contact.source}'),
            Text('Last Contact: ${_formatDate(contact.lastContact)}'),
            if (contact.notes.isNotEmpty) ...[
              const SizedBox(height: DesignTokens.spaceSm),
              Text('Notes: ${contact.notes}'),
            ],
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _editContact(contact);
            },
            child: const Text('Edit'),
          ),
        ],
      ),
    );
  }

  void _editContact(Contact contact) {
    // TODO: Implement edit contact
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Edit ${contact.name}')),
    );
  }

  void _handleContactAction(String action, Contact contact) {
    switch (action) {
      case 'view':
        _viewContactDetails(contact);
        break;
      case 'edit':
        _editContact(contact);
        break;
      case 'call':
        // TODO: Implement call functionality
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Calling ${contact.phone}')),
        );
        break;
      case 'email':
        // TODO: Implement email functionality
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Sending email to ${contact.email}')),
        );
        break;
      case 'delete':
        _deleteContact(contact);
        break;
    }
  }

  void _deleteContact(Contact contact) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Contact'),
        content: Text('Are you sure you want to delete "${contact.name}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() {
                _contacts.removeWhere((c) => c.id == contact.id);
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('${contact.name} deleted')),
              );
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  void _saveContact() {
    Navigator.pop(context);
    // TODO: Implement save contact
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Contact saved')),
    );
  }

  void _importContacts() {
    // TODO: Implement import contacts
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Import contacts functionality not implemented yet')),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays > 0) {
      return '${difference.inDays} days ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} hours ago';
    } else {
      return 'Just now';
    }
  }
}

class Contact {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String type;
  final String status;
  final DateTime lastContact;
  final String notes;
  final String source;

  Contact({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.type,
    required this.status,
    required this.lastContact,
    required this.notes,
    required this.source,
  });
}

extension StringExtension on String {
  String capitalize() {
    if (isEmpty) return this;
    return this[0].toUpperCase() + substring(1);
  }
}
