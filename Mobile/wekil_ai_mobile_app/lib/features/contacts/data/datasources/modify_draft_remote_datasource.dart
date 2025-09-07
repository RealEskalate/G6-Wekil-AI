import 'dart:convert';
import 'package:http/http.dart' as http;

class ModifyDraftRemoteDatasource {
  final http.Client client;

  ModifyDraftRemoteDatasource(this.client);

  Future<Map<String, dynamic>> modifyDraft({
    required String draft,
    required String prompt,
    required String language,
  }) async {
    final response = await client.post(
  Uri.parse("https://g6-wekil-ai-forserverdeployment.onrender.com/ai/draft-from-prompt"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "draft": draft,
        "prompt": prompt,
        "language": language,
      }),
    );

    print("Modify Draft Status: ${response.statusCode}");
    print("Modify Draft Body: ${response.body}");

    if (response.statusCode == 200) {
      final json = jsonDecode(response.body);
      if (json["success"] == true) {
        return json["data"]; // updated Draft object
      } else {
        throw Exception(json["message"] ?? "Draft modification failed");
      }
    } else {
      throw Exception("Failed with status: ${response.statusCode}");
    }
  }
}
