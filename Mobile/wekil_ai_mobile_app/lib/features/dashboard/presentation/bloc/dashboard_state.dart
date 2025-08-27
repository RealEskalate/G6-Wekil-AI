import 'package:equatable/equatable.dart';

import '../../domain/entities/agreement.dart';
import '../../domain/entities/dashboard_summary.dart';

enum DashboardStatus { initial, loading, loaded, error }

class DashboardState extends Equatable {
  final DashboardStatus status;
  final DashboardSummary? summary;
  final List<Agreement> recent;
  final String? error;

  const DashboardState({
    this.status = DashboardStatus.initial,
    this.summary,
    this.recent = const [],
    this.error,
  });

  DashboardState copyWith({
    DashboardStatus? status,
    DashboardSummary? summary,
    List<Agreement>? recent,
    String? error,
  }) => DashboardState(
    status: status ?? this.status,
    summary: summary ?? this.summary,
    recent: recent ?? this.recent,
    error: error ?? this.error,
  );

  @override
  List<Object?> get props => [status, summary, recent, error];
}
