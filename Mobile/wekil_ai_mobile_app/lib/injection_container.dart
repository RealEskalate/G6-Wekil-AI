import 'package:get_it/get_it.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'features/auth/data/models/auth_tokens_model.dart';
import 'core/network/http_client_factory.dart';

//! Auth feature
import 'features/auth/data/datasources/auth_remote_data_source.dart';
import 'features/auth/data/datasources/auth_local_data_source.dart';
import 'features/auth/data/repository/auth_repository_impl.dart';
import 'features/auth/domain/repository/auth_repository.dart';
import 'features/auth/domain/usecase/login_usecase.dart';
import 'features/auth/domain/usecase/register_individual_usecase.dart';
// import 'features/auth/domain/usecase/register_organization_usecase.dart';
import 'features/auth/domain/usecase/verify_otp_usecase.dart';
import 'features/auth/domain/usecase/request_password_reset.dart';
import 'features/auth/domain/usecase/reset_password.dart';
import 'features/auth/presentation/bloc/auth_bloc.dart';

//! Settings feature
import 'features/settings/presentation/bloc/setting_bloc.dart';
import 'features/settings/domain/usecase/get_profile_usecase.dart';
import 'features/settings/domain/usecase/update_profile_usecase.dart';
import 'features/settings/domain/usecase/logout_usecase.dart';
import 'features/settings/domain/usecase/change_password_usecase.dart';
import 'features/settings/domain/repository/settings_repository.dart';
import 'features/settings/data/repositories/settings_repository_impl.dart';
import 'features/settings/data/datasources/settings_remote_data_source.dart' as settings_ds;
import 'features/settings/data/datasources/settings_local_data_source.dart';
import 'features/settings/data/datasources/settings_remote_data_source_impl.dart';
import 'core/network/auth_http_client.dart';
import 'core/services/cloudinary_uploader.dart';

final sl = GetIt.instance;
late final String kBaseApiUrl;
late final String kCloudinaryCloudName;
late final String kCloudinaryUploadPreset;

Future<void> init() async {
  // Resolve base API URL per platform/environment.
  // Use full URL with scheme.
  const defineUrl = String.fromEnvironment('API_BASE_URL');
  kBaseApiUrl = defineUrl.isNotEmpty ? defineUrl : 'https://g6-wekil-ai-1.onrender.com';
  // Cloudinary config (can be overridden via --dart-define)
  const cloudNameDefine = String.fromEnvironment('CLOUDINARY_CLOUD_NAME');
  const uploadPresetDefine = String.fromEnvironment('CLOUDINARY_UPLOAD_PRESET');
  kCloudinaryCloudName = cloudNameDefine.isNotEmpty ? cloudNameDefine : 'dsazbej7l';
  kCloudinaryUploadPreset = uploadPresetDefine.isNotEmpty ? uploadPresetDefine : 'wekil-signature';
  //! Features - Auth
  // Bloc
  sl.registerFactory(() => AuthBloc(
    loginUseCase: sl(),
    registerIndividualUseCase: sl(),
    // registerOrganizationUseCase: sl(),
    verifyOtpUseCase: sl(),
    requestPasswordReset: sl(),
    resetPassword: sl(),
  ));

  // Use cases
  sl.registerLazySingleton(() => LoginUseCase(sl()));
  sl.registerLazySingleton(() => RegisterIndividualUseCase(sl()));
  // sl.registerLazySingleton(() => RegisterOrganizationUseCase(sl()));
  sl.registerLazySingleton(() => VerifyOtpUseCase(sl()));
  sl.registerLazySingleton(() => RequestPasswordReset(sl()));
  sl.registerLazySingleton(() => ResetPassword(sl()));

  // Repository
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(
      remoteDataSource: sl(),
      localDataSource: sl(),
    ),
  );

  // Data sources
  sl.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(client: sl<http.Client>(instanceName: 'authHttp'), baseUrl: kBaseApiUrl),
  );
  sl.registerLazySingleton<AuthLocalDataSource>(
    () => AuthLocalDataSourceImpl(secureStorage: sl()),
  );

  //! Features - Settings
  // Bloc
  sl.registerFactory(() => SettingBloc(
    getProfileUseCase: sl(),
    updateProfileUseCase: sl(),
  logoutUseCase: sl(),
  changePasswordUseCase: sl(),
  ));

  // Use cases
  sl.registerLazySingleton(() => GetProfileUseCase(sl()));
  sl.registerLazySingleton(() => UpdateProfileUseCase(sl()));
  sl.registerLazySingleton(() => LogoutUseCase(sl()));
  sl.registerLazySingleton(() => ChangePasswordUseCase(sl()));

  // Repository
  sl.registerLazySingleton<SettingsRepository>(
    () => SettingsRepositoryImpl(
      remoteDataSource: sl(),
      localDataSource: sl(),
      getCachedAuthTokens: () {
        final authLocalDataSource = sl<AuthLocalDataSource>();
        return authLocalDataSource.getCachedAuthTokens();
      }, 
    ),
  );

  // Data sources
  sl.registerLazySingleton<settings_ds.SettingsRemoteDataSource>(
    () => SettingsRemoteDataSourceImpl(
      client: sl(),
      baseUrl: kBaseApiUrl,
    ),
  );
  sl.registerLazySingleton<SettingsLocalDataSource>(
  () => SettingsLocalDataSourceImpl(sharedPreferences: sl(), secureStorage: sl()),
  );

  //! External
  final sharedPreferences = await SharedPreferences.getInstance();
  sl.registerLazySingleton(() => sharedPreferences);
  // Secure storage for refresh tokens
  sl.registerLazySingleton<FlutterSecureStorage>(() => const FlutterSecureStorage());
  // Base http client (uses platform factory; on web it enables withCredentials)
  sl.registerLazySingleton<http.Client>(() => createBaseHttpClient());

  // Cloudinary uploader (unsigned preset)
  sl.registerLazySingleton<CloudinaryUploader>(() => CloudinaryUploader(
        client: sl<http.Client>(),
        cloudName: kCloudinaryCloudName,
        uploadPreset: kCloudinaryUploadPreset,
      ));

  // Auth-aware http client with auto-refresh
  sl.registerLazySingleton<http.Client>(() {
    final authLocal = sl<AuthLocalDataSource>();
    return AuthHttpClient(
      inner: sl<http.Client>(),
      getAccessToken: () async => (await authLocal.getCachedAuthTokens())?.accessToken,
      getRefreshToken: () async => (await authLocal.getCachedAuthTokens())?.refreshToken,
      saveTokens: (access, refresh) async {
        await authLocal.cacheAuthTokens(AuthTokensModel(accessToken: access, refreshToken: refresh));
      },
      logout: () async {
        await authLocal.clearAuthTokens();
      },
      refreshUrl: '$kBaseApiUrl/api/auth/refresh',
    );
  }, instanceName: 'authHttp');

  // Re-register AuthRemoteDataSource to ensure it uses the authHttp client
  sl.unregister<AuthRemoteDataSource>();
  sl.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(client: sl<http.Client>(instanceName: 'authHttp'), baseUrl: kBaseApiUrl),
  );

  // Use AuthHttpClient for SettingsRemoteDataSourceImpl
  sl.unregister<settings_ds.SettingsRemoteDataSource>();
  sl.registerLazySingleton<settings_ds.SettingsRemoteDataSource>(
    () => SettingsRemoteDataSourceImpl(
      client: sl<http.Client>(instanceName: 'authHttp'),
  baseUrl: kBaseApiUrl,
    ),
  );
}
