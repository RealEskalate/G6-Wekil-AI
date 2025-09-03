import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTypography {
  // Fallback font families for offline
  static const String amharicFont = 'NotoSansEthiopic';
  static const String englishFont = 'Inter';

  static var label;

  /// Body text
  static TextStyle body({bool useGoogleFonts = true}) =>
      useGoogleFonts
          ? GoogleFonts.inter(fontSize: 16, color: AppColors.textDark)
          : const TextStyle(
              fontFamily: englishFont,
              fontSize: 16,
              color: AppColors.textDark,
            );

  /// Heading
  static TextStyle heading({bool useGoogleFonts = true}) =>
      useGoogleFonts
          ? GoogleFonts.inter(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: AppColors.textDark)
          : const TextStyle(
              fontFamily: englishFont,
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: AppColors.textDark,
            );

  /// Amharic body
  static TextStyle amharicBody({bool useGoogleFonts = true}) =>
      useGoogleFonts
          ? GoogleFonts.notoSansEthiopic(fontSize: 17, color: AppColors.textDark)
          : const TextStyle(
              fontFamily: amharicFont,
              fontSize: 17,
              color: AppColors.textDark,
            );

  /// Amharic heading
  static TextStyle amharicHeading({bool useGoogleFonts = true}) =>
      useGoogleFonts
          ? GoogleFonts.notoSansEthiopic(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: AppColors.textDark)
          : const TextStyle(
              fontFamily: amharicFont,
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: AppColors.textDark,
            );

  /// Button text
  static TextStyle button({bool useGoogleFonts = true}) =>
      useGoogleFonts
          ? GoogleFonts.inter(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppColors.textLight)
          : const TextStyle(
              fontFamily: englishFont,
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppColors.textLight,
            );
}
