import 'package:flutter/material.dart';
import '../services/favorites_service.dart';
import '../config/api_config.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  final FavoritesService _service = FavoritesService();
  bool _loading = true;
  String? _error;
  List<dynamic> _favorites = const [];

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
      final data = await _service.list();
      setState(() {
        _favorites = data;
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
    return Scaffold(
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.of(context).pushNamed('/search'),
        icon: const Icon(Icons.search),
        label: const Text('Search'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Theme.of(context).colorScheme.onPrimary,
      ),
      appBar: AppBar(
        title: const Text('Favorites'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () => Navigator.of(context).pushNamed('/search'),
            tooltip: 'Search Properties',
          ),
          IconButton(
            icon: const Icon(Icons.home),
            onPressed: () => Navigator.of(context).pushNamed('/'),
            tooltip: 'Home',
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _fetch,
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : _error != null
                ? ListView(children: [
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(_error!, style: const TextStyle(color: Colors.red)),
                    )
                  ])
                : ListView.separated(
                    itemCount: _favorites.length,
                    separatorBuilder: (_, __) => const Divider(height: 1),
                    itemBuilder: (context, index) {
                      final p = _favorites[index] as Map<String, dynamic>;
                      final String title = p['title']?.toString() ?? 'Untitled';
                      final String address = p['address']?.toString() ?? '';
                      final String price = (p['price']?.toString() ?? '').isEmpty ? '' : '₹${p['price']}';
                      final imageUrl = _pickPrimaryImage(p);
                      return ListTile(
                        leading: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: SizedBox(
                            width: 64,
                            height: 64,
                            child: imageUrl == null
                                ? Container(color: Colors.grey.shade300, child: const Icon(Icons.home_outlined))
                                : Image.network(
                                    imageUrl,
                                    fit: BoxFit.cover,
                                    errorBuilder: (_, __, ___) => Container(color: Colors.grey.shade300, child: const Icon(Icons.broken_image)),
                                  ),
                          ),
                        ),
                        title: Text(title, maxLines: 1, overflow: TextOverflow.ellipsis),
                        subtitle: Text(address, maxLines: 1, overflow: TextOverflow.ellipsis),
                        trailing: Text(price),
                      );
                    },
                  ),
      ),
    );
  }
}

