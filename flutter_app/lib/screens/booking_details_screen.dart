import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
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
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  children: [
                    const SizedBox(height: 8),

                    // 1. Brand Card
                    _buildRowCard(
                      leading: Container(
                        width: 38,
                        height: 38,
                        decoration: BoxDecoration(
                          color: const Color(0xFFFF6900),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          brand?.logoText ?? 'mi',
                          style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                      ),
                      label: 'Brand',
                      value: brand?.name ?? 'Xiaomi',
                      onChange: () => onJumpToStep(1),
                    ),

                    // 2. Model Card
                    _buildRowCard(
                      leading: Container(
                        width: 38,
                        height: 38,
                        decoration: BoxDecoration(
                          color: AppColors.surfaceElevated,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppColors.borderSubtle),
                        ),
                        child: const Icon(Icons.phone_android_rounded, color: Colors.white, size: 20),
                      ),
                      label: 'Model',
                      value: model?.name ?? 'Xiaomi 11T Pro 5G',
                      onChange: () => onJumpToStep(2),
                    ),

                    // 3. Issue Card
                    _buildRowCard(
                      leading: Container(
                        width: 38,
                        height: 38,
                        decoration: BoxDecoration(
                          color: AppColors.surfaceElevated,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppColors.borderSubtle),
                        ),
                        child: const Icon(Icons.broken_image_rounded, color: AppColors.primaryRed, size: 20),
                      ),
                      label: 'Issue',
                      value: service?.title ?? 'Display Service',
                      hasLiveBadge: true,
                      onChange: () => onJumpToStep(3),
                    ),

                    // 4. Warranty Card
                    _buildRowCard(
                      leading: Container(
                        width: 38,
                        height: 38,
                        decoration: BoxDecoration(
                          color: AppColors.surfaceElevated,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppColors.borderSubtle),
                        ),
                        child: const Icon(Icons.shield_outlined, color: Colors.white, size: 20),
                      ),
                      label: 'Warranty',
                      value: service?.warrantyText ?? '6 months warranty',
                      onChange: null,
                    ),

                    // 5. Pickup Time Card
                    _buildRowCard(
                      leading: Container(
                        width: 38,
                        height: 38,
                        decoration: BoxDecoration(
                          color: AppColors.surfaceElevated,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppColors.borderSubtle),
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
                        width: 38,
                        height: 38,
                        decoration: BoxDecoration(
                          color: AppColors.surfaceElevated,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppColors.borderSubtle),
                        ),
                        child: const Icon(Icons.location_on_rounded, color: AppColors.primaryRed, size: 20),
                      ),
                      label: 'Pickup Location',
                      value: 'Doorstep Pickup (Home)',
                      onChange: () => onJumpToStep(4),
                    ),

                    // 7. Total Amount & Payment Terms Card
                    Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              Container(
                                width: 38,
                                height: 38,
                                decoration: BoxDecoration(
                                  color: AppColors.redSubtle,
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(color: AppColors.primaryRed.withOpacity(0.3)),
                                ),
                                child: const Icon(Icons.receipt_long_rounded, color: AppColors.primaryRed, size: 20),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Total Amount',
                                      style: GoogleFonts.plusJakartaSans(color: AppColors.textSecondary, fontSize: 11),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      '₹$total',
                                      style: GoogleFonts.outfit(
                                        color: Colors.white,
                                        fontSize: 22,
                                        fontWeight: FontWeight.w800,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      'Pay after the repair is done',
                                      style: GoogleFonts.plusJakartaSans(color: AppColors.primaryRed, fontSize: 11, fontWeight: FontWeight.w600),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                decoration: BoxDecoration(
                                  color: AppColors.surfaceElevated,
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: AppColors.borderSubtle),
                                ),
                                child: Row(
                                  children: [
                                    Text(
                                      'COD / UPI',
                                      style: GoogleFonts.plusJakartaSans(
                                        color: AppColors.textSecondary,
                                        fontSize: 11,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          const Divider(color: AppColors.borderSubtle),
                          const SizedBox(height: 10),
                          _buildPriceLine('Estimated Repair Fee', '₹${service?.price ?? 4299}'),
                          const SizedBox(height: 6),
                          _buildPriceLine('Doorstep Pickup & Return', 'FREE', isHighlight: true),
                          const SizedBox(height: 6),
                          _buildPriceLine('Diagnostic & Safety Sanitization', '₹79'),
                        ],
                      ),
                    ),

                    // 8. Trust Banner
                    Container(
                      margin: const EdgeInsets.only(bottom: 20),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.verified_user_rounded, color: AppColors.primaryRed, size: 20),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Safe & Secure Service',
                                  style: GoogleFonts.outfit(
                                    color: Colors.white,
                                    fontSize: 13,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                                const SizedBox(height: 1),
                                Text(
                                  'Verified pickup partner  ·  Live tracking  ·  Original parts',
                                  style: GoogleFonts.plusJakartaSans(color: AppColors.textSecondary, fontSize: 10),
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

  Widget _buildPriceLine(String label, String value, {bool isHighlight = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: GoogleFonts.plusJakartaSans(color: AppColors.textSecondary, fontSize: 12),
        ),
        Text(
          value,
          style: GoogleFonts.plusJakartaSans(
            color: isHighlight ? AppColors.primaryRed : Colors.white,
            fontSize: 12,
            fontWeight: FontWeight.w700,
          ),
        ),
      ],
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
                Text(
                  label,
                  style: GoogleFonts.plusJakartaSans(color: AppColors.textSecondary, fontSize: 11),
                ),
                const SizedBox(height: 2),
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        value,
                        style: GoogleFonts.plusJakartaSans(
                          color: Colors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (hasLiveBadge) ...[
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                        decoration: BoxDecoration(
                          color: AppColors.primaryRed,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          'PRO',
                          style: GoogleFonts.plusJakartaSans(
                            color: Colors.white,
                            fontSize: 8,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),
          if (onChange != null)
            Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: onChange,
                borderRadius: BorderRadius.circular(8),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                  child: Row(
                    children: [
                      Text(
                        'Change',
                        style: GoogleFonts.plusJakartaSans(
                          color: AppColors.primaryRed,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(width: 2),
                      const Icon(Icons.chevron_right, color: AppColors.primaryRed, size: 16),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
