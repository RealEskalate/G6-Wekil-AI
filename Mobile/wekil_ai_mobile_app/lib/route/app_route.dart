import 'package:go_router/go_router.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../features/auth/presentation/pages/otp_verification_page.dart';
import '../features/auth/presentation/pages/reset_password_page.dart';
import '../features/auth/presentation/pages/reset_password_request_page.dart';
import '../features/auth/presentation/pages/sign_in_page.dart';
import '../features/auth/presentation/pages/sign_up_page.dart';
import '../features/settings/presentation/bloc/setting_bloc.dart';
import '../features/settings/presentation/pages/edit_profile_page.dart';
import '../features/settings/presentation/pages/profile_preview_page.dart';
import '../features/settings/presentation/pages/settings_page.dart';
import '../features/settings/presentation/pages/signature_page.dart';
import '../features/splash/presentation/pages/splash_video_page.dart';
import '../injection_container.dart' as di;
import '../app.dart';
// Contracts flow imports
import '../features/contacts/presentations/pages/create_start_page.dart';
import '../features/contacts/presentations/pages/step1.dart';
import '../features/contacts/presentations/pages/step2.dart';
import '../features/contacts/presentations/pages/step3.dart';
import '../features/contacts/presentations/pages/step4.dart';
import '../features/contacts/presentations/pages/step5.dart';
import '../features/contacts/presentations/pages/step6.dart';
import '../features/contacts/presentations/pages/step7.dart';
import '../features/contacts/data/models/contact_data.dart';
import '../features/contacts/domain/entities/contract_type.dart';

final List<GoRoute> appRoutes = [
	GoRoute(
		path: '/splash',
		builder: (context, state) => const SplashVideoPage(),
	),
	GoRoute(
		path: '/sign-in',
		builder: (context, state) => const SignInPage(),
	),
	GoRoute(
		path: '/sign-up',
		builder: (context, state) => const SignUpPage(),
	),
	GoRoute(
		path: '/otp-verification',
		builder: (context, state) {
			final email = state.extra as String? ?? '';
			return OtpVerificationPage(email: email);
		},
	),
	GoRoute(
		path: '/settings',
		builder: (context, state) => const SettingsPage(),
	),
	GoRoute(
		path: '/profile-preview',
		builder: (context, state) {
			final extra = state.extra;
			if (extra is SettingBloc) {
				return BlocProvider<SettingBloc>.value(
					value: extra,
					child: const ProfilePreviewPage(),
				);
			}
			return BlocProvider<SettingBloc>(
				create: (_) => di.sl<SettingBloc>()..add(GetProfileEvent()),
				child: const ProfilePreviewPage(),
			);
		},
	),
	GoRoute(
		path: '/edit-profile',
		builder: (context, state) {
			final extra = state.extra;
			if (extra is SettingBloc) {
				return BlocProvider<SettingBloc>.value(
					value: extra,
					child: const EditProfilePage(),
				);
			}
			return BlocProvider<SettingBloc>(
				create: (_) => di.sl<SettingBloc>()..add(GetProfileEvent()),
				child: const EditProfilePage(),
			);
		},
	),
	GoRoute(
		path: '/signature',
		builder: (context, state) {
			final extra = state.extra;
			if (extra is SettingBloc) {
				return BlocProvider<SettingBloc>.value(
					value: extra,
					child: const SignaturePage(),
				);
			}
			return BlocProvider<SettingBloc>(
				create: (_) => di.sl<SettingBloc>()..add(GetProfileEvent()),
				child: const SignaturePage(),
			);
		},
	),
	GoRoute(
		path: '/reset-password',
		builder: (context, state) {
			final email = state.extra as String? ?? '';
			return ResetPasswordPage(email: email);
		},
	),
	GoRoute(
		path: '/reset-password-request',
		builder: (context, state) => const ResetPasswordRequestPage(),
	),

	GoRoute(
		path: '/dashboard',
		builder: (context, state) => const MainScreen(),
	),

	// Contracts flow
	GoRoute(
		path: '/contracts/start',
		builder: (context, state) => const CreateContractScreen(),
	),
	GoRoute(
		path: '/contracts/types',
		builder: (context, state) => const ContractsTypesPages(),
	),
	GoRoute(
		path: '/contracts/step2',
		builder: (context, state) {
			final extra = state.extra as Map?;
			final type = extra?['contractType'] as ContractType?;
			return CreateStep1(contractType: type ?? ContractType.serviceAgreement);
		},
	),
	GoRoute(
		path: '/contracts/step3',
		builder: (context, state) {
			final extra = state.extra as Map?;
			final intake = extra?['intake'] as IntakeModel?;
			final type = extra?['contractType'] as ContractType?;
			return CreateStep2(intake: intake!, contractType: type ?? ContractType.serviceAgreement);
		},
	),
	GoRoute(
		path: '/contracts/step4',
		builder: (context, state) {
			final extra = state.extra as Map?;
			final intakeModel = extra?['intakeModel'] as IntakeModel?;
			final type = extra?['contractType'] as ContractType?;
			return CreateStep3(intake: intakeModel!, contractType: type ?? ContractType.serviceAgreement);
		},
	),
	GoRoute(
		path: '/contracts/step5',
		builder: (context, state) {
			final extra = state.extra as Map?;
			final intakeModel = extra?['intakeModel'] as IntakeModel?;
			final type = extra?['contractType'] as ContractType?;
			return CreateStep4(intakeModel: intakeModel!, contractType: type ?? ContractType.serviceAgreement);
		},
	),
	GoRoute(
		path: '/contracts/step6',
		builder: (context, state) {
			final extra = state.extra as Map?;
			final intakeModel = extra?['intakeModel'] as IntakeModel?;
			return CreateStep5(intakeModel: intakeModel!, draftContractPdfUrl: extra?['draftContractPdfUrl'] as String? ?? '');
		},
	),
	GoRoute(
		path: '/contracts/pdf',
		builder: (context, state) {
			final extra = state.extra as Map?;
			final intakeModel = extra?['intakeModel'] as IntakeModel?;
			return PdfChangerPage(intakeModel: intakeModel!);
		},
	),
];
