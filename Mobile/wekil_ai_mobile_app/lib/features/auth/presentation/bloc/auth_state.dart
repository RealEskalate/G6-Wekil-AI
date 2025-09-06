part of 'auth_bloc.dart';

@immutable
abstract class AuthState extends Equatable {
  const AuthState();
  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class AuthLoginSuccess extends AuthState {
  final AuthTokens tokens;
  const AuthLoginSuccess(this.tokens);
  @override
  List<Object?> get props => [tokens];
}

class AuthSignUpSuccess extends AuthState {
  final ApiResponseMessage message;
  const AuthSignUpSuccess(this.message);
  @override
  List<Object?> get props => [message];
}

class AuthLogoutSuccess extends AuthState {
  const AuthLogoutSuccess();
}


class AuthOtpVerified extends AuthState {
  final OtpVerificationResult result;
  const AuthOtpVerified(this.result);
  @override
  List<Object?> get props => [result];
}

class AuthFailure extends AuthState {
  final String message;
  const AuthFailure(this.message);
  @override
  List<Object?> get props => [message];
}

class AuthForgotPasswordSuccess extends AuthState {
  final ApiResponseMessage message;
  const AuthForgotPasswordSuccess(this.message);
  @override
  List<Object?> get props => [message];
}

class AuthResetPasswordSuccess extends AuthState {
  final ApiResponseMessage message;
  const AuthResetPasswordSuccess(this.message);
  @override
  List<Object?> get props => [message];
}