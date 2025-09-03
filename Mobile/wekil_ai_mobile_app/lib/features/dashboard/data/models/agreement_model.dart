import 'dart:convert';

import '../../domain/entities/agreement.dart';

class AgreementModel {
  final String id;
  final String? title;
  final String currency;
  final double? totalAmount;
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
  final String? status;

  AgreementModel({
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

  factory AgreementModel.fromJson(Map<String, dynamic> json) {
    DateTime? parseDate(dynamic v) =>
        v == null ? null : DateTime.tryParse(v as String);
    double? parseNum(dynamic v) => v == null
        ? null
        : (v is num ? v.toDouble() : double.tryParse(v.toString()));

    final dueDates = <DateTime>[];
    if (json['due_dates'] is List) {
      for (final d in (json['due_dates'] as List)) {
        final dt = DateTime.tryParse(d.toString());
        if (dt != null) dueDates.add(dt);
      }
    }

    List<Milestone> parseMilestones() {
      final list = json['milestones'];
      if (list is List) {
        return list
            .map((e) => e as Map<String, dynamic>)
            .map(
              (m) => Milestone(
                description: (m['description'] ?? '').toString(),
                date:
                    DateTime.tryParse((m['date'] ?? '').toString()) ??
                    DateTime.now(),
              ),
            )
            .toList();
      }
      return const [];
    }

    List<Goods> parseGoods() {
      final list = json['goods'];
      if (list is List) {
        return list
            .map((e) => e as Map<String, dynamic>)
            .map(
              (g) => Goods(
                itemName: (g['item_name'] ?? g['name'] ?? '').toString(),
                quantity: (g['quantity'] is num)
                    ? (g['quantity'] as num).toDouble()
                    : double.tryParse(g['quantity']?.toString() ?? '0') ?? 0,
                unitPrice: (g['unit_price'] is num)
                    ? (g['unit_price'] as num).toDouble()
                    : double.tryParse(g['unit_price']?.toString() ?? '0') ?? 0,
              ),
            )
            .toList();
      }
      return const [];
    }

    List<Installment> parseInstallments() {
      final list = json['installments'];
      if (list is List) {
        return list
            .map((e) => e as Map<String, dynamic>)
            .map(
              (i) => Installment(
                amount: (i['amount'] is num)
                    ? (i['amount'] as num).toDouble()
                    : double.tryParse(i['amount']?.toString() ?? '0') ?? 0,
                dueDate:
                    DateTime.tryParse((i['due_date'] ?? '').toString()) ??
                    DateTime.now(),
              ),
            )
            .toList();
      }
      return const [];
    }

    List<Party> parseParties() {
      final list = json['parties'];
      if (list is List) {
        return list
            .map((e) => e as Map<String, dynamic>)
            .map(
              (p) => Party(
                name: (p['name'] ?? '').toString(),
                phone: (p['phone'] ?? p['telephone'])?.toString(),
                email: (p['email'])?.toString(),
              ),
            )
            .toList();
      }
      return const [];
    }

    return AgreementModel(
      id: (json['id'] ?? json['_id'] ?? '').toString(),
      title: json['title']?.toString(),
      currency: (json['currency'] ?? '').toString(),
      totalAmount: parseNum(json['total_amount']),
      startDate: parseDate(json['start_date']),
      endDate: parseDate(json['end_date']),
      dueDates: dueDates,
      location: json['location']?.toString(),
      services: json['services']?.toString(),
      milestones: parseMilestones(),
      revisions: (json['revisions'] is num)
          ? (json['revisions'] as num).toInt()
          : int.tryParse(json['revisions']?.toString() ?? ''),
      goods: parseGoods(),
      deliveryTerms: json['delivery_terms']?.toString(),
      principal: parseNum(json['principal']),
      installments: parseInstallments(),
      parties: parseParties(),
      status: json['status']?.toString(),
    );
  }

  Agreement toEntity() => Agreement(
    id: id,
    title: title,
    currency: currency,
    totalAmount: totalAmount,
    startDate: startDate,
    endDate: endDate,
    dueDates: dueDates,
    location: location,
    services: services,
    milestones: milestones,
    revisions: revisions,
    goods: goods,
    deliveryTerms: deliveryTerms,
    principal: principal,
    installments: installments,
    parties: parties,
    status: status,
  );

  static List<Agreement> listFromJsonString(String body) {
    final decoded = json.decode(body);
    Iterable<Map<String, dynamic>> rawList = const [];
    if (decoded is List) {
      rawList = decoded.cast<Map<String, dynamic>>();
    } else if (decoded is Map<String, dynamic> && decoded['data'] is List) {
      rawList = (decoded['data'] as List).cast<Map<String, dynamic>>();
    }
    final models = rawList
        .map((e) => AgreementModel.fromJson(e))
        .where((m) => (m.id).trim().isNotEmpty);
    return models.map((m) => m.toEntity()).toList(growable: false);
  }
}
