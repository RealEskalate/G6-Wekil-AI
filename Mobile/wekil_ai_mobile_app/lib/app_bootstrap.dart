import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'package:http/http.dart' as http;

import 'app.dart';
import 'core/di/injection.dart';
import 'injection_container.dart' as di; // Auth & settings DI
import 'features/auth/data/datasources/auth_local_data_source.dart';
import 'features/auth/presentation/bloc/auth_bloc.dart';
import 'route/app_route.dart';

// Temporary override access token for testing. Change this constant to use a
// specific Bearer token without touching secure storage. Set to null to use
// the stored token instead.
const String? kTempAccessToken = null;

Future<void> bootstrapAndRun() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Keep native splash until our video splash decides next route
  FlutterNativeSplash.preserve(widgetsBinding: WidgetsBinding.instance);

  // Initialize Auth/Settings DI (registers sl, http clients, blocs, etc.)
  await di.init();

  // Warm-up cached tokens (refresh stored securely, access in-memory)
  final localDataSource = di.sl<AuthLocalDataSource>();
  await localDataSource.getCachedAuthTokens();

  // Initialize Dashboard feature DI; provide token getter from Auth storage
  await setupDependencies(
    baseUrl: 'https://g6-wekil-ai-1.onrender.com',
    client: di.sl<http.Client>(instanceName: 'authHttp'),
  );

  // Remove the preserved native splash immediately so the app UI (dashboard)
  // is visible during testing. This is the safest short-term fix.
  FlutterNativeSplash.remove();

  // Configure router; splash will navigate to sign-in or dashboard
  final router = GoRouter(initialLocation: '/splash', routes: appRoutes);

  runApp(
    BlocProvider<AuthBloc>(
      create: (_) => di.sl<AuthBloc>(),
      child: MyApp(router: router),
    ),
  );
}
