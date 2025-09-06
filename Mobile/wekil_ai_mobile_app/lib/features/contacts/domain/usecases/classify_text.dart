import 'package:wekil_ai_mobile_app/features/contacts/data/datasources/classify_remote_datasource.dart';

class ClassifyTextUseCase {
  final ClassifyRemoteDatasource datasource;
  ClassifyTextUseCase(this.datasource);

  Future<String> call(String text) async {
    final result = await datasource.classifyText(text);
      if (result["success"] == true) {
    return result["data"]["payload"]["category"] ?? "";
  } else {
    throw Exception(result["data"]["message"] ?? "Classification failed");
  }
    
    // final category = result["data"]["payload"]["category"];
    // return category;
  }
}


