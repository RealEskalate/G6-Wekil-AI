part of 'auth_bloc.dart';


@immutable
abstract class AuthEvent extends Equatable {
  const AuthEvent();
  @override
  List<Object?> get props => [];
}

class ForgotPasswordEvent extends AuthEvent {
  final String email;
  const ForgotPasswordEvent(this.email);
  @override
  List<Object?> get props => [email];
}

class ResetPasswordEvent extends AuthEvent {
  final String email;
  final String otpCode;
  final String newPassword;
  const ResetPasswordEvent({required this.email, required this.otpCode, required this.newPassword});
  @override
  List<Object?> get props => [email, otpCode, newPassword];
}

class SignUpEvent extends AuthEvent {
  final User user;
  final String password;
  const SignUpEvent(this.user, this.password);
  @override
  List<Object?> get props => [user, password];
}

class LoginEvent extends AuthEvent {
  final String email;
  final String password;
  const LoginEvent(this.email, this.password);
  @override
  List<Object?> get props => [email, password];
}

class LogoutEvent extends AuthEvent {
  const LogoutEvent();
}

class VerifyOtpEvent extends AuthEvent {
  final String email;
  final String otp;
  const VerifyOtpEvent(this.email, this.otp);
  @override
  List<Object?> get props => [email, otp];
}