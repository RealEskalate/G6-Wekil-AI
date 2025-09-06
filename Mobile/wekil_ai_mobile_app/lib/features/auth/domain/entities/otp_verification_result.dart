import 'package:equatable/equatable.dart';

class OtpVerificationResult extends Equatable {
  final String message;
  final bool isVerified;
  const OtpVerificationResult({required this.message, required this.isVerified});
  
  @override
  List<Object?> get props => [message, isVerified];
}
