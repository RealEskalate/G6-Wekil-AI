import 'package:equatable/equatable.dart';

class ProfileUpdateResult extends Equatable {
  final String message;
  final List<String> updatedFields;
  const ProfileUpdateResult({required this.message, required this.updatedFields});

  @override
  List<Object?> get props => [message, updatedFields];
}
