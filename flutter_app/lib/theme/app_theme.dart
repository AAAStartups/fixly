import 'package:flutter/material.dart';

class AppColors {
  // Brand Canvas & Surfaces
  static const Color background = Color(0xFF0D0D0D);
  static const Color surface = Color(0xFF161616);
  static const Color surfaceElevated = Color(0xFF1A1A1A);
  static const Color border = Color(0xFF262626);
  static const Color borderSubtle = Color(0xFF1E1E1E);

  // Brand Accents - ZERO GREEN MANDATE: Pure Crimson Red
  static const Color primaryRed = Color(0xFFFF2B42);
  static const Color primaryRedDark = Color(0xFFE50914);
  static const Color redGlow = Color(0x1AFF2B42);

  // Screen 1 Issue Grid Light Tint
  static const Color issueCardBg = Color(0xFFE8F7F7);
  static const Color issueCardIcon = Color(0xFF008080);

  // Typography
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFF8E8E93);
  static const Color textMuted = Color(0xFF555555);
}

class AppTheme {
  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.background,
      primaryColor: AppColors.primaryRed,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.primaryRed,
        surface: AppColors.surface,
      ),
      fontFamily: 'Inter',
      useMaterial3: true,
      cardTheme: CardThemeData(
        color: AppColors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.border, width: 1),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.background,
        elevation: 0,
        centerTitle: false,
      ),
    );
  }
}
