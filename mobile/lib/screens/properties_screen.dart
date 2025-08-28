import 'package:flutter/material.dart';
import '../services/property_service.dart';
import '../services/favorites_service.dart';
import '../config/api_config.dart';

class PropertiesScreen extends StatefulWidget {
  const PropertiesScreen({super.key});

  @override
  State<PropertiesScreen> createState() => _PropertiesScreenState();
}

class _PropertiesScreenState extends State<PropertiesScreen> {
  final PropertyService _service = PropertyService();
  bool _loading = true;
  String? _error;
  List<dynamic> _properties = const [];
  String _searchQuery = '';
  String _selectedFilter = 'All';

  final List<String> _filterOptions = ['All', 'Apartment', 'House', 'Villa', 'Penthouse'];

  String? _pickPrimaryImage(Map<String, dynamic> p) {
    final dynamic images = p['images'] ?? p['photos'] ?? p['gallery'];
    String? url;
    if (p['coverImage'] is String && (p['coverImage'] as String).isNotEmpty) {
      url = p['coverImage'] as String;
    } else if (images is List && images.isNotEmpty) {
      final first = images.first;
      if (first is String) url = first;
      if (first is Map && first['url'] is String) url = first['url'] as String;
    } else if (p['image'] is String) {
      url = p['image'] as String;
    }
    if (url == null || url.isEmpty) return null;
    if (url.startsWith('http')) return url;
    final base = ApiConfig.baseUrl.replaceFirst(RegExp(r"/api/.*$"), '');
    if (!url.startsWith('/')) url = '/$url';
    return '$base$url';
  }

  List<dynamic> get _filteredProperties {
    return _properties.where((property) {
      final matchesSearch = _searchQuery.isEmpty ||
          property['title']?.toString().toLowerCase().contains(_searchQuery.toLowerCase()) == true ||
          property['address']?.toString().toLowerCase().contains(_searchQuery.toLowerCase()) == true;
      
      final matchesFilter = _selectedFilter == 'All' ||
          property['type']?.toString() == _selectedFilter;
      
      return matchesSearch && matchesFilter;
    }).toList();
  }

  @override
  void initState() {
    super.initState();
    _fetch();
  }

  Future<void> _fetch() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final res = await _service.list();
      final List<dynamic> data = (res['data'] ?? res) as List<dynamic>? ?? (res['data']?['data'] as List<dynamic>? ?? []);
      setState(() {
        _properties = data;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Properties'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              Navigator.of(context).pushNamed('/search');
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Search and Filter Bar
          Container(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // Search Bar
                TextField(
                  decoration: InputDecoration(
                    hintText: 'Search properties...',
                    prefixIcon: const Icon(Icons.search),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    filled: true,
                    fillColor: theme.colorScheme.surfaceVariant,
                  ),
                  onChanged: (value) {
                    setState(() {
                      _searchQuery = value;
                    });
                  },
                ),
                
                const SizedBox(height: 16),
                
                // Filter Chips
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: _filterOptions.map((filter) {
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: FilterChip(
                          label: Text(filter),
                          selected: _selectedFilter == filter,
                          onSelected: (selected) {
                            setState(() {
                              _selectedFilter = selected ? filter : 'All';
                            });
                          },
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),
          
          // Results Count
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${_filteredProperties.length} properties found',
                  style: theme.textTheme.titleMedium?.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
                if (_filteredProperties.isNotEmpty)
                  TextButton.icon(
                    onPressed: _fetch,
                    icon: const Icon(Icons.refresh),
                    label: const Text('Refresh'),
                  ),
              ],
            ),
          ),
          
          const SizedBox(height: 8),
          
          // Properties List
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _error != null
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.error_outline,
                              size: 64,
                              color: theme.colorScheme.error,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              'Failed to load properties',
                              style: theme.textTheme.titleLarge?.copyWith(
                                color: theme.colorScheme.error,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              _error!,
                              style: theme.textTheme.bodyMedium?.copyWith(
                                color: theme.colorScheme.onSurfaceVariant,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 16),
                            ElevatedButton(
                              onPressed: _fetch,
                              child: const Text('Retry'),
                            ),
                          ],
                        ),
                      )
                    : _filteredProperties.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.search_off,
                                  size: 64,
                                  color: theme.colorScheme.onSurfaceVariant,
                                ),
                                const SizedBox(height: 16),
                                Text(
                                  'No properties found',
                                  style: theme.textTheme.titleLarge?.copyWith(
                                    color: theme.colorScheme.onSurfaceVariant,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Try adjusting your search criteria',
                                  style: theme.textTheme.bodyMedium?.copyWith(
                                    color: theme.colorScheme.onSurfaceVariant,
                                  ),
                                ),
                              ],
                            ),
                          )
                        : RefreshIndicator(
                            onRefresh: _fetch,
                            child: ListView.builder(
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              itemCount: _filteredProperties.length,
                              itemBuilder: (context, index) {
                                final property = _filteredProperties[index];
                                return _buildPropertyCard(context, property, theme);
                              },
                            ),
                          ),
          ),
        ],
      ),
    );
  }

  Widget _buildPropertyCard(BuildContext context, Map<String, dynamic> property, ThemeData theme) {
    final title = property['title']?.toString() ?? 'Untitled';
    final address = property['address']?.toString() ?? '';
    final price = (property['price']?.toString() ?? '').isEmpty ? '' : '₹${property['price']}';
    final type = property['type']?.toString() ?? 'Property';
    final bedrooms = property['bedrooms']?.toString() ?? '';
    final bathrooms = property['bathrooms']?.toString() ?? '';
    final area = property['area']?.toString() ?? '';
    final imageUrl = _pickPrimaryImage(property);
    
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 4,
      shadowColor: theme.colorScheme.shadow.withOpacity(0.1),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      child: InkWell(
        onTap: () {
          Navigator.of(context).pushNamed(
            '/property-detail',
            arguments: property['_id']?.toString() ?? '',
          );
        },
        borderRadius: BorderRadius.circular(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Property Image
            ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
              child: AspectRatio(
                aspectRatio: 16 / 9,
                child: imageUrl == null
                    ? Container(
                        color: theme.colorScheme.surfaceVariant,
                        child: Icon(
                          Icons.home_outlined,
                          size: 48,
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                      )
                    : Image.network(
                        imageUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Container(
                          color: theme.colorScheme.surfaceVariant,
                          child: Icon(
                            Icons.broken_image,
                            size: 48,
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ),
              ),
            ),
            
            // Property Details
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Property Type Badge
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primaryContainer,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      type,
                      style: theme.textTheme.labelMedium?.copyWith(
                        color: theme.colorScheme.onPrimaryContainer,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 12),
                  
                  // Title
                  Text(
                    title,
                    style: theme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  
                  const SizedBox(height: 8),
                  
                  // Address
                  Row(
                    children: [
                      Icon(
                        Icons.location_on_outlined,
                        size: 16,
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          address,
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Property Features
                  Row(
                    children: [
                      if (bedrooms.isNotEmpty) ...[
                        _buildFeatureChip(
                          context,
                          Icons.bed,
                          '$bedrooms Beds',
                          theme,
                        ),
                        const SizedBox(width: 12),
                      ],
                      if (bathrooms.isNotEmpty) ...[
                        _buildFeatureChip(
                          context,
                          Icons.bathroom_outlined,
                          '$bathrooms Baths',
                          theme,
                        ),
                        const SizedBox(width: 12),
                      ],
                      if (area.isNotEmpty) ...[
                        _buildFeatureChip(
                          context,
                          Icons.square_foot,
                          '$area sq ft',
                          theme,
                        ),
                      ],
                    ],
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Price and Action
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      if (price.isNotEmpty)
                        Text(
                          price,
                          style: theme.textTheme.headlineSmall?.copyWith(
                            color: theme.colorScheme.primary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ElevatedButton(
                        onPressed: () {
                          Navigator.of(context).pushNamed(
                            '/property-detail',
                            arguments: property['_id']?.toString() ?? '',
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: theme.colorScheme.primary,
                          foregroundColor: theme.colorScheme.onPrimary,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text('View Details'),
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

  Widget _buildFeatureChip(BuildContext context, IconData icon, String label, ThemeData theme) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceVariant,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 16,
            color: theme.colorScheme.onSurfaceVariant,
          ),
          const SizedBox(width: 4),
          Text(
            label,
            style: theme.textTheme.bodySmall?.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
        ],
      ),
    );
  }
}

class PropertyDetailScreen extends StatefulWidget {
  final String id;
  const PropertyDetailScreen({super.key, required this.id});

  @override
  State<PropertyDetailScreen> createState() => _PropertyDetailScreenState();
}

class _PropertyDetailScreenState extends State<PropertyDetailScreen> {
  final PropertyService _service = PropertyService();
  final FavoritesService _favorites = FavoritesService();
  bool _loading = true;
  String? _error;
  Map<String, dynamic>? _property;
  bool _isFavorite = false;
  final TextEditingController _messageController = TextEditingController();
  String _contactMethod = 'message';
  int _imageIndex = 0;

  List<String> _extractImages(Map<String, dynamic> p) {
    final List<String> result = [];
    final dynamic images = p['images'] ?? p['photos'] ?? p['gallery'];
    void addUrl(String? u) {
      if (u == null || u.isEmpty) return;
      if (u.startsWith('http')) {
        result.add(u);
      } else {
        final base = ApiConfig.baseUrl.replaceFirst(RegExp(r"/api/.*$"), '');
        final path = u.startsWith('/') ? u : '/$u';
        result.add('$base$path');
      }
    }
    if (p['coverImage'] is String) addUrl(p['coverImage'] as String);
    if (images is List) {
      for (final item in images) {
        if (item is String) addUrl(item);
        if (item is Map && item['url'] is String) addUrl(item['url'] as String);
      }
    }
    if (result.isEmpty && p['image'] is String) addUrl(p['image'] as String);
    return result;
  }

  @override
  void initState() {
    super.initState();
    _fetch();
  }

  Future<void> _fetch() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final res = await _service.detail(widget.id);
      setState(() {
        _property = (res['data'] ?? res) as Map<String, dynamic>;
      });
      try {
        final status = await _favorites.status(widget.id);
        if (mounted) setState(() => _isFavorite = status);
      } catch (_) {}
    } catch (e) {
      setState(() {
        _error = e.toString();
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  Future<void> _toggleFavorite() async {
    try {
      setState(() => _isFavorite = !_isFavorite);
      await _favorites.toggle(widget.id);
    } catch (e) {
      setState(() => _isFavorite = !_isFavorite);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to update favorite: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Property Detail'),
        actions: [
          IconButton(
            icon: Icon(_isFavorite ? Icons.favorite : Icons.favorite_border),
            onPressed: _toggleFavorite,
          )
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text(_error!, style: const TextStyle(color: Colors.red)))
              : _property == null
                  ? const Center(child: Text('Not found'))
                  : Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: ListView(
                        children: [
                          // Images carousel
                          Builder(builder: (context) {
                            final images = _extractImages(_property!);
                            if (images.isEmpty) {
                              return AspectRatio(
                                aspectRatio: 16/9,
                                child: Container(
                                  decoration: BoxDecoration(color: Colors.grey.shade200, borderRadius: BorderRadius.circular(8)),
                                  child: const Icon(Icons.image_not_supported),
                                ),
                              );
                            }
                            return Column(
                              children: [
                                AspectRatio(
                                  aspectRatio: 16/9,
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(12),
                                    child: PageView.builder(
                                      itemCount: images.length,
                                      onPageChanged: (i) => setState(() => _imageIndex = i),
                                      itemBuilder: (_, i) => Image.network(
                                        images[i],
                                        fit: BoxFit.cover,
                                        errorBuilder: (_, __, ___) => Container(color: Colors.grey.shade300, child: const Icon(Icons.broken_image)),
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: List.generate(images.length, (i) => Container(
                                    width: 8,
                                    height: 8,
                                    margin: const EdgeInsets.symmetric(horizontal: 3),
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: i == _imageIndex ? Colors.indigo : Colors.grey.shade400,
                                    ),
                                  )),
                                )
                              ],
                            );
                          }),
                          const SizedBox(height: 16),
                          Text(_property!['title']?.toString() ?? '', style: Theme.of(context).textTheme.headlineSmall),
                          const SizedBox(height: 8),
                          Text(_property!['address']?.toString() ?? ''),
                          const SizedBox(height: 12),
                          Text((_property!['description']?.toString() ?? '')), 
                          const SizedBox(height: 24),
                          TextField(
                            controller: _messageController,
                            decoration: const InputDecoration(
                              labelText: 'Message to agent',
                              border: OutlineInputBorder(),
                            ),
                            maxLines: 3,
                          ),
                          const SizedBox(height: 12),
                          DropdownButtonFormField<String>(
                            value: _contactMethod,
                            items: const [
                              DropdownMenuItem(value: 'message', child: Text('Message')),
                              DropdownMenuItem(value: 'email', child: Text('Email')),
                              DropdownMenuItem(value: 'whatsapp', child: Text('WhatsApp')),
                              DropdownMenuItem(value: 'call', child: Text('Call')),
                            ],
                            onChanged: (v) => setState(() => _contactMethod = v ?? 'message'),
                            decoration: const InputDecoration(labelText: 'Preferred contact method'),
                          ),
                          const SizedBox(height: 12),
                          ElevatedButton.icon(
                            onPressed: () async {
                              try {
                                await _service.contact(
                                  id: widget.id,
                                  message: _messageController.text.trim().isEmpty
                                      ? 'Interested in this property'
                                      : _messageController.text.trim(),
                                  contactMethod: _contactMethod,
                                );
                                if (mounted) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('Contact request sent')),
                                  );
                                }
                              } catch (e) {
                                if (mounted) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text('Failed to contact: $e')),
                                  );
                                }
                              }
                            },
                            icon: const Icon(Icons.send),
                            label: const Text('Contact Agent'),
                          ),
                        ],
                      ),
                    ),
    );
  }
}

