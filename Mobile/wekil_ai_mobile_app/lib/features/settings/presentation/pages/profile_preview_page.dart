import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../domain/entities/user_profile.dart';
import '../bloc/setting_bloc.dart';
import 'package:dotted_border/dotted_border.dart';

class ProfilePreviewPage extends StatefulWidget {
  const ProfilePreviewPage({super.key});

  @override
  State<ProfilePreviewPage> createState() => _ProfilePreviewPageState();
}

class _ProfilePreviewPageState extends State<ProfilePreviewPage> {
  final _formKey = GlobalKey<FormState>();
  final _oldCtrl = TextEditingController();
  final _newCtrl = TextEditingController();
  final _confirmCtrl = TextEditingController();
  bool _obOld = true;
  bool _obNew = true;
  bool _obConfirm = true;
  bool _isRefreshing = false;

  @override
  void initState() {
    super.initState();
    // Auto-refresh profile when entering the page
    // Safe because a SettingBloc provider wraps this page via routing
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final bloc = context.read<SettingBloc?>();
      bloc?.add(GetProfileEvent());
    });
  }

  Future<void> _refresh() async {
    if (!mounted) return;
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
      // ignore timeout to avoid hanging the indicator
    } finally {
      if (!finished) {
        try { await sub.cancel(); } catch (_) {}
      }
      if (mounted) setState(() => _isRefreshing = false);
    }
  }

  @override
  void dispose() {
    _oldCtrl.dispose();
    _newCtrl.dispose();
    _confirmCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F9FB),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF1A2B3C)),
          onPressed: () => context.pop(),
        ),
        centerTitle: true,
        title: const Text(
          'Edit Profile',
          style: TextStyle(color: Color(0xFF1A2B3C), fontWeight: FontWeight.bold),
        ),
      ),
      body: BlocConsumer<SettingBloc, SettingState>(
        listener: (context, state) {
          if (state is ChangePasswordSuccess) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message), backgroundColor: Colors.green),
            );
            _oldCtrl.clear();
            _newCtrl.clear();
            _confirmCtrl.clear();
          }
          if (state is ChangePasswordFailure) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message), backgroundColor: Colors.redAccent),
            );
          }
        },
        builder: (context, state) {
          return RefreshIndicator(
            color: const Color(0xFF1AC9A2),
            onRefresh: _refresh,
            child: () {
              if (state is SettingLoading || state is SettingInitial) {
                if (_isRefreshing) {
                  // During pull-to-refresh, avoid a second content spinner
                  return ListView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    children: const [SizedBox(height: 200)],
                  );
                }
                // Initial or route-triggered load
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
                    )
                  ],
                );
              }

              final UserProfile? profile = state is SettingLoaded ? state.profile : null;
              return SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                  Card(
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Text(
                                'Edit Profile',
                                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                              ),
                              const Spacer(),
                              IconButton(
                                tooltip: 'Edit profile',
                                onPressed: () async {
                                  final bloc = context.read<SettingBloc>();
                                  final ok = await GoRouter.of(context)
                                      .push<bool>('/edit-profile', extra: bloc);
                                  if (ok == true) {
                                    if (context.mounted) {
                                      context.read<SettingBloc>().add(GetProfileEvent());
                                    }
                                  }
                                },
                                icon: const Icon(Icons.edit),
                              )
                            ],
                          ),
                          const SizedBox(height: 12),
                          Center(
                            child: Column(
                              children: [
                                Builder(builder: (_) {
                                  final url = profile?.profileImage;
                                  if (url != null && url.startsWith('http')) {
                                    return CircleAvatar(
                                      radius: 36,
                                      backgroundColor: const Color(0xFF0A2540),
                                      backgroundImage: NetworkImage(url),
                                    );
                                  }
                                  return CircleAvatar(
                                    radius: 36,
                                    backgroundColor: const Color(0xFF0A2540),
                                    child: Text(
                                      () {
                                        String initials = 'U';
                                        if (profile != null) {
                                          final fn = profile.firstName;
                                          final ln = profile.lastName;
                                          final a = fn.isNotEmpty ? fn[0] : '';
                                          final b = ln.isNotEmpty ? ln[0] : '';
                                          final comb = (a + b).trim();
                                          if (comb.isNotEmpty) initials = comb.toUpperCase();
                                        }
                                        return initials;
                                      }(),
                                      style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                                    ),
                                  );
                                }),
                                const SizedBox(height: 8),
                                const Text('Profile Picture', style: TextStyle(color: Colors.black54)),
                              ],
                            ),
                          ),
                          const SizedBox(height: 16),
                          _labelValue('First Name', profile?.firstName ?? ''),
                          _labelValue('Middle Name', profile?.middleName ?? 'Doe'),
                          _labelValue('Last Name', profile?.lastName ?? ''),
                          _labelValue('Phone Number', profile?.telephone ?? ''),
                          _labelValue('Location', profile?.address ?? 'City, Region'),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Card(
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    color: Colors.transparent,
                    child: _SignatureTile(
                      profileSignatureUrl: (state is SettingLoaded) ? state.profile.signature : null,
                      onEdit: () async {
                        final bloc = context.read<SettingBloc>();
                        final ok = await GoRouter.of(context).push<bool>(
                          '/signature',
                          extra: bloc,
                        );
                        if (ok == true) {
                          if (context.mounted) context.read<SettingBloc>().add(GetProfileEvent());
                        }
                      },
                    ),
                  ),
                  const SizedBox(height: 12),
                  Card(
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Row(
                            children: [
                              Icon(Icons.lock_outline),
                              SizedBox(width: 8),
                              Text('Change Password', style: TextStyle(fontWeight: FontWeight.bold)),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Form(
                            key: _formKey,
                            child: Column(
                              children: [
                                _passwordField(
                                  label: 'Current Password',
                                  controller: _oldCtrl,
                                  obscure: _obOld,
                                  onToggle: () => setState(() => _obOld = !_obOld),
                                ),
                                const SizedBox(height: 12),
                                _passwordField(
                                  label: 'New Password',
                                  controller: _newCtrl,
                                  obscure: _obNew,
                                  onToggle: () => setState(() => _obNew = !_obNew),
                                  helper: 'Password must be at least 8 characters long',
                                ),
                                const SizedBox(height: 12),
                                _passwordField(
                                  label: 'Confirm New Password',
                                  controller: _confirmCtrl,
                                  obscure: _obConfirm,
                                  onToggle: () => setState(() => _obConfirm = !_obConfirm),
                                  validator: (v) {
                                    if (v == null || v.isEmpty) return 'Please confirm your new password';
                                    if (v != _newCtrl.text) return 'Passwords do not match';
                                    return null;
                                  },
                                ),
                                const SizedBox(height: 16),
                                Row(
                                  children: [
                                    Expanded(
                                      child: ElevatedButton.icon(
                                        onPressed: state is ChangePasswordLoading
                                            ? null
                                            : () {
                                                if (_formKey.currentState?.validate() ?? false) {
                                                  if (_newCtrl.text.trim().length < 8) {
                                                    ScaffoldMessenger.of(context).showSnackBar(
                                                      const SnackBar(content: Text('New password must be at least 8 characters')),
                                                    );
                                                    return;
                                                  }
                                                  context.read<SettingBloc>().add(
                                                        ChangePasswordRequested(
                                                          oldPassword: _oldCtrl.text.trim(),
                                                          newPassword: _newCtrl.text.trim(),
                                                        ),
                                                      );
                                                }
                                              },
                                        icon: state is ChangePasswordLoading
                                            ? const SizedBox(
                                                width: 16,
                                                height: 16,
                                                child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                              )
                                            : const Icon(Icons.lock_reset),
                                        label: const Text('Change Password'),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: const Color(0xFF0A2540),
                                          padding: const EdgeInsets.symmetric(vertical: 14),
                                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: OutlinedButton(
                                        onPressed: state is ChangePasswordLoading
                                            ? null
                                            : () {
                                                _oldCtrl.clear();
                                                _newCtrl.clear();
                                                _confirmCtrl.clear();
                                              },
                                        child: const Text('Cancel'),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  ],
                ),
              );
            }(),
          );
        },
      ),
    );
  }

  Widget _labelValue(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: Colors.black54)),
          const SizedBox(height: 4),
          Text(value.isNotEmpty ? value : '-',
              style: const TextStyle(fontSize: 14, color: Colors.black87)),
        ],
      ),
    );
  }
}

Widget _passwordField({
  required String label,
  String? helper,
  required TextEditingController controller,
  required bool obscure,
  required VoidCallback onToggle,
  String? Function(String?)? validator,
}) {
  return TextFormField(
    controller: controller,
    obscureText: obscure,
    validator: validator ?? (v) => (v == null || v.isEmpty) ? 'Required' : null,
    decoration: InputDecoration(
      labelText: label,
      helperText: helper,
      suffixIcon: IconButton(
        icon: Icon(obscure ? Icons.visibility : Icons.visibility_off),
        onPressed: onToggle,
      ),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
    ),
  );
}

class _SignatureTile extends StatelessWidget {
  final String? profileSignatureUrl;
  final VoidCallback? onEdit;
  const _SignatureTile({this.profileSignatureUrl, this.onEdit});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text('Digital Signature', style: TextStyle(fontWeight: FontWeight.bold)),
              const Spacer(),
              IconButton(
                tooltip: 'Edit signature',
                onPressed: onEdit,
                icon: const Icon(Icons.edit, size: 18),
              ),
            ],
          ),
          const SizedBox(height: 8),
          DottedBorder(
            color: const Color(0xFF8AD7CE),
            strokeWidth: 1.2,
            dashPattern: const [6, 4],
            borderType: BorderType.RRect,
            radius: const Radius.circular(10),
            child: Container(
              width: double.infinity,
              height: 96,
              decoration: BoxDecoration(
                color: const Color(0xFFF1FAF9),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Center(
                child: profileSignatureUrl != null && profileSignatureUrl!.startsWith('http')
                    ? Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Image.network(
                          profileSignatureUrl!,
                          height: 80,
                          fit: BoxFit.contain,
                          errorBuilder: (_, __, ___) => _PlaceholderRow(),
                        ),
                      )
                    : const _PlaceholderRow(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _PlaceholderRow extends StatelessWidget {
  const _PlaceholderRow();
  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: const [
        Icon(Icons.gesture, color: Colors.black45),
        SizedBox(width: 8),
        Text('Enter Your Signature', style: TextStyle(color: Colors.black54)),
      ],
    );
  }
}
