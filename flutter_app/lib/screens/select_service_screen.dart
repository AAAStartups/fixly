import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../widgets/custom_widgets.dart';

class SelectServiceScreen extends StatefulWidget {
  final BookingState bookingState;
  final Function(RepairService) onServiceSelected;
  final VoidCallback onBack;
  final VoidCallback onChangeModel;
  final VoidCallback onNext;

  const SelectServiceScreen({
    super.key,
    required this.bookingState,
    required this.onServiceSelected,
    required this.onBack,
    required this.onChangeModel,
    required this.onNext,
  });

  @override
  State<SelectServiceScreen> createState() => _SelectServiceScreenState();
}

class _SelectServiceScreenState extends State<SelectServiceScreen> {
  final List<RepairService> _services = const [
    RepairService(
      id: 'display',
      title: 'Display',
      subtitle: 'Screen replacement (OEM)',
      price: 4299,
      warrantyText: '6 months warranty',
    ),
    RepairService(
      id: 'battery',
      title: 'Battery',
      subtitle: 'Battery replacement (OEM)',
      price: 2249,
      warrantyText: '6 months warranty',
    ),
    RepairService(
      id: 'charging-port',
      title: 'Charging Port',
      subtitle: 'Charging issue / port replacement',
      price: 1299,
      warrantyText: '6 months warranty',
    ),
    RepairService(
      id: 'camera',
      title: 'Camera',
      subtitle: 'Front / Back camera replacement',
      price: 2999,
      warrantyText: '6 months warranty',
    ),
    RepairService(
      id: 'speaker',
      title: 'Speaker',
      subtitle: 'Sound issue / speaker replacement',
      price: 1499,
      warrantyText: '6 months warranty',
    ),
    RepairService(
      id: 'water-damage',
      title: 'Water Damage',
      subtitle: 'Diagnosis & repair',
      price: 1999,
      warrantyText: '6 months warranty',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final selectedModel = widget.bookingState.selectedModel;
    final selectedService = widget.bookingState.selectedService ?? _services.first;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // Stepper Header
            FixlyStepperHeader(
              stepText: '3/5',
              title: 'Select Service',
              currentStep: 3,
              onBack: widget.onBack,
            ),

            // Main scrollable content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Selected Device Card
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 50,
                            height: 50,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Icon(Icons.phone_android_rounded, color: Colors.black87, size: 28),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  selectedModel?.name ?? 'Xiaomi 11T Pro 5G',
                                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 16),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  '${selectedModel?.year ?? '2021'} | ${selectedModel?.network ?? '5G'}',
                                  style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                                ),
                              ],
                            ),
                          ),
                          InkWell(
                            onTap: widget.onChangeModel,
                            child: const Row(
                              children: [
                                Text('Change', style: TextStyle(color: AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.w500)),
                                SizedBox(width: 2),
                                Icon(Icons.chevron_right, color: AppColors.textSecondary, size: 16),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 18),

                    // Section Heading
                    const Text(
                      'Repair Services',
                      style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w800),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Choose the issue you want to get repaired',
                      style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
                    ),

                    const SizedBox(height: 14),

                    // Trust Badges Row
                    Row(
                      children: [
                        _buildTrustChip(icon: Icons.timer_outlined, label: '60 min repair'),
                        const SizedBox(width: 8),
                        _buildTrustChip(
                          icon: Icons.electric_bolt_rounded,
                          iconColor: AppColors.primaryRed,
                          label: 'Doorstep ₹79',
                        ),
                        const SizedBox(width: 8),
                        _buildTrustChip(icon: Icons.shield_outlined, label: '6-month warranty'),
                      ],
                    ),

                    const SizedBox(height: 18),

                    // Service Cards List
                    ..._services.map((service) {
                      final isSelected = selectedService.id == service.id;
                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        child: InkWell(
                          onTap: () => widget.onServiceSelected(service),
                          borderRadius: BorderRadius.circular(16),
                          child: Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: AppColors.surface,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: isSelected ? AppColors.primaryRed : AppColors.border,
                                width: isSelected ? 2 : 1,
                              ),
                              boxShadow: isSelected
                                  ? [
                                      BoxShadow(
                                        color: AppColors.primaryRed.withOpacity(0.12),
                                        blurRadius: 10,
                                        offset: const Offset(0, 2),
                                      ),
                                    ]
                                  : null,
                            ),
                            child: Row(
                              children: [
                                // Service Icon
                                Container(
                                  width: 44,
                                  height: 44,
                                  decoration: BoxDecoration(
                                    color: AppColors.surfaceElevated,
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Icon(_getServiceIcon(service.id), color: Colors.white, size: 22),
                                ),
                                const SizedBox(width: 14),

                                // Content
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: AppColors.primaryRed,
                                              borderRadius: BorderRadius.circular(4),
                                            ),
                                            child: const Text(
                                              'PRO',
                                              style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.w900),
                                            ),
                                          ),
                                          const SizedBox(width: 6),
                                          Text(
                                            service.title,
                                            style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w700),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 3),
                                      Text(
                                        service.subtitle,
                                        style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                                      ),
                                      const SizedBox(height: 4),
                                      Row(
                                        children: [
                                          const Icon(Icons.verified_user_outlined, color: Colors.white70, size: 12),
                                          const SizedBox(width: 4),
                                          Text(
                                            service.warrantyText,
                                            style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.w500),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),

                                // Price & Action
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.end,
                                  children: [
                                    Text(
                                      '₹${service.price}',
                                      style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w800),
                                    ),
                                    const SizedBox(height: 8),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                      decoration: BoxDecoration(
                                        color: isSelected ? AppColors.primaryRed : Colors.transparent,
                                        borderRadius: BorderRadius.circular(20),
                                        border: Border.all(
                                          color: isSelected ? AppColors.primaryRed : AppColors.border,
                                        ),
                                      ),
                                      child: Text(
                                        isSelected ? 'Selected' : 'Select',
                                        style: TextStyle(
                                          color: isSelected ? Colors.white : AppColors.textSecondary,
                                          fontSize: 12,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    }),

                    const SizedBox(height: 10),
                  ],
                ),
              ),
            ),

            // Sticky Bottom Cart
            FixlyStickyCart(
              line1: '+ ${selectedModel?.name ?? 'Xiaomi 11T Pro 5G'}',
              line2: '+ ${selectedService.title} (₹${selectedService.price})',
              buttonLabel: 'Select Pickup',
              onAction: widget.onNext,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTrustChip({required IconData icon, Color? iconColor, required String label}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: iconColor ?? AppColors.textSecondary, size: 12),
          const SizedBox(width: 5),
          Text(label, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }

  IconData _getServiceIcon(String id) {
    switch (id) {
      case 'display':
        return Icons.phone_android_rounded;
      case 'battery':
        return Icons.battery_charging_full_rounded;
      case 'charging-port':
        return Icons.power_rounded;
      case 'camera':
        return Icons.camera_alt_rounded;
      case 'speaker':
        return Icons.volume_up_rounded;
      case 'water-damage':
        return Icons.water_drop_rounded;
      default:
        return Icons.build_rounded;
    }
  }
}
