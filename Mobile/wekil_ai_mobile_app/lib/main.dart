import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'core/di/injection.dart';
import 'features/dashboard/presentation/dashboard.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  const provided =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ik9iamVjdElEKFwiNjhiNjkwMzQzMjlmYWNjYTFkMjg4YmNkXCIpIiwiZW1haWwiOiJhYmVuYWJ1Mzg4QGdtYWlsLmNvbSIsImlzX3ZlcmlmaWVkIjp0cnVlLCJhY2NvdW50X3R5cGUiOiJ1c2VyIiwidG9rZW5fdHlwZSI6ImFjY2Vzc190b2tlbiIsImV4cCI6MTc1Njc5ODE0NiwiaWF0IjoxNzU2Nzk3MjQ2fQ.1yjx6pqDUL_jI2MnsEJnBbkShad_eubpfb2WSimq9UU';
  final token = provided.startsWith('Bearer ')
      ? provided.substring('Bearer '.length)
      : provided;
  await setupDependencies(
    baseUrl: 'https://g6-wekil-ai-1.onrender.com',
    tokenProvider: () async => token,
  );
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    final base = ThemeData(
      useMaterial3: true,
      colorSchemeSeed: const Color(0xFF10B981),
    );
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: base.copyWith(
        textTheme: GoogleFonts.interTextTheme(base.textTheme),
      ),
      routes: {
        '/agreements': (_) => const Scaffold(
          body: Center(child: Text('Agreements list coming soon...')),
        ),
      },
      home: DashboardPage.provider(),
    );
  }
}
