import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/auth_tokens_model.dart';

abstract class AuthLocalDataSource {
  Future<void> cacheAuthTokens(AuthTokensModel tokens);
  Future<AuthTokensModel?> getCachedAuthTokens();
  Future<void> clearAuthTokens();
}



const _kAccessTokenKey = 'ACCESS_TOKEN_VOLATILE'; // memory-only
const _kRefreshTokenKey = 'REFRESH_TOKEN_SECURE'; // secure storage

class AuthLocalDataSourceImpl implements AuthLocalDataSource {
  final FlutterSecureStorage secureStorage;
  // In-memory volatile access token; cleared on app restart.
  String _accessToken = '';

  AuthLocalDataSourceImpl({required this.secureStorage});

  @override
  Future<void> cacheAuthTokens(AuthTokensModel tokens) async {
    // Access token: keep in memory only
    _accessToken = tokens.accessToken;
    // Refresh token: store securely
    if (tokens.refreshToken.isNotEmpty) {
      await secureStorage.write(key: _kRefreshTokenKey, value: tokens.refreshToken);
    }
  }

  @override
  Future<AuthTokensModel?> getCachedAuthTokens() async {
    final refresh = await secureStorage.read(key: _kRefreshTokenKey) ?? '';
    if (_accessToken.isEmpty && refresh.isEmpty) return null;
    return AuthTokensModel(accessToken: _accessToken, refreshToken: refresh);
  }

  @override
  Future<void> clearAuthTokens() async {
    _accessToken = '';
    await secureStorage.delete(key: _kRefreshTokenKey);
  }
}
