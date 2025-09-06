import '../../domain/entities/forgot_password_request.dart';

class ForgotPasswordRequestModel extends ForgotPasswordRequest {
  const ForgotPasswordRequestModel({required super.email});

  factory ForgotPasswordRequestModel.fromJson(Map<String, dynamic> json) {
    return ForgotPasswordRequestModel(email: json['email'] as String);
  }

  Map<String, dynamic> toJson() => {
        'email': email,
      };
}
