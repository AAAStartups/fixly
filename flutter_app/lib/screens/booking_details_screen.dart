import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../widgets/custom_widgets.dart';
import '../services/api_service.dart';

class BookingDetailsScreen extends StatelessWidget {
  final BookingState bookingState;
  final VoidCallback onBack;
  final VoidCallback onConfirmBooking;
  final Function(int step) onJumpToStep;

  const BookingDetailsScreen({
    super.key,
    required this.bookingState,
    required this.onBack,
    required this.onConfirmBooking,
    required this.onJumpToStep,
  });

  @override
  Widget build(BuildContext context) {
    final brand = bookingState.selectedBrand;
    final model = bookingState.selectedModel;
    final service = bookingState.selectedService;
    final total = bookingState.totalAmount > 79
        ? bookingState.totalAmount.toInt()
        : 5073;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // Stepper Header
            FixlyStepperHeader(
              stepText: '5/5',
              title: 'Booking Details',
              currentStep: 5,
              onBack: onBack,
            ),

            // Scrollable Summary
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  children: [
                    // 1. Brand Card
                    _buildRowCard(
                      leading: Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: const Color(0xFFFF6900),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        alignment: Alignment.center,
                        child: const Text('mi', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                      ),
                      label: 'Brand',
                      value: brand?.name ?? 'Xiaomi',
                      onChange: () => onJumpToStep(1),
                    ),

                    // 2. Model Card
                    _buildRowCard(
                      leading: Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.phone_android_rounded, color: Colors.black87, size: 22),
                      ),
                      label: 'Model',
                      value: model?.name ?? 'Xiaomi 11T Pro 5G',
                      onChange: () => onJumpToStep(2),
                    ),

                    // 3. Issue Card
                    _buildRowCard(
                      leading: Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: AppColors.surfaceElevated,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.broken_image_rounded, color: Colors.white, size: 20),
                      ),
                      label: 'Issue',
                      value: service?.title ?? 'Display Service',
                      hasLiveBadge: true,
                      onChange: () => onJumpToStep(3),
                    ),

                    // 4. Warranty Card
                    _buildRowCard(
                      leading: Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: AppColors.surfaceElevated,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.shield_outlined, color: Colors.white, size: 20),
                      ),
                      label: 'Warranty',
                      value: service?.warrantyText ?? '6 months',
                      onChange: null,
                    ),

                    // 5. Pickup Time Card
                    _buildRowCard(
                      leading: Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: AppColors.surfaceElevated,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.calendar_month_outlined, color: Colors.white, size: 20),
                      ),
                      label: 'Pickup Time',
                      value: '${bookingState.selectedTimeSlot ?? '10:00 AM'}, ${bookingState.selectedDate ?? '19 Oct'}',
                      onChange: () => onJumpToStep(4),
                    ),

                    // 6. Pickup Location Card
                    _buildRowCard(
                      leading: Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: AppColors.surfaceElevated,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.location_on_rounded, color: AppColors.primaryRed, size: 20),
                      ),
                      label: 'Pickup Location',
                      value: 'Home',
                      onChange: () => onJumpToStep(4),
                    ),

                    // 7. Total Amount & Payment Terms Card
                    Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              color: AppColors.surfaceElevated,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Icon(Icons.receipt_long_rounded, color: Colors.white, size: 20),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Total Amount', style: TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                                const SizedBox(height: 2),
                                Text(
                                  '₹$total',
                                  style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w800),
                                ),
                                const SizedBox(height: 2),
                                const Text(
                                  'Pay after the repair is done',
                                  style: TextStyle(color: AppColors.textSecondary, fontSize: 11),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: AppColors.border),
                            ),
                            child: const Row(
                              children: [
                                Text('View Details', style: TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                                SizedBox(width: 2),
                                Icon(Icons.chevron_right, color: AppColors.textSecondary, size: 14),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    // 8. Trust Banner
                    Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.verified_user_rounded, color: Colors.white70, size: 20),
                          SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Safe & Secure Service', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w700)),
                                SizedBox(height: 1),
                                Text(
                                  'Verified pickup partner  ·  Live tracking  ·  Original parts',
                                  style: TextStyle(color: AppColors.textSecondary, fontSize: 10),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Confirm Booking CTA
                    FixlyCrimsonButton(
                      label: 'Confirm Booking',
                      onTap: () {
                        ApiService().createBooking(bookingState);
                        onConfirmBooking();
                      },
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

  Widget _buildRowCard({
    required Widget leading,
    required String label,
    required String value,
    bool hasLiveBadge = false,
    VoidCallback? onChange,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          leading,
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                const SizedBox(height: 2),
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        value,
                        style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w700),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (hasLiveBadge) ...[
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.primaryRed,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: const Text('PRO', style: TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.w900)),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),
          if (onChange != null)
            InkWell(
              onTap: onChange,
              child: const Row(
                children: [
                  Text('Change', style: TextStyle(color: AppColors.textSecondary, fontSize: 12, fontWeight: FontWeight.w500)),
                  SizedBox(width: 2),
                  Icon(Icons.chevron_right, color: AppColors.textSecondary, size: 16),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
