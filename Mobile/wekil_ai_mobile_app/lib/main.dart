// lib/main.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'core/di/injection.dart';
import 'features/dashboard/presentation/dashboard.dart';
import 'features/contacts/presentations/pages/create_start_page.dart';
import 'features/widget/bottom_nav.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  const provided =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ik9iamVjdElEKFwiNjhiNTk5N2I3Yzg0M2ZjYjJhOTEwZDFmXCIpIiwiZW1haWwiOiJhbWlubWFtaW5lNjIwQGdtYWlsLmNvbSIsImlzX3ZlcmlmaWVkIjp0cnVlLCJhY2NvdW50X3R5cGUiOiJ1c2VyIiwidG9rZW5fdHlwZSI6ImFjY2Vzc190b2tlbiIsImV4cCI6MTc1NjczNjA4NywiaWF0IjoxNzU2NzM1MTg3fQ.8xFhEbHLVGxEm53_CIuYQp8p-AAEmkBZwLLa-q25ZW8';

  final token = provided.startsWith('Bearer ')
      ? provided.substring('Bearer '.length)
      : provided;

  await setupDependencies(
    baseUrl: 'https://g6-wekil-ai-1.onrender.com',
    tokenProvider: () async => token,
  );

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final base = ThemeData(
      useMaterial3: true,
      colorSchemeSeed: const Color(0xFF10B981),
    );
    const brand = Color(0xFF14B8A6); // Teal from the design
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
    DashboardPage.provider(),
    const Scaffold(body: Center(child: Text('Contracts list coming soon...'))),
  ];

  void _onItemSelected(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  void _onCreatePressed() {
    Navigator.of(
      context,
    ).push(MaterialPageRoute(builder: (_) => const CreateContractScreen()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_currentIndex],
      bottomNavigationBar: BottomNav(
        currentIndex: _currentIndex,
        onItemSelected: _onItemSelected,
        onCreatePressed: _onCreatePressed,
      ),
    );
  }
}
