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
    return Column(
      children: [
        // Optional label
        Text(
          "Step $currentStep of $totalSteps",
          style: AppTypography.body().copyWith(
            fontWeight: FontWeight.w600,
            color: Colors.grey.shade700,
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: List.generate(totalSteps * 2 - 1, (index) {
            if (index.isEven) {
              // Step Circle
              int stepIndex = (index ~/ 2) + 1;
              bool isActive = stepIndex <= currentStep;

              return AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                curve: Curves.easeInOut,
                width: 34,
                height: 34,
                decoration: BoxDecoration(
                  color: isActive ? AppColors.accent : Colors.white,
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: isActive ? AppColors.accent : Colors.grey.shade400,
                    width: 2,
                  ),
                  boxShadow: isActive
                      ? [
                          BoxShadow(
                            color: AppColors.accent.withOpacity(0.3),
                            blurRadius: 6,
                            offset: const Offset(0, 3),
                          ),
                        ]
                      : [],
                ),
                child: Center(
                  child: AnimatedDefaultTextStyle(
                    duration: const Duration(milliseconds: 300),
                    style: AppTypography.body().copyWith(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: isActive ? Colors.white : Colors.black87,
                    ),
                    child: Text("$stepIndex"),
                  ),
                ),
              );
            } else {
              // Connector Line
              bool isConnectorActive = index ~/ 2 < currentStep - 1;

              return Expanded(
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  height: 4,
                  margin: const EdgeInsets.symmetric(horizontal: 2),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(4),
                    gradient: isConnectorActive
                        ? LinearGradient(
                            colors: [
                              AppColors.accent,
                              AppColors.accent.withOpacity(0.7),
                            ],
                          )
                        : null,
                    color: isConnectorActive ? null : Colors.grey.shade300,
                  ),
                ),
              );
            }
          }),
        ),
      ],
    );
  }
}
