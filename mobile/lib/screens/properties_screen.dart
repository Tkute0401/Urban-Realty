import 'package:flutter/material.dart';
import '../services/property_service.dart';
import '../services/favorites_service.dart';

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
                      return ListTile(
                        title: Text(title),
                        subtitle: Text(address),
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

