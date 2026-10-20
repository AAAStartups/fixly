import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../widgets/custom_widgets.dart';

class NotificationItem {
  final String id;
  final String title;
  final String message;
  final String time;
  final String category; // 'order', 'warranty', 'offer'
  final IconData icon;
  bool isRead;
  final String? actionLabel;

  NotificationItem({
    required this.id,
    required this.title,
    required this.message,
    required this.time,
    required this.category,
    required this.icon,
    this.isRead = false,
    this.actionLabel,
  });
}

class NotificationsScreen extends StatefulWidget {
  final VoidCallback onBack;
  final VoidCallback onTrackOrder;

  const NotificationsScreen({
    super.key,
    required this.onBack,
    required this.onTrackOrder,
  });

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  int _selectedFilter = 0; // 0 = All, 1 = Orders, 2 = Warranty, 3 = Offers

  final List<NotificationItem> _notifications = [
    NotificationItem(
      id: '1',
      title: 'Device Received at Central Lab',
      message: 'Your Xiaomi 11T Pro 5G (#QF-2026-0042) has arrived at the lab. Technician diagnosis is underway.',
      time: '12m ago',
      category: 'order',
      icon: Icons.precision_manufacturing_rounded,
      isRead: false,
      actionLabel: 'Track Repair',
    ),
    NotificationItem(
      id: '2',
      title: 'Pickup Partner Assigned',
      message: 'Rider Rohit Sharma (+91 98765 12340) is dispatched to collect your device at 10:00 AM.',
      time: '2h ago',
      category: 'order',
      icon: Icons.delivery_dining_rounded,
      isRead: false,
      actionLabel: 'Track Order',
    ),
    NotificationItem(
      id: '3',
      title: '30-Day Warranty Alert',
      message: 'Your iPhone 13 OEM Battery repair warranty has 14 days remaining. Zero-deductible replacement.',
      time: '1d ago',
      category: 'warranty',
      icon: Icons.security_rounded,
      isRead: false,
      actionLabel: 'View Warranty',
    ),
    NotificationItem(
      id: '4',
      title: 'Weekend Flat ₹150 OFF',
      message: 'Get instant ₹150 discount on any Screen or Back Glass repair. Use coupon FIX150 before Sunday.',
      time: '3d ago',
      category: 'offer',
      icon: Icons.local_offer_rounded,
      isRead: true,
      actionLabel: 'Book Now',
    ),
  ];

  void _markAllAsRead() {
    setState(() {
      for (var item in _notifications) {
        item.isRead = true;
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('All notifications marked as read'),
        backgroundColor: AppColors.surfaceElevated,
        duration: Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final unreadCount = _notifications.where((n) => !n.isRead).length;

    final filteredList = _notifications.where((item) {
      if (_selectedFilter == 1) return item.category == 'order';
      if (_selectedFilter == 2) return item.category == 'warranty';
      if (_selectedFilter == 3) return item.category == 'offer';
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // Top App Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                children: [
                  Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: widget.onBack,
                      borderRadius: BorderRadius.circular(22),
                      child: Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: AppColors.surfaceElevated,
                          shape: BoxShape.circle,
                          border: Border.all(color: AppColors.border),
                        ),
                        child: const Icon(Icons.arrow_back, color: Colors.white, size: 20),
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Notifications',
                          style: GoogleFonts.outfit(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        if (unreadCount > 0)
                          Text(
                            '$unreadCount new update${unreadCount > 1 ? 's' : ''}',
                            style: GoogleFonts.plusJakartaSans(
                              color: AppColors.primaryRed,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          )
                        else
                          Text(
                            'All caught up',
                            style: GoogleFonts.plusJakartaSans(
                              color: AppColors.textSecondary,
                              fontSize: 12,
                            ),
                          ),
                      ],
                    ),
                  ),
                  if (_notifications.isNotEmpty)
                    TextButton(
                      onPressed: _markAllAsRead,
                      child: Text(
                        'Mark all read',
                        style: GoogleFonts.plusJakartaSans(
                          color: AppColors.primaryRed,
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                ],
              ),
            ),

            // Filter Tabs Row
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                physics: const BouncingScrollPhysics(),
                child: Row(
                  children: [
                    _buildFilterChip(0, 'All (${_notifications.length})'),
                    const SizedBox(width: 8),
                    _buildFilterChip(
                      1,
                      'Orders (${_notifications.where((n) => n.category == 'order').length})',
                    ),
                    const SizedBox(width: 8),
                    _buildFilterChip(
                      2,
                      'Warranty (${_notifications.where((n) => n.category == 'warranty').length})',
                    ),
                    const SizedBox(width: 8),
                    _buildFilterChip(
                      3,
                      'Offers (${_notifications.where((n) => n.category == 'offer').length})',
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 8),

            // Notification List or Empty State
            Expanded(
              child: filteredList.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            width: 72,
                            height: 72,
                            decoration: BoxDecoration(
                              color: AppColors.surface,
                              shape: BoxShape.circle,
                              border: Border.all(color: AppColors.border),
                            ),
                            child: const Icon(
                              Icons.notifications_off_outlined,
                              color: AppColors.textSecondary,
                              size: 32,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'No notifications here',
                            style: GoogleFonts.outfit(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'You will receive live repair updates and\nwarranty milestones here.',
                            textAlign: TextAlign.center,
                            style: GoogleFonts.plusJakartaSans(
                              color: AppColors.textSecondary,
                              fontSize: 12,
                              height: 1.4,
                            ),
                          ),
                        ],
                      ),
                    )
                  : ListView.separated(
                      physics: const BouncingScrollPhysics(),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      itemCount: filteredList.length,
                      separatorBuilder: (context, index) => const SizedBox(height: 10),
                      itemBuilder: (context, index) {
                        final item = filteredList[index];
                        return _buildNotificationCard(item);
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip(int index, String label) {
    final isSelected = _selectedFilter == index;
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () => setState(() => _selectedFilter = index),
        borderRadius: BorderRadius.circular(20),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.surfaceHighlight : AppColors.surface,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isSelected ? AppColors.primaryRed : AppColors.border,
              width: isSelected ? 1.5 : 1,
            ),
          ),
          child: Text(
            label,
            style: GoogleFonts.plusJakartaSans(
              color: isSelected ? Colors.white : AppColors.textSecondary,
              fontSize: 12,
              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNotificationCard(NotificationItem item) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () {
          setState(() {
            item.isRead = true;
          });
          if (item.category == 'order') {
            widget.onTrackOrder();
          }
        },
        borderRadius: BorderRadius.circular(16),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: item.isRead ? AppColors.surface : AppColors.surfaceElevated,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: item.isRead ? AppColors.border : AppColors.primaryRed.withOpacity(0.4),
              width: item.isRead ? 1 : 1.5,
            ),
            boxShadow: !item.isRead
                ? [
                    BoxShadow(
                      color: AppColors.primaryRed.withOpacity(0.08),
                      blurRadius: 10,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : null,
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Icon
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: item.isRead ? AppColors.surfaceElevated : AppColors.redSubtle,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: item.isRead ? AppColors.borderSubtle : AppColors.primaryRed.withOpacity(0.3),
                  ),
                ),
                child: Icon(
                  item.icon,
                  color: item.isRead ? Colors.white70 : AppColors.primaryRed,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),

              // Content
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            item.title,
                            style: GoogleFonts.plusJakartaSans(
                              color: Colors.white,
                              fontSize: 14,
                              fontWeight: item.isRead ? FontWeight.w600 : FontWeight.w800,
                            ),
                          ),
                        ),
                        Row(
                          children: [
                            Text(
                              item.time,
                              style: GoogleFonts.plusJakartaSans(
                                color: AppColors.textSecondary,
                                fontSize: 11,
                              ),
                            ),
                            if (!item.isRead) ...[
                              const SizedBox(width: 6),
                              const FixlyPulseDot(size: 7),
                            ],
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      item.message,
                      style: GoogleFonts.plusJakartaSans(
                        color: AppColors.textSecondary,
                        fontSize: 12,
                        height: 1.35,
                      ),
                    ),
                    if (item.actionLabel != null) ...[
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Text(
                            '${item.actionLabel} ›',
                            style: GoogleFonts.plusJakartaSans(
                              color: AppColors.primaryRed,
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
