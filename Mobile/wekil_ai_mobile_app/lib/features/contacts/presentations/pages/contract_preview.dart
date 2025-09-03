import 'package:flutter/material.dart';

class ContractPreview extends StatelessWidget {
  final Map<String, dynamic> contractData;

  const ContractPreview({Key? key, required this.contractData}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFF7F7FA),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: BackButton(color: Colors.black),
        title: Text(
          "Contract Preview",
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
        actions: [
          Row(
            children: [
              Text("English", style: TextStyle(color: Colors.black)),
              Switch(
                value: true,
                onChanged: (val) {}, // language toggle logic
              ),
            ],
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Warning box
            Container(
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.amber.shade50,
                border: Border.all(color: Colors.amber),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                "⚠ Final Review:\nPlease carefully review all details before exporting. "
                "This document is not legal advice and is for basic agreements only.",
                style: TextStyle(color: Colors.black87, fontSize: 13),
              ),
            ),
            SizedBox(height: 20),

            // Contract Content
            Center(
              child: Text(
                "CONTRACT AGREEMENT",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ),
            Divider(height: 30, thickness: 1),

            _buildPartySection("Party A (First Party)", contractData["partyA"]),
            SizedBox(height: 16),
            _buildPartySection("Party B (Second Party)", contractData["partyB"]),

            SizedBox(height: 20),
            _buildSection("PURPOSE", contractData["purpose"] ?? ""),
            _buildSection("PAYMENT TERMS",
                "Total Amount: ${contractData["amount"]} ${contractData["currency"]}\nPayment Plan: ${contractData["paymentPlan"]}"),
            _buildSection("TIMELINE",
                "Start Date: ${contractData["startDate"]}\nEnd Date: ${contractData["endDate"]}"),

            SizedBox(height: 20),
            Text("SIGNATURES", style: TextStyle(fontWeight: FontWeight.bold)),
            SizedBox(height: 12),
            _signatureRow("Party A", contractData["partyA"]["name"]),
            _signatureRow("Party B", contractData["partyB"]["name"]),

            SizedBox(height: 20),
            _buildSection("Date", contractData["date"] ?? ""),
            _buildSection("Place", contractData["place"] ?? ""),

            SizedBox(height: 20),
            // Disclaimer
            Container(
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.amber.shade50,
                border: Border.all(color: Colors.amber),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                "IMPORTANT DISCLAIMER:\nThis document is for information only and is not legal advice. "
                "Consult a qualified lawyer for legal matters.",
                style: TextStyle(color: Colors.black87, fontSize: 13),
              ),
            ),

            SizedBox(height: 30),

            // Bottom buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    child: Text("← Back to Home"),
                  ),
                ),
                SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      // TODO: implement PDF export
                    },
                    icon: Icon(Icons.picture_as_pdf),
                    label: Text("Export PDF"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green.shade700,
                      padding: EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }

  Widget _buildPartySection(String title, Map<String, dynamic> data) {
    return Container(
      padding: EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title,
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          SizedBox(height: 8),
          Text("Name: ${data["name"] ?? ""}"),
          Text("Phone: ${data["phone"] ?? ""}"),
          Text("Email: ${data["email"] ?? ""}"),
        ],
      ),
    );
  }

  Widget _buildSection(String title, String content) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title,
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          SizedBox(height: 4),
          Text(content, style: TextStyle(color: Colors.black87)),
        ],
      ),
    );
  }

  Widget _signatureRow(String party, String name) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(name),
        Divider(thickness: 1, color: Colors.black),
        Text("$party Signature"),
        SizedBox(height: 12),
      ],
    );
  }
}
