import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';

class NavBar extends StatelessWidget implements PreferredSizeWidget {
  const NavBar({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      automaticallyImplyLeading: false, // Removes back button if not needed
      title: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Image.asset(
            'assets/logo.jpg', // Replace with your logo path
            height: 28,
          ),
          const SizedBox(width: 8),
          Text(
            'Wekil AI',
            style: AppTypography.heading().copyWith(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppColors.textDark,
            ),
          ),
        ],
      ),

      actions: [
        // Language button with icon + text for better UX
        Row(
          children: [
            IconButton(
              icon: const Icon(Icons.language),
              color: AppColors.textDark.withOpacity(0.7),
              onPressed: () {
                // Handle language change logic
              },
            ),
            TextButton(
              onPressed: () {
                // Handle language toggle (EN/አማ)
              },
              child: Text(
                'EN',
                style: AppTypography.body().copyWith(
                  fontWeight: FontWeight.bold,
                  color: AppColors.textDark.withOpacity(0.7),
                ),
              ),
            ),
          ],
        ),

        IconButton(
          icon: const Icon(Icons.settings),
          color: AppColors.textDark.withOpacity(0.7),
          onPressed: () {
            // Handle settings navigation
          },
        ),
      ],

      backgroundColor: Colors.white,
      elevation: 0,
      centerTitle: true, // Keeps it neat in the middle
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
