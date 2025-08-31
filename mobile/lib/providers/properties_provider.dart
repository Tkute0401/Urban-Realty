import "package:flutter/material.dart";
import "../models/property.dart";
import "../services/property_service.dart";

class PropertiesProvider extends ChangeNotifier {
  final List<Property> _properties = [];
  final List<Property> _favorites = [];
  final List<Property> _recentlyViewed = [];
  bool _isLoading = false;
  String? _error;

  List<Property> get properties => _properties;
  List<Property> get favorites => _favorites;
  List<Property> get recentlyViewed => _recentlyViewed;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadProperties({Map<String, dynamic>? filters}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      _properties.clear();
      if (filters != null) {
        // Apply filters to the service call
        final search = filters['search'] as String?;
        final location = filters['location'] as String?;
        final minPrice = filters['minPrice'] as double?;
        final maxPrice = filters['maxPrice'] as double?;
        final amenities = filters['amenities'] as List<String>?;
        
        _properties.addAll(await PropertyService.getProperties(
          search: search,
          location: location,
          minPrice: minPrice,
          maxPrice: maxPrice,
          amenities: amenities,
        ));
      } else {
        _properties.addAll(await PropertyService.getProperties());
      }
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadProperty(String id) async {
    try {
      final property = await PropertyService.getPropertyById(id);
      final index = _properties.indexWhere((p) => p.id == id);
      if (index != -1) {
        _properties[index] = property;
      } else {
        _properties.add(property);
      }
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  Future<void> loadFeaturedProperties() async {
    try {
      final featured = await PropertyService.getFeaturedProperties();
      _properties.clear();
      _properties.addAll(featured);
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  Future<void> loadRecentlyViewedProperties() async {
    try {
      final recent = await PropertyService.getRecentlyViewedProperties();
      _recentlyViewed.clear();
      _recentlyViewed.addAll(recent);
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  void addToFavorites(Property property) {
    if (!_favorites.any((p) => p.id == property.id)) {
      _favorites.add(property);
      notifyListeners();
    }
  }

  void removeFromFavorites(String propertyId) {
    _favorites.removeWhere((p) => p.id == propertyId);
    notifyListeners();
  }

  void addToRecentlyViewed(Property property) {
    _recentlyViewed.removeWhere((p) => p.id == property.id);
    _recentlyViewed.insert(0, property);
    if (_recentlyViewed.length > 10) {
      _recentlyViewed.removeLast();
    }
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  Future<bool> createProperty(Map<String, dynamic> propertyData, List<String> imagePaths) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      final success = await PropertyService.createProperty(propertyData, imagePaths);
      if (success) {
        // Reload properties to include the new one
        await loadProperties();
      }
      _isLoading = false;
      notifyListeners();
      return success;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
}