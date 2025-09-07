import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;
import 'package:wekil_ai_mobile_app/features/contacts/data/models/contact_data.dart';
import 'package:wekil_ai_mobile_app/features/widget/nav_bar.dart';
import 'package:wekil_ai_mobile_app/features/widget/bottom_nav.dart';
import '../../../../core/theme/app_colors.dart';
import 'package:wekil_ai_mobile_app/injection_container.dart' as di;

class PdfChangerPage extends StatefulWidget {
  final IntakeModel intakeModel;
  final String? draftTitle;
  final List<dynamic> draftSections;

  const PdfChangerPage({
    Key? key,
    required this.intakeModel,
    this.draftTitle,
    required this.draftSections,
  }) : super(key: key);

  @override
  _PdfChangerPageState createState() => _PdfChangerPageState();
}

class _PdfChangerPageState extends State<PdfChangerPage> {
  String? _pdfLink;
  bool _isLoading = false;

  // Controllers for editable fields
  // Controllers for AI draft
  late TextEditingController titleController;
  late List<Map<String, TextEditingController>> sectionControllers;

  late TextEditingController languageController;
  late TextEditingController locationController;
  late TextEditingController currencyController;
  late TextEditingController totalAmountController;
  late TextEditingController startDateController;
  late TextEditingController endDateController;

  // 🔹 NEW: Replace placeholders with real party names
  String replacePlaceholders(String text) {
    if (widget.intakeModel.parties.isEmpty) return text;

    final partyA = widget.intakeModel.parties[0];
    final partyB = widget.intakeModel.parties.length > 1 ? widget.intakeModel.parties[1] : null;

    return text
        .replaceAll(RegExp(r'<<\s*Party A\s*>>'), partyA.name)
        .replaceAll(RegExp(r'<\s*Party A\s*>'), partyA.name)
        .replaceAll(RegExp(r'<<\s*Party B\s*>>'), partyB?.name ?? '')
        .replaceAll(RegExp(r'<\s*Party B\s*>'), partyB?.name ?? '')
        // .replaceAll(RegExp(r'<<\s*Date\s*>>'), '$startDateController to $endDateController'  )
        // .replaceAll(RegExp(r'<<\s*ቀን\s*>>'), '$startDateController to $endDateController' )
        // Amharic placeholders
      .replaceAll(RegExp(r'<<\s*ፖርቲይሀ\s*>>'), partyA.name)
      .replaceAll(RegExp(r'<<\s*ፖርቲይለ\s*>>'), partyB?.name ?? '')
      // Remove any other remaining <<...>> placeholders
        .replaceAll(RegExp(r'<<.*?>>'), ''); // optional: remove any other remaining << >>
  }

  // Controllers for relevant fields
  late Map<String, TextEditingController> relevantControllers;

  @override
  void initState() {
    super.initState();
    languageController = TextEditingController(
      text: widget.intakeModel.language,
    );
    locationController = TextEditingController(
      text: widget.intakeModel.location,
    );
    currencyController = TextEditingController(
      text: widget.intakeModel.currency,
    );
    totalAmountController = TextEditingController(
      text: widget.intakeModel.totalAmount?.toString() ?? '',
    );
    startDateController = TextEditingController(
      text: widget.intakeModel.startDate.toString(),
    );
    endDateController = TextEditingController(
      text: widget.intakeModel.endDate.toString(),
    );

    relevantControllers = {};
    widget.intakeModel.relevantFields.forEach((key, value) {
      relevantControllers[key] = TextEditingController(
        text: value?.toString() ?? '',
      );
    });

    // 🔹 NEW: init draft title & sections with placeholder replacement
    titleController = TextEditingController(text: replacePlaceholders(widget.draftTitle ?? ""));
    sectionControllers = widget.draftSections
        .map<Map<String, TextEditingController>>(
          (s) => {
            "heading": TextEditingController(
                text: replacePlaceholders(s["heading"] ?? "")
            ),
            "text": TextEditingController(
                text: replacePlaceholders(s["text"] ?? "")
            ),
          },
        )
        .toList();
  } // 🔹 Closing initState

  @override
  void dispose() {
    languageController.dispose();
    locationController.dispose();
    currencyController.dispose();
    totalAmountController.dispose();
    startDateController.dispose();
    endDateController.dispose();
    relevantControllers.values.forEach((c) => c.dispose());


    // 🔹 NEW
    titleController.dispose();
    for (var s in sectionControllers) {
      s["heading"]?.dispose();
      s["text"]?.dispose();
    }

    super.dispose(); // call super.dispose() only once
  }

  /// Generates HTML from current controllers
  String generateHtmlFromControllers() {
    // Editable AI draft
    final editedTitle = titleController.text;
    final sectionsHtml = sectionControllers.asMap().entries.map((entry) {
      final index = entry.key;
      final controllers = entry.value;
      return """
      <h3>Section ${index + 1}: ${controllers['heading']!.text}</h3>
      <p>${controllers['text']!.text}</p>
    """;
    }).join();

    // Party info HTML (first two parties for top-left/top-right)
    final party1 = widget.intakeModel.parties.isNotEmpty
        ? widget.intakeModel.parties[0]
        : null;
    final party2 = widget.intakeModel.parties.length > 1
        ? widget.intakeModel.parties[1]
        : null;

    final partiesHtml =
        """
    <table width="100%" style="border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="width: 50%; vertical-align: top;">
          ${party1 != null ? "<p><strong>${party1.name}</strong></p><p>Email: ${party1.email}</p><p>Phone: ${party1.phone}</p>" : ""}
        </td>
        <td style="width: 50%; vertical-align: top;">
          ${party2 != null ? "<p><strong>${party2.name}</strong></p><p>Email: ${party2.email}</p><p>Phone: ${party2.phone}</p>" : ""}
        </td>
      </tr>
    </table>
  """;

    // Contract details at the bottom
    final contractDetailsHtml =
        """
    <table width="100%" style="border-collapse: collapse; margin-top: 20px;">
      <tr>
        <td><strong>Location:</strong> ${languageController.text}</td>
        <td><strong>Currency:</strong> ${currencyController.text}</td>
      </tr>
      <tr>
        <td><strong>Total Amount:</strong> ${totalAmountController.text}</td>
        <td><strong>Start Date:</strong> ${startDateController.text}</td>
      </tr>
      <tr>
        <td><strong>End Date:</strong> ${endDateController.text}</td>
        <td></td>
      </tr>
    </table>
  """;

    return """
  <html>
    <body style="font-family: Arial, sans-serif;">
      $partiesHtml

      <h2 style="text-align: center;">$editedTitle</h2>
      $sectionsHtml

      $contractDetailsHtml
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
      // Use base client for third-party (no auth refresh needed)
      final baseClient = di.sl<http.Client>();
      final response = await baseClient.post(url, headers: headers, body: body);

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

  Future<void> saveAgreement({required bool share}) async {
    if (_pdfLink == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Please generate PDF first")),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    final partyA = widget.intakeModel.parties.isNotEmpty ? widget.intakeModel.parties[0] : null;
    final partyB = widget.intakeModel.parties.length > 1 ? widget.intakeModel.parties[1] : null;

    final draftText = [
      titleController.text,
      ...sectionControllers.map((s) => "${s['heading']!.text}\n${s['text']!.text}")
    ].join("\n\n");


    final payload = {
      "agreement": {
        "agreement_type": widget.intakeModel.contractType.name,
        "pdf_url": _pdfLink,
        "creator_signed": true,
        "status": share ? "PENDING" : "DRAFT",
        "party_a": {
          "name": partyA?.name ?? "",
          "email": partyA?.email ?? "",
          "phone": partyA?.phone ?? ""
        },
        "party_b": {
          "name": partyB?.name ?? "",
          "email": partyB?.email ?? "",
          "phone": partyB?.phone ?? ""
        }
      },
      "draft_text": draftText,
      "language": widget.intakeModel.language
    };
    print("=== Agreement Payload ===");
    print(jsonEncode(payload));

    try {
      final client = di.sl<http.Client>(instanceName: 'authHttp');
      final url = Uri.parse('${di.kBaseApiUrl}/agreement/save');
      final response = await client.post(
        url,
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(payload),
      );

      print("=== Backend Response ===");
      print("Status Code: ${response.statusCode}");
      print("Body: ${response.body}");

      if (response.statusCode == 200 || response.statusCode == 201) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Agreement saved successfully!")),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Failed to save: ${response.body}")),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error: $e")),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: const NavBar(showBack: true),
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

                    SizedBox(height: 24),
                    Text(
                      "AI Draft",
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    TextField(
                      controller: titleController,
                      decoration: InputDecoration(labelText: "Draft Title"),
                    ),

                    ...sectionControllers.asMap().entries.map((entry) {
                      final index = entry.key;
                      final controllers = entry.value;


                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          TextField(
                            controller: controllers["heading"],
                            decoration: InputDecoration(
                              labelText: "Section ${index + 1} Heading",
                            ),
                          ),
                          TextField(
                            controller: controllers["text"],
                            decoration: InputDecoration(
                              labelText: "Section ${index + 1} Text",
                            ),
                            maxLines: 3,
                          ),
                          SizedBox(height: 16),
                        ],
                      );
                    }).toList(),
                  ],
                ),
              ),
            ),
            SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : () async {
                      await generatePdfFromControllers();
                      await saveAgreement(share: false); // Save only
                    },
                    child: Text('Save'),
                  ),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : () async {
                      await generatePdfFromControllers();
                      await saveAgreement(share: true); // Save & Share
                    },
                    child: Text('Save & Share'),
                  ),
                ),
              ],
            ),
            SizedBox(height: 16),
            if (_isLoading) CircularProgressIndicator(),
            // this part is only to show the pdf link 
            // if (_pdfLink != null)
            //   SelectableText(_pdfLink!, style: TextStyle(color: Colors.blue)),
          ],
        ),
      ),
      bottomNavigationBar: BottomNav(
        currentIndex: 1,
        onItemSelected: (index) {
          switch (index) {
            case 0:
              context.go('/dashboard', extra: 0);
              break;
            case 1:
              context.go('/dashboard', extra: 1);
              break;
            case 2:
              context.go('/dashboard', extra: 2);
              break;
          }
        },
        onCreatePressed: () => context.go('/dashboard', extra: 1),
      ),
    );
  }
}
