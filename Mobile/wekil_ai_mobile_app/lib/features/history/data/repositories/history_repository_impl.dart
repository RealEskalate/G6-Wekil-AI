import '../../domain/entities/history_page.dart';
import '../../domain/repositories/history_repository.dart';
import '../datasources/history_remote_data_source.dart';

class HistoryRepositoryImpl implements HistoryRepository {
  final HistoryRemoteDataSource remote;
  HistoryRepositoryImpl({required this.remote});

  @override
  Future<HistoryPageResult> getAgreements({int page = 1, int limit = 20, String? search, String? status}) {
    return remote.fetch(page: page, limit: limit, search: search, status: status);
  }
}
