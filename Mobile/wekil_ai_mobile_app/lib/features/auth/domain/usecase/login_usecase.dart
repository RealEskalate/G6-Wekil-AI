import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failure.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/login_input.dart';
import '../entities/auth_tokens.dart';
import '../repository/auth_repository.dart';

class LoginParams  extends Equatable{
  final LoginInput input;
  const LoginParams(this.input);
  
  @override
  List<Object?> get props => [input];
}

class LoginUseCase extends Usecase<AuthTokens, LoginParams> {
  final AuthRepository repository;
  LoginUseCase(this.repository);

  @override
  Future<Either<Failure, AuthTokens>> call(LoginParams params) {
    return repository.login(params.input);
  }
}
