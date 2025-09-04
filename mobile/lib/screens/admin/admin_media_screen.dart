import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import '../../services/admin_service.dart';

class AdminMediaScreen extends StatefulWidget {
  const AdminMediaScreen({super.key});

  @override
  State<AdminMediaScreen> createState() => _AdminMediaScreenState();
}

class _AdminMediaScreenState extends State<AdminMediaScreen> {
  final AdminService _adminService = AdminService();
  final ScrollController _scrollController = ScrollController();
  bool _isLoading = false;
  bool _isUploading = false;
  int _page = 1;
  final int _limit = 20;
  List<Map<String, dynamic>> _media = <Map<String, dynamic>>[];
  bool _hasMore = true;

  @override
  void initState() {
    super.initState();
    _fetchMedia(reset: true);
    _scrollController.addListener(_handleScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _fetchMedia({bool reset = false}) async {
    if (_isLoading) return;
    setState(() => _isLoading = true);
    try {
      if (reset) {
        _page = 1;
        _hasMore = true;
        _media = <Map<String, dynamic>>[];
      }
      final items = await _adminService.getMedia(page: _page, limit: _limit);
      setState(() {
        _media.addAll(items);
        _hasMore = items.length == _limit;
        if (_hasMore) _page += 1;
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load media: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _handleScroll() {
    if (!_hasMore || _isLoading) return;
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
      _fetchMedia();
    }
  }

  Future<void> _deleteMedia(String id) async {
    try {
      await _adminService.deleteMedia(id);
      setState(() {
        _media.removeWhere((m) => (m['_id']?.toString() ?? m['id']?.toString()) == id);
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Media deleted')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Delete failed: $e')),
        );
      }
    }
  }

  Future<void> _uploadMedia() async {
    if (_isUploading) return;
    setState(() => _isUploading = true);
    try {
      final result = await FilePicker.platform.pickFiles(type: FileType.any, allowMultiple: false);
      final filePath = result?.files.single.path;
      if (filePath == null) {
        setState(() => _isUploading = false);
        return;
      }
      await _adminService.uploadMedia(filePath: filePath);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Upload successful')),
        );
      }
      await _fetchMedia(reset: true);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Upload failed: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isUploading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Media'),
        actions: [
          IconButton(
            onPressed: _isUploading ? null : _uploadMedia,
            icon: _isUploading ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(strokeWidth: 2)) : const Icon(Icons.upload_file),
            tooltip: 'Upload',
          ),
          IconButton(
            onPressed: _isLoading ? null : () => _fetchMedia(reset: true),
            icon: const Icon(Icons.refresh),
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading && _media.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_media.isEmpty) {
      return const Center(child: Text('No media found'));
    }
    return ListView.separated(
      controller: _scrollController,
      itemCount: _media.length + (_hasMore ? 1 : 0),
      separatorBuilder: (_, __) => const Divider(height: 1),
      itemBuilder: (context, index) {
        if (index >= _media.length) {
          return const Padding(
            padding: EdgeInsets.all(16.0),
            child: Center(child: CircularProgressIndicator()),
          );
        }
        final item = _media[index];
        final id = (item['_id']?.toString() ?? item['id']?.toString() ?? '');
        final filename = item['filename']?.toString() ?? item['name']?.toString() ?? 'file';
        final size = item['size']?.toString() ?? '';
        final url = item['url']?.toString() ?? item['path']?.toString() ?? '';
        return ListTile(
          leading: const Icon(Icons.insert_drive_file),
          title: Text(filename),
          subtitle: Text([size, url].where((e) => e.isNotEmpty).join(' · ')),
          trailing: IconButton(
            icon: const Icon(Icons.delete, color: Colors.red),
            onPressed: id.isEmpty ? null : () => _deleteMedia(id),
          ),
        );
      },
    );
  }
}

