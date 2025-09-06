import 'package:dartz/dartz.dart';
import '../../../../core/error/failure.dart';
import '../entities/user_profile.dart';
import '../entities/profile_update_result.dart';
import '../repository/settings_repository.dart';

class UpdateProfileUseCase {
  final SettingsRepository repository;
  UpdateProfileUseCase(this.repository);

  Future<Either<Failure, ProfileUpdateResult>> call(UserProfile profile) async {
    return await repository.updateProfile(profile);
  }
}
