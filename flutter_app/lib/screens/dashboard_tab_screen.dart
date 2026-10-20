import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../widgets/custom_widgets.dart';

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
          physics: const BouncingScrollPhysics(),
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
                      width: 52,
                      height: 52,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFFFF2B42), Color(0xFFD91E33)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primaryRed.withOpacity(0.35),
                            blurRadius: 10,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: Center(
                        child: Text(
                          'AK',
                          style: GoogleFonts.outfit(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                'Akshay Kumar',
                                style: GoogleFonts.outfit(
                                  color: Colors.white,
                                  fontSize: 17,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                              const SizedBox(width: 6),
                              const Icon(Icons.verified, color: AppColors.primaryRed, size: 16),
                            ],
                          ),
                          const SizedBox(height: 3),
                          Text(
                            '+91 98765 43210',
                            style: GoogleFonts.plusJakartaSans(
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
                        color: AppColors.redSubtle,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppColors.primaryRed.withOpacity(0.4)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.workspace_premium_rounded, color: AppColors.primaryRed, size: 14),
                          const SizedBox(width: 4),
                          Text(
                            'PRO',
                            style: GoogleFonts.plusJakartaSans(
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
                      AppColors.primaryRed.withOpacity(0.15),
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
                        Row(
                          children: [
                            const Icon(Icons.verified_user_rounded, color: AppColors.primaryRed, size: 20),
                            const SizedBox(width: 8),
                            Text(
                              'Fixly 30-Day Guarantee',
                              style: GoogleFonts.outfit(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w700),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppColors.primaryRed,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            '14 Days Remaining',
                            style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w700),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Text(
                      'iPhone 13 128GB — OEM Battery Replacement',
                      style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 8),
                    // Progress bar
                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: const LinearProgressIndicator(
                        value: 14 / 30,
                        backgroundColor: AppColors.border,
                        valueColor: AlwaysStoppedAnimation<Color>(AppColors.primaryRed),
                        minHeight: 5,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Coverage: Parts & Workmanship',
                          style: GoogleFonts.plusJakartaSans(color: AppColors.textSecondary, fontSize: 11),
                        ),
                        Material(
                          color: Colors.transparent,
                          child: InkWell(
                            onTap: onNavigateToBookings,
                            child: Text(
                              'View Details ›',
                              style: GoogleFonts.plusJakartaSans(color: AppColors.primaryRed, fontSize: 12, fontWeight: FontWeight.w700),
                            ),
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
                  Text(
                    'Device Vault',
                    style: GoogleFonts.outfit(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w700),
                  ),
                  Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: onStartNewBooking,
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                        child: Row(
                          children: [
                            const Icon(Icons.add, color: AppColors.primaryRed, size: 16),
                            const SizedBox(width: 2),
                            Text(
                              'Add Device',
                              style: GoogleFonts.plusJakartaSans(color: AppColors.primaryRed, fontSize: 12, fontWeight: FontWeight.w700),
                            ),
                          ],
                        ),
                      ),
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
              Text(
                'Quick Actions',
                style: GoogleFonts.outfit(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w700),
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
              border: Border.all(color: AppColors.borderSubtle),
            ),
            child: Icon(icon, color: Colors.white, size: 20),
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: GoogleFonts.outfit(
              color: valueColor ?? Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            title,
            style: GoogleFonts.plusJakartaSans(
              color: Colors.white,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            subtitle,
            style: GoogleFonts.plusJakartaSans(
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
              color: AppColors.surfaceElevated,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppColors.borderSubtle),
            ),
            child: const Icon(Icons.phone_android_rounded, color: Colors.white, size: 22),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  model,
                  style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 2),
                Text(
                  status,
                  style: GoogleFonts.plusJakartaSans(color: statusColor, fontSize: 11, fontWeight: FontWeight.w600),
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
            border: Border.all(color: AppColors.borderSubtle),
          ),
          child: Icon(icon, color: Colors.white, size: 20),
        ),
        title: Text(
          title,
          style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600),
        ),
        subtitle: Text(
          subtitle,
          style: GoogleFonts.plusJakartaSans(color: AppColors.textSecondary, fontSize: 11),
        ),
        trailing: const Icon(Icons.chevron_right, color: AppColors.textSecondary, size: 18),
      ),
    );
  }
}
