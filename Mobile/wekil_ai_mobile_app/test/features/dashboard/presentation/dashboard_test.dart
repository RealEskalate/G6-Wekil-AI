import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:wekil_ai_mobile_app/features/dashboard/presentation/bloc/dashboard_cubit.dart';
import 'package:wekil_ai_mobile_app/features/dashboard/presentation/bloc/dashboard_state.dart';
import 'package:wekil_ai_mobile_app/features/dashboard/presentation/dashboard.dart';
import 'package:wekil_ai_mobile_app/features/dashboard/domain/entities/agreement.dart';
import 'package:wekil_ai_mobile_app/features/dashboard/domain/entities/dashboard_summary.dart';
import 'package:wekil_ai_mobile_app/features/dashboard/domain/usecases/get_dashboard_data.dart';
import 'package:wekil_ai_mobile_app/features/dashboard/domain/repositories/dashboard_repository.dart';

class _DummyRepo implements DashboardRepository {
  _DummyRepo({this.summary, this.agreements = const []});
  final DashboardSummary? summary;
  final List<Agreement> agreements;

  @override
  Future<List<Agreement>> getTopAgreements({int limit = 3}) async {
    return agreements.take(limit).toList();
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
        agreements: const [],
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
        agreements: [
          const Agreement(
            id: '1',
            title: 'Employment Agreement',
            currency: 'ETB',
            totalAmount: 5000,
          ),
          const Agreement(
            id: '2',
            title: 'NDA - Vendor X',
            currency: 'ETB',
            totalAmount: 10000,
          ),
        ],
      );
      final cubit = DashboardCubit(GetDashboardData(repo));
      cubit.emit(
        const DashboardState(
          status: DashboardStatus.loaded,
          summary: DashboardSummary(
            draftCount: 2,
            exportedCount: 1,
            allCount: 3,
          ),
          recent: [
            Agreement(
              id: '1',
              title: 'Employment Agreement',
              currency: 'ETB',
              totalAmount: 5000,
            ),
            Agreement(
              id: '2',
              title: 'NDA - Vendor X',
              currency: 'ETB',
              totalAmount: 10000,
            ),
          ],
        ),
      );

      await tester.pumpWidget(const MaterialApp(home: SizedBox.shrink()));

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
