import 'package:flutter/material.dart';
<<<<<<< HEAD
import 'package:http/http.dart' as http;
import 'package:wekil_ai_mobile_app/features/contacts/data/datasources/contract_api.dart';
import 'package:wekil_ai_mobile_app/features/contacts/data/datasources/draft_remote_datasource.dart';
import 'package:wekil_ai_mobile_app/features/contacts/data/repositories/contract_repository_impl.dart';
import 'package:wekil_ai_mobile_app/features/contacts/domain/usecases/create_draft_usecase.dart';
import 'package:wekil_ai_mobile_app/features/contacts/domain/usecases/generate_draft_usecase.dart.dart.dart';
import 'package:wekil_ai_mobile_app/features/contacts/domain/usecases/modify_draft_usecase.dart';
=======
import 'package:go_router/go_router.dart';
>>>>>>> 653810666dc2b095ee44bd8ee6978bb6cdf4a170
import 'package:wekil_ai_mobile_app/features/widget/progress_bar.dart';
import '../../data/models/contact_data.dart';
import '../../../widget/contract_specificatio.dart';
import '../../domain/entities/contract_type.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';

class CreateStep4 extends StatefulWidget {
  final ContractType contractType;
  final IntakeModel intakeModel;

  const CreateStep4({
    Key? key,
    required this.intakeModel,
    required this.contractType,
  }) : super(key: key);

  @override
  State<CreateStep4> createState() => _CreateStep4State();
}

class _CreateStep4State extends State<CreateStep4> {
  final GlobalKey<ContractSpecificDetailsState> detailsKey = GlobalKey();
  bool _isLoading = false;

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
                contractType: widget.contractType,
                contractData: widget.intakeModel,
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isLoading
                    ? null
                    : () async {
                        detailsKey.currentState?.saveToContractData();
                        setState(() => _isLoading = true); // start loading

                        try {
                          final datasource = DraftRemoteDatasource(
                            http.Client(),
                          );
                          final createDraft = CreateDraftUseCase(datasource);

<<<<<<< HEAD
                          final draftPayload = {
                            "title": widget.contractType.name,
                            "sections": [
                              {
                                "heading": "Confidentiality",
                                "text": widget.intakeModel.services,
                              },
                            ],
                          };

                          print(
                            "📤 Sending request: {draft: $draftPayload, language: ${widget.intakeModel.language}}",
                          );

                          final response = await createDraft(
                            draft: draftPayload,
                            language: widget.intakeModel.language,
                          );

                          print("✅ Draft response: $response");
                          final title = response['data']?['payload']?['title'];
                          // check if sections exist in response
                          final sections =
                              response['data']?['payload']?['sections'];
                          if (sections == null || sections.isEmpty) {
                            print("⚠️ Sections are null, try again later");
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text(
                                  "Sections not ready yet. Please try again.",
                                ),
                              ),
                            );
                            setState(() => _isLoading = false); // stop loading
                            return;
                          }

                          final draftUrl =
                              "https://example.com/fake-contract.pdf"; // keep your draftUrl code
                          setState(
                            () => _isLoading = false,
                          ); // reset before navigating
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => CreateStep5(
                                intakeModel: widget.intakeModel,
                                draftContractPdfUrl: draftUrl,
                                draftTitle: title,
                                draftSections: sections,  // <-- send sections
                              ),
                            ),
                          );
                        } catch (e) {
                          print("❌ Error while generating draft: $e");
                          setState(
                            () => _isLoading = false,
                          ); // stop loading on error
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text(
                                "Failed to generate draft. Try again.",
                              ),
                            ),
                          );
                        }
                      },
=======
                  // final draftUrl = await generateDraft(intakeModel);
                  final draftUrl = "https://example.com/fake-contract.pdf";
                  context.push('/contracts/step6', extra: {
                    'intakeModel': intakeModel,
                    'draftContractPdfUrl': draftUrl,
                  });
                },
>>>>>>> 653810666dc2b095ee44bd8ee6978bb6cdf4a170
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.accent,
                  foregroundColor: AppColors.textLight,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  textStyle: AppTypography.button(),
                ),
                child: _isLoading
                    ? const SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      )
                    : const Text("Next"),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
