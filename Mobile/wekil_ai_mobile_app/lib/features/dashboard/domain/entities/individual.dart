class Individual {
  final String id;
  final String email;
  final String firstName;
  final String lastName;
  final String? middleName;
  final String? telephone;
  final String accountType;
  final bool isVerified;
  final DateTime createdAt;
  final DateTime? updatedAt;
  final String? profileImage;
  final String? signature;

  const Individual({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    this.middleName,
    this.telephone,
    required this.accountType,
    required this.isVerified,
    required this.createdAt,
    this.updatedAt,
    this.profileImage,
    this.signature,
  });

  String get fullName => [
    firstName,
    middleName,
    lastName,
  ].where((e) => (e ?? '').trim().isNotEmpty).join(' ');
}
