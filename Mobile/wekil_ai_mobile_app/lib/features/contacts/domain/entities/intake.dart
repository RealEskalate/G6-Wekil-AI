import '../entities/good.dart';
import '../entities/installment.dart';
import '../entities/milestone.dart';
import '../entities/party.dart';
import 'contract_type.dart';

class Intake {
  final ContractType contractType; // Required to distinguish type

  // Common fields
  final List<Party> parties;
  final String location;
  final String currency;
  final double? totalAmount;
  final List<DateTime> dueDates;
  final DateTime startDate;
  final DateTime endDate;

  // Service-specific fields
  final String? services;
  final List<Milestone>? milestones; // Milestones now have description, amount, dueDate
  final int? revisions;

  // Sale-specific fields
  final List<Goods>? goods;
  final String? deliveryTerms;

  // Loan-specific fields
  final double? principal;
  final List<Installment>? installments; // Installments now have amount, dueDate, description
  final double? lateFeePercent;

  // NDA-specific fields
  final String? effectiveDate;
  final int? confidentialityYears;
  final String? purpose;
  final bool? mutualConfidentiality;

  Intake({
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
    this.mutualConfidentiality,
  });
}