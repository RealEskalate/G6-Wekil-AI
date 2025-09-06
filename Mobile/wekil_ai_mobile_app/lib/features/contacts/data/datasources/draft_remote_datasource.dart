import 'dart:convert';
import 'package:http/http.dart' as http;

class DraftRemoteDatasource {
  final http.Client client;

  DraftRemoteDatasource(this.client);

  Future<Map<String, dynamic>> createDraft({
    required Map<String, dynamic> draft,
    required String language,
  }) async {
    final response = await client.post(
      Uri.parse("https://g6-wekil-ai-1.onrender.com/ai/draft"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "draft": draft,
        "language": language,
      }),
    );

    print("Draft status: ${response.statusCode}");
    print("Draft body: ${response.body}");

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception("Failed to create draft: ${response.statusCode}");
    }
  }



  Future<Map<String, dynamic>> regenerateDraft({
  required String draft,
  required String prompt,
  required String language,
}) async {
  final response = await client.post(
    Uri.parse("https://g6-wekil-ai-1.onrender.com/ai/draft-from-prompt"),
    headers: {"Content-Type": "application/json"},
    body: jsonEncode({
      "draft": draft,
      "prompt": prompt,
      "language": language,
    }),
  );

  print("Regenerate status: ${response.statusCode}");
  print("Regenerate body: ${response.body}");

  if (response.statusCode == 200) {
    return jsonDecode(response.body);
  } else {
    throw Exception("Failed to regenerate draft: ${response.statusCode}");
  }
}

}
