import 'package:dartz/dartz.dart';
import '../../../../core/error/failure.dart';
import '../repository/auth_repository.dart';
import '../entities/api_response_message.dart';

class RequestPasswordReset {
  final AuthRepository repository;
  RequestPasswordReset(this.repository);

  Future<Either<Failure, ApiResponseMessage>> call(String email) async {
    return await repository.requestPasswordReset(email);
  }
}
