import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:fixly_mobile/main.dart';

void main() {
  testWidgets('FixlyApp renders successfully and navigates 3 bottom tabs', (WidgetTester tester) async {
    await tester.pumpWidget(const FixlyApp());
    expect(find.text('Select Phone Model'), findsOneWidget);
    expect(find.text('Popular Repairs'), findsOneWidget);

    // Verify 3 bottom nav labels exist
    expect(find.text('Home'), findsOneWidget);
    expect(find.text('Booking'), findsOneWidget);
    expect(find.text('Dashboard'), findsOneWidget);
    // Verify Live is removed
    expect(find.text('Live'), findsNothing);

    // Tap Booking tab
    await tester.tap(find.text('Booking'));
    await tester.pumpAndSettle();
    expect(find.text('Active Repair'), findsOneWidget);
    expect(find.text('Past Service History'), findsOneWidget);

    // Tap Dashboard tab
    await tester.tap(find.text('Dashboard'));
    await tester.pumpAndSettle();
    expect(find.text('Akshay Kumar'), findsOneWidget);
    expect(find.text('Total Repairs'), findsOneWidget);
    expect(find.text('Device Vault'), findsOneWidget);

    // Tap Home tab back
    await tester.tap(find.text('Home'));
    await tester.pumpAndSettle();
    expect(find.text('Select Phone Model'), findsOneWidget);

    // Tap Notifications Bell
    await tester.tap(find.byIcon(Icons.notifications_none_rounded));
    await tester.pumpAndSettle();
    expect(find.text('Notifications'), findsOneWidget);
    expect(find.text('Device Received at Central Lab'), findsOneWidget);
    expect(find.text('Mark all read'), findsOneWidget);

    // Tap back from notifications
    await tester.tap(find.byIcon(Icons.arrow_back));
    await tester.pumpAndSettle();
    expect(find.text('Select Phone Model'), findsOneWidget);
  });
}
