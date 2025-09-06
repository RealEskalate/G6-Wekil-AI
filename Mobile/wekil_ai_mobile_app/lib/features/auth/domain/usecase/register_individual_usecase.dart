import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failure.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/user.dart';
import '../entities/api_response_message.dart';
import '../repository/auth_repository.dart';


class RegisterIndividualParams extends Equatable {
  final User user;
  final String password;
  const RegisterIndividualParams(this.user, this.password);

  @override
  List<Object?> get props => [user, password];
}

class RegisterIndividualUseCase extends Usecase<ApiResponseMessage, RegisterIndividualParams> {
  final AuthRepository repository;
  RegisterIndividualUseCase(this.repository);

  @override
  Future<Either<Failure, ApiResponseMessage>> call(RegisterIndividualParams params) {
    return repository.registerIndividual(params.user, params.password);
  }
}
