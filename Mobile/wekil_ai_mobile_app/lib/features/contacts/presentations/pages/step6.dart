import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';
import 'package:wekil_ai_mobile_app/features/widget/progress_bar.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../data/models/contact_data.dart';
import '../../domain/usecases/modify_draft_usecase.dart';

class CreateStep5 extends StatefulWidget {
  final IntakeModel intakeModel;
  final String draftContractPdfUrl; // From GenerateDraft usecase
  final ModifyDraft modifyDraft;    // Injected usecase

  const CreateStep5({
    Key? key,
    required this.intakeModel,
    required this.draftContractPdfUrl,
    required this.modifyDraft,
  }) : super(key: key);

  @override
  State<CreateStep5> createState() => _CreateStep5State();
}

class _CreateStep5State extends State<CreateStep5> {
  final TextEditingController _changesController = TextEditingController();
  bool _isLoading = false;

  Future<void> _submitChanges() async {
    setState(() => _isLoading = true);

    try {
      await widget.modifyDraft(widget.intakeModel, _changesController.text);

      Navigator.pop(context, true);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error: $e")),
      );
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
          Expanded(
            child: SfPdfViewer.network(widget.draftContractPdfUrl),
          ),
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
                onPressed: _isLoading ? null : _submitChanges,
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
