import '../../domain/entities/user.dart';

class UserModel extends User {
  const UserModel({
    required super.firstName,
    required super.lastName,
    super.middleName,
    required super.email,
    required super.telephone,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      firstName: json['firstName'] ?? '',
      lastName: json['lastName'] ?? '',
      middleName: json['middleName'],
      email: json['email'],
      telephone: json['telephone'],
    );
  }

  Map<String, dynamic> toJson({required String password}) {
    return {
      'firstName': firstName,
      'lastName': lastName,
      'middleName': middleName,
      'email': email,
      'password': password,
      'telephone': telephone,
    };
  }
}
