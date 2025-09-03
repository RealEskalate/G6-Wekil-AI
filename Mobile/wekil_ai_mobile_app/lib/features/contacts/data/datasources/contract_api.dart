import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:wekil_ai_mobile_app/features/contacts/data/models/contact_data.dart';

class ContractApi {
  final String baseUrl = "https://your-backend.com/api";

  Future<String> generateDraft(IntakeModel intake) async {
    final response = await http.post(
      Uri.parse("$baseUrl/generate-contract"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(intake.toJson()),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body)["draftPdfUrl"];
    } else {
      throw Exception("Failed to generate draft");
    }
  }

  Future<void> modifyDraft(IntakeModel intake, String changes) async {
    final response = await http.post(
      Uri.parse("$baseUrl/modify-contract"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "intake": intake.toJson(),
        "changes": changes,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception("Failed to modify draft");
    }
  }
}
