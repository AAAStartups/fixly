import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../widgets/custom_widgets.dart';

class SelectBrandScreen extends StatefulWidget {
  final BookingState bookingState;
  final Function(DeviceBrand) onBrandSelected;
  final VoidCallback onBack;
  final VoidCallback onNext;

  const SelectBrandScreen({
    super.key,
    required this.bookingState,
    required this.onBrandSelected,
    required this.onBack,
    required this.onNext,
  });

  @override
  State<SelectBrandScreen> createState() => _SelectBrandScreenState();
}

class _SelectBrandScreenState extends State<SelectBrandScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  final List<DeviceBrand> _brands = const [
    DeviceBrand(id: 'apple', name: 'Apple', logoText: ''),
    DeviceBrand(id: 'samsung', name: 'Samsung', logoText: 'SAMSUNG'),
    DeviceBrand(id: 'oneplus', name: 'OnePlus', logoText: '1+'),
    DeviceBrand(id: 'google', name: 'Google', logoText: 'G'),
    DeviceBrand(id: 'xiaomi', name: 'Xiaomi', logoText: 'mi'),
    DeviceBrand(id: 'vivo', name: 'Vivo', logoText: 'vivo'),
    DeviceBrand(id: 'motorola', name: 'Motorola', logoText: 'M'),
    DeviceBrand(id: 'realme', name: 'Realme', logoText: 'realme'),
    DeviceBrand(id: 'oppo', name: 'OPPO', logoText: 'oppo'),
    DeviceBrand(id: 'poco', name: 'POCO', logoText: 'POCO'),
    DeviceBrand(id: 'iqoo', name: 'iQOO', logoText: 'iQOO'),
    DeviceBrand(id: 'huawei', name: 'Huawei', logoText: 'HUAWEI'),
  ];

  @override
  Widget build(BuildContext context) {
    final filteredBrands = _brands
        .where((b) => b.name.toLowerCase().contains(_searchQuery.toLowerCase()))
        .toList();

    final selectedBrand = widget.bookingState.selectedBrand ?? _brands[4]; // default Xiaomi

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // Stepper Header
            FixlyStepperHeader(
              stepText: '1/5',
              title: 'Select Brand',
              currentStep: 1,
              onBack: widget.onBack,
            ),

            // Search Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
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
                          hintText: 'Search for model (eg. iPhone 14)',
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

            // 3x4 Brand Grid
            Expanded(
              child: GridView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                gridDelegate: const RadialGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  mainAxisSpacing: 12,
                  crossAxisSpacing: 12,
                  childAspectRatio: 1.15,
                ),
                itemCount: filteredBrands.length,
                itemBuilder: (context, index) {
                  final brand = filteredBrands[index];
                  final isSelected = selectedBrand.id == brand.id;

                  return InkWell(
                    onTap: () {
                      widget.onBrandSelected(brand);
                    },
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
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
                                  color: AppColors.primaryRed.withOpacity(0.15),
                                  blurRadius: 10,
                                  offset: const Offset(0, 2),
                                ),
                              ]
                            : null,
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          _buildBrandLogo(brand),
                          const SizedBox(height: 8),
                          Text(
                            brand.name,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),

            // Sticky Bottom Cart
            FixlyStickyCart(
              line1: '+ ${selectedBrand.name} Selected',
              line2: '+ Free Workshop Diagnosis',
              buttonLabel: 'Select Model',
              onAction: widget.onNext,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBrandLogo(DeviceBrand brand) {
    if (brand.id == 'xiaomi') {
      return Container(
        width: 38,
        height: 38,
        decoration: BoxDecoration(
          color: const Color(0xFFFF6900),
          borderRadius: BorderRadius.circular(10),
        ),
        alignment: Alignment.center,
        child: const Text('mi', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 16)),
      );
    } else if (brand.id == 'oneplus') {
      return Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          border: Border.all(color: Colors.red, width: 2),
          borderRadius: BorderRadius.circular(6),
        ),
        alignment: Alignment.center,
        child: const Text('1+', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 14)),
      );
    } else if (brand.id == 'apple') {
      return const Icon(Icons.apple, color: Colors.white, size: 36);
    } else if (brand.id == 'google') {
      return const Text('G', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 26));
    }
    return Text(
      brand.logoText,
      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 14),
      maxLines: 1,
    );
  }
}

class RadialGridDelegateWithFixedCrossAxisCount extends SliverGridDelegateWithFixedCrossAxisCount {
  const RadialGridDelegateWithFixedCrossAxisCount({
    required super.crossAxisCount,
    super.mainAxisSpacing,
    super.crossAxisSpacing,
    super.childAspectRatio,
  });
}
