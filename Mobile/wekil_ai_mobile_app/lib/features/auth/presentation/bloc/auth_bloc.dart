import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';

import '../../domain/entities/api_response_message.dart';
import '../../domain/entities/auth_tokens.dart';
import '../../domain/entities/login_input.dart';
import '../../domain/entities/otp_verification_input.dart';
import '../../domain/entities/otp_verification_result.dart';
import '../../domain/entities/user.dart';
import '../../domain/usecase/login_usecase.dart';
import '../../domain/usecase/register_individual_usecase.dart';
// import '../../domain/usecase/register_organization_usecase.dart';
import '../../domain/usecase/verify_otp_usecase.dart';
// import '../../domain/usecase/logout_usecase.dart'; // Uncomment if you have a logout use case
import '../../domain/usecase/request_password_reset.dart';
import '../../domain/usecase/reset_password.dart';

part 'auth_event.dart';
part 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final LoginUseCase loginUseCase;
  final RegisterIndividualUseCase registerIndividualUseCase;
  // final RegisterOrganizationUseCase registerOrganizationUseCase;
  final VerifyOtpUseCase verifyOtpUseCase;
  // final LogoutUseCase logoutUseCase;
  final RequestPasswordReset requestPasswordReset;
  final ResetPassword resetPassword;

  AuthBloc({
    required this.loginUseCase,
    required this.registerIndividualUseCase,
    // required this.registerOrganizationUseCase,
    required this.verifyOtpUseCase,
    // required this.logoutUseCase,
    required this.requestPasswordReset,
    required this.resetPassword,
  }) : super(AuthInitial()) {
  on<ForgotPasswordEvent>((event, emit) async {
      emit(AuthLoading());
      final result = await requestPasswordReset(event.email);
      result.fold(
    (failure) => emit(AuthFailure(_message(failure))),
        (msg) => emit(AuthForgotPasswordSuccess(msg)),
      );
    });

  on<ResetPasswordEvent>((event, emit) async {
      emit(AuthLoading());
      final result = await resetPassword(
        email: event.email,
        otpCode: event.otpCode,
        newPassword: event.newPassword,
      );
      result.fold(
    (failure) => emit(AuthFailure(_message(failure))),
        (msg) => emit(AuthResetPasswordSuccess(msg)),
      );
    });
    on<LoginEvent>((event, emit) async {
      emit(AuthLoading());
      final result = await loginUseCase(LoginParams(LoginInput(email: event.email, password: event.password)));
      result.fold(
    (failure) => emit(AuthFailure(_message(failure))),
        (tokens) => emit(AuthLoginSuccess(tokens)),
      );
    });
    on<SignUpEvent>((event, emit) async {
      emit(AuthLoading());
      final result = await registerIndividualUseCase(RegisterIndividualParams(event.user, event.password));
      result.fold(
    (failure) => emit(AuthFailure(_message(failure))),
        (msg) => emit(AuthSignUpSuccess(msg)),
      );
    });
    on<VerifyOtpEvent>((event, emit) async {
      emit(AuthLoading());
      final result = await verifyOtpUseCase(
        VerifyOtpParams(
          OtpVerificationInput(email: event.email, otp: event.otp),
        ),
      );
      result.fold(
    (failure) => emit(AuthFailure(_message(failure))),
        (otpResult) => emit(AuthOtpVerified(otpResult)),
      );
    });
    on<LogoutEvent>((event, emit) async {
      emit(AuthLoading());
      // Uncomment and implement if you have a logout use case
      // await logoutUseCase(NoParams());
      emit(AuthLogoutSuccess());
    });
  }

  String _message(Object failure) {
    try {
      // Delay import of Failure type to avoid circular deps here; compare by toString
      final s = failure.toString();
      // If failure has a nice message field representation like 'ServerFailure: msg'
      final idx = s.indexOf(':');
      if (idx > 0 && idx < s.length - 1) {
        return s.substring(idx + 1).trim();
      }
      return s;
    } catch (_) {
      return 'Unexpected error';
    }
  }
}
