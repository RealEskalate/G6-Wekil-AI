import 'package:dartz/dartz.dart';
import '../../../../core/error/failure.dart';
import '../entities/user.dart';
import '../entities/login_input.dart';
import '../entities/auth_tokens.dart';
import '../entities/otp_verification_input.dart';
import '../entities/otp_verification_result.dart';
import '../entities/api_response_message.dart';

abstract class AuthRepository {
  // register method
  Future<Either<Failure, ApiResponseMessage>> registerIndividual(User user, String password);
  Future<Either<Failure, OtpVerificationResult>> verifyOtp(OtpVerificationInput input);

  // login method
  Future<Either<Failure, AuthTokens>> login(LoginInput input);

  // Forgot/Reset password methods
  Future<Either<Failure, ApiResponseMessage>> requestPasswordReset(String email);
  Future<Either<Failure, ApiResponseMessage>> resetPassword(String email, String otpCode, String newPassword);
}
