import 'package:equatable/equatable.dart';

class ResetPasswordRequest extends Equatable {
  final String email;
  final String otp;
  final String newPassword;

  const ResetPasswordRequest({
    required this.email,
    required this.otp,
    required this.newPassword,
  });

  @override
  List<Object?> get props => [email, otp, newPassword];
}
