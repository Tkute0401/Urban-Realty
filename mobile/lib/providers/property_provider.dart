import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/property.dart';
import '../services/property_service.dart';
import '../services/api_service.dart';

/// API Service Provider
final apiServiceProvider = Provider<ApiService>((ref) {
  return ApiService();
});

/// Property Service Provider
final propertyServiceProvider = Provider<PropertyService>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return PropertyService(apiService: apiService);
});

/// StateNotifier for managing a list of properties
class PropertiesNotifier extends StateNotifier<AsyncValue<List<Property>>> {
  final PropertyService _propertyService;
  PropertyFilters _currentFilters;
  int _currentPage = 1;
  bool _hasMore = true;
  bool _isFetchingMore = false;

  PropertiesNotifier(this._propertyService, [PropertyFilters? initialFilters])
      : _currentFilters = initialFilters ?? const PropertyFilters(),
        super(const AsyncValue.loading()) {
    _fetchProperties(isRefresh: true);
  }

  PropertyFilters get currentFilters => _currentFilters;
  bool get hasMore => _hasMore;

  Future<void> _fetchProperties({bool isRefresh = false}) async {
    if (isRefresh) {
      _currentPage = 1;
      _hasMore = true;
      state = const AsyncValue.loading();
    } else if (!_hasMore || _isFetchingMore) {
      return;
    }

    _isFetchingMore = true;
    try {
      final newProperties = await _propertyService.getProperties(
        page: _currentPage,
        limit: 10, // Fetch 10 properties at a time
        filters: _currentFilters,
      );

      if (newProperties.isEmpty) {
        _hasMore = false;
      } else {
        _currentPage++;
        state = state.whenData((existingProperties) => [
          ...existingProperties,
          ...newProperties,
        ]);
      }
    } catch (error, stackTrace) {
      state = AsyncValue.error(error, stackTrace);
    } finally {
      _isFetchingMore = false;
    }
  }

  Future<void> refresh() async {
    await _fetchProperties(isRefresh: true);
  }

  Future<void> loadMore() async {
    await _fetchProperties(isRefresh: false);
  }

  void updateFilters(PropertyFilters newFilters) {
    _currentFilters = newFilters;
    _fetchProperties(isRefresh: true);
  }

  void clearFilters() {
    _currentFilters = const PropertyFilters();
    _fetchProperties(isRefresh: true);
  }
}

/// Provider for the properties list
final propertiesProvider = StateNotifierProvider<PropertiesNotifier, AsyncValue<List<Property>>>((ref) {
  final propertyService = ref.watch(propertyServiceProvider);
  return PropertiesNotifier(propertyService);
});

/// Provider for featured properties
final featuredPropertiesProvider = FutureProvider<List<Property>>((ref) async {
  final propertyService = ref.watch(propertyServiceProvider);
  return await propertyService.getFeaturedProperties();
});

/// Provider for property search
final propertySearchProvider = FutureProvider.family<List<Property>, String>((ref, query) async {
  final propertyService = ref.watch(propertyServiceProvider);
  return await propertyService.searchProperties(query);
});