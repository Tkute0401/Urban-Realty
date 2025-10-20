import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../config/design_tokens.dart';

class DocumentVerificationScreen extends ConsumerStatefulWidget {
  const DocumentVerificationScreen({super.key});

  @override
  ConsumerState<DocumentVerificationScreen> createState() => _DocumentVerificationScreenState();
}

class _DocumentVerificationScreenState extends ConsumerState<DocumentVerificationScreen> {
  final List<DocumentType> _requiredDocuments = [
    DocumentType(
      id: 'id',
      name: 'Government ID',
      description: 'Driver\'s license, passport, or state ID',
      isRequired: true,
      status: 'pending',
    ),
    DocumentType(
      id: 'license',
      name: 'Real Estate License',
      description: 'Current real estate license certificate',
      isRequired: true,
      status: 'pending',
    ),
    DocumentType(
      id: 'address',
      name: 'Proof of Address',
      description: 'Utility bill or bank statement (within 3 months)',
      isRequired: true,
      status: 'pending',
    ),
    DocumentType(
      id: 'insurance',
      name: 'Professional Insurance',
      description: 'Errors & Omissions insurance certificate',
      isRequired: false,
      status: 'not_uploaded',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Document Verification'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Section
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(DesignTokens.spaceLg),
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
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Verify Your Identity',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: DesignTokens.spaceSm),
                  Text(
                    'Upload the required documents to verify your account and unlock all features.',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),

            // Verification Status
            Padding(
              padding: const EdgeInsets.all(DesignTokens.spaceLg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Verification Status',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: DesignTokens.spaceMd),
                  _buildStatusCard(context),
                ],
              ),
            ),

            // Required Documents
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: DesignTokens.spaceLg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Required Documents',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: DesignTokens.spaceMd),
                  ..._requiredDocuments.map((doc) => _buildDocumentCard(context, doc)),
                ],
              ),
            ),

            const SizedBox(height: DesignTokens.spaceLg),

            // Upload Guidelines
            Container(
              margin: const EdgeInsets.all(DesignTokens.spaceLg),
              padding: const EdgeInsets.all(DesignTokens.spaceLg),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surfaceVariant,
                borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Upload Guidelines',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: DesignTokens.spaceMd),
                  _buildGuidelineItem(
                    context,
                    Icons.visibility,
                    'Clear and readable',
                    'Ensure all text is clearly visible and not blurry',
                  ),
                  _buildGuidelineItem(
                    context,
                    Icons.light_mode,
                    'Good lighting',
                    'Take photos in well-lit areas for better quality',
                  ),
                  _buildGuidelineItem(
                    context,
                    Icons.crop_free,
                    'Full document',
                    'Include the entire document in the frame',
                  ),
                  _buildGuidelineItem(
                    context,
                    Icons.file_upload,
                    'Supported formats',
                    'JPG, PNG, PDF files up to 10MB',
                  ),
                ],
              ),
            ),

            const SizedBox(height: DesignTokens.spaceLg),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusCard(BuildContext context) {
    final completedDocs = _requiredDocuments.where((doc) => doc.status == 'approved').length;
    final totalRequired = _requiredDocuments.where((doc) => doc.isRequired).length;
    final isFullyVerified = completedDocs == totalRequired;

    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
      ),
      child: Padding(
        padding: const EdgeInsets.all(DesignTokens.spaceLg),
        child: Row(
          children: [
            Icon(
              isFullyVerified ? Icons.verified : Icons.pending,
              color: isFullyVerified ? Colors.green : Colors.orange,
              size: DesignTokens.iconSize2xl,
            ),
            const SizedBox(width: DesignTokens.spaceMd),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    isFullyVerified ? 'Fully Verified' : 'Verification In Progress',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    '$completedDocs of $totalRequired required documents approved',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                    ),
                  ),
                  const SizedBox(height: DesignTokens.spaceSm),
                  LinearProgressIndicator(
                    value: completedDocs / totalRequired,
                    backgroundColor: Colors.grey[300],
                    valueColor: AlwaysStoppedAnimation<Color>(
                      isFullyVerified ? Colors.green : Theme.of(context).colorScheme.primary,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDocumentCard(BuildContext context, DocumentType document) {
    return Card(
      margin: const EdgeInsets.only(bottom: DesignTokens.spaceMd),
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(DesignTokens.radiusMd),
      ),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: _getStatusColor(document.status).withOpacity(0.1),
          child: Icon(
            _getStatusIcon(document.status),
            color: _getStatusColor(document.status),
          ),
        ),
        title: Row(
          children: [
            Text(document.name),
            if (document.isRequired)
              Container(
                margin: const EdgeInsets.only(left: DesignTokens.spaceXs),
                padding: const EdgeInsets.symmetric(
                  horizontal: DesignTokens.spaceXs,
                  vertical: 2,
                ),
                decoration: BoxDecoration(
                  color: Colors.red.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(DesignTokens.radiusSm),
                  border: Border.all(color: Colors.red.withOpacity(0.3)),
                ),
                child: Text(
                  'Required',
                  style: TextStyle(
                    color: Colors.red,
                    fontSize: DesignTokens.fontSizeXs,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
          ],
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(document.description),
            const SizedBox(height: DesignTokens.spaceXs),
            Text(
              _getStatusText(document.status),
              style: TextStyle(
                color: _getStatusColor(document.status),
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        trailing: _buildActionButton(context, document),
        onTap: () => _handleDocumentAction(document),
      ),
    );
  }

  Widget _buildActionButton(BuildContext context, DocumentType document) {
    switch (document.status) {
      case 'approved':
        return const Icon(Icons.check_circle, color: Colors.green);
      case 'pending':
        return const Icon(Icons.hourglass_empty, color: Colors.orange);
      case 'rejected':
        return const Icon(Icons.error, color: Colors.red);
      default:
        return IconButton(
          icon: const Icon(Icons.upload),
          onPressed: () => _uploadDocument(document),
        );
    }
  }

  Widget _buildGuidelineItem(
    BuildContext context,
    IconData icon,
    String title,
    String description,
  ) {
    return Padding(
      padding: const EdgeInsets.only(bottom: DesignTokens.spaceSm),
      child: Row(
        children: [
          Icon(
            icon,
            color: Theme.of(context).colorScheme.primary,
            size: DesignTokens.iconSizeSm,
          ),
          const SizedBox(width: DesignTokens.spaceSm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(
                  description,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'approved':
        return Colors.green;
      case 'pending':
        return Colors.orange;
      case 'rejected':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  IconData _getStatusIcon(String status) {
    switch (status) {
      case 'approved':
        return Icons.check;
      case 'pending':
        return Icons.hourglass_empty;
      case 'rejected':
        return Icons.error;
      default:
        return Icons.upload;
    }
  }

  String _getStatusText(String status) {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Under Review';
      case 'rejected':
        return 'Rejected - Please resubmit';
      default:
        return 'Not Uploaded';
    }
  }

  void _handleDocumentAction(DocumentType document) {
    switch (document.status) {
      case 'approved':
        _viewDocument(document);
        break;
      case 'pending':
        _viewDocument(document);
        break;
      case 'rejected':
        _uploadDocument(document);
        break;
      default:
        _uploadDocument(document);
        break;
    }
  }

  void _uploadDocument(DocumentType document) {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(DesignTokens.spaceLg),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Upload ${document.name}',
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
                      _takePhoto(document);
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
                      _chooseFromGallery(document);
                    },
                    icon: const Icon(Icons.photo_library),
                    label: const Text('Choose File'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _viewDocument(DocumentType document) {
    // TODO: Implement document viewer
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Viewing ${document.name}')),
    );
  }

  void _takePhoto(DocumentType document) {
    // TODO: Implement camera functionality
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Taking photo for ${document.name}')),
    );
  }

  void _chooseFromGallery(DocumentType document) {
    // TODO: Implement file picker
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Choosing file for ${document.name}')),
    );
  }
}

class DocumentType {
  final String id;
  final String name;
  final String description;
  final bool isRequired;
  final String status;

  DocumentType({
    required this.id,
    required this.name,
    required this.description,
    required this.isRequired,
    required this.status,
  });
}
