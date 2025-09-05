import '../entities/good.dart';
import '../entities/installment.dart';
import '../entities/milestone.dart';
import '../entities/party.dart';
import 'contract_type.dart';


class Intake {
  final ContractType contractType;

  // Common fields
  String language;
  final List<Party> parties;
  final String location;
  final String currency;
  final double? totalAmount;
  final List<DateTime> dueDates;
  final DateTime startDate;
  final DateTime endDate;

  // Service-specific
  final String? services;
  final List<Milestone>? milestones;
  final int? revisions;

  // Sale-specific
  final List<Goods>? goods;
  final String? deliveryTerms;

  // Loan-specific
  final double? principal;
  final List<Installment>? installments;
  final double? lateFeePercent;

  // NDA-specific
  final String? effectiveDate;
  final int? confidentialityYears;
  final String? purpose;
  final bool? mutualConfidentiality;

  Intake({
    required this.language,
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

  @override
  String toString() {
    return '''
==== Intake Data ====

Contract Type: $contractType
Parties: $parties
Location: $location
Currency: $currency
Total Amount: $totalAmount
Due Dates: $dueDates
Start Date: $startDate
End Date: $endDate

Services: $services
Milestones: $milestones
Revisions: $revisions

Goods: $goods
Delivery Terms: $deliveryTerms

Principal: $principal
Installments: $installments
Late Fee Percent: $lateFeePercent

Effective Date: $effectiveDate
Confidentiality Years: $confidentialityYears
Purpose: $purpose
Mutual Confidentiality: $mutualConfidentiality
=====================
''';
  }
}


// class Intake {
//   final ContractType contractType; // Required to distinguish type

//   // Common fields
//   final List<Party> parties;
//   final String location;
//   final String currency;
//   final double? totalAmount;
//   final List<DateTime> dueDates;
//   final DateTime startDate;
//   final DateTime endDate;

//   // Service-specific fields
//   final String? services;
//   final List<Milestone>? milestones; // Milestones now have description, amount, dueDate
//   final int? revisions;

//   // Sale-specific fields
//   final List<Goods>? goods;
//   final String? deliveryTerms;

//   // Loan-specific fields
//   final double? principal;
//   final List<Installment>? installments; // Installments now have amount, dueDate, description
//   final double? lateFeePercent;

//   // NDA-specific fields
//   final String? effectiveDate;
//   final int? confidentialityYears;
//   final String? purpose;
//   final bool? mutualConfidentiality;

//   Intake({
//     required this.contractType,
//     required this.parties,
//     required this.location,
//     required this.currency,
//     this.totalAmount,
//     required this.dueDates,
//     required this.startDate,
//     required this.endDate,
//     this.services,
//     this.milestones,
//     this.revisions,
//     this.goods,
//     this.deliveryTerms,
//     this.principal,
//     this.installments,
//     this.lateFeePercent,
//     this.effectiveDate,
//     this.confidentialityYears,
//     this.purpose,
//     this.mutualConfidentiality,
//   }
//   );
// }