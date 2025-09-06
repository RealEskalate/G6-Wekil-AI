import '../../domain/entities/api_response_message.dart';

class ApiResponseMessageModel extends ApiResponseMessage {
  const ApiResponseMessageModel({required super.message, super.success, super.code});

  factory ApiResponseMessageModel.fromJson(Map<String, dynamic> json) {
    return ApiResponseMessageModel(
      message: json['message'] ?? json['data']?['message'] ?? 'OK',
      success: json['success'] as bool?,
      code: json['code'] as String?,
    );
  }
}
