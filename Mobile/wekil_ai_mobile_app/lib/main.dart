// lib/main.dart
import 'package:flutter/material.dart';
import 'package:flutter_localization/flutter_localization.dart';

import 'app_bootstrap.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();  // 👈 REQUIRED
  await FlutterLocalization.instance.ensureInitialized(); // 👈 REQUIRED
  await bootstrapAndRun();
}
