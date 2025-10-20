import 'package:flutter/material.dart';
import '../config/design_tokens.dart';

class ImageCropperWidget extends StatefulWidget {
  final String imagePath;
  final Function(String) onImageCropped;

  const ImageCropperWidget({
    super.key,
    required this.imagePath,
    required this.onImageCropped,
  });

  @override
  State<ImageCropperWidget> createState() => _ImageCropperWidgetState();
}

class _ImageCropperWidgetState extends State<ImageCropperWidget> {
  double _scale = 1.0;
  double _previousScale = 1.0;
  Offset _offset = Offset.zero;
  Offset _previousOffset = Offset.zero;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Crop Image'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        actions: [
          TextButton(
            onPressed: _cropImage,
            child: const Text('Done'),
          ),
        ],
      ),
      body: Column(
        children: [
          // Image Cropper Area
          Expanded(
            child: Container(
              color: Colors.black,
              child: Center(
                child: GestureDetector(
                  onScaleStart: (details) {
                    _previousScale = _scale;
                    _previousOffset = _offset;
                  },
                  onScaleUpdate: (details) {
                    setState(() {
                      _scale = _previousScale * details.scale;
                      _offset = Offset(
                        _previousOffset.dx + details.focalPointDelta.dx,
                        _previousOffset.dy + details.focalPointDelta.dy,
                      );
                    });
                  },
                  child: Transform(
                    transform: Matrix4.identity()
                      ..translate(_offset.dx, _offset.dy)
                      ..scale(_scale),
                    child: Container(
                      constraints: const BoxConstraints(
                        maxWidth: 300,
                        maxHeight: 300,
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(DesignTokens.radiusLg),
                        child: Image.network(
                          widget.imagePath,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => Container(
                            color: Colors.grey[300],
                            child: const Icon(
                              Icons.image,
                              size: 100,
                              color: Colors.grey,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
          
          // Instructions
          Container(
            padding: const EdgeInsets.all(DesignTokens.spaceLg),
            color: Theme.of(context).colorScheme.surface,
            child: Column(
              children: [
                Text(
                  'Pinch to zoom and drag to position',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: DesignTokens.spaceSm),
                Text(
                  'Adjust the image to fit the circular frame',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
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

  void _cropImage() {
    // TODO: Implement actual image cropping
    // For now, just return the original image path
    widget.onImageCropped(widget.imagePath);
    Navigator.pop(context);
  }
}
