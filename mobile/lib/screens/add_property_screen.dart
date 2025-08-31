import "package:flutter/material.dart";
import "package:provider/provider.dart";
import "package:image_picker/image_picker.dart";
import "dart:io";
import "../providers/properties_provider.dart";

class AddPropertyScreen extends StatefulWidget {
  const AddPropertyScreen({super.key});

  @override
  State<AddPropertyScreen> createState() => _AddPropertyScreenState();
}

class _AddPropertyScreenState extends State<AddPropertyScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _priceController = TextEditingController();
  final _bedroomsController = TextEditingController();
  final _bathroomsController = TextEditingController();
  final _areaController = TextEditingController();
  final _addressController = TextEditingController();
  final _cityController = TextEditingController();
  final _stateController = TextEditingController();
  final _zipcodeController = TextEditingController();
  String _selectedType = "House";
  String _selectedStatus = "For Sale";
  final List<String> _selectedAmenities = [];
  final List<File> _selectedImages = [];
  final ImagePicker _picker = ImagePicker();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Add Property"),
        backgroundColor: Colors.blue,
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(
                  labelText: "Property Title",
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Please enter property title";
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _descriptionController,
                decoration: const InputDecoration(
                  labelText: "Description",
                  border: OutlineInputBorder(),
                ),
                maxLines: 3,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Please enter description";
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      initialValue: _selectedType,
                      decoration: const InputDecoration(
                        labelText: "Type",
                        border: OutlineInputBorder(),
                      ),
                      items: const [
                        DropdownMenuItem(value: "House", child: Text("House")),
                        DropdownMenuItem(value: "Apartment", child: Text("Apartment")),
                        DropdownMenuItem(value: "Villa", child: Text("Villa")),
                        DropdownMenuItem(value: "Condo", child: Text("Condo")),
                        DropdownMenuItem(value: "Land", child: Text("Land")),
                        DropdownMenuItem(value: "Commercial", child: Text("Commercial")),
                        DropdownMenuItem(value: "PG", child: Text("PG")),
                      ],
                      onChanged: (value) {
                        setState(() {
                          _selectedType = value!;
                        });
                      },
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      initialValue: _selectedStatus,
                      decoration: const InputDecoration(
                        labelText: "Status",
                        border: OutlineInputBorder(),
                      ),
                      items: const [
                        DropdownMenuItem(value: "For Sale", child: Text("For Sale")),
                        DropdownMenuItem(value: "For Rent", child: Text("For Rent")),
                        DropdownMenuItem(value: "Sold", child: Text("Sold")),
                      ],
                      onChanged: (value) {
                        setState(() {
                          _selectedStatus = value!;
                        });
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _priceController,
                      decoration: const InputDecoration(
                        labelText: "Price",
                        border: OutlineInputBorder(),
                      ),
                      keyboardType: TextInputType.number,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return "Please enter price";
                        }
                        if (double.tryParse(value) == null) {
                          return "Please enter a valid price";
                        }
                        return null;
                      },
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: _areaController,
                      decoration: const InputDecoration(
                        labelText: "Area (sq ft)",
                        border: OutlineInputBorder(),
                      ),
                      keyboardType: TextInputType.number,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return "Please enter area";
                        }
                        if (double.tryParse(value) == null) {
                          return "Please enter a valid area";
                        }
                        return null;
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _bedroomsController,
                      decoration: const InputDecoration(
                        labelText: "Bedrooms",
                        border: OutlineInputBorder(),
                      ),
                      keyboardType: TextInputType.number,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return "Please enter number of bedrooms";
                        }
                        if (int.tryParse(value) == null) {
                          return "Please enter a valid number";
                        }
                        return null;
                      },
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: _bathroomsController,
                      decoration: const InputDecoration(
                        labelText: "Bathrooms",
                        border: OutlineInputBorder(),
                      ),
                      keyboardType: TextInputType.number,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return "Please enter number of bathrooms";
                        }
                        if (int.tryParse(value) == null) {
                          return "Please enter a valid number";
                        }
                        return null;
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _addressController,
                decoration: const InputDecoration(
                  labelText: "Address",
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Please enter address";
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _cityController,
                      decoration: const InputDecoration(
                        labelText: "City",
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return "Please enter city";
                        }
                        return null;
                      },
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: _stateController,
                      decoration: const InputDecoration(
                        labelText: "State",
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return "Please enter state";
                        }
                        return null;
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _zipcodeController,
                decoration: const InputDecoration(
                  labelText: "Zipcode",
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Please enter zipcode";
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              const Text(
                "Amenities",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                children: [
                  "Parking",
                  "Garden",
                  "Balcony",
                  "Gym",
                  "Pool",
                  "Security",
                  "Lift",
                  "Power Backup"
                ].map((amenity) => FilterChip(
                  label: Text(amenity),
                  selected: _selectedAmenities.contains(amenity),
                  onSelected: (selected) {
                    setState(() {
                      if (selected) {
                        _selectedAmenities.add(amenity);
                      } else {
                        _selectedAmenities.remove(amenity);
                      }
                    });
                  },
                )).toList(),
              ),
              const SizedBox(height: 24),
              const Text(
                "Images",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              ElevatedButton.icon(
                onPressed: _pickImages,
                icon: const Icon(Icons.photo_library),
                label: const Text("Add Images"),
              ),
              const SizedBox(height: 8),
              if (_selectedImages.isNotEmpty)
                SizedBox(
                  height: 100,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: _selectedImages.length,
                    itemBuilder: (context, index) {
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: Stack(
                          children: [
                            Image.file(
                              _selectedImages[index],
                              width: 100,
                              height: 100,
                              fit: BoxFit.cover,
                            ),
                            Positioned(
                              top: 0,
                              right: 0,
                              child: IconButton(
                                icon: const Icon(Icons.close, color: Colors.red),
                                onPressed: () {
                                  setState(() {
                                    _selectedImages.removeAt(index);
                                  });
                                },
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
              const SizedBox(height: 24),
              Consumer<PropertiesProvider>(
                builder: (context, propertiesProvider, child) {
                  if (propertiesProvider.isLoading) {
                    return const Center(child: CircularProgressIndicator());
                  }
                  return ElevatedButton(
                    onPressed: _addProperty,
                    child: const Text(
                      "Add Property",
                      style: TextStyle(fontSize: 16),
                    ),
                  );
                },
              ),
              if (context.watch<PropertiesProvider>().error != null)
                Padding(
                  padding: const EdgeInsets.only(top: 16),
                  child: Text(
                    context.watch<PropertiesProvider>().error!,
                    style: const TextStyle(color: Colors.red),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _pickImages() async {
    final List<XFile> images = await _picker.pickMultiImage();
    if (images.isNotEmpty) {
      setState(() {
        _selectedImages.addAll(images.map((image) => File(image.path)));
      });
    }
  }

  void _addProperty() async {
    if (_formKey.currentState!.validate()) {
      final propertyData = {
        "title": _titleController.text,
        "description": _descriptionController.text,
        "type": _selectedType,
        "status": _selectedStatus,
        "price": double.parse(_priceController.text),
        "bedrooms": int.parse(_bedroomsController.text),
        "bathrooms": int.parse(_bathroomsController.text),
        "area": double.parse(_areaController.text),
        "address": _addressController.text,
        "city": _cityController.text,
        "state": _stateController.text,
        "zipcode": _zipcodeController.text,
        "amenities": _selectedAmenities,
      };
      final success = await context.read<PropertiesProvider>().createProperty(
        propertyData,
        _selectedImages.map((file) => file.path).toList(),
      );
      if (success && mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Property added successfully!")),
        );
      }
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _priceController.dispose();
    _bedroomsController.dispose();
    _bathroomsController.dispose();
    _areaController.dispose();
    _addressController.dispose();
    _cityController.dispose();
    _stateController.dispose();
    _zipcodeController.dispose();
    super.dispose();
  }
}
