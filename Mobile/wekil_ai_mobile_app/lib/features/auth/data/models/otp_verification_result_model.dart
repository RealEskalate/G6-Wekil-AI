import '../../domain/entities/otp_verification_result.dart';

class OtpVerificationResultModel extends OtpVerificationResult {
  const OtpVerificationResultModel({required super.message, required super.isVerified});

  factory OtpVerificationResultModel.fromJson(Map<String, dynamic> json) {
    // Server returns top-level { success, code, message }
    // Compute isVerified from success true or code == 'OTP_VERIFIED'
    final success = json['success'] == true;
    final code = (json['code'] as String?)?.toUpperCase();
    final msg = (json['message'] as String?) ?? 'OK';
    return OtpVerificationResultModel(
      message: msg,
      isVerified: success || code == 'OTP_VERIFIED',
    );
  }
}
