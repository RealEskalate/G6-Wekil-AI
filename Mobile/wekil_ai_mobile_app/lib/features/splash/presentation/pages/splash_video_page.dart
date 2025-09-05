import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:video_player/video_player.dart';
import 'package:mobile/injection_container.dart' as di;
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'package:mobile/features/auth/data/datasources/auth_local_data_source.dart';

class SplashVideoPage extends StatefulWidget {
  const SplashVideoPage({super.key});

  @override
  State<SplashVideoPage> createState() => _SplashVideoPageState();
}

class _SplashVideoPageState extends State<SplashVideoPage> {
  late final VideoPlayerController _controller;
  String _nextRoute = '/sign-in';
  bool _navigated = false;
  Timer? _failSafe;
  late final Future<void> _decideFuture;

  @override
  void initState() {
    super.initState();
  _decideFuture = _decideNext();
  _controller = VideoPlayerController.asset('assets/splash/loader.gif.mp4')
      ..setLooping(false)
      ..setVolume(0);
    _controller.initialize().then((_) {
      if (!mounted) return;
      // Now that the video is ready, remove the native splash instantly
      FlutterNativeSplash.remove();
      _controller.play();
      // Fallback timer in case completion event isn't triggered
      _failSafe = Timer(const Duration(seconds: 6), _goNext);
  _controller.addListener(() {
        final v = _controller.value;
        if (v.isInitialized && !v.isPlaying && v.position >= (v.duration)) {
          _goNext();
        }
      });
      setState(() {});
    }).catchError((_) {
      _goNext();
    });
  }

  Future<void> _decideNext() async {
    try {
      final local = di.sl<AuthLocalDataSource>();
      final tokens = await local.getCachedAuthTokens();
      final hasAccess = (tokens?.accessToken.isNotEmpty ?? false);
      final hasRefresh = (tokens?.refreshToken.isNotEmpty ?? false);
      setState(() {
        _nextRoute = (hasAccess || hasRefresh) ? '/settings' : '/sign-in';
      });
    } catch (_) {
      setState(() => _nextRoute = '/sign-in');
    }
  }

  Future<void> _goNext() async {
    if (_navigated || !mounted) return;
    _navigated = true;
    _failSafe?.cancel();
    try {
      await _decideFuture;
    } catch (_) {}
    if (!mounted) return;
    GoRouter.of(context).go(_nextRoute);
  }

  @override
  void dispose() {
    _failSafe?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: _controller.value.isInitialized
          ? LayoutBuilder(
              builder: (context, constraints) {
                final videoSize = _controller.value.size;
                final vw = videoSize.width;
                final vh = videoSize.height;
                final sw = constraints.maxWidth;
                final sh = constraints.maxHeight;
                final fits = vw <= sw && vh <= sh;
                if (fits) {
                  // Show at original size, centered
                  return Center(
                    child: SizedBox(
                      width: vw,
                      height: vh,
                      child: VideoPlayer(_controller),
                    ),
                  );
                }
                // Otherwise scale down to fit while preserving aspect ratio
                return Center(
                  child: FittedBox(
                    fit: BoxFit.contain,
                    child: SizedBox(
                      width: vw,
                      height: vh,
                      child: VideoPlayer(_controller),
                    ),
                  ),
                );
              },
            )
          : const Center(
              child: CircularProgressIndicator(color: Colors.white),
            ),
    );
  }
}
