import 'package:flutter/material.dart';
import 'package:flutter_localization/flutter_localization.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/theme/app_colors.dart';

class NavBar extends StatefulWidget implements PreferredSizeWidget {
  final bool showBack;
  final VoidCallback? onBack;
  const NavBar({Key? key, this.showBack = false, this.onBack}) : super(key: key);

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  State<NavBar> createState() => _NavBarState();
}

class _NavBarState extends State<NavBar> {
  late FlutterLocalization _flutterLocalization;
  late String _currentLocale;
  @override
  void initState() {
    super.initState();
    _flutterLocalization = FlutterLocalization.instance;
    _currentLocale = _flutterLocalization.currentLocale!.languageCode;
  }

  String currentLanguage = 'EN';
  bool isHovering = false;

  @override
  Widget build(BuildContext context) {
    return AppBar(
      automaticallyImplyLeading: false,
      backgroundColor: AppColors.textLight,
      elevation: 0,
      titleSpacing: 0,
      leading: widget.showBack
          ? IconButton(
              icon: const Icon(Icons.arrow_back_ios_new, size: 18),
              color: AppColors.textDark,
              onPressed: widget.onBack ?? () => GoRouter.of(context).go('/dashboard', extra: 0),
            )
          : null,
      title: Row(
        children: [
          const SizedBox(width: 16),
          Image.asset(
            'assets/splash/logo.jpg',
            height: 40, // larger logo
          ),
          const SizedBox(width: 12),
          Text(
            'Wekil AI',
            style: AppTypography.heading(fontSize: 20).copyWith(color: AppColors.primary),
          ),
        ],
      ),
      actions: [
        // Language selector with hover effect
        Padding(
          padding: const EdgeInsets.only(right: 8.0),
          child: MouseRegion(
            onEnter: (_) => setState(() => isHovering = true),
            onExit: (_) => setState(() => isHovering = false),
            cursor: SystemMouseCursors.click,
            child: PopupMenuButton<String>(
              tooltip: 'Select Language',
              onSelected: (lang) {
                _setLocale(lang);
              },
              itemBuilder: (context) => ['en', 'am'].map((lang) {
                return PopupMenuItem<String>(
                  value: lang,
                  child: Row(
                    children: [
                      Text(lang == 'en' ? 'English' : 'አማርኛ'),
                      const Spacer(),
                      if (_currentLocale == lang)
                        const Icon(
                          Icons.check,
                          size: 18,
                          color: AppColors.accent,
                        ),
                    ],
                  ),
                );
              }).toList(),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: isHovering ? AppColors.accent : Colors.transparent,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.language,
                      color: isHovering ? AppColors.textLight : AppColors.textDark,
                      size: 18,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      _currentLocale.toUpperCase(),
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: isHovering ? AppColors.textLight : AppColors.textDark,
                      ),
                    ),
                    Icon(
                      Icons.arrow_drop_down,
                      color: isHovering ? AppColors.textLight : AppColors.textDark.withOpacity(0.6),
                      size: 18,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),

        // Settings button
        Tooltip(
          message: 'Settings',
          child: IconButton(
            icon: const Icon(Icons.settings),
            iconSize: 20,
            color: AppColors.primary,
            style: IconButton.styleFrom(
              hoverColor: AppColors.accent.withOpacity(0.15),
              focusColor: AppColors.accent.withOpacity(0.20),
            ),
            onPressed: () {
              // Use GoRouter for navigation; push to keep back stack
              GoRouter.of(context).push('/settings');
            },
          ),
        ),
      ],
    );
  }

  //////////////////////////////////////////////////////////
  // this is the function that will change the language
  void _setLocale(String? value) {
    if (value == null) return;
    if (value == 'en') {
      _flutterLocalization.translate('en');
    } else if (value == 'am') {
      _flutterLocalization.translate('am');
    } else {
      return;
    }
    setState(() {
      _currentLocale = value;
    });
  }
}
