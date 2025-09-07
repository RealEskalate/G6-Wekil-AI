import '../entities/agreement_preview.dart';
import '../repositories/preview_repository.dart';

class GetAgreementPreview {
  final PreviewRepository repo;
  GetAgreementPreview(this.repo);

  Future<AgreementPreview> call(String agreementId) => repo.getPreview(agreementId);
}
