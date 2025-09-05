import 'package:dartz/dartz.dart';
import 'package:flutter/foundation.dart' show kDebugMode;
import '../../../../core/error/failure.dart';
import '../../domain/entities/user.dart';
import '../../domain/entities/login_input.dart';
import '../../domain/entities/auth_tokens.dart';
import '../../domain/entities/otp_verification_input.dart';
import '../../domain/entities/otp_verification_result.dart';
import '../../domain/entities/api_response_message.dart';
import '../../domain/repository/auth_repository.dart';
import '../datasources/auth_remote_data_source.dart';
import '../datasources/auth_local_data_source.dart';
import '../models/forgot_password_request_model.dart';
import '../models/reset_password_request_model.dart';
import '../models/user_model.dart';
import '../models/login_input_model.dart';
import '../models/otp_verification_input_model.dart';


class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final AuthLocalDataSource localDataSource;

  AuthRepositoryImpl({required this.remoteDataSource, required this.localDataSource});

  @override
  Future<Either<Failure, ApiResponseMessage>> registerIndividual(User user, String password) async {
    try {
      final result = await remoteDataSource.registerIndividual(
        UserModel(
          firstName: user.firstName,
          lastName: user.lastName,
          middleName: user.middleName,
          email: user.email,
          telephone: user.telephone,
        ),
        password,
      );
      return Right(result);
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, AuthTokens>> login(LoginInput input) async {
    try {
      final result = await remoteDataSource.login(LoginInputModel(
        email: input.email,
        password: input.password,
      ));
      await localDataSource.cacheAuthTokens(result);
      if (kDebugMode) {
        String maskToken(String t) {
          if (t.isEmpty) return '(empty)';
          if (t.length <= 8) return '${t[0]}***${t[t.length - 1]}';
          final start = t.substring(0, 6);
          final end = t.substring(t.length - 4);
          return '$start...$end';
        }
        // ignore: avoid_print
        print('[AuthRepository] Saved access token after login: ${maskToken(result.accessToken)}');
      }
      return Right(result);
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, OtpVerificationResult>> verifyOtp(OtpVerificationInput input) async {
    try {
      final result = await remoteDataSource.verifyOtp(OtpVerificationInputModel(
        email: input.email,
        otp: input.otp,
      ));
      return Right(result);
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
  
  @override
  Future<Either<Failure, ApiResponseMessage>> requestPasswordReset(String email) async {
    try {
      final request = ForgotPasswordRequestModel(email: email);
      final result = await remoteDataSource.requestPasswordReset(request);
      return Right(result);
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, ApiResponseMessage>> resetPassword(String email, String otpCode, String newPassword) async {
    try {
      final request = ResetPasswordRequestModel(email: email, otp: otpCode, newPassword: newPassword);
      final result = await remoteDataSource.resetPassword(request);
      return Right(result);
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
