import 'package:flutter_bloc/flutter_bloc.dart';

import '../../domain/usecases/get_dashboard_data.dart';
import 'dashboard_state.dart';

class DashboardCubit extends Cubit<DashboardState> {
  final GetDashboardData _getDashboardData;
  DashboardCubit(this._getDashboardData) : super(const DashboardState());

  Future<void> load() async {
    emit(state.copyWith(status: DashboardStatus.loading));
    try {
      final result = await _getDashboardData();
      emit(
        state.copyWith(
          status: DashboardStatus.loaded,
          summary: result.summary,
          recent: result.recent,
        ),
      );
    } catch (e) {
      emit(state.copyWith(status: DashboardStatus.error, error: e.toString()));
    }
  }
}
