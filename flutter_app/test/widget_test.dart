import 'package:flutter_test/flutter_test.dart';
import 'package:fixly_mobile/main.dart';

void main() {
  testWidgets('FixlyApp renders successfully', (WidgetTester tester) async {
    await tester.pumpWidget(const FixlyApp());
    expect(find.text('Select Phone Model'), findsOneWidget);
    expect(find.text('Popular Repairs'), findsOneWidget);
  });
}
