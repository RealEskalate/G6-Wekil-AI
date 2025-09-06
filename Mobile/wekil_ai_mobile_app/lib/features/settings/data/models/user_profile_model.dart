import '../../domain/entities/user_profile.dart';

class UserProfileModel extends UserProfile {
  const UserProfileModel({
    required super.id,
    required super.email,
    required super.firstName,
    required super.lastName,
    super.middleName,
    required super.telephone,
    super.address,
    required super.accountType,
    required super.isVerified,
    super.profileImage,
    super.signature,
  });

  factory UserProfileModel.fromJson(Map<String, dynamic> json) {
    return UserProfileModel(
    id: json['id'] ?? json['_id'] ?? json['userId'] ?? json['uid'] ?? '',
      email: json['email'] ?? '',
      firstName: json['firstName'] ?? json['first_name'] ?? '',
      lastName: json['lastName'] ?? json['last_name'] ?? '',
  middleName: json['middleName'] ?? json['middle_name'],
  telephone: json['telephone'] ?? json['phone'] ?? json['mobile'] ?? '',
  address: json['address'],
      accountType: json['accountType'] ?? json['account_type'] ?? 'individual',
      isVerified: json['isVerified'] ?? json['is_verified'] ?? true,
  profileImage: json['profileImage'] ?? json['profile_image'],
  signature: json['signature'] ?? json['signatureImage'] ?? json['signature_image'] ?? json['Signature'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'firstName': firstName,
      'lastName': lastName,
      'middleName': middleName,
      'telephone': telephone,
      'address': address,
      'accountType': accountType,
      'isVerified': isVerified,
      'profileImage': profileImage,
      'signature': signature,
    };
  }
}
