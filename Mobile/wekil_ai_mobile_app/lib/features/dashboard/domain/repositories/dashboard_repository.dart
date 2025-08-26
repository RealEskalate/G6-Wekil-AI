import '../entities/contract.dart';
import '../entities/dashboard_summary.dart';

abstract class DashboardRepository {
  Future<DashboardSummary> getSummary();
  Future<List<Contract>> getRecentContracts({int limit = 5});
}
