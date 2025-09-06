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
      if (state.loading) {
              return const Center(child: CircularProgressIndicator());
            }
      if (state.error != null) {
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
      if (index == state.items.length) {
        context.read<HistoryBloc>().add(HistoryLoadMore());
                    return const Padding(
                      padding: EdgeInsets.symmetric(vertical: 12),
                      child: Center(child: CircularProgressIndicator(strokeWidth: 2)),
                    );
                  }
                  final a = state.items[index];
                  return RecentContractCard(
                    contract: a,
                    onTap: () {
                      // navigate to agreement detail route using go_router
                      context.push('/agreement/${a.id}');
                    },
                  );
                },
                separatorBuilder: (_, __) => const SizedBox(height: 10),
                itemCount: state.hasMore ? state.items.length + 1 : state.items.length,
              ),
            );
          },
        ),
      ),
    );
  }
}
