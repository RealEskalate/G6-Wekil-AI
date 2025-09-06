import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:wekil_ai_mobile_app/features/localization/locales.dart';
import 'package:wekil_ai_mobile_app/features/widget/nav_bar.dart';
import 'package:wekil_ai_mobile_app/history.dart';
import 'package:flutter_localization/flutter_localization.dart';

import 'features/dashboard/presentation/dashboard.dart';
import 'features/contacts/presentations/pages/create_start_page.dart';
import 'features/widget/bottom_nav.dart';

class MyApp extends StatefulWidget {
  final GoRouter router;
  const MyApp({Key? key, required this.router}) : super(key: key);

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final FlutterLocalization localization = FlutterLocalization.instance;
  @override
  void initState() {
    configlocalization();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final base = ThemeData(
      useMaterial3: true,
      colorSchemeSeed: const Color(0xFF10B981),
    );
    const brand = Color(0xFF14B8A6);
    final hover = brand.withOpacity(0.10);
    final pressed = brand.withOpacity(0.16);

    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      theme: base.copyWith(
        textTheme: GoogleFonts.interTextTheme(base.textTheme),
        hoverColor: hover,
        highlightColor: hover,
        splashColor: pressed,
      ),
      supportedLocales: localization.supportedLocales,
      localizationsDelegates: localization.localizationsDelegates,
      routerConfig: widget.router,
    );
  }

  void configlocalization() {
    localization.init(mapLocales: LOCALES, initLanguageCode: "en");
    localization.onTranslatedLanguage = onTranslatedLanguage;
  }

  void onTranslatedLanguage(Locale? locale) {
    setState(() {});
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({Key? key}) : super(key: key);

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;

  // Provide pages via a getter so we can forward the _onCreatePressed callback
  // into DashboardPage.provider() — this makes the dashboard's Create button
  // trigger the same action as the bottom nav create.
  List<Widget> get _pages => [
    DashboardPage.provider(onCreate: _onCreatePressed), // index 0
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
