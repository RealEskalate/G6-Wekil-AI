part of 'preview_bloc.dart';

@immutable
sealed class PreviewEvent {}

final class PreviewStarted extends PreviewEvent {
  final String agreementId;
  PreviewStarted(this.agreementId);
}

final class PreviewRetried extends PreviewEvent {}
