import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/design_tokens.dart';

class AdminMediaScreen extends ConsumerStatefulWidget {
  const AdminMediaScreen({super.key});

  @override
  ConsumerState<AdminMediaScreen> createState() => _AdminMediaScreenState();
}

class _AdminMediaScreenState extends ConsumerState<AdminMediaScreen> {
  String _selectedFilter = 'all';
  String _selectedSort = 'newest';
  bool _isGridView = true;

  final List<String> _filters = ['all', 'images', 'documents', 'videos'];
  final List<String> _sortOptions = ['newest', 'oldest', 'name', 'size'];

  final List<MediaItem> _mediaItems = [
    MediaItem(
      id: '1',
      name: 'property_1_main.jpg',
      type: 'image',
      size: '2.4 MB',
      uploadedAt: DateTime.now().subtract(const Duration(days: 2)),
      propertyId: 'prop_1',
      url: 'https://picsum.photos/800/600?random=1',
    ),
    MediaItem(
      id: '2',
      name: 'floor_plan.pdf',
      type: 'document',
      size: '1.2 MB',
      uploadedAt: DateTime.now().subtract(const Duration(days: 5)),
      propertyId: 'prop_1',
      url: 'https://example.com/floor_plan.pdf',
    ),
    MediaItem(
      id: '3',
      name: 'property_tour.mp4',
      type: 'video',
      size: '15.8 MB',
      uploadedAt: DateTime.now().subtract(const Duration(days: 1)),
      propertyId: 'prop_2',
      url: 'https://example.com/tour.mp4',
    ),
    MediaItem(
      id: '4',
      name: 'property_2_garden.jpg',
      type: 'image',
      size: '3.1 MB',
      uploadedAt: DateTime.now().subtract(const Duration(hours: 12)),
      propertyId: 'prop_2',
      url: 'https://picsum.photos/800/600?random=2',
    ),
    MediaItem(
      id: '5',
      name: 'contract_template.docx',
      type: 'document',
      size: '0.8 MB',
      uploadedAt: DateTime.now().subtract(const Duration(days: 10)),
      propertyId: null,
      url: 'https://example.com/contract.docx',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final filteredItems = _getFilteredItems();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Media Management'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        elevation: 0,
        actions: [
          IconButton(
            icon: Icon(_isGridView ? Icons.view_list : Icons.grid_view),
            onPressed: () {
              setState(() {
                _isGridView = !_isGridView;
              });
            },
          ),
          IconButton(
            icon: const Icon(Icons.upload),
            onPressed: _uploadMedia,
          ),
        ],
      ),
      body: Column(
        children: [
          // Filters and Search
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
                  decoration: InputDecoration(
                    hintText: 'Search media files...',
                    prefixIcon: const Icon(Icons.search),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
                    ),
                  ),
                ),
                const SizedBox(height: DesignTokens.spaceMd),
                
                // Filters and Sort
                Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _selectedFilter,
                        decoration: const InputDecoration(
                          labelText: 'Filter by Type',
                          border: OutlineInputBorder(),
                        ),
                        items: _filters.map((String filter) {
                          return DropdownMenuItem<String>(
                            value: filter,
                            child: Text(filter.capitalize()),
                          );
                        }).toList(),
                        onChanged: (String? newValue) {
                          setState(() {
                            _selectedFilter = newValue!;
                          });
                        },
                      ),
                    ),
                    const SizedBox(width: DesignTokens.spaceMd),
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _selectedSort,
                        decoration: const InputDecoration(
                          labelText: 'Sort by',
                          border: OutlineInputBorder(),
                        ),
                        items: _sortOptions.map((String sort) {
                          return DropdownMenuItem<String>(
                            value: sort,
                            child: Text(sort.capitalize()),
                          );
                        }).toList(),
                        onChanged: (String? newValue) {
                          setState(() {
                            _selectedSort = newValue!;
                          });
                        },
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Media Stats
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: DesignTokens.spaceLg,
              vertical: DesignTokens.spaceMd,
            ),
            child: Row(
              children: [
                _buildStatChip(context, 'Total Files', '${filteredItems.length}'),
                const SizedBox(width: DesignTokens.spaceSm),
                _buildStatChip(context, 'Images', '${filteredItems.where((item) => item.type == 'image').length}'),
                const SizedBox(width: DesignTokens.spaceSm),
                _buildStatChip(context, 'Documents', '${filteredItems.where((item) => item.type == 'document').length}'),
                const SizedBox(width: DesignTokens.spaceSm),
                _buildStatChip(context, 'Videos', '${filteredItems.where((item) => item.type == 'video').length}'),
              ],
            ),
          ),

          // Media Grid/List
          Expanded(
            child: filteredItems.isEmpty
                ? _buildEmptyState(context)
                : _isGridView
                    ? _buildGridView(context, filteredItems)
                    : _buildListView(context, filteredItems),
          ),
        ],
      ),
    );
  }

  List<MediaItem> _getFilteredItems() {
    List<MediaItem> filtered = _mediaItems;

    // Filter by type
    if (_selectedFilter != 'all') {
      filtered = filtered.where((item) => item.type == _selectedFilter).toList();
    }

    // Sort items
    switch (_selectedSort) {
      case 'newest':
        filtered.sort((a, b) => b.uploadedAt.compareTo(a.uploadedAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => a.uploadedAt.compareTo(b.uploadedAt));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.compareTo(b.name));
        break;
      case 'size':
        // For demo, we'll sort by name since we don't have actual size values
        filtered.sort((a, b) => a.name.compareTo(b.name));
        break;
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
            Icons.photo_library_outlined,
            size: DesignTokens.iconSize2xl,
            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.5),
          ),
          const SizedBox(height: DesignTokens.spaceLg),
          Text(
            'No media files found',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
            ),
          ),
          const SizedBox(height: DesignTokens.spaceSm),
          Text(
            'Upload some media files to get started',
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.5),
            ),
          ),
          const SizedBox(height: DesignTokens.spaceLg),
          ElevatedButton.icon(
            onPressed: _uploadMedia,
            icon: const Icon(Icons.upload),
            label: const Text('Upload Media'),
          ),
        ],
      ),
    );
  }

  Widget _buildGridView(BuildContext context, List<MediaItem> items) {
    return GridView.builder(
      padding: const EdgeInsets.all(DesignTokens.spaceLg),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.8,
        crossAxisSpacing: DesignTokens.spaceMd,
        mainAxisSpacing: DesignTokens.spaceMd,
      ),
      itemCount: items.length,
      itemBuilder: (context, index) {
        return _buildMediaCard(context, items[index]);
      },
    );
  }

  Widget _buildListView(BuildContext context, List<MediaItem> items) {
    return ListView.builder(
      padding: const EdgeInsets.all(DesignTokens.spaceLg),
      itemCount: items.length,
      itemBuilder: (context, index) {
        return _buildMediaListItem(context, items[index]);
      },
    );
  }

  Widget _buildMediaCard(BuildContext context, MediaItem item) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
      ),
      child: InkWell(
        onTap: () => _viewMedia(item),
        borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Media Preview
            Expanded(
              child: Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surfaceVariant,
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(DesignTokens.radiusMd),
                  ),
                ),
                child: _buildMediaPreview(context, item),
              ),
            ),
            
            // Media Info
            Padding(
              padding: const EdgeInsets.all(DesignTokens.spaceSm),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.name,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    item.size,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                    ),
                  ),
                  Text(
                    _formatDate(item.uploadedAt),
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMediaListItem(BuildContext context, MediaItem item) {
    return Card(
      margin: const EdgeInsets.only(bottom: DesignTokens.spaceMd),
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
      ),
      child: ListTile(
        leading: Container(
          width: 60,
          height: 60,
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surfaceVariant,
            borderRadius: BorderRadius.circular(DesignTokens.radiusSm),
          ),
          child: _buildMediaPreview(context, item),
        ),
        title: Text(
          item.name,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('${item.type.capitalize()} • ${item.size}'),
            Text(_formatDate(item.uploadedAt)),
          ],
        ),
        trailing: PopupMenuButton(
          itemBuilder: (context) => [
            const PopupMenuItem(
              value: 'view',
              child: Text('View'),
            ),
            const PopupMenuItem(
              value: 'edit',
              child: Text('Edit'),
            ),
            const PopupMenuItem(
              value: 'download',
              child: Text('Download'),
            ),
            const PopupMenuItem(
              value: 'delete',
              child: Text('Delete'),
            ),
          ],
          onSelected: (value) => _handleMediaAction(value, item),
        ),
        onTap: () => _viewMedia(item),
      ),
    );
  }

  Widget _buildMediaPreview(BuildContext context, MediaItem item) {
    switch (item.type) {
      case 'image':
        return ClipRRect(
          borderRadius: BorderRadius.circular(DesignTokens.radiusSm),
          child: Image.network(
            item.url,
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) => const Icon(
              Icons.image,
              size: 32,
              color: Colors.grey,
            ),
          ),
        );
      case 'video':
        return const Icon(
          Icons.play_circle_outline,
          size: 32,
          color: Colors.grey,
        );
      case 'document':
        return const Icon(
          Icons.description,
          size: 32,
          color: Colors.grey,
        );
      default:
        return const Icon(
          Icons.insert_drive_file,
          size: 32,
          color: Colors.grey,
        );
    }
  }

  void _uploadMedia() {
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
                'Upload Media',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: DesignTokens.spaceLg),
              Text(
                'Choose upload method:',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: DesignTokens.spaceLg),
              _buildUploadOption(
                context,
                Icons.camera_alt,
                'Take Photo',
                'Capture a new photo',
                () => _takePhoto(),
              ),
              _buildUploadOption(
                context,
                Icons.photo_library,
                'Choose from Gallery',
                'Select from your photo library',
                () => _chooseFromGallery(),
              ),
              _buildUploadOption(
                context,
                Icons.folder,
                'Choose Files',
                'Select files from device',
                () => _chooseFiles(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildUploadOption(
    BuildContext context,
    IconData icon,
    String title,
    String description,
    VoidCallback onTap,
  ) {
    return Card(
      child: ListTile(
        leading: Icon(icon, color: Theme.of(context).colorScheme.primary),
        title: Text(title),
        subtitle: Text(description),
        trailing: const Icon(Icons.arrow_forward_ios),
        onTap: onTap,
      ),
    );
  }

  void _viewMedia(MediaItem item) {
    // TODO: Implement media viewer
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Viewing ${item.name}')),
    );
  }

  void _handleMediaAction(String action, MediaItem item) {
    switch (action) {
      case 'view':
        _viewMedia(item);
        break;
      case 'edit':
        // TODO: Implement edit
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Edit ${item.name}')),
        );
        break;
      case 'download':
        // TODO: Implement download
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Download ${item.name}')),
        );
        break;
      case 'delete':
        _deleteMedia(item);
        break;
    }
  }

  void _deleteMedia(MediaItem item) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Media'),
        content: Text('Are you sure you want to delete "${item.name}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() {
                _mediaItems.removeWhere((media) => media.id == item.id);
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('${item.name} deleted')),
              );
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  void _takePhoto() {
    Navigator.pop(context);
    // TODO: Implement camera functionality
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Camera functionality not implemented yet')),
    );
  }

  void _chooseFromGallery() {
    Navigator.pop(context);
    // TODO: Implement gallery picker
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Gallery picker not implemented yet')),
    );
  }

  void _chooseFiles() {
    Navigator.pop(context);
    // TODO: Implement file picker
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('File picker not implemented yet')),
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

class MediaItem {
  final String id;
  final String name;
  final String type;
  final String size;
  final DateTime uploadedAt;
  final String? propertyId;
  final String url;

  MediaItem({
    required this.id,
    required this.name,
    required this.type,
    required this.size,
    required this.uploadedAt,
    this.propertyId,
    required this.url,
  });
}

extension StringExtension on String {
  String capitalize() {
    if (isEmpty) return this;
    return this[0].toUpperCase() + substring(1);
  }
}
