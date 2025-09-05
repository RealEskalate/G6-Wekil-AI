import '../entities/draft.dart';
import '../repositories/draft_repository.dart';

class SaveDraft {
  final DraftRepository repository;

  SaveDraft(this.repository);

  Future<void> call(Draft draft) async {
    if (draft.sections.isEmpty) {
      throw Exception("Draft must contain at least one section.");
    }
    await repository.saveDraft(draft);
  }
}
