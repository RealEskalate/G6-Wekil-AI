import '../../domain/entities/contract.dart';

class ContractModel extends Contract {
  const ContractModel({
    required super.id,
    required super.title,
    required super.type,
    required super.party,
    required super.createdAt,
    required super.amount,
    required super.currency,
    required super.status,
  });

  factory ContractModel.fromJson(Map<String, dynamic> json) {
    return ContractModel(
      id: json['id'] as String,
      title: json['title'] as String,
      type: json['type'] as String? ?? 'Contract',
      party: json['party'] as String? ?? '',
      createdAt: DateTime.parse(json['createdAt'] as String),
      amount: (json['amount'] as num?)?.toDouble() ?? 0,
      currency: json['currency'] as String? ?? 'ETB',
      status: _statusFromString(json['status'] as String),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'type': type,
    'party': party,
    'createdAt': createdAt.toIso8601String(),
    'amount': amount,
    'currency': currency,
    'status': status.name,
  };

  static ContractStatus _statusFromString(String s) {
    switch (s) {
      case 'draft':
        return ContractStatus.draft;
      case 'exported':
        return ContractStatus.exported;
      case 'signed':
        return ContractStatus.signed;
      default:
        return ContractStatus.draft;
    }
  }
}
