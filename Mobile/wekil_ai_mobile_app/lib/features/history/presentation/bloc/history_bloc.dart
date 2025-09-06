import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import '../../../dashboard/domain/entities/agreement.dart';
import '../../domain/usecases/get_history_page.dart';

part 'history_event.dart';
part 'history_state.dart';

class HistoryBloc extends Bloc<HistoryEvent, HistoryState> {
  final GetHistoryPage getPage;
  HistoryBloc(this.getPage) : super(const HistoryState()) {
    on<HistoryStarted>(_onStarted);
    on<HistoryRefreshed>(_onRefreshed);
    on<HistoryLoadMore>(_onLoadMore);
  }

  Future<void> _onStarted(HistoryStarted event, Emitter<HistoryState> emit) async {
    emit(state.copyWith(loading: true, page: event.page, limit: event.limit, error: ''));
    try {
      final res = await getPage(page: event.page, limit: event.limit, search: event.search, status: event.status);
      emit(
        state.copyWith(
          loading: false,
          items: res.items,
          page: res.page,
          limit: res.limit,
          hasMore: res.hasMore,
        ),
      );
    } catch (e) {
      emit(state.copyWith(loading: false, error: e.toString()));
    }
  }

  Future<void> _onRefreshed(HistoryRefreshed event, Emitter<HistoryState> emit) async {
    emit(state.copyWith(loading: true, page: 1, error: ''));
    try {
      final res = await getPage(page: 1, limit: state.limit);
      emit(
        state.copyWith(
          loading: false,
          items: res.items,
          page: res.page,
          limit: res.limit,
          hasMore: res.hasMore,
        ),
      );
    } catch (e) {
      emit(state.copyWith(loading: false, error: e.toString()));
    }
  }

  Future<void> _onLoadMore(HistoryLoadMore event, Emitter<HistoryState> emit) async {
    if (state.loading || !state.hasMore) return;
    emit(state.copyWith(loading: true));
    try {
      final nextPage = state.page + 1;
      final res = await getPage(page: nextPage, limit: state.limit);
      emit(
        state.copyWith(
          loading: false,
          items: [...state.items, ...res.items],
          page: res.page,
          limit: res.limit,
          hasMore: res.hasMore,
        ),
      );
    } catch (e) {
      emit(state.copyWith(loading: false, error: e.toString()));
    }
  }
}
