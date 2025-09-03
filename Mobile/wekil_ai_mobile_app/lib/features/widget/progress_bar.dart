import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';

class StepProgressBar extends StatelessWidget {
  final int currentStep; // from 1 to totalSteps
  final int totalSteps;

  const StepProgressBar({
    Key? key,
    required this.currentStep,
    required this.totalSteps,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      children: List.generate(totalSteps * 2 - 1, (index) {
        if (index.isEven) {
          // Step Circle
          int stepIndex = (index ~/ 2) + 1;
          bool isActive = stepIndex <= currentStep;

          return Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: isActive ? AppColors.primary : AppColors.accent,
              shape: BoxShape.circle,
              border: Border.all(
                color: isActive ? AppColors.primary : AppColors.accent,
                width: 2,
              ),
              boxShadow: isActive
                  ? [
                      BoxShadow(
                        color: AppColors.primary.withOpacity(0.3),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      )
                    ]
                  : [],
            ),
            child: Center(
              child: Text(
                "$stepIndex",
                style: AppTypography.body().copyWith(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: isActive ? Colors.white : Colors.black87,
                ),
              ),
            ),
          );
        } else {
          // Connector Line
          return Expanded(
            child: Container(
              height: 4,
              color: index ~/ 2 < currentStep - 1
                  ? AppColors.primary
                  : Colors.grey[300],
            ),
          );
        }
      }),
    );
  }
}
