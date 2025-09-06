import 'package:equatable/equatable.dart';

class OtpVerificationInput extends Equatable {
  final String email;
  final String otp;
  const OtpVerificationInput({required this.email, required this.otp});
  
  @override
  List<Object?> get props => [email, otp];
}
