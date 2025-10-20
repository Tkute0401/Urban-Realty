import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/auth_provider.dart';
import '../config/design_tokens.dart';
import 'document_verification_screen.dart';

class ProfileEditScreen extends ConsumerStatefulWidget {
  const ProfileEditScreen({super.key});

  @override
  ConsumerState<ProfileEditScreen> createState() => _ProfileEditScreenState();
}

class _ProfileEditScreenState extends ConsumerState<ProfileEditScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _bioController = TextEditingController();
  final _addressController = TextEditingController();
  final _companyController = TextEditingController();
  final _licenseController = TextEditingController();

  String? _selectedProfileImage;
  String? _selectedCoverImage;
  String _selectedRole = 'user';
  String _selectedExperience = '0-1 years';
  bool _isVerified = false;
  bool _isLoading = false;

  final List<String> _roles = ['user', 'agent', 'admin', 'developer'];
  final List<String> _experienceLevels = [
    '0-1 years',
    '1-3 years',
    '3-5 years',
    '5-10 years',
    '10+ years'
  ];

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _bioController.dispose();
    _addressController.dispose();
    _companyController.dispose();
    _licenseController.dispose();
    super.dispose();
  }

  void _loadUserData() {
    // TODO: Load user data from provider
    _nameController.text = 'Demo User';
    _emailController.text = 'demo@urbanrealty.com';
    _phoneController.text = '+1234567890';
    _bioController.text = 'Real estate enthusiast with a passion for helping people find their dream homes.';
    _addressController.text = '123 Main St, New York, NY 10001';
    _companyController.text = 'Urban Realty';
    _licenseController.text = 'RE123456';
    _selectedRole = 'user';
    _selectedExperience = '1-3 years';
    _isVerified = true;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Profile'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        elevation: 0,
        actions: [
          TextButton(
            onPressed: _isLoading ? null : _saveProfile,
            child: _isLoading
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Text('Save'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              // Profile Header with Images
              _buildProfileHeader(context),
              
              // Profile Form
              Padding(
                padding: const EdgeInsets.all(DesignTokens.spaceLg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Basic Information
                    _buildSectionHeader(context, 'Basic Information'),
                    const SizedBox(height: DesignTokens.spaceMd),
                    
                    TextFormField(
                      controller: _nameController,
                      decoration: const InputDecoration(
                        labelText: 'Full Name',
                        prefixIcon: Icon(Icons.person),
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your full name';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: DesignTokens.spaceMd),
                    
                    TextFormField(
                      controller: _emailController,
                      decoration: const InputDecoration(
                        labelText: 'Email Address',
                        prefixIcon: Icon(Icons.email),
                        border: OutlineInputBorder(),
                      ),
                      keyboardType: TextInputType.emailAddress,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your email';
                        }
                        if (!value.contains('@')) {
                          return 'Please enter a valid email';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: DesignTokens.spaceMd),
                    
                    TextFormField(
                      controller: _phoneController,
                      decoration: const InputDecoration(
                        labelText: 'Phone Number',
                        prefixIcon: Icon(Icons.phone),
                        border: OutlineInputBorder(),
                      ),
                      keyboardType: TextInputType.phone,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your phone number';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: DesignTokens.spaceMd),
                    
                    DropdownButtonFormField<String>(
                      value: _selectedRole,
                      decoration: const InputDecoration(
                        labelText: 'Role',
                        prefixIcon: Icon(Icons.work),
                        border: OutlineInputBorder(),
                      ),
                      items: _roles.map((String role) {
                        return DropdownMenuItem<String>(
                          value: role,
                          child: Text(role.capitalize()),
                        );
                      }).toList(),
                      onChanged: (String? newValue) {
                        setState(() {
                          _selectedRole = newValue!;
                        });
                      },
                    ),
                    
                    const SizedBox(height: DesignTokens.spaceLg),
                    
                    // Professional Information
                    _buildSectionHeader(context, 'Professional Information'),
                    const SizedBox(height: DesignTokens.spaceMd),
                    
                    TextFormField(
                      controller: _bioController,
                      decoration: const InputDecoration(
                        labelText: 'Bio',
                        prefixIcon: Icon(Icons.description),
                        border: OutlineInputBorder(),
                        alignLabelWithHint: true,
                      ),
                      maxLines: 3,
                    ),
                    const SizedBox(height: DesignTokens.spaceMd),
                    
                    TextFormField(
                      controller: _companyController,
                      decoration: const InputDecoration(
                        labelText: 'Company',
                        prefixIcon: Icon(Icons.business),
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: DesignTokens.spaceMd),
                    
                    DropdownButtonFormField<String>(
                      value: _selectedExperience,
                      decoration: const InputDecoration(
                        labelText: 'Experience Level',
                        prefixIcon: Icon(Icons.trending_up),
                        border: OutlineInputBorder(),
                      ),
                      items: _experienceLevels.map((String level) {
                        return DropdownMenuItem<String>(
                          value: level,
                          child: Text(level),
                        );
                      }).toList(),
                      onChanged: (String? newValue) {
                        setState(() {
                          _selectedExperience = newValue!;
                        });
                      },
                    ),
                    const SizedBox(height: DesignTokens.spaceMd),
                    
                    TextFormField(
                      controller: _licenseController,
                      decoration: const InputDecoration(
                        labelText: 'License Number',
                        prefixIcon: Icon(Icons.verified_user),
                        border: OutlineInputBorder(),
                      ),
                    ),
                    
                    const SizedBox(height: DesignTokens.spaceLg),
                    
                    // Contact Information
                    _buildSectionHeader(context, 'Contact Information'),
                    const SizedBox(height: DesignTokens.spaceMd),
                    
                    TextFormField(
                      controller: _addressController,
                      decoration: const InputDecoration(
                        labelText: 'Address',
                        prefixIcon: Icon(Icons.location_on),
                        border: OutlineInputBorder(),
                        alignLabelWithHint: true,
                      ),
                      maxLines: 2,
                    ),
                    
                    const SizedBox(height: DesignTokens.spaceLg),
                    
                    // Verification Status
                    _buildSectionHeader(context, 'Verification Status'),
                    const SizedBox(height: DesignTokens.spaceMd),
                    
                    _buildVerificationCard(context),
                    
                    const SizedBox(height: DesignTokens.spaceLg),
                    
                    // Document Upload
                    _buildSectionHeader(context, 'Documents'),
                    const SizedBox(height: DesignTokens.spaceMd),
                    
                    _buildDocumentUploadSection(context),
                    
                    const SizedBox(height: DesignTokens.spaceLg),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProfileHeader(BuildContext context) {
    return Container(
      height: 200,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Theme.of(context).colorScheme.primary,
            Theme.of(context).colorScheme.primary.withOpacity(0.8),
          ],
        ),
      ),
      child: Stack(
        children: [
          // Cover Image
          Positioned.fill(
            child: _selectedCoverImage != null
                ? Image.network(
                    _selectedCoverImage!,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  )
                : Container(
                    color: Theme.of(context).colorScheme.primary,
                    child: const Center(
                      child: Icon(
                        Icons.landscape,
                        size: 48,
                        color: Colors.white70,
                      ),
                    ),
                  ),
          ),
          
          // Cover Image Upload Button
          Positioned(
            top: DesignTokens.spaceMd,
            right: DesignTokens.spaceMd,
            child: FloatingActionButton.small(
              onPressed: _uploadCoverImage,
              backgroundColor: Colors.white.withOpacity(0.2),
              child: const Icon(Icons.camera_alt, color: Colors.white),
            ),
          ),
          
          // Profile Image
          Positioned(
            bottom: -30,
            left: DesignTokens.spaceLg,
            child: GestureDetector(
              onTap: _uploadProfileImage,
              child: Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: Colors.white,
                    width: 4,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.2),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: CircleAvatar(
                  backgroundColor: Theme.of(context).colorScheme.surface,
                  child: _selectedProfileImage != null
                      ? ClipOval(
                          child: Image.network(
                            _selectedProfileImage!,
                            width: 80,
                            height: 80,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) => const Icon(
                              Icons.person,
                              size: 40,
                              color: Colors.grey,
                            ),
                          ),
                        )
                      : const Icon(
                          Icons.person,
                          size: 40,
                          color: Colors.grey,
                        ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(BuildContext context, String title) {
    return Text(
      title,
      style: Theme.of(context).textTheme.titleLarge?.copyWith(
        fontWeight: FontWeight.bold,
        color: Theme.of(context).colorScheme.primary,
      ),
    );
  }

  Widget _buildVerificationCard(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
      ),
      child: Padding(
        padding: const EdgeInsets.all(DesignTokens.spaceMd),
        child: Row(
          children: [
            Icon(
              _isVerified ? Icons.verified : Icons.pending,
              color: _isVerified ? Colors.green : Colors.orange,
              size: DesignTokens.iconSizeLg,
            ),
            const SizedBox(width: DesignTokens.spaceMd),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _isVerified ? 'Verified Account' : 'Pending Verification',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    _isVerified
                        ? 'Your account has been verified'
                        : 'Upload documents to verify your account',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                    ),
                  ),
                ],
              ),
            ),
            if (!_isVerified)
              TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const DocumentVerificationScreen()),
                  );
                },
                child: const Text('Verify Now'),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildDocumentUploadSection(BuildContext context) {
    return Column(
      children: [
        _buildDocumentUploadCard(
          context,
          'ID Document',
          'Upload your government-issued ID',
          Icons.credit_card,
          () => _uploadDocument('id'),
        ),
        const SizedBox(height: DesignTokens.spaceMd),
        _buildDocumentUploadCard(
          context,
          'License Document',
          'Upload your real estate license',
          Icons.verified_user,
          () => _uploadDocument('license'),
        ),
        const SizedBox(height: DesignTokens.spaceMd),
        _buildDocumentUploadCard(
          context,
          'Proof of Address',
          'Upload utility bill or bank statement',
          Icons.home,
          () => _uploadDocument('address'),
        ),
      ],
    );
  }

  Widget _buildDocumentUploadCard(
    BuildContext context,
    String title,
    String description,
    IconData icon,
    VoidCallback onTap,
  ) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
      ),
      child: ListTile(
        leading: Icon(
          icon,
          color: Theme.of(context).colorScheme.primary,
        ),
        title: Text(
          title,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Text(description),
        trailing: const Icon(Icons.upload),
        onTap: onTap,
      ),
    );
  }

  void _uploadProfileImage() {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(DesignTokens.spaceLg),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Update Profile Picture',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: DesignTokens.spaceLg),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      _takePhoto();
                    },
                    icon: const Icon(Icons.camera_alt),
                    label: const Text('Take Photo'),
                  ),
                ),
                const SizedBox(width: DesignTokens.spaceMd),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      _chooseFromGallery();
                    },
                    icon: const Icon(Icons.photo_library),
                    label: const Text('Choose from Gallery'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: DesignTokens.spaceMd),
            if (_selectedProfileImage != null)
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: () {
                    Navigator.pop(context);
                    _cropImage();
                  },
                  icon: const Icon(Icons.crop),
                  label: const Text('Crop Image'),
                ),
              ),
          ],
        ),
      ),
    );
  }

  void _uploadCoverImage() {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(DesignTokens.spaceLg),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Update Cover Photo',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: DesignTokens.spaceLg),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      _takePhoto();
                    },
                    icon: const Icon(Icons.camera_alt),
                    label: const Text('Take Photo'),
                  ),
                ),
                const SizedBox(width: DesignTokens.spaceMd),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      _chooseFromGallery();
                    },
                    icon: const Icon(Icons.photo_library),
                    label: const Text('Choose from Gallery'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _uploadDocument(String type) {
    // TODO: Implement document upload
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Upload $type document functionality not implemented yet')),
    );
  }

  void _takePhoto() {
    // TODO: Implement camera functionality
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Camera functionality not implemented yet')),
    );
  }

  void _chooseFromGallery() {
    // TODO: Implement gallery picker
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Gallery picker not implemented yet')),
    );
  }

  void _cropImage() {
    // TODO: Implement image cropping
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Image cropping functionality not implemented yet')),
    );
  }

  void _verifyAccount() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Verify Account'),
        content: const Text(
          'To verify your account, please upload the required documents. '
          'Verification typically takes 1-2 business days.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              // TODO: Implement verification process
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Verification process started')),
              );
            },
            child: const Text('Start Verification'),
          ),
        ],
      ),
    );
  }

  void _saveProfile() {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });

      // TODO: Implement profile saving
      Future.delayed(const Duration(seconds: 2), () {
        setState(() {
          _isLoading = false;
        });
        
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Profile updated successfully'),
            backgroundColor: Colors.green,
          ),
        );
        
        Navigator.pop(context);
      });
    }
  }
}

extension StringExtension on String {
  String capitalize() {
    if (isEmpty) return this;
    return this[0].toUpperCase() + substring(1);
  }
}
