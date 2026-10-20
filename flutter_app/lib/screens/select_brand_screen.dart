import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../widgets/custom_widgets.dart';
import '../services/api_service.dart';

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
  List<DeviceBrand> _brands = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadBrands();
  }

  Future<void> _loadBrands() async {
    final brands = await ApiService().fetchBrands();
    if (mounted) {
      setState(() {
        _brands = brands;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final filteredBrands = _brands
        .where((b) => b.name.toLowerCase().contains(_searchQuery.toLowerCase()))
        .toList();

    final selectedBrand = widget.bookingState.selectedBrand ??
        (_brands.isNotEmpty ? _brands.firstWhere((b) => b.id == 'xiaomi', orElse: () => _brands.first) : null);

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
                          hintText: 'Search for brand or model (eg. iPhone 14)',
                          hintStyle: TextStyle(color: AppColors.textSecondary, fontSize: 13),
                          border: InputBorder.none,
                          isDense: true,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Brand Grid
            Expanded(
              child: _isLoading
                  ? const Center(
                      child: CircularProgressIndicator(color: AppColors.primaryRed),
                    )
                  : GridView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 3,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                        childAspectRatio: 1.05,
                      ),
                      itemCount: filteredBrands.length,
                      itemBuilder: (context, index) {
                        final brand = filteredBrands[index];
                        final isSelected = selectedBrand?.id == brand.id;

                        return InkWell(
                          onTap: () {
                            widget.onBrandSelected(brand);
                          },
                          borderRadius: BorderRadius.circular(16),
                          child: Container(
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? AppColors.primaryRed.withOpacity(0.08)
                                  : AppColors.surface,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: isSelected ? AppColors.primaryRed : AppColors.border,
                                width: isSelected ? 2 : 1,
                              ),
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                _buildBrandLogo(brand),
                                const SizedBox(height: 8),
                                Text(
                                  brand.name,
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 13,
                                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),

            // Sticky Bottom Cart Summary
            FixlyStickyCart(
              line1: '+ ${selectedBrand?.name ?? "Brand"}',
              line2: '+ Free Diagnosis',
              buttonLabel: 'Select Model ›',
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
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: const Color(0xFFFF6900),
          borderRadius: BorderRadius.circular(6),
        ),
        child: const Text('mi', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
      );
    } else if (brand.id == 'oneplus') {
      return Container(
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          color: const Color(0xFFEB0029),
          borderRadius: BorderRadius.circular(4),
        ),
        child: const Text('1+', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
      );
    }

    return Text(
      brand.logoText,
      style: TextStyle(
        color: brand.primaryColorValue != null ? Color(brand.primaryColorValue!) : Colors.white,
        fontWeight: FontWeight.bold,
        fontSize: 16,
      ),
    );
  }
}
