import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart' show kIsWeb, kDebugMode;
import '../../../../core/network/http_client_factory.dart';
import '../../../../core/error/failure.dart';
import '../models/user_profile_model.dart';
import '../models/profile_update_result_model.dart';

import 'settings_remote_data_source.dart';

class SettingsRemoteDataSourceImpl implements SettingsRemoteDataSource {
  final http.Client client;
  final String baseUrl;

  SettingsRemoteDataSourceImpl({required this.client, required this.baseUrl});

  @override
  Future<UserProfileModel> getProfile(String accessToken) async {
    // Debug: print masked token to verify what's being sent (debug mode only)
    if (kDebugMode) {
      String maskToken(String t) {
        if (t.isEmpty) return '(empty)';
        if (t.length <= 8) return '${t[0]}***${t[t.length - 1]}';
        final start = t.substring(0, 6);
        final end = t.substring(t.length - 4);
        return '$start...$end';
      }
      // ignore: avoid_print
      print('[SettingsRemoteDataSource] GET /api/users/profile Authorization: Bearer ${maskToken(accessToken)}');
    }

    // Build common headers; Authorization will be refreshed by AuthHttpClient on 401
    final headers = <String, String>{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $accessToken',
      // Cache-busting to avoid stale responses on some backends/CDNs
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    };

  // On web, avoid credentials to bypass CORS wildcard-credentials constraint.
  final http.Client eff = kIsWeb ? createWebClientNoCreds() : client;
  Uri _withTs(String path) {
    final nowTs = DateTime.now().millisecondsSinceEpoch.toString();
    final u = Uri.parse('$baseUrl$path');
    final qp = Map<String, String>.from(u.queryParameters);
    qp['ts'] = nowTs; // cache-buster
    return u.replace(queryParameters: qp);
  }
  Future<http.Response> _doGet(String path) => eff.get(
        _withTs(path),
        headers: headers,
      );

    // Try primary endpoint, fall back to an alternate if needed
    http.Response response;
    try {
      response = await _doGet('/api/users/profile');
      if (response.statusCode == 404 || response.statusCode == 405) {
        response = await _doGet('/api/users/me');
      }
    } on http.ClientException catch (_) {
      // Likely CORS or network issue on web
      throw NetworkFailure(message: 'Network/CORS error while fetching profile');
    }

    if (response.statusCode == 200) {
      final raw = response.body.trim();
      if (raw.isEmpty) {
        throw Exception('Empty profile response');
      }
      dynamic decoded;
      try {
        decoded = json.decode(raw);
      } catch (_) {
        throw Exception('Invalid profile response');
      }

      final Map<String, dynamic> root =
          decoded is Map<String, dynamic> ? decoded : <String, dynamic>{};

      Map<String, dynamic>? userData;

      // data.user or data.profile or data directly
      final dynamic data = root['data'];
      if (data is Map<String, dynamic>) {
        if (data['user'] is Map<String, dynamic>) {
          userData = Map<String, dynamic>.from(data['user'] as Map);
        } else if (data['profile'] is Map<String, dynamic>) {
          userData = Map<String, dynamic>.from(data['profile'] as Map);
        } else {
          userData = Map<String, dynamic>.from(data);
        }
      }

      // root.user or root.profile
      if (userData == null && root['user'] is Map) {
        userData = Map<String, dynamic>.from(root['user'] as Map);
      }
      if (userData == null && root['profile'] is Map) {
        userData = Map<String, dynamic>.from(root['profile'] as Map);
      }

      // If the root itself looks like a user object
      if (userData == null && root.isNotEmpty) {
        final keys = root.keys.map((e) => e.toString()).toList();
        final likelyProfile = keys.any(
          (k) => k.toLowerCase().contains('firstname') ||
                  k.toLowerCase().contains('first_name') ||
                  k.toLowerCase().contains('last') ||
                  k.toLowerCase() == 'email',
        );
        if (likelyProfile) {
          userData = root;
        }
      }

      if (userData == null) {
        throw Exception('Failed to parse profile payload');
      }

      return UserProfileModel.fromJson(userData);
    } else if (response.statusCode == 204) {
      throw Exception('Profile not found');
    } else {
      throw Exception('Failed to load profile (${response.statusCode})');
    }
  }

  @override
  Future<ProfileUpdateResultModel> updateProfile(String accessToken, Map<String, dynamic> updateData) async {
    try {
      final response = await client.put(
      Uri.parse('$baseUrl/api/users/profile'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
      body: json.encode(updateData),
    );
    if (response.statusCode >= 200 && response.statusCode < 300) {
      final raw = response.body.trim();
      if (raw.isEmpty) {
        return const ProfileUpdateResultModel(message: 'Profile updated successfully', updatedFields: []);
      }
      final decoded = json.decode(raw);
      if (decoded is Map<String, dynamic>) {
        final msg = decoded['message'] as String? ?? 'Profile updated successfully';
        return ProfileUpdateResultModel(message: msg, updatedFields: const []);
      }
      return const ProfileUpdateResultModel(message: 'Profile updated successfully', updatedFields: []);
    } else {
      throw Exception('Failed to update profile');
    }
    } on http.ClientException catch (_) {
      throw NetworkFailure(message: 'Network/CORS error while updating profile');
    }
  }

  @override
  Future<void> logout(String accessToken) async {
    // First try with Bearer scheme
    try {
      var response = await client.post(
      Uri.parse('$baseUrl/api/auth/logout'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
    );
    // If unauthorized, retry with raw token (some backends expect raw token in Authorization)
    if (response.statusCode == 401) {
      response = await client.post(
        Uri.parse('$baseUrl/api/auth/logout'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken,
        },
      );
    }
    if (response.statusCode == 200) {
      return;
    }
    throw Exception('Failed to logout');
    } on http.ClientException catch (_) {
      throw NetworkFailure(message: 'Network/CORS error while logging out');
    }
  }

  @override
  Future<ProfileUpdateResultModel> changePassword(String accessToken, {required String oldPassword, required String newPassword}) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/api/auth/change-password'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $accessToken',
        },
        body: json.encode({
          'old_password': oldPassword,
          'new_password': newPassword,
        }),
      );

      final raw = response.body.trim();
      if (response.statusCode >= 200 && response.statusCode < 300) {
        if (raw.isEmpty) {
          return const ProfileUpdateResultModel(message: 'Password changed successfully', updatedFields: const []);
        }
        final decoded = json.decode(raw);
        if (decoded is Map<String, dynamic>) {
          final dataNode = decoded['data'];
          final msg = (dataNode is Map<String, dynamic> ? dataNode['message'] as String? : null)
              ?? decoded['message'] as String?
              ?? 'Password changed successfully';
          return ProfileUpdateResultModel(message: msg, updatedFields: const []);
        }
        return const ProfileUpdateResultModel(message: 'Password changed successfully', updatedFields: const []);
      }

      // Error branch: try to extract error message
      String errMsg = 'Failed to change password (${response.statusCode})';
      if (raw.isNotEmpty) {
        try {
          final decoded = json.decode(raw);
          if (decoded is Map<String, dynamic>) {
            errMsg = decoded['error'] as String? ?? decoded['message'] as String? ?? errMsg;
          }
        } catch (_) {}
      }
      throw Exception(errMsg);
    } on http.ClientException catch (_) {
      throw NetworkFailure(message: 'Network/CORS error while changing password');
    }
  }
}
