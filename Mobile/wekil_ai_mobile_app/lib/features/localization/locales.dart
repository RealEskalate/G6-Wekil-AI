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
  // Added keys for dashboard UI
  static const String recentContracts = 'recentContracts';
  static const String viewAll = 'viewAll';
  static const String draftContracts = 'draftContracts';
  static const String exportedContracts = 'exportedContracts';
  static const String allContracts = 'allContracts';
  static const String noContractsYet = 'noContractsYet';
  static const String createFirstContract = 'createFirstContract';
  static const String createContract = 'createContract';

  static const Map<String, String> EN = {
    welcome: "welcome Back %a",
    there: ",Wekil AI",
    Overview: "Overview",
    // ...added EN translations...
    recentContracts: "Recent Contracts",
    viewAll: "View All",
    draftContracts: "Draft Contracts",
    exportedContracts: "Exported Contracts",
    allContracts: "All Contracts",
    noContractsYet: "No contracts yet",
    createFirstContract: "Create your first contract",
    createContract: "Create Contract",
  };

  static const Map<String, String> AM = {
    welcome: 'እንኳን በደህና መጡ %a',
    there: ',ወኪል ኤአይ',
    Overview: 'አጠቃላይ እይታ',
    // ...added AM translations...
    recentContracts: 'የቅርብ ውልዎች',
    viewAll: 'ሁሉንም ይመልከቱ',
    draftContracts: 'ረቂቅ ውልዎች',
    exportedContracts: 'የተላኩ ውልዎች',
    allContracts: 'ሁሉም ውልዎች',
    noContractsYet: 'እስካሁን ውል የለም',
    createFirstContract: 'የመጀመሪያውን ውልዎን ይፍጠሩ',
    createContract: 'ውል ይፍጠሩ',
  };
}
