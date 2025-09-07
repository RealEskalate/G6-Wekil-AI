import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:wekil_ai_mobile_app/features/widget/bottom_nav.dart';
// import 'package:mobile/injection_container.dart' as di;
import '../../../../injection_container.dart' as di;
import '../../../widget/nav_bar.dart';
import '../../../../core/theme/app_colors.dart';
import '../../domain/entities/user_profile.dart';
import '../bloc/setting_bloc.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocProvider<SettingBloc>(
      create: (_) => di.sl<SettingBloc>()..add(GetProfileEvent()),
      child: BlocListener<SettingBloc, SettingState>(
        listener: (context, state) {
          if (state is SettingLoggedOut) {
            // Navigate to login page using GoRouter
            GoRouter.of(context).go('/sign-in');
          }
        },
        child: Builder(
          builder: (context) => Scaffold(
            backgroundColor: AppColors.background,
            appBar: NavBar(),
            body: BlocBuilder<SettingBloc, SettingState>(
              builder: (context, state) {
                if (state is SettingLoading) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (state is SettingError) {
                  return Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.error_outline, color: Colors.redAccent),
                        const SizedBox(height: 8),
                        Text(
                          state.message,
                          textAlign: TextAlign.center,
                          style: const TextStyle(color: Colors.redAccent),
                        ),
                        const SizedBox(height: 12),
                        ElevatedButton(
                          onPressed: () => context.read<SettingBloc>().add(GetProfileEvent()),
                          style: ElevatedButton.styleFrom(),
                          child: const Text('Retry'),
                        )
                      ],
                    ),
                  );
                }
                UserProfile? profile;
                if (state is SettingLoaded) {
                  profile = state.profile;
                }
                return RefreshIndicator(
                  onRefresh: () async {
                    context.read<SettingBloc>().add(GetProfileEvent());
                  },
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                      SizedBox(
                        width: double.infinity,
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            Align(
                              alignment: Alignment.centerLeft,
                              child: IconButton(
                                icon: const Icon(Icons.arrow_back_ios_new),
                                color: AppColors.textDark,
                                tooltip: 'Back',
                                onPressed: () => GoRouter.of(context).go('/dashboard', extra: 0),
                              ),
                            ),
                            Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const SizedBox(height: 8),
                                Container(
                                  decoration: BoxDecoration(
                                    color: AppColors.textLight,
                                    shape: BoxShape.circle,
                                    boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 8)],
                                  ),
                                  padding: const EdgeInsets.all(16),
                                  child: const Icon(Icons.settings, size: 40, color: AppColors.primary),
                                ),
                                const SizedBox(height: 8),
            Text('Settings', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.textDark)),
                                const SizedBox(height: 16),
                              ],
                            ),
                          ],
                        ),
                      ),
                      _ProfileSection(profile: profile),
                      const SizedBox(height: 16),
                      _PreferencesSection(),
                      const SizedBox(height: 16),
                      _PrivacySection(),
                      const SizedBox(height: 16),
                      _SupportSection(),
                      const SizedBox(height: 24),
                      _SignOutButton(),
                      ],
                    ),
                  ),
                );
              },
            ),
            bottomNavigationBar: BottomNav(
              currentIndex: 0,
              onItemSelected: (index) {
                switch (index) {
                  case 0:
                    GoRouter.of(context).go('/dashboard', extra: 0);
                    break;
                  case 1:
                    GoRouter.of(context).go('/dashboard', extra: 1);
                    break;
                  case 2:
                    GoRouter.of(context).go('/dashboard', extra: 2);
                    break;
                }
              },
              onCreatePressed: () {
                GoRouter.of(context).go('/dashboard', extra: 1);
              },
            ),
          ),
        ),
      ),
    );
  }
}

class _ProfileSection extends StatelessWidget {
  final UserProfile? profile;
  const _ProfileSection({this.profile});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.person, color: AppColors.primary),
                const SizedBox(width: 8),
                Text('Profile', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.textDark)),
                const Spacer(),
  IconButton(
      icon: const Icon(Icons.edit, color: AppColors.primary),
      onPressed: () {
    final bloc = context.read<SettingBloc>();
    GoRouter.of(context).push('/profile-preview', extra: bloc);
      },
    ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Builder(builder: (_) {
                  final url = profile?.profileImage;
                  if (url != null && url.startsWith('http')) {
                    return CircleAvatar(
                      radius: 24,
                      backgroundColor: AppColors.primary,
                      backgroundImage: NetworkImage(url),
                    );
                  }
                  String initials = 'DU';
                  if (profile != null) {
                    final fn = profile!.firstName;
                    final ln = profile!.lastName;
                    final a = fn.isNotEmpty ? fn[0] : '';
                    final b = ln.isNotEmpty ? ln[0] : '';
                    final comb = (a + b).trim();
                    if (comb.isNotEmpty) initials = comb.toUpperCase();
                  }
                  return CircleAvatar(
                    radius: 24,
                    backgroundColor: AppColors.primary,
                    child: Text(
                      initials,
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textLight),
                    ),
                  );
                }),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        profile != null
                          ? '${profile!.firstName.isNotEmpty ? profile!.firstName : '-'}'
                            ' ${profile!.middleName != null && profile!.middleName!.isNotEmpty ? profile!.middleName : ''}'
                            ' ${profile!.lastName.isNotEmpty ? profile!.lastName : '-'}'
                          : '-',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.textDark),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        profile != null && profile!.email.isNotEmpty ? profile!.email : '-',
                        style: const TextStyle(color: AppColors.textDark),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          const Icon(Icons.phone, size: 16, color: AppColors.primary),
                          const SizedBox(width: 4),
                          Text(profile != null && profile!.telephone.isNotEmpty ? profile!.telephone : '-', style: const TextStyle(color: AppColors.textDark)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      
                      if (profile?.address != null)
                        Text('Address: ${profile!.address}', style: const TextStyle(color: AppColors.textDark)),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _PreferencesSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.language, color: AppColors.primary),
                const SizedBox(width: 8),
                Text('Preferences', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.textDark)),
              ],
            ),
            const SizedBox(height: 12),
            _SwitchTile(title: 'Language', subtitle: 'English', value: false, icon: Icons.language),
            _SwitchTile(title: 'Dark Mode', subtitle: 'Easy on the eyes dark interface', value: false, icon: Icons.dark_mode),
            _SwitchTile(title: 'Enable Notifications', subtitle: 'Receive notifications about your contracts', value: false, icon: Icons.notifications),
          ],
        ),
      ),
    );
  }
}

class _SwitchTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final bool value;
  final IconData icon;
  const _SwitchTile({required this.title, required this.subtitle, required this.value, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
    Icon(icon, color: AppColors.primary),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
      Text(title, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.textDark)),
      Text(subtitle, style: const TextStyle(fontSize: 12, color: Colors.grey)),
            ],
          ),
        ),
        Switch(
          value: value,
          activeColor: AppColors.accent,
          onChanged: (v) {},
        ),
      ],
    );
  }
}

class _PrivacySection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.security, color: AppColors.primary),
                const SizedBox(width: 8),
                Text('Privacy & Security', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.textDark)),
              ],
            ),
            const SizedBox(height: 12),
            const Text('Data Storage', style: TextStyle(fontWeight: FontWeight.w500, color: AppColors.textDark)),
            const Text('All contracts are stored locally on your device', style: TextStyle(color: Colors.grey)),
            const SizedBox(height: 8),
            Row(
              children: const [
                Icon(Icons.verified_user, color: Colors.green, size: 18),
                SizedBox(width: 4),
                Text('Your privacy is protected', style: TextStyle(color: Colors.green)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _SupportSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.support_agent, color: AppColors.primary),
                const SizedBox(width: 8),
                Text('Support', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.textDark)),
              ],
            ),
            const SizedBox(height: 12),
            ListTile(
              leading: const Icon(Icons.help_outline, color: AppColors.primary),
              title: const Text('Help & Support', style: TextStyle(color: AppColors.textDark)),
              onTap: () {},
              contentPadding: EdgeInsets.zero,
              minLeadingWidth: 0,
            ),
            ListTile(
              leading: const Icon(Icons.info_outline, color: AppColors.primary),
              title: const Text('About Wekil AI', style: TextStyle(color: AppColors.textDark)),
              onTap: () {},
              contentPadding: EdgeInsets.zero,
              minLeadingWidth: 0,
            ),
            const SizedBox(height: 8),
            const Center(
              child: Text('Version 1.0', style: TextStyle(fontSize: 12, color: Colors.grey)),
            ),
          ],
        ),
      ),
    );
  }
}

class _SignOutButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
        onPressed: () {
          context.read<SettingBloc>().add(LogoutEvent());
        },
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Icon(Icons.exit_to_app, color: Colors.white),
            SizedBox(width: 8),
            Text('Sign Out', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}

// Removed unused _BottomNavBar widget
