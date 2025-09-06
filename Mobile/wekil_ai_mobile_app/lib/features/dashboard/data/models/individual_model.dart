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
      id: (json['id'] ?? json['_id'] ?? json['userId'] ?? '').toString(),
      email: (json['email'] ?? json['Email'] ?? '').toString(),
      firstName: (json['firstName'] ?? json['first_name'] ?? '').toString(),
      lastName: (json['lastName'] ?? json['last_name'] ?? '').toString(),
      middleName: (json['middleName'] ?? json['middle_name'])?.toString(),
      telephone: (json['telephone'] ?? json['phone'] ?? json['mobile'])
          ?.toString(),
      accountType: (json['accountType'] ?? json['account_type'] ?? 'individual')
          .toString(),
      isVerified:
          json['isVerified'] == true ||
          json['is_verified'] == true ||
          json['isVerified']?.toString() == 'true' ||
          json['is_verified']?.toString() == 'true',
      createdAt:
          parseDate(json['created_at'] ?? json['createdAt']) ?? DateTime.now(),
      updatedAt: parseDate(json['updated_at'] ?? json['updatedAt']),
      profileImage: (json['profileImage'] ?? json['profile_image'])?.toString(),
      signature:
          (json['signature'] ??
                  json['signatureImage'] ??
                  json['signature_image'])
              ?.toString(),
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
