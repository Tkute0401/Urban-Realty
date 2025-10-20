import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/property.dart';
import '../providers/property_provider.dart';
import '../config/design_tokens.dart';
import '../widgets/property_card.dart';
import 'enhanced_property_detail_screen.dart';

class PropertySearchScreen extends ConsumerStatefulWidget {
  const PropertySearchScreen({super.key});

  @override
  ConsumerState<PropertySearchScreen> createState() => _PropertySearchScreenState();
}

class _PropertySearchScreenState extends ConsumerState<PropertySearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  PropertyFilters _filters = const PropertyFilters();
  bool _showFilters = false;

  @override
  void initState() {
    super.initState();
    // Apply initial filters
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(propertiesProvider.notifier).updateFilters(_filters);
    });
  }

  @override
  Widget build(BuildContext context) {
    final propertiesAsync = ref.watch(propertiesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Search Properties'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        actions: [
          IconButton(
            icon: Icon(
              _showFilters ? Icons.filter_list : Icons.filter_list_outlined,
              color: _showFilters ? DesignTokens.primary : null,
            ),
            onPressed: () {
              setState(() {
                _showFilters = !_showFilters;
              });
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Search Bar
          _buildSearchBar(),
          
          // Filters
          if (_showFilters) _buildFilters(),
          
          // Properties List
          Expanded(
            child: propertiesAsync.when(
              data: (properties) {
                if (properties.isEmpty) {
                  return _buildEmptyState();
                }
                return _buildPropertiesList(properties);
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (error, stack) => _buildErrorState(error),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Container(
      padding: const EdgeInsets.all(DesignTokens.spacingM),
      child: TextField(
        controller: _searchController,
        decoration: InputDecoration(
          hintText: 'Search by location, type, or features...',
          prefixIcon: const Icon(Icons.search),
          suffixIcon: _searchController.text.isNotEmpty
              ? IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: () {
                    _searchController.clear();
                    _performSearch('');
                  },
                )
              : null,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(DesignTokens.radiusM),
          ),
          filled: true,
          fillColor: Colors.grey[100],
        ),
        onChanged: _performSearch,
        onSubmitted: _performSearch,
      ),
    );
  }

  Widget _buildFilters() {
    return Container(
      padding: const EdgeInsets.all(DesignTokens.spacingM),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        border: Border(
          bottom: BorderSide(color: Colors.grey[300]!),
        ),
      ),
      child: Column(
        children: [
          // Price Range
          _buildPriceRangeFilter(),
          
          const SizedBox(height: DesignTokens.spacingM),
          
          // Property Type
          _buildPropertyTypeFilter(),
          
          const SizedBox(height: DesignTokens.spacingM),
          
          // Bedrooms & Bathrooms
          Row(
            children: [
              Expanded(child: _buildBedroomsFilter()),
              const SizedBox(width: DesignTokens.spacingM),
              Expanded(child: _buildBathroomsFilter()),
            ],
          ),
          
          const SizedBox(height: DesignTokens.spacingM),
          
          // Location
          _buildLocationFilter(),
          
          const SizedBox(height: DesignTokens.spacingM),
          
          // Action Buttons
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: _clearFilters,
                  child: const Text('Clear All'),
                ),
              ),
              const SizedBox(width: DesignTokens.spacingM),
              Expanded(
                child: ElevatedButton(
                  onPressed: _applyFilters,
                  child: const Text('Apply Filters'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPriceRangeFilter() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Price Range',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: DesignTokens.fontWeightSemiBold,
          ),
        ),
        const SizedBox(height: DesignTokens.spacingS),
        Row(
          children: [
            Expanded(
              child: TextField(
                decoration: InputDecoration(
                  labelText: 'Min Price',
                  prefixText: '\$',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(DesignTokens.radiusS),
                  ),
                ),
                keyboardType: TextInputType.number,
                onChanged: (value) {
                  _filters = _filters.copyWith(
                    minPrice: double.tryParse(value),
                  );
                },
              ),
            ),
            const SizedBox(width: DesignTokens.spacingM),
            Expanded(
              child: TextField(
                decoration: InputDecoration(
                  labelText: 'Max Price',
                  prefixText: '\$',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(DesignTokens.radiusS),
                  ),
                ),
                keyboardType: TextInputType.number,
                onChanged: (value) {
                  _filters = _filters.copyWith(
                    maxPrice: double.tryParse(value),
                  );
                },
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildPropertyTypeFilter() {
    final types = ['apartment', 'house', 'villa', 'commercial', 'land'];
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Property Type',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: DesignTokens.fontWeightSemiBold,
          ),
        ),
        const SizedBox(height: DesignTokens.spacingS),
        Wrap(
          spacing: DesignTokens.spacingS,
          children: types.map((type) {
            final isSelected = _filters.type == type;
            return FilterChip(
              label: Text(type.toUpperCase()),
              selected: isSelected,
              onSelected: (selected) {
                setState(() {
                  _filters = _filters.copyWith(
                    type: selected ? type : null,
                  );
                });
              },
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildBedroomsFilter() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Bedrooms',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: DesignTokens.fontWeightSemiBold,
          ),
        ),
        const SizedBox(height: DesignTokens.spacingS),
        DropdownButtonFormField<int>(
          value: _filters.minBedrooms,
          decoration: InputDecoration(
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(DesignTokens.radiusS),
            ),
          ),
          items: List.generate(6, (index) {
            return DropdownMenuItem(
              value: index == 0 ? null : index,
              child: Text(index == 0 ? 'Any' : '$index+'),
            );
          }),
          onChanged: (value) {
            setState(() {
              _filters = _filters.copyWith(minBedrooms: value);
            });
          },
        ),
      ],
    );
  }

  Widget _buildBathroomsFilter() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Bathrooms',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: DesignTokens.fontWeightSemiBold,
          ),
        ),
        const SizedBox(height: DesignTokens.spacingS),
        DropdownButtonFormField<int>(
          value: _filters.minBathrooms,
          decoration: InputDecoration(
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(DesignTokens.radiusS),
            ),
          ),
          items: List.generate(5, (index) {
            return DropdownMenuItem(
              value: index == 0 ? null : index,
              child: Text(index == 0 ? 'Any' : '$index+'),
            );
          }),
          onChanged: (value) {
            setState(() {
              _filters = _filters.copyWith(minBathrooms: value);
            });
          },
        ),
      ],
    );
  }

  Widget _buildLocationFilter() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Location',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: DesignTokens.fontWeightSemiBold,
          ),
        ),
        const SizedBox(height: DesignTokens.spacingS),
        TextField(
          decoration: InputDecoration(
            hintText: 'Enter city or neighborhood',
            prefixIcon: const Icon(Icons.location_on),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(DesignTokens.radiusS),
            ),
          ),
          onChanged: (value) {
            _filters = _filters.copyWith(city: value.isEmpty ? null : value);
          },
        ),
      ],
    );
  }

  Widget _buildPropertiesList(List<Property> properties) {
    return RefreshIndicator(
      onRefresh: () async {
        ref.read(propertiesProvider.notifier).refresh();
      },
      child: ListView.builder(
        padding: const EdgeInsets.all(DesignTokens.spacingM),
        itemCount: properties.length,
        itemBuilder: (context, index) {
          final property = properties[index];
          return PropertyCard(
            property: property,
            onTap: () => _navigateToPropertyDetail(property),
            onFavorite: () => _toggleFavorite(property),
            isFavorite: false, // TODO: Implement favorite state
          );
        },
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.search_off,
            size: 80,
            color: Colors.grey[400],
          ),
          const SizedBox(height: DesignTokens.spacingM),
          Text(
            'No properties found',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: DesignTokens.spacingS),
          Text(
            'Try adjusting your search criteria',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: Colors.grey[500],
            ),
          ),
          const SizedBox(height: DesignTokens.spacingL),
          ElevatedButton(
            onPressed: _clearFilters,
            child: const Text('Clear Filters'),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(Object error) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.error_outline,
            size: 80,
            color: Colors.red[400],
          ),
          const SizedBox(height: DesignTokens.spacingM),
          Text(
            'Something went wrong',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              color: Colors.red[600],
            ),
          ),
          const SizedBox(height: DesignTokens.spacingS),
          Text(
            error.toString(),
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: Colors.grey[500],
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: DesignTokens.spacingL),
          ElevatedButton(
            onPressed: () {
              ref.read(propertiesProvider.notifier).refresh();
            },
            child: const Text('Retry'),
          ),
        ],
      ),
    );
  }

  void _performSearch(String query) {
    if (query.isNotEmpty) {
      // TODO: Implement search functionality
      // For now, just update the filters
      _filters = _filters.copyWith(city: query);
      ref.read(propertiesProvider.notifier).updateFilters(_filters);
    } else {
      _clearFilters();
    }
  }

  void _applyFilters() {
    ref.read(propertiesProvider.notifier).updateFilters(_filters);
    setState(() {
      _showFilters = false;
    });
  }

  void _clearFilters() {
    setState(() {
      _filters = const PropertyFilters();
      _searchController.clear();
    });
    ref.read(propertiesProvider.notifier).clearFilters();
  }

  void _navigateToPropertyDetail(Property property) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => EnhancedPropertyDetailScreen(property: property),
      ),
    );
  }

  void _toggleFavorite(Property property) {
    // TODO: Implement favorite functionality
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('${property.title} added to favorites')),
    );
  }
}
