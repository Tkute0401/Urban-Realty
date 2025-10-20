import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/property_provider.dart';
import '../models/property.dart';
import '../widgets/property_card.dart';
import 'enhanced_property_detail_screen.dart';

class PropertyListScreen extends ConsumerStatefulWidget {
  final String title;
  final PropertyFilters? initialFilters;

  const PropertyListScreen({
    super.key,
    required this.title,
    this.initialFilters,
  });

  @override
  ConsumerState<PropertyListScreen> createState() => _PropertyListScreenState();
}

class _PropertyListScreenState extends ConsumerState<PropertyListScreen> {
  final TextEditingController _searchController = TextEditingController();
  PropertyFilters _currentFilters = const PropertyFilters();

  @override
  void initState() {
    super.initState();
    if (widget.initialFilters != null) {
      _currentFilters = widget.initialFilters!;
    }
  }

  @override
  Widget build(BuildContext context) {
    final propertiesAsync = ref.watch(propertiesProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search properties...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: () {
                    _searchController.clear();
                    _performSearch('');
                  },
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              onSubmitted: _performSearch,
            ),
          ),

          // Properties List
          Expanded(
            child: propertiesAsync.when(
              data: (properties) {
                if (properties.isEmpty) {
                  return const Center(
                    child: Text('No properties found'),
                  );
                }

                return RefreshIndicator(
                  onRefresh: () async {
                    ref.read(propertiesProvider.notifier).refresh();
                  },
                  child: ListView.builder(
                    itemCount: properties.length,
                    itemBuilder: (context, index) {
                      final property = properties[index];
                      return PropertyCard(
                        property: property,
                        onTap: () => _navigateToPropertyDetail(property),
                      );
                    },
                  ),
                );
              },
              loading: () => const Center(
                child: CircularProgressIndicator(),
              ),
              error: (error, stack) => Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('Error: $error'),
                    ElevatedButton(
                      onPressed: () {
                        ref.read(propertiesProvider.notifier).refresh();
                      },
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _performSearch(String query) {
    if (query.isNotEmpty) {
      // Update filters with search query
      final newFilters = _currentFilters.copyWith(
        // Add search query to filters if needed
      );
      ref.read(propertiesProvider.notifier).updateFilters(newFilters);
    } else {
      // Clear search
      ref.read(propertiesProvider.notifier).clearFilters();
    }
  }

  void _navigateToPropertyDetail(Property property) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => EnhancedPropertyDetailScreen(property: property),
      ),
    );
  }
}
