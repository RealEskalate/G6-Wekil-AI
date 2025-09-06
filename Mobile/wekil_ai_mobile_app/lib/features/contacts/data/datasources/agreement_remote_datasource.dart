import 'dart:convert';
import 'package:http/http.dart' as http;

class AgreementRemoteDatasource {
  final String baseUrl = 'https://g6-wekil-ai-forserverdeployment.onrender.com/agreement/save';

  Future<void> saveAgreement(Map<String, dynamic> payload) async {
    try {
      final response = await http.post(
        Uri.parse(baseUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(payload),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        print('Agreement saved successfully!');
        print('Response: ${response.body}');
      } else {
        print('Failed to save agreement. Status: ${response.statusCode}');
        print('Response: ${response.body}');
      }
    } catch (e) {
      print('Error saving agreement: $e');
    }
  }
}
