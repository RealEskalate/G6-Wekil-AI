import 'package:flutter/material.dart';

class AppSvgIcon extends StatelessWidget {
  final String name; // kept for API compatibility, not used anymore
  final double size;
  final Color? color;
  final bool solid; // kept for API compatibility
  final IconData fallback;

  const AppSvgIcon({
    super.key,
    required this.name,
    this.size = 20,
    this.color,
    this.solid = false,
    this.fallback = Icons.circle,
  });

  @override
  Widget build(BuildContext context) {
    // Render the provided Material icon locally; no network calls.
    return Icon(
      fallback,
      size: size,
      color: color ?? Theme.of(context).iconTheme.color,
      semanticLabel: name,
    );
  }
}
