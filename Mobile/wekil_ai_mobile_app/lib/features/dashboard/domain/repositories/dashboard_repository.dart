import '../entities/dashboard_summary.dart';
import '../entities/agreement.dart';
import '../entities/individual.dart';
import '../entities/app_notification.dart';

abstract class DashboardRepository {
  Future<DashboardSummary> getSummary();
  Future<List<Agreement>> getTopAgreements({int limit = 3});
  Future<Individual> getProfile();
  Future<AppNotification?> getNotification();
}
