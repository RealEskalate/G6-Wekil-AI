import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../widget/progress_bar.dart';
import '../../data/models/contact_data.dart';
import '../../domain/entities/contract_type.dart';
import '../../domain/entities/party.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import 'package:wekil_ai_mobile_app/features/widget/nav_bar.dart';
import 'package:wekil_ai_mobile_app/features/widget/bottom_nav.dart';
import '../../../../injection_container.dart' as di;
import 'package:wekil_ai_mobile_app/features/settings/domain/usecase/get_profile_usecase.dart';
import 'package:wekil_ai_mobile_app/features/settings/domain/entities/user_profile.dart';

class CreateStep2 extends StatefulWidget {
  final IntakeModel intake;
  final ContractType contractType;

  const CreateStep2({
    Key? key,
    required this.intake,
    required this.contractType,
  }) : super(key: key);

  @override
  State<CreateStep2> createState() => _CreateStep2State();
}

class _CreateStep2State extends State<CreateStep2> {
  final _formKey = GlobalKey<FormState>();

  late TextEditingController partyANameController;
  late TextEditingController partyAPhoneController;
  late TextEditingController partyAEmailController;

  late TextEditingController partyBNameController;
  late TextEditingController partyBPhoneController;
  late TextEditingController partyBEmailController;

  bool isUserPartyA = true; // Default selection
  Party? _userParty; // built from signed-in user profile

  @override
  void initState() {
    super.initState();

    Party partyA = widget.intake.parties.isNotEmpty
        ? widget.intake.parties[0]
        : Party(name: '', phone: '', email: '');
    Party partyB = widget.intake.parties.length > 1
        ? widget.intake.parties[1]
        : Party(name: '', phone: '', email: '');

    partyANameController = TextEditingController(text: partyA.name);
    partyAPhoneController = TextEditingController(text: partyA.phone);
    partyAEmailController = TextEditingController(text: partyA.email);

    partyBNameController = TextEditingController(text: partyB.name);
    partyBPhoneController = TextEditingController(text: partyB.phone);
    partyBEmailController = TextEditingController(text: partyB.email);

    // Attempt to prefill from signed-in user profile
    Future.microtask(_prefillFromProfile);
  }

  Future<void> _prefillFromProfile() async {
    try {
      final usecase = di.sl<GetProfileUseCase>();
      final result = await usecase();
      result.fold(
        (failure) {
          // ignore failure; keep fields as-is
        },
        (UserProfile p) {
          // Build display name
          final fullName = [p.firstName, if (p.middleName != null && p.middleName!.trim().isNotEmpty) p.middleName!, p.lastName]
              .where((e) => e.trim().isNotEmpty)
              .join(' ');
          _userParty = Party(name: fullName, phone: p.telephone, email: p.email);
          _populateUserPartyIfEmpty();
        },
      );
    } catch (_) {
      // ignore errors; do not disrupt UX
    }
  }

  void _populateUserPartyIfEmpty() {
    if (_userParty == null) return;
    if (isUserPartyA) {
      final isEmptyA = partyANameController.text.trim().isEmpty &&
          partyAPhoneController.text.trim().isEmpty &&
          partyAEmailController.text.trim().isEmpty;
      if (isEmptyA) {
        partyANameController.text = _userParty!.name;
        partyAPhoneController.text = _userParty!.phone ?? '';
        partyAEmailController.text = _userParty!.email ?? '';
      }
    } else {
      final isEmptyB = partyBNameController.text.trim().isEmpty &&
          partyBPhoneController.text.trim().isEmpty &&
          partyBEmailController.text.trim().isEmpty;
      if (isEmptyB) {
        partyBNameController.text = _userParty!.name;
        partyBPhoneController.text = _userParty!.phone ?? '';
        partyBEmailController.text = _userParty!.email ?? '';
      }
    }
  }

  @override
  void dispose() {
    partyANameController.dispose();
    partyAPhoneController.dispose();
    partyAEmailController.dispose();
    partyBNameController.dispose();
    partyBPhoneController.dispose();
    partyBEmailController.dispose();
    super.dispose();
  }

  // ================================
  // Helper function for dynamic labels
  // ================================
  Map<String, String> _getPartyLabels(ContractType type) {
    switch (type) {
      case ContractType.simpleLoan:
        return {
          "partyA": "Party A (Lender)",
          "partyB": "Party B (Borrower)",
        };
      case ContractType.serviceAgreement:
        return {
          "partyA": "Party A (Service Provider)",
          "partyB": "Party B (Client)",
        };
      case ContractType.salesOfGoods:
        return {
          "partyA": "Party A (Seller)",
          "partyB": "Party B (Buyer)",
        };
      case ContractType.basicNDA:
        return {
          "partyA": "Party A (Disclosing Party)",
          "partyB": "Party B (Receiving Party)",
        };
    }
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

  @override
  Widget build(BuildContext context) {
    final partyLabels = _getPartyLabels(widget.contractType);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: const NavBar(),
      bottomNavigationBar: BottomNav(
        currentIndex: 1,
        onItemSelected: (index) {
          if (index == 0) context.go('/dashboard', extra: 0);
          if (index == 2) context.go('/dashboard', extra: 2);
        },
        onCreatePressed: () {},
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Create ${_getContractTitle(widget.contractType)}",
                style: AppTypography.heading().copyWith(fontSize: 20),
              ),
             
              const SizedBox(height: 20),
              const StepProgressBar(currentStep: 3,  stepLabels: ["Type","Basic Info","Parties","Genera","Specific","Preview","Success",], totalSteps: 7
              ,),
              const SizedBox(height: 24),

              // User Party Selection Toggle
              Row(
                children: [
                  Expanded(
                    child: RadioListTile<bool>(
                      title: const Text("I am Party A"),
                      value: true,
                      groupValue: isUserPartyA,
                      onChanged: (val) {
                        setState(() {
                          isUserPartyA = val!;
                          // Clear the opposite party when switching
                          if (isUserPartyA) {
                            partyBNameController.clear();
                            partyBPhoneController.clear();
                            partyBEmailController.clear();
                          } else {
                            partyANameController.clear();
                            partyAPhoneController.clear();
                            partyAEmailController.clear();
                          }
                          _populateUserPartyIfEmpty();
                        });
                      },
                    ),
                  ),
                  Expanded(
                    child: RadioListTile<bool>(
                      title: const Text("I am Party B"),
                      value: false,
                      groupValue: isUserPartyA,
                      onChanged: (val) {
                        setState(() {
                          isUserPartyA = val!;
                          // Clear the opposite party when switching
                          if (isUserPartyA) {
                            partyBNameController.clear();
                            partyBPhoneController.clear();
                            partyBEmailController.clear();
                          } else {
                            partyANameController.clear();
                            partyAPhoneController.clear();
                            partyAEmailController.clear();
                          }
                          _populateUserPartyIfEmpty();
                        });
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Card container
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
                      "Parties",
                      style: AppTypography.body().copyWith(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 16),
                    _buildPartySection(
                      partyLabels["partyA"]!,
                      partyANameController,
                      partyAPhoneController,
                      partyAEmailController,
                      readOnly: isUserPartyA,
                    ),
                    const SizedBox(height: 16),
                    _buildPartySection(
                      partyLabels["partyB"]!,
                      partyBNameController,
                      partyBPhoneController,
                      partyBEmailController,
                      readOnly: !isUserPartyA,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Navigation Buttons
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => context.pop(),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
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
                        if (_formKey.currentState!.validate()) {
                          widget.intake.parties
                            ..clear()
                            ..add(
                              Party(
                                name: partyANameController.text,
                                phone: partyAPhoneController.text,
                                email: partyAEmailController.text,
                              ),
                            )
                            ..add(
                              Party(
                                name: partyBNameController.text,
                                phone: partyBPhoneController.text,
                                email: partyBEmailController.text,
                              ),
                            );

                               context.push('/contracts/step4', extra: {
                                 'intakeModel': widget.intake,
                                 'contractType': widget.contractType,
                               });
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
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
      ),
    );
  }

  Widget _buildPartySection(
    String title,
    TextEditingController nameController,
    TextEditingController phoneController,
    TextEditingController emailController, {
    bool readOnly = false,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title,
            style: AppTypography.body().copyWith(
              fontWeight: FontWeight.bold,
              color: AppColors.textDark,
            )),
        const SizedBox(height: 12),
        TextFormField(
          controller: nameController,
          readOnly: readOnly,
          decoration: const InputDecoration(
            labelText: "Full Name *",
            hintText: "e.g. John Doe",
            border: OutlineInputBorder(),
          ),
          validator: (value) =>
              value == null || value.isEmpty ? "Required" : null,
          keyboardType: TextInputType.name,
        ),
        const SizedBox(height: 12),
        TextFormField(
          controller: phoneController,
          readOnly: readOnly,
          decoration: const InputDecoration(
            labelText: "Phone Number *",
            hintText: "e.g. +251911123456",
            border: OutlineInputBorder(),
          ),
          validator: (value) =>
              value == null || value.isEmpty ? "Required" : null,
          keyboardType: TextInputType.phone,
        ),
        const SizedBox(height: 12),
        TextFormField(
          controller: emailController,
          readOnly: readOnly,
          decoration: const InputDecoration(
            labelText: "Email Address *",
            hintText: "e.g. john@example.com",
            border: OutlineInputBorder(),
          ),
          validator: (value) =>
              value == null || value.isEmpty ? "Required" : null,
          keyboardType: TextInputType.emailAddress,
        ),
      ],
    );
  }
}
