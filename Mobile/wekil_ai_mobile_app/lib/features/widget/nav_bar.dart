import 'package:flutter/material.dart';
import 'package:flutter_localization/flutter_localization.dart';
import 'package:wekil_ai_mobile_app/features/localization/locales.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';

class NavBar extends StatefulWidget implements PreferredSizeWidget {
  const NavBar({Key? key}) : super(key: key);

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
      backgroundColor: Colors.white,
      elevation: 0,
      titleSpacing: 0,
      title: Row(
        children: [
          const SizedBox(width: 16),
          Image.asset(
            'assets/logo.jpg',
            height: 40, // larger logo
          ),
          const SizedBox(width: 12),
          Text('Wekil AI', style: AppTypography.heading(fontSize: 20)),
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
                          color: Colors.green, // You can use AppColors.primary
                        ),
                    ],
                  ),
                );
              }).toList(),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: isHovering
                      ? Colors.green.withOpacity(0.8)
                      : Colors.transparent, // AppColors.accent
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.language,
                      color: isHovering
                          ? Colors.white
                          : Colors
                                .black87, // AppColors.textDark.withOpacity(0.7)
                      size: 18,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      _currentLocale.toUpperCase(),
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: isHovering ? Colors.white : Colors.black87,
                      ),
                    ),
                    Icon(
                      Icons.arrow_drop_down,
                      color: isHovering ? Colors.white : Colors.black54,
                      size: 18,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),

        // Settings button
        IconButton(
          icon: const Icon(Icons.settings),
          iconSize: 18,
          color: Colors.black54, // AppColors.textDark.withOpacity(0.7)
          onPressed: () {},
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
