import 'package:get_it/get_it.dart';

import '../../features/dashboard/data/datasources/dashboard_remote_data_source.dart';
import '../../features/dashboard/data/repositories/dashboard_repository_impl.dart';
import '../../features/dashboard/domain/repositories/dashboard_repository.dart';
import '../../features/dashboard/domain/usecases/get_dashboard_data.dart';
import '../../features/dashboard/presentation/bloc/dashboard_cubit.dart';

final getIt = GetIt.instance;

Future<void> setupDependencies({
  String baseUrl = 'https://g6-wekil-ai-1.onrender.com',
  Future<String?> Function()? tokenProvider,
}) async {
  // Data source
  getIt.registerLazySingleton<DashboardRemoteDataSource>(
    () => DashboardRemoteDataSource(
      baseUrl: baseUrl,
      tokenProvider: tokenProvider,
    ),
  );

  // Repository
  getIt.registerLazySingleton<DashboardRepository>(
    () => DashboardRepositoryImpl(remote: getIt<DashboardRemoteDataSource>()),
  );

  // Use case
  getIt.registerFactory<GetDashboardData>(
    () => GetDashboardData(getIt<DashboardRepository>()),
  );

  // Cubit
  getIt.registerFactory<DashboardCubit>(
    () => DashboardCubit(getIt<GetDashboardData>()),
  );
}
