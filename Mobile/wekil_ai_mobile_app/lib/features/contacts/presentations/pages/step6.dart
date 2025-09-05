import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';
import 'package:wekil_ai_mobile_app/features/contacts/presentations/pages/step7.dart';
import 'package:wekil_ai_mobile_app/features/widget/progress_bar.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../data/models/contact_data.dart';
import '../../domain/usecases/modify_draft_usecase.dart';

class CreateStep5 extends StatefulWidget {
  final IntakeModel intakeModel;
  final String draftContractPdfUrl; // From GenerateDraft usecase
  final ModifyDraft? modifyDraft; // Injected usecase

  const CreateStep5({
    Key? key,
    required this.intakeModel,
    required this.draftContractPdfUrl,
    this.modifyDraft, // <-- optional now
  }) : super(key: key);

  @override
  State<CreateStep5> createState() => _CreateStep5State();
}

class _CreateStep5State extends State<CreateStep5> {
  final TextEditingController _changesController = TextEditingController();
  bool _isLoading = false;

  Future<void> _submitChanges() async {
    if (widget.modifyDraft == null) {
      // Backend not ready: just show a message and go back
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("ModifyDraft not available (backend not ready)"),
        ),
      );
      print('this is partes one:\n${widget.intakeModel.parties[0].name}');
      print('this is partes two:\n${widget.intakeModel.parties[1].name}');
      print('Intake Data (local test):\n${widget.intakeModel}');

      Navigator.pop(context, true);
      return;
    }

    setState(() => _isLoading = true);

    try {
      await widget.modifyDraft!(
        widget.intakeModel,
        _changesController.text,
      ); // use !
      Navigator.pop(context, true);
      // print('Intake Data after changes:\n${widget.intakeModel}'); // also log here
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Error: $e")));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: const BackButton(color: AppColors.textDark),
        title: Text("AI Generated Contract", style: AppTypography.heading()),
      ),
      body: Column(
        children: [
          StepProgressBar(currentStep: 6, totalSteps: 7),
          Expanded(child: SfPdfViewer.network(widget.draftContractPdfUrl)),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              controller: _changesController,
              decoration: InputDecoration(
                hintText: "Describe changes you want to make...",
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              maxLines: 3,
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isLoading
                    ? null
                    : () {
                        // Make sure your _submitChanges method finishes saving/updating data
                        _submitChanges();

                        // Then navigate to PDF page
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) =>
                                PdfChangerPage(intakeModel: widget.intakeModel),
                          ),
                        );
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
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text("Finish"),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
