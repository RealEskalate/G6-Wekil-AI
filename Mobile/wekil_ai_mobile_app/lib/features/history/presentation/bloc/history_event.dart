part of 'history_bloc.dart';

@immutable
sealed class HistoryEvent {}

final class HistoryStarted extends HistoryEvent {
	final String? search;
	final String? status;
	final int page;
	final int limit;
	HistoryStarted({this.search, this.status, this.page = 1, this.limit = 20});
}

final class HistoryRefreshed extends HistoryEvent {}

final class HistoryLoadMore extends HistoryEvent {}
