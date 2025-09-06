import '../../domain/entities/otp_verification_input.dart';

class OtpVerificationInputModel extends OtpVerificationInput {
  const OtpVerificationInputModel({required super.email, required super.otp});

  factory OtpVerificationInputModel.fromJson(Map<String, dynamic> json) {
    return OtpVerificationInputModel(
      email: json['email'],
      otp: json['otp'],
    );
  }

  Map<String, dynamic> toJson() => {
        'email': email,
        'otp': otp,
      };
}
