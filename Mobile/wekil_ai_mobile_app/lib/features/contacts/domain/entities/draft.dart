import 'section.dart';
import 'signature.dart';

class Draft {
  final String title;
  final List<Section> sections;
  final Signatures signatures;

  Draft({
    required this.title,
    required this.sections,
    required this.signatures,
  });
}