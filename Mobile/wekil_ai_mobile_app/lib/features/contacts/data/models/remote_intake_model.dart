// // data/models/remote_intake_model.dart
// import '../../domain/entities/remote_intake.dart';

// class RemoteIntakeModel extends RemoteIntake {
//   RemoteIntakeModel({
//     super.id,
//     super.agreementType,
//     super.parties,
//     super.location,
//     super.currency,
//     super.startDate,
//     super.endDate,
//     super.services,
//     super.deliveryTerms,
//     super.effectiveDate,
//     super.purpose,
//     super.disclosingParty,
//     super.receivingParty,
//   });

//   factory RemoteIntakeModel.fromJson(Map<String, dynamic> json) {
//     return RemoteIntakeModel(
//       id: json['id'],
//       agreementType: json['agreement_type'],
//       parties: (json['parties'] as List<dynamic>?)
//           ?.map((p) => {
//                 'id': p['id'] ?? '',
//                 'name': p['name'] ?? '',
//               })
//           .toList(),
//       location: json['location'] ?? '',
//       currency: json['currency'] ?? '',
//       startDate: json['start_date'] ?? '',
//       endDate: json['end_date'] ?? '',
//       services: json['services'],
//       deliveryTerms: json['delivery_terms'],
//       effectiveDate: json['effective_date'],
//       purpose: json['purpose'],
//       disclosingParty: json['disclosing_party'],
//       receivingParty: json['receiving_party'],
//     );
//   }
// }
