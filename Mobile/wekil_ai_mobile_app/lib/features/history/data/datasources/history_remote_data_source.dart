import 'dart:convert';
import 'package:http/http.dart' as http;

import '../../../dashboard/data/models/agreement_model.dart';
import '../../domain/entities/history_page.dart';

class HistoryRemoteDataSource {
  final String baseUrl;
  final http.Client client;
  HistoryRemoteDataSource({required this.baseUrl, required this.client});

  Future<HistoryPageResult> fetch({int page = 1, int limit = 20, String? search, String? status}) async {
    // Backend history endpoint: GET /agreement/userID?page={n}
    // It returns { data: [...], succes: true } without meta/total.
    // We'll paginate until an empty page is returned.
    final qp = <String, String>{
      'page': page.toString(),
      // Note: server may ignore 'limit'; rely on empty page to stop.
    };
    final uri = Uri.parse('$baseUrl/agreement/userID').replace(queryParameters: qp);
    final res = await client.get(uri, headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    });
    if (res.statusCode < 200 || res.statusCode >= 300) {
      return HistoryPageResult(items: const [], page: page, limit: limit, hasMore: false, total: 0);
    }
    // Support both array or {data, meta}
    final decoded = json.decode(res.body);
    List<dynamic> raw = [];
    int? total;
    if (decoded is List) {
      raw = decoded;
    } else if (decoded is Map<String, dynamic>) {
      raw = (decoded['data'] as List?) ?? [];
      final meta = decoded['meta'] as Map<String, dynamic>?;
      total = meta?['total'] is num ? (meta!['total'] as num).toInt() : null;
    }
  final items = raw
        .whereType<Map<String, dynamic>>()
        .map(AgreementModel.fromJson)
        .map((m) => m.toEntity())
        .toList(growable: false);
  // If total is unknown, continue while pages are non-empty.
  final hasMore = total != null ? (page * limit) < total : items.isNotEmpty;
    return HistoryPageResult(items: items, page: page, limit: limit, hasMore: hasMore, total: total);
  }
}
