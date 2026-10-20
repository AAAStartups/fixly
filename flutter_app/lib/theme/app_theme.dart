import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  // Canvas & Surfaces - Apple / Linear deep obsidian scale
  static const Color background = Color(0xFF0A0A0C);
  static const Color surface = Color(0xFF121215);
  static const Color surfaceElevated = Color(0xFF18181D);
  static const Color surfaceHighlight = Color(0xFF22222A);
  static const Color surfaceGlass = Color(0xD9121215);

  // Borders
  static const Color borderSubtle = Color(0xFF1E1E24);
  static const Color border = Color(0xFF2A2A34);
  static const Color borderStrong = Color(0xFF3F3F4D);
  static const Color borderFocus = Color(0xFFFF2B42);

  // Brand Accents - ZERO GREEN MANDATE: Pure Crimson Red
  static const Color primaryRed = Color(0xFFFF2B42);
  static const Color primaryRedDark = Color(0xFFD91E33);
  static const Color primaryRedLight = Color(0xFFFF5265);
  static const Color redGlow = Color(0x33FF2B42);
  static const Color redSubtle = Color(0x1AFF2B42);

  // Issue Grid Cards (Replaced clashing cyan/teal with sleek obsidian + crimson accent)
  static const Color issueCardBg = Color(0xFF141418);
  static const Color issueCardBorder = Color(0xFF24242C);
  static const Color issueCardIcon = Color(0xFFFF2B42);

  // Typography Scale
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFF9E9EA7);
  static const Color textMuted = Color(0xFF6B6B76);
  static const Color textDim = Color(0xFF4A4A54);

  // Status Colors (Non-green)
  static const Color statusPending = Color(0xFFF59E0B);
  static const Color statusPendingBg = Color(0x1AF59E0B);
  static const Color statusInfo = Color(0xFF3B82F6);
  static const Color statusInfoBg = Color(0x1A3B82F6);
}

class AppTheme {
  static ThemeData get darkTheme {
    final baseTextTheme = ThemeData.dark().textTheme;
    final textTheme = GoogleFonts.plusJakartaSansTextTheme(baseTextTheme).copyWith(
      displayLarge: GoogleFonts.outfit(
        color: AppColors.textPrimary,
        fontWeight: FontWeight.w800,
        fontSize: 32,
        letterSpacing: -0.5,
      ),
      displayMedium: GoogleFonts.outfit(
        color: AppColors.textPrimary,
        fontWeight: FontWeight.w700,
        fontSize: 26,
        letterSpacing: -0.4,
      ),
      displaySmall: GoogleFonts.outfit(
        color: AppColors.textPrimary,
        fontWeight: FontWeight.w700,
        fontSize: 20,
        letterSpacing: -0.2,
      ),
      headlineMedium: GoogleFonts.outfit(
        color: AppColors.textPrimary,
        fontWeight: FontWeight.w600,
        fontSize: 18,
      ),
      titleLarge: GoogleFonts.plusJakartaSans(
        color: AppColors.textPrimary,
        fontWeight: FontWeight.w700,
        fontSize: 16,
      ),
      titleMedium: GoogleFonts.plusJakartaSans(
        color: AppColors.textPrimary,
        fontWeight: FontWeight.w600,
        fontSize: 14,
      ),
      bodyLarge: GoogleFonts.plusJakartaSans(
        color: AppColors.textPrimary,
        fontSize: 14,
        fontWeight: FontWeight.w400,
        height: 1.5,
      ),
      bodyMedium: GoogleFonts.plusJakartaSans(
        color: AppColors.textSecondary,
        fontSize: 13,
        fontWeight: FontWeight.w400,
        height: 1.4,
      ),
      labelLarge: GoogleFonts.plusJakartaSans(
        color: AppColors.textPrimary,
        fontSize: 14,
        fontWeight: FontWeight.w600,
      ),
      labelSmall: GoogleFonts.plusJakartaSans(
        color: AppColors.textSecondary,
        fontSize: 11,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.5,
      ),
    );

    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.background,
      primaryColor: AppColors.primaryRed,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.primaryRed,
        secondary: AppColors.primaryRedLight,
        surface: AppColors.surface,
        background: AppColors.background,
        onPrimary: Colors.white,
        onSurface: AppColors.textPrimary,
      ),
      textTheme: textTheme,
      useMaterial3: true,
      cardTheme: CardThemeData(
        color: AppColors.surface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.border, width: 1),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.background,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surfaceElevated,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 13),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.primaryRed, width: 1.5),
        ),
      ),
      dividerTheme: const DividerThemeData(
        color: AppColors.borderSubtle,
        thickness: 1,
        space: 1,
      ),
    );
  }
}
