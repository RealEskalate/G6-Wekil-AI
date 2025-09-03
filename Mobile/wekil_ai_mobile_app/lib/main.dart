// lib/main.dart
import 'package:flutter/material.dart';
import 'package:wekil_ai_mobile_app/features/widget/bottom_nav.dart';
import 'package:wekil_ai_mobile_app/features/widget/nav_bar.dart';
import 'package:wekil_ai_mobile_app/features/contacts/presentations/pages/create_start_page.dart';
import 'package:wekil_ai_mobile_app/Dashboard.dart';
import 'package:wekil_ai_mobile_app/history.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: CreateContractScreen(),
      debugShowCheckedModeBanner: false, // Optional
    );
  }
}
