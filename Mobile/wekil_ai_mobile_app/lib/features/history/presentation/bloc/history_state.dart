part of 'history_bloc.dart';

@immutable
class HistoryState {
	final bool loading;
	final List<Agreement> items;
	final int page;
	final int limit;
	final bool hasMore;
	final String? error;

	const HistoryState({
		this.loading = false,
		this.items = const [],
		this.page = 1,
		this.limit = 20,
		this.hasMore = true,
		this.error,
	});

	HistoryState copyWith({
		bool? loading,
		List<Agreement>? items,
		int? page,
		int? limit,
		bool? hasMore,
		String? error, // pass empty string to clear
	}) {
		return HistoryState(
			loading: loading ?? this.loading,
			items: items ?? this.items,
			page: page ?? this.page,
			limit: limit ?? this.limit,
			hasMore: hasMore ?? this.hasMore,
			error: error == '' ? null : (error ?? this.error),
		);
	}
}
