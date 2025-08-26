import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:wekil_ai_mobile_app/features/dashboard/presentation/bloc/dashboard_cubit.dart';
import 'package:wekil_ai_mobile_app/features/dashboard/presentation/bloc/dashboard_state.dart';
import 'package:wekil_ai_mobile_app/features/dashboard/presentation/dashboard.dart';
import 'package:wekil_ai_mobile_app/features/dashboard/domain/entities/contract.dart';
import 'package:wekil_ai_mobile_app/features/dashboard/domain/entities/dashboard_summary.dart';
import 'package:wekil_ai_mobile_app/features/dashboard/domain/usecases/get_dashboard_data.dart';
import 'package:wekil_ai_mobile_app/features/dashboard/domain/repositories/dashboard_repository.dart';

class _DummyRepo implements DashboardRepository {
  _DummyRepo({this.summary, this.contracts = const []});
  final DashboardSummary? summary;
  final List<Contract> contracts;

  @override
  Future<List<Contract>> getRecentContracts({int limit = 5}) async {
    return contracts.take(limit).toList();
  }

  @override
  Future<DashboardSummary> getSummary() async {
    return summary ??
        const DashboardSummary(draftCount: 0, exportedCount: 0, allCount: 0);
  }
}

void main() {
  testWidgets(
    'shows empty state and Create Contract button triggers callback',
    (tester) async {
      final repo = _DummyRepo(
        summary: const DashboardSummary(
          draftCount: 0,
          exportedCount: 0,
          allCount: 0,
        ),
        contracts: const [],
      );
      final cubit = DashboardCubit(GetDashboardData(repo));

      // Force loaded empty state
      cubit.emit(
        const DashboardState(
          status: DashboardStatus.loaded,
          recent: [],
          summary: DashboardSummary(
            draftCount: 0,
            exportedCount: 0,
            allCount: 0,
          ),
        ),
      );

      var tapped = false;

      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: cubit,
            child: DashboardPage(onCreate: () => tapped = true),
          ),
        ),
      );

      await tester.pumpAndSettle();

      expect(find.text('No contracts yet'), findsOneWidget);
      expect(find.text('Create Contract'), findsOneWidget);

      await tester.tap(find.text('Create Contract'));
      await tester.pump();

      expect(tapped, isTrue);
    },
  );

  testWidgets(
    'shows recent contracts list when available and hides Create button',
    (tester) async {
      final repo = _DummyRepo(
        summary: const DashboardSummary(
          draftCount: 2,
          exportedCount: 1,
          allCount: 3,
        ),
        contracts: [
          Contract(
            id: '1',
            title: 'Employment Agreement',
            type: 'Service Agreement',
            party: 'Acme',
            createdAt: DateTime(2023, 12, 31),
            amount: 5000,
            currency: 'ETB',
            status: ContractStatus.draft,
          ),
          Contract(
            id: '2',
            title: 'NDA - Vendor X',
            type: 'NDA',
            party: 'Vendor X',
            createdAt: DateTime(2023, 12, 30),
            amount: 10000,
            currency: 'ETB',
            status: ContractStatus.exported,
          ),
        ],
      );
      final cubit = DashboardCubit(GetDashboardData(repo));
      cubit.emit(
        DashboardState(
          status: DashboardStatus.loaded,
          summary: const DashboardSummary(
            draftCount: 2,
            exportedCount: 1,
            allCount: 3,
          ),
          recent: [
            Contract(
              id: '1',
              title: 'Employment Agreement',
              type: 'Service Agreement',
              party: 'Acme',
              createdAt: DateTime(2023, 12, 31),
              amount: 5000,
              currency: 'ETB',
              status: ContractStatus.draft,
            ),
            Contract(
              id: '2',
              title: 'NDA - Vendor X',
              type: 'NDA',
              party: 'Vendor X',
              createdAt: DateTime(2023, 12, 30),
              amount: 10000,
              currency: 'ETB',
              status: ContractStatus.exported,
            ),
          ],
        ),
      );

      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(value: cubit, child: const DashboardPage()),
        ),
      );

      await tester.pumpAndSettle();

      expect(find.text('Create Contract'), findsNothing);
      expect(find.text('Employment Agreement'), findsOneWidget);
      expect(find.text('NDA - Vendor X'), findsOneWidget);
    },
  );
}
