import '../../domain/entities/contract.dart';
import '../../domain/entities/dashboard_summary.dart';
import '../../domain/repositories/dashboard_repository.dart';
import '../datasources/dashboard_remote_data_source.dart';

class DashboardRepositoryImpl implements DashboardRepository {
  final DashboardRemoteDataSource remote;

  DashboardRepositoryImpl({required this.remote});

  @override
  Future<DashboardSummary> getSummary() async {
    final json = await remote.fetchSummary();
    return DashboardSummary(
      draftCount: json['draftCount'] ?? 0,
      exportedCount: json['exportedCount'] ?? 0,
      allCount: json['allCount'] ?? 0,
    );
  }

  @override
  Future<List<Contract>> getRecentContracts({int limit = 5}) {
    return remote.fetchRecentContracts(limit: limit);
  }
}
