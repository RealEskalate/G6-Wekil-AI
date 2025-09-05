import '../models/user_profile_model.dart';
import '../models/profile_update_result_model.dart';

abstract class SettingsRemoteDataSource {
  Future<UserProfileModel> getProfile(String accessToken);
  Future<ProfileUpdateResultModel> updateProfile(String accessToken, Map<String, dynamic> updateData);
  Future<void> logout(String accessToken);
  Future<ProfileUpdateResultModel> changePassword(String accessToken, {required String oldPassword, required String newPassword});
}
