import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import '../../domain/usecase/get_profile_usecase.dart';
import '../../domain/usecase/update_profile_usecase.dart';
import '../../domain/usecase/logout_usecase.dart';
import '../../domain/usecase/change_password_usecase.dart';
import '../../domain/entities/user_profile.dart';
import '../../../../core/error/failure.dart';

part 'setting_event.dart';
part 'setting_state.dart';

class SettingBloc extends Bloc<SettingEvent, SettingState> {
  final GetProfileUseCase getProfileUseCase;
  final UpdateProfileUseCase updateProfileUseCase;
  final LogoutUseCase logoutUseCase;
  final ChangePasswordUseCase changePasswordUseCase;

  SettingBloc({
    required this.getProfileUseCase,
    required this.updateProfileUseCase,
    required this.logoutUseCase,
    required this.changePasswordUseCase,
  }) : super(SettingInitial()) {
    on<GetProfileEvent>(_onGetProfile);
    on<UpdateProfileEvent>(_onUpdateProfile);
    on<LogoutEvent>(_onLogout);
    on<ChangePasswordRequested>(_onChangePassword);
  }

  Future<void> _onGetProfile(GetProfileEvent event, Emitter<SettingState> emit) async {
    emit(SettingLoading());
    final result = await getProfileUseCase();
    result.fold(
      (failure) => emit(SettingError(_mapFailureToMessage(failure))),
      (profile) => emit(SettingLoaded(profile)),
    );
  }

  Future<void> _onUpdateProfile(UpdateProfileEvent event, Emitter<SettingState> emit) async {
    emit(SettingLoading());
    final profile = UserProfile(
      id: event.id,
      email: event.email,
      firstName: event.firstName,
      lastName: event.lastName,
      middleName: event.middleName,
      telephone: event.telephone,
      address: event.address,
      accountType: event.accountType,
      isVerified: event.isVerified,
      profileImage: event.imagePath,
      signature: event.signaturePath,
    );
    final result = await updateProfileUseCase(profile);
    result.fold(
      (failure) => emit(SettingError(_mapFailureToMessage(failure))),
      (updateResult) => emit(SettingUpdated(updateResult.message)),
    );
  }

  Future<void> _onLogout(LogoutEvent event, Emitter<SettingState> emit) async {
    emit(SettingLoading());
    final result = await logoutUseCase();
    result.fold(
      (failure) => emit(SettingError(_mapFailureToMessage(failure))),
  (_) => emit(SettingLoggedOut()),
    );
  }

  Future<void> _onChangePassword(ChangePasswordRequested event, Emitter<SettingState> emit) async {
    emit(ChangePasswordLoading());
    final res = await changePasswordUseCase(oldPassword: event.oldPassword, newPassword: event.newPassword);
    res.fold(
      (failure) => emit(ChangePasswordFailure(_mapFailureToMessage(failure))),
      (ok) => emit(ChangePasswordSuccess(ok.message)),
    );
  }

  String _mapFailureToMessage(Failure failure) {
  if (failure is ServerFailure) return failure.message;
  if (failure is NetworkFailure) return failure.message;
  if (failure is CacheFailure) return 'Not authenticated. Please sign in again.';
  return 'Unexpected error';
  }
}
