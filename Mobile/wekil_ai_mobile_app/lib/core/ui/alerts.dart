import 'package:flutter/material.dart';

// Shows a styled error snackbar with backend message prominent.
void showErrorSnackBar(BuildContext context, String message, {String? title}) {
  final theme = Theme.of(context);
  final snackBar = SnackBar(
    behavior: SnackBarBehavior.floating,
    backgroundColor: Colors.red.shade600,
    margin: const EdgeInsets.all(12),
    content: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Icon(Icons.error_outline, color: Colors.white),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (title != null && title.isNotEmpty)
                Text(title, style: theme.textTheme.titleSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
              Text(
                message.trim().replaceFirst(RegExp(r'^Exception:\s*'), ''),
                maxLines: 4,
                overflow: TextOverflow.ellipsis,
                style: theme.textTheme.bodyMedium?.copyWith(color: Colors.white),
              ),
            ],
          ),
        ),
      ],
    ),
    duration: const Duration(seconds: 4),
  );
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(snackBar);
}

// Shows a styled success snackbar.
void showSuccessSnackBar(BuildContext context, String message, {String? title}) {
  final theme = Theme.of(context);
  final snackBar = SnackBar(
    behavior: SnackBarBehavior.floating,
    backgroundColor: const Color(0xFF1AC9A2),
    margin: const EdgeInsets.all(12),
    content: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Icon(Icons.check_circle_outline, color: Colors.white),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (title != null && title.isNotEmpty)
                Text(title, style: theme.textTheme.titleSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
              Text(
                message.trim(),
                maxLines: 4,
                overflow: TextOverflow.ellipsis,
                style: theme.textTheme.bodyMedium?.copyWith(color: Colors.white),
              ),
            ],
          ),
        ),
      ],
    ),
    duration: const Duration(seconds: 3),
  );
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(snackBar);
}

// Inline error panel to show backend message prominently, with optional retry.
class ErrorPanel extends StatelessWidget {
  final String message;
  final String title;
  final VoidCallback? onRetry;
  const ErrorPanel({super.key, required this.message, this.title = 'Something went wrong', this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Card(
        margin: const EdgeInsets.all(16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: BorderSide(color: Colors.red.shade200)),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Icon(Icons.error_outline, color: Colors.red.shade400, size: 32),
              const SizedBox(height: 8),
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 6),
              Text(
                message.trim().replaceFirst(RegExp(r'^Exception:\s*'), ''),
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.black87),
              ),
              if (onRetry != null) ...[
                const SizedBox(height: 12),
                ElevatedButton.icon(
                  onPressed: onRetry,
                  icon: const Icon(Icons.refresh),
                  label: const Text('Retry'),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
