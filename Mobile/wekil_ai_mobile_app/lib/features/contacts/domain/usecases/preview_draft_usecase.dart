import '../entities/draft.dart';

class PreviewDraft {
  Draft call(Draft draft) {
    if (draft.sections.isEmpty) {
      throw Exception("Nothing to preview: draft has no sections.");
    }

    // In the future you could add logic like:
    // - Apply formatting rules
    // - Validate contract completeness
    // - Add metadata before showing

    return draft;
  }
}
