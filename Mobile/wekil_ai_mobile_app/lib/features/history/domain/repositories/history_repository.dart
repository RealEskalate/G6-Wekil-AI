import 'package:wekil_ai_mobile_app/features/history/domain/entities/history_page.dart';

import '../../../dashboard/domain/entities/agreement.dart';

abstract class HistoryRepository {
  Future<HistoryPageResult> getAgreements({int page = 1, int limit = 20, String? search, String? status});
}
