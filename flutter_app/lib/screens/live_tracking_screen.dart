import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../widgets/custom_widgets.dart';

class LiveTrackingScreen extends StatelessWidget {
  final BookingState bookingState;
  final VoidCallback onReturnHome;

  const LiveTrackingScreen({
    super.key,
    required this.bookingState,
    required this.onReturnHome,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // Top Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  InkWell(
                    onTap: onReturnHome,
                    borderRadius: BorderRadius.circular(24),
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: const BoxDecoration(
                        color: AppColors.surfaceElevated,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.arrow_back, color: Colors.white, size: 20),
                    ),
                  ),
                  const Text(
                    'Order #QF-2026-89421',
                    style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w700),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.primaryRed.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.primaryRed.withOpacity(0.4)),
                    ),
                    child: const Text('ACTIVE', style: TextStyle(color: AppColors.primaryRed, fontSize: 11, fontWeight: FontWeight.w800)),
                  ),
                ],
              ),
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Live Status Header Banner
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: AppColors.primaryRed,
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: const Icon(Icons.local_shipping_rounded, color: Colors.white, size: 26),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Pickup Scheduled',
                                  style: TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.w800),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Rider will arrive at ${bookingState.selectedTimeSlot ?? '10:00 AM'}, ${bookingState.selectedDate ?? '19 Oct'}',
                                  style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    const Text(
                      'Repair Journey Timeline',
                      style: TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.w800),
                    ),
                    const SizedBox(height: 14),

                    // 5-Stage Stepper
                    _buildTimelineStep(
                      stepNum: '1',
                      title: 'Pickup Scheduled',
                      time: '10:00 AM, 19 Oct',
                      desc: 'Assigned rider: Rajesh K. (Verified Partner)',
                      isCompleted: true,
                      isCurrent: true,
                    ),
                    _buildTimelineStep(
                      stepNum: '2',
                      title: 'Device Received at Workshop',
                      time: 'Expected ~11:30 AM',
                      desc: 'Check-in & physical condition scan',
                      isCompleted: false,
                    ),
                    _buildTimelineStep(
                      stepNum: '3',
                      title: 'Free Workshop Diagnosis Completed',
                      time: 'Expected ~12:15 PM',
                      desc: 'Itemized quotation sent to your app',
                      isCompleted: false,
                    ),
                    _buildTimelineStep(
                      stepNum: '4',
                      title: 'Repair in Progress',
                      time: 'Expected ~1:00 PM',
                      desc: 'Watch repair live on the Live stream tab',
                      isCompleted: false,
                    ),
                    _buildTimelineStep(
                      stepNum: '5',
                      title: 'Quality Check & Safe Delivery',
                      time: 'Expected ~2:30 PM',
                      desc: '30-day warranty card & digital invoice issued',
                      isCompleted: false,
                      isLast: true,
                    ),

                    const SizedBox(height: 20),

                    // Back to Home
                    FixlyCrimsonButton(
                      label: 'Back to Home',
                      onTap: onReturnHome,
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

  Widget _buildTimelineStep({
    required String stepNum,
    required String title,
    required String time,
    required String desc,
    required bool isCompleted,
    bool isCurrent = false,
    bool isLast = false,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                color: isCurrent || isCompleted ? AppColors.primaryRed : AppColors.surfaceElevated,
                shape: BoxShape.circle,
                border: Border.all(
                  color: isCurrent ? AppColors.primaryRed : AppColors.border,
                  width: 2,
                ),
              ),
              alignment: Alignment.center,
              child: isCompleted
                  ? const Icon(Icons.check, color: Colors.white, size: 16)
                  : Text(stepNum, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
            ),
            if (!isLast)
              Container(
                width: 2,
                height: 48,
                color: isCompleted ? AppColors.primaryRed : AppColors.border,
              ),
          ],
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 14)),
              const SizedBox(height: 1),
              Text(time, style: const TextStyle(color: AppColors.primaryRed, fontSize: 11, fontWeight: FontWeight.w600)),
              const SizedBox(height: 2),
              Text(desc, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
              const SizedBox(height: 14),
            ],
          ),
        ),
      ],
    );
  }
}
