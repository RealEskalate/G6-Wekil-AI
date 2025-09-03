import 'package:wekil_ai_mobile_app/features/contacts/data/models/contact_data.dart';


abstract class ContractRepository {
  Future<String> generateDraft(IntakeModel intake);
  Future<void> modifyDraft(IntakeModel intake, String changes);
}
