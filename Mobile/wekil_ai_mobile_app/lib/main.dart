// lib/main.dart
import 'package:flutter/material.dart';

import 'package:google_fonts/google_fonts.dart';
import 'core/di/injection.dart';
import 'features/dashboard/presentation/dashboard.dart';

import 'package:wekil_ai_mobile_app/features/widget/bottom_nav.dart';
import 'package:wekil_ai_mobile_app/features/widget/nav_bar.dart';
import 'package:wekil_ai_mobile_app/features/contacts/presentations/pages/create_start_page.dart';
import 'package:wekil_ai_mobile_app/Dashboard.dart';
import 'package:wekil_ai_mobile_app/history.dart';


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
  runApp(const MainApp());

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
        // Global ink effects for InkWell/InkResponse
        hoverColor: hover,
        highlightColor: hover,
        splashColor: pressed,
        // Buttons
        textButtonTheme: TextButtonThemeData(
          style: ButtonStyle(
            overlayColor: MaterialStateProperty.resolveWith((s) {
              if (s.contains(MaterialState.pressed)) return pressed;
              if (s.contains(MaterialState.hovered)) return hover;
              return null;
            }),
          ),
        ),
        filledButtonTheme: FilledButtonThemeData(
          style: ButtonStyle(
            overlayColor: MaterialStateProperty.resolveWith((s) {
              if (s.contains(MaterialState.pressed)) return pressed;
              if (s.contains(MaterialState.hovered)) return hover;
              return null;
            }),
          ),
        ),
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: ButtonStyle(
            overlayColor: MaterialStateProperty.resolveWith((s) {
              if (s.contains(MaterialState.pressed)) return pressed;
              if (s.contains(MaterialState.hovered)) return hover;
              return null;
            }),
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ButtonStyle(
            overlayColor: MaterialStateProperty.resolveWith((s) {
              if (s.contains(MaterialState.pressed)) return pressed;
              if (s.contains(MaterialState.hovered)) return hover;
              return null;
            }),
          ),
        ),
        iconButtonTheme: IconButtonThemeData(
          style: ButtonStyle(
            overlayColor: MaterialStateProperty.resolveWith((s) {
              if (s.contains(MaterialState.pressed)) return pressed;
              if (s.contains(MaterialState.hovered)) return hover;
              return null;
            }),
          ),
        ),
        // Removed listTileTheme.hoverColor (not supported in this Flutter version)
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
