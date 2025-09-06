import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart' show kIsWeb;
import '../../../../core/network/http_client_factory.dart';
import '../models/forgot_password_request_model.dart';
import '../models/reset_password_request_model.dart';
import '../models/user_model.dart';
import '../models/auth_tokens_model.dart';
import '../models/login_input_model.dart';
import '../models/otp_verification_input_model.dart';
import '../models/otp_verification_result_model.dart';
import '../models/api_response_message_model.dart';

abstract class AuthRemoteDataSource {
  Future<ApiResponseMessageModel> registerIndividual(UserModel user, String password);
  Future<AuthTokensModel> login(LoginInputModel input);
  Future<OtpVerificationResultModel> verifyOtp(OtpVerificationInputModel input);

  Future<ApiResponseMessageModel> requestPasswordReset(ForgotPasswordRequestModel request);
  Future<ApiResponseMessageModel> resetPassword(ResetPasswordRequestModel request);
}



class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final http.Client client;
  final String baseUrl;

  // Default to deployed server if not provided
  AuthRemoteDataSourceImpl({required this.client, String? baseUrl})
      : baseUrl = baseUrl ?? 'https://g6-wekil-ai-1.onrender.com';

  @override
  Future<ApiResponseMessageModel> registerIndividual(UserModel user, String password) async {
    final body = {
      'email': user.email,
      'password': password,
      'first_name': user.firstName,
      'last_name': user.lastName,
      'middle_name': user.middleName ?? '',
      'telephone': user.telephone,
      'accountType': 'user',
    };
    final response = await client.post(
      Uri.parse('$baseUrl/api/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(body),
    );
    final raw = response.body.isNotEmpty ? jsonDecode(response.body) : {};
    if (raw is Map<String, dynamic>) {
      return ApiResponseMessageModel.fromJson(raw);
    }
    return const ApiResponseMessageModel(message: 'Unexpected response');
  }

  @override
  Future<ApiResponseMessageModel> requestPasswordReset(ForgotPasswordRequestModel request) async {
    final response = await client.post(
      Uri.parse('$baseUrl/api/auth/forgot-password'),
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode(request.toJson()),
    );

    Map<String, dynamic>? root;
    if (response.body.isNotEmpty) {
      try {
        final decoded = jsonDecode(response.body);
        if (decoded is Map<String, dynamic>) {
          root = decoded;
        }
      } catch (_) {
        // Non-JSON or malformed body; fall through to defaults
      }
    }

    if (root != null) {
      return ApiResponseMessageModel.fromJson(root);
    }

    // Fallbacks when no/invalid JSON returned
    if (response.statusCode >= 200 && response.statusCode < 300) {
      final rawText = response.body.trim();
      final msg = rawText.isNotEmpty ? rawText : 'Verification code sent';
      return ApiResponseMessageModel(message: msg, success: true);
    }
    throw Exception('Failed to request password reset (${response.statusCode})');
  }

  @override
  Future<ApiResponseMessageModel> resetPassword(ResetPasswordRequestModel request) async {
    final response = await client.post(
      Uri.parse('$baseUrl/api/auth/reset-password'),
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode(request.toJson()),
    );

    Map<String, dynamic>? root;
    if (response.body.isNotEmpty) {
      try {
        final decoded = jsonDecode(response.body);
        if (decoded is Map<String, dynamic>) {
          root = decoded;
        }
      } catch (_) {}
    }

    if (root != null) {
      return ApiResponseMessageModel.fromJson(root);
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      final rawText = response.body.trim();
      final msg = rawText.isNotEmpty ? rawText : 'Password reset successful';
      return ApiResponseMessageModel(message: msg, success: true);
    }
    throw Exception('Failed to reset password (${response.statusCode})');
  }

  @override
  Future<AuthTokensModel> login(LoginInputModel input) async {
    // On web, login with a no-credentials client to avoid CORS credentials preflight blocking.
    final http.Client c = kIsWeb ? createWebClientNoCreds() : client;
    final response = await c.post(
      Uri.parse('$baseUrl/api/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(input.toJson()),
    );
    // Debug: log header keys and Authorization presence (masked) to diagnose missing tokens
    assert(() {
      try {
        final keys = response.headers.keys.toList()..sort();
        // ignore: avoid_print
        print('[AuthRemoteDS] login status: ${response.statusCode}, headers: ${keys.join(', ')}');
        final auth = response.headers['authorization'] ?? '';
        String mask(String t) {
          if (t.isEmpty) return '(empty)';
          if (t.startsWith('Bearer ')) t = t.substring(7);
          if (t.length <= 8) return '${t[0]}***${t[t.length - 1]}';
          return '${t.substring(0,6)}...${t.substring(t.length - 4)}';
        }
        // ignore: avoid_print
        print('[AuthRemoteDS] login Authorization header: ${mask(auth)}');
      } catch (_) {}
      return true;
    }());
    Map<String, dynamic>? rootJson;
    if (response.body.isNotEmpty) {
      try {
        final decoded = jsonDecode(response.body);
        if (decoded is Map<String, dynamic>) {
          rootJson = decoded;
        }
      } catch (_) {
        // Ignore parse errors and fall back to headers/cookies.
      }
    }

    // Extract access token from headers and strip 'Bearer ' prefix if present
    final authHeader = response.headers['authorization'] ?? '';
    String headerAccess = authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : authHeader;

    // Extract tokens from JSON body as fallback/alternative
    String bodyAccess = '';
    String bodyRefresh = '';
    if (rootJson != null) {
      final Map<String, dynamic> dataNode = (rootJson['data'] is Map<String, dynamic>)
          ? Map<String, dynamic>.from(rootJson['data'] as Map)
          : rootJson;
      // Common access token keys
      for (final k in const ['accessToken', 'token', 'access_token', 'jwt', 'idToken', 'id_token']) {
        final v = dataNode[k];
        if (v is String && v.isNotEmpty) { bodyAccess = v; break; }
      }
      // Common refresh token keys (if backend returns it in JSON)
      for (final k in const ['refreshToken', 'refresh_token', 'WEKIL-API-REFRESH-TOKEN']) {
        final v = dataNode[k];
        if (v is String && v.isNotEmpty) { bodyRefresh = v; break; }
      }
    }

    // Extract refresh token from cookies (primarily for mobile/desktop; browser JS cannot read Set-Cookie)
    String cookieRefresh = '';
    final setCookie = response.headers['set-cookie'];
    if (setCookie != null && setCookie.isNotEmpty) {
      final patterns = [
        RegExp(r'WEKIL-API-REFRESH-TOKEN=([^;]+)', caseSensitive: false),
        RegExp(r'refreshToken=([^;]+)', caseSensitive: false),
        RegExp(r'refresh_token=([^;]+)', caseSensitive: false),
      ];
      for (final p in patterns) {
        final m = p.firstMatch(setCookie);
        if (m != null) { cookieRefresh = m.group(1)!; break; }
      }
    }

    // Prefer header token; fallback to body token
    final accessToken = (headerAccess.isNotEmpty) ? headerAccess : bodyAccess;
    // Prefer cookie refresh (mobile/desktop), then body refresh (if provided), else empty
    final refreshToken = cookieRefresh.isNotEmpty ? cookieRefresh : bodyRefresh;

    final isOk = response.statusCode >= 200 && response.statusCode < 300;
    final isJsonSuccess = (rootJson != null) && (rootJson['success'] == true ||
        (rootJson['status'] == 200 || rootJson['status'] == 'success'));

    if ((isOk || isJsonSuccess) && accessToken.isNotEmpty) {
      return AuthTokensModel(accessToken: accessToken, refreshToken: refreshToken);
    }

    final message = rootJson != null
        ? (rootJson['data']?['message'] ?? rootJson['message'] ?? 'Login failed')
        : (response.body.isEmpty ? 'Empty response body (possible CORS/network block)' : 'Login failed');
    throw Exception(message);
  }

  @override
  Future<OtpVerificationResultModel> verifyOtp(OtpVerificationInputModel input) async {
    final response = await client.post(
      Uri.parse('$baseUrl/api/auth/verify-otp'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(input.toJson()),
    );
    final raw = response.body.isNotEmpty ? jsonDecode(response.body) : {};
    if (raw is Map<String, dynamic>) {
      return OtpVerificationResultModel.fromJson(raw);
    }
    return const OtpVerificationResultModel(message: 'Unexpected response', isVerified: false);
  }
}
