import '../../domain/entities/agreement_preview.dart';
import '../../domain/repositories/preview_repository.dart';
import '../datasources/preview_remote_data_source.dart';

class PreviewRepositoryImpl implements PreviewRepository {
  final PreviewRemoteDataSource remote;
  PreviewRepositoryImpl({required this.remote});

  @override
  Future<AgreementPreview> getPreview(String agreementId) async {
    final model = await remote.fetch(agreementId);
    return model.toEntity();
  }
}
