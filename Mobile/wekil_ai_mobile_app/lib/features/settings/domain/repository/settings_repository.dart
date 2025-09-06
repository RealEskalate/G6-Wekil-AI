import 'package:dartz/dartz.dart';
import '../../../../core/error/failure.dart';

import '../entities/user_profile.dart';
import '../entities/profile_update_result.dart';

abstract class SettingsRepository {
  Future<Either<Failure, UserProfile>> getProfile();
  Future<Either<Failure, ProfileUpdateResult>> updateProfile(UserProfile profile);
  Future<Either<Failure, void>> logout();
  Future<Either<Failure, ProfileUpdateResult>> changePassword({required String oldPassword, required String newPassword});
}
