import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/custom_widgets.dart';

class HomeScreen extends StatelessWidget {
  final VoidCallback onStartBooking;
  final Function(String issueTitle) onSelectIssue;

  const HomeScreen({
    super.key,
    required this.onStartBooking,
    required this.onSelectIssue,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Top App Bar
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    RichText(
                      text: const TextSpan(
                        children: [
                          TextSpan(
                            text: 'FIX',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 26,
                              fontWeight: FontWeight.w900,
                              letterSpacing: -0.5,
                            ),
                          ),
                          TextSpan(
                            text: 'LY',
                            style: TextStyle(
                              color: AppColors.primaryRed,
                              fontSize: 26,
                              fontWeight: FontWeight.w900,
                              letterSpacing: -0.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      width: 44,
                      height: 44,
                      decoration: const BoxDecoration(
                        color: AppColors.surfaceElevated,
                        shape: BoxShape.circle,
                      ),
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          const Icon(Icons.notifications_none_rounded, color: Colors.white, size: 22),
                          Positioned(
                            top: 10,
                            right: 12,
                            child: Container(
                              width: 8,
                              height: 8,
                              decoration: const BoxDecoration(
                                color: AppColors.primaryRed,
                                shape: BoxShape.circle,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              // 2. Hero Section
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'PROFESSIONAL REPAIR SERVICE',
                      style: TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 1.5,
                      ),
                    ),
                    const SizedBox(height: 6),
                    RichText(
                      text: const TextSpan(
                        style: TextStyle(
                          fontSize: 34,
                          fontWeight: FontWeight.w900,
                          height: 1.15,
                          letterSpacing: -0.5,
                        ),
                        children: [
                          TextSpan(text: 'Expert Care\n', style: TextStyle(color: Colors.white)),
                          TextSpan(text: 'for Your ', style: TextStyle(color: Colors.white)),
                          TextSpan(text: 'Device', style: TextStyle(color: AppColors.primaryRed)),
                        ],
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Fast. Reliable. Transparent.',
                      style: TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 14,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                  ],
                ),
              ),

              // 3. Issue Category Grid (2 Rows x 4 Columns = 8 Cards)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: GridView.count(
                  crossAxisCount: 4,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  mainAxisSpacing: 10,
                  crossAxisSpacing: 10,
                  childAspectRatio: 0.85,
                  children: [
                    _buildIssueCard(
                      title: 'Display\nIssues',
                      icon: Icons.phone_android_rounded,
                      onTap: () => onSelectIssue('Display Issues'),
                    ),
                    _buildIssueCard(
                      title: 'Battery\nIssues',
                      icon: Icons.battery_alert_rounded,
                      onTap: () => onSelectIssue('Battery Issues'),
                    ),
                    _buildIssueCard(
                      title: 'Back\nGlass Broken',
                      icon: Icons.broken_image_rounded,
                      onTap: () => onSelectIssue('Back Glass Broken'),
                    ),
                    _buildIssueCard(
                      title: 'Audio\nIssues',
                      icon: Icons.volume_off_rounded,
                      onTap: () => onSelectIssue('Audio Issues'),
                    ),
                    _buildIssueCard(
                      title: 'Charging\nIssues',
                      icon: Icons.power_rounded,
                      onTap: () => onSelectIssue('Charging Issues'),
                    ),
                    _buildIssueCard(
                      title: 'Dead\nPhone',
                      icon: Icons.sentiment_very_dissatisfied_rounded,
                      onTap: () => onSelectIssue('Dead Phone'),
                    ),
                    _buildIssueCard(
                      title: 'Network\nIssues',
                      icon: Icons.cell_tower_rounded,
                      onTap: () => onSelectIssue('Network Issues'),
                    ),
                    _buildIssueCard(
                      title: 'Water\nDamage',
                      icon: Icons.water_drop_rounded,
                      onTap: () => onSelectIssue('Water Damage'),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // 4. Primary CTA
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: FixlyCrimsonButton(
                  label: 'Select Phone Model',
                  onTap: onStartBooking,
                ),
              ),

              const SizedBox(height: 28),

              // 5. Popular Repairs Section
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Popular Repairs',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    TextButton(
                      onPressed: onStartBooking,
                      child: const Row(
                        children: [
                          Text('View All', style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                          SizedBox(width: 4),
                          Icon(Icons.chevron_right, color: AppColors.textSecondary, size: 16),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              // Horizontal Carousel
              SizedBox(
                height: 148,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  children: [
                    _buildPopularCard('Screen\nReplacement', 'From ₹1,499', Icons.phone_android_rounded),
                    _buildPopularCard('Battery\nReplacement', 'From ₹999', Icons.battery_charging_full_rounded),
                    _buildPopularCard('Back Glass\nRepair', 'From ₹1,299', Icons.phonelink_erase_rounded),
                    _buildPopularCard('Charging\nPort Repair', 'From ₹799', Icons.cable_rounded),
                  ],
                ),
              ),

              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildIssueCard({
    required String title,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: AppColors.issueCardBg,
          borderRadius: BorderRadius.circular(14),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(
                      color: Colors.black87,
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      height: 1.1,
                    ),
                    maxLines: 2,
                  ),
                ),
                const Icon(Icons.arrow_outward, color: AppColors.issueCardIcon, size: 14),
              ],
            ),
            Center(
              child: Icon(icon, color: AppColors.issueCardIcon, size: 30),
            ),
            const SizedBox(height: 2),
          ],
        ),
      ),
    );
  }

  Widget _buildPopularCard(String title, String price, IconData icon) {
    return Container(
      width: 120,
      margin: const EdgeInsets.only(right: 12),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: Colors.white, size: 26),
          const SizedBox(height: 6),
          Text(
            title,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 11,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            price,
            style: const TextStyle(
              color: AppColors.textSecondary,
              fontSize: 11,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
