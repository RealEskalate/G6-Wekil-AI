import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_localization/flutter_localization.dart';

import 'package:http/http.dart' as http;
import 'package:wekil_ai_mobile_app/features/contacts/data/datasources/classify_remote_datasource.dart';
import 'package:wekil_ai_mobile_app/features/contacts/domain/usecases/classify_text.dart';
import 'package:wekil_ai_mobile_app/features/contacts/presentations/pages/step3.dart';

import 'package:wekil_ai_mobile_app/features/localization/locales.dart';
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
  bool isLoading = false;

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
            const SizedBox(height: 20),

            // Step Progress Indicator
            const StepProgressBar(currentStep: 2,  stepLabels: ["Type","Basic Info","Parties","Genera","Specific","Preview","Success",], totalSteps: 7,),
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
                    LocalesData.Basic_Info.getString(context),
                    style: AppTypography.body().copyWith(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Contract Language Dropdown
                  Text(
                    LocalesData.Contract_Language.getString(context),
                    style: AppTypography.body(),
                  ),
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
                        ? LocalesData.Describe_your_services.getString(context)
                        : widget.contractType == ContractType.salesOfGoods
                        ? LocalesData
                              .Describe_your_goods_delivery_terms.getString(
                            context,
                          )
                        : LocalesData.Quick_Description_Optional.getString(
                            context,
                          ),
                    style: AppTypography.body(),
                  ),
                  const SizedBox(height: 6),
                  TextField(
                    controller: descriptionController,
                    maxLines: 3,
                    decoration: InputDecoration(
                      hintText:
                          widget.contractType == ContractType.serviceAgreement
                          ? LocalesData.eg_Logo_design_5000_birr_2_weeks
                                .getString(context)
                          : widget.contractType == ContractType.salesOfGoods
                          ? LocalesData.eg_100_items_delivery_in_3_days
                                .getString(context)
                          : LocalesData
                                .Optional_description_of_the_deal.getString(
                              context,
                            ),
                      border: const OutlineInputBorder(),
                      fillColor: Colors.grey[50],
                      filled: true,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    LocalesData
                        .This_information_helps_us_pre_fill_your_contract.getString(
                      context,
                    ),
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
                    onPressed: () => context.pop(),
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

                  child: Expanded(
                    child:ElevatedButton(
  onPressed: isLoading
      ? null // disable button when loading
      : () async {
          final description = descriptionController.text.trim();
          if (description.isEmpty) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text("Please enter a description"),
              ),
            );
            return;
          }

          // Start loading
          setState(() => isLoading = true);

          final usecase = ClassifyTextUseCase(
            ClassifyRemoteDatasource(http.Client()),
          );

          try {
            final category = await usecase(description);

            if (category.toLowerCase() == "basic") {
              final intake = IntakeModel(
                language: selectedLanguage,
                contractType: widget.contractType,
                parties: [],
                location: '',
                currency: '',
                dueDates: [],
                startDate: DateTime.now(),
                endDate: DateTime.now().add(
                  const Duration(days: 30),
                ),
                services: widget.contractType == ContractType.serviceAgreement
                    ? description
                    : null,
                deliveryTerms:
                    widget.contractType == ContractType.salesOfGoods
                        ? description
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
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text("We cannot create this type of agreement."),
                ),
              );
            }
          } catch (e) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text("Error: $e")),
            );
          } finally {
            // Stop loading
            if (mounted) setState(() => isLoading = false);
          }
        },
  style: ElevatedButton.styleFrom(
    backgroundColor: AppColors.primary,
    padding: const EdgeInsets.symmetric(vertical: 16),
    textStyle: AppTypography.button(),
  ),
  child: isLoading
      ? const SizedBox(
          height: 20,
          width: 20,
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
            strokeWidth: 2,
          ),
        )
      : Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Text("Next"),
            SizedBox(width: 8),
            Icon(Icons.arrow_forward, size: 18),
          ],
        ),
)

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
