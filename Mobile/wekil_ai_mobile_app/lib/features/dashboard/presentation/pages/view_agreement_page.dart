import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:wekil_ai_mobile_app/features/widget/bottom_nav.dart';
import 'package:wekil_ai_mobile_app/features/widget/nav_bar.dart';
import '../bloc/dashboard_cubit.dart';
import '../bloc/dashboard_state.dart';

class ViewAgreementPage extends StatelessWidget {
  final String agreementId;

  const ViewAgreementPage({Key? key, required this.agreementId})
    : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const NavBar(),
      bottomNavigationBar: BottomNav(
        currentIndex: 0, // Assuming this page is part of the Dashboard tab
        onItemSelected: (index) {
          switch (index) {
            case 0:
              GoRouter.of(context).go('/dashboard', extra: 0);
              break;
            case 1:
              GoRouter.of(context).push('/contracts/start');
              break;
            case 2:
              GoRouter.of(context).go('/dashboard', extra: 2);
              break;
          }
        },
        onCreatePressed: () {
          GoRouter.of(context).push('/contracts/start');
        },
      ),
      body: BlocProvider.value(
        value: context.read<DashboardCubit>(),
        child: BlocBuilder<DashboardCubit, DashboardState>(
          builder: (context, state) {
            if (state.status == DashboardStatus.loading) {
              return const Center(child: CircularProgressIndicator());
            } else if (state.status == DashboardStatus.error) {
              return Center(
                child: Text('Error: ${state.error ?? "Unknown error"}'),
              );
            } else if (state.status == DashboardStatus.loaded &&
                state.recent.isNotEmpty) {
              final agreement = state.recent.first;
              return Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Agreement ID: ${agreement.id}',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text('Services: ${agreement.services ?? "N/A"}'),
                    const SizedBox(height: 8),
                    Text('Status: ${agreement.status ?? "N/A"}'),
                    const SizedBox(height: 8),
                    Text('PDF URL: ${agreement.deliveryTerms ?? "N/A"}'),
                  ],
                ),
              );
            } else {
              return const Center(
                child: Text('No agreement details available.'),
              );
            }
          },
        ),
      ),
    );
  }
}
