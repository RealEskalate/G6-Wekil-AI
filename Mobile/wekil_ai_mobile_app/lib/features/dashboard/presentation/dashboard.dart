import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../core/di/injection.dart';
import 'bloc/dashboard_cubit.dart';
import 'bloc/dashboard_state.dart';
import 'widgets/stat_card.dart';
import 'widgets/recent_contract_card.dart';
import '../domain/repositories/dashboard_repository.dart' as d;
import '../domain/usecases/get_dashboard_data.dart' as u;
import '../data/repositories/dashboard_repository_impl.dart' as impl;
import '../data/datasources/dashboard_remote_data_source.dart' as ds;
// Import entity types for easier references
import '../domain/entities/dashboard_summary.dart';
import '../domain/entities/agreement.dart';
import '../domain/entities/individual.dart';
import '../domain/entities/app_notification.dart';

class DashboardPage extends StatelessWidget {
  final VoidCallback? onCreate;
  const DashboardPage({super.key, this.onCreate});

  static Widget provider() {
    return BlocProvider(
      create: (_) => getIt<DashboardCubit>()..load(),
      child: const DashboardPage(),
    );
  }

  /// Easy-to-integrate builder. Pass either an existing [DashboardCubit],
  /// or a [GetDashboardData] use case, or a [DashboardRepository]. If nothing is
  /// provided, a lightweight in-memory implementation is used so the screen
  /// works out-of-the-box without DI.
  static Widget withDependencies({
    DashboardCubit? cubit,
    u.GetDashboardData? usecase,
    d.DashboardRepository? repository,
    bool autoLoad = true,
    VoidCallback? onCreate,
  }) {
    if (cubit != null) {
      if (autoLoad) cubit.load();
      return BlocProvider.value(
        value: cubit,
        child: DashboardPage(onCreate: onCreate),
      );
    }

    final resolvedUsecase =
        usecase ??
        u.GetDashboardData(
          repository ??
              impl.DashboardRepositoryImpl(
                remote: ds.DashboardRemoteDataSource(),
              ),
        );

    return BlocProvider(
      create: (_) => DashboardCubit(resolvedUsecase)..load(),
      child: DashboardPage(onCreate: onCreate),
    );
  }

  /// Quick builder for showcases/tests: pass final data directly.
  /// No backend or DI required.
  static Widget withMockData({
    required DashboardSummary summary,
    required List<Agreement> recent,
    Individual? user,
    VoidCallback? onCreate,
  }) {
    final repo = _FakeDashboardRepository(
      summary: summary,
      recent: recent,
      user: user,
    );
    final uc = u.GetDashboardData(repo);
    return BlocProvider(
      create: (_) => DashboardCubit(uc)..load(),
      child: DashboardPage(onCreate: onCreate),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      body: SafeArea(
        child: BlocBuilder<DashboardCubit, DashboardState>(
          builder: (context, state) {
            final user = state.user;
            final first = (user?.firstName ?? '').trim();
            final name = first.isNotEmpty ? first : 'there';
            final verified = user?.isVerified == true;
            return SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          'Welcome back, $name!',
                          style: Theme.of(context).textTheme.titleLarge
                              ?.copyWith(fontWeight: FontWeight.w700),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (verified)
                        const Padding(
                          padding: EdgeInsets.only(left: 8.0),
                          child: Icon(
                            Icons.verified_rounded,
                            color: Color(0xFF10B981),
                            size: 22,
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Overview',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 10),
                  _OverviewRow(state: state),
                  const SizedBox(height: 18),
                  Row(
                    children: [
                      Text(
                        'Recent Contracts',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const Spacer(),
                      TextButton(
                        onPressed: () {
                          if ((state.recent).isEmpty) {
                            // If empty, reuse create action
                            (onCreate ?? () {})();
                          } else {
                            // Placeholder route for View All
                            Navigator.of(context).pushNamed('/agreements');
                          }
                        },
                        child: const Text('View All'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  _RecentContracts(state: state, onCreate: onCreate ?? () {}),
                  const SizedBox(height: 32),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}

class _FakeDashboardRepository implements d.DashboardRepository {
  final DashboardSummary summary;
  final List<Agreement> recent;
  final Individual? user;
  _FakeDashboardRepository({
    required this.summary,
    required this.recent,
    this.user,
  });
  @override
  Future<DashboardSummary> getSummary() async => summary;
  @override
  Future<List<Agreement>> getTopAgreements({int limit = 3}) async =>
      recent.take(limit).toList();
  @override
  Future<Individual> getProfile() async =>
      user ??
      Individual(
        id: '0',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        accountType: 'user',
        isVerified: true,
        createdAt: DateTime.now(),
      );
  @override
  Future<AppNotification?> getNotification() async => null;
}

class _OverviewRow extends StatelessWidget {
  final DashboardState state;
  const _OverviewRow({required this.state});

  @override
  Widget build(BuildContext context) {
    final summary = state.summary;
    final isLoading =
        state.status == DashboardStatus.loading && summary == null;

    return Row(
      children: [
        Expanded(
          child: isLoading
              ? const _SkeletonCard()
              : StatCard(
                  label: 'Draft Contracts',
                  value: summary?.draftCount ?? 0,
                  color: const Color(0xFF3B82F6),
                ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: isLoading
              ? const _SkeletonCard()
              : StatCard(
                  label: 'Exported Contracts',
                  value: summary?.exportedCount ?? 0,
                  color: const Color(0xFF10B981),
                ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: isLoading
              ? const _SkeletonCard()
              : StatCard(
                  label: 'All Contracts',
                  value: summary?.allCount ?? 0,
                  color: const Color(0xFF14B8A6),
                ),
        ),
      ],
    );
  }
}

class _SkeletonCard extends StatelessWidget {
  const _SkeletonCard();
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 74,
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(14),
      ),
    );
  }
}

class _RecentContracts extends StatelessWidget {
  final DashboardState state;
  final VoidCallback onCreate;
  const _RecentContracts({required this.state, required this.onCreate});

  @override
  Widget build(BuildContext context) {
    final borderColor = Theme.of(context).dividerColor.withOpacity(.3);
    if (state.recent.isEmpty) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 30),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: borderColor),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.insert_drive_file_outlined,
              size: 46,
              color: Theme.of(context).hintColor,
            ),
            const SizedBox(height: 12),
            const Text(
              'No contracts yet',
              style: TextStyle(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 4),
            const Text(
              'Create your first contract',
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 12),
            FilledButton.icon(
              onPressed: onCreate,
              icon: const Icon(Icons.add),
              label: const Text('Create Contract'),
              style: FilledButton.styleFrom(
                backgroundColor: const Color(0xFF14B8A6),
              ),
            ),
          ],
        ),
      );
    }

    return Column(
      children: state.recent
          .map(
            (c) => Padding(
              padding: const EdgeInsets.only(bottom: 12.0),
              child: RecentContractCard(
                contract: c,
                onTap: () {},
                onEdit: () {},
              ),
            ),
          )
          .toList(),
    );
  }
}
