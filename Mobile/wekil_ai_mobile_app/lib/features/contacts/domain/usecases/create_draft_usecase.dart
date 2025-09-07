import '../../data/datasources/draft_remote_datasource.dart';

class CreateDraftUseCase {
  final DraftRemoteDatasource datasource;

  CreateDraftUseCase(this.datasource);

  Future<Map<String, dynamic>> call({
    required Map<String, dynamic> draft,
    required String language,
  }) async {
    return await datasource.createDraft(
      draft: draft,
      language: language,
    );
  }
}
