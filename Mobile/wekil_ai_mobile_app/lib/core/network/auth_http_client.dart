import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart' show kIsWeb;

typedef TokenGetter = Future<String?> Function();
typedef TokenSaver = Future<void> Function(String accessToken, String refreshToken);
typedef VoidAsync = Future<void> Function();

class AuthHttpClient extends http.BaseClient {
  final http.Client _inner;
  final TokenGetter getAccessToken;
  final TokenGetter getRefreshToken;
  final TokenSaver saveTokens;
  final VoidAsync logout;
  final String refreshUrl;

  AuthHttpClient({
    required http.Client inner,
    required this.getAccessToken,
    required this.getRefreshToken,
    required this.saveTokens,
    required this.logout,
    required this.refreshUrl,
  }) : _inner = inner;

  @override
  Future<http.StreamedResponse> send(http.BaseRequest request) async {
    // Buffer body for retry if possible
    List<int>? bufferedBody;
    List<http.MultipartFile>? bufferedFiles;
    Map<String, String>? bufferedFields;

    if (request is http.Request) {
      bufferedBody = request.bodyBytes;
    } else if (request is http.MultipartRequest) {
      bufferedFiles = List.from(request.files);
      bufferedFields = Map.from(request.fields);
    }

    // Attach access token if available; if missing but refresh exists, try preemptive refresh.
    String? token = await getAccessToken();
    if ((token == null || token.isEmpty) && !request.headers.containsKey('Authorization')) {
      final refresh = await getRefreshToken();
      if (refresh != null && refresh.isNotEmpty) {
        final ok = await _refreshTokens();
        if (ok) token = await getAccessToken();
      }
    }
    if (token != null && token.isNotEmpty && !request.headers.containsKey('Authorization')) {
      request.headers['Authorization'] = 'Bearer $token';
    }

    final response = await _inner.send(request);

    if (response.statusCode != 401) return response;

    // 401 -> try refresh once
    final refreshed = await _refreshTokens();
    if (!refreshed) {
      await logout();
      return response; // propagate 401
    }

    // Retry original request with new token
    final cloned = await _cloneRequestWithNewToken(request, bufferedBody: bufferedBody, bufferedFiles: bufferedFiles, bufferedFields: bufferedFields);
    if (cloned == null) return response; // cannot retry
    return _inner.send(cloned);
  }

  Future<bool> _refreshTokens() async {
    final refreshToken = await getRefreshToken();
    final oldAccess = await getAccessToken();
    if (refreshToken == null || refreshToken.isEmpty) return false;

    final uri = Uri.parse(refreshUrl);
    final headers = <String, String>{
      'Content-Type': 'application/json',
      if (oldAccess != null && oldAccess.isNotEmpty) 'Authorization': 'Bearer $oldAccess',
      // On web, cookies are managed by the browser and sent when withCredentials=true.
      if (!kIsWeb && refreshToken.isNotEmpty)
        // Include common cookie aliases to maximize compatibility
        'Cookie': 'refresh_token=$refreshToken; refreshToken=$refreshToken; WEKIL-API-REFRESH-TOKEN=$refreshToken',
    };
    final res = await _inner.post(uri, headers: headers);

    if (res.statusCode != 200) return false;

    // Parse new access token from Authorization header
    final authHeader = res.headers['authorization'] ?? '';
    final newAccess = authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : authHeader;

    // Parse new refresh token from Set-Cookie if present
    String newRefresh = refreshToken;
    final setCookie = res.headers['set-cookie'];
    if (setCookie != null) {
      final patterns = [
        RegExp(r'refresh_token=([^;]+)', caseSensitive: false),
        RegExp(r'refreshToken=([^;]+)', caseSensitive: false),
        RegExp(r'WEKIL-API-REFRESH-TOKEN=([^;]+)', caseSensitive: false),
      ];
      for (final p in patterns) {
        final m = p.firstMatch(setCookie);
        if (m != null) {
          newRefresh = m.group(1)!;
          break;
        }
      }
    }

    if (newAccess.isEmpty) return false;

    await saveTokens(newAccess, newRefresh);
    return true;
  }

  Future<http.BaseRequest?> _cloneRequestWithNewToken(
    http.BaseRequest original, {
    List<int>? bufferedBody,
    List<http.MultipartFile>? bufferedFiles,
    Map<String, String>? bufferedFields,
  }) async {
    final newAccess = await getAccessToken();
    if (newAccess == null || newAccess.isEmpty) return null;

    // Only supports common Request and MultipartRequest
    if (original is http.Request) {
      final clone = http.Request(original.method, original.url);
      clone.headers.addAll(original.headers);
      clone.headers['Authorization'] = 'Bearer $newAccess';
      if (bufferedBody != null) {
        clone.bodyBytes = bufferedBody;
      }
      return clone;
    } else if (original is http.MultipartRequest) {
      final clone = http.MultipartRequest(original.method, original.url);
      clone.headers.addAll(original.headers);
      clone.headers['Authorization'] = 'Bearer $newAccess';
      if (bufferedFields != null) clone.fields.addAll(bufferedFields);
      if (bufferedFiles != null) clone.files.addAll(bufferedFiles);
      return clone;
    }
    return null;
  }
}
