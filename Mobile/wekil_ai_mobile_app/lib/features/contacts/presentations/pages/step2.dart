import 'package:flutter/material.dart';
import 'package:wekil_ai_mobile_app/features/contacts/presentations/pages/step3.dart';
import '../../../widget/progress_bar.dart';
import '../../data/models/contact_data.dart';
import '../../domain/entities/contract_type.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';

class CreateStep1 extends StatefulWidget {
  final ContractType contractType;

  const CreateStep1({Key? key, required this.contractType}) : super(key: key);

  @override
  State<CreateStep1> createState() => _CreateStep1State();
}

class _CreateStep1State extends State<CreateStep1> {
  final TextEditingController descriptionController = TextEditingController();
  String selectedLanguage = "English";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: const BackButton(color: AppColors.textDark),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Title
            
            Text(
              "Create ${_getContractTitle(widget.contractType)}",
              
              style: AppTypography.heading().copyWith(fontSize: 20),
            ),
            const SizedBox(height: 4),
            Text(
              "Step 2 of 7: Basic Info",
              style: AppTypography.body().copyWith(color: Colors.grey[700]),
            ),
            const SizedBox(height: 20),

            // Step Progress Indicator
            const StepProgressBar(currentStep: 2, totalSteps: 7),
            const SizedBox(height: 24),

            // Card for form
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.textLight,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.shade200,
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Basic Info",
                    style: AppTypography.body().copyWith(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Contract Language Dropdown
                  Text("Contract Language", style: AppTypography.body()),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<String>(
                    value: selectedLanguage,
                    items: ["English", "Amharic"].map((lang) {
                      return DropdownMenuItem(
                        value: lang,
                        child: Text(lang, style: AppTypography.body()),
                      );
                    }).toList(),
                    onChanged: (value) {
                      setState(() {
                        selectedLanguage = value!;
                      });
                    },
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      contentPadding: EdgeInsets.symmetric(horizontal: 12),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Quick Description (Type-specific)
                  Text(
                    widget.contractType == ContractType.serviceAgreement
                        ? "Describe your services"
                        : widget.contractType == ContractType.salesOfGoods
                            ? "Describe your goods / delivery terms"
                            : "Quick Description (Optional)",
                    style: AppTypography.body(),
                  ),
                  const SizedBox(height: 6),
                  TextField(
                    controller: descriptionController,
                    maxLines: 3,
                    decoration: InputDecoration(
                      hintText: widget.contractType ==
                              ContractType.serviceAgreement
                          ? "e.g. Logo design, 5000 birr, 2 weeks"
                          : widget.contractType == ContractType.salesOfGoods
                              ? "e.g. 100 items, delivery in 3 days"
                              : "Optional description of the deal",
                      border: const OutlineInputBorder(),
                      fillColor: Colors.grey[50],
                      filled: true,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    "This information helps us pre-fill your contract.",
                    style: AppTypography.body().copyWith(
                      color: Colors.grey[600],
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Navigation Buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.textDark,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      textStyle: AppTypography.button(),
                    ),
                    child: const Text("← Previous"),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      final intake = IntakeModel(
                        language: selectedLanguage,
                        contractType: widget.contractType,
                        parties: [],
                        location: '',
                        currency: '',
                        dueDates: [],
                        startDate: DateTime.now(),
                        endDate: DateTime.now().add(const Duration(days: 30)),
                        services: widget.contractType ==
                                ContractType.serviceAgreement
                            ? descriptionController.text
                            : null,
                        deliveryTerms: widget.contractType ==
                                ContractType.salesOfGoods
                            ? descriptionController.text
                            : null,
                      );

                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => CreateStep2(
                            intake: intake,
                            contractType: widget.contractType,
                          ),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      textStyle: AppTypography.button(),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Text("Next"),
                        SizedBox(width: 8),
                        Icon(Icons.arrow_forward, size: 18),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  String _getContractTitle(ContractType type) {

    switch (type) {
      case ContractType.serviceAgreement:
        return "Service Agreement";
      case ContractType.simpleLoan:
        return "Simple Loan (IOU)";
      case ContractType.salesOfGoods:
        return "Sale of Goods";
      case ContractType.basicNDA:
        return "Basic NDA";
    }
  }
}
