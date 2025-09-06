import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';

import '../../domain/entities/agreement_preview.dart';
import '../../domain/usecases/get_agreement_preview.dart';

part 'preview_event.dart';
part 'preview_state.dart';

class PreviewBloc extends Bloc<PreviewEvent, PreviewState> {
  final GetAgreementPreview getPreview;
  String? _id;
  PreviewBloc(this.getPreview) : super(const PreviewState()) {
    on<PreviewStarted>(_onStarted);
    on<PreviewRetried>(_onRetried);
  }

  Future<void> _onStarted(PreviewStarted event, Emitter<PreviewState> emit) async {
    _id = event.agreementId;
    emit(state.copyWith(loading: true, error: ''));
    try {
      final data = await getPreview(event.agreementId);
      emit(state.copyWith(loading: false, data: data));
    } catch (e) {
      emit(state.copyWith(loading: false, error: e.toString()));
    }
  }

  Future<void> _onRetried(PreviewRetried event, Emitter<PreviewState> emit) async {
    final id = _id;
    if (id == null) return;
    emit(state.copyWith(loading: true, error: ''));
    try {
      final data = await getPreview(id);
      emit(state.copyWith(loading: false, data: data));
    } catch (e) {
      emit(state.copyWith(loading: false, error: e.toString()));
    }
  }
}
