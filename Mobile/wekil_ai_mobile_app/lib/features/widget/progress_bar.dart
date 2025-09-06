import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';

class StepProgressBar extends StatelessWidget {
  final int currentStep; // from 1 to totalSteps
  final List<String> stepLabels;

  const StepProgressBar({
    Key? key,
    required this.currentStep,
    required this.stepLabels,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    int totalSteps = stepLabels.length;

    return Column(
      children: [
        Row(
          children: List.generate(totalSteps * 2 - 1, (index) {
            if (index.isEven) {
              int stepIndex = (index ~/ 2) + 1;
              bool isCompleted = stepIndex < currentStep;
              bool isActive = stepIndex == currentStep;

              return Column(
                children: [
                  // Circle
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    width: 34,
                    height: 34,
                    decoration: BoxDecoration(
                      color: isCompleted ? AppColors.accent : Colors.white,
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: isActive
                            ? AppColors.accent
                            : (isCompleted
                                ? AppColors.accent
                                : Colors.grey.shade400),
                        width: 2,
                      ),
                    ),
                    child: Center(
                      child: isCompleted
                          ? const Icon(Icons.check,
                              color: Colors.white, size: 20)
                          : Text(
                              "$stepIndex",
                              style: AppTypography.body().copyWith(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: isActive
                                    ? AppColors.accent
                                    : Colors.black87,
                              ),
                            ),
                    ),
                  ),
                  const SizedBox(height: 6),
                  // Show only current step label
                  if (isActive)
                    Text(
                      stepLabels[stepIndex - 1],
                      style: AppTypography.body().copyWith(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: AppColors.accent,
                      ),
                    ),
                ],
              );
            } else {
              // Connector
              bool isConnectorActive = index ~/ 2 < currentStep - 1;
              return Expanded(
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  height: 3,
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(4),
                    color: isConnectorActive
                        ? AppColors.accent
                        : Colors.grey.shade300,
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