import 'package:flutter_bloc/flutter_bloc.dart';

import '../../domain/usecases/get_dashboard_data.dart';
import 'dashboard_state.dart';
import '../../data/models/agreement_model.dart';

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
          user: result.user,
        ),
      );
    } catch (e) {
      emit(state.copyWith(status: DashboardStatus.error, error: e.toString()));
    }
  }

  Future<void> fetchAgreementById(String agreementId) async {
    emit(state.copyWith(status: DashboardStatus.loading));
    try {
      final response = await _getDashboardData.repository.getAgreementById(
        agreementId,
      );
      if (response == null) throw Exception('Failed to fetch agreement');
      final agreement = AgreementModel.fromJson(response).toEntity();
      emit(state.copyWith(status: DashboardStatus.loaded, recent: [agreement]));
    } catch (e) {
      emit(state.copyWith(status: DashboardStatus.error, error: e.toString()));
    }
  }
}
