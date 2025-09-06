import 'package:get_it/get_it.dart';
import 'package:http/http.dart' as http;

import '../../features/dashboard/data/datasources/dashboard_remote_data_source.dart';
import '../../features/dashboard/data/repositories/dashboard_repository_impl.dart';
import '../../features/dashboard/domain/repositories/dashboard_repository.dart';
import '../../features/dashboard/domain/usecases/get_dashboard_data.dart';
import '../../features/dashboard/presentation/bloc/dashboard_cubit.dart';
// History
import '../../injection_container.dart' as di_all;
import '../../features/history/data/datasources/history_remote_data_source.dart';
import '../../features/history/data/repositories/history_repository_impl.dart';
import '../../features/history/domain/repositories/history_repository.dart';
import '../../features/history/domain/usecases/get_history_page.dart';
import '../../features/history/presentation/bloc/history_bloc.dart';

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

  // History DI
  getIt.registerLazySingleton<HistoryRemoteDataSource>(
    () => HistoryRemoteDataSource(
      baseUrl: baseUrl,
      client: di_all.sl<http.Client>(instanceName: 'authHttp'),
    ),
  );
  getIt.registerLazySingleton<HistoryRepository>(
    () => HistoryRepositoryImpl(remote: getIt<HistoryRemoteDataSource>()),
  );
  getIt.registerFactory<GetHistoryPage>(
    () => GetHistoryPage(getIt<HistoryRepository>()),
  );
  getIt.registerFactory<HistoryBloc>(
    () => HistoryBloc(getIt<GetHistoryPage>()),
  );
}
