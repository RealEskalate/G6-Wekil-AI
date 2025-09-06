import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

abstract class SettingsLocalDataSource {
  Future<void> clearAuthTokens();
}

const String CACHED_AUTH_TOKENS = 'CACHED_AUTH_TOKENS';

class SettingsLocalDataSourceImpl implements SettingsLocalDataSource {
  final SharedPreferences sharedPreferences;
  final FlutterSecureStorage secureStorage;

  SettingsLocalDataSourceImpl({required this.sharedPreferences, required this.secureStorage});

  @override
  Future<void> clearAuthTokens() async {
    // Legacy: remove any SharedPreferences token cache
    await sharedPreferences.remove(CACHED_AUTH_TOKENS);
    // Secure: remove refresh token stored securely (must match key used in AuthLocalDataSourceImpl)
    await secureStorage.delete(key: 'REFRESH_TOKEN_SECURE');
  }
}
