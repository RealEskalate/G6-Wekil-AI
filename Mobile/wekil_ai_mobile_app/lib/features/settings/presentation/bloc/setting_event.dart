
part of 'setting_bloc.dart';

@immutable
sealed class SettingEvent {}

class GetProfileEvent extends SettingEvent {}

class UpdateProfileEvent extends SettingEvent {
	final String id;
	final String email;
	final String firstName;
	final String lastName;
	final String? middleName;
	final String telephone;
	final String? address;
	final String accountType;
	final bool isVerified;
	final String? imagePath;
	final String? signaturePath;

	UpdateProfileEvent({
		required this.id,
		required this.email,
		required this.firstName,
		required this.lastName,
		this.middleName,
		required this.telephone,
		this.address,
		required this.accountType,
		required this.isVerified,
		this.imagePath,
		this.signaturePath,
	});
}

class LogoutEvent extends SettingEvent {}

class ChangePasswordRequested extends SettingEvent {
	final String oldPassword;
	final String newPassword;
	ChangePasswordRequested({required this.oldPassword, required this.newPassword});
}
