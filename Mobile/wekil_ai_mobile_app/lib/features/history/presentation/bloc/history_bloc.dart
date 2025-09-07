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

  List<Agreement> _dedupKeepOrder(List<Agreement> items) {
    final seen = <String>{};
    final result = <Agreement>[];
    for (final a in items) {
      if (seen.add(a.id)) result.add(a);
    }
    return result;
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
      // Prepend freshly reloaded items on top of current list and deduplicate by id.
      final merged = _dedupKeepOrder([
        ...res.items,
        ...state.items,
      ]);
      emit(state.copyWith(
        loading: false,
        items: merged,
        page: 1,
        limit: res.limit,
        hasMore: true, // allow loading older pages again
      ));
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
      final appended = _dedupKeepOrder([...state.items, ...res.items]);
      emit(state.copyWith(
        loading: false,
        items: appended,
        page: res.page,
        limit: res.limit,
        hasMore: res.hasMore,
      ));
    } catch (e) {
      emit(state.copyWith(loading: false, error: e.toString()));
    }
  }
}
