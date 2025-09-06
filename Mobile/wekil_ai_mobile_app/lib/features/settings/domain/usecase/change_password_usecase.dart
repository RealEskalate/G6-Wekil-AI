import 'package:dartz/dartz.dart';
import '../../../../core/error/failure.dart';
import '../entities/profile_update_result.dart';
import '../repository/settings_repository.dart';

class ChangePasswordUseCase {
  final SettingsRepository repository;
  ChangePasswordUseCase(this.repository);

  Future<Either<Failure, ProfileUpdateResult>> call({
    required String oldPassword,
    required String newPassword,
  }) {
    return repository.changePassword(oldPassword: oldPassword, newPassword: newPassword);
  }
}
