import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';
import '../providers/property_provider.dart';
import '../models/property.dart';
import '../services/maps_service.dart';
import '../config/design_tokens.dart';
import 'property_detail_screen.dart';

class MapsScreen extends ConsumerStatefulWidget {
  const MapsScreen({super.key});

  @override
  ConsumerState<MapsScreen> createState() => _MapsScreenState();
}

class _MapsScreenState extends ConsumerState<MapsScreen> {
  GoogleMapController? _mapController;
  final MapsService _mapsService = MapsService();
  
  Set<Marker> _markers = {};
  Set<Circle> _circles = {};
  
  LatLng? _currentLocation;
  LatLng? _selectedLocation;
  double _searchRadius = 5.0; // in kilometers
  String _mapType = 'normal';
  bool _showTraffic = false;
  bool _isLoading = true;
  String _searchQuery = '';
  
  final TextEditingController _searchController = TextEditingController();
  final List<Property> _filteredProperties = [];
  final List<NearbyAmenity> _nearbyAmenities = [];

  @override
  void initState() {
    super.initState();
    _initializeLocation();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _mapsService.dispose();
    super.dispose();
  }

  Future<void> _initializeLocation() async {
    try {
      Position? position = await _mapsService.getCurrentLocation();
      if (position != null) {
        setState(() {
          _currentLocation = LatLng(position.latitude, position.longitude);
          _isLoading = false;
        });
        await _loadPropertiesAndAmenities();
      } else {
        setState(() {
          _isLoading = false;
        });
        _showLocationError();
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      _showLocationError();
    }
  }

  Future<void> _loadPropertiesAndAmenities() async {
    if (_currentLocation == null) return;

    final propertiesAsync = ref.read(propertiesProvider);
    propertiesAsync.whenData((properties) async {
      // Filter properties within search radius
      List<Property> nearbyProperties = await _mapsService.searchPropertiesNearLocation(
        latitude: _currentLocation!.latitude,
        longitude: _currentLocation!.longitude,
        radiusInKm: _searchRadius,
        allProperties: properties,
      );

      // Get nearby amenities
      List<NearbyAmenity> amenities = await _mapsService.getNearbyAmenities(
        latitude: _currentLocation!.latitude,
        longitude: _currentLocation!.longitude,
        radiusInKm: _searchRadius,
      );

      setState(() {
        _filteredProperties = nearbyProperties;
        _nearbyAmenities = amenities;
      });

      _updateMarkers();
    });
  }

  void _updateMarkers() {
    Set<Marker> markers = {};
    
    // Add property markers
    for (int i = 0; i < _filteredProperties.length; i++) {
      Property property = _filteredProperties[i];
      markers.add(
        Marker(
          markerId: MarkerId('property_$i'),
          position: LatLng(property.location.latitude, property.location.longitude),
          infoWindow: InfoWindow(
            title: property.title,
            snippet: '${property.currency}${property.price.toStringAsFixed(0)}',
          ),
          icon: BitmapDescriptor.defaultMarkerWithHue(
            property.featured ? BitmapDescriptor.hueRed : BitmapDescriptor.hueBlue,
          ),
          onTap: () => _showPropertyDetails(property),
        ),
      );
    }

    // Add amenity markers
    for (int i = 0; i < _nearbyAmenities.length; i++) {
      NearbyAmenity amenity = _nearbyAmenities[i];
      markers.add(
        Marker(
          markerId: MarkerId('amenity_$i'),
          position: LatLng(amenity.latitude, amenity.longitude),
          infoWindow: InfoWindow(
            title: amenity.name,
            snippet: '${amenity.distance.toStringAsFixed(1)} km away',
          ),
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
        ),
      );
    }

    // Add current location marker
    if (_currentLocation != null) {
      markers.add(
        Marker(
          markerId: const MarkerId('current_location'),
          position: _currentLocation!,
          infoWindow: const InfoWindow(title: 'Your Location'),
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueOrange),
        ),
      );
    }

    setState(() {
      _markers = markers;
    });
  }

  void _updateSearchRadius() {
    Set<Circle> circles = {};
    
    if (_currentLocation != null) {
      circles.add(
        Circle(
          circleId: const CircleId('search_radius'),
          center: _currentLocation!,
          radius: _searchRadius * 1000, // Convert km to meters
          fillColor: Colors.blue.withOpacity(0.1),
          strokeColor: Colors.blue.withOpacity(0.3),
          strokeWidth: 2,
        ),
      );
    }

    setState(() {
      _circles = circles;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Property Map'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: _showSearchDialog,
          ),
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilterDialog,
          ),
          PopupMenuButton<String>(
            onSelected: _onMapTypeSelected,
            itemBuilder: (context) => [
              const PopupMenuItem(value: 'normal', child: Text('Normal')),
              const PopupMenuItem(value: 'satellite', child: Text('Satellite')),
              const PopupMenuItem(value: 'hybrid', child: Text('Hybrid')),
              const PopupMenuItem(value: 'terrain', child: Text('Terrain')),
            ],
            child: const Icon(Icons.layers),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _currentLocation == null
              ? _buildLocationError()
              : Stack(
                  children: [
                    // Google Map
                    GoogleMap(
                      onMapCreated: (GoogleMapController controller) {
                        _mapController = controller;
                      },
                      initialCameraPosition: CameraPosition(
                        target: _currentLocation!,
                        zoom: 12.0,
                      ),
                      markers: _markers,
                      circles: _circles,
                      mapType: _getMapType(),
                      trafficEnabled: _showTraffic,
                      myLocationEnabled: true,
                      myLocationButtonEnabled: true,
                      onTap: (LatLng position) {
                        setState(() {
                          _selectedLocation = position;
                        });
                        _showLocationInfo(position);
                      },
                    ),
                    
                    // Search Radius Slider
                    Positioned(
                      top: 16,
                      right: 16,
                      child: Container(
                        width: 200,
                        padding: const EdgeInsets.all(DesignTokens.spaceMd),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.1),
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              'Search Radius: ${_searchRadius.toStringAsFixed(1)} km',
                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Slider(
                              value: _searchRadius,
                              min: 1.0,
                              max: 20.0,
                              divisions: 19,
                              onChanged: (value) {
                                setState(() {
                                  _searchRadius = value;
                                });
                                _updateSearchRadius();
                                _loadPropertiesAndAmenities();
                              },
                            ),
                          ],
                        ),
                      ),
                    ),
                    
                    // Properties List
                    Positioned(
                      bottom: 0,
                      left: 0,
                      right: 0,
                      child: _buildPropertiesList(),
                    ),
                  ],
                ),
      floatingActionButton: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          FloatingActionButton(
            onPressed: _centerOnCurrentLocation,
            child: const Icon(Icons.my_location),
          ),
          const SizedBox(height: DesignTokens.spaceSm),
          FloatingActionButton(
            onPressed: _toggleTraffic,
            child: Icon(_showTraffic ? Icons.traffic : Icons.traffic_outlined),
          ),
        ],
      ),
    );
  }

  Widget _buildLocationError() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.location_off,
            size: 64,
            color: Colors.grey[400],
          ),
          const SizedBox(height: DesignTokens.spaceLg),
          Text(
            'Location Access Required',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: DesignTokens.spaceMd),
          Text(
            'Please enable location services to view properties on the map.',
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: DesignTokens.spaceLg),
          ElevatedButton.icon(
            onPressed: _requestLocationPermission,
            icon: const Icon(Icons.location_on),
            label: const Text('Enable Location'),
          ),
        ],
      ),
    );
  }

  Widget _buildPropertiesList() {
    if (_filteredProperties.isEmpty) {
      return Container(
        height: 100,
        margin: const EdgeInsets.all(DesignTokens.spaceMd),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 8,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: const Center(
          child: Text('No properties found in this area'),
        ),
      );
    }

    return Container(
      height: 200,
      margin: const EdgeInsets.all(DesignTokens.spaceMd),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(DesignTokens.spaceMd),
            child: Text(
              'Properties (${_filteredProperties.length})',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Expanded(
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: DesignTokens.spaceMd),
              itemCount: _filteredProperties.length,
              itemBuilder: (context, index) {
                Property property = _filteredProperties[index];
                return Container(
                  width: 200,
                  margin: const EdgeInsets.only(right: DesignTokens.spaceMd),
                  child: Card(
                    child: InkWell(
                      onTap: () => _showPropertyDetails(property),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Property Image
                          Expanded(
                            flex: 2,
                            child: Container(
                              width: double.infinity,
                              decoration: BoxDecoration(
                                borderRadius: const BorderRadius.vertical(
                                  top: Radius.circular(DesignTokens.radiusMd),
                                ),
                                color: Colors.grey[300],
                              ),
                              child: property.images.isNotEmpty
                                  ? ClipRRect(
                                      borderRadius: const BorderRadius.vertical(
                                        top: Radius.circular(DesignTokens.radiusMd),
                                      ),
                                      child: Image.network(
                                        property.images.first,
                                        fit: BoxFit.cover,
                                        errorBuilder: (context, error, stackTrace) => const Icon(Icons.home),
                                      ),
                                    )
                                  : const Icon(Icons.home),
                            ),
                          ),
                          
                          // Property Info
                          Expanded(
                            flex: 1,
                            child: Padding(
                              padding: const EdgeInsets.all(DesignTokens.spaceSm),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    property.title,
                                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                      fontWeight: FontWeight.bold,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  Text(
                                    '${property.currency}${property.price.toStringAsFixed(0)}',
                                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                      color: Theme.of(context).colorScheme.primary,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  Text(
                                    '${property.location.city}, ${property.location.state}',
                                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                      color: Colors.grey[600],
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  MapType _getMapType() {
    switch (_mapType) {
      case 'satellite':
        return MapType.satellite;
      case 'hybrid':
        return MapType.hybrid;
      case 'terrain':
        return MapType.terrain;
      default:
        return MapType.normal;
    }
  }

  void _onMapTypeSelected(String type) {
    setState(() {
      _mapType = type;
    });
  }

  void _centerOnCurrentLocation() async {
    if (_mapController != null && _currentLocation != null) {
      await _mapController!.animateCamera(
        CameraUpdate.newLatLng(_currentLocation!),
      );
    }
  }

  void _toggleTraffic() {
    setState(() {
      _showTraffic = !_showTraffic;
    });
  }

  void _showSearchDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Search Location'),
        content: TextField(
          controller: _searchController,
          decoration: const InputDecoration(
            hintText: 'Enter address or place name',
            prefixIcon: Icon(Icons.search),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: _searchLocation,
            child: const Text('Search'),
          ),
        ],
      ),
    );
  }

  void _showFilterDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Map Filters'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SwitchListTile(
              title: const Text('Show Traffic'),
              value: _showTraffic,
              onChanged: (value) {
                setState(() {
                  _showTraffic = value;
                });
              },
            ),
            SwitchListTile(
              title: const Text('Show Amenities'),
              value: true, // You can add this state variable
              onChanged: (value) {
                // Handle amenities toggle
              },
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  void _showLocationInfo(LatLng position) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Location Info'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Latitude: ${position.latitude.toStringAsFixed(6)}'),
            Text('Longitude: ${position.longitude.toStringAsFixed(6)}'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  void _showPropertyDetails(Property property) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => PropertyDetailScreen(property: property),
      ),
    );
  }

  void _searchLocation() async {
    if (_searchController.text.isNotEmpty) {
      Position? position = await _mapsService.getCoordinatesFromAddress(_searchController.text);
      if (position != null && _mapController != null) {
        LatLng newLocation = LatLng(position.latitude, position.longitude);
        await _mapController!.animateCamera(
          CameraUpdate.newLatLng(newLocation),
        );
        setState(() {
          _currentLocation = newLocation;
        });
        await _loadPropertiesAndAmenities();
      }
      Navigator.pop(context);
    }
  }

  void _requestLocationPermission() async {
    bool hasPermission = await _mapsService.requestLocationPermission();
    if (hasPermission) {
      await _initializeLocation();
    } else {
      _showLocationError();
    }
  }

  void _showLocationError() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Unable to get your location. Please check permissions.'),
        backgroundColor: Colors.red,
      ),
    );
  }
}
