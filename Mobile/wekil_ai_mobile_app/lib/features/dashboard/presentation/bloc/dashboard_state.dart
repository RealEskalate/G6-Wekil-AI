import 'package:equatable/equatable.dart';

import '../../domain/entities/agreement.dart';
import '../../domain/entities/dashboard_summary.dart';
import '../../domain/entities/individual.dart';

enum DashboardStatus { initial, loading, loaded, error }

class DashboardState extends Equatable {
  final DashboardStatus status;
  final DashboardSummary? summary;
  final List<Agreement> recent;
  final Individual? user;
  final String? error;

  const DashboardState({
    this.status = DashboardStatus.initial,
    this.summary,
    this.recent = const [],
    this.user,
    this.error,
  });

  DashboardState copyWith({
    DashboardStatus? status,
    DashboardSummary? summary,
    List<Agreement>? recent,
    Individual? user,
    String? error,
  }) => DashboardState(
    status: status ?? this.status,
    summary: summary ?? this.summary,
    recent: recent ?? this.recent,
    user: user ?? this.user,
    error: error ?? this.error,
  );

  @override
  List<Object?> get props => [status, summary, recent, user, error];
}
