import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../widgets/custom_widgets.dart';

class HomeScreen extends StatelessWidget {
  final VoidCallback onStartBooking;
  final Function(String issueTitle) onSelectIssue;
  final VoidCallback onOpenNotifications;
  final int unreadCount;

  const HomeScreen({
    super.key,
    required this.onStartBooking,
    required this.onSelectIssue,
    required this.onOpenNotifications,
    this.unreadCount = 3,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Top App Bar
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    RichText(
                      text: TextSpan(
                        children: [
                          TextSpan(
                            text: 'FIX',
                            style: GoogleFonts.outfit(
                              color: Colors.white,
                              fontSize: 26,
                              fontWeight: FontWeight.w900,
                              letterSpacing: -0.5,
                            ),
                          ),
                          TextSpan(
                            text: 'LY',
                            style: GoogleFonts.outfit(
                              color: AppColors.primaryRed,
                              fontSize: 26,
                              fontWeight: FontWeight.w900,
                              letterSpacing: -0.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: onOpenNotifications,
                        borderRadius: BorderRadius.circular(22),
                        child: Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: AppColors.surfaceElevated,
                            shape: BoxShape.circle,
                            border: Border.all(color: AppColors.border),
                          ),
                          child: Stack(
                            alignment: Alignment.center,
                            children: [
                              const Icon(Icons.notifications_none_rounded, color: Colors.white, size: 22),
                              if (unreadCount > 0)
                                Positioned(
                                  top: 10,
                                  right: 11,
                                  child: Container(
                                    width: 8,
                                    height: 8,
                                    decoration: const BoxDecoration(
                                      color: AppColors.primaryRed,
                                      shape: BoxShape.circle,
                                      boxShadow: [
                                        BoxShadow(
                                          color: AppColors.primaryRed,
                                          blurRadius: 4,
                                          spreadRadius: 1,
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // 2. Hero Section
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.redSubtle,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppColors.primaryRed.withOpacity(0.3)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const FixlyPulseDot(size: 6),
                          const SizedBox(width: 6),
                          Text(
                            'PROFESSIONAL REPAIR SERVICE',
                            style: GoogleFonts.plusJakartaSans(
                              color: AppColors.primaryRed,
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 1.0,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 10),
                    RichText(
                      text: TextSpan(
                        style: GoogleFonts.outfit(
                          fontSize: 34,
                          fontWeight: FontWeight.w900,
                          height: 1.15,
                          letterSpacing: -0.6,
                        ),
                        children: const [
                          TextSpan(text: 'Expert Care\n', style: TextStyle(color: Colors.white)),
                          TextSpan(text: 'for Your ', style: TextStyle(color: Colors.white)),
                          TextSpan(text: 'Device', style: TextStyle(color: AppColors.primaryRed)),
                        ],
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Fast. Reliable. Transparent.',
                      style: GoogleFonts.plusJakartaSans(
                        color: AppColors.textSecondary,
                        fontSize: 14,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Trust Value Badges
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: [
                          _buildTrustPill(Icons.bolt_rounded, '60-Min Pickup'),
                          const SizedBox(width: 8),
                          _buildTrustPill(Icons.verified_user_rounded, 'Up to 6M Warranty'),
                          const SizedBox(width: 8),
                          _buildTrustPill(Icons.precision_manufacturing_rounded, 'OEM Grade Parts'),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 8),

              // 3. Issue Category Grid (2 Rows x 4 Columns = 8 Cards)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: GridView.count(
                  crossAxisCount: 4,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  mainAxisSpacing: 10,
                  crossAxisSpacing: 10,
                  childAspectRatio: 0.82,
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
                    Text(
                      'Popular Repairs',
                      style: GoogleFonts.outfit(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        letterSpacing: -0.2,
                      ),
                    ),
                    TextButton(
                      onPressed: onStartBooking,
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        minimumSize: Size.zero,
                      ),
                      child: Row(
                        children: [
                          Text(
                            'View All',
                            style: GoogleFonts.plusJakartaSans(
                              color: AppColors.textSecondary,
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(width: 4),
                          const Icon(Icons.chevron_right, color: AppColors.textSecondary, size: 16),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 8),

              // Horizontal Carousel
              SizedBox(
                height: 154,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  children: [
                    _buildPopularCard('Screen\nReplacement', 'From ₹1,499', Icons.phone_android_rounded),
                    _buildPopularCard('Battery\nReplacement', 'From ₹999', Icons.battery_charging_full_rounded),
                    _buildPopularCard('Back Glass\nRepair', 'From ₹1,299', Icons.phonelink_erase_rounded),
                    _buildPopularCard('Charging\nPort Repair', 'From ₹799', Icons.cable_rounded),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // 6. Guarantee Banner
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 42,
                        height: 42,
                        decoration: BoxDecoration(
                          color: AppColors.redSubtle,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.primaryRed.withOpacity(0.3)),
                        ),
                        child: const Icon(Icons.security_rounded, color: AppColors.primaryRed, size: 22),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Punarafix Assurance',
                              style: GoogleFonts.outfit(
                                color: Colors.white,
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Doorstep pickup, zero diagnostic fee on repair, and up to 6 months warranty.',
                              style: GoogleFonts.plusJakartaSans(
                                color: AppColors.textSecondary,
                                fontSize: 12,
                                height: 1.3,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTrustPill(IconData icon, String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: AppColors.surfaceElevated,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: AppColors.primaryRed, size: 13),
          const SizedBox(width: 6),
          Text(
            text,
            style: GoogleFonts.plusJakartaSans(
              color: AppColors.textPrimary,
              fontSize: 11,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIssueCard({
    required String title,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Ink(
          padding: const EdgeInsets.all(9),
          decoration: BoxDecoration(
            color: AppColors.issueCardBg,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.issueCardBorder, width: 1),
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
                      style: GoogleFonts.plusJakartaSans(
                        color: AppColors.textPrimary,
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        height: 1.15,
                      ),
                      maxLines: 2,
                    ),
                  ),
                  const Icon(Icons.arrow_outward_rounded, color: AppColors.primaryRed, size: 13),
                ],
              ),
              Center(
                child: Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                    color: AppColors.surfaceElevated,
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.borderSubtle),
                  ),
                  child: Icon(icon, color: Colors.white, size: 20),
                ),
              ),
              const SizedBox(height: 1),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPopularCard(String title, String price, IconData icon) {
    return Container(
      width: 120,
      margin: const EdgeInsets.only(right: 12),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              color: AppColors.surfaceElevated,
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.borderSubtle),
            ),
            child: Icon(icon, color: Colors.white, size: 20),
          ),
          const SizedBox(height: 8),
          Text(
            title,
            textAlign: TextAlign.center,
            style: GoogleFonts.plusJakartaSans(
              color: Colors.white,
              fontSize: 11,
              fontWeight: FontWeight.w700,
              height: 1.15,
            ),
            maxLines: 2,
          ),
          const SizedBox(height: 4),
          Text(
            price,
            style: GoogleFonts.outfit(
              color: AppColors.primaryRed,
              fontSize: 12,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}
