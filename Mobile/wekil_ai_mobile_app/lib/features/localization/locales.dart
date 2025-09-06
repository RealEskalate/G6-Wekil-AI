import 'package:flutter_localization/flutter_localization.dart';
// removed unused import

const List<MapLocale> LOCALES = [
  MapLocale('en', LocalesData.EN),
  MapLocale('am', LocalesData.AM), // Added Amharic translations
];

mixin LocalesData {
  static const String welcome = 'welcome';
  static const String there = 'there';
  static const String Overview = 'Overview';
  static const String Create_Contract = 'Create_Contract';
  static const String Important = 'Important';
  static const String explanation = 'explanation';
  static const String Get_Started_Now = 'Get_Started_Now';
  static const String Continue = 'Continue';

  static const String Fast_and_Simple = 'Fast_&_Simple';
  static const String Create_contracts_in_minutes =
      'Create_contracts_in_minutes';

  static const String Bilingual_Support = 'Bilingual_Support';
  static const String Available_in_Amharic_and_English =
      'Available_in_Amharic_and_English ';

  static const String Locally_Stored = 'Locally_Stored';
  static const String All_contracts_stored_on_your_device =
      'All_contracts_stored_on_your_device';

  static const String Select_Contract_Type = 'Select_Contract_Type';
  static const String Choose_the_type_of_contract_you_want_to_create =
      'Choose_the_type_of_contract_you_want_to_create';
  static const String Service_Agreement = 'Service_Agreement';
  static const String Freelance_work_design_photography_consulting =
      'Freelance_work_design_photography_consulting';
  static const String Sale_of_Goods = 'Sale_of_Goods';
  static const String Small_item_sales_product_delivery_terms =
      'Small_item_sales_product_delivery_terms';
  static const String Simple_Loan_IOU = 'Simple_Loan_(IOU)';
  static const String Personal_loans_with_repayment_schedule =
      'Personal_loans_with_repayment_schedule';
  static const String Basic_NDA = 'Basic_NDA';
  static const String Simple_confidentiality_agreement =
      'Simple_confidentiality_agreement';

  static const String Not_for_Complex_Agreements = 'Not_for_Complex_Agreements';
  static const String
  This_tool_is_designed_for_basic_agreements_only_Please_consult_a_lawyer_for =
      'This_tool_is_designed_for_basic_agreements_only_Please_consult_a_lawyer_for';
  static const String Employment_contracts = 'Employment_contracts';
  static const String Real_estate_or_land_transfers =
      'Real_estate_or_land_transfers';
  static const String Corporate_or_shareholder_agreements =
      'Corporate_or_shareholder_agreements';
  static const String Government_tenders_or_regulated_industries =
      'Government_tenders_or_regulated_industries';

  static const String Basic_Info = 'Basic_Info';
  static const String Contract_Language = 'Contract_Language';

  static const String Describe_your_services = 'Describe_your_services';
  static const String Describe_your_goods_delivery_terms =
      'Describe_your_goods_delivery_terms';
  static const String Quick_Description_Optional = 'Quick_Description_Optional';

  static const String eg_Logo_design_5000_birr_2_weeks =
      'eg_Logo_design_5000_birr_2_weeks';
  static const String eg_100_items_delivery_in_3_days =
      'eg_100_items_delivery_in_3_days';
  static const String Optional_description_of_the_deal =
      'Optional_description_of_the_deal';
  static const String This_information_helps_us_pre_fill_your_contract =
      'This_information_helps_us_pre-fill_your_contract';

  // Added keys for dashboard UI
  static const String recentContracts = 'recentContracts';
  static const String viewAll = 'viewAll';
  static const String draftContracts = 'draftContracts';
  static const String exportedContracts = 'exportedContracts';
  static const String allContracts = 'allContracts';
  static const String noContractsYet = 'noContractsYet';
  static const String createFirstContract = 'createFirstContract';
  static const String createContract = 'createContract';
  static const String servicesDescription = 'servicesDescription';
  static const String milestones = 'milestones';
  static const String description = 'description';
  static const String amountOptional = 'amountOptional';
  static const String dueDate = 'dueDate';
  static const String removeMilestone = 'removeMilestone';
  static const String addMilestone = 'addMilestone';
  static const String numberOfRevisions = 'numberOfRevisions';

  // Generic placeholder for features not yet implemented
  static const String notImplemented = 'notImplemented';

  static const String item = 'item';
  static const String quantity = 'quantity';
  static const String unitPrice = 'unitPrice';
  static const String removeItem = 'removeItem';
  static const String addItem = 'addItem';
  static const String deliveryTerms = 'deliveryTerms';

  static const String principalAmount = 'principalAmount';
  static const String installments = 'installments';
  static const String installmentDescription = 'installmentDescription';
  static const String removeInstallment = 'removeInstallment';
  static const String addInstallment = 'addInstallment';
  static const String lateFeePercentage = 'lateFeePercentage';

  static const String effectiveDate = 'effectiveDate';
  static const String confidentialityTermsYears = 'confidentialityTermsYears';
  static const String purpose = 'purpose';
  static const String mutualConfidentiality = 'mutualConfidentiality';
  static const String amount = 'amount';
  static const String frequencyHint = 'frequencyHint';

  static const Map<String, String> EN = {
    welcome: "welcome Back %a",
    there: ",Wekil AI",
    Overview: "Overview",
    Create_Contract: 'Create Contract',
    Important: 'Important:',
    explanation:
        'This tool creates basic agreements only and is not legal advice. For complex matters or legal questions, please consult a qualified lawyer.',
    Get_Started_Now: 'Get Started Now',
    Continue: 'Continue',
    Fast_and_Simple: 'Fast & Simple',
    Create_contracts_in_minutes: 'Create contracts in minutes',
    Bilingual_Support: 'Bilingual Support',
    Available_in_Amharic_and_English: 'Available in Amharic & English',
    Locally_Stored: 'Locally Stored',
    All_contracts_stored_on_your_device: 'All contracts stored on your device',

    Select_Contract_Type: 'Select Contract Type',
    Choose_the_type_of_contract_you_want_to_create:
        'Choose the type of contract you want to create',
    Service_Agreement: 'Service Agreement',
    Freelance_work_design_photography_consulting:
        'Freelance work, design, photography, consulting',
    Sale_of_Goods: 'Sale of Goods',
    Small_item_sales_product_delivery_terms:
        'Small item sales, product delivery terms',
    Simple_Loan_IOU: 'Simple Loan (IOU)',
    Personal_loans_with_repayment_schedule:
        'Personal loans with repayment schedule',
    Basic_NDA: 'Basic NDA',

    Simple_confidentiality_agreement: 'Simple confidentiality agreement',
    Not_for_Complex_Agreements: 'Not for Complex Agreements',
    This_tool_is_designed_for_basic_agreements_only_Please_consult_a_lawyer_for:
        'This tool is designed for basic agreements only. Please consult a lawyer for',
    Employment_contracts: 'Employment contracts',
    Real_estate_or_land_transfers: 'Real estate or land transfers',
    Corporate_or_shareholder_agreements: 'Corporate or shareholder agreements',
    Government_tenders_or_regulated_industries:
        'Government tenders or regulated industries',

    Basic_Info: 'Basic Info',
    Contract_Language: 'Contract Language',
    Describe_your_services: 'Describe your services',
    Describe_your_goods_delivery_terms: 'Describe your goods / delivery terms',
    Quick_Description_Optional: 'Quick Description (Optional)',
    eg_Logo_design_5000_birr_2_weeks: 'e.g. Logo design, 5000 birr, 2 weeks',
    eg_100_items_delivery_in_3_days: 'e.g. 100 items, delivery in 3 days',
    Optional_description_of_the_deal: 'Optional description of the deal',
    This_information_helps_us_pre_fill_your_contract:
        'This information helps us pre-fill your contract.',

    // Added EN translations for dashboard UI
    recentContracts: 'Recent Contracts',
    viewAll: 'View All',
    draftContracts: 'Draft Contracts',
    exportedContracts: 'Exported Contracts',
    allContracts: 'All Contracts',
    noContractsYet: 'No contracts yet',
    createFirstContract: 'Create your first contract',
    createContract: 'Create Contract',

    servicesDescription: "Services Description",
    milestones: "Milestones",
    description: "Description",
    amountOptional: "Amount (optional)",
    dueDate: "Due Date",
    removeMilestone: "Remove Milestone",
    addMilestone: "Add Milestone",
    numberOfRevisions: "Number of Revisions",

    item: "Item",
    quantity: "Quantity",
    unitPrice: "Unit Price",
    removeItem: "Remove Item",
    addItem: "Add Item",
    deliveryTerms: "Delivery Terms",

    principalAmount: "Principal Amount",
    installments: "Installments",
    installmentDescription: "Description",
    removeInstallment: "Remove Installment",
    addInstallment: "Add Installment",
    lateFeePercentage: "Late Fee Percentage",

    effectiveDate: "Effective Date",
    confidentialityTermsYears: "Confidentiality Terms (years)",
    purpose: "Purpose",
    mutualConfidentiality: "Mutual Confidentiality",
    amount: 'Amount',
    // Generic placeholder message
    notImplemented: 'Not implemented yet',
  };

  static const Map<String, String> AM = {
    welcome: 'እንኳን በደህና መጡ %a',
    there: ',ወኪል ኤአይ',
    Overview: 'አጠቃላይ እይታ',
    Create_Contract: 'ውል ፍጠር',
    Important: 'አስፈላጊ:',
    explanation:
        'ይህ መሣሪያ መሠረታዊ ስምምነቶችን ብቻ ይፍጠራል እና ሕጋዊ ምክር አይደለም። ለውድቀት ጉዳዮች ወይም ሕጋዊ ጥያቄዎች እባክዎ ብቁ የሆነ የሕግ አማካሪ ያግኙ።',
    Get_Started_Now: 'አሁን ጀምር ',
    Continue: 'ቀጥል',
    Fast_and_Simple: 'ፈጣን እና ቀላል',
    Create_contracts_in_minutes: 'በደቂቃዎች ውስጥ ውሎች መፍጠር',
    Bilingual_Support: 'አብሮ ቋንቋ ድጋፍ',
    Available_in_Amharic_and_English: 'በአማርኛ እና በእንግሊዝኛ ይገኛል',
    Locally_Stored: 'በአካባቢ ተቀመጠ',
    All_contracts_stored_on_your_device: 'ሁሉም ውሎች በመሣሪያዎ ላይ ተቀመጡ',

    Select_Contract_Type: 'የውል አይነት ይምረጡ',
    Choose_the_type_of_contract_you_want_to_create: 'የማፍጠርዎን የውል አይነት ይምረጡ',
    Service_Agreement: 'የአገልግሎት ስምምነት',
    Freelance_work_design_photography_consulting:
        'ነጻ ስራ, ንድፍ, ፎቶግራፊ, ምክር አገልግሎት',
    Sale_of_Goods: 'የእቃዎች ሽያጭ',
    Small_item_sales_product_delivery_terms: 'የትንሹ እቃ ሽያጭ, የምርት ማድረሻ ውሎች',
    Simple_Loan_IOU: 'ቀላል ብድር (IOU)',
    Personal_loans_with_repayment_schedule: 'የግል ብድሮች ከመክፈል ሰሌዳ ጋር',
    Basic_NDA: 'መሠረታዊ የማሽያዣ ስምምነት (NDA)',
    Simple_confidentiality_agreement: 'ቀላል የምስጢር ግንኙነት ስምምነት',

    Not_for_Complex_Agreements: 'ለውድቀት ስምምነቶች አይደለም',
    This_tool_is_designed_for_basic_agreements_only_Please_consult_a_lawyer_for:
        'ይህ መሣሪያ ለመሠረታዊ ስምምነቶች ብቻ ተዘጋጅቷል። እባክዎ ለ… ሕጋዊ ምክር የሕግ አማካሪ ያግኙ።',
    Employment_contracts: 'የሥራ ውሎች',
    Real_estate_or_land_transfers: 'የንብረት ወይም የመሬት ማስተላለፊያዎች',
    Corporate_or_shareholder_agreements: 'የኩባንያ ወይም የባለእቃ ስምምነቶች',
    Government_tenders_or_regulated_industries:
        'የመንግስት ጨረታዎች ወይም ተደናቀፉ ኢንዱስትሪዎች',

    Basic_Info: 'መሠረታዊ መረጃ',
    Contract_Language: 'የውል ቋንቋ',
    Describe_your_services: 'አገልግሎቶችዎን ይግለጹ',
    Describe_your_goods_delivery_terms: 'እቃዎችዎን / የማድረሻ ውሎችዎን ይግለጹ',
    Quick_Description_Optional: 'በፍጥነት መግለጫ (አማራጭ)',
    eg_Logo_design_5000_birr_2_weeks: 'ለምሳሌ፡ የሎጎ ንድፍ፣ 5000 ብር፣ 2 ሳምንት',
    eg_100_items_delivery_in_3_days: 'ለምሳሌ፡ 100 እቃዎች፣ በ3 ቀናት ውስጥ መድረስ',
    Optional_description_of_the_deal: 'የስምምነቱ አማራጭ መግለጫ',
    This_information_helps_us_pre_fill_your_contract:
        'ይህ መረጃ ውልዎን በቀድሞ ለመሙላት ይረዳናል።',

    // ...added AM translations...
    recentContracts: 'የቅርብ ውልዎች',
    viewAll: 'ሁሉንም ይመልከቱ',
    draftContracts: 'ረቂቅ ውልዎች',
    exportedContracts: 'የተላኩ ውልዎች',
    allContracts: 'ሁሉም ውልዎች',
    noContractsYet: 'እስካሁን ውል የለም',
    createFirstContract: 'የመጀመሪያውን ውልዎን ይፍጠሩ',
    createContract: 'ውል ይፍጠሩ',
    servicesDescription: "የአገልግሎት መግለጫ",
    milestones: "የውል ደረጃዎች",
    description: "መግለጫ",
    amountOptional: "መጠን (አማራጭ)",
    dueDate: "የመጨረሻ ቀን",
    removeMilestone: "ደረጃ አስወግድ",
    addMilestone: "ደረጃ አክል",
    numberOfRevisions: "የእይታ ብዛት",

    item: "እቃ",
    quantity: "ብዛት",
    unitPrice: "የእቃ ዋጋ",
    removeItem: "እቃ አስወግድ",
    addItem: "እቃ አክል",
    deliveryTerms: "የማድረሻ ውሎች",

    principalAmount: "ዋና መጠን",
    installments: "ክፍያዎች",
    installmentDescription: "መግለጫ",
    removeInstallment: "ክፍያ አስወግድ",
    addInstallment: "ክፍያ አክል",
    lateFeePercentage: "የቆይታ ቅጣት (%)",

    effectiveDate: "የመጀመሪያ ቀን",
    confidentialityTermsYears: "የምስጢርነት ውሎች (ዓመታት)",
    purpose: "ዓላማ",
    mutualConfidentiality: "የተጋራ ምስጢርነት",
    amount: 'መጠን',
    frequencyHint: 'የመደበኛ ጊዜ አስገባ',
    // Generic placeholder message in Amharic
    notImplemented: 'አልተፈጸመ ነው',
  };
}
