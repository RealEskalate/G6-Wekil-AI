import '../entities/intake.dart';
import '../entities/draft.dart';

/// Repository for handling draft lifecycle.
abstract class DraftRepository {
  /// Generate a draft contract from an intake (via AI backend).
  Future<Draft> generateDraft(Intake intake);

  /// Save a draft in the backend (user accepted).
  Future<void> saveDraft(Draft draft);

  /// Export a draft into a specific format (pdf, docx, etc).
  Future<void> exportDraft(Draft draft, {String format = "pdf"});
}
