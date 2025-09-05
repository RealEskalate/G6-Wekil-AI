
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:wekil_ai_mobile_app/features/contacts/data/models/contact_data.dart';
import 'package:wekil_ai_mobile_app/features/contacts/domain/entities/milestone.dart';

class PdfChangerPage extends StatefulWidget {
  final IntakeModel intakeModel;

  PdfChangerPage({required this.intakeModel});

  @override
  _PdfChangerPageState createState() => _PdfChangerPageState();
}

class _PdfChangerPageState extends State<PdfChangerPage> {
  String? _pdfLink;
  bool _isLoading = false;

  // Controllers for editable fields
  late TextEditingController languageController;
  late TextEditingController locationController;
  late TextEditingController currencyController;
  late TextEditingController totalAmountController;
  late TextEditingController startDateController;
  late TextEditingController endDateController;

  // Controllers for relevant fields
  late Map<String, TextEditingController> relevantControllers;

  @override
  void initState() {
    super.initState();
    languageController = TextEditingController(text: widget.intakeModel.language);
    locationController = TextEditingController(text: widget.intakeModel.location);
    currencyController = TextEditingController(text: widget.intakeModel.currency);
    totalAmountController = TextEditingController(
        text: widget.intakeModel.totalAmount?.toString() ?? '');
    startDateController =
        TextEditingController(text: widget.intakeModel.startDate.toString());
    endDateController =
        TextEditingController(text: widget.intakeModel.endDate.toString());

    relevantControllers = {};
    widget.intakeModel.relevantFields.forEach((key, value) {
      relevantControllers[key] = TextEditingController(text: value?.toString() ?? '');
    });
  }

  @override
  void dispose() {
    languageController.dispose();
    locationController.dispose();
    currencyController.dispose();
    totalAmountController.dispose();
    startDateController.dispose();
    endDateController.dispose();
    relevantControllers.values.forEach((c) => c.dispose());
    super.dispose();
  }

  /// Generates HTML from current controllers
  String generateHtmlFromControllers() {
    final partiesHtml = widget.intakeModel.parties
        .map((p) => "<p>${p.name} )</p>")
        .join();

    final relevantHtml = relevantControllers.entries
        .map((e) => "<p><strong>${e.key}:</strong> ${e.value.text}</p>")
        .join();

    return """
    <html>
      <body>
        <h1>Contract Details</h1>
        <p><strong>Language:</strong> ${languageController.text}</p>
        <p><strong>Location:</strong> ${locationController.text}</p>
        <p><strong>Currency:</strong> ${currencyController.text}</p>
        <p><strong>Total Amount:</strong> ${totalAmountController.text}</p>
        <p><strong>Start Date:</strong> ${startDateController.text}</p>
        <p><strong>End Date:</strong> ${endDateController.text}</p>
        <p><strong>End Date:</strong> ${Milestone}</p>
        

        <h2>Parties</h2>
        $partiesHtml

        <h2>Contract Details</h2>
        $relevantHtml
      </body>
    </html>
    """;
  }

  Future<void> generatePdfFromControllers() async {
    setState(() {
      _isLoading = true;
      _pdfLink = null;
    });

    final htmlContent = generateHtmlFromControllers();

    final url = Uri.parse('https://v2.api2pdf.com/chrome/html');
    final headers = {
      'Content-Type': 'application/json',
      'Authorization': 'cf92f168-484a-47b1-a349-75046f78b66f',
    };
    final body = jsonEncode({'html': htmlContent});

    try {
      final response = await http.post(url, headers: headers, body: body);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _pdfLink = data['pdf'];
        });
      } else {
        setState(() {
          _pdfLink = 'Error: ${response.body}';
        });
      }
    } catch (e) {
      setState(() {
        _pdfLink = 'Exception: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Edit & Generate PDF')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    TextField(
                      controller: languageController,
                      decoration: InputDecoration(labelText: 'Language'),
                    ),
                    TextField(
                      controller: locationController,
                      decoration: InputDecoration(labelText: 'Location'),
                    ),
                    TextField(
                      controller: currencyController,
                      decoration: InputDecoration(labelText: 'Currency'),
                    ),
                    TextField(
                      controller: totalAmountController,
                      decoration: InputDecoration(labelText: 'Total Amount'),
                      keyboardType: TextInputType.number,
                    ),
                    TextField(
                      controller: startDateController,
                      decoration: InputDecoration(labelText: 'Start Date'),
                    ),
                    TextField(
                      controller: endDateController,
                      decoration: InputDecoration(labelText: 'End Date'),
                    ),
                    SizedBox(height: 16),
                    ...relevantControllers.entries.map((e) {
                      return TextField(
                        controller: e.value,
                        decoration: InputDecoration(labelText: e.key),
                      );
                    }).toList(),
                  ],
                ),
              ),
            ),
            SizedBox(height: 16),
            ElevatedButton(
              onPressed: _isLoading ? null : generatePdfFromControllers,
              child: Text('Generate PDF'),
            ),
            SizedBox(height: 16),
            if (_isLoading) CircularProgressIndicator(),
            if (_pdfLink != null)
              SelectableText(_pdfLink!, style: TextStyle(color: Colors.blue)),
          ],
        ),
      ),
    );
  }
}















// import 'dart:convert';
// import 'package:flutter/material.dart';
// import 'package:http/http.dart' as http;
// import 'package:wekil_ai_mobile_app/features/contacts/data/models/contact_data.dart';

// class PdfChangerPage extends StatefulWidget {
//   final IntakeModel intakeModel;
//   PdfChangerPage({required this.intakeModel});
//   @override
//   _PdfChangerPageState createState() => _PdfChangerPageState();
// }

// class _PdfChangerPageState extends State<PdfChangerPage> {
//   final TextEditingController _textController = TextEditingController();
//   String? _pdfLink;
//   bool _isLoading = false;

//   Future<void> generatePdf(String content) async {
//     setState(() {
//       _isLoading = true;
//       _pdfLink = null;
//     });

//     final url = Uri.parse('https://v2.api2pdf.com/chrome/html');
//     final headers = {
//       'Content-Type': 'application/json',
//       'Authorization': 'cf92f168-484a-47b1-a349-75046f78b66f',
//     };
//     final body = jsonEncode({
//       'html': '<html><body><p>${content}</p></body></html>',
//     });

//     try {
//       final response = await http.post(url, headers: headers, body: body);

//       if (response.statusCode == 200) {
//         final data = jsonDecode(response.body);
//         setState(() {
//           _pdfLink = data['pdf'];
//         });
//       } else {
//         setState(() {
//           _pdfLink = 'Error: ${response.body}';
//         });
//       }
//     } catch (e) {
//       setState(() {
//         _pdfLink = 'Exception: $e';
//       });
//     } finally {
//       setState(() {
//         _isLoading = false;
//       });
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: Text('PDF Generator')),
//       body: Padding(
//         padding: const EdgeInsets.all(16.0),
//         child: Column(
//           children: [
//             TextField(
//               controller: _textController,
//               maxLines: 5,
//               decoration: InputDecoration(
//                 hintText: 'Enter your text here',
//                 border: OutlineInputBorder(),
//               ),
//             ),
//             SizedBox(height: 16),
//             ElevatedButton(
//               onPressed: () {
//                 final text = _textController.text;
//                 if (text.isNotEmpty) generatePdf(text);
//               },
//               child: Text('Generate PDF'),
//             ),
//             SizedBox(height: 16),
//             if (_isLoading) CircularProgressIndicator(),
//             if (_pdfLink != null)
//               SelectableText(_pdfLink!, style: TextStyle(color: Colors.blue)),
//           ],
//         ),
//       ),
//     );
//   }
// }
