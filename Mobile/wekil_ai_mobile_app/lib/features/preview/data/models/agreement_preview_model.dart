import '../../domain/entities/agreement_preview.dart';

class AgreementPreviewModel {
  final String id;
  final String pdfUrl;
  final String? status;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final String? title;
  final String? agreementType;
  final String? services;
  final String? location;
  final String? currency;
  final List<String> parties;

  AgreementPreviewModel({
    required this.id,
    required this.pdfUrl,
    this.status,
    this.createdAt,
  this.updatedAt,
  this.title,
  this.agreementType,
  this.services,
  this.location,
  this.currency,
  this.parties = const [],
  });

  factory AgreementPreviewModel.fromJson(Map<String, dynamic> json) {
    DateTime? parseDate(dynamic v) => v == null ? null : DateTime.tryParse(v.toString());
    final data = json['data'] is Map<String, dynamic> ? json['data'] as Map<String, dynamic> : json;
    final intake = data['intake'] as Map<String, dynamic>?;
    List<String> parties = const [];
    final partiesRaw = intake?['parties'];
    if (partiesRaw is List) {
      parties = partiesRaw.map((e) {
        if (e is Map) {
          final name = e['name'] ?? e['full_name'] ?? e['first_name'];
          if (name != null && name.toString().trim().isNotEmpty) {
            return name.toString();
          }
          // fallback to id if exists, else stringify
          final id = e['id'] ?? e['_id'];
          return id != null ? id.toString() : e.toString();
        }
        return e.toString();
      }).toList(growable: false);
    }
    return AgreementPreviewModel(
      id: (data['id'] ?? data['_id'] ?? '').toString(),
      pdfUrl: (data['pdf_url'] ?? '').toString(),
      status: data['status']?.toString(),
      createdAt: parseDate(data['created_at']),
      updatedAt: parseDate(data['updated_at']),
      title: (data['agreement_title'] ?? data['title'])?.toString(),
      agreementType: (data['agreement_type'] ?? intake?['agreement_type'])?.toString(),
      services: (intake?['services'])?.toString(),
      location: (intake?['location'])?.toString(),
      currency: (intake?['currency'])?.toString(),
      parties: parties,
    );
  }

  AgreementPreview toEntity() => AgreementPreview(
        id: id,
        pdfUrl: pdfUrl,
        status: status,
        createdAt: createdAt,
        updatedAt: updatedAt,
        title: title,
        agreementType: agreementType,
        services: services,
        location: location,
        currency: currency,
        parties: parties,
      );
}
