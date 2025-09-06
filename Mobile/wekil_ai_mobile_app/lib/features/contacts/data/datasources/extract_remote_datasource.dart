// import 'dart:convert';
// import 'package:http/http.dart' as http;

// class ExtractRemoteDatasource {
//   final http.Client client;

//   ExtractRemoteDatasource(this.client);

//   Future<Map<String, dynamic>> extractText(String text, String language) async {
//     final response = await client.post(
//       Uri.parse("https://g6-wekil-ai-1.onrender.com/ai/extract"),
//       headers: {"Content-Type": "application/json"},
//       body: jsonEncode({"text": text, "language": language}),
//     );

//     print("Extract value: ${response.statusCode}");
//     print("Extract body ${response.body}");

//     if (response.statusCode == 200) {
//       final json = jsonDecode(response.body);

//       if (json["success"] == true) {
//         // ✅ FIX: get payload instead of wrong data["data"]
//         return json["data"]["payload"] as Map<String, dynamic>;
//       } else {
//         throw Exception(json["data"]["message"] ?? "Extraction failed");
//       }
//     } else {
//       throw Exception("Failed with status: ${response.statusCode}");
//     }
//   }
// }
