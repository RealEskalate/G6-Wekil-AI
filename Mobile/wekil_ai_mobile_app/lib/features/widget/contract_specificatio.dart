import 'package:flutter/material.dart';
import 'package:flutter_localization/flutter_localization.dart';
import 'package:intl/intl.dart';
import 'package:wekil_ai_mobile_app/features/contacts/domain/entities/contract_type.dart';
import 'package:wekil_ai_mobile_app/features/contacts/domain/entities/good.dart';
import 'package:wekil_ai_mobile_app/features/contacts/domain/entities/installment.dart';
import 'package:wekil_ai_mobile_app/features/contacts/domain/entities/milestone.dart';
import 'package:wekil_ai_mobile_app/features/localization/locales.dart';
import '../contacts/data/models/contact_data.dart';
import '../../core/theme/app_typography.dart';

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
  final List<TextEditingController> _milestoneDescriptionControllers = [];
  final List<TextEditingController> _milestoneAmountControllers = [];
  final List<TextEditingController> _milestoneDueDateControllers = [];
  final _revisionsController = TextEditingController();

  // Sales of Goods
  final List<TextEditingController> _goodsControllers = [];
  final List<TextEditingController> _quantityControllers = [];
  final List<TextEditingController> _unitPriceControllers = [];
  final _deliveryController = TextEditingController();

  // Simple Loan
  final _principalController = TextEditingController();
  final List<TextEditingController> _installmentAmountControllers = [];
  final List<TextEditingController> _installmentDueDateControllers = [];
  final List<TextEditingController> _installmentDescriptionControllers = [];
  final _lateFeeController = TextEditingController();

  // Basic NDA
  final _effectiveDateController = TextEditingController();
  final _confidentialityYearsController = TextEditingController();
  final _purposeController = TextEditingController();
  bool _mutualConfidentiality = false;

  final List<String> _frequencies = [
    'Weekly',
    'Monthly',
    'Quarterly',
    'Annually',
  ];
  final List<String> _frequencyValues = [];

  @override
  void initState() {
    super.initState();

    // Service Agreement
    _servicesController.text = widget.contractData.services ?? '';
    _revisionsController.text = widget.contractData.revisions?.toString() ?? '';
    _milestoneDescriptionControllers.addAll(
      (widget.contractData.milestones ?? []).map(
        (m) => TextEditingController(text: m.description),
      ),
    );
    _milestoneAmountControllers.addAll(
      (widget.contractData.milestones ?? []).map(
        (m) => TextEditingController(text: m.amount?.toString() ?? ''),
      ),
    );
    _milestoneDueDateControllers.addAll(
      (widget.contractData.milestones ?? []).map(
        (m) => TextEditingController(
          text: m.dueDate != null
              ? DateFormat('dd/MM/yyyy').format(m.dueDate!)
              : '',
        ),
      ),
    );

    // Sales of Goods
    _goodsControllers.addAll(
      (widget.contractData.goods ?? []).map(
        (g) => TextEditingController(text: g.item),
      ),
    );
    _quantityControllers.addAll(
      (widget.contractData.goods ?? []).map(
        (g) => TextEditingController(text: g.quantity?.toString() ?? ''),
      ),
    );
    _unitPriceControllers.addAll(
      (widget.contractData.goods ?? []).map(
        (g) => TextEditingController(text: g.unitPrice?.toString() ?? ''),
      ),
    );
    _deliveryController.text = widget.contractData.deliveryTerms ?? '';

    // Simple Loan
    _principalController.text = widget.contractData.principal?.toString() ?? '';
    _lateFeeController.text =
        widget.contractData.lateFeePercent?.toString() ?? '';
    _installmentAmountControllers.addAll(
      (widget.contractData.installments ?? []).map(
        (i) => TextEditingController(text: i.amount?.toString() ?? ''),
      ),
    );
    _installmentDueDateControllers.addAll(
      (widget.contractData.installments ?? []).map(
        (i) => TextEditingController(
          text: i.dueDate != null
              ? DateFormat('dd/MM/yyyy').format(i.dueDate!)
              : '',
        ),
      ),
    );
    _installmentDescriptionControllers.addAll(
      (widget.contractData.installments ?? []).map(
        (i) => TextEditingController(text: i.description ?? ''),
      ),
    );

    // Basic NDA
    _effectiveDateController.text = widget.contractData.effectiveDate ?? '';
    _confidentialityYearsController.text =
        widget.contractData.confidentialityYears?.toString() ?? '';
    _purposeController.text = widget.contractData.purpose ?? '';
    _mutualConfidentiality = widget.contractData.mutualConfidentiality ?? false;
  }

  @override
  void dispose() {
    // Dispose all controllers
    _servicesController.dispose();
    _revisionsController.dispose();
    _deliveryController.dispose();
    _principalController.dispose();
    _lateFeeController.dispose();
    _effectiveDateController.dispose();
    _confidentialityYearsController.dispose();
    _purposeController.dispose();

    for (var c in _milestoneDescriptionControllers) c.dispose();
    for (var c in _milestoneAmountControllers) c.dispose();
    for (var c in _milestoneDueDateControllers) c.dispose();
    for (var c in _goodsControllers) c.dispose();
    for (var c in _quantityControllers) c.dispose();
    for (var c in _unitPriceControllers) c.dispose();
    for (var c in _installmentAmountControllers) c.dispose();
    for (var c in _installmentDueDateControllers) c.dispose();
    for (var c in _installmentDescriptionControllers) c.dispose();

    super.dispose();
  }

  void saveToContractData() {
    switch (widget.contractType) {
      case ContractType.serviceAgreement:
        widget.contractData.services = _servicesController.text;
        widget.contractData.milestones = List.generate(
          _milestoneDescriptionControllers.length,
          (i) => Milestone(
            description: _milestoneDescriptionControllers[i].text,
            amount: double.tryParse(_milestoneAmountControllers[i].text),
            dueDate: _milestoneDueDateControllers[i].text.isNotEmpty
                ? DateFormat(
                    'dd/MM/yyyy',
                  ).parse(_milestoneDueDateControllers[i].text)
                : null,
          ),
        );
        widget.contractData.revisions =
            int.tryParse(_revisionsController.text) ?? 0;
        break;

      case ContractType.salesOfGoods:
        widget.contractData.goods = List.generate(
          _goodsControllers.length,
          (i) => Goods(
            item: _goodsControllers[i].text,
            quantity: int.tryParse(_quantityControllers[i].text) ?? 0,
            unitPrice: double.tryParse(_unitPriceControllers[i].text) ?? 0.0,
            name: '',
          ),
        );
        widget.contractData.deliveryTerms = _deliveryController.text;
        break;

      case ContractType.simpleLoan:
        widget.contractData.principal =
            double.tryParse(_principalController.text) ?? 0.0;
        widget.contractData.installments = List.generate(
          _installmentAmountControllers.length,
          (i) => Installment(
            amount:
                double.tryParse(_installmentAmountControllers[i].text) ?? 0.0,
            dueDate: _installmentDueDateControllers[i].text.isNotEmpty
                ? DateFormat(
                    'dd/MM/yyyy',
                  ).parse(_installmentDueDateControllers[i].text)
                : null,
            description: _installmentDescriptionControllers[i].text,
          ),
        );
        widget.contractData.lateFeePercent =
            double.tryParse(_lateFeeController.text) ?? 0.0;
        break;

      case ContractType.basicNDA:
        widget.contractData.effectiveDate = _effectiveDateController.text;
        widget.contractData.confidentialityYears =
            int.tryParse(_confidentialityYearsController.text) ?? 0;
        widget.contractData.purpose = _purposeController.text;
        widget.contractData.mutualConfidentiality = _mutualConfidentiality;
        break;
    }
  }

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
            decoration: InputDecoration(
              hintText: hint,
              border: const OutlineInputBorder(),
            ),
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
    }
  }

  Widget _buildServiceAgreementForm() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        labeledField(
          LocalesData.servicesDescription.getString(context),
          _servicesController,
        ),
        const SizedBox(height: 16),
        Text(
          LocalesData.milestones.getString(context),
          style: AppTypography.label,
        ),
        const SizedBox(height: 8),
        ..._milestoneDescriptionControllers.asMap().entries.map((entry) {
          final i = entry.key;
          return Card(
            margin: const EdgeInsets.symmetric(vertical: 8),
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                children: [
                  labeledField(
                    LocalesData.description.getString(context),
                    _milestoneDescriptionControllers[i],
                  ),
                  labeledField(
                    LocalesData.amountOptional.getString(context),
                    _milestoneAmountControllers[i],
                    type: TextInputType.number,
                  ),
                  TextFormField(
                    controller: _milestoneDueDateControllers[i],
                    readOnly: true,
                    decoration: InputDecoration(
                      labelText: LocalesData.dueDate.getString(context),
                      suffixIcon: const Icon(Icons.calendar_today_outlined),
                      border: const OutlineInputBorder(),
                    ),
                    onTap: () async {
                      DateTime initialDate = DateTime.now();
                      if (_milestoneDueDateControllers[i].text.isNotEmpty) {
                        try {
                          initialDate = DateFormat(
                            'dd/MM/yyyy',
                          ).parse(_milestoneDueDateControllers[i].text);
                        } catch (_) {}
                      }
                      final picked = await showDatePicker(
                        context: context,
                        initialDate: initialDate,
                        firstDate: DateTime(2000),
                        lastDate: DateTime(2100),
                      );
                      if (picked != null) {
                        setState(() {
                          _milestoneDueDateControllers[i].text = DateFormat(
                            'dd/MM/yyyy',
                          ).format(picked);
                        });
                      }
                    },
                  ),
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: () {
                        setState(() {
                          _milestoneDescriptionControllers.removeAt(i);
                          _milestoneAmountControllers.removeAt(i);
                          _milestoneDueDateControllers.removeAt(i);
                        });
                      },
                      style: TextButton.styleFrom(foregroundColor: Colors.red),
                      child: Text(
                        LocalesData.removeMilestone.getString(context),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
        ElevatedButton(
          onPressed: () {
            setState(() {
              _milestoneDescriptionControllers.add(TextEditingController());
              _milestoneAmountControllers.add(TextEditingController());
              _milestoneDueDateControllers.add(TextEditingController());
            });
          },
          child: Text(LocalesData.addMilestone.getString(context)),
        ),
        labeledField(
          LocalesData.numberOfRevisions.getString(context),
          _revisionsController,
          type: TextInputType.number,
        ),
      ],
    );
  }

  Widget _buildSalesOfGoodsForm() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ..._goodsControllers.asMap().entries.map((entry) {
          final i = entry.key;
          return Card(
            margin: const EdgeInsets.symmetric(vertical: 8),
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                children: [
                  labeledField(
                    LocalesData.item.getString(context),
                    _goodsControllers[i],
                  ),
                  Row(
                    children: [
                      Expanded(
                        child: labeledField(
                          LocalesData.quantity.getString(context),
                          _quantityControllers[i],
                          type: TextInputType.number,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: labeledField(
                          LocalesData.unitPrice.getString(context),
                          _unitPriceControllers[i],
                          type: TextInputType.number,
                        ),
                      ),
                    ],
                  ),
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: () {
                        setState(() {
                          _goodsControllers.removeAt(i);
                          _quantityControllers.removeAt(i);
                          _unitPriceControllers.removeAt(i);
                        });
                      },
                      style: TextButton.styleFrom(foregroundColor: Colors.red),
                      child: Text(LocalesData.removeItem.getString(context)),
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
        ElevatedButton(
          onPressed: () {
            setState(() {
              _goodsControllers.add(TextEditingController());
              _quantityControllers.add(TextEditingController());
              _unitPriceControllers.add(TextEditingController());
            });
          },
          child: Text(LocalesData.addItem.getString(context)),
        ),
        labeledField(
          LocalesData.deliveryTerms.getString(context),
          _deliveryController,
        ),
      ],
    );
  }

  Widget _buildSimpleLoanForm() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        labeledField(
          LocalesData.principalAmount.getString(context),
          _principalController,
          type: TextInputType.number,
        ),
        const SizedBox(height: 16),
        Text(
          LocalesData.installments.getString(context),
          style: AppTypography.label,
        ),
        ..._installmentAmountControllers.asMap().entries.map((entry) {
          final i = entry.key;
          return Card(
            margin: const EdgeInsets.symmetric(vertical: 8),
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                children: [
                  labeledField(
                    LocalesData.amount.getString(context),
                    _installmentAmountControllers[i],
                    type: TextInputType.number,
                  ),
                  TextFormField(
                    controller: _installmentDueDateControllers[i],
                    readOnly: true,
                    decoration: InputDecoration(
                      labelText: LocalesData.dueDate.getString(context),
                      suffixIcon: const Icon(Icons.calendar_today_outlined),
                      border: const OutlineInputBorder(),
                    ),
                    onTap: () async {
                      final picked = await showDatePicker(
                        context: context,
                        initialDate: DateTime.now(),
                        firstDate: DateTime(2000),
                        lastDate: DateTime(2100),
                      );
                      if (picked != null) {
                        setState(() {
                          _installmentDueDateControllers[i].text = DateFormat(
                            'dd/MM/yyyy',
                          ).format(picked);
                        });
                      }
                    },
                  ),
                  labeledField(
                    LocalesData.description.getString(context),
                    _installmentDescriptionControllers[i],
                    hint: LocalesData.frequencyHint.getString(context),
                  ),
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: () {
                        setState(() {
                          _installmentAmountControllers.removeAt(i);
                          _installmentDueDateControllers.removeAt(i);
                          _installmentDescriptionControllers.removeAt(i);
                        });
                      },
                      style: TextButton.styleFrom(foregroundColor: Colors.red),
                      child: Text(
                        LocalesData.removeInstallment.getString(context),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
        ElevatedButton(
          onPressed: () {
            setState(() {
              _installmentAmountControllers.add(TextEditingController());
              _installmentDueDateControllers.add(TextEditingController());
              _installmentDescriptionControllers.add(TextEditingController());
            });
          },
          child: Text(LocalesData.addInstallment.getString(context)),
        ),
        labeledField(
          LocalesData.lateFeePercentage.getString(context),
          _lateFeeController,
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
          LocalesData.effectiveDate.getString(context),
          _effectiveDateController,
          hint: 'YYYY-MM-DD',
        ),
        labeledField(
          LocalesData.confidentialityTermsYears.getString(context),
          _confidentialityYearsController,
          type: TextInputType.number,
        ),
        labeledField(
          LocalesData.purpose.getString(context),
          _purposeController,
        ),
        Row(
          children: [
            Switch(
              value: _mutualConfidentiality,
              onChanged: (val) => setState(() => _mutualConfidentiality = val),
            ),
            const SizedBox(width: 8),
            Text(LocalesData.mutualConfidentiality.getString(context)),
          ],
        ),
      ],
    );
  }
}
