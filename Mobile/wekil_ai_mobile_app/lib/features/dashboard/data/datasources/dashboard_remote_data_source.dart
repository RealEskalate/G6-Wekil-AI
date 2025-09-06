import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;

import '../../domain/entities/agreement.dart';
import '../../domain/entities/individual.dart';
import '../../domain/entities/app_notification.dart';
import '../models/agreement_model.dart';
import '../models/individual_model.dart';
import '../models/app_notification_model.dart';

class DashboardRemoteDataSource {
  final String baseUrl;
  final Future<String?> Function()? tokenProvider;
  final http.Client client;

  DashboardRemoteDataSource({
    String? baseUrl,
    this.tokenProvider,
    http.Client? client,
  }) : baseUrl = baseUrl ?? 'https://g6-wekil-ai-1.onrender.com',
       client = client ?? http.Client();

  // TODO: Replace with real backend call.
  Future<Map<String, int>> fetchSummary() async {
    await Future.delayed(const Duration(milliseconds: 120));
    return const {'draftCount': 0, 'exportedCount': 1, 'allCount': 1};
  }

  // Fetch the list of agreements; backend sorts by default. We'll take top N in repo.
  Future<List<Agreement>> fetchAgreements({
    String? userId,
    int page = 1,
  }) async {
    // Backend endpoint examples:
    // - /agreement?page=1
    // - /agreement/<userId>?page=1

    final uri = Uri.parse('$baseUrl/agreement?page=1');
    final headers = <String, String>{'Content-Type': 'application/json'};
    final raw = (await tokenProvider?.call())?.trim();
    if (raw != null && raw.isNotEmpty) {
      final hasBearer = raw.toLowerCase().startsWith('bearer ');
      headers['Authorization'] = hasBearer ? raw : 'Bearer $raw';
    }

    final res = await client.get(uri, headers: headers);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return AgreementModel.listFromJsonString(res.body);
    }
    // On error, return empty; UI handles empty gracefully.
    return const [];
  }

  // Fetch current user's profile
  Future<Individual?> fetchProfile() async {
    final uri = Uri.parse('$baseUrl/api/users/profile');
    final headers = <String, String>{'Content-Type': 'application/json'};
    final raw = (await tokenProvider?.call())?.trim();
    if (raw != null && raw.isNotEmpty) {
      final hasBearer = raw.toLowerCase().startsWith('bearer ');
      headers['Authorization'] = hasBearer ? raw : 'Bearer $raw';
    }

    final res = await client.get(uri, headers: headers);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      // Response shape: { data: { ...profile... }, success: true }
      try {
        final body = res.body;
        final map = jsonDecode(body) as Map<String, dynamic>;
        final data = (map['data'] ?? {}) as Map<String, dynamic>;
        return IndividualModel.fromJson(data).toEntity();
      } catch (_) {
        return null;
      }
    }
    return null;
  }

  // Fetch single latest notification for the user
  Future<AppNotification?> fetchNotification() async {
    final uri = Uri.parse('$baseUrl/api/users/notification');
    final headers = <String, String>{'Content-Type': 'application/json'};
    final raw = (await tokenProvider?.call())?.trim();
    if (raw != null && raw.isNotEmpty) {
      final hasBearer = raw.toLowerCase().startsWith('bearer ');
      headers['Authorization'] = hasBearer ? raw : 'Bearer $raw';
    }

    final res = await client.get(uri, headers: headers);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      try {
        final map = jsonDecode(res.body) as Map<String, dynamic>;
        final data = (map['data'] ?? {}) as Map<String, dynamic>;
        return AppNotificationModel.fromJson(data).toEntity();
      } catch (_) {
        return null;
      }
    }
    return null;
  }
}
