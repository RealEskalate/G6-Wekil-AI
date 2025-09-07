import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';

import '../../domain/usecases/get_agreement_preview.dart';
import '../bloc/preview_bloc.dart';
import '../../../widget/nav_bar.dart';
import '../../../widget/bottom_nav.dart';

class PreviewPage extends StatefulWidget {
  final String agreementId;
  const PreviewPage({super.key, required this.agreementId});

  static Widget provider({required GetAgreementPreview usecase, required String agreementId}) {
    return BlocProvider(
      create: (_) => PreviewBloc(usecase)..add(PreviewStarted(agreementId)),
      child: PreviewPage(agreementId: agreementId),
    );
  }

  @override
  State<PreviewPage> createState() => _PreviewPageState();
}

class _PreviewPageState extends State<PreviewPage> {
  bool _downloading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const NavBar(),
      bottomNavigationBar: BottomNav(
        currentIndex: 2, // Contracts tab context
        onItemSelected: (index) {
          switch (index) {
            case 0:
              GoRouter.of(context).go('/dashboard', extra: 0);
              break;
            case 1:
              GoRouter.of(context).push('/contracts/start');
              break;
            case 2:
              GoRouter.of(context).go('/dashboard', extra: 2);
              break;
          }
        },
        onCreatePressed: () {
          GoRouter.of(context).push('/contracts/start');
        },
      ),
      body: BlocBuilder<PreviewBloc, PreviewState>(
        builder: (context, state) {
          if (state.loading) {
            return const Center(child: CircularProgressIndicator());
          }
          if (state.error != null) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.error_outline, color: Colors.redAccent),
                  const SizedBox(height: 8),
                  Text(state.error!, style: const TextStyle(color: Colors.redAccent)),
                  const SizedBox(height: 12),
                  ElevatedButton(
                    onPressed: () => context.read<PreviewBloc>().add(PreviewRetried()),
                    child: const Text('Retry'),
                  )
                ],
              ),
            );
          }
          // If not loading and no error, but data is still null (first build before event),
          // show a small loader placeholder.
          if (state.data == null) {
            return const Center(child: CircularProgressIndicator());
          }
          final p = state.data!;
          // Show only the PDF view
          return Column(
            children: [
              const SizedBox(height: 8),
              Expanded(
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2))],
                  ),
                  child: SfPdfViewer.network(p.pdfUrl),
                ),
              ),
              const SizedBox(height: 8),
            ],
          );
        },
      ),
      floatingActionButton: BlocBuilder<PreviewBloc, PreviewState>(
        builder: (context, state) {
          final p = state.data;
          if (p == null) return const SizedBox.shrink();
          return FloatingActionButton(
            onPressed: _downloading ? null : () => _downloadPdf(context, p.pdfUrl, p.id),
            tooltip: 'Download PDF',
            child: _downloading
                ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                : const Icon(Icons.download),
          );
        },
      ),
    );
  }

  // Only inline viewer is used; no separate route.

  Future<void> _downloadPdf(BuildContext context, String url, String id) async {
    try {
      setState(() => _downloading = true);
      final docs = await getApplicationDocumentsDirectory();
      final file = File('${docs.path}/agreement_$id.pdf');
      final bytes = await http.readBytes(Uri.parse(url));
      await file.writeAsBytes(bytes, flush: true);
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Saved to ${file.path}')),
      );
    } catch (e) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Download failed: $e')),
      );
    } finally {
      if (mounted) setState(() => _downloading = false);
    }
  }

  // No extra helpers needed for the simplified view
}
