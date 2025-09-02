import '../entities/dashboard_summary.dart';
import '../entities/agreement.dart';
import '../entities/individual.dart';
import '../repositories/dashboard_repository.dart';

class GetDashboardData {
  final DashboardRepository repository;
  GetDashboardData(this.repository);

  Future<({DashboardSummary summary, List<Agreement> recent, Individual user})>
  call() async {
    final summaryFuture = repository.getSummary();
    final recentFuture = repository.getTopAgreements(limit: 3);
    final userFuture = repository.getProfile();

    final results = await Future.wait([
      summaryFuture,
      recentFuture,
      userFuture,
    ]);

    return (
      summary: results[0] as DashboardSummary,
      recent: results[1] as List<Agreement>,
      user: results[2] as Individual,
    );
  }
}
