import '../../data/datasources/modify_draft_remote_datasource.dart';

class ModifyDraftUseCase {
  final ModifyDraftRemoteDatasource datasource;

  ModifyDraftUseCase(this.datasource);

  Future<Map<String, dynamic>> call({
    required String draft,
    required String prompt,
    required String language,
  }) async {
    return await datasource.modifyDraft(
      draft: draft,
      prompt: prompt,
      language: language,
    );
  }
}
