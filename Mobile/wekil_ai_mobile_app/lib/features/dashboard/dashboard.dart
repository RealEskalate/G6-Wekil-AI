// Easy integration barrel for the Dashboard feature.
// Import this file to access the main screen, state, cubit, use case, and entities.

export 'presentation/dashboard.dart' show DashboardPage;
export 'presentation/bloc/dashboard_cubit.dart' show DashboardCubit;
export 'presentation/bloc/dashboard_state.dart'
    show DashboardState, DashboardStatus;

// Domain
export 'domain/entities/agreement.dart';
export 'domain/entities/dashboard_summary.dart';
export 'domain/repositories/dashboard_repository.dart';
export 'domain/usecases/get_dashboard_data.dart' show GetDashboardData;
