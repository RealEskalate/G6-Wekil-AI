import 'package:flutter/material.dart';
import 'package:wekil_ai_mobile_app/features/contacts/domain/entities/contract_type.dart';
import 'package:wekil_ai_mobile_app/features/contacts/domain/entities/good.dart';
import 'package:wekil_ai_mobile_app/features/contacts/domain/entities/installment.dart';
import 'package:wekil_ai_mobile_app/features/contacts/domain/entities/milestone.dart';
import '../contacts/data/models/contact_data.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_colors.dart';

class ContractSpecificDetails extends StatefulWidget {
  final ContractType contractType;
  final IntakeModel contractData;

  const ContractSpecificDetails({
    Key? key,
    required this.contractType,
    required this.contractData,
  }) : super(key: key);

  @override
  ContractSpecificDetailsState createState() => ContractSpecificDetailsState();
}

class ContractSpecificDetailsState extends State<ContractSpecificDetails> {
  // Service Agreement
  final _servicesController = TextEditingController();
  final List<TextEditingController> _milestoneControllers = [];
  final _revisionsController = TextEditingController();

  // Sales of Goods
  final List<TextEditingController> _goodsControllers = [];
  final _deliveryController = TextEditingController();

  // Simple Loan
  final _principalController = TextEditingController();
  final List<TextEditingController> _installmentControllers = [];
  final _lateFeeController = TextEditingController();

  // Basic NDA
  final _effectiveDateController = TextEditingController();
  final _confidentialityYearsController = TextEditingController();
  final _purposeController = TextEditingController();

  @override
  void initState() {
    super.initState();

    _servicesController.text = widget.contractData.services ?? '';
    _revisionsController.text = widget.contractData.revisions?.toString() ?? '';
    _deliveryController.text = widget.contractData.deliveryTerms ?? '';
    _principalController.text = widget.contractData.principal?.toString() ?? '';
    _lateFeeController.text = widget.contractData.lateFeePercent?.toString() ?? '';
    _effectiveDateController.text = widget.contractData.effectiveDate ?? '';
    _confidentialityYearsController.text = widget.contractData.confidentialityYears?.toString() ?? '';
    _purposeController.text = widget.contractData.purpose ?? '';

    _milestoneControllers.addAll(
      (widget.contractData.milestones ?? [])
          .map((m) => TextEditingController(text: m.description)),
    );

    _goodsControllers.addAll(
      (widget.contractData.goods ?? [])
          .map((g) => TextEditingController(text: g.item)),
    );

    _installmentControllers.addAll(
      (widget.contractData.installments ?? [])
          .map((i) => TextEditingController(text: i.amount.toString())),
    );
  }

  @override
  void dispose() {
    _servicesController.dispose();
    _revisionsController.dispose();
    _deliveryController.dispose();
    _principalController.dispose();
    _lateFeeController.dispose();
    _effectiveDateController.dispose();
    _confidentialityYearsController.dispose();
    _purposeController.dispose();

    for (var c in _milestoneControllers) c.dispose();
    for (var c in _goodsControllers) c.dispose();
    for (var c in _installmentControllers) c.dispose();

    super.dispose();
  }

  void saveToContractData() {
    switch (widget.contractType) {
      case ContractType.serviceAgreement:
        widget.contractData.services = _servicesController.text;
        widget.contractData.milestones = _milestoneControllers
            .map((c) => Milestone(description: c.text, date: null))
            .toList();
        widget.contractData.revisions =
            int.tryParse(_revisionsController.text) ?? 0; // ✅ fixed
        break;

      case ContractType.salesOfGoods:
        widget.contractData.goods = _goodsControllers
            .map((c) => Goods(item: c.text, name: ''))
            .toList();
        widget.contractData.deliveryTerms = _deliveryController.text;
        break;

      case ContractType.simpleLoan:
        widget.contractData.principal =
            double.tryParse(_principalController.text) ?? 0.0;
        widget.contractData.installments = _installmentControllers
            .map((c) => Installment(amount: double.tryParse(c.text) ?? 0.0))
            .toList();
        widget.contractData.lateFeePercent =
            double.tryParse(_lateFeeController.text) ?? 0.0;
        break;

      case ContractType.basicNDA:
        widget.contractData.effectiveDate = _effectiveDateController.text;
        widget.contractData.confidentialityYears =
            int.tryParse(_confidentialityYearsController.text) ?? 0;
        widget.contractData.purpose = _purposeController.text;
        break;
    }
  }

  /// ✅ Reusable labeled text field
  Widget labeledField(
    String label,
    TextEditingController controller, {
    String? hint,
    TextInputType? type,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: AppTypography.label),
          TextField(
            controller: controller,
            keyboardType: type,
            decoration: InputDecoration(hintText: hint),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(child: _buildForm());
  }

  Widget _buildForm() {
    switch (widget.contractType) {
      case ContractType.serviceAgreement:
        return _buildServiceAgreementForm();
      case ContractType.salesOfGoods:
        return _buildSalesOfGoodsForm();
      case ContractType.simpleLoan:
        return _buildSimpleLoanForm();
      case ContractType.basicNDA:
        return _buildBasicNDAForm();
      default:
        return const Text("No specific details available");
    }
  }

  Widget _buildServiceAgreementForm() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        labeledField("Services Description", _servicesController),
        Text("Milestones", style: AppTypography.label),
        ..._milestoneControllers.map((c) => Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: TextField(controller: c),
            )),
        ElevatedButton(
          onPressed: () {
            setState(() => _milestoneControllers.add(TextEditingController()));
          },
          child: const Text("Add Milestone"),
        ),
        labeledField(
          "Number of Revisions",
          _revisionsController,
          hint: "Enter number of revisions",
          type: TextInputType.number,
        ),
      ],
    );
  }

  Widget _buildSalesOfGoodsForm() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("Goods/Items", style: AppTypography.label),
        ..._goodsControllers.map((c) => Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: TextField(controller: c),
            )),
        ElevatedButton(
          onPressed: () {
            setState(() => _goodsControllers.add(TextEditingController()));
          },
          child: const Text("Add Item"),
        ),
        labeledField("Delivery Terms", _deliveryController),
      ],
    );
  }

  Widget _buildSimpleLoanForm() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        labeledField(
          "Principal Amount",
          _principalController,
          hint: "Enter principal",
          type: TextInputType.number,
        ),
        Text("Installments", style: AppTypography.label),
        ..._installmentControllers.map((c) => Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: TextField(controller: c),
            )),
        ElevatedButton(
          onPressed: () {
            setState(() => _installmentControllers.add(TextEditingController()));
          },
          child: const Text("Add Installment"),
        ),
        labeledField(
          "Late Fee Percentage",
          _lateFeeController,
          hint: "Enter late fee percentage",
          type: TextInputType.number,
        ),
      ],
    );
  }

  Widget _buildBasicNDAForm() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        labeledField(
          "Effective Date",
          _effectiveDateController,
          hint: "YYYY-MM-DD",
        ),
        labeledField(
          "Confidentiality Terms (in years)",
          _confidentialityYearsController,
          hint: "Enter number of years",
          type: TextInputType.number,
        ),
        labeledField("Purpose", _purposeController),
      ],
    );
  }
}
