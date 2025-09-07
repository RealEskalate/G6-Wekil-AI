import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';
import 'package:wekil_ai_mobile_app/features/contacts/data/datasources/draft_remote_datasource.dart';
import 'package:wekil_ai_mobile_app/features/contacts/domain/usecases/regenerate_draft_usecase.dart';
import 'package:wekil_ai_mobile_app/features/contacts/presentations/pages/step7.dart';
import 'package:wekil_ai_mobile_app/features/widget/progress_bar.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../data/models/contact_data.dart';

class CreateStep5 extends StatefulWidget {
  final IntakeModel intakeModel;
  final String draftContractPdfUrl; // From GenerateDraft usecase
  final String? draftTitle;
  final List<dynamic>? draftSections;

  const CreateStep5({
    Key? key,
    required this.intakeModel,
    required this.draftContractPdfUrl,
    this.draftTitle,
    this.draftSections,
  }) : super(key: key);

  @override
  State<CreateStep5> createState() => _CreateStep5State();
}

class _CreateStep5State extends State<CreateStep5> {
  final TextEditingController _changesController = TextEditingController();
  bool _isLoadingPdf = false;
  bool _isLoadingAI = false;
  // ✅ Local mutable state
  String? _currentTitle;
  List<dynamic> _currentSections = [];
  Future<void> _submitChanges() async {
    // Placeholder: Keep existing saving/updating logic here if needed
    await Future.delayed(const Duration(seconds: 1)); // Simulate delay
  }

  @override
  void initState() {
    super.initState();
    _currentTitle = widget.draftTitle;
    _currentSections = List.from(widget.draftSections ?? []);
  }

  Future<void> _generateAI() async {
    setState(() => _isLoadingAI = true);

    final draftText = _currentSections.isNotEmpty
        ? _currentSections
              .map((s) => "${s['heading']}: ${s['text']}")
              .join("\n")
        : "";

    final prompt = _changesController.text.trim();
    if (prompt.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please enter a message for AI")),
      );
      setState(() => _isLoadingAI = false);
      return;
    }

    final usecase = RegenerateDraftUseCase(
      DraftRemoteDatasource(http.Client()),
    );

    try {
      final response = await usecase(
        draft: draftText,
        prompt: prompt,
        language: widget.intakeModel.language,
      );

      final payload = response["data"]?["payload"];
      final newTitle = payload?["title"];
      final newSections = payload?["sections"];

      if (newSections == null || newSections.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Sections not ready yet. Please try again."),
          ),
        );
      } else {
        setState(() {
          _currentSections = List.from(newSections);
          if (newTitle != null) {
            _currentTitle = newTitle; // ✅ update local title
          }
          _changesController.clear(); // ✅ clear the input after success
        });
      }
    } catch (e) {
      print("❌ Error: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Failed to regenerate draft. Try again.")),
      );
    }

    setState(() => _isLoadingAI = false);
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
          StepProgressBar(currentStep: 6, totalSteps: 7, stepLabels: ["Type","Basic Info","Parties","Genera","Specific","Preview","Success",],),

          Expanded(
            child: ListView.builder(
              itemCount: _currentSections.length,
              itemBuilder: (context, index) {
                final section = _currentSections[index];
                return ListTile(
                  title: Text(section['heading'] ?? ""),
                  subtitle: Text(section['text'] ?? ""),
                );
              },
            ),
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

          // Buttons Row
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                // Export to PDF Button
                Expanded(
                  child: ElevatedButton(
                    onPressed: _isLoadingPdf
                        ? null
                        : () async {
                            setState(() => _isLoadingPdf = true);
                            await _submitChanges();

                            // Navigate to PDF page
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => PdfChangerPage(
                                  intakeModel: widget.intakeModel,
                                  draftTitle: _currentTitle,
                                  draftSections: _currentSections,
                                ),
                              ),
                            );
                            if (mounted) {
                              setState(() => _isLoadingPdf = false);
                            }
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
                    child: _isLoadingPdf
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Text("Export to PDF"),
                  ),
                ),
                const SizedBox(width: 16),
                // Generate AI Button
                Expanded(
                  child: ElevatedButton(
                    onPressed: _isLoadingAI ? null : _generateAI,

                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: AppColors.textLight,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      textStyle: AppTypography.button(),
                    ),
                    child: _isLoadingAI
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Text("Generate AI"),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// import 'package:flutter/material.dart';
// import 'package:http/http.dart' as http;
// import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';
// import 'package:wekil_ai_mobile_app/features/contacts/data/datasources/modify_draft_remote_datasource.dart';
// import 'package:wekil_ai_mobile_app/features/contacts/domain/usecases/modify_draft_usecase.dart';
// import 'package:wekil_ai_mobile_app/features/contacts/presentations/pages/step7.dart';
// import 'package:wekil_ai_mobile_app/features/widget/progress_bar.dart';
// import '../../../../core/theme/app_colors.dart';
// import '../../../../core/theme/app_typography.dart';
// import '../../data/models/contact_data.dart';
// import '../../domain/usecases/modify_draft_usecase.dart';

// class CreateStep5 extends StatefulWidget {
//   final IntakeModel intakeModel;
//   final String draftContractPdfUrl; // From GenerateDraft usecase
//   // final ModifyDraftUseCase? modifyDraft; // Injected usecase
//   final String? draftTitle; // <-- new
//   final List<dynamic>? draftSections; // <-- new
//   const CreateStep5({
//     Key? key,
//     required this.intakeModel,
//     required this.draftContractPdfUrl,
//     this.draftTitle,
//     this.draftSections,
//   }) : super(key: key);

//   @override
//   State<CreateStep5> createState() => _CreateStep5State();
// }

// class _CreateStep5State extends State<CreateStep5> {
//   final TextEditingController _changesController = TextEditingController();
//   bool _isLoading = false;

//   Future<void> _submitChanges() async {}

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: AppColors.background,
//       appBar: AppBar(
//         backgroundColor: Colors.transparent,
//         elevation: 0,
//         leading: const BackButton(color: AppColors.textDark),
//         title: Text("AI Generated Contract", style: AppTypography.heading()),
//       ),
//       body: Column(
//         children: [
//           StepProgressBar(currentStep: 6, totalSteps: 7),

//           // Expanded(child: SfPdfViewer.network(widget.draftContractPdfUrl)),
//           Expanded(
//             child: ListView.builder(
//               itemCount: widget.draftSections?.length ?? 0,
//               itemBuilder: (context, index) {
//                 final section = widget.draftSections![index];
//                 return ListTile(
//                   title: Text(section['heading'] ?? ""),
//                   subtitle: Text(section['text'] ?? ""),
//                 );
//               },
//             ),
//           ),

//           Padding(
//             padding: const EdgeInsets.all(16.0),
//             child: TextField(
//               controller: _changesController,
//               decoration: InputDecoration(
//                 hintText: "Describe changes you want to make...",
//                 border: OutlineInputBorder(
//                   borderRadius: BorderRadius.circular(12),
//                 ),
//               ),
//               maxLines: 3,
//             ),
//           ),
//           Padding(
//             padding: const EdgeInsets.all(16.0),
//             child: SizedBox(
//               width: double.infinity,
//               child: ElevatedButton(
//                 onPressed: _isLoading
//                     ? null
//                     : () {
//                         // Make sure your _submitChanges method finishes saving/updating data
//                         _submitChanges();

//                         // Then navigate to PDF page
//                         Navigator.push(
//                           context,
//                           MaterialPageRoute(
//                             builder: (context) =>
//                                 PdfChangerPage(intakeModel: widget.intakeModel),
//                           ),
//                         );
//                       },
//                 style: ElevatedButton.styleFrom(
//                   backgroundColor: AppColors.accent,
//                   foregroundColor: AppColors.textLight,
//                   padding: const EdgeInsets.symmetric(vertical: 16),
//                   shape: RoundedRectangleBorder(
//                     borderRadius: BorderRadius.circular(12),
//                   ),
//                   textStyle: AppTypography.button(),
//                 ),
//                 child: _isLoading
//                     ? const CircularProgressIndicator(color: Colors.white)
//                     : const Text("Finish"),
//               ),
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }
