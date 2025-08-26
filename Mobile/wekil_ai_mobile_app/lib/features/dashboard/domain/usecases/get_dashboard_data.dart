import '../entities/contract.dart';
import '../entities/dashboard_summary.dart';
import '../repositories/dashboard_repository.dart';

class GetDashboardData {
  final DashboardRepository repository;
  GetDashboardData(this.repository);

  Future<({DashboardSummary summary, List<Contract> recent})> call() async {
    final summary = await repository.getSummary();
    final recent = await repository.getRecentContracts(limit: 5);
    return (summary: summary, recent: recent);
  }
}
