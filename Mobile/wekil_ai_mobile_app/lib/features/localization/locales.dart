import 'package:flutter_localization/flutter_localization.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

const List<MapLocale> LOCALES = [
  MapLocale('en', LocalesData.EN),
  MapLocale('am', LocalesData.AM),
];

mixin LocalesData {
  static const String welcome = 'welcome';
  static const String there = 'there';
  static const String Overview = 'Overview';

  static const Map<String, String> EN = {
    welcome: "welcome Back %a",
    there: ",Wekil AI",
    Overview: "Overview"
  };

  static const Map<String, String> AM = {
    welcome: 'እንኳን በደህና መጡ %a',
    there: ',ወኪል ኤአይ',
    Overview:'አጠቃላይ እይታ'
  };
}
