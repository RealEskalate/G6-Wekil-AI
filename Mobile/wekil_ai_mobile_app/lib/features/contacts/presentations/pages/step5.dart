import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:wekil_ai_mobile_app/features/widget/progress_bar.dart';
import '../../data/models/contact_data.dart';
import '../../../widget/contract_specificatio.dart';
import '../../domain/entities/contract_type.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';

class CreateStep4 extends StatelessWidget {
  final ContractType contractType;
  final IntakeModel intakeModel;
  final GlobalKey<ContractSpecificDetailsState> detailsKey = GlobalKey();

  CreateStep4({Key? key, required this.intakeModel, required this.contractType})
    : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: const BackButton(color: AppColors.textDark),
        title: Text("Contract Details", style: AppTypography.heading()),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            StepProgressBar(currentStep: 5, totalSteps: 7),
            Expanded(
              child: ContractSpecificDetails(
                key: detailsKey,
                contractType: contractType,
                contractData: intakeModel,
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () async {
                  detailsKey.currentState?.saveToContractData();

                  // final repository = ContractRepositoryImpl(ContractApi());
                  // final generateDraft = GenerateDraft(repository);
                  // final modifyDraft = ModifyDraft(repository);

                  // final draftUrl = await generateDraft(intakeModel);
                  final draftUrl = "https://example.com/fake-contract.pdf";
                  context.push('/contracts/step6', extra: {
                    'intakeModel': intakeModel,
                    'draftContractPdfUrl': draftUrl,
                  });
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.accent,
                  foregroundColor: AppColors.textLight,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  textStyle: AppTypography.button(),
                ),
                child: const Text("Next"),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
