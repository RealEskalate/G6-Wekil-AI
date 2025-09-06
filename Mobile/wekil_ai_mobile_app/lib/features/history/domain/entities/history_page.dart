import '../../../dashboard/domain/entities/agreement.dart';

class HistoryPageResult {
  final List<Agreement> items;
  final int page;
  final int limit;
  final int? total;
  final bool hasMore;

  HistoryPageResult({
    required this.items,
    required this.page,
    required this.limit,
    required this.hasMore,
    this.total,
  });
}
