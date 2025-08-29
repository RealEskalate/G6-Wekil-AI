"use client";

import  useState  from "react";
import  toast from "sonner";
import  {StepIndicator}  from "@/components/wizard/StepIndicator";
import ChooseContractType from "@/components/wizard/steps/ChooseContractType";
import LanguageAndDescription from "@/components/wizard/steps/LanguageAndDescription";
import  PartiesInformation  from "@/components/wizard/steps/PartiesInformation";
import  CommonDetails  from "@/components/wizard/steps/CommonDetails";
import  SpecificDetails  from "@/components/wizard/steps/SpecificDetails";
import  ContractPreview  from "@/components/wizard/steps/ContractPreview";
import  {Button}  from "@/components/ui/Button";
import  Loader2  from "lucide-react";

export interface Step {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export type Language = "en" | "am";

export interface ContractData {
  contractType?: string;
  agreementLanguage?: "en" | "am";
  description?: string;
  parties?: { fullName: string; phone: string; email: string }[];
  commonDetails?: {
    location: string;
    totalAmount: number;
    currency: "ETB" | "USD" | "EUR";
    startDate: string;
    endDate: string;
    dueDates: string[];
  };
  specificDetails?: {
    // Service Agreement
    servicesDescription?: string;
    milestones?: { description: string; date: string }[];
    revisions?: number;
    // Sale of Goods
    items?: { description: string; quantity: number; unitPrice: number }[];
    deliveryTerms?: string;
    // Simple Loan
    principalAmount?: number;
    installments?: { amount: number; dueDate: string }[];
    lateFeePercentage?: number;
    // Non-Disclosure Agreement
    effectiveDate?: string;
    confidentialityPeriod?: number;
    purpose?: string;
  };
}

interface ContractWizardProps {
  onBackToDashboard?: () => void;
}

export function ContractWizard({ onBackToDashboard }: ContractWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
  const [contractData, setContractData] = useState<ContractData>({});
  const [isCheckingComplexity, setIsCheckingComplexity] = useState(false);

  const steps: Step[] = [
    { id: "type", label: currentLanguage === "en" ? "Contract Type" : "የውል አይነት", icon: null },
    { id: "language", label: currentLanguage === "en" ? "Language and Description" : "ቋንቋ እና መግለጫ", icon: null },
    { id: "parties", label: currentLanguage === "en" ? "Parties" : "ተዋዋዮች", icon: null },
    { id: "common", label: currentLanguage === "en" ? "Common Details" : "የጋራ ዝርዝሮች", icon: null },
    { id: "specific", label: currentLanguage === "en" ? "Specific Details" : "የተወሰኑ ዝርዝሮች", icon: null },
    { id: "preview", label: currentLanguage === "en" ? "Preview" : "ቅድመ እይታ", icon: null },
  ];

  const handleNext = (data: Partial<ContractData>) => {
    setContractData({ ...contractData, ...data });

    if (currentStep === 1) {
      // After Language and Description step, show loading state
      setIsCheckingComplexity(true);
      setTimeout(() => {
        setIsCheckingComplexity(false);
        // For now, assume basic complexity and proceed
        setCurrentStep(currentStep + 1);
      }, 1000); // Short loading state (1 second)
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.success(currentLanguage === "en" ? "Contract created!" : "ውል ተፈጥሯል!");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (onBackToDashboard) {
      onBackToDashboard();
    }
  };

  if (isCheckingComplexity) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="mt-4 text-lg">
              {currentLanguage === "en" ? "Checking complexity..." : "ውስብስብነት በመፈተሽ ላይ..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <StepIndicator steps={steps} currentStep={currentStep} currentLanguage={currentLanguage} />
      <div className="mt-4">
        {currentStep === 0 && <ChooseContractType currentLanguage={currentLanguage} onNext={handleNext} />}
        {currentStep === 1 && <LanguageAndDescription currentLanguage={currentLanguage} onNext={handleNext} />}
        {currentStep === 2 && (
          <PartiesInformation
            currentLanguage={currentLanguage}
            onNext={handleNext}
            contractType={contractData.contractType}
          />
        )}
        {currentStep === 3 && (
          <CommonDetails
            currentLanguage={currentLanguage}
            onNext={handleNext}
            contractType={contractData.contractType}
          />
        )}
        {currentStep === 4 && (
          <SpecificDetails
            currentLanguage={currentLanguage}
            onNext={handleNext}
            contractType={contractData.contractType}
          />
        )}
        {currentStep === 5 && <ContractPreview currentLanguage={currentLanguage} contractData={contractData} />}
      </div>
      <div className="mt-4 flex space-x-4">
        <Button onClick={handleBack}>
          {currentLanguage === "en" ? "Back" : "ተመለስ"}
        </Button>
        {currentStep < steps.length - 1 && (
          <Button onClick={() => handleNext({})}>
            {currentLanguage === "en" ? "Next" : "ቀጣይ"}
          </Button>
        )}
      </div>
    </div>
  );
}