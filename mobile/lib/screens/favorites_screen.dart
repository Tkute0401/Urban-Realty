import 'package:flutter/material.dart';
import '../services/favorites_service.dart';

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
      appBar: AppBar(title: const Text('Favorites')),
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
                      return ListTile(
                        title: Text(title),
                        subtitle: Text(address),
                        trailing: Text(price),
                      );
                    },
                  ),
      ),
    );
  }
}

