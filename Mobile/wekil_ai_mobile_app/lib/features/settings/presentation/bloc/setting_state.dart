
part of 'setting_bloc.dart';

@immutable
sealed class SettingState {}

final class SettingInitial extends SettingState {}
final class SettingLoading extends SettingState {}
final class SettingLoaded extends SettingState {
	final dynamic profile; // Replace with UserProfile when available
	SettingLoaded(this.profile);
}
final class SettingUpdated extends SettingState {
	final String message;
	SettingUpdated(this.message);
}
final class SettingLoggedOut extends SettingState {}
final class SettingError extends SettingState {
	final String message;
	SettingError(this.message);
}

final class ChangePasswordLoading extends SettingState {}
final class ChangePasswordSuccess extends SettingState {
	final String message;
	ChangePasswordSuccess(this.message);
}
final class ChangePasswordFailure extends SettingState {
	final String message;
	ChangePasswordFailure(this.message);
}
