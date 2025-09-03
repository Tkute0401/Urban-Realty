import "package:flutter/material.dart";

class AdminChartWidget extends StatelessWidget {
  final List<Map<String, dynamic>> data;
  final String xField;
  final String yField;
  final String title;

  const AdminChartWidget({
    super.key,
    required this.data,
    required this.xField,
    required this.yField,
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        Container(
          height: 150,
          child: CustomPaint(
            size: const Size(double.infinity, 150),
            painter: ChartPainter(data: data, xField: xField, yField: yField),
          ),
        ),
      ],
    );
  }
}

class ChartPainter extends CustomPainter {
  final List<Map<String, dynamic>> data;
  final String xField;
  final String yField;

  ChartPainter({
    required this.data,
    required this.xField,
    required this.yField,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (data.isEmpty) return;

    final paint = Paint()
      ..color = Colors.blue
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    final fillPaint = Paint()
      ..color = Colors.blue.withOpacity(0.1)
      ..style = PaintingStyle.fill;

    final path = Path();
    final fillPath = Path();

    final maxValue = data.fold<double>(
      0,
      (max, item) => (item[yField] as num?)?.toDouble() ?? 0 > max
          ? (item[yField] as num?)?.toDouble() ?? 0
          : max,
    );

    if (maxValue == 0) return;

    final width = size.width / (data.length - 1);
    final height = size.height;

    for (int i = 0; i < data.length; i++) {
      final item = data[i];
      final value = (item[yField] as num?)?.toDouble() ?? 0;
      final x = i * width;
      final y = height - (value / maxValue) * height;

      if (i == 0) {
        path.moveTo(x, y);
        fillPath.moveTo(x, height);
        fillPath.lineTo(x, y);
      } else {
        path.lineTo(x, y);
        fillPath.lineTo(x, y);
      }
    }

    fillPath.lineTo(size.width, height);
    fillPath.close();

    canvas.drawPath(fillPath, fillPaint);
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
