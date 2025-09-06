import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_localization/flutter_localization.dart';
import 'package:wekil_ai_mobile_app/features/localization/locales.dart';
import 'dart:math' as math;
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

class DashboardPage extends StatefulWidget {
  final VoidCallback? onCreate;
  final VoidCallback? onViewAll;
  const DashboardPage({super.key, this.onCreate, this.onViewAll});

  static Widget provider({VoidCallback? onCreate, VoidCallback? onViewAll}) {
    return BlocProvider(
      create: (_) => getIt<DashboardCubit>()..load(),
      child: DashboardPage(onCreate: onCreate, onViewAll: onViewAll),
    );
  }

  static Widget withDependencies({
    DashboardCubit? cubit,
    u.GetDashboardData? usecase,
    d.DashboardRepository? repository,
    bool autoLoad = true,
    VoidCallback? onCreate,
    VoidCallback? onViewAll,
  }) {
    if (cubit != null) {
      if (autoLoad) cubit.load();
      return BlocProvider.value(
        value: cubit,
        child: DashboardPage(onCreate: onCreate, onViewAll: onViewAll),
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
      child: DashboardPage(onCreate: onCreate, onViewAll: onViewAll),
    );
  }

  static Widget withMockData({
    required DashboardSummary summary,
    required List<Agreement> recent,
    Individual? user,
    VoidCallback? onCreate,
    VoidCallback? onViewAll,
  }) {
    final repo = _FakeDashboardRepository(
      summary: summary,
      recent: recent,
      user: user,
    );
    final uc = u.GetDashboardData(repo);
    return BlocProvider(
      create: (_) => DashboardCubit(uc)..load(),
      child: DashboardPage(onCreate: onCreate, onViewAll: onViewAll),
    );
  }

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async => context.read<DashboardCubit>().load(),
          child: BlocBuilder<DashboardCubit, DashboardState>(
            builder: (context, state) {
              // While loading, show a centered full-screen loader
              if (state.status == DashboardStatus.loading) {
                final height =
                    MediaQuery.of(context).size.height -
                    MediaQuery.of(context).padding.top;
                return SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  child: SizedBox(
                    height: height,
                    child: const Center(child: CircularProgressIndicator()),
                  ),
                );
              }

              final user = state.user;
              final first = (user?.firstName ?? '').trim();
              final name = first.isNotEmpty
                  ? first
                  : LocalesData.there.getString(context);
              final verified = user?.isVerified == true;

              return SingleChildScrollView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            context.formatString(LocalesData.welcome, [name]),
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
                      LocalesData.Overview.getString(context),
                      style: AppTypography.body(color: AppColors.textDark),
                    ),
                    const SizedBox(height: 10),
                    _OverviewRow(state: state),
                    const SizedBox(height: 18),
                    Row(
                      children: [
                        Text(
                          LocalesData.recentContracts.getString(context),
                          style: AppTypography.body(
                            fontWeight: FontWeight.w600,
                            color: AppColors.textDark,
                          ),
                        ),
                        const Spacer(),
                        TextButton(
                          onPressed: () {
                            // Delegate the view-all action to the provided callback
                            // If not provided, show a small message instead of navigating
                            if (widget.onViewAll != null) {
                              widget.onViewAll!();
                            } else {
                              final msg = LocalesData.notImplemented.getString(
                                context,
                              );
                              ScaffoldMessenger.of(
                                context,
                              ).showSnackBar(SnackBar(content: Text(msg)));
                            }
                          },
                          child: Text(
                            LocalesData.viewAll.getString(context),
                            style: AppTypography.body(
                              fontWeight: FontWeight.w600,
                              color: AppColors.accent,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    _RecentContracts(
                      state: state,
                      onCreate: widget.onCreate ?? () {},
                      onViewAll: widget.onViewAll,
                    ),
                    const SizedBox(height: 32),
                  ],
                ),
              );
            },
          ),
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
                  label: LocalesData.draftContracts.getString(context),
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
                  label: LocalesData.exportedContracts.getString(context),
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
                  label: LocalesData.allContracts.getString(context),
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
  final VoidCallback? onViewAll;
  const _RecentContracts({
    required this.state,
    required this.onCreate,
    this.onViewAll,
  });

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
              LocalesData.noContractsYet.getString(context),
              style: AppTypography.body(
                fontWeight: FontWeight.w600,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              LocalesData.createFirstContract.getString(context),
              style: AppTypography.small(color: AppColors.textDark),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                FilledButton.icon(
                  onPressed: onCreate,
                  icon: const Icon(Icons.add),
                  label: Text(
                    LocalesData.createContract.getString(context),
                    style: AppTypography.button(),
                  ),
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
                const SizedBox(width: 12),
                TextButton.icon(
                  onPressed: () => context.read<DashboardCubit>().load(),
                  icon: AnimatedRotation(
                    turns: state.status == DashboardStatus.loading ? 1.0 : 0.0,
                    duration: const Duration(milliseconds: 600),
                    child: state.status == DashboardStatus.loading
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Icon(Icons.refresh),
                  ),
                  label: Text(
                    'Reload',
                    style: AppTypography.body(fontWeight: FontWeight.w600),
                  ),
                ),
              ],
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
                  color: Colors.white,
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
