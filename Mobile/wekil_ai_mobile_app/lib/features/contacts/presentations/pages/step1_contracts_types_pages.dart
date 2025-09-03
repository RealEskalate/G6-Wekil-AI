import 'package:flutter/material.dart';
import 'package:wekil_ai_mobile_app/features/contacts/presentations/pages/step2.dart';
import 'package:wekil_ai_mobile_app/features/widget/nav_bar.dart';
import 'package:wekil_ai_mobile_app/features/widget/progress_bar.dart';
import '../../domain/entities/contract_type.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';

class ContractsTypesPages extends StatelessWidget {
  const ContractsTypesPages({Key? key}) : super(key: key);

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
              'Select Contract Type',
              style: AppTypography.heading().copyWith(fontSize: 24),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'Choose the type of contract you want to create',
              style: AppTypography.body().copyWith(color: Colors.grey),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            _buildContractTypeCard(
              context,
              icon: Icons.business_center,
              title: 'Service Agreement',
              subtitle: 'Freelance work, design, photography, consulting',
              iconColor: Colors.blue,
              cardColor: Colors.blue.shade50,
              type: ContractType.serviceAgreement,
            ),
            _buildContractTypeCard(
              context,
              icon: Icons.shopping_bag,
              title: 'Sale of Goods',
              subtitle: 'Small item sales, product delivery terms',
              iconColor: Colors.green.shade800,
              cardColor: Colors.green.shade50,
              type: ContractType.salesOfGoods,
            ),
            _buildContractTypeCard(
              context,
              icon: Icons.groups,
              title: 'Simple Loan (IOU)',
              subtitle: 'Personal loans with repayment schedule',
              iconColor: Colors.orange.shade800,
              cardColor: Colors.orange.shade50,
              type: ContractType.simpleLoan,
            ),
            _buildContractTypeCard(
              context,
              icon: Icons.security,
              title: 'Basic NDA',
              subtitle: 'Simple confidentiality agreement',
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
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => CreateStep1(contractType: type),
          ),
        );
      },
      child: Card(
        color: cardColor,
        margin: const EdgeInsets.symmetric(vertical: 8.0),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(color: iconColor.withOpacity(0.5), width: 1.5),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.textLight,
                  shape: BoxShape.circle,
                  border: Border.all(color: iconColor.withOpacity(0.5)),
                ),
                child: Icon(icon, color: iconColor, size: 28),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: AppTypography.body().copyWith(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
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
                  'Not for Complex Agreements',
                  style: AppTypography.body().copyWith(
                    fontWeight: FontWeight.bold,
                    color: AppColors.textDark,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'This tool is designed for basic agreements only. Please consult a lawyer for:',
              style: AppTypography.body().copyWith(
                fontSize: 14,
                color: AppColors.textDark.withOpacity(0.7),
              ),
            ),
            const SizedBox(height: 8),
            _buildBulletedText(
              'Employment contracts',
              color: AppColors.textDark.withOpacity(0.7),
            ),
            _buildBulletedText(
              'Real estate or land transfers',
              color: AppColors.textDark.withOpacity(0.7),
            ),
            _buildBulletedText(
              'Corporate or shareholder agreements',
              color: AppColors.textDark.withOpacity(0.7),
            ),
            _buildBulletedText(
              'Government tenders or regulated industries',
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
