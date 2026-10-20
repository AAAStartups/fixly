import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../widgets/custom_widgets.dart';
import '../services/api_service.dart';

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
  List<DeviceModel> _models = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    final brandId = widget.bookingState.selectedBrand?.id ?? 'xiaomi';
    _models = ApiService.getFallbackModels(brandId);
    _loadModels();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  void didUpdateWidget(covariant SelectModelScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.bookingState.selectedBrand?.id != widget.bookingState.selectedBrand?.id) {
      final brandId = widget.bookingState.selectedBrand?.id ?? 'xiaomi';
      setState(() {
        _models = ApiService.getFallbackModels(brandId);
      });
      _loadModels();
    }
  }

  Future<void> _loadModels() async {
    final brandId = widget.bookingState.selectedBrand?.id ?? 'xiaomi';
    final models = await ApiService().fetchModels(brandId);
    if (mounted && models.isNotEmpty) {
      setState(() {
        _models = models;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final selectedBrand = widget.bookingState.selectedBrand;
    final selectedModel = widget.bookingState.selectedModel ??
        (_models.isNotEmpty ? _models.first : null);

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

            // Search Bar & Brand Row
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Column(
                children: [
                  Container(
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
                              hintText: 'Search for model (e.g. ${selectedBrand?.name ?? "Xiaomi"} 11)',
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
                  const SizedBox(height: 12),

                  // Current Selected Brand Banner
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: selectedBrand?.primaryColorValue != null
                                    ? Color(selectedBrand!.primaryColorValue!)
                                    : const Color(0xFFFF6900),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                selectedBrand?.logoText ?? 'mi',
                                style: GoogleFonts.outfit(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 11,
                                ),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Text(
                              selectedBrand?.name ?? 'Xiaomi',
                              style: GoogleFonts.plusJakartaSans(
                                color: Colors.white,
                                fontSize: 15,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                        Material(
                          color: Colors.transparent,
                          child: InkWell(
                            onTap: widget.onChangeBrand,
                            borderRadius: BorderRadius.circular(8),
                            child: Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              child: Row(
                                children: [
                                  Text(
                                    'Change Brand',
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
                  ),
                ],
              ),
            ),

            // Models List
            Expanded(
              child: _isLoading
                  ? const Center(
                      child: CircularProgressIndicator(color: AppColors.primaryRed),
                    )
                  : filteredModels.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.phone_missed_rounded, color: AppColors.textMuted, size: 48),
                              const SizedBox(height: 12),
                              Text(
                                'No models found matching "$_searchQuery"',
                                style: GoogleFonts.plusJakartaSans(color: AppColors.textSecondary, fontSize: 14),
                              ),
                            ],
                          ),
                        )
                      : ListView.separated(
                          physics: const BouncingScrollPhysics(),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          itemCount: filteredModels.length,
                          separatorBuilder: (context, index) => const SizedBox(height: 10),
                          itemBuilder: (context, index) {
                            final model = filteredModels[index];
                            final isSelected = selectedModel?.id == model.id;

                            return Material(
                              color: Colors.transparent,
                              child: InkWell(
                                onTap: () => widget.onModelSelected(model),
                                borderRadius: BorderRadius.circular(16),
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 200),
                                  padding: const EdgeInsets.all(12),
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
                                              color: AppColors.primaryRed.withOpacity(0.12),
                                              blurRadius: 10,
                                              offset: const Offset(0, 3),
                                            ),
                                          ]
                                        : null,
                                  ),
                                  child: Row(
                                    children: [
                                      Container(
                                        width: 48,
                                        height: 48,
                                        decoration: BoxDecoration(
                                          color: AppColors.surfaceElevated,
                                          borderRadius: BorderRadius.circular(12),
                                          border: Border.all(color: AppColors.borderSubtle),
                                        ),
                                        child: const Icon(Icons.phone_android_rounded, color: Colors.white, size: 24),
                                      ),
                                      const SizedBox(width: 14),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              model.name,
                                              style: GoogleFonts.plusJakartaSans(
                                                color: Colors.white,
                                                fontSize: 15,
                                                fontWeight: FontWeight.w700,
                                              ),
                                            ),
                                            const SizedBox(height: 4),
                                            Row(
                                              children: [
                                                Container(
                                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                                  decoration: BoxDecoration(
                                                    color: AppColors.surfaceElevated,
                                                    borderRadius: BorderRadius.circular(4),
                                                    border: Border.all(color: AppColors.borderSubtle),
                                                  ),
                                                  child: Text(
                                                    model.network,
                                                    style: GoogleFonts.plusJakartaSans(
                                                      color: AppColors.textSecondary,
                                                      fontSize: 10,
                                                      fontWeight: FontWeight.w600,
                                                    ),
                                                  ),
                                                ),
                                                const SizedBox(width: 6),
                                                Text(
                                                  'Released ${model.year}',
                                                  style: GoogleFonts.plusJakartaSans(
                                                    color: AppColors.textMuted,
                                                    fontSize: 11,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ],
                                        ),
                                      ),
                                      Container(
                                        width: 24,
                                        height: 24,
                                        decoration: BoxDecoration(
                                          color: isSelected ? AppColors.primaryRed : Colors.transparent,
                                          shape: BoxShape.circle,
                                          border: Border.all(
                                            color: isSelected ? AppColors.primaryRed : AppColors.border,
                                            width: 1.5,
                                          ),
                                        ),
                                        child: isSelected
                                            ? const Icon(Icons.check, color: Colors.white, size: 14)
                                            : null,
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
              line1: '+ ${selectedModel?.name ?? "Model"}',
              line2: '+ Free Diagnosis',
              buttonLabel: 'Select Issue ›',
              onAction: widget.onNext,
            ),
          ],
        ),
      ),
    );
  }
}
