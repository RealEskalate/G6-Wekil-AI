import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../dashboard/presentation/widgets/recent_contract_card.dart';
import '../../domain/usecases/get_history_page.dart';
import '../bloc/history_bloc.dart';

class HistoryPage extends StatelessWidget {
  const HistoryPage({super.key});

  static Widget provider({required GetHistoryPage usecase}) {
    return BlocProvider(
      create: (_) => HistoryBloc(usecase)..add(HistoryStarted()),
      child: const HistoryPage(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
  child: BlocBuilder<HistoryBloc, HistoryState>(
          builder: (context, state) {
            // Show full-screen loader only when first loading (no items yet)
            if (state.loading && state.items.isEmpty) {
              return const Center(child: CircularProgressIndicator());
            }
            // Show full-screen error only when nothing to display yet
            if (state.error != null && state.items.isEmpty) {
              return Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.error_outline, color: Colors.redAccent),
                    const SizedBox(height: 8),
                    Text(state.error!, style: const TextStyle(color: Colors.redAccent)),
                    const SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: () => context.read<HistoryBloc>().add(HistoryStarted()),
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              );
            }

            return RefreshIndicator(
              onRefresh: () async => context.read<HistoryBloc>().add(HistoryRefreshed()),
              child: ListView.separated(
                padding: const EdgeInsets.all(12),
                itemBuilder: (context, index) {
                  final int baseCount = state.items.length;
                  final bool hasMore = state.hasMore;

                  // Bottom load-more sentinel
                  if (hasMore && index == baseCount) {
                    if (!state.loading) {
                      // Trigger next page load, but don't show a button; spinner only while loading
                      context.read<HistoryBloc>().add(HistoryLoadMore());
                      return const SizedBox.shrink();
                    }
                    return const Padding(
                      padding: EdgeInsets.symmetric(vertical: 12),
                      child: Center(child: CircularProgressIndicator(strokeWidth: 2)),
                    );
                  }

                  if (index >= baseCount) return const SizedBox.shrink();

                  final a = state.items[index];
                  return RecentContractCard(
                    contract: a,
                    onTap: () {
                      context.push('/preview/${a.id}');
                    },
                  );
                },
                separatorBuilder: (_, __) => const SizedBox(height: 10),
                itemCount: state.items.length + (state.hasMore ? 1 : 0),
              ),
            );
          },
        ),
      ),
    );
  }
}
