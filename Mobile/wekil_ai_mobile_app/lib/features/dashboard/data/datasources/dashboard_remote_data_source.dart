import 'dart:async';

import '../../domain/entities/contract.dart';
import '../models/contract_model.dart';

class DashboardRemoteDataSource {
  // TODO: Inject HTTP client when backend is ready.
  Future<Map<String, int>> fetchSummary() async {
    await Future.delayed(const Duration(milliseconds: 120));
    return const {'draftCount': 0, 'exportedCount': 1, 'allCount': 1};
  }

  Future<List<Contract>> fetchRecentContracts({int limit = 5}) async {
    await Future.delayed(const Duration(milliseconds: 150));
    final now = DateTime.now();
    final items = <ContractModel>[
      ContractModel(
        id: '1',
        title: 'FSF -- Mohammedamin jemal',
        type: 'Service Agreement',
        party: 'aSFF',
        createdAt: now,
        amount: 13213123,
        currency: 'ETB',
        status: ContractStatus.exported,
      ),
    ];
    return items.take(limit).toList();
  }
}
