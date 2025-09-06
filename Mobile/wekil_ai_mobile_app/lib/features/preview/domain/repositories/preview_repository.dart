import '../entities/agreement_preview.dart';

abstract class PreviewRepository {
  Future<AgreementPreview> getPreview(String agreementId);
}
