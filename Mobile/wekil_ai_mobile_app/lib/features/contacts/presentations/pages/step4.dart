import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:wekil_ai_mobile_app/features/contacts/domain/entities/contract_type.dart';
import '../../../widget/progress_bar.dart';
import '../../data/models/contact_data.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';

class CreateStep3 extends StatefulWidget {
  final IntakeModel intake;
  final ContractType contractType;

  const CreateStep3({
    Key? key,
    required this.intake,
    required this.contractType,
  }) : super(key: key);

  @override
  State<CreateStep3> createState() => _CreateStep3State();
}

class _CreateStep3State extends State<CreateStep3> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _locationController;
  late TextEditingController _amountController;
  late TextEditingController _startDateController;
  late TextEditingController _endDateController;

  final List<String> _currencies = ['ETB', 'USD', 'EUR', 'GBP'];
  String? _selectedCurrency;

  @override
  void initState() {
    super.initState();

    _locationController = TextEditingController(
      text: widget.intake.location,
    );
    _amountController = TextEditingController(
      text: widget.intake.totalAmount?.toString() ?? '',
    );
    _startDateController = TextEditingController(
      text: DateFormat('dd/MM/yyyy').format(widget.intake.startDate),
    );
    _endDateController = TextEditingController(
      text: DateFormat('dd/MM/yyyy').format(widget.intake.endDate),
    );

    _selectedCurrency = _currencies.contains(widget.intake.currency)
        ? widget.intake.currency
        : 'ETB';
  }

  @override
  void dispose() {
    _locationController.dispose();
    _amountController.dispose();
    _startDateController.dispose();
    _endDateController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(
    BuildContext context,
    TextEditingController controller,
  ) async {
    DateTime initialDate = DateTime.now();
    if (controller.text.isNotEmpty) {
      try {
        initialDate = DateFormat('dd/MM/yyyy').parse(controller.text);
      } catch (_) {}
    }

    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: initialDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );

    if (picked != null) {
      controller.text = DateFormat('dd/MM/yyyy').format(picked);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: const BackButton(color: AppColors.textDark),
        title: Text(
          "Create ${_getContractTitle(widget.contractType)}",
          style: AppTypography.heading().copyWith(fontSize: 20),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const StepProgressBar(
                currentStep: 3,
                totalSteps: 7,
                stepLabels: ["Type","Basic Info","Parties","Genera","Specific","Preview","Success",],
              ),
              const SizedBox(height: 24),
              Card(
                color: AppColors.textLight,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 16),
                      // Location
                      Text("Location", style: AppTypography.body()),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _locationController,
                        decoration: const InputDecoration(
                          hintText: "Enter location",
                          border: OutlineInputBorder(),
                          prefixIcon: Icon(Icons.location_on_outlined),
                        ),
                        validator: (v) =>
                            v == null || v.isEmpty ? "Required" : null,
                      ),

                      // Currency
                      Text("Currency", style: AppTypography.body()),
                      const SizedBox(height: 8),
                      DropdownButtonFormField<String>(
                        value: _selectedCurrency,
                        items: _currencies
                            .map(
                              (c) => DropdownMenuItem(value: c, child: Text(c)),
                            )
                            .toList(),
                        onChanged: (val) =>
                            setState(() => _selectedCurrency = val),
                        decoration: const InputDecoration(
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Total Amount
                      Text("Total Amount", style: AppTypography.body()),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _amountController,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(
                          hintText: "Enter total amount",
                          border: OutlineInputBorder(),
                        ),
                        validator: (v) =>
                            v == null || v.isEmpty ? "Required" : null,
                      ),
                      const SizedBox(height: 16),

                      // Start Date
                      Text("Start Date", style: AppTypography.body()),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _startDateController,
                        readOnly: true,
                        decoration: const InputDecoration(
                          hintText: "dd/MM/yyyy",
                          suffixIcon: Icon(Icons.calendar_today_outlined),
                          border: OutlineInputBorder(),
                        ),
                        onTap: () => _selectDate(context, _startDateController),
                      ),
                      const SizedBox(height: 16),

                      // End Date
                      Text("End Date", style: AppTypography.body()),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _endDateController,
                        readOnly: true,
                        decoration: const InputDecoration(
                          hintText: "dd/MM/yyyy",
                          suffixIcon: Icon(Icons.calendar_today_outlined),
                          border: OutlineInputBorder(),
                        ),
                        validator: (v) =>
                            v == null || v.isEmpty ? "Required" : null,
                        onTap: () => _selectDate(context, _endDateController),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 32),

              // Navigation Buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  OutlinedButton.icon(
                    onPressed: () => context.pop(),
                    icon: const Icon(Icons.arrow_back_ios),
                    label: const Text("Back"),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.textDark,
                      side: BorderSide(
                        color: AppColors.textDark.withOpacity(0.3),
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 12,
                      ),
                      textStyle: AppTypography.button(),
                    ),
                  ),
                  ElevatedButton.icon(
                    onPressed: () {
                      if (_formKey.currentState!.validate()) {
                        widget.intake.location = _locationController.text;
                        widget.intake.currency = _selectedCurrency!;
                        widget.intake.totalAmount = double.tryParse(
                          _amountController.text,
                        );
                        widget.intake.startDate = DateFormat(
                          'dd/MM/yyyy',
                        ).parse(_startDateController.text);
                        widget.intake.endDate = DateFormat(
                          'dd/MM/yyyy',
                        ).parse(_endDateController.text);

                        context.push('/contracts/step5', extra: {
                          'intakeModel': widget.intake,
                          'contractType': widget.contractType,
                        });
                      }
                    },
                    icon: const Icon(Icons.arrow_forward_ios),
                    label: const Text("Next"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.accent,
                      foregroundColor: AppColors.textLight,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 12,
                      ),
                      textStyle: AppTypography.button(),
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
