import 'package:flutter/material.dart';
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
                setState(() {
                  currentLanguage = lang;
                });
              },
              itemBuilder: (context) => ['EN', 'AM'].map((lang) {
                return PopupMenuItem<String>(
                  value: lang,
                  child: Row(
                    children: [
                      Text(
                        lang == 'EN' ? 'English' : 'Amharic',
                        style: AppTypography.body(),
                      ),
                      const Spacer(),
                      if (currentLanguage == lang)
                        const Icon(
                          Icons.check,
                          size: 18,
                          color: AppColors.primary,
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
                      color: isHovering
                          ? Colors.white
                          : AppColors.textDark.withOpacity(0.7),
                      size: 18,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      currentLanguage,
                      style: AppTypography.body().copyWith(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: isHovering
                            ? Colors.white
                            : AppColors.textDark.withOpacity(0.7),
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
        IconButton(
          icon: const Icon(Icons.settings),
          iconSize: 18,
          color: AppColors.textDark.withOpacity(0.7),
          onPressed: () {},
        ),
      ],
    );
  }
}
