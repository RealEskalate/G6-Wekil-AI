import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
// import 'package:mobile/injection_container.dart' as di;
import 'package:file_picker/file_picker.dart';
// import 'package:mobile/core/services/cloudinary_uploader.dart';
import '../../../../core/services/cloudinary_uploader.dart';
import '../../../../injection_container.dart' as di;
import '../bloc/setting_bloc.dart';

class EditProfilePage extends StatefulWidget {
  const EditProfilePage({super.key});

  @override
  State<EditProfilePage> createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  final _formKey = GlobalKey<FormState>();
  final _firstNameCtrl = TextEditingController();
  final _middleNameCtrl = TextEditingController();
  final _lastNameCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _addressCtrl = TextEditingController();
  // optional media fields
  String? _signaturePath;
  String? _profileImageUrl; // Cloudinary secure_url

  @override
  void dispose() {
    _firstNameCtrl.dispose();
    _middleNameCtrl.dispose();
    _lastNameCtrl.dispose();
    _phoneCtrl.dispose();
    _addressCtrl.dispose();
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
          title: const Text('Edit Profile', style: TextStyle(color: Color(0xFF1A2B3C), fontWeight: FontWeight.bold)),
        ),
        body: BlocConsumer<SettingBloc, SettingState>(
          listener: (context, state) {
            if (state is SettingLoaded) {
              final p = state.profile;
              _firstNameCtrl.text = p.firstName;
              _middleNameCtrl.text = p.middleName ?? '';
              _lastNameCtrl.text = p.lastName;
              _phoneCtrl.text = p.telephone;
              _addressCtrl.text = p.address ?? '';
            }
            if (state is SettingUpdated) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text(state.message), backgroundColor: Colors.green),
              );
              context.pop(true);
            }
            if (state is SettingError) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text(state.message), backgroundColor: Colors.redAccent),
              );
            }
          },
          builder: (context, state) {
            final bool loading = state is SettingLoading && !(state is ChangePasswordLoading);
            // If arriving with an already-loaded profile, ensure fields are prefilled once
            if (state is SettingLoaded && _firstNameCtrl.text.isEmpty && _lastNameCtrl.text.isEmpty && _phoneCtrl.text.isEmpty) {
              final p = state.profile;
              _firstNameCtrl.text = p.firstName;
              _middleNameCtrl.text = p.middleName ?? '';
              _lastNameCtrl.text = p.lastName;
              _phoneCtrl.text = p.telephone;
              _addressCtrl.text = p.address ?? '';
            }
            return SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Card(
                elevation: 0,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Edit Profile', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 16),
                        Center(
                          child: Column(
                            children: [
                              Stack(
                                alignment: Alignment.bottomRight,
                                children: [
                                  Builder(
                                    builder: (_) {
                                      // Prefer freshly uploaded URL, else existing profile image from state
                                      String? url = _profileImageUrl;
                                      if (url == null && state is SettingLoaded) {
                                        final existing = state.profile.profileImage;
                                        if (existing != null && existing.startsWith('http')) {
                                          url = existing;
                                        }
                                      }
                                      if (url != null && url.isNotEmpty) {
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
                                          _initialsFromState(state),
                                          style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                                        ),
                                      );
                                    },
                                  ),
                                  IconButton(
                                    onPressed: () async {
                                      final res = await FilePicker.platform.pickFiles(type: FileType.image, withData: true);
                                      if (res == null || res.files.isEmpty) return;
                                      final f = res.files.first;
                                      if (f.bytes == null) return;
                                      // Determine optional folder from current profile id
                                      String? folder;
                                      final currentState = context.read<SettingBloc>().state;
                                      if (currentState is SettingLoaded) {
                                        folder = 'users/${currentState.profile.id}';
                                      }
                                      try {
                                        final uploader = di.sl<CloudinaryUploader>();
                                        final uploadRes = await uploader.uploadBytes(
                                          f.bytes!,
                                          filename: f.name,
                                          folder: folder,
                                        );
                                        setState(() {
                                          _profileImageUrl = uploadRes.secureUrl;
                                        });
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          const SnackBar(content: Text('Image uploaded')), 
                                        );
                                      } catch (e) {
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          SnackBar(content: Text('Upload failed: $e'), backgroundColor: Colors.redAccent),
                                        );
                                      }
                                    },
                                    icon: const CircleAvatar(
                                      radius: 14,
                                      backgroundColor: Colors.white,
                                      child: Icon(Icons.camera_alt, size: 16, color: Colors.black87),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              const Text('Profile Picture', style: TextStyle(color: Colors.black54)),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                        _textField('First Name', _firstNameCtrl),
                        _textField('Middle Name', _middleNameCtrl, requiredField: false),
                        _textField('Last Name', _lastNameCtrl),
                        _textField('Phone Number', _phoneCtrl),
                        _textField('Location', _addressCtrl, requiredField: false),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: ElevatedButton.icon(
                                onPressed: loading
                                    ? null
                                    : () {
                                        if (_formKey.currentState?.validate() ?? false) {
                                          final p = (state is SettingLoaded) ? state.profile : null;
                                          if (p == null) return;
                                          context.read<SettingBloc>().add(
                                            UpdateProfileEvent(
                                              id: p.id,
                                              email: p.email,
                                              firstName: _firstNameCtrl.text.trim(),
                                              lastName: _lastNameCtrl.text.trim().isNotEmpty ? _lastNameCtrl.text.trim() : p.lastName,
                                              middleName: _middleNameCtrl.text.trim().isNotEmpty ? _middleNameCtrl.text.trim() : p.middleName,
                                              telephone: _phoneCtrl.text.trim(),
                                              address: _addressCtrl.text.trim().isNotEmpty ? _addressCtrl.text.trim() : p.address,
                                              accountType: p.accountType,
                                              isVerified: p.isVerified,
                                              imagePath: _profileImageUrl ?? p.profileImage,
                                              signaturePath: _signaturePath ?? p.signature,
                                            ),
                                          );
                                        }
                                      },
                                icon: loading
                                    ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                                    : const Icon(Icons.save),
                                label: const Text('Save Changes'),
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
                                onPressed: loading ? null : () => context.pop(),
                                child: const Text('Cancel'),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            );
          },
    ),
  );
  }

  String _initialsFromState(SettingState state) {
    if (state is SettingLoaded) {
      final fn = state.profile.firstName;
      final ln = state.profile.lastName;
      final a = fn.isNotEmpty ? fn[0] : '';
      final b = ln.isNotEmpty ? ln[0] : '';
      final comb = (a + b).trim();
      if (comb.isNotEmpty) return comb.toUpperCase();
    }
    return 'U';
  }

  Widget _textField(String label, TextEditingController controller, {bool requiredField = true}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: Colors.black54)),
          const SizedBox(height: 4),
          TextFormField(
            controller: controller,
            validator: requiredField
                ? (v) => (v == null || v.trim().isEmpty) ? 'Required' : null
                : null,
            decoration: InputDecoration(
              hintText: label,
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
        ],
      ),
    );
  }
}