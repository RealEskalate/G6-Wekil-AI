"use client";

import { FileText, Users, DollarSign, Settings, Eye } from "lucide-react";
import { useState } from "react";
import { ArrowLeft, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button"; 
import { StepIndicator } from "@/components/wizard/StepIndicator";
import { ChooseContractType } from "./steps/ChooseContractType";
import { PartiesInformation } from "./steps/PartiesInformation";
import { DealTerms } from "./steps/DealTerms";
// import { AdditionalClauses } from "./steps/AdditionalClauses"; //TODO
// import { ContractPreview } from "./steps/ContractPreview"; // TOdo
import { toast } from "sonner";

export type Language = "english" | "amharic";

export interface ContractData {
  contractType: string;
  firstParty: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
  };
  secondParty: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
  };
  dealTerms: {
    amount: string;
    currency: string;
    startDate: string;
    endDate: string;
    description: string;
  };
  additionalClauses: {
    lateFee: string;
    revisionLimit: string;
    confidentialityClause: boolean;
    cancellationClause: boolean;
  };
}

export interface Step {
  id: number;
  title: string;
  titleAmharic: string;
  icon: React.ComponentType<{ className?: string }>;
}

const texts = {
  english: {
    title: "Contract Wizard",
    step: "Step",
    of: "of",
    next: "Next",
    back: "Back",
    finish: "Create Contract",
    export: "Export",
    pleaseSelect: "Please select a contract type",
    fillRequired: "Please fill in all required fields",
    validEmail: "Please enter valid email addresses",
    validAmount: "Please enter a valid amount",
  },
  amharic: {
    title: "የውል አዘጋጅ",
    step: "ደረጃ",
    of: "ከ",
    next: "ቀጣይ",
    back: "ተመለስ",
    finish: "ውል ፍጠር",
    export: "ወደ ውጭ",
    pleaseSelect: "እባክዎ የውል አይነት ይምረጡ",
    fillRequired: "እባክዎ ሁሉንም አስፈላጊ መስኮች ይሙሉ",
    validEmail: "እባክዎ ትክክለኛ ኢሜል አድራሾችን ያስገቡ",
    validAmount: "እባክዎ ትክክለኛ መጠን ያስገቡ",
  },
};

const steps: Step[] = [
  { id: 1, title: "Choose Contract Type", titleAmharic: "የውል አይነት ምረጥ", icon: FileText },
  { id: 2, title: "Parties Information", titleAmharic: "የተሳታፊዎች መረጃ", icon: Users },
  { id: 3, title: "Deal Terms", titleAmharic: "የስምምነት ውሎች", icon: DollarSign },
  { id: 4, title: "Additional Clauses", titleAmharic: "ተጨማሪ አንቀጾች", icon: Settings },
  { id: 5, title: "Contract Preview", titleAmharic: "የውል ቅድመ እይታ", icon: Eye },
];

interface ContractWizardProps {
  onBackToDashboard?: () => void;
}

export function ContractWizard({ onBackToDashboard }: ContractWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentLanguage, setCurrentLanguage] = useState<Language>("english");
  const [contractData, setContractData] = useState<ContractData>({
    contractType: "",
    firstParty: { fullName: "", phone: "", email: "", address: "" },
    secondParty: { fullName: "", phone: "", email: "", address: "" },
    dealTerms: { amount: "", currency: "ETB", startDate: "", endDate: "", description: "" },
    additionalClauses: { lateFee: "", revisionLimit: "", confidentialityClause: false, cancellationClause: false },
  });

  const t = texts[currentLanguage];

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!contractData.contractType) {
          toast.error(t.pleaseSelect);
          return false;
        }
        break;
      case 2:
        const { firstParty, secondParty } = contractData;
        if (
          !firstParty.fullName ||
          !firstParty.phone ||
          !firstParty.email ||
          !firstParty.address ||
          !secondParty.fullName ||
          !secondParty.phone ||
          !secondParty.email ||
          !secondParty.address
        ) {
          toast.error(t.fillRequired);
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(firstParty.email) || !emailRegex.test(secondParty.email)) {
          toast.error(t.validEmail);
          return false;
        }
        break;
      case 3:
        const { amount, startDate, endDate, description } = contractData.dealTerms;
        if (!amount || !startDate || !endDate || !description) {
          toast.error(t.fillRequired);
          return false;
        }
        if (parseFloat(amount) <= 0) {
          toast.error(t.validAmount);
          return false;
        }
        break;
      case 4:
        // Optional step, no validation needed
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLanguageToggle = () => {
    setCurrentLanguage((prev) => (prev === "english" ? "amharic" : "english"));
  };

  const updateContractData = (data: Partial<ContractData>) => {
    setContractData((prev) => ({ ...prev, ...data }));
  };

  const handleFinish = () => {
    if (validateStep(currentStep)) {
      const contractId = "contract_" + Date.now();
      toast.success(currentLanguage === "english" ? "Contract created successfully!" : "ውል በተሳካ ሁኔታ ተፈጠረ!");
      if (onBackToDashboard) {
        onBackToDashboard(); // Navigate back to dashboard
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ChooseContractType data={contractData} onUpdate={updateContractData} currentLanguage={currentLanguage} />;
      case 2:
        return <PartiesInformation data={contractData} onUpdate={updateContractData} currentLanguage={currentLanguage} />;
      case 3:
        return <DealTerms data={contractData} onUpdate={updateContractData} currentLanguage={currentLanguage} />;
    // TODO
        //   case 4:
    //     return <AdditionalClauses data={contractData} onUpdate={updateContractData} currentLanguage={currentLanguage} />;
    //   case 5:
    //     return <ContractPreview data={contractData} onUpdate={updateContractData} currentLanguage={currentLanguage} />;
    //  
     default:
        return null;
    }
  };

  return (
    <div className={`h-full flex flex-col bg-gray-100 ${currentLanguage === "amharic" ? "font-ethiopic" : ""}`}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (currentStep === 1 && onBackToDashboard ? onBackToDashboard() : handleBack())}
            disabled={currentStep === 1 && !onBackToDashboard}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.back}
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{t.title}</h1>
            <p className="text-sm text-gray-500">
              {t.step} {currentStep} {t.of} 5
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLanguageToggle}
          className="flex items-center bg-white text-black border border-gray-200 hover:bg-teal-500 hover:text-white transition-colors"
        >
          <Globe className="h-4 w-4 mr-2" />
          {currentLanguage === "english" ? "አማርኛ" : "English"}
        </Button>
      </div>

      {/* Step Indicator */}
      <div className="px-6 py-4">
        <StepIndicator steps={steps} currentStep={currentStep} currentLanguage={currentLanguage} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">{renderStep()}</div>

      {/* Footer */}
      <div className="px-6 py-4 flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => (currentStep === 1 && onBackToDashboard ? onBackToDashboard() : handleBack())}
          disabled={currentStep === 1 && !onBackToDashboard}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t.back}
        </Button>
        {currentStep < 5 ? (
          <Button
            onClick={handleNext}
            className="bg-gray-800 hover:bg-gray-700 text-white"
          >
            {t.next}
            <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
          </Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline">{t.export}</Button>
            <Button onClick={handleFinish} className="bg-slate-800 hover:bg-slate-700">
              {t.finish}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}