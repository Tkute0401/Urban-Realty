import 'package:flutter/material.dart';
import '../../services/recently_viewed_service.dart';
import '../../models/property.dart';

class RecentlyViewedScreen extends StatefulWidget {
  const RecentlyViewedScreen({super.key});

  @override
  State<RecentlyViewedScreen> createState() => _RecentlyViewedScreenState();
}

class _RecentlyViewedScreenState extends State<RecentlyViewedScreen> {
  final RecentlyViewedService _service = RecentlyViewedService();
  bool _loading = true;
  String? _error;
  List<Property> _items = const [];

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
      final data = await _service.getRecentlyViewed();
      if (mounted) setState(() => _items = data);
    } catch (e) {
      if (mounted) setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Recently Viewed')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_error!, style: const TextStyle(color: Colors.red)),
                        const SizedBox(height: 12),
                        ElevatedButton(onPressed: _fetch, child: const Text('Retry')),
                      ],
                    ),
                  ),
                )
              : _items.isEmpty
                  ? const Center(child: Text('No recently viewed properties'))
                  : RefreshIndicator(
                      onRefresh: _fetch,
                      child: ListView.separated(
                        padding: const EdgeInsets.all(12),
                        itemCount: _items.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 8),
                        itemBuilder: (context, index) {
                          final p = _items[index];
                          return Card(
                            child: ListTile(
                              leading: p.images.isNotEmpty
                                  ? ClipRRect(
                                      borderRadius: BorderRadius.circular(6),
                                      child: Image.network(
                                        p.images.first.url,
                                        width: 56,
                                        height: 56,
                                        fit: BoxFit.cover,
                                      ),
                                    )
                                  : const Icon(Icons.home, size: 32),
                              title: Text(p.title),
                              subtitle: Text(p.address.formattedAddress),
                              trailing: Text(p.price.toString()),
                              onTap: () {
                                Navigator.pushNamed(context, '/property', arguments: p.id);
                              },
                            ),
                          );
                        },
                      ),
                    ),
    );
  }
}

