import '../entities/dashboard_summary.dart';
import '../entities/agreement.dart';

abstract class DashboardRepository {
  Future<DashboardSummary> getSummary();
  Future<List<Agreement>> getTopAgreements({int limit = 3});
}
