import 'package:wekil_ai_mobile_app/features/contacts/data/models/contact_data.dart';

import '../repositories/contract_repository.dart';

class ModifyDraft {
  final ContractRepository repository;

  ModifyDraft(this.repository);

  Future<void> call(IntakeModel intake, String changes) {
    return repository.modifyDraft(intake, changes);
  }
}
