import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shared/providers/properties_provider.dart';
import '../widgets/property_card.dart';

class PropertiesScreen extends StatefulWidget {
  const PropertiesScreen({super.key});

  @override
  State<PropertiesScreen> createState() => _PropertiesScreenState();
}

class _PropertiesScreenState extends State<PropertiesScreen> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    // Fetch initial properties
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<PropertiesProvider>(context, listen: false).fetchProperties(refresh: true);
    });

    _scrollController.addListener(() {
      if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
        final provider = Provider.of<PropertiesProvider>(context, listen: false);
        if (provider.hasMore && !provider.isLoading) {
          provider.fetchProperties();
        }
      }
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _onRefresh() async {
    await Provider.of<PropertiesProvider>(context, listen: false).fetchProperties(refresh: true);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Properties'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {              
              // TODO: Implement search screen or search bar logic
            },
          ),
        ],
      ),
      body: Consumer<PropertiesProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading && provider.properties.isEmpty) {
            return const Center(child: CircularProgressIndicator());
          }

          if (provider.error != null && provider.properties.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('An error occurred', style: TextStyle(color: Colors.red)),
                  Text(provider.error!),
                  ElevatedButton(
                    onPressed: _onRefresh,
                    child: const Text('Retry'),
                  )
                ],
              ),
            );
          }

          if (provider.properties.isEmpty) {
            return const Center(child: Text('No properties found.'));
          }

          return RefreshIndicator(
            onRefresh: _onRefresh,
            child: ListView.builder(
              controller: _scrollController,
              itemCount: provider.properties.length + (provider.hasMore ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == provider.properties.length) {
                  return const Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Center(child: CircularProgressIndicator()),
                  );
                }
                final property = provider.properties[index];
                return PropertyCard(property: property);
              },
            ),
          );
        },
      ),
    );
  }
}