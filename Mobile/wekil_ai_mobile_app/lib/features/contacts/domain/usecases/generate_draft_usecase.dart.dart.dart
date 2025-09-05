
import 'package:wekil_ai_mobile_app/features/contacts/data/models/contact_data.dart';

import '../repositories/contract_repository.dart';

class GenerateDraft {
  final ContractRepository repository;

  GenerateDraft(this.repository);

  Future<String> call(IntakeModel intake) {
    return repository.generateDraft(intake);
  }
}
