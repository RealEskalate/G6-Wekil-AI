import '../../domain/entities/app_notification.dart';

class AppNotificationModel {
  final String userId;
  final String title;
  final String message;
  final String? argumentId;

  const AppNotificationModel({
    required this.userId,
    required this.title,
    required this.message,
    this.argumentId,
  });

  factory AppNotificationModel.fromJson(Map<String, dynamic> json) {
    return AppNotificationModel(
      userId: (json['user_id'] ?? json['userId'] ?? '').toString(),
      title: (json['title'] ?? '').toString(),
      message: (json['message'] ?? '').toString(),
      argumentId:
          json['argumentid']?.toString() ?? json['argumentId']?.toString(),
    );
  }

  AppNotification toEntity() => AppNotification(
    userId: userId,
    title: title,
    message: message,
    argumentId: argumentId,
  );
}
