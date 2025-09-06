import 'dart:convert';
import 'package:http/http.dart' as http;

import '../models/agreement_preview_model.dart';

class PreviewRemoteDataSource {
  final String baseUrl;
  final http.Client client;
  PreviewRemoteDataSource({required this.baseUrl, required this.client});

  Future<AgreementPreviewModel> fetch(String agreementId) async {
    final uri = Uri.parse('$baseUrl/agreement').replace(
      queryParameters: {
        'ts': DateTime.now().millisecondsSinceEpoch.toString(),
      },
    );
    final res = await client.post(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: json.encode({'agreement_id': agreementId}),
    );
    if (res.statusCode < 200 || res.statusCode >= 300) {
      throw Exception('Failed to fetch preview: ${res.statusCode}');
    }
    final decoded = json.decode(res.body);
    return AgreementPreviewModel.fromJson(decoded);
  }
}
