import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wekil_ai_mobile_app/features/contacts/presentations/pages/create_start_page.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../core/di/injection.dart';
import 'bloc/dashboard_cubit.dart';
import 'bloc/dashboard_state.dart';
import 'widgets/stat_card.dart';
import 'widgets/recent_contract_card.dart';
import '../domain/repositories/dashboard_repository.dart' as d;
import '../domain/usecases/get_dashboard_data.dart' as u;
import '../data/repositories/dashboard_repository_impl.dart' as impl;
import '../data/datasources/dashboard_remote_data_source.dart' as ds;
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
      backgroundColor: AppColors.background,
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
                          style: AppTypography.heading(
                            fontSize: 26,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textDark,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (verified)
                        Padding(
                          padding: const EdgeInsets.only(left: 8.0),
                          child: Icon(
                            Icons.verified_rounded,
                            color: AppColors.accent,
                            size: 22,
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Overview',
                    style: AppTypography.body(color: AppColors.textDark),
                  ),
                  const SizedBox(height: 10),
                  _OverviewRow(state: state),
                  const SizedBox(height: 18),
                  Row(
                    children: [
                      Text(
                        'Recent Contracts',
                        style: AppTypography.body(
                          fontWeight: FontWeight.w600,
                          color: AppColors.textDark,
                        ),
                      ),
                      const Spacer(),
                      TextButton(
                        onPressed: () {
                          if ((state.recent).isEmpty) {
                            (onCreate ?? () {})();
                          } else {
                            Navigator.of(context).pushNamed('/agreements');
                          }
                        },
                        child: Text(
                          'View All',
                          style: AppTypography.body(
                            fontWeight: FontWeight.w600,
                            color: AppColors.accent,
                          ),
                        ),
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
                  color: Colors.blue,
                  labelColor: Colors.blue,
                ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: isLoading
              ? const _SkeletonCard()
              : StatCard(
                  label: 'Exported Contracts',
                  value: summary?.exportedCount ?? 0,
                  color: Colors.green,
                  labelColor: Colors.green,
                ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: isLoading
              ? const _SkeletonCard()
              : StatCard(
                  label: 'All Contracts',
                  value: summary?.allCount ?? 0,
                  color: Colors.deepPurple,
                  labelColor: Colors.deepPurple,
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
        color: AppColors.background.withOpacity(0.8),
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
    final borderColor = AppColors.textDark.withOpacity(0.3);

    if (state.recent.isEmpty) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.textLight,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: borderColor),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.insert_drive_file_outlined,
              size: 46,
              color: AppColors.primary,
            ),
            const SizedBox(height: 12),
            Text(
              'No contracts yet',
              style: AppTypography.body(
                fontWeight: FontWeight.w600,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Create your first contract',
              style: AppTypography.small(color: AppColors.textDark),
            ),
            const SizedBox(height: 12),
            FilledButton.icon(
              onPressed: onCreate, // make sure to call your function
              icon: const Icon(Icons.add),
              label: Text('Create Contract', style: AppTypography.button()),
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.accent,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(
                    6,
                  ), // smaller radius → more rectangular
                ),
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 12,
                ),
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
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white, // <-- white background
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 4,
                      offset: Offset(0, 2),
                    ),
                  ],
                ),
                padding: const EdgeInsets.all(12),
                child: RecentContractCard(
                  contract: c,
                  onTap: () {},
                  onEdit: () {},
                ),
              ),
            ),
          )
          .toList(),
    );
  }
}
