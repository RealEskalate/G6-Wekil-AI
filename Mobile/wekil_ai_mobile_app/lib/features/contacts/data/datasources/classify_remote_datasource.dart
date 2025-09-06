import 'dart:convert';
import 'package:http/http.dart' as http;

class ClassifyRemoteDatasource {
  final http.Client client;
  ClassifyRemoteDatasource(this.client);

  Future<Map<String, dynamic>> classifyText(String text) async {
    final response = await client.post(
      Uri.parse("https://g6-wekil-ai-1.onrender.com/ai/classify"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"text": text}),
    );
    print("Response code from Classfiy: ${response.statusCode}");
    print("Response body from Classfiy: ${response.body}");
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception("Failed to classify text");
    }
  }
}
