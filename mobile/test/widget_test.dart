import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:urban_realty_mobile/main.dart';

void main() {
  testWidgets('Urban Realty app smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const UrbanRealtyApp());

    // Verify that the app starts without crashing
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}