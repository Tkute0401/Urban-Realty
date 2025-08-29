import 'package:flutter/material.dart';

class PropertyDetailScreen extends StatelessWidget {
  final String id;
  const PropertyDetailScreen({super.key, required this.id});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Property Details'),
      ),
      body: Center(
        child: Text('Property ID: $id'),
      ),
    );
  }
}

