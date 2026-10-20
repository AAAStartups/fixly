


import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'theme/app_theme.dart';
import 'models/models.dart';
import 'widgets/custom_widgets.dart';
import 'screens/home_screen.dart';
import 'screens/bookings_tab_screen.dart';
import 'screens/dashboard_tab_screen.dart';
import 'screens/select_brand_screen.dart';
import 'screens/select_model_screen.dart';
import 'screens/select_service_screen.dart';
import 'screens/choose_pickup_time_screen.dart';
import 'screens/booking_details_screen.dart';
import 'screens/live_tracking_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: AppColors.background,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const FixlyApp());
}

class FixlyApp extends StatelessWidget {
  const FixlyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FIXLY',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const MainAppController(),
    );
  }
}

class MainAppController extends StatefulWidget {
  const MainAppController({super.key});

  @override
  State<MainAppController> createState() => _MainAppControllerState();
}

class _MainAppControllerState extends State<MainAppController> {
  int _currentTabIndex = 0; // 0 = Home, 1 = Booking, 2 = Dashboard
  int _wizardStep = 0; // 0 = Tabs (Home/Booking/Dashboard), 1..5 = Booking Flow, 6 = Tracking
  BookingState _bookingState = const BookingState();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: _buildCurrentScreen(),
      bottomNavigationBar: _wizardStep == 0
          ? FixlyBottomNav(
              selectedIndex: _currentTabIndex,
              onTabChange: (index) {
                setState(() {
                  _currentTabIndex = index;
                });
              },
            )
          : null,
    );
  }

  Widget _buildCurrentScreen() {
    // If inside the 5-step booking wizard or live tracking
    if (_wizardStep > 0) {
      switch (_wizardStep) {
        case 1:
          return SelectBrandScreen(
            bookingState: _bookingState,
            onBrandSelected: (brand) {
              setState(() {
                _bookingState = _bookingState.copyWith(selectedBrand: brand);
              });
            },
            onBack: () => setState(() => _wizardStep = 0),
            onNext: () => setState(() => _wizardStep = 2),
          );

        case 2:
          return SelectModelScreen(
            bookingState: _bookingState,
            onModelSelected: (model) {
              setState(() {
                _bookingState = _bookingState.copyWith(selectedModel: model);
              });
            },
            onBack: () => setState(() => _wizardStep = 1),
            onChangeBrand: () => setState(() => _wizardStep = 1),
            onNext: () => setState(() => _wizardStep = 3),
          );

        case 3:
          return SelectServiceScreen(
            bookingState: _bookingState,
            onServiceSelected: (service) {
              setState(() {
                _bookingState = _bookingState.copyWith(selectedService: service);
              });
            },
            onBack: () => setState(() => _wizardStep = 2),
            onChangeModel: () => setState(() => _wizardStep = 2),
            onNext: () => setState(() => _wizardStep = 4),
          );

        case 4:
          return ChoosePickupTimeScreen(
            bookingState: _bookingState,
            onDateTimeSelected: (date, slot) {
              setState(() {
                _bookingState = _bookingState.copyWith(
                  selectedDate: date,
                  selectedTimeSlot: slot,
                );
              });
            },
            onBack: () => setState(() => _wizardStep = 3),
            onNext: () => setState(() => _wizardStep = 5),
          );

        case 5:
          return BookingDetailsScreen(
            bookingState: _bookingState,
            onBack: () => setState(() => _wizardStep = 4),
            onJumpToStep: (step) => setState(() => _wizardStep = step),
            onConfirmBooking: () => setState(() => _wizardStep = 6),
          );

        case 6:
          return LiveTrackingScreen(
            bookingState: _bookingState,
            onReturnHome: () => setState(() {
              _wizardStep = 0;
              _currentTabIndex = 1; // Return to Bookings tab to see active booking!
            }),
          );

        default:
          return _buildTabScreen();
      }
    }

    return _buildTabScreen();
  }

  Widget _buildTabScreen() {
    switch (_currentTabIndex) {
      case 0:
        return HomeScreen(
          onStartBooking: () => setState(() => _wizardStep = 1),
          onSelectIssue: (issue) {
            setState(() {
              _wizardStep = 1;
            });
          },
        );

      case 1:
        return BookingsTabScreen(
          onStartNewBooking: () => setState(() => _wizardStep = 1),
          onTrackActiveOrder: () => setState(() => _wizardStep = 6),
        );

      case 2:
        return DashboardTabScreen(
          onStartNewBooking: () => setState(() => _wizardStep = 1),
          onNavigateToBookings: () => setState(() => _currentTabIndex = 1),
        );

      default:
        return HomeScreen(
          onStartBooking: () => setState(() => _wizardStep = 1),
          onSelectIssue: (issue) => setState(() => _wizardStep = 1),
        );
    }
  }
}
