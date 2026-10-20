import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class DashboardTabScreen extends StatelessWidget {
  final VoidCallback onStartNewBooking;
  final VoidCallback onNavigateToBookings;

  const DashboardTabScreen({
    super.key,
    required this.onStartNewBooking,
    required this.onNavigateToBookings,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // User Profile Header
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
                      width: 54,
                      height: 54,
                      decoration: const BoxDecoration(
                        color: AppColors.primaryRed,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primaryRed,
                            blurRadius: 10,
                            offset: Offset(0, 3),
                          ),
                        ],
                      ),
                      child: const Center(
                        child: Text(
                          'AK',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                'Akshay Kumar',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 17,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                              SizedBox(width: 6),
                              Icon(Icons.verified, color: AppColors.primaryRed, size: 16),
                            ],
                          ),
                          SizedBox(height: 3),
                          Text(
                            '+91 98765 43210',
                            style: TextStyle(
                              color: AppColors.textSecondary,
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: AppColors.primaryRed.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppColors.primaryRed.withOpacity(0.4)),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.workspace_premium_rounded, color: AppColors.primaryRed, size: 14),
                          SizedBox(width: 4),
                          Text(
                            'PRO',
                            style: TextStyle(
                              color: AppColors.primaryRed,
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // Overview Metrics Grid (2x2)
              Row(
                children: [
                  Expanded(
                    child: _buildMetricCard(
                      icon: Icons.phonelink_setup_rounded,
                      title: 'Total Repairs',
                      value: '3 Devices',
                      subtitle: '1 In Progress',
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricCard(
                      icon: Icons.security_rounded,
                      title: 'Active Warranty',
                      value: '1 Active',
                      subtitle: '14 Days Left',
                      valueColor: AppColors.primaryRed,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: _buildMetricCard(
                      icon: Icons.savings_outlined,
                      title: 'Total Savings',
                      value: '₹1,450',
                      subtitle: 'vs Authorized Center',
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricCard(
                      icon: Icons.timer_outlined,
                      title: 'Avg Turnaround',
                      value: '60 Mins',
                      subtitle: 'Express Repair',
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 22),

              // 30-Day Warranty Highlight Banner
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      AppColors.primaryRed.withOpacity(0.2),
                      AppColors.surface,
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.primaryRed.withOpacity(0.4)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.verified_user_rounded, color: AppColors.primaryRed, size: 20),
                            SizedBox(width: 8),
                            Text(
                              'Fixly 30-Day Guarantee',
                              style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w700),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppColors.primaryRed,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text(
                            '14 Days Remaining',
                            style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w700),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      'iPhone 13 128GB — OEM Battery Replacement',
                      style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 8),
                    // Progress bar
                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: const LinearProgressIndicator(
                        value: 14 / 30,
                        backgroundColor: AppColors.border,
                        valueColor: AlwaysStoppedAnimation<Color>(AppColors.primaryRed),
                        minHeight: 6,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Coverage: Parts & Workmanship',
                          style: TextStyle(color: AppColors.textSecondary, fontSize: 11),
                        ),
                        InkWell(
                          onTap: onNavigateToBookings,
                          child: const Text(
                            'View Details ›',
                            style: TextStyle(color: AppColors.primaryRed, fontSize: 12, fontWeight: FontWeight.w700),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 22),

              // Device Vault ("My Registered Devices")
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Device Vault',
                    style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w700),
                  ),
                  InkWell(
                    onTap: onStartNewBooking,
                    child: const Row(
                      children: [
                        Icon(Icons.add, color: AppColors.primaryRed, size: 16),
                        SizedBox(width: 2),
                        Text(
                          'Add Device',
                          style: TextStyle(color: AppColors.primaryRed, fontSize: 12, fontWeight: FontWeight.w700),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              _buildDeviceItem(
                brand: 'Xiaomi',
                model: 'Xiaomi 11T Pro 5G',
                status: 'Repair In Progress',
                statusColor: AppColors.primaryRed,
                isRepairing: true,
              ),
              const SizedBox(height: 8),
              _buildDeviceItem(
                brand: 'Apple',
                model: 'iPhone 13 128GB',
                status: 'Healthy (Warranty Active)',
                statusColor: Colors.white70,
                isRepairing: false,
              ),
              const SizedBox(height: 8),
              _buildDeviceItem(
                brand: 'Samsung',
                model: 'Samsung Galaxy S22',
                status: 'Healthy',
                statusColor: AppColors.textSecondary,
                isRepairing: false,
              ),

              const SizedBox(height: 22),

              // Quick Action Tiles
              const Text(
                'Quick Actions',
                style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 10),
              _buildActionTile(
                icon: Icons.calendar_today_rounded,
                title: 'Schedule Repair Pickup',
                subtitle: 'Flat ₹79 doorstep logistics anywhere in city',
                onTap: onStartNewBooking,
              ),
              _buildActionTile(
                icon: Icons.receipt_long_rounded,
                title: 'GST Invoices & Receipts',
                subtitle: 'Download tax-compliant service bills',
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Downloading latest invoice PDF...'),
                      backgroundColor: AppColors.surfaceElevated,
                    ),
                  );
                },
              ),
              _buildActionTile(
                icon: Icons.location_on_outlined,
                title: 'Saved Pickup Addresses',
                subtitle: 'Home, Office & custom locations',
                onTap: () {},
              ),
              _buildActionTile(
                icon: Icons.headset_mic_outlined,
                title: '24/7 Fixly Helpline',
                subtitle: 'Instant WhatsApp chat & telephone support',
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Connecting to Fixly 24/7 Helpline: +91 80000 12345'),
                      backgroundColor: AppColors.primaryRed,
                    ),
                  );
                },
              ),

              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMetricCard({
    required IconData icon,
    required String title,
    required String value,
    required String subtitle,
    Color? valueColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: AppColors.surfaceElevated,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: Colors.white, size: 20),
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: TextStyle(
              color: valueColor ?? Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            subtitle,
            style: const TextStyle(
              color: AppColors.textSecondary,
              fontSize: 10,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDeviceItem({
    required String brand,
    required String model,
    required String status,
    required Color statusColor,
    required bool isRepairing,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: isRepairing ? AppColors.primaryRed.withOpacity(0.5) : AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.phone_android_rounded, color: Colors.black87, size: 22),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  model,
                  style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 2),
                Text(
                  status,
                  style: TextStyle(color: statusColor, fontSize: 11, fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color: AppColors.textSecondary, size: 18),
        ],
      ),
    );
  }

  Widget _buildActionTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: ListTile(
        onTap: onTap,
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 2),
        leading: Container(
          width: 38,
          height: 38,
          decoration: BoxDecoration(
            color: AppColors.surfaceElevated,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: Colors.white, size: 20),
        ),
        title: Text(
          title,
          style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600),
        ),
        subtitle: Text(
          subtitle,
          style: const TextStyle(color: AppColors.textSecondary, fontSize: 11),
        ),
        trailing: const Icon(Icons.chevron_right, color: AppColors.textSecondary, size: 18),
      ),
    );
  }
}
