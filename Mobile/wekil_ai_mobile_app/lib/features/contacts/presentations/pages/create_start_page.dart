import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_localization/flutter_localization.dart';
import 'package:wekil_ai_mobile_app/features/localization/locales.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
// Nav/Bottom bars are provided by MainScreen when used as a tab.

class CreateContractScreen extends StatefulWidget {
  const CreateContractScreen({Key? key}) : super(key: key);

  @override
  State<CreateContractScreen> createState() => _CreateContractScreenState();
}

class _CreateContractScreenState extends State<CreateContractScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
  // AppBar/BottomNav intentionally omitted here to prevent duplication
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildCreateContractHeader(),
            const SizedBox(height: 24),
            _buildImportantNoteCard(),
            const SizedBox(height: 24),
            _buildSelectContractTypeCard(context),
            const SizedBox(height: 24),
            _buildWarningCard()
          ],
        ),
      ),
    );
  }

  // Header
  Widget _buildCreateContractHeader() {
    return Column(
      children: [
        const SizedBox(height: 20),
        Text(
          LocalesData.Create_Contract.getString(context),
          style: AppTypography.heading().copyWith(fontSize: 24),
        ),
        const SizedBox(height: 8),
      ],
    );
  }

  // Important note card-
  Widget _buildImportantNoteCard() {
    return Card(
      color: Colors.orange[50],
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.orange.shade200),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(Icons.warning_amber, color: Colors.orange.shade700),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    LocalesData.Important.getString(context),
                    style: AppTypography.body().copyWith(
                      fontWeight: FontWeight.bold,
                      color: Colors.orange.shade700,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    LocalesData.explanation.getString(context),
                    style: AppTypography.small().copyWith(
                      fontSize: 12,
                      color: Colors.orange.shade700,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Select contract type card
  Widget _buildSelectContractTypeCard(BuildContext context) {
    return Card(
      color: AppColors.textLight,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: AppColors.textDark.withOpacity(0.3)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Icon(
              Icons.insert_drive_file_outlined,
              size: 40,
              color: AppColors.primary,
            ),
            const SizedBox(height: 16),
            Text(
              LocalesData.Get_Started_Now.getString(context),
              style: AppTypography.body(
                fontWeight: FontWeight.w600,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(height: 16),
      ElevatedButton(
              onPressed: () {
        // Use declarative route; ensure route exists in app_route if needed
        context.push('/contracts/types');
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: AppColors.textLight,
                padding: const EdgeInsets.symmetric(
                  horizontal: 60,
                  vertical: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(
                    8,
                  ), // smaller radius = more rectangular
                ),
                textStyle: AppTypography.button(),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(LocalesData.Continue.getString(context)),
                  SizedBox(width: 8),
                  Icon(Icons.arrow_forward, size: 16),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // 
  
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

  