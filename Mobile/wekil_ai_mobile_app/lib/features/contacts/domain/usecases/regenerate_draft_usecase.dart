import '../../data/datasources/draft_remote_datasource.dart';

class RegenerateDraftUseCase {
  final DraftRemoteDatasource datasource;

  RegenerateDraftUseCase(this.datasource);

  Future<Map<String, dynamic>> call({
    required String draft,
    required String prompt,
    required String language,
  }) async {
    return await datasource.regenerateDraft(
      draft: draft,
      prompt: prompt,
      language: language,
    );
  }
}
