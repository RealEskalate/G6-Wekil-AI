import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';

class BottomNav extends StatelessWidget {
  final int currentIndex;
  final Function(int) onItemSelected;
  final VoidCallback onCreatePressed;

  const BottomNav({
    Key? key,
    required this.currentIndex,
    required this.onItemSelected,
    required this.onCreatePressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.bottomCenter,
      children: [
        // Bottom navigation background
        Container(
          height: 70,
          decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black12,
                blurRadius: 6,
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(
                icon: Icons.dashboard_outlined,
                label: 'Dashboard',
                index: 0,
              ),
              SizedBox(width: 80), // Space for the floating create button
              _buildNavItem(
                icon: Icons.folder_outlined,
                label: 'Contracts',
                index: 2,
              ),
            ],
          ),
        ),

        // Floating create button
        Positioned(
          bottom: 10,
          child: GestureDetector(
            onTap: onCreatePressed,
            child: Container(
              width: 70,
              height: 70,
              decoration: BoxDecoration(
                color: AppColors.primary,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primary.withOpacity(0.4),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: const Icon(
                Icons.add,
                size: 36,
                color: Colors.white,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildNavItem({
    required IconData icon,
    required String label,
    required int index,
  }) {
    bool isActive = currentIndex == index;
    return GestureDetector(
      onTap: () => onItemSelected(index),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: isActive ? AppColors.primary : AppColors.textDark.withOpacity(0.5),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: AppTypography.body().copyWith(
              fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
              fontSize: 12,
              color: isActive ? AppColors.primary : AppColors.textDark.withOpacity(0.5),
            ),
          ),
        ],
      ),
    );
  }
}
