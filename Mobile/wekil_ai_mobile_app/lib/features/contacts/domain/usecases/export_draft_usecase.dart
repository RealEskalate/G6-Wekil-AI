import '../entities/draft.dart';
import '../repositories/draft_repository.dart';

class ExportDraft {
  final DraftRepository repository;

  ExportDraft(this.repository);

  Future<void> call(Draft draft, {String format = "pdf"}) async {
    if (draft.title.isEmpty) {
      throw Exception("Draft must have a title before export.");
    }
    await repository.exportDraft(draft, format: format);
  }
}
