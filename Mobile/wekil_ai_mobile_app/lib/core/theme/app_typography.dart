// lib/core/theme/app_typography.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTypography {
  static const String englishFont = 'Inter';
  static const String amharicFont = 'NotoSansEthiopic';

  static var label;

  /// -------------------- English -------------------- ///

  /// Body text
  static TextStyle body({
    Color? color,
    FontWeight fontWeight = FontWeight.normal,
    double fontSize = 16,
  }) =>
      GoogleFonts.inter(
        fontSize: fontSize,
        color: color ?? AppColors.textDark,
        fontWeight: fontWeight,
      );

  /// Heading text
  static TextStyle heading({
    Color? color,
    FontWeight fontWeight = FontWeight.bold,
    double fontSize = 22,
  }) =>
      GoogleFonts.inter(
        fontSize: fontSize,
        color: color ?? AppColors.textDark,
        fontWeight: fontWeight,
      );

  /// Button text
  static TextStyle button({
    Color? color,
    FontWeight fontWeight = FontWeight.w600,
    double fontSize = 16,
  }) =>
      GoogleFonts.inter(
        fontSize: fontSize,
        color: color ?? AppColors.textLight,
        fontWeight: fontWeight,
      );

  /// Small / caption text
  static TextStyle small({
    Color? color,
    FontWeight fontWeight = FontWeight.normal,
    double fontSize = 12,
  }) =>
      GoogleFonts.inter(
        fontSize: fontSize,
        color: color ?? AppColors.textDark,
        fontWeight: fontWeight,
      );

  /// -------------------- Amharic -------------------- ///

  /// Body text
  static TextStyle amharicBody({
    Color? color,
    FontWeight fontWeight = FontWeight.normal,
    double fontSize = 17,
  }) =>
      GoogleFonts.notoSansEthiopic(
        fontSize: fontSize,
        color: color ?? AppColors.textDark,
        fontWeight: fontWeight,
      );

  /// Heading text
  static TextStyle amharicHeading({
    Color? color,
    FontWeight fontWeight = FontWeight.bold,
    double fontSize = 22,
  }) =>
      GoogleFonts.notoSansEthiopic(
        fontSize: fontSize,
        color: color ?? AppColors.textDark,
        fontWeight: fontWeight,
      );

  /// Button text
  static TextStyle amharicButton({
    Color? color,
    FontWeight fontWeight = FontWeight.w600,
    double fontSize = 16,
  }) =>
      GoogleFonts.notoSansEthiopic(
        fontSize: fontSize,
        color: color ?? AppColors.textLight,
        fontWeight: fontWeight,
      );

  /// Small / caption text
  static TextStyle amharicSmall({
    Color? color,
    FontWeight fontWeight = FontWeight.normal,
    double fontSize = 12,
  }) =>
      GoogleFonts.notoSansEthiopic(
        fontSize: fontSize,
        color: color ?? AppColors.textDark,
        fontWeight: fontWeight,
      );
}
