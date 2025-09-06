import 'package:equatable/equatable.dart';

class ResetPassword extends Equatable {
  final String email;
  final String? otpCode;
  final String? newPassword;

  const ResetPassword({
    required this.email,
    this.otpCode,
    this.newPassword,
  });

  @override
  List<Object?> get props => [email, otpCode, newPassword];
}
