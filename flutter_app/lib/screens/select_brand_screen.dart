import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
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
  List<DeviceBrand> _brands = ApiService.fallbackBrands;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadBrands();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadBrands() async {
    final brands = await ApiService().fetchBrands();
    if (mounted && brands.isNotEmpty) {
      setState(() {
        _brands = brands;
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
                height: 50,
                decoration: BoxDecoration(
                  color: AppColors.surfaceElevated,
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
                        style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 14),
                        decoration: InputDecoration(
                          hintText: 'Search for brand (e.g. Apple, Samsung, Xiaomi)',
                          hintStyle: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontSize: 13),
                          border: InputBorder.none,
                          enabledBorder: InputBorder.none,
                          focusedBorder: InputBorder.none,
                          isDense: true,
                          contentPadding: EdgeInsets.zero,
                        ),
                      ),
                    ),
                    if (_searchQuery.isNotEmpty)
                      GestureDetector(
                        onTap: () {
                          _searchController.clear();
                          setState(() => _searchQuery = '');
                        },
                        child: const Icon(Icons.close, color: AppColors.textMuted, size: 18),
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
                  : filteredBrands.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.search_off_rounded, color: AppColors.textMuted, size: 48),
                              const SizedBox(height: 12),
                              Text(
                                'No brands found matching "$_searchQuery"',
                                style: GoogleFonts.plusJakartaSans(color: AppColors.textSecondary, fontSize: 14),
                              ),
                            ],
                          ),
                        )
                      : GridView.builder(
                          physics: const BouncingScrollPhysics(),
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

                            return Material(
                              color: Colors.transparent,
                              child: InkWell(
                                onTap: () => widget.onBrandSelected(brand),
                                borderRadius: BorderRadius.circular(16),
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 200),
                                  decoration: BoxDecoration(
                                    color: isSelected ? AppColors.surfaceHighlight : AppColors.surface,
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(
                                      color: isSelected ? AppColors.primaryRed : AppColors.border,
                                      width: isSelected ? 1.5 : 1,
                                    ),
                                    boxShadow: isSelected
                                        ? [
                                            BoxShadow(
                                              color: AppColors.primaryRed.withOpacity(0.15),
                                              blurRadius: 10,
                                              offset: const Offset(0, 3),
                                            ),
                                          ]
                                        : null,
                                  ),
                                  child: Stack(
                                    children: [
                                      Center(
                                        child: Column(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            _buildBrandLogo(brand),
                                            const SizedBox(height: 8),
                                            Text(
                                              brand.name,
                                              style: GoogleFonts.plusJakartaSans(
                                                color: Colors.white,
                                                fontSize: 13,
                                                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      if (isSelected)
                                        const Positioned(
                                          top: 8,
                                          right: 8,
                                          child: Icon(Icons.check_circle_rounded, color: AppColors.primaryRed, size: 16),
                                        ),
                                    ],
                                  ),
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
        child: const Text('mi', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
      );
    } else if (brand.id == 'oneplus') {
      return Container(
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          color: const Color(0xFFEB0029),
          borderRadius: BorderRadius.circular(4),
        ),
        child: const Text('1+', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
      );
    }

    return Text(
      brand.logoText,
      style: GoogleFonts.outfit(
        color: brand.primaryColorValue != null ? Color(brand.primaryColorValue!) : Colors.white,
        fontWeight: FontWeight.bold,
        fontSize: 16,
        letterSpacing: 0.5,
      ),
    );
  }
}
