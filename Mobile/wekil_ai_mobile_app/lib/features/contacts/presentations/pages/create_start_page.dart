import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_localization/flutter_localization.dart';
import 'package:wekil_ai_mobile_app/features/localization/locales.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';

class CreateContractScreen extends StatefulWidget {
  const CreateContractScreen({Key? key}) : super(key: key);

  @override
  State<CreateContractScreen> createState() => _CreateContractScreenState();
}

class _CreateContractScreenState extends State<CreateContractScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
            _buildFeatureTile(
              icon: Icons.access_time,
              title: LocalesData.Fast_and_Simple.getString(context) ,
              subtitle: LocalesData.Create_contracts_in_minutes.getString(context),
              iconColor: Colors.green,
              titleSize: 13, // smaller font
              titleColor: Colors.green.shade800,
              subtitleSize: 11,
              subtitleColor: AppColors.primaryDark, // custom color
            ),

            _buildFeatureTile(
              icon: Icons.translate,
              title: LocalesData.Bilingual_Support.getString(context),
              subtitle:  LocalesData.Available_in_Amharic_and_English.getString(context),
              iconColor: Colors.blue,
              titleSize: 13,
              titleColor: Colors.blue.shade800,
              subtitleSize: 11,
              subtitleColor: AppColors.primaryDark,
            ),

            _buildFeatureTile(
              icon: Icons.storage,
              title: LocalesData.Locally_Stored.getString(context) ,
              subtitle: LocalesData.All_contracts_stored_on_your_device.getString(context),
              iconColor: Colors.purple,
              titleSize: 13,
              titleColor: Colors.purple.shade800,
              subtitleSize: 11,
              subtitleColor: AppColors.primaryDark,
            ),
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

  // Feature tiles
  Widget _buildFeatureTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color iconColor,
    Color? subtitleColor,
    double? subtitleSize, // optional font size
    double? titleSize, // optional font size
    Color? titleColor, // optional color
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: iconColor, size: 24),
          ),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: AppTypography.body().copyWith(
                  fontWeight: FontWeight.bold,
                  fontSize: titleSize ?? 16, // default size
                  color: titleColor ?? AppColors.textDark, // default color
                ),
              ),
              Text(
                subtitle,
                style: AppTypography.body().copyWith(
                  color: AppColors.textDark.withOpacity(0.7),
                  fontSize: subtitleSize ?? 14, // default size
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
