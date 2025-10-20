import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import '../services/maps_service.dart';
import '../config/design_tokens.dart';
import 'maps_screen.dart';

class LocationSearchScreen extends ConsumerStatefulWidget {
  const LocationSearchScreen({super.key});

  @override
  ConsumerState<LocationSearchScreen> createState() => _LocationSearchScreenState();
}

class _LocationSearchScreenState extends ConsumerState<LocationSearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  final MapsService _mapsService = MapsService();
  
  List<SearchResult> _searchResults = [];
  List<SearchResult> _recentSearches = [];
  List<SearchResult> _suggestedLocations = [];
  bool _isLoading = false;
  String _selectedCategory = 'all';

  final List<String> _categories = [
    'all',
    'residential',
    'commercial',
    'land',
    'luxury',
  ];

  @override
  void initState() {
    super.initState();
    _loadRecentSearches();
    _loadSuggestedLocations();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _loadRecentSearches() {
    // Mock recent searches
    _recentSearches = [
      SearchResult(
        name: 'Downtown Manhattan',
        address: 'New York, NY',
        latitude: 40.7589,
        longitude: -73.9851,
        type: 'area',
      ),
      SearchResult(
        name: 'Central Park',
        address: 'New York, NY',
        latitude: 40.7829,
        longitude: -73.9654,
        type: 'landmark',
      ),
      SearchResult(
        name: 'Brooklyn Heights',
        address: 'Brooklyn, NY',
        latitude: 40.6962,
        longitude: -73.9969,
        type: 'neighborhood',
      ),
    ];
  }

  void _loadSuggestedLocations() {
    // Mock suggested locations
    _suggestedLocations = [
      SearchResult(
        name: 'Times Square',
        address: 'New York, NY',
        latitude: 40.7580,
        longitude: -73.9855,
        type: 'landmark',
      ),
      SearchResult(
        name: 'SoHo',
        address: 'New York, NY',
        latitude: 40.7231,
        longitude: -74.0026,
        type: 'neighborhood',
      ),
      SearchResult(
        name: 'Williamsburg',
        address: 'Brooklyn, NY',
        latitude: 40.7081,
        longitude: -73.9571,
        type: 'neighborhood',
      ),
      SearchResult(
        name: 'Long Island City',
        address: 'Queens, NY',
        latitude: 40.7448,
        longitude: -73.9485,
        type: 'neighborhood',
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Search Location'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.my_location),
            onPressed: _useCurrentLocation,
          ),
        ],
      ),
      body: Column(
        children: [
          // Search Bar
          Container(
            padding: const EdgeInsets.all(DesignTokens.spaceMd),
            color: Theme.of(context).colorScheme.surface,
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search for places, addresses, or landmarks',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          setState(() {
                            _searchResults = [];
                          });
                        },
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
                ),
                filled: true,
                fillColor: Theme.of(context).colorScheme.surfaceVariant,
              ),
              onChanged: _onSearchChanged,
              onSubmitted: _performSearch,
            ),
          ),

          // Category Filter
          Container(
            height: 50,
            padding: const EdgeInsets.symmetric(horizontal: DesignTokens.spaceMd),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: _categories.length,
              itemBuilder: (context, index) {
                String category = _categories[index];
                bool isSelected = _selectedCategory == category;
                return Padding(
                  padding: const EdgeInsets.only(right: DesignTokens.spaceSm),
                  child: FilterChip(
                    label: Text(category.capitalize()),
                    selected: isSelected,
                    onSelected: (selected) {
                      setState(() {
                        _selectedCategory = category;
                      });
                      _filterResults();
                    },
                    selectedColor: Theme.of(context).colorScheme.primary.withOpacity(0.2),
                    checkmarkColor: Theme.of(context).colorScheme.primary,
                  ),
                );
              },
            ),
          ),

          // Search Results
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _searchResults.isNotEmpty
                    ? _buildSearchResults()
                    : _buildDefaultContent(),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchResults() {
    return ListView.builder(
      padding: const EdgeInsets.all(DesignTokens.spaceMd),
      itemCount: _searchResults.length,
      itemBuilder: (context, index) {
        SearchResult result = _searchResults[index];
        return _buildSearchResultItem(result);
      },
    );
  }

  Widget _buildDefaultContent() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(DesignTokens.spaceMd),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Recent Searches
          if (_recentSearches.isNotEmpty) ...[
            Text(
              'Recent Searches',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: DesignTokens.spaceMd),
            ..._recentSearches.map((search) => _buildSearchResultItem(search)),
            const SizedBox(height: DesignTokens.spaceLg),
          ],

          // Suggested Locations
          Text(
            'Suggested Locations',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: DesignTokens.spaceMd),
          ..._suggestedLocations.map((location) => _buildSearchResultItem(location)),

          const SizedBox(height: DesignTokens.spaceLg),

          // Quick Actions
          Text(
            'Quick Actions',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: DesignTokens.spaceMd),
          _buildQuickActions(),
        ],
      ),
    );
  }

  Widget _buildSearchResultItem(SearchResult result) {
    return Card(
      margin: const EdgeInsets.only(bottom: DesignTokens.spaceSm),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: _getTypeColor(result.type).withOpacity(0.1),
          child: Icon(
            _getTypeIcon(result.type),
            color: _getTypeColor(result.type),
          ),
        ),
        title: Text(
          result.name,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Text(result.address),
        trailing: Icon(
          Icons.arrow_forward_ios,
          size: DesignTokens.iconSizeSm,
          color: Colors.grey[400],
        ),
        onTap: () => _selectLocation(result),
      ),
    );
  }

  Widget _buildQuickActions() {
    return Column(
      children: [
        _buildQuickActionItem(
          context,
          Icons.my_location,
          'Use Current Location',
          'Find properties near you',
          _useCurrentLocation,
        ),
        _buildQuickActionItem(
          context,
          Icons.map,
          'Browse Map',
          'Explore properties on the map',
          _browseMap,
        ),
        _buildQuickActionItem(
          context,
          Icons.favorite,
          'Saved Locations',
          'View your saved locations',
          _viewSavedLocations,
        ),
      ],
    );
  }

  Widget _buildQuickActionItem(
    BuildContext context,
    IconData icon,
    String title,
    String subtitle,
    VoidCallback onTap,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: DesignTokens.spaceSm),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Theme.of(context).colorScheme.primary.withOpacity(0.1),
          child: Icon(
            icon,
            color: Theme.of(context).colorScheme.primary,
          ),
        ),
        title: Text(
          title,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: onTap,
      ),
    );
  }

  void _onSearchChanged(String query) {
    setState(() {
      // Trigger rebuild for suffixIcon visibility
    });
    
    if (query.length >= 3) {
      _performSearch(query);
    } else {
      setState(() {
        _searchResults = [];
      });
    }
  }

  void _performSearch(String query) async {
    if (query.isEmpty) return;

    setState(() {
      _isLoading = true;
    });

    try {
      // Search for coordinates from address
      Position? position = await _mapsService.getCoordinatesFromAddress(query);
      
      if (position != null) {
        // Get address from coordinates for better formatting
        String? address = await _mapsService.getAddressFromCoordinates(
          position.latitude,
          position.longitude,
        );

        SearchResult result = SearchResult(
          name: query,
          address: address ?? '${position.latitude.toStringAsFixed(4)}, ${position.longitude.toStringAsFixed(4)}',
          latitude: position.latitude,
          longitude: position.longitude,
          type: 'search',
        );

        setState(() {
          _searchResults = [result];
        });
      } else {
        // Mock search results for demo
        setState(() {
          _searchResults = [
            SearchResult(
              name: query,
              address: 'Search result for "$query"',
              latitude: 40.7589,
              longitude: -73.9851,
              type: 'search',
            ),
          ];
        });
      }
    } catch (e) {
      setState(() {
        _searchResults = [];
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Search failed: $e')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _filterResults() {
    // TODO: Implement category filtering
    // This would filter the search results based on the selected category
  }

  void _selectLocation(SearchResult result) {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => MapsScreen(),
      ),
    );
  }

  void _useCurrentLocation() async {
    setState(() {
      _isLoading = true;
    });

    try {
      Position? position = await _mapsService.getCurrentLocation();
      if (position != null) {
        String? address = await _mapsService.getAddressFromCoordinates(
          position.latitude,
          position.longitude,
        );

        SearchResult result = SearchResult(
          name: 'Current Location',
          address: address ?? 'Your current location',
          latitude: position.latitude,
          longitude: position.longitude,
          type: 'current',
        );

        _selectLocation(result);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Unable to get your current location'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Location error: $e'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _browseMap() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => MapsScreen(),
      ),
    );
  }

  void _viewSavedLocations() {
    // TODO: Implement saved locations
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Saved locations feature not implemented yet')),
    );
  }

  Color _getTypeColor(String type) {
    switch (type) {
      case 'area':
        return Colors.blue;
      case 'landmark':
        return Colors.green;
      case 'neighborhood':
        return Colors.orange;
      case 'search':
        return Colors.purple;
      case 'current':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  IconData _getTypeIcon(String type) {
    switch (type) {
      case 'area':
        return Icons.location_city;
      case 'landmark':
        return Icons.place;
      case 'neighborhood':
        return Icons.home;
      case 'search':
        return Icons.search;
      case 'current':
        return Icons.my_location;
      default:
        return Icons.location_on;
    }
  }
}

class SearchResult {
  final String name;
  final String address;
  final double latitude;
  final double longitude;
  final String type;

  SearchResult({
    required this.name,
    required this.address,
    required this.latitude,
    required this.longitude,
    required this.type,
  });
}

extension StringExtension on String {
  String capitalize() {
    if (isEmpty) return this;
    return this[0].toUpperCase() + substring(1);
  }
}
