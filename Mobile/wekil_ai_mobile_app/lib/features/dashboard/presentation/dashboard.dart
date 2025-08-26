import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../core/di/injection.dart';
import 'bloc/dashboard_cubit.dart';
import 'bloc/dashboard_state.dart';
import 'widgets/stat_card.dart';
import 'widgets/recent_contract_card.dart';

class DashboardPage extends StatelessWidget {
  final VoidCallback? onCreate;
  const DashboardPage({super.key, this.onCreate});

  static Widget provider() {
    return BlocProvider(
      create: (_) => getIt<DashboardCubit>()..load(),
      child: const DashboardPage(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      body: SafeArea(
        child: BlocBuilder<DashboardCubit, DashboardState>(
          builder: (context, state) {
            return SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 8),
                  Text(
                    'Welcome back, John!',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
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
                        onPressed: () {},
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
