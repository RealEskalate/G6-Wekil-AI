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
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const NavBar(),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 24),
            const StepProgressBar(currentStep: 1, totalSteps: 7),
            const SizedBox(height: 24),
            Text(
              LocalesData.Select_Contract_Type.getString(context),
              style: AppTypography.heading().copyWith(fontSize: 24),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              LocalesData.Choose_the_type_of_contract_you_want_to_create.getString(context),
              style: AppTypography.body().copyWith(color: Colors.grey),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            _buildContractTypeCard(
              context,
              icon: Icons.business_center,
              title: LocalesData.Service_Agreement.getString(context),
              subtitle: LocalesData.Freelance_work_design_photography_consulting.getString(context),
              iconColor: Colors.blue,
              cardColor: Colors.blue.shade50,
              type: ContractType.serviceAgreement,
            ),
            _buildContractTypeCard(
              context,
              icon: Icons.shopping_bag,
              title:LocalesData.Sale_of_Goods.getString(context), 
              subtitle:LocalesData.Small_item_sales_product_delivery_terms.getString(context), 
              iconColor: Colors.green.shade800,
              cardColor: Colors.green.shade50,
              type: ContractType.salesOfGoods,
            ),
            _buildContractTypeCard(
              context,
              icon: Icons.groups,
              title: LocalesData.Simple_Loan_IOU.getString(context), 
              subtitle: LocalesData.Personal_loans_with_repayment_schedule.getString(context),
              iconColor: Colors.orange.shade800,
              cardColor: Colors.orange.shade50,
              type: ContractType.simpleLoan,
            ),
            _buildContractTypeCard(
              context,
              icon: Icons.security,
              title:LocalesData.Basic_NDA.getString(context),
              subtitle:LocalesData.Simple_confidentiality_agreement.getString(context) ,
              iconColor: Colors.purple.shade800,
              cardColor: Colors.purple.shade50,
              type: ContractType.basicNDA,
            ),
            const SizedBox(height: 24),
            _buildWarningCard(),
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
    required Color iconColor,
    required Color cardColor,
    required ContractType type,
  }) {
    return Card(
      color: cardColor,
      elevation: 3, // subtle shadow
      shadowColor: iconColor.withOpacity(0.3),
      margin: const EdgeInsets.symmetric(vertical: 12.0),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: iconColor, width: 0.5),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        splashColor: iconColor.withOpacity(0.1), // ripple effect
        onTap: () {
          context.push('/contracts/step2', extra: {
            'contractType': type,
          });
        },
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            children: [
              // Icon container
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: iconColor.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: iconColor, size: 28),
              ),
              const SizedBox(width: 16),
              // Text
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: AppTypography.body().copyWith(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textDark,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: AppTypography.body().copyWith(
                        fontSize: 14,
                        color: AppColors.textDark.withOpacity(0.7),
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.arrow_forward_ios, size: 18, color: Colors.grey),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildWarningCard() {
    return Card(
      color: Colors.amber.shade50,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.amber.shade200, width: 1),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.info_outline, color: Colors.amber.shade800),
                const SizedBox(width: 8),
                Text(
                  LocalesData.Not_for_Complex_Agreements.getString(context),
                  style: AppTypography.body().copyWith(
                    fontWeight: FontWeight.bold,
                    color: AppColors.textDark,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              LocalesData.This_tool_is_designed_for_basic_agreements_only_Please_consult_a_lawyer_for.getString(context),
              style: AppTypography.body().copyWith(
                fontSize: 14,
                color: AppColors.textDark.withOpacity(0.7),
              ),
            ),
            const SizedBox(height: 8),
            _buildBulletedText(
              LocalesData.Employment_contracts.getString(context),
              color: AppColors.textDark.withOpacity(0.7),
            ),
            _buildBulletedText(
              LocalesData.Real_estate_or_land_transfers.getString(context),
              color: AppColors.textDark.withOpacity(0.7),
            ),
            _buildBulletedText(
              LocalesData.Corporate_or_shareholder_agreements.getString(context),
              color: AppColors.textDark.withOpacity(0.7),
            ),
            _buildBulletedText(
              LocalesData.Government_tenders_or_regulated_industries.getString(context),
              color: AppColors.textDark.withOpacity(0.7),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBulletedText(String text, {Color? color}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2.0, horizontal: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('• ', style: TextStyle(color: color ?? AppColors.textDark)),
          Expanded(
            child: Text(
              text,
              style: AppTypography.body().copyWith(
                color: color ?? AppColors.textDark,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
