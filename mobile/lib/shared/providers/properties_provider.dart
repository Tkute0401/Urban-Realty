import 'package:flutter/material.dart';
import '../../models/property.dart';
import '../../services/property_service.dart';
import '../../services/favorites_service.dart';

class PropertiesProvider extends ChangeNotifier {
  final PropertyService _propertyService = PropertyService();
  final FavoritesService _favoritesService = FavoritesService();

  List<Property> _properties = [];
  List<Property> _featuredProperties = [];
  Property? _selectedProperty;

  bool _isLoading = false;
  String? _error;
  int _currentPage = 1;
  bool _hasMore = true;

  List<Property> get properties => _properties;
  List<Property> get featuredProperties => _featuredProperties;
  Property? get selectedProperty => _selectedProperty;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get hasMore => _hasMore;

  Future<void> fetchProperties({
    Map<String, dynamic>? filters,
    bool refresh = false,
  }) async {
    if (isLoading) return;

    _isLoading = true;
    if (refresh) {
      _currentPage = 1;
      _properties = [];
      _hasMore = true;
    }
    _error = null;
    notifyListeners();

    try {
      final newProperties = await _propertyService.getProperties(
        page: _currentPage,
        limit: 10,
        search: filters?['search'],
        city: filters?['city'],
        propertyType: filters?['propertyType'],
        minPrice: filters?['minPrice'],
        maxPrice: filters?['maxPrice'],
        bedrooms: filters?['bedrooms'],
        bathrooms: filters?['bathrooms'],
      );

      if (newProperties.length < 10) {
        _hasMore = false;
      }

      _properties.addAll(newProperties);
      _currentPage++;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchPropertyById(String id) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      _selectedProperty = await _propertyService.getPropertyById(id);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchFeaturedProperties() async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      _featuredProperties = await _propertyService.getFeaturedProperties();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createProperty(Map<String, dynamic> propertyData, List<String> imagePaths) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _propertyService.createProperty(propertyData, imagePaths);
      await fetchProperties(refresh: true);
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> toggleFavorite(String propertyId, bool isCurrentlyFavorite) async {
    try {
      if (isCurrentlyFavorite) {
        await _favoritesService.removeFavorite(propertyId);
      } else {
        await _favoritesService.addFavorite(propertyId);
      }
      _updateLocalFavoriteStatus(propertyId, !isCurrentlyFavorite);
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  void _updateLocalFavoriteStatus(String propertyId, bool newStatus) {
    final propertyIndex = _properties.indexWhere((p) => p.id == propertyId);
    if (propertyIndex != -1) {
      _properties[propertyIndex] = _properties[propertyIndex].copyWith(isFavorite: newStatus);
    }

    final featuredIndex = _featuredProperties.indexWhere((p) => p.id == propertyId);
    if (featuredIndex != -1) {
      _featuredProperties[featuredIndex] = _featuredProperties[featuredIndex].copyWith(isFavorite: newStatus);
    }

    if (_selectedProperty?.id == propertyId) {
      _selectedProperty = _selectedProperty!.copyWith(isFavorite: newStatus);
    }
  }
}

