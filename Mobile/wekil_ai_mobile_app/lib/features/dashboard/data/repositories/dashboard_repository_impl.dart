import 'package:wekil_ai_mobile_app/features/dashboard/domain/entities/individual.dart';

import '../../domain/entities/agreement.dart';
import '../../domain/entities/dashboard_summary.dart';
import '../../domain/entities/app_notification.dart';
import '../../domain/repositories/dashboard_repository.dart';
import '../datasources/dashboard_remote_data_source.dart';

class DashboardRepositoryImpl implements DashboardRepository {
  final DashboardRemoteDataSource remote;

  DashboardRepositoryImpl({required this.remote});

  @override
  Future<DashboardSummary> getSummary() async {
    final list = await remote.fetchAgreements();
    int draft = 0;
    int exported = 0;
    for (final a in list) {
      final s = (a.status ?? '').toLowerCase();
      if (s == 'draft') draft++;
      if (s == 'exported') exported++;
    }
    return DashboardSummary(
      draftCount: draft,
      exportedCount: exported,
      allCount: list.length,
    );
  }

  @override
  Future<List<Agreement>> getTopAgreements({int limit = 5}) async {
    final list = await remote.fetchAgreements();
    return list.take(limit).toList();
  }

  @override
  Future<Individual> getProfile() async {
    final user = await remote.fetchProfile();
    if (user == null) throw Exception('Failed to load profile');
    return user;
  }

  @override
  Future<AppNotification?> getNotification() async {
    return remote.fetchNotification();
  }
}
