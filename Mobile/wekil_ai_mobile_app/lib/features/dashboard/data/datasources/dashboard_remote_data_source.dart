import 'dart:async';
import 'package:http/http.dart' as http;

import '../../domain/entities/agreement.dart';
import '../models/agreement_model.dart';

class DashboardRemoteDataSource {
  final String baseUrl;
  final Future<String?> Function()? tokenProvider;
  final http.Client client;

  DashboardRemoteDataSource({
    String? baseUrl,
    this.tokenProvider,
    http.Client? client,
  }) : baseUrl = baseUrl ?? 'https://api.example.com',
       client = client ?? http.Client();

  // TODO: Replace with real backend call.
  Future<Map<String, int>> fetchSummary() async {
    await Future.delayed(const Duration(milliseconds: 120));
    return const {'draftCount': 0, 'exportedCount': 1, 'allCount': 1};
  }

  // Fetch the list of agreements; backend sorts by default. We'll take top N in repo.
  Future<List<Agreement>> fetchAgreements() async {
    final uri = Uri.parse('$baseUrl/api/agreements');
    final headers = <String, String>{'Content-Type': 'application/json'};
    final token = await tokenProvider?.call();
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }

    final res = await client.get(uri, headers: headers);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return AgreementModel.listFromJsonString(res.body);
    }
    // On error, return empty; UI handles empty gracefully.
    return const [];
  }
}
