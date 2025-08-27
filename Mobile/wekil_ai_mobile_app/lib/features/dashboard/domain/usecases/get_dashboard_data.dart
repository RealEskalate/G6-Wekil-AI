import '../entities/dashboard_summary.dart';
import '../entities/agreement.dart';
import '../repositories/dashboard_repository.dart';

class GetDashboardData {
  final DashboardRepository repository;
  GetDashboardData(this.repository);

  Future<({DashboardSummary summary, List<Agreement> recent})> call() async {
    final summary = await repository.getSummary();
    final recent = await repository.getTopAgreements(limit: 3);
    return (summary: summary, recent: recent);
  }
}
