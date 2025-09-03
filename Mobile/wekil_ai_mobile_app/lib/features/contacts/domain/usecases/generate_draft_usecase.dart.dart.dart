import '../entities/intake.dart';
import '../entities/draft.dart';
import '../repositories/draft_repository.dart';

class GenerateDraft {
  final DraftRepository repository;

  GenerateDraft(this.repository);

  Future<Draft> call(Intake intake) async {
    // Business rules before sending
    if (intake.parties.isEmpty) {
      throw Exception("At least one party must be specified.");
    }
    if (intake.startDate.isAfter(intake.endDate)) {
      throw Exception("Start date must be before end date.");
    }

    return await repository.generateDraft(intake);
  }
}
