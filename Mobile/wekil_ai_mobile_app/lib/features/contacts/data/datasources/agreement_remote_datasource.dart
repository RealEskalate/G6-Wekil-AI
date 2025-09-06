import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:wekil_ai_mobile_app/injection_container.dart' as di;

class AgreementRemoteDatasource {
  final String basePath = '/agreement/save';

  Future<void> saveAgreement(Map<String, dynamic> payload) async {
    try {
      final client = di.sl<http.Client>(instanceName: 'authHttp');
      final response = await client.post(
        Uri.parse('${di.kBaseApiUrl}$basePath'),
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
