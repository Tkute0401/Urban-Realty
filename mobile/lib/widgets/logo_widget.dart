import 'package:flutter/material.dart';

class LogoWidget extends StatelessWidget {
  final double size;
  final bool showText;
  
  const LogoWidget({
    super.key,
    this.size = 120,
    this.showText = true,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Logo Icon
        Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            color: theme.colorScheme.primary,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Stack(
            alignment: Alignment.center,
            children: [
              // White rounded square background
              Container(
                width: size * 0.8,
                height: size * 0.8,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              // House and S symbol
              CustomPaint(
                size: Size(size * 0.6, size * 0.6),
                painter: LogoSymbolPainter(
                  color: theme.colorScheme.primary,
                ),
              ),
            ],
          ),
        ),
        
        if (showText) ...[
          const SizedBox(height: 16),
          // Brand Text
          Column(
            children: [
              Text(
                'SQUARE',
                style: TextStyle(
                  fontSize: size * 0.2,
                  fontWeight: FontWeight.bold,
                  color: theme.colorScheme.primary,
                  letterSpacing: 2,
                ),
              ),
              Text(
                'FOOOT',
                style: TextStyle(
                  fontSize: size * 0.2,
                  fontWeight: FontWeight.bold,
                  color: theme.colorScheme.primary,
                  letterSpacing: 2,
                ),
              ),
            ],
          ),
        ],
      ],
    );
  }
}

class LogoSymbolPainter extends CustomPainter {
  final Color color;
  
  LogoSymbolPainter({required this.color});
  
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = size.width * 0.08
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;
    
    final path = Path();
    
    // House roof (triangle)
    final roofHeight = size.height * 0.4;
    final roofWidth = size.width * 0.6;
    
    path.moveTo(size.width * 0.5, size.height * 0.2);
    path.lineTo(size.width * 0.5 - roofWidth / 2, size.height * 0.2 + roofHeight);
    path.lineTo(size.width * 0.5 + roofWidth / 2, size.height * 0.2 + roofHeight);
    path.close();
    
    // House base and S shape combined
    final baseWidth = size.width * 0.5;
    final baseHeight = size.height * 0.6;
    
    // Left wall
    path.moveTo(size.width * 0.5 - baseWidth / 2, size.height * 0.2 + roofHeight);
    path.lineTo(size.width * 0.5 - baseWidth / 2, size.height * 0.2 + roofHeight + baseHeight);
    
    // S shape curves
    path.quadraticBezierTo(
      size.width * 0.5 - baseWidth / 2,
      size.height * 0.2 + roofHeight + baseHeight * 0.3,
      size.width * 0.5,
      size.height * 0.2 + roofHeight + baseHeight * 0.3,
    );
    
    path.quadraticBezierTo(
      size.width * 0.5 + baseWidth / 2,
      size.height * 0.2 + roofHeight + baseHeight * 0.3,
      size.width * 0.5 + baseWidth / 2,
      size.height * 0.2 + roofHeight + baseHeight * 0.6,
    );
    
    path.quadraticBezierTo(
      size.width * 0.5 + baseWidth / 2,
      size.height * 0.2 + roofHeight + baseHeight * 0.8,
      size.width * 0.5,
      size.height * 0.2 + roofHeight + baseHeight * 0.8,
    );
    
    path.quadraticBezierTo(
      size.width * 0.5 - baseWidth / 2,
      size.height * 0.2 + roofHeight + baseHeight * 0.8,
      size.width * 0.5 - baseWidth / 2,
      size.height * 0.2 + roofHeight + baseHeight,
    );
    
    // Right wall
    path.lineTo(size.width * 0.5 + baseWidth / 2, size.height * 0.2 + roofHeight + baseHeight);
    path.lineTo(size.width * 0.5 + baseWidth / 2, size.height * 0.2 + roofHeight);
    
    canvas.drawPath(path, paint);
  }
  
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}