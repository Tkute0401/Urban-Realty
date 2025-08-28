import 'package:flutter/material.dart';
import '../services/property_service.dart';
import '../config/api_config.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final PropertyService _service = PropertyService();
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  
  bool _loading = false;
  bool _loadingSuggestions = false;
  String? _error;
  List<dynamic> _properties = const [];
  List<dynamic> _filteredProperties = const [];
  List<dynamic> _searchSuggestions = const [];
  
  // Filter states
  RangeValues _priceRange = const RangeValues(0, 10000000);
  String _propertyType = 'All';
  String _location = 'All';
  int _bedrooms = 0;
  int _bathrooms = 0;
  bool _showFilters = false;
  bool _showSuggestions = false;
  
  final List<String> _propertyTypes = [
    'All', 'Apartment', 'House', 'Villa', 'Penthouse', 'Studio', 'Duplex', 'Land', 'Commercial'
  ];
  
  final List<String> _locations = [
    'All', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'
  ];

  @override
  void initState() {
    super.initState();
    _fetchProperties();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _fetchProperties() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    
    try {
      final res = await _service.list();
      final List<dynamic> data = (res['data'] ?? res) as List<dynamic>? ?? 
          (res['data']?['data'] as List<dynamic>? ?? []);
      
      setState(() {
        _properties = data;
        _filteredProperties = data;
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

  Future<void> _fetchSearchSuggestions(String query) async {
    if (query.length < 2) {
      setState(() {
        _searchSuggestions = [];
        _showSuggestions = false;
      });
      return;
    }

    setState(() {
      _loadingSuggestions = true;
    });

    try {
      final res = await _service.searchSuggestions(query);
      final List<dynamic> suggestions = (res['data'] ?? res) as List<dynamic>? ?? [];
      
      setState(() {
        _searchSuggestions = suggestions;
        _showSuggestions = suggestions.isNotEmpty;
      });
    } catch (e) {
      setState(() {
        _searchSuggestions = [];
        _showSuggestions = false;
      });
    } finally {
      setState(() {
        _loadingSuggestions = false;
      });
    }
  }

  void _applyFilters() {
    setState(() {
      _filteredProperties = _properties.where((property) {
        // Search text filter
        if (_searchController.text.isNotEmpty) {
          final searchLower = _searchController.text.toLowerCase();
          final title = (property['title']?.toString() ?? '').toLowerCase();
          final address = (property['address']?.toString() ?? '').toLowerCase();
          final description = (property['description']?.toString() ?? '').toLowerCase();
          
          if (!title.contains(searchLower) && 
              !address.contains(searchLower) && 
              !description.contains(searchLower)) {
            return false;
          }
        }
        
        // Property type filter
        if (_propertyType != 'All') {
          final type = property['type']?.toString() ?? '';
          if (type != _propertyType) return false;
        }
        
        // Location filter
        if (_location != 'All') {
          final address = property['address']?.toString() ?? '';
          if (!address.contains(_location)) return false;
        }
        
        // Price range filter
        final price = double.tryParse(property['price']?.toString() ?? '0') ?? 0;
        if (price < _priceRange.start || price > _priceRange.end) return false;
        
        // Bedrooms filter
        if (_bedrooms > 0) {
          final beds = int.tryParse(property['bedrooms']?.toString() ?? '0') ?? 0;
          if (beds < _bedrooms) return false;
        }
        
        // Bathrooms filter
        if (_bathrooms > 0) {
          final baths = int.tryParse(property['bathrooms']?.toString() ?? '0') ?? 0;
          if (baths < _bathrooms) return false;
        }
        
        return true;
      }).toList();
    });
  }

  void _clearFilters() {
    setState(() {
      _searchController.clear();
      _priceRange = const RangeValues(0, 10000000);
      _propertyType = 'All';
      _location = 'All';
      _bedrooms = 0;
      _bathrooms = 0;
      _filteredProperties = _properties;
    });
  }

  String? _pickPrimaryImage(Map<String, dynamic> property) {
    final dynamic images = property['images'] ?? property['photos'] ?? property['gallery'];
    String? url;
    
    if (property['coverImage'] is String && (property['coverImage'] as String).isNotEmpty) {
      url = property['coverImage'] as String;
    } else if (images is List && images.isNotEmpty) {
      final first = images.first;
      if (first is String) url = first;
      if (first is Map && first['url'] is String) url = first['url'] as String;
    } else if (property['image'] is String) {
      url = property['image'] as String;
    }
    
    if (url == null || url.isEmpty) return null;
    if (url.startsWith('http')) return url;
    
    final base = ApiConfig.baseUrl.replaceFirst(RegExp(r"/api/.*$"), '');
    if (!url.startsWith('/')) url = '/$url';
    return '$base$url';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Search Properties'),
        actions: [
          IconButton(
            icon: Icon(_showFilters ? Icons.filter_alt : Icons.filter_alt_outlined),
            onPressed: () => setState(() => _showFilters = !_showFilters),
          ),
        ],
      ),
      body: Column(
        children: [
          // Enhanced Search Bar
          Container(
            margin: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: 'Search properties, locations, or keywords...',
                    prefixIcon: Icon(Icons.search, color: theme.colorScheme.primary),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear),
                            onPressed: () {
                              _searchController.clear();
                              _applyFilters();
                              setState(() {
                                _showSuggestions = false;
                              });
                            },
                          )
                        : null,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                      borderSide: BorderSide(color: theme.colorScheme.primary, width: 2),
                    ),
                  ),
                  onChanged: (value) {
                    _applyFilters();
                    _fetchSearchSuggestions(value);
                  },
                  onTap: () {
                    if (_searchController.text.isNotEmpty) {
                      setState(() {
                        _showSuggestions = _searchSuggestions.isNotEmpty;
                      });
                    }
                  },
                ),
                
                // Search Suggestions
                if (_showSuggestions && _searchSuggestions.isNotEmpty)
                  Container(
                    margin: const EdgeInsets.only(top: 8),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.surface,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: theme.colorScheme.shadow.withOpacity(0.1),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: _loadingSuggestions
                        ? const Padding(
                            padding: EdgeInsets.all(16),
                            child: Center(child: CircularProgressIndicator()),
                          )
                        : ListView.builder(
                            shrinkWrap: true,
                            itemCount: _searchSuggestions.length,
                            itemBuilder: (context, index) {
                              final suggestion = _searchSuggestions[index];
                              return ListTile(
                                leading: Icon(
                                  Icons.search,
                                  color: theme.colorScheme.primary,
                                  size: 20,
                                ),
                                title: Text(
                                  suggestion['title']?.toString() ?? suggestion['text']?.toString() ?? '',
                                  style: theme.textTheme.bodyMedium,
                                ),
                                subtitle: suggestion['subtitle'] != null
                                    ? Text(
                                        suggestion['subtitle'].toString(),
                                        style: theme.textTheme.bodySmall?.copyWith(
                                          color: theme.colorScheme.onSurfaceVariant,
                                        ),
                                      )
                                    : null,
                                onTap: () {
                                  _searchController.text = suggestion['title']?.toString() ?? suggestion['text']?.toString() ?? '';
                                  setState(() {
                                    _showSuggestions = false;
                                  });
                                  _applyFilters();
                                },
                              );
                            },
                          ),
                  ),
              ],
            ),
          ),
          
          // Filters Section
          if (_showFilters) ...[
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: theme.colorScheme.surfaceVariant,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Filters', style: theme.textTheme.titleLarge),
                      TextButton(
                        onPressed: _clearFilters,
                        child: const Text('Clear All'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  
                  // Property Type
                  Text('Property Type', style: theme.textTheme.titleMedium),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    children: _propertyTypes.map((type) => FilterChip(
                      label: Text(type),
                      selected: _propertyType == type,
                      onSelected: (selected) {
                        setState(() {
                          _propertyType = selected ? type : 'All';
                        });
                        _applyFilters();
                      },
                    )).toList(),
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Location
                  Text('Location', style: theme.textTheme.titleMedium),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    children: _locations.map((loc) => FilterChip(
                      label: Text(loc),
                      selected: _location == loc,
                      onSelected: (selected) {
                        setState(() {
                          _location = selected ? loc : 'All';
                        });
                        _applyFilters();
                      },
                    )).toList(),
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Price Range
                  Text('Price Range', style: theme.textTheme.titleMedium),
                  const SizedBox(height: 8),
                  RangeSlider(
                    values: _priceRange,
                    min: 0,
                    max: 10000000,
                    divisions: 100,
                    labels: RangeLabels(
                      '₹${_priceRange.start.round()}',
                      '₹${_priceRange.end.round()}',
                    ),
                    onChanged: (values) {
                      setState(() {
                        _priceRange = values;
                      });
                      _applyFilters();
                    },
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Bedrooms & Bathrooms
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Bedrooms', style: theme.textTheme.titleMedium),
                            const SizedBox(height: 8),
                            DropdownButtonFormField<int>(
                              value: _bedrooms,
                              decoration: const InputDecoration(
                                border: OutlineInputBorder(),
                                contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                              ),
                              items: [
                                const DropdownMenuItem(value: 0, child: Text('Any')),
                                ...List.generate(5, (i) => DropdownMenuItem(
                                  value: i + 1,
                                  child: Text('${i + 1}+'),
                                )),
                              ],
                              onChanged: (value) {
                                setState(() {
                                  _bedrooms = value ?? 0;
                                });
                                _applyFilters();
                              },
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Bathrooms', style: theme.textTheme.titleMedium),
                            const SizedBox(height: 8),
                            DropdownButtonFormField<int>(
                              value: _bathrooms,
                              decoration: const InputDecoration(
                                border: OutlineInputBorder(),
                                contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                              ),
                              items: [
                                const DropdownMenuItem(value: 0, child: Text('Any')),
                                ...List.generate(5, (i) => DropdownMenuItem(
                                  value: i + 1,
                                  child: Text('${i + 1}+'),
                                )),
                              ],
                              onChanged: (value) {
                                setState(() {
                                  _bathrooms = value ?? 0;
                                });
                                _applyFilters();
                              },
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
          ],
          
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
                    onPressed: _applyFilters,
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
                              _error!,
                              style: TextStyle(color: theme.colorScheme.error),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 16),
                            ElevatedButton(
                              onPressed: _fetchProperties,
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
                            onRefresh: _fetchProperties,
                            child: ListView.builder(
                              controller: _scrollController,
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              itemCount: _filteredProperties.length,
                              itemBuilder: (context, index) {
                                final property = _filteredProperties[index] as Map<String, dynamic>;
                                final title = property['title']?.toString() ?? 'Untitled';
                                final address = property['address']?.toString() ?? '';
                                final price = (property['price']?.toString() ?? '').isEmpty 
                                    ? '' 
                                    : '₹${property['price']}';
                                final imageUrl = _pickPrimaryImage(property);
                                
                                return Card(
                                  margin: const EdgeInsets.only(bottom: 12),
                                  child: ListTile(
                                    contentPadding: const EdgeInsets.all(16),
                                    leading: ClipRRect(
                                      borderRadius: BorderRadius.circular(12),
                                      child: SizedBox(
                                        width: 80,
                                        height: 80,
                                        child: imageUrl == null
                                            ? Container(
                                                color: theme.colorScheme.surfaceVariant,
                                                child: Icon(
                                                  Icons.home_outlined,
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
                                                    color: theme.colorScheme.onSurfaceVariant,
                                                  ),
                                                ),
                                              ),
                                      ),
                                    ),
                                    title: Text(
                                      title,
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                      style: theme.textTheme.titleMedium,
                                    ),
                                    subtitle: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        const SizedBox(height: 4),
                                        Text(
                                          address,
                                          maxLines: 2,
                                          overflow: TextOverflow.ellipsis,
                                          style: theme.textTheme.bodyMedium?.copyWith(
                                            color: theme.colorScheme.onSurfaceVariant,
                                          ),
                                        ),
                                        if (price.isNotEmpty) ...[
                                          const SizedBox(height: 8),
                                          Text(
                                            price,
                                            style: theme.textTheme.titleMedium?.copyWith(
                                              color: theme.colorScheme.primary,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ],
                                      ],
                                    ),
                                    onTap: () {
                                      Navigator.of(context).pushNamed(
                                        '/property-detail',
                                        arguments: property['_id']?.toString() ?? '',
                                      );
                                    },
                                  ),
                                );
                              },
                            ),
                          ),
          ),
        ],
      ),
    );
  }
}