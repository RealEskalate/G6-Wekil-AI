import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
// import 'package:mobile/injection_container.dart' as di;
import '../../../../injection_container.dart' as di;
import '../../domain/entities/user_profile.dart';
import '../bloc/setting_bloc.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({Key? key}) : super(key: key);

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool _isRefreshing = false;
  Future<void> _onRefresh() async {
    final bloc = context.read<SettingBloc>();
    final completer = Completer<void>();
    late final StreamSubscription sub;
    var finished = false;
    sub = bloc.stream.listen((state) {
      if (state is SettingLoaded || state is SettingError) {
        if (!completer.isCompleted) completer.complete();
        finished = true;
        sub.cancel();
      }
    });
    setState(() => _isRefreshing = true);
    bloc.add(GetProfileEvent());
    try {
      await completer.future.timeout(const Duration(seconds: 10));
    } catch (_) {
      // ignore timeout, indicator will stop below
    } finally {
      if (!finished) {
        try { await sub.cancel(); } catch (_) {}
      }
      if (mounted) setState(() => _isRefreshing = false);
    }
  }

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
          if (state is SettingUpdated) {
            // Immediately refetch to reflect latest server values
            context.read<SettingBloc>().add(GetProfileEvent());
          }
        },
        child: Builder(
          builder: (context) => Scaffold(
            backgroundColor: const Color(0xFFF7F9FB),
            appBar: AppBar(
              backgroundColor: Colors.white,
              elevation: 0,
              title: const Text('Settings', style: TextStyle(color: Color(0xFF1A2B3C), fontWeight: FontWeight.bold)),
              centerTitle: true,
              leading: IconButton(
                icon: const Icon(Icons.menu, color: Color(0xFF1A2B3C)),
                onPressed: () {},
              ),
              actions: [
                IconButton(
                  icon: const Icon(Icons.language, color: Color(0xFF1A2B3C)),
                  onPressed: () {},
                ),
              ],
            ),
      body: BlocBuilder<SettingBloc, SettingState>(
        builder: (context, state) {
          return RefreshIndicator(
            color: const Color(0xFF1AC9A2),
            onRefresh: _onRefresh,
            child: () {
              if (state is SettingLoading || state is SettingInitial) {
                if (_isRefreshing) {
                  // During pull-to-refresh, avoid showing a second spinner
                  return ListView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    children: const [SizedBox(height: 200)],
                  );
                }
                // Initial load or route-triggered load
                return ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  children: const [
                    SizedBox(height: 200),
                    Center(child: CircularProgressIndicator()),
                    SizedBox(height: 200),
                  ],
                );
              }
              if (state is SettingError) {
                return ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
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
                      child: const Text('Retry'),
                    ),
                  ],
                );
              }
              // Loaded content
              final profile = (state is SettingLoaded) ? state.profile : null;
              return SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Center(
                      child: Column(
                        children: [
                          const SizedBox(height: 8),
                          Container(
                            decoration: BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                              boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 8)],
                            ),
                            padding: const EdgeInsets.all(16),
                            child: const Icon(Icons.settings, size: 40, color: Color(0xFF1A2B3C)),
                          ),
                          const SizedBox(height: 8),
                          const Text('Settings', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF1A2B3C))),
                          const SizedBox(height: 16),
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
              );
            }(),
          );
        },
      ),
            bottomNavigationBar: _BottomNavBar(),
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
                const Icon(Icons.person, color: Color(0xFF1A2B3C)),
                const SizedBox(width: 8),
                const Text('Profile', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const Spacer(),
  IconButton(
      icon: const Icon(Icons.edit, color: Color(0xFF1A2B3C)),
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
                      backgroundColor: const Color(0xFF1A2B3C),
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
                    backgroundColor: const Color(0xFF1A2B3C),
                    child: Text(
                      initials,
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
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
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF1A2B3C)),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        profile != null && profile!.email.isNotEmpty ? profile!.email : '-',
                        style: const TextStyle(color: Color(0xFF1A2B3C)),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          const Icon(Icons.phone, size: 16, color: Color(0xFF1A2B3C)),
                          const SizedBox(width: 4),
                          Text(profile != null && profile!.telephone.isNotEmpty ? profile!.telephone : '-', style: const TextStyle(color: Color(0xFF1A2B3C))),
                        ],
                      ),
                      const SizedBox(height: 8),
                      
                      if (profile?.address != null)
                        Text('Address: ${profile!.address}', style: const TextStyle(color: Color(0xFF1A2B3C))),
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
                const Icon(Icons.language, color: Color(0xFF1A2B3C)),
                const SizedBox(width: 8),
                const Text('Preferences', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
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
        Icon(icon, color: const Color(0xFF1A2B3C)),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
              Text(subtitle, style: const TextStyle(fontSize: 12, color: Colors.grey)),
            ],
          ),
        ),
        Switch(
          value: value,
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
                const Icon(Icons.security, color: Color(0xFF1A2B3C)),
                const SizedBox(width: 8),
                const Text('Privacy & Security', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              ],
            ),
            const SizedBox(height: 12),
            const Text('Data Storage', style: TextStyle(fontWeight: FontWeight.w500)),
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
                const Icon(Icons.support_agent, color: Color(0xFF1A2B3C)),
                const SizedBox(width: 8),
                const Text('Support', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              ],
            ),
            const SizedBox(height: 12),
            ListTile(
              leading: const Icon(Icons.help_outline, color: Color(0xFF1A2B3C)),
              title: const Text('Help & Support', style: TextStyle(color: Color(0xFF1A2B3C))),
              onTap: () {},
              contentPadding: EdgeInsets.zero,
              minLeadingWidth: 0,
            ),
            ListTile(
              leading: const Icon(Icons.info_outline, color: Color(0xFF1A2B3C)),
              title: const Text('About Wekil AI', style: TextStyle(color: Color(0xFF1A2B3C))),
              onTap: () {},
              contentPadding: EdgeInsets.zero,
              minLeadingWidth: 0,
            ),
            const SizedBox(height: 8),
            Center(
              child: const Text('Version 1.0', style: TextStyle(fontSize: 12, color: Colors.grey)),
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
          backgroundColor: const Color(0xFFF44336),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          padding: const EdgeInsets.symmetric(vertical: 16),
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

class _BottomNavBar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      backgroundColor: Colors.white,
      selectedItemColor: const Color(0xFF1AC9A2),
      unselectedItemColor: const Color(0xFF1A2B3C),
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Dashboard'),
        BottomNavigationBarItem(icon: Icon(Icons.add_circle, color: Color(0xFF1AC9A2)), label: 'Create Contract'),
        BottomNavigationBarItem(icon: Icon(Icons.assignment), label: 'My Contracts'),
      ],
      currentIndex: 1,
      onTap: (i) {},
    );
  }
}
