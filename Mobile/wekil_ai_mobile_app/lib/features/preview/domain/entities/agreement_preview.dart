class AgreementPreview {
  final String id;
  final String pdfUrl;
  final String? status;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final String? title;
  // intake summary
  final String? agreementType;
  final String? services;
  final String? location;
  final String? currency;
  final List<String> parties;

  const AgreementPreview({
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
}
