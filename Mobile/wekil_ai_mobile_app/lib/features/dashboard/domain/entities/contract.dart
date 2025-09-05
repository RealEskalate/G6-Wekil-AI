enum ContractStatus { draft, exported, signed }

class Contract {
  final String id;
  final String title;
  final String type; // e.g., Service Agreement
  final String party; // e.g., counterparty or short label
  final DateTime createdAt;
  final double amount;
  final String currency; // e.g., ETB, USD
  final ContractStatus status;

  const Contract({
    required this.id,
    required this.title,
    required this.type,
    required this.party,
    required this.createdAt,
    required this.amount,
    required this.currency,
    required this.status,
  });
}
