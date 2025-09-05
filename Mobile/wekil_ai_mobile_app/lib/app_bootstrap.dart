import 'package:flutter/material.dart';

import 'app.dart';
import 'core/di/injection.dart';

Future<void> bootstrapAndRun() async {
  WidgetsFlutterBinding.ensureInitialized();

  const provided = 'Bearer YOUR_TOKEN_HERE';

  final token = provided.startsWith('Bearer ')
      ? provided.substring('Bearer '.length)
      : provided;

  await setupDependencies(
    baseUrl: 'https://g6-wekil-ai-1.onrender.com',
    tokenProvider: () async => token,
  );

  runApp(const MyApp());
}
