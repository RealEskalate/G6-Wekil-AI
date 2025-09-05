import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../injection_container.dart';
import '../bloc/auth_bloc.dart';

class OtpVerificationPage extends StatefulWidget {
  final String email;
  const OtpVerificationPage({super.key, required this.email});

  @override
  State<OtpVerificationPage> createState() => _OtpVerificationPageState();
}

class _OtpVerificationPageState extends State<OtpVerificationPage> {
  final _formKey = GlobalKey<FormState>();
  final _otpController = TextEditingController();
  String? _error;

  @override
  void dispose() {
    _otpController.dispose();
    super.dispose();
  }

  void _onVerifyPressed(BuildContext ctx) async {
    if (_formKey.currentState?.validate() ?? false) {
      setState(() { _error = null; });
      // Use the Bloc-aware context from the builder to dispatch the event
      ctx.read<AuthBloc>().add(
        VerifyOtpEvent(widget.email, _otpController.text.trim()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider<AuthBloc>(
      create: (_) => sl<AuthBloc>(),
      child: BlocConsumer<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is AuthOtpVerified) {
            if (state.result.isVerified) {
              context.go('/sign-in');
            } else {
              setState(() { _error = state.result.message; });
            }
          } else if (state is AuthFailure) {
            setState(() { _error = state.message; });
          }
        },
        builder: (context, state) {
          final isLoading = state is AuthLoading;
          return Scaffold(
            backgroundColor: const Color(0xFFF7FAFC),
            body: Center(
              child: SingleChildScrollView(
                child: Column(
                  children: [
              const SizedBox(height: 40),
              const Icon(Icons.description, size: 40, color: Color(0xFF0A2540)),
              const SizedBox(height: 16),
              const Text("Wekil AI", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 22, color: Color(0xFF0A2540))),
              const SizedBox(height: 8),
              const Text("Create Account", style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
              const SizedBox(height: 4),
              const Text("Step 2 of 2", style: TextStyle(fontSize: 13, color: Colors.black54)),
              const SizedBox(height: 12),
              Container(
                width: 340,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Color(0xFF0A2540), width: 0.5),
                ),
                child: Column(
                  children: [
                    const Icon(Icons.email, size: 40, color: Color(0xFF0A2540)),
                    const SizedBox(height: 12),
                    const Text("Enter the verification code sent to your email", style: TextStyle(fontSize: 15)),
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Color(0xFFEFFAF6),
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Form(
                      key: _formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text("Verification Code", style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                          const SizedBox(height: 6),
                          TextFormField(
                            controller: _otpController,
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(
                              hintText: "6-digit code",
                              border: OutlineInputBorder(),
                              contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                            ),
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return "Please enter the code";
                              }
                              if (value.length != 6) {
                                return "Code must be 6 digits";
                              }
                              return null;
                            },
                          ),
                          if (_error != null) ...[
                            const SizedBox(height: 8),
                            Text(_error!, style: const TextStyle(color: Colors.red)),
                          ],
                          const SizedBox(height: 18),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF0A2540),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                padding: const EdgeInsets.symmetric(vertical: 12),
                              ),
                              onPressed: isLoading ? null : () => _onVerifyPressed(context),
                child: isLoading
                  ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                  : const Text("Verify & Create Account", style: TextStyle(color: Colors.white)),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 10),
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: isLoading ? null : () => context.pop(),
                        child: const Text("← Back"),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
            ),
      );
        },
      ),
    );
  }
}
