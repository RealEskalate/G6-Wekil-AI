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
  final http.Client client;

  DashboardRemoteDataSource({String? baseUrl, http.Client? client})
  : baseUrl = baseUrl ?? 'https://g6-wekil-ai-forserverdeployment.onrender.com',
      client = client ?? http.Client();

  // TODO: Replace with real backend call.
  Future<Map<String, int>> fetchSummary() async {
    await Future.delayed(const Duration(milliseconds: 120));
    return const {'draftCount': 0, 'exportedCount': 1, 'allCount': 1};
  }

  // Fetch the list of agreements; backend sorts by default. We'll take top N in repo.
  Future<List<Agreement>> fetchAgreements() async {
    // Use baseUrl consistently; adjust path as needed for your backend
    final uri = Uri.parse('$baseUrl/agreement/userID?page=1');
    final headers = <String, String>{'Content-Type': 'application/json'};
    final res = await client.get(uri, headers: headers);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return AgreementModel.listFromJsonString(res.body);
    }
    // On error, return empty; UI handles empty gracefully.
    return const [];
  }

  // Fetch a single agreement by ID
  Future<Map<String, dynamic>?> fetchAgreementById(String agreementId) async {
    final uri = Uri.parse('$baseUrl/agreement');
    final headers = {
      'Content-Type': 'application/json',
      'Authorization':
          'Bearer <ACCESS_TOKEN>', // Replace with actual token retrieval logic
    };
    final body = jsonEncode({'agreement_id': agreementId});

    final res = await client.post(uri, headers: headers, body: body);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      try {
        final map = jsonDecode(res.body) as Map<String, dynamic>;
        return map['data'] as Map<String, dynamic>?;
      } catch (_) {
        return null;
      }
    }
    return null;
  }

  // Fetch current user's profile
  Future<Individual?> fetchProfile() async {
    final ts = DateTime.now().millisecondsSinceEpoch;
    final uri = Uri.parse('$baseUrl/api/users/profile?ts=$ts');
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
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
