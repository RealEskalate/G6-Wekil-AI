import 'package:mobile/features/auth/presentation/pages/otp_verification_page.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/features/auth/presentation/pages/sign_in_page.dart';
import 'package:mobile/features/auth/presentation/pages/reset_password_page.dart';
import 'package:mobile/features/auth/presentation/pages/reset_password_request_page.dart';
import 'package:mobile/features/settings/presentation/pages/settings_page.dart';
import 'package:mobile/features/settings/presentation/pages/profile_preview_page.dart';
import 'package:mobile/features/settings/presentation/pages/edit_profile_page.dart';
import 'package:mobile/features/settings/presentation/pages/signature_page.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/features/settings/presentation/bloc/setting_bloc.dart';
import 'package:mobile/injection_container.dart' as di;
import 'package:mobile/features/splash/presentation/pages/splash_video_page.dart';

import '../features/auth/presentation/pages/sign_up_page.dart';

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
];
