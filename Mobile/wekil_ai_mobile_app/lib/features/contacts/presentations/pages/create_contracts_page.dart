import 'package:flutter/material.dart';
import 'package:wekil_ai_mobile_app/features/contacts/presentations/pages/contracts_types_pages.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../widget/nav_bar.dart';
import '../../../widget/bottom_nav.dart';

class CreateContractScreen extends StatelessWidget {
  const CreateContractScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const NavBar(),
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
              title: 'Fast & Simple',
              subtitle: 'Create contracts in minutes',
              iconColor: AppColors.accent,
            ),
            _buildFeatureTile(
              icon: Icons.translate,
              title: 'Bilingual Support',
              subtitle: 'Available in Amharic & English',
              iconColor: AppColors.accent,
            ),
            _buildFeatureTile(
              icon: Icons.storage,
              title: 'Locally Stored',
              subtitle: 'All contracts stored on your device',
              iconColor: AppColors.accent,
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNav(
          currentIndex: 2,
          onItemSelected: (index) {
            // Handle tab change here if needed
            print("Selected tab: $index");
          },
          onCreatePressed: () {
            // Navigate to Create Contract screen (or any action you want)
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const CreateContractScreen(),
              ),
            );
          },
      ),
    );
  }

  // Header
  Widget _buildCreateContractHeader() {
    return Column(
      children: [
        const SizedBox(height: 20),
        Text(
          'Create Contract',
          style: AppTypography.heading().copyWith(fontSize: 24),
        ),
        const SizedBox(height: 8),
      ],
    );
  }

  // Important note card
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
                    'Important:',
                    style: AppTypography.body().copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'This tool creates basic agreements only and is not legal advice. For complex matters or legal questions, please consult a qualified lawyer.',
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
    );
  }

  // Select contract type card
  Widget _buildSelectContractTypeCard(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Icon(Icons.description, size: 48, color: Colors.blueGrey),
            const SizedBox(height: 16),
            Text(
              'Get Started Now',
              style: AppTypography.heading().copyWith(fontSize: 18),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const ContractsTypesPages(),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: AppColors.textLight,
                padding: const EdgeInsets.symmetric(
                  horizontal: 40,
                  vertical: 16,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(30),
                ),
                textStyle: AppTypography.button(),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: const [
                  Text('Continue'),
                  SizedBox(width: 8),
                  Icon(Icons.arrow_right_alt),
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
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: iconColor),
          ),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: AppTypography.body().copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                subtitle,
                style: AppTypography.body().copyWith(
                  color: AppColors.textDark.withOpacity(0.7),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
