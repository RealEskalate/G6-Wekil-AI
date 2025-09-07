part of 'preview_bloc.dart';

@immutable
class PreviewState {
  final bool loading;
  final AgreementPreview? data;
  final String? error;

  const PreviewState({this.loading = false, this.data, this.error});

  PreviewState copyWith({bool? loading, AgreementPreview? data, String? error}) {
    return PreviewState(
      loading: loading ?? this.loading,
      data: data ?? this.data,
      error: error == '' ? null : (error ?? this.error),
    );
  }
}
