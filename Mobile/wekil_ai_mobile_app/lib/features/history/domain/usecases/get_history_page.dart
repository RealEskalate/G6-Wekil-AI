import '../entities/history_page.dart';
import '../repositories/history_repository.dart';

class GetHistoryPage {
  final HistoryRepository repo;
  GetHistoryPage(this.repo);

  Future<HistoryPageResult> call({int page = 1, int limit = 20, String? search, String? status}) {
    return repo.getAgreements(page: page, limit: limit, search: search, status: status);
  }
}
