import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../widgets/custom_widgets.dart';

class ChoosePickupTimeScreen extends StatefulWidget {
  final BookingState bookingState;
  final Function(String date, String timeSlot) onDateTimeSelected;
  final VoidCallback onBack;
  final VoidCallback onNext;

  const ChoosePickupTimeScreen({
    super.key,
    required this.bookingState,
    required this.onDateTimeSelected,
    required this.onBack,
    required this.onNext,
  });

  @override
  State<ChoosePickupTimeScreen> createState() => _ChoosePickupTimeScreenState();
}

class _ChoosePickupTimeScreenState extends State<ChoosePickupTimeScreen> {
  late String _selectedDate;
  late String _selectedTimeSlot;

  final List<Map<String, String>> _dates = const [
    {'day': 'Mon', 'date': '19', 'month': 'Oct'},
    {'day': 'Tue', 'date': '20', 'month': 'Oct'},
    {'day': 'Wed', 'date': '21', 'month': 'Oct'},
    {'day': 'Thu', 'date': '22', 'month': 'Oct'},
    {'day': 'Fri', 'date': '23', 'month': 'Oct'},
    {'day': 'Sat', 'date': '24', 'month': 'Oct'},
    {'day': 'Sun', 'date': '25', 'month': 'Oct'},
  ];

  final List<String> _timeSlots = const [
    '10:00 AM',
    '11:30 AM',
    '1:00 PM',
    '2:30 PM',
    '4:00 PM',
    '5:30 PM',
    '6:30 PM',
  ];

  @override
  void initState() {
    super.initState();
    _selectedDate = widget.bookingState.selectedDate ?? '19 Oct';
    _selectedTimeSlot = widget.bookingState.selectedTimeSlot ?? '10:00 AM';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // Stepper Header
            FixlyStepperHeader(
              stepText: '4/5',
              title: 'Choose Pickup Time',
              currentStep: 4,
              onBack: widget.onBack,
            ),

            // Scrollable Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Logistics Hero Card
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                RichText(
                                  text: const TextSpan(
                                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, height: 1.2),
                                    children: [
                                      TextSpan(text: "We'll ", style: TextStyle(color: Colors.white)),
                                      TextSpan(text: "pickup\n", style: TextStyle(color: AppColors.primaryRed)),
                                      TextSpan(text: "your device", style: TextStyle(color: Colors.white)),
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 4),
                                const Text(
                                  'Safe  |  Verified  |  Tracked',
                                  style: TextStyle(color: AppColors.textSecondary, fontSize: 11),
                                ),
                                const SizedBox(height: 12),
                                _buildBullet(Icons.verified_user_rounded, 'Verified pickup partner'),
                                const SizedBox(height: 4),
                                _buildBullet(Icons.map_rounded, 'Live tracking on app'),
                                const SizedBox(height: 4),
                                _buildBullet(Icons.bolt_rounded, 'Secure & insured handling'),
                              ],
                            ),
                          ),

                          // Scooter Rider Graphic
                          Container(
                            width: 110,
                            height: 100,
                            decoration: BoxDecoration(
                              color: AppColors.surfaceElevated,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: const Stack(
                              alignment: Alignment.center,
                              children: [
                                Icon(Icons.two_wheeler_rounded, color: Colors.white, size: 52),
                                Positioned(
                                  top: 10,
                                  right: 12,
                                  child: Icon(Icons.location_on_rounded, color: AppColors.primaryRed, size: 22),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Date Picker Section
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.calendar_today_rounded, color: Colors.white, size: 18),
                            SizedBox(width: 8),
                            Text('Select pickup date', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w700)),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.surface,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: AppColors.border),
                          ),
                          child: const Row(
                            children: [
                              Text('This Week', style: TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                              Icon(Icons.keyboard_arrow_down, color: AppColors.textSecondary, size: 16),
                            ],
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 12),

                    // 7-day horizontal list
                    SizedBox(
                      height: 82,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: _dates.length,
                        itemBuilder: (context, index) {
                          final item = _dates[index];
                          final dateKey = '${item['date']} ${item['month']}';
                          final isSelected = _selectedDate == dateKey;

                          return Container(
                            width: 58,
                            margin: const EdgeInsets.only(right: 8),
                            child: InkWell(
                              onTap: () {
                                setState(() => _selectedDate = dateKey);
                                widget.onDateTimeSelected(_selectedDate, _selectedTimeSlot);
                              },
                              borderRadius: BorderRadius.circular(14),
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 8),
                                decoration: BoxDecoration(
                                  color: AppColors.surface,
                                  borderRadius: BorderRadius.circular(14),
                                  border: Border.all(
                                    color: isSelected ? AppColors.primaryRed : AppColors.border,
                                    width: isSelected ? 2 : 1,
                                  ),
                                  boxShadow: isSelected
                                      ? [
                                          BoxShadow(
                                            color: AppColors.primaryRed.withOpacity(0.15),
                                            blurRadius: 8,
                                            offset: const Offset(0, 2),
                                          ),
                                        ]
                                      : null,
                                ),
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      item['day']!,
                                      style: TextStyle(
                                        color: isSelected ? AppColors.primaryRed : AppColors.textSecondary,
                                        fontSize: 11,
                                        fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      item['date']!,
                                      style: TextStyle(
                                        color: isSelected ? AppColors.primaryRed : Colors.white,
                                        fontSize: 16,
                                        fontWeight: FontWeight.w800,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      item['month']!,
                                      style: TextStyle(
                                        color: isSelected ? AppColors.primaryRed : AppColors.textSecondary,
                                        fontSize: 10,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Time Slot Section
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.access_time_rounded, color: Colors.white, size: 18),
                            SizedBox(width: 8),
                            Text('Select pickup time', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w700)),
                          ],
                        ),
                        Row(
                          children: [
                            Icon(Icons.info_outline_rounded, color: AppColors.textSecondary, size: 14),
                            SizedBox(width: 4),
                            Text('Repair in 60 mins', style: TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                          ],
                        ),
                      ],
                    ),

                    const SizedBox(height: 12),

                    // Time slots grid
                    GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 3,
                        mainAxisSpacing: 10,
                        crossAxisSpacing: 10,
                        childAspectRatio: 2.2,
                      ),
                      itemCount: _timeSlots.length,
                      itemBuilder: (context, index) {
                        final slot = _timeSlots[index];
                        final isSelected = _selectedTimeSlot == slot;

                        return InkWell(
                          onTap: () {
                            setState(() => _selectedTimeSlot = slot);
                            widget.onDateTimeSelected(_selectedDate, _selectedTimeSlot);
                          },
                          borderRadius: BorderRadius.circular(12),
                          child: Container(
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: AppColors.surface,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: isSelected ? AppColors.primaryRed : AppColors.border,
                                width: isSelected ? 2 : 1,
                              ),
                            ),
                            child: Text(
                              slot,
                              style: TextStyle(
                                color: isSelected ? AppColors.primaryRed : Colors.white,
                                fontSize: 13,
                                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                              ),
                            ),
                          ),
                        );
                      },
                    ),

                    const SizedBox(height: 20),

                    // Address Card
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              color: AppColors.surfaceElevated,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.location_on_rounded, color: AppColors.primaryRed, size: 24),
                          ),
                          const SizedBox(width: 14),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Pickup Address', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 14)),
                                SizedBox(height: 2),
                                Text("We'll pickup from your location", style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                                Text('Exact address will be confirmed after order', style: TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                              ],
                            ),
                          ),
                          const Row(
                            children: [
                              Text('Change', style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                              Icon(Icons.chevron_right, color: AppColors.textSecondary, size: 16),
                            ],
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Continue Button
                    FixlyCrimsonButton(
                      label: 'Continue',
                      onTap: widget.onNext,
                    ),

                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBullet(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, color: Colors.white70, size: 13),
        const SizedBox(width: 6),
        Text(text, style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.w500)),
      ],
    );
  }
}
