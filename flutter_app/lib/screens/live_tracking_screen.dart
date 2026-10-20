import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../widgets/custom_widgets.dart';
import '../services/api_service.dart';

class LiveTrackingScreen extends StatefulWidget {
  final BookingState bookingState;
  final VoidCallback onReturnHome;

  const LiveTrackingScreen({
    super.key,
    required this.bookingState,
    required this.onReturnHome,
  });

  @override
  State<LiveTrackingScreen> createState() => _LiveTrackingScreenState();
}

class _LiveTrackingScreenState extends State<LiveTrackingScreen> {
  RepairOrderModel? _activeOrder;
  bool _isLoading = true;
  bool _isActionInProgress = false;

  @override
  void initState() {
    super.initState();
    _loadActiveOrder();
  }

  Future<void> _loadActiveOrder() async {
    final order = await ApiService().fetchActiveOrder();
    if (mounted) {
      setState(() {
        _activeOrder = order;
        _isLoading = false;
      });
    }
  }

  Future<void> _handleEstimateResponse(bool isApproved) async {
    final orderId = _activeOrder?.id ?? widget.bookingState.orderId;
    if (orderId == null) return;

    setState(() => _isActionInProgress = true);
    await ApiService().respondToEstimate(orderId, isApproved);
    await _loadActiveOrder();
    if (mounted) {
      setState(() => _isActionInProgress = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(isApproved ? 'Quotation Approved! Repair in progress.' : 'Quotation declined.'),
          backgroundColor: isApproved ? AppColors.primaryRed : Colors.grey[800],
        ),
      );
    }
  }

  Future<void> _handleWarrantyClaim() async {
    final orderId = _activeOrder?.id ?? widget.bookingState.orderId;
    if (orderId == null) return;

    setState(() => _isActionInProgress = true);
    final success = await ApiService().claimWarranty(
      orderId,
      'Customer reported display touch irregularity under 30-Day FIXLY Assured Guarantee.',
    );
    if (mounted) {
      setState(() => _isActionInProgress = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(success ? '30-Day Warranty claim logged. Free technician inspection dispatched.' : 'Failed to claim warranty.'),
          backgroundColor: AppColors.primaryRed,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final orderNum = _activeOrder?.orderNumber ??
        widget.bookingState.orderNumber ??
        'QF-2026-00101';

    final currentStatus = _activeOrder?.status ?? 'REPAIR_IN_PROGRESS';
    final estimate = _activeOrder?.estimate;

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
                    onTap: widget.onReturnHome,
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
                  Text(
                    'Order #$orderNum',
                    style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w700),
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
                            child: const Icon(Icons.build_circle_rounded, color: Colors.white, size: 26),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  _formatStatus(currentStatus),
                                  style: const TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.w800),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Doorstep Logistics & Lab Workshop',
                                  style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Estimate Review Card if available
                    if (estimate != null) ...[
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Technician Itemized Estimate',
                                  style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w700),
                                ),
                                Text(
                                  'Transparent Pricing',
                                  style: TextStyle(color: AppColors.textSecondary, fontSize: 11),
                                ),
                              ],
                            ),
                            const Divider(color: AppColors.border, height: 16),
                            ...estimate.items.map((it) => Padding(
                                  padding: const EdgeInsets.symmetric(vertical: 2),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(it.title, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                                      Text('₹${it.amount.toInt()}', style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600)),
                                    ],
                                  ),
                                )),
                            const Divider(color: AppColors.border, height: 16),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text('Total Quotation', style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w800)),
                                Text('₹${estimate.totalAmount.toInt()}', style: const TextStyle(color: AppColors.primaryRed, fontSize: 17, fontWeight: FontWeight.w900)),
                              ],
                            ),
                            if (estimate.isApproved == null || estimate.isApproved == false) ...[
                              const SizedBox(height: 12),
                              Row(
                                children: [
                                  Expanded(
                                    child: OutlinedButton(
                                      onPressed: _isActionInProgress ? null : () => _handleEstimateResponse(false),
                                      style: OutlinedButton.styleFrom(
                                        foregroundColor: Colors.white,
                                        side: const BorderSide(color: AppColors.border),
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                                      ),
                                      child: const Text('Decline'),
                                    ),
                                  ),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: ElevatedButton(
                                      onPressed: _isActionInProgress ? null : () => _handleEstimateResponse(true),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: AppColors.primaryRed,
                                        foregroundColor: Colors.white,
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                                      ),
                                      child: const Text('Approve Quote'),
                                    ),
                                  ),
                                ],
                              ),
                            ] else ...[
                              const SizedBox(height: 6),
                              Container(
                                width: double.infinity,
                                padding: const EdgeInsets.symmetric(vertical: 6),
                                decoration: BoxDecoration(
                                  color: AppColors.primaryRed.withOpacity(0.12),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                alignment: Alignment.center,
                                child: const Text(
                                  '✔ Quotation Approved by You',
                                  style: TextStyle(color: AppColors.primaryRed, fontSize: 12, fontWeight: FontWeight.w700),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),
                    ],

                    // 30-Day Warranty Assurance Card
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: AppColors.surfaceElevated,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Icon(Icons.shield_rounded, color: AppColors.primaryRed, size: 22),
                          ),
                          const SizedBox(width: 12),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('30-Day FIXLY Warranty', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w700)),
                                SizedBox(height: 2),
                                Text('Covers parts & workmanship with free revisit', style: TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                              ],
                            ),
                          ),
                          TextButton(
                            onPressed: _isActionInProgress ? null : _handleWarrantyClaim,
                            child: const Text('Claim ›', style: TextStyle(color: AppColors.primaryRed, fontSize: 12, fontWeight: FontWeight.w700)),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    const Text(
                      'Repair Journey Timeline',
                      style: TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.w800),
                    ),
                    const SizedBox(height: 14),

                    // 5-Stage Stepper
                    _buildTimelineStep(
                      stepNum: '1',
                      title: 'Pickup Scheduled',
                      time: '${widget.bookingState.selectedTimeSlot ?? "10:00 AM"}, ${widget.bookingState.selectedDate ?? "Today"}',
                      desc: 'Assigned rider: Amit Verma (Verified Partner)',
                      isCompleted: true,
                      isCurrent: currentStatus == 'PICKUP_SCHEDULED',
                    ),
                    _buildTimelineStep(
                      stepNum: '2',
                      title: 'Device Received at Workshop',
                      time: 'Check-in Completed',
                      desc: 'Intake checklist & initial diagnostic check',
                      isCompleted: _isStageDone(currentStatus, 2),
                      isCurrent: currentStatus == 'DEVICE_RECEIVED',
                    ),
                    _buildTimelineStep(
                      stepNum: '3',
                      title: 'Free Workshop Diagnosis Completed',
                      time: 'Quotation Dispatched',
                      desc: 'Technician inspection & itemized quotation',
                      isCompleted: _isStageDone(currentStatus, 3),
                      isCurrent: currentStatus == 'DIAGNOSIS_PENDING' || currentStatus == 'ESTIMATE_SENT',
                    ),
                    _buildTimelineStep(
                      stepNum: '4',
                      title: 'Repair in Progress',
                      time: 'Underway on Workbench',
                      desc: 'Genuine parts replacement and micro-soldering',
                      isCompleted: _isStageDone(currentStatus, 4),
                      isCurrent: currentStatus == 'REPAIR_IN_PROGRESS',
                    ),
                    _buildTimelineStep(
                      stepNum: '5',
                      title: 'Quality Check & Safe Delivery',
                      time: 'Estimated Turnaround Today',
                      desc: '18-point testing & doorstep return delivery',
                      isCompleted: _isStageDone(currentStatus, 5),
                      isCurrent: currentStatus == 'OUT_FOR_DELIVERY' || currentStatus == 'DELIVERED',
                      isLast: true,
                    ),

                    const SizedBox(height: 20),

                    // Back to Home CTA
                    FixlyCrimsonButton(
                      label: 'Back to Home',
                      onTap: widget.onReturnHome,
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

  String _formatStatus(String status) {
    switch (status) {
      case 'PICKUP_SCHEDULED':
        return 'Pickup Scheduled';
      case 'DEVICE_RECEIVED':
        return 'Device Received at Lab';
      case 'DIAGNOSIS_PENDING':
        return 'Diagnosis Completed';
      case 'ESTIMATE_SENT':
        return 'Quotation Awaiting Approval';
      case 'ESTIMATE_APPROVED':
      case 'REPAIR_IN_PROGRESS':
        return 'Repair In Progress';
      case 'QUALITY_CHECK_PASSED':
        return 'Quality Check Passed';
      case 'OUT_FOR_DELIVERY':
        return 'Out for Delivery';
      case 'DELIVERED':
        return 'Delivered & Complete';
      default:
        return 'Active Repair';
    }
  }

  bool _isStageDone(String status, int stage) {
    final stages = [
      'PICKUP_SCHEDULED',
      'DEVICE_RECEIVED',
      'DIAGNOSIS_PENDING',
      'REPAIR_IN_PROGRESS',
      'DELIVERED',
    ];
    final currentIndex = stages.indexOf(status);
    return currentIndex >= stage - 1;
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
