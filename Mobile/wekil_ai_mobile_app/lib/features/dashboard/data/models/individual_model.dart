import '../../domain/entities/individual.dart';

class IndividualModel {
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

  const IndividualModel({
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

  factory IndividualModel.fromJson(Map<String, dynamic> json) {
    DateTime? parseDate(dynamic v) =>
        v == null ? null : DateTime.tryParse(v.toString());
    return IndividualModel(
      id: (json['id'] ?? json['_id'] ?? '').toString(),
      email: (json['email'] ?? '').toString(),
      firstName: (json['first_name'] ?? '').toString(),
      lastName: (json['last_name'] ?? '').toString(),
      middleName: json['middle_name']?.toString(),
      telephone: (json['telephone'] ?? json['phone'])?.toString(),
      accountType: (json['account_type'] ?? '').toString(),
      isVerified:
          json['is_verified'] == true ||
          json['is_verified']?.toString() == 'true',
      createdAt: parseDate(json['created_at']) ?? DateTime.now(),
      updatedAt: parseDate(json['updated_at']),
      profileImage: json['profile_image']?.toString(),
      signature: json['signature']?.toString(),
    );
  }

  Individual toEntity() => Individual(
    id: id,
    email: email,
    firstName: firstName,
    lastName: lastName,
    middleName: middleName,
    telephone: telephone,
    accountType: accountType,
    isVerified: isVerified,
    createdAt: createdAt,
    updatedAt: updatedAt,
    profileImage: profileImage,
    signature: signature,
  );
}
