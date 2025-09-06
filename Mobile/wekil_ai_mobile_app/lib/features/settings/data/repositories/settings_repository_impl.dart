import 'package:dartz/dartz.dart';
import '../../../../core/error/failure.dart';
import '../../domain/entities/profile_update_result.dart';
import '../../domain/entities/user_profile.dart';
import '../../domain/repository/settings_repository.dart';
import '../datasources/settings_local_data_source.dart';
import '../datasources/settings_remote_data_source.dart';
import '../models/auth_tokens_model.dart';

class SettingsRepositoryImpl implements SettingsRepository {
  final SettingsRemoteDataSource remoteDataSource;
  final SettingsLocalDataSource localDataSource;
  final Future<AuthTokensModel?> Function() getCachedAuthTokens;

  SettingsRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
    required this.getCachedAuthTokens,
  });

  @override
  Future<Either<Failure, UserProfile>> getProfile() async {
    try {
      final tokens = await getCachedAuthTokens();
      if (tokens == null) return Left(CacheFailure());
      final model = await remoteDataSource.getProfile(tokens.accessToken);
      return Right(model);
    } on Failure catch (f) {
      return Left(f);
    } catch (e) {
      return Left(ServerFailure());
    }
  }

  @override
  Future<Either<Failure, ProfileUpdateResult>> updateProfile(UserProfile profile) async {
    try {
      final tokens = await getCachedAuthTokens();
      if (tokens == null) return Left(CacheFailure());
      final Map<String, dynamic> updateData = {
        // Backend expects snake_case; only send allowed fields
        'first_name': profile.firstName,
        'last_name': profile.lastName,
        'middle_name': profile.middleName,
        'telephone': profile.telephone,
        'address': profile.address,
        'profile_image': profile.profileImage,
        'signature': profile.signature,
      }..removeWhere((k, v) => v == null || (v is String && v.trim().isEmpty));
      final result = await remoteDataSource.updateProfile(tokens.accessToken, updateData);
      return Right(result);
    } on Failure catch (f) {
      return Left(f);
    } catch (e) {
      return Left(ServerFailure());
    }
  }

  @override
  Future<Either<Failure, void>> logout() async {
    final tokens = await getCachedAuthTokens();
    // Always clear locally to guarantee logout UX, even if remote fails
    if (tokens == null) {
      await localDataSource.clearAuthTokens();
      return const Right(null);
    }
    try {
      await remoteDataSource.logout(tokens.accessToken);
    } catch (_) {
      // ignore remote errors; proceed to clear tokens
    } finally {
      await localDataSource.clearAuthTokens();
    }
    return const Right(null);
  }

  @override
  Future<Either<Failure, ProfileUpdateResult>> changePassword({required String oldPassword, required String newPassword}) async {
    try {
      final tokens = await getCachedAuthTokens();
      if (tokens == null) return Left(CacheFailure());
      final result = await remoteDataSource.changePassword(
        tokens.accessToken,
        oldPassword: oldPassword,
        newPassword: newPassword,
      );
      return Right(result);
    } on Failure catch (f) {
      return Left(f);
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
