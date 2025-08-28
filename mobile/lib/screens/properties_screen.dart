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
    return Scaffold(
      appBar: AppBar(title: const Text('Properties')),
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
                    itemCount: _properties.length,
                    separatorBuilder: (_, __) => const Divider(height: 1),
                    itemBuilder: (context, index) {
                      final p = _properties[index] as Map<String, dynamic>;
                      final String title = p['title']?.toString() ?? 'Untitled';
                      final String address = p['address']?.toString() ?? '';
                      final String price = (p['price']?.toString() ?? '').isEmpty ? '' : '₹${p['price']}';
                      final String? imageUrl = _pickPrimaryImage(p);
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
                        onTap: () {
                          Navigator.of(context).push(MaterialPageRoute(
                            builder: (_) => PropertyDetailScreen(id: p['_id']?.toString() ?? ''),
                          ));
                        },
                      );
                    },
                  ),
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

