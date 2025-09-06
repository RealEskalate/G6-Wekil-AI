import 'package:get_it/get_it.dart';
import 'package:http/http.dart' as http;

import '../../features/dashboard/data/datasources/dashboard_remote_data_source.dart';
import '../../features/dashboard/data/repositories/dashboard_repository_impl.dart';
import '../../features/dashboard/domain/repositories/dashboard_repository.dart';
import '../../features/dashboard/domain/usecases/get_dashboard_data.dart';
import '../../features/dashboard/presentation/bloc/dashboard_cubit.dart';

final getIt = GetIt.instance;

Future<void> setupDependencies({
  String baseUrl = 'https://g6-wekil-ai-1.onrender.com',
  http.Client? client,
}) async {
  // Data source
  getIt.registerLazySingleton<DashboardRemoteDataSource>(
    () => DashboardRemoteDataSource(
      baseUrl: baseUrl,
      client: client ?? http.Client(),
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
