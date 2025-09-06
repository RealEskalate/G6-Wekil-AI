import 'package:dartz/dartz.dart';
import '../../../../core/error/failure.dart';
import '../repository/auth_repository.dart';
import '../entities/api_response_message.dart';

class ResetPassword {
  final AuthRepository repository;
  ResetPassword(this.repository);

  Future<Either<Failure, ApiResponseMessage>> call({
    required String email,
    required String otpCode,
    required String newPassword,
  }) async {
    // The repository will construct the model
    return await repository.resetPassword(email, otpCode, newPassword);
  }
}
