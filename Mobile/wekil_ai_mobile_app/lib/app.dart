import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:wekil_ai_mobile_app/features/widget/nav_bar.dart';
import 'package:wekil_ai_mobile_app/history.dart';

import 'features/dashboard/presentation/dashboard.dart';
import 'features/contacts/presentations/pages/create_start_page.dart';
import 'features/widget/bottom_nav.dart';

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final base = ThemeData(
      useMaterial3: true,
      colorSchemeSeed: const Color(0xFF10B981),
    );
    const brand = Color(0xFF14B8A6);
    final hover = brand.withOpacity(0.10);
    final pressed = brand.withOpacity(0.16);

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: base.copyWith(
        textTheme: GoogleFonts.interTextTheme(base.textTheme),
        hoverColor: hover,
        highlightColor: hover,
        splashColor: pressed,
      ),
      home: const MainScreen(),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({Key? key}) : super(key: key);

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;

  final List<Widget> _pages = [
    DashboardPage.provider(), // index 0
    const CreateContractScreen(), // index 1
    const History(), // index 2
  ];

  void _onItemSelected(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  void _onCreatePressed() {
    setState(() {
      _currentIndex = 1; // index of CreateContractScreen
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const NavBar(),
      body: _pages[_currentIndex],
      bottomNavigationBar: BottomNav(
        currentIndex: _currentIndex,
        onItemSelected: _onItemSelected,
        onCreatePressed: _onCreatePressed,
      ),
    );
  }
}
