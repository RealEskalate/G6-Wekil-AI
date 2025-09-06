import '../../domain/entities/login_input.dart';

class LoginInputModel extends LoginInput {
  const LoginInputModel({required super.email, required super.password});

  factory LoginInputModel.fromJson(Map<String, dynamic> json) {
    return LoginInputModel(
      email: json['email'],
      password: json['password'],
    );
  }

  Map<String, dynamic> toJson() => {
        'email': email,
        'password': password,
      };
}
