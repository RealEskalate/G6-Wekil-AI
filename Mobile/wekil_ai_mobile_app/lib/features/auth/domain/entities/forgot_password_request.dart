import 'package:equatable/equatable.dart';

class ForgotPasswordRequest extends Equatable {
  final String email;

  const ForgotPasswordRequest({required this.email});

  @override
  List<Object?> get props => [email];
}
