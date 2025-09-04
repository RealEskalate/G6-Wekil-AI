class AppNotification {
  final String userId;
  final String title;
  final String message;
  final String? argumentId;

  const AppNotification({
    required this.userId,
    required this.title,
    required this.message,
    this.argumentId,
  });
}
