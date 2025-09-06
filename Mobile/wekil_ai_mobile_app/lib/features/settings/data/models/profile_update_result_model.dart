import '../../domain/entities/profile_update_result.dart';

class ProfileUpdateResultModel extends ProfileUpdateResult {
  const ProfileUpdateResultModel({required super.message, required super.updatedFields});

  factory ProfileUpdateResultModel.fromJson(Map<String, dynamic> json) {
    return ProfileUpdateResultModel(
      message: json['message'] ?? '',
      updatedFields: (json['updatedFields'] ?? json['updated_fields'] ?? [])
          .cast<String>(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'message': message,
      'updatedFields': updatedFields,
    };
  }
}
