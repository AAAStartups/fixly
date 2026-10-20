import 'package:flutter/material.dart';
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
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadModels();
  }

  @override
  void didUpdateWidget(covariant SelectModelScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.bookingState.selectedBrand?.id != widget.bookingState.selectedBrand?.id) {
      _loadModels();
    }
  }

  Future<void> _loadModels() async {
    final brandId = widget.bookingState.selectedBrand?.id ?? 'xiaomi';
    setState(() => _isLoading = true);
    final models = await ApiService().fetchModels(brandId);
    if (mounted) {
      setState(() {
        _models = models;
        _isLoading = false;
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
                            decoration: InputDecoration(
                              hintText: 'Search for model (eg. ${selectedBrand?.name ?? "Xiaomi"} 11)',
                              hintStyle: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
                              border: InputBorder.none,
                              isDense: true,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Current Selected Brand Pill
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: const Color(0xFFFF6900),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              selectedBrand?.logoText ?? 'mi',
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            selectedBrand?.name ?? 'Xiaomi',
                            style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w700),
                          ),
                        ],
                      ),
                      InkWell(
                        onTap: widget.onChangeBrand,
                        child: const Text(
                          'Change Brand ›',
                          style: TextStyle(color: AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.w500),
                        ),
                      ),
                    ],
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
                      ? const Center(
                          child: Text(
                            'No models found matching your search.',
                            style: TextStyle(color: AppColors.textSecondary, fontSize: 14),
                          ),
                        )
                      : ListView.separated(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          itemCount: filteredModels.length,
                          separatorBuilder: (context, index) => const SizedBox(height: 10),
                          itemBuilder: (context, index) {
                            final model = filteredModels[index];
                            final isSelected = selectedModel?.id == model.id;

                            return InkWell(
                              onTap: () {
                                widget.onModelSelected(model);
                              },
                              borderRadius: BorderRadius.circular(16),
                              child: Container(
                                padding: const EdgeInsets.all(12),
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
                                child: Row(
                                  children: [
                                    Container(
                                      width: 48,
                                      height: 48,
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                      padding: const EdgeInsets.all(4),
                                      child: const Icon(Icons.phone_android, color: Colors.black54, size: 28),
                                    ),
                                    const SizedBox(width: 14),
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
                                          const SizedBox(height: 2),
                                          Text(
                                            '${model.year} | ${model.network}',
                                            style: const TextStyle(
                                              color: AppColors.textSecondary,
                                              fontSize: 12,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    Icon(
                                      Icons.chevron_right,
                                      color: isSelected ? AppColors.primaryRed : AppColors.textSecondary,
                                      size: 20,
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
