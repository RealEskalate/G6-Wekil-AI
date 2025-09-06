import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failure.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/otp_verification_input.dart';
import '../entities/otp_verification_result.dart';
import '../repository/auth_repository.dart';

class VerifyOtpParams extends Equatable{
  final OtpVerificationInput input;
  const VerifyOtpParams(this.input);
  
  @override
  List<Object?> get props => [input];
}

class VerifyOtpUseCase extends Usecase<OtpVerificationResult, VerifyOtpParams> {
  final AuthRepository repository;
  VerifyOtpUseCase(this.repository);

  @override
  Future<Either<Failure, OtpVerificationResult>> call(VerifyOtpParams params) {
    return repository.verifyOtp(params.input);
  }
}
