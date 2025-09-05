import 'package:mobile/features/auth/domain/entities/reset_password_request.dart';

class ResetPasswordRequestModel extends ResetPasswordRequest {
  const ResetPasswordRequestModel({
    required super.email,
    required super.otp,
    required super.newPassword,
  });

  factory ResetPasswordRequestModel.fromJson(Map<String, dynamic> json) {
    return ResetPasswordRequestModel(
      email: json['email'] as String,
      otp: json['otp'] as String,
      newPassword:
          json['newPassword'] as String? ?? json['new_password'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'email': email,
    'otp': otp,
    // API expects snake_case key
    'new_password': newPassword,
  };
}
