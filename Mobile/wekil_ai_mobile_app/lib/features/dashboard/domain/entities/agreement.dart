// Unified Agreement entity and nested types used across services, sales, and loans.
class Agreement {
  final String id;
  final String? title; // optional, for UI; backend may not provide.
  final String currency; // ISO code
  final double? totalAmount; // optional
  final DateTime? startDate;
  final DateTime? endDate;
  final List<DateTime> dueDates;
  final String? location;
  final String? services;
  final List<Milestone> milestones;
  final int? revisions;
  final List<Goods> goods;
  final String? deliveryTerms;
  final double? principal;
  final List<Installment> installments;
  final List<Party> parties;
  final String? status; // raw status string from backend

  const Agreement({
    required this.id,
    required this.currency,
    this.title,
    this.totalAmount,
    this.startDate,
    this.endDate,
    this.dueDates = const [],
    this.location,
    this.services,
    this.milestones = const [],
    this.revisions,
    this.goods = const [],
    this.deliveryTerms,
    this.principal,
    this.installments = const [],
    this.parties = const [],
    this.status,
  });

  AgreementType get type {
    if (services != null || milestones.isNotEmpty || revisions != null) {
      return AgreementType.service;
    }
    if (goods.isNotEmpty ||
        (deliveryTerms != null && deliveryTerms!.isNotEmpty)) {
      return AgreementType.sales;
    }
    if (principal != null || installments.isNotEmpty) {
      return AgreementType.loan;
    }
    return AgreementType.generic;
  }
}

enum AgreementType { service, sales, loan, generic }

class Party {
  final String name; // required
  final String? phone;
  final String? email;
  const Party({required this.name, this.phone, this.email});
}

class Milestone {
  final String description;
  final DateTime date;
  const Milestone({required this.description, required this.date});
}

class Goods {
  final String itemName;
  final double quantity;
  final double unitPrice;
  const Goods({
    required this.itemName,
    required this.quantity,
    required this.unitPrice,
  });
}

class Installment {
  final double amount;
  final DateTime dueDate;
  const Installment({required this.amount, required this.dueDate});
}
