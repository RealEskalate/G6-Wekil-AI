import 'package:dartz/dartz.dart';
import '../../../../core/error/failure.dart';
import '../entities/user_profile.dart';
import '../repository/settings_repository.dart';

class GetProfileUseCase {
  final SettingsRepository repository;
  GetProfileUseCase(this.repository);

  Future<Either<Failure, UserProfile>> call() async {
    return await repository.getProfile();
  }
}
