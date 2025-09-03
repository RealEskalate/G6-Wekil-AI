import 'package:wekil_ai_mobile_app/features/contacts/data/models/contact_data.dart';


import '../../domain/repositories/contract_repository.dart';
import '../datasources/contract_api.dart';

class ContractRepositoryImpl implements ContractRepository {
  final ContractApi api;

  ContractRepositoryImpl(this.api);

  @override
  Future<String> generateDraft(IntakeModel intake) {
    return api.generateDraft(intake);
  }

  @override
  Future<void> modifyDraft(IntakeModel intake, String changes) {
    return api.modifyDraft(intake, changes);
  }
}
