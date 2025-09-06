import '../../data/datasources/agreement_remote_datasource.dart';

class CreateAgreementUseCase {
  final AgreementRemoteDatasource datasource;

  CreateAgreementUseCase({required this.datasource});

  Future<void> execute(Map<String, dynamic> payload) async {
    await datasource.saveAgreement(payload);
  }
}
