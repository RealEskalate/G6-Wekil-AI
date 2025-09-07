import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:signature/signature.dart';
// import 'package:mobile/injection_container.dart' as di;
import '../../../../core/services/cloudinary_uploader.dart';
import '../../../../injection_container.dart' as di;
import '../../../settings/presentation/bloc/setting_bloc.dart';
// import 'package:mobile/core/services/cloudinary_uploader.dart';
import 'package:wekil_ai_mobile_app/features/widget/nav_bar.dart';
import 'package:wekil_ai_mobile_app/features/widget/bottom_nav.dart';
import '../../../../core/theme/app_colors.dart';

class SignaturePage extends StatefulWidget {
  const SignaturePage({super.key});

  @override
  State<SignaturePage> createState() => _SignaturePageState();
}

class _SignaturePageState extends State<SignaturePage> {
  late final SignatureController _controller;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _controller = SignatureController(
      penStrokeWidth: 3,
      penColor: const Color(0xFF0A2540),
      exportBackgroundColor: Colors.transparent,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (_controller.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please draw your signature before saving')), 
      );
      return;
    }
    setState(() => _saving = true);
    try {
      final bytes = await _controller.toPngBytes();
      if (bytes == null) throw Exception('Failed to export signature');
      final settingState = context.read<SettingBloc>().state;
      if (settingState is! SettingLoaded) throw Exception('Profile not loaded');
      final profile = settingState.profile;

      final uploader = di.sl<CloudinaryUploader>();
      final res = await uploader.uploadBytes(
        Uint8List.fromList(bytes),
        filename: 'signature_${DateTime.now().millisecondsSinceEpoch}.png',
        folder: 'users/${profile.id}/signatures',
      );

      // Update profile with signature URL
      // ignore: use_build_context_synchronously
      context.read<SettingBloc>().add(UpdateProfileEvent(
            id: profile.id,
            email: profile.email,
            firstName: profile.firstName,
            lastName: profile.lastName,
            middleName: profile.middleName,
            telephone: profile.telephone,
            address: profile.address,
            accountType: profile.accountType,
            isVerified: profile.isVerified,
            imagePath: profile.profileImage,
            signaturePath: res.secureUrl,
          ));
      // Success feedback; actual update result is handled by previous screen's bloc
      // ignore: use_build_context_synchronously
  context.pop(true);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Save failed: $e'), backgroundColor: Colors.redAccent),
      );
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: const NavBar(showBack: true),
      bottomNavigationBar: BottomNav(
        currentIndex: 0,
        onItemSelected: (index) {
          if (index == 0) context.go('/dashboard', extra: 0);
          if (index == 1) context.go('/dashboard', extra: 1);
          if (index == 2) context.go('/dashboard', extra: 2);
        },
        onCreatePressed: () => context.go('/dashboard', extra: 1),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xFFF1FAF9),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF8AD7CE)),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Signature(
                    controller: _controller,
                    backgroundColor: Colors.transparent,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _controller.clear,
                    icon: const Icon(Icons.clear),
                    label: const Text('Clear'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _controller.undo,
                    icon: const Icon(Icons.undo),
                    label: const Text('Undo'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _saving ? null : _save,
                    icon: _saving
                        ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : const Icon(Icons.check),
                    label: const Text('Save'),
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
