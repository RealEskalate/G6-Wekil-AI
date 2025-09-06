import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_localization/flutter_localization.dart';
import 'package:wekil_ai_mobile_app/features/localization/locales.dart';
import 'package:wekil_ai_mobile_app/features/widget/nav_bar.dart';
import 'package:wekil_ai_mobile_app/features/widget/progress_bar.dart';
import '../../domain/entities/contract_type.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';

class ContractsTypesPages extends StatefulWidget {
  const ContractsTypesPages({Key? key}) : super(key: key);

  @override
  State<ContractsTypesPages> createState() => _ContractsTypesPagesState();
}

class _ContractsTypesPagesState extends State<ContractsTypesPages> {
  ContractType? _selectedType; // store selected contract type

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const NavBar(),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 24),
             Text(
              LocalesData.Select_Contract_Type.getString(context),
              style: AppTypography.heading().copyWith(fontSize: 20),
            ),
            const SizedBox(height: 8),
            const StepProgressBar(
              currentStep: 1,
              stepLabels: [
                "Type",
                "Basic Info",
                "Parties",
                "Genera",
                "Specific",
                "Preview",
                "Success",
              ], totalSteps: 7,
            ),
            const SizedBox(height: 24),

            // Cards
            Expanded(
              child: ListView(
                children: [
                  _buildContractTypeCard(
                    context,
                    icon: Icons.business_center,
                    title: LocalesData.Service_Agreement.getString(context),
                    subtitle: LocalesData.Freelance_work_design_photography_consulting.getString(context),
                    example: "Example: Logo design for 5,000 ETB",
                    cardColor: Colors.blue.shade100,
                    type: ContractType.serviceAgreement,
                  ),
                  _buildContractTypeCard(
                    context,
                    icon: Icons.shopping_bag,
                    title: LocalesData.Sale_of_Goods.getString(context),
                    subtitle: LocalesData.Small_item_sales_product_delivery_terms.getString(context),
                    example: "Example: Electronics sale with warranty",
                    cardColor: Colors.blue.shade100,
                    type: ContractType.salesOfGoods,
                  ),
                  _buildContractTypeCard(
                    context,
                    icon: Icons.groups,
                    title: LocalesData.Simple_Loan_IOU.getString(context),
                    subtitle: LocalesData.Personal_loans_with_repayment_schedule.getString(context),
                    example: "Example: 15,000 ETB loan, 3 months repayment",
                    cardColor: Colors.blue.shade100,
                    type: ContractType.simpleLoan,
                  ),
                  _buildContractTypeCard(
                    context,
                    icon: Icons.security,
                    title: LocalesData.Basic_NDA.getString(context),
                    subtitle: LocalesData.Simple_confidentiality_agreement.getString(context),
                    example: "Example: Protect business idea discussions",
                    cardColor: Colors.blue.shade100,
                    type: ContractType.basicNDA,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Navigation Buttons
            Row(
              children: [
                _buildNavButton("Previous", AppColors.primary, () {
                  context.pop();
                }),
                _buildNavButton(
                  "Next",
                  _selectedType == null ? Colors.grey : AppColors.primary,
                  _selectedType == null
                      ? null
                      : () {
                          context.push('/contracts/step2', extra: {
                            'contractType': _selectedType,
                          });
                        },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }


  Widget _buildContractTypeCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required String example,
    required Color cardColor,
    required ContractType type,
  }) {
    final isSelected = _selectedType == type;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: isSelected ? AppColors.primary.withOpacity(0.2) : cardColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isSelected ? AppColors.primary : Colors.transparent,
          width: 2,
        ),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () {
          setState(() {
            _selectedType = type;
          });
        },
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Icon square
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, color: AppColors.primary, size: 24),
              ),
              const SizedBox(width: 16),

              // Text
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title,
                        style: AppTypography.body().copyWith(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textDark,
                        )),
                    const SizedBox(height: 4),
                    Text(subtitle,
                        style: AppTypography.body().copyWith(
                          fontSize: 14,
                          color: AppColors.textDark,
                        )),
                    const SizedBox(height: 4),
                    Text(example,
                        style: AppTypography.body().copyWith(
                          fontSize: 12,
                          color: Colors.black54,
                          fontStyle: FontStyle.italic,
                        )),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavButton(String text, Color color, VoidCallback? onTap) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 6),
        height: 48,
        child: ElevatedButton(
          onPressed: onTap,
          style: ElevatedButton.styleFrom(
            backgroundColor: color,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
            ),
          ),
          child: Text(
            text,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ),
      ),
    );
  }
}
