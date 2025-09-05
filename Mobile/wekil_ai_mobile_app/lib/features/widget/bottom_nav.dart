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
    return Container(
      height: 80,
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 6)],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(
            icon: Icons.dashboard_outlined,
            label: 'Dashboard',
            index: 0,
          ),
          _buildCreateButton(), // middle button
          _buildNavItem(
            icon: Icons.folder_outlined,
            label: 'Contracts',
            index: 2,
          ),
        ],
      ),
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
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: isActive
                ? AppColors.primary
                : AppColors.textDark.withOpacity(0.5),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: AppTypography.body().copyWith(
              fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
              fontSize: 12,
              color: isActive
                  ? AppColors.primary
                  : AppColors.textDark.withOpacity(0.5),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCreateButton() {
    bool isActive = currentIndex == 1;
    return GestureDetector(
      onTap: onCreatePressed,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: isActive ? AppColors.accentDark : AppColors.accent,
              shape: BoxShape.circle,
            ),
            child: Icon(Icons.add, color: Colors.white, size: 28),
          ),
          const SizedBox(height: 4),
          Text(
            'Create',
            style: AppTypography.body().copyWith(
              fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
              fontSize: 12,
              color: isActive
                  ? AppColors.primary
                  : AppColors.textDark.withOpacity(0.5),
            ),
          ),
        ],
      ),
    );
  }
}
