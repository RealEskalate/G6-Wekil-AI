import '../../domain/entities/party.dart';
import '../../domain/entities/installment.dart';
import '../../domain/entities/contract_type.dart';
import '../../domain/entities/good.dart';
import '../../domain/entities/milestone.dart';


class IntakeModel {
  final ContractType contractType;


  // Common fields
  final List<Party> parties;
  String location;
  String currency;
  double? totalAmount;
  List<DateTime> dueDates;
  DateTime startDate;
  DateTime endDate;

  // Service-specific fields
  String? services;
  List<Milestone>? milestones;
  int? revisions;

  // Sale-specific fields
  List<Goods>? goods;
  String? deliveryTerms;

  // Loan-specific fields
  double? principal;
  List<Installment>? installments;
  double? lateFeePercent;

  //NDA
  String? effectiveDate;
  int? confidentialityYears;
  String? purpose;

  IntakeModel({
    required this.contractType,
    required this.parties,
    required this.location,
    required this.currency,
    this.totalAmount,
    required this.dueDates,
    required this.startDate,
    required this.endDate,
    this.services,
    this.milestones,
    this.revisions,
    this.goods,
    this.deliveryTerms,
    this.principal,
    this.installments,
    this.lateFeePercent,
    this.effectiveDate,
    this.confidentialityYears,
    this.purpose,
    
  });

  // ---------------------------
  // Type-safe helpers
  // ---------------------------

  bool get isServiceContract => contractType == ContractType.serviceAgreement;
  bool get isSaleContract => contractType == ContractType.salesOfGoods;
  bool get isLoanContract => contractType == ContractType.simpleLoan;
  bool get isNDAContract => contractType == ContractType.basicNDA;

  // Get only the relevant fields for the current contract type
  Map<String, dynamic> get relevantFields {
    switch (contractType) {
      case ContractType.serviceAgreement:
        return {
          'services': services,
          'milestones': milestones,
          'revisions': revisions,
        };
      case ContractType.salesOfGoods:
        return {
          'goods': goods,
          'deliveryTerms': deliveryTerms,
        };
      case ContractType.simpleLoan:
        return {
          'principal': principal,
          'installments': installments,
          'lateFeePercent': lateFeePercent,
        };
      case ContractType.basicNDA:
        return {
          'effectiveDate': effectiveDate,
          'confidentialityYears': confidentialityYears,
          'purpose': purpose,
        }; // No specific fields for NDA
    }
  }

  // Optional: validate that only relevant fields are filled
  bool validateFields() {
    switch (contractType) {
      case ContractType.serviceAgreement:
        return goods == null && principal == null;
      case ContractType.salesOfGoods:
        return services == null && principal == null;
      case ContractType.simpleLoan:
        return services == null && goods == null;
      case ContractType.basicNDA:
        return services == null && goods == null && principal == null;
    }
  }

  // CopyWith method (same as before)
  IntakeModel copyWith({
    ContractType? contractType,
    List<Party>? parties,
    String? location,
    String? currency,
    double? totalAmount,
    List<DateTime>? dueDates,
    DateTime? startDate,
    DateTime? endDate,
    String? services,
    List<Milestone>? milestones,
    int? revisions,
    List<Goods>? goods,
    String? deliveryTerms,
    double? principal,
    List<Installment>? installments,
    double? lateFeePercent,
  }) {
    return IntakeModel(
      contractType: contractType ?? this.contractType,
      parties: parties ?? this.parties,
      location: location ?? this.location,
      currency: currency ?? this.currency,
      totalAmount: totalAmount ?? this.totalAmount,
      dueDates: dueDates ?? this.dueDates,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      services: services ?? this.services,
      milestones: milestones ?? this.milestones,
      revisions: revisions ?? this.revisions,
      goods: goods ?? this.goods,
      deliveryTerms: deliveryTerms ?? this.deliveryTerms,
      principal: principal ?? this.principal,
      installments: installments ?? this.installments,
      lateFeePercent: lateFeePercent ?? this.lateFeePercent,
    );
  }
}
