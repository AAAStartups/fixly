import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
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
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 8),

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
                                  text: TextSpan(
                                    style: GoogleFonts.outfit(
                                      fontSize: 20,
                                      fontWeight: FontWeight.w800,
                                      height: 1.2,
                                    ),
                                    children: const [
                                      TextSpan(text: "We'll ", style: TextStyle(color: Colors.white)),
                                      TextSpan(text: "pickup\n", style: TextStyle(color: AppColors.primaryRed)),
                                      TextSpan(text: "your device", style: TextStyle(color: Colors.white)),
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Safe  |  Verified  |  Tracked',
                                  style: GoogleFonts.plusJakartaSans(color: AppColors.textSecondary, fontSize: 11),
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

                          // Scooter Rider Graphic Container
                          Container(
                            width: 100,
                            height: 100,
                            decoration: BoxDecoration(
                              color: AppColors.surfaceElevated,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: AppColors.borderSubtle),
                            ),
                            child: const Stack(
                              alignment: Alignment.center,
                              children: [
                                Icon(Icons.two_wheeler_rounded, color: Colors.white, size: 48),
                                Positioned(
                                  top: 12,
                                  right: 12,
                                  child: Icon(Icons.location_on_rounded, color: AppColors.primaryRed, size: 20),
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
                        Row(
                          children: [
                            const Icon(Icons.calendar_today_rounded, color: Colors.white, size: 17),
                            const SizedBox(width: 8),
                            Text(
                              'Select pickup date',
                              style: GoogleFonts.outfit(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.surface,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: AppColors.border),
                          ),
                          child: Row(
                            children: [
                              Text(
                                'This Week',
                                style: GoogleFonts.plusJakartaSans(color: AppColors.textSecondary, fontSize: 11),
                              ),
                              const SizedBox(width: 2),
                              const Icon(Icons.keyboard_arrow_down, color: AppColors.textSecondary, size: 16),
                            ],
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 12),

                    // 7-day horizontal list
                    SizedBox(
                      height: 84,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        physics: const BouncingScrollPhysics(),
                        itemCount: _dates.length,
                        itemBuilder: (context, index) {
                          final item = _dates[index];
                          final dateKey = '${item['date']} ${item['month']}';
                          final isSelected = _selectedDate == dateKey;

                          return Container(
                            width: 58,
                            margin: const EdgeInsets.only(right: 8),
                            child: Material(
                              color: Colors.transparent,
                              child: InkWell(
                                onTap: () {
                                  setState(() => _selectedDate = dateKey);
                                  widget.onDateTimeSelected(_selectedDate, _selectedTimeSlot);
                                },
                                borderRadius: BorderRadius.circular(14),
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 200),
                                  padding: const EdgeInsets.symmetric(vertical: 8),
                                  decoration: BoxDecoration(
                                    color: isSelected ? AppColors.surfaceHighlight : AppColors.surface,
                                    borderRadius: BorderRadius.circular(14),
                                    border: Border.all(
                                      color: isSelected ? AppColors.primaryRed : AppColors.border,
                                      width: isSelected ? 1.5 : 1,
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
                                        style: GoogleFonts.plusJakartaSans(
                                          color: isSelected ? AppColors.primaryRed : AppColors.textSecondary,
                                          fontSize: 11,
                                          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        item['date']!,
                                        style: GoogleFonts.outfit(
                                          color: isSelected ? AppColors.primaryRed : Colors.white,
                                          fontSize: 17,
                                          fontWeight: FontWeight.w800,
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        item['month']!,
                                        style: GoogleFonts.plusJakartaSans(
                                          color: isSelected ? AppColors.primaryRed : AppColors.textSecondary,
                                          fontSize: 10,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Time Slot Section
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.access_time_rounded, color: Colors.white, size: 17),
                            const SizedBox(width: 8),
                            Text(
                              'Select pickup time',
                              style: GoogleFonts.outfit(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                        Row(
                          children: [
                            const Icon(Icons.bolt_rounded, color: AppColors.primaryRed, size: 14),
                            const SizedBox(width: 4),
                            Text(
                              'Repair in 60 mins',
                              style: GoogleFonts.plusJakartaSans(color: AppColors.textSecondary, fontSize: 11),
                            ),
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

                        return Material(
                          color: Colors.transparent,
                          child: InkWell(
                            onTap: () {
                              setState(() => _selectedTimeSlot = slot);
                              widget.onDateTimeSelected(_selectedDate, _selectedTimeSlot);
                            },
                            borderRadius: BorderRadius.circular(12),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              alignment: Alignment.center,
                              decoration: BoxDecoration(
                                color: isSelected ? AppColors.surfaceHighlight : AppColors.surface,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: isSelected ? AppColors.primaryRed : AppColors.border,
                                  width: isSelected ? 1.5 : 1,
                                ),
                                boxShadow: isSelected
                                    ? [
                                        BoxShadow(
                                          color: AppColors.primaryRed.withOpacity(0.12),
                                          blurRadius: 6,
                                          offset: const Offset(0, 2),
                                        ),
                                      ]
                                    : null,
                              ),
                              child: Text(
                                slot,
                                style: GoogleFonts.plusJakartaSans(
                                  color: isSelected ? AppColors.primaryRed : Colors.white,
                                  fontSize: 13,
                                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                                ),
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
                              border: Border.all(color: AppColors.borderSubtle),
                            ),
                            child: const Icon(Icons.location_on_rounded, color: AppColors.primaryRed, size: 22),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Pickup Address',
                                  style: GoogleFonts.plusJakartaSans(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w700,
                                    fontSize: 14,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  "We'll pickup from your location",
                                  style: GoogleFonts.plusJakartaSans(color: AppColors.textSecondary, fontSize: 12),
                                ),
                                Text(
                                  'Exact address will be confirmed after order',
                                  style: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontSize: 11),
                                ),
                              ],
                            ),
                          ),
                          Row(
                            children: [
                              Text(
                                'Change',
                                style: GoogleFonts.plusJakartaSans(color: AppColors.textSecondary, fontSize: 12),
                              ),
                              const Icon(Icons.chevron_right, color: AppColors.textSecondary, size: 16),
                            ],
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

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
        Icon(icon, color: AppColors.primaryRed, size: 13),
        const SizedBox(width: 6),
        Text(
          text,
          style: GoogleFonts.plusJakartaSans(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.w500),
        ),
      ],
    );
  }
}
