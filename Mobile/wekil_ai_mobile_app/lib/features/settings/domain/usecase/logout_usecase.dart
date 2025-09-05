import 'package:dartz/dartz.dart';
import '../../../../core/error/failure.dart';
import '../repository/settings_repository.dart';

class LogoutUseCase {
  final SettingsRepository repository;
  LogoutUseCase(this.repository);

  Future<Either<Failure, void>> call() async {
    return await repository.logout();
  }
}
