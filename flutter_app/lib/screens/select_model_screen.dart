import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../widgets/custom_widgets.dart';

class SelectModelScreen extends StatefulWidget {
  final BookingState bookingState;
  final Function(DeviceModel) onModelSelected;
  final VoidCallback onBack;
  final VoidCallback onChangeBrand;
  final VoidCallback onNext;

  const SelectModelScreen({
    super.key,
    required this.bookingState,
    required this.onModelSelected,
    required this.onBack,
    required this.onChangeBrand,
    required this.onNext,
  });

  @override
  State<SelectModelScreen> createState() => _SelectModelScreenState();
}

class _SelectModelScreenState extends State<SelectModelScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  final List<DeviceModel> _models = const [
    DeviceModel(
      id: 'xm-11i',
      brandId: 'xiaomi',
      name: 'Xiaomi 11i 5G',
      year: '2022',
      network: '5G',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=150',
    ),
    DeviceModel(
      id: 'xm-11i-hc',
      brandId: 'xiaomi',
      name: 'Xiaomi 11i HyperCharge',
      year: '2022',
      network: '5G',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=150',
    ),
    DeviceModel(
      id: 'xm-11-lite',
      brandId: 'xiaomi',
      name: 'Xiaomi 11 Lite NE 5G',
      year: '2021',
      network: '5G',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=150',
    ),
    DeviceModel(
      id: 'xm-11t-pro',
      brandId: 'xiaomi',
      name: 'Xiaomi 11T Pro 5G',
      year: '2021',
      network: '5G',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=150',
    ),
    DeviceModel(
      id: 'xm-12-pro',
      brandId: 'xiaomi',
      name: 'Xiaomi 12 Series 12 Pro 5G',
      year: '2022',
      network: '5G',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=150',
    ),
    DeviceModel(
      id: 'xm-7a',
      brandId: 'xiaomi',
      name: 'Xiaomi 7A',
      year: '2019',
      network: '4G',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=150',
    ),
    DeviceModel(
      id: 'xm-8',
      brandId: 'xiaomi',
      name: 'Xiaomi 8',
      year: '2018',
      network: '4G',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=150',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final selectedBrand = widget.bookingState.selectedBrand;
    final selectedModel = widget.bookingState.selectedModel ?? _models[3]; // default 11T Pro 5G

    final filteredModels = _models
        .where((m) => m.name.toLowerCase().contains(_searchQuery.toLowerCase()))
        .toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // Stepper Header
            FixlyStepperHeader(
              stepText: '2/5',
              title: 'Select Model',
              currentStep: 2,
              onBack: widget.onBack,
            ),

            // Search Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Container(
                height: 48,
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.border),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 14),
                child: Row(
                  children: [
                    const Icon(Icons.search, color: AppColors.textSecondary, size: 20),
                    const SizedBox(width: 10),
                    Expanded(
                      child: TextField(
                        controller: _searchController,
                        onChanged: (val) => setState(() => _searchQuery = val),
                        style: const TextStyle(color: Colors.white, fontSize: 14),
                        decoration: const InputDecoration(
                          hintText: 'Search for model (eg. Xiaomi 11)',
                          hintStyle: TextStyle(color: AppColors.textSecondary, fontSize: 14),
                          border: InputBorder.none,
                          isDense: true,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Selected Brand Banner
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          color: const Color(0xFFFF6900),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        alignment: Alignment.center,
                        child: const Text('mi', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                      ),
                      const SizedBox(width: 10),
                      Text(
                        selectedBrand?.name ?? 'Xiaomi',
                        style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w700),
                      ),
                    ],
                  ),
                  InkWell(
                    onTap: widget.onChangeBrand,
                    child: const Row(
                      children: [
                        Text('Change Brand', style: TextStyle(color: AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.w500)),
                        SizedBox(width: 2),
                        Icon(Icons.chevron_right, color: AppColors.textSecondary, size: 16),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Model List
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                itemCount: filteredModels.length,
                itemBuilder: (context, index) {
                  final model = filteredModels[index];
                  final isSelected = selectedModel.id == model.id;

                  return Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    child: InkWell(
                      onTap: () => widget.onModelSelected(model),
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        padding: const EdgeInsets.all(12),
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
                            // Thumbnail
                            Container(
                              width: 50,
                              height: 50,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Icon(Icons.phone_android_rounded, color: Colors.black87, size: 30),
                            ),
                            const SizedBox(width: 14),

                            // Name & Metadata
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    model.name,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 15,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    '${model.year}  |  ${model.network}',
                                    style: const TextStyle(
                                      color: AppColors.textSecondary,
                                      fontSize: 12,
                                    ),
                                  ),
                                ],
                              ),
                            ),

                            // Chevron
                            Icon(
                              Icons.chevron_right,
                              color: isSelected ? AppColors.primaryRed : AppColors.textSecondary,
                              size: 22,
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            // Sticky Bottom Cart
            FixlyStickyCart(
              line1: '+ ${selectedModel.name}',
              line2: '+ Free Workshop Diagnosis',
              buttonLabel: 'Select Service',
              onAction: widget.onNext,
            ),
          ],
        ),
      ),
    );
  }
}
