"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Globe,
  FileText,
  Users,
  DollarSign,
  Settings,
  Bot,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Loader2 } from "lucide-react";
import { StepIndicator } from "@/components/wizard/StepIndicator";
import ChooseContractType from "@/components/wizard/steps/ChooseContractType";
import { LanguageAndDescription } from "@/components/wizard/steps/LanguageAndDescription";
import { PartiesInformation } from "@/components/wizard/steps/PartiesInformation";
import CommonDetails from "@/components/wizard/steps/CommonDetails";
import SpecificDetails from "@/components/wizard/steps/SpecificDetails";
import { AIDraftPreview } from "@/components/wizard/steps/AIDraftPreview";
import { FinalPreview } from "@/components/wizard/steps/FinalPreview";
import { ContractDraft, IntialDraftdata } from "../ContractPreview/ContractPreview";
import { useLanguage } from "@/components/LanguageContext";
import WeKilAILoader from "../ui/WekilAILoader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export interface Step {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}
export interface CommonDetail {
  location: string;
  totalAmount: number;
  currency: "ETB" | "USD" | "EUR";
  startDate: string;
  endDate: string;
  dueDates: string[];
}

export type Language = "en" | "am";

export interface ContractData {
  contractType?: string;
  agreementLanguage?: Language;
  description?: string;
  parties?: { fullName: string; phone: string; email: string }[];
  commonDetails: CommonDetail;
  specificDetails?: {
    servicesDescription?: string;
    milestones?: { description: string; date: string }[];
    revisions?: number;
    items?: { description: string; quantity: number; unitPrice: number }[];
    deliveryTerms?: string;
    principalAmount?: number;
    installments?: { amount: number; dueDate: string }[];
    lateFeePercentage?: number;
    effectiveDate?: string;
    confidentialityPeriod?: number;
    purpose?: string;
  };
  aiDraft?: Record<string, unknown>;
}

interface ContractWizardProps {
  onBackToDashboard?: () => void;
}

interface Translations {
  title: string;
  step: string;
  of: string;
  back: string;
  next: string;
  finish: string;
  error: string;
  invalidEmail: string;
}

export function ContractWizard({ onBackToDashboard }: ContractWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { lang, setLang } = useLanguage();
  const [contractData, setContractData] = useState<Partial<ContractData>>({
    agreementLanguage: "en",
    parties: [
      { fullName: "", phone: "", email: "" },
      { fullName: "", phone: "", email: "" },
    ],
    commonDetails: {
      location: "",
      totalAmount: 0,
      currency: "ETB",
      startDate: "",
      endDate: "",
      dueDates: [],
    },
    specificDetails: {},
  });
  const [isCheckingComplexity, setIsCheckingComplexity] = useState(false);
  const { status } = useSession();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const router = useRouter();
  const [intialDraftdata, setIntialDraftdata] = useState<ContractDraft>(IntialDraftdata);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      setIsAuthChecked(true);
    }
  }, [status, router]);

  if (status === "loading" || !isAuthChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <WeKilAILoader />
      </div>
    );
  }

  const steps: Step[] = [
    {
      id: "type",
      label: lang === "en" ? "Contract Type" : "የውል አይነት",
      icon: FileText,
    },
    {
      id: "language",
      label: lang === "en" ? "Language & Description" : "ቋንቋ እና መግለጫ",
      icon: Globe,
    },
    {
      id: "parties",
      label: lang === "en" ? "Parties" : "ተዋዋዮች",
      icon: Users,
    },
    {
      id: "common",
      label: lang === "en" ? "Common Details" : "የጋራ ዝርዝሮች",
      icon: DollarSign,
    },
    {
      id: "specific",
      label: lang === "en" ? "Specific Details" : "የተወሰኑ ዝርዝሮች",
      icon: Settings,
    },
    {
      id: "aiDraft",
      label: lang === "en" ? "AI Draft Preview" : "AI ረቂቅ",
      icon: Bot,
    },
    {
      id: "final",
      label: lang === "en" ? "Final Preview" : "ፍጻሜ ቅድመ እይታ",
      icon: Eye,
    },
  ];

  const t: Record<Language, Translations> = {
    en: {
      title: "Contract Wizard",
      step: "Step",
      of: "of",
      back: "Back",
      next: "Next",
      finish: "Create Contract",
      error: "Please fill in all required fields",
      invalidEmail: "Please enter valid email addresses",
    },
    am: {
      title: "የውል አዘጋጅ",
      step: "ደረጃ",
      of: "ከ",
      back: "ተመለስ",
      next: "ቀጣይ",
      finish: "ውል ፍጠር",
      error: "እባክዎ ሁሉንም አስፈላጊ መስኮች ይሙሉ",
      invalidEmail: "እባክዎ ትክክለኛ ኢሜል አድራሾችን ያስገቡ",
    },
  };

  // Helper setters for each step, always update contractData
  const setContractType = (type: string) =>
    setContractData((prev) => ({ ...prev, contractType: type }));
  const setAgreementLanguage = (language: Language) =>
    setContractData((prev) => ({ ...prev, agreementLanguage: language }));
  const setDescription = (desc: string) =>
    setContractData((prev) => ({ ...prev, description: desc }));
  const setParties = (ps: { fullName: string; phone: string; email: string }[]) =>
    setContractData((prev) => ({ ...prev, parties: ps }));
  const setCommonDetails = (details: ContractData["commonDetails"]) =>
    setContractData((prev) => ({ ...prev, commonDetails: details }));
  const setSpecificDetails = (details: NonNullable<ContractData["specificDetails"]>) =>
    setContractData((prev) => ({ ...prev, specificDetails: details }));

  const handleNext = (data: Partial<ContractData>) => {
    setContractData((prev) => ({ ...prev, ...data }));

    if (currentStep === 1) {
      setIsCheckingComplexity(true);
      setTimeout(() => {
        setIsCheckingComplexity(false);
        setCurrentStep(currentStep + 1);
      }, 1000);
    } else if (currentStep === 4) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 5) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.success(t[lang].finish);
      if (onBackToDashboard) onBackToDashboard();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else if (onBackToDashboard) onBackToDashboard();
  };

  const handleLanguageToggle = () => {
    setLang(lang === "en" ? "am" : "en");
  };

  const validateAndGetStepData = (): Partial<ContractData> | null => {
    switch (currentStep) {
      case 0: // ChooseContractType
        if (!contractData.contractType) {
          toast.error(t[lang].error);
          return null;
        }
        return { contractType: contractData.contractType };
      case 1: // LanguageAndDescription
        if (!contractData.description?.trim()) {
          toast.error(t[lang].error);
          return null;
        }
        return {
          agreementLanguage: contractData.agreementLanguage,
          description: contractData.description,
        };
      case 2: // PartiesInformation
        if (
          !contractData.parties ||
          contractData.parties.some(
            (party) => !party.fullName || !party.phone || !party.email
          )
        ) {
          toast.error(t[lang].error);
          return null;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (contractData.parties.some((party) => !emailRegex.test(party.email))) {
          toast.error(t[lang].invalidEmail);
          return null;
        }
        return { parties: contractData.parties };
      case 3: // CommonDetails
        if (
          !contractData.commonDetails?.location ||
          !contractData.commonDetails?.totalAmount ||
          !contractData.commonDetails?.startDate ||
          !contractData.commonDetails?.endDate
        ) {
          toast.error(t[lang].error);
          return null;
        }
        return { commonDetails: contractData.commonDetails };
      case 4: // SpecificDetails
        if (
          contractData.contractType === "service" &&
          !contractData.specificDetails?.servicesDescription?.trim()
        ) {
          toast.error(t[lang].error);
          return null;
        }
        if (
          contractData.contractType === "goods" &&
          (!contractData.specificDetails?.items || contractData.specificDetails.items.length === 0)
        ) {
          toast.error(t[lang].error);
          return null;
        }
        if (contractData.contractType === "loan" && !contractData.specificDetails?.principalAmount) {
          toast.error(t[lang].error);
          return null;
        }
        if (contractData.contractType === "nda" && !contractData.specificDetails?.purpose?.trim()) {
          toast.error(t[lang].error);
          return null;
        }
        return { specificDetails: contractData.specificDetails };
      default:
        return {};
    }
  };

  const handleFooterNext = () => {
    const data = validateAndGetStepData();
    if (data) {
      handleNext(data);
    }
  };

  if (isCheckingComplexity) {
    return (
      <div
        className={`h-full flex flex-col bg-gray-100 ${
          lang === "am" ? "font-ethiopic" : ""
        }`}
      >
        <div className="px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t[lang].back}
          </Button>
          <h1 className="text-xl font-semibold">{t[lang].title}</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
              <p className="mt-4 text-lg text-gray-700">
                {lang === "en"
                  ? "Checking complexity..."
                  : "ውስብስብነት በመፈተሽ ላይ..."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-full p-5 flex flex-col bg-gray-50 ${
        lang === "am" ? "font-ethiopic" : ""
      }`}
    >
      {/* Header */}
      <div className="flex py-10 items-center justify-between">
        <h1 className="text-xl px-10 font-semibold">{t[lang].title}</h1>
        <Button
          variant="ghost"
          className="cursor-pointer"
          size="sm"
          onClick={handleLanguageToggle}
        >
          <Globe className="h-4 w-4 mr-2" />
          {lang === "en" ? "አማርኛ" : "English"}
        </Button>
      </div>

      {/* Step indicator */}
      <div className="">
        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-auto">
        {currentStep === 0 && (
          <ChooseContractType
            currentLanguage={lang}
            contractType={contractData.contractType || ""}
            setContractType={setContractType}
          />
        )}
        {currentStep === 1 && (
          <LanguageAndDescription
            currentLanguage={lang}
            agreementLanguage={contractData.agreementLanguage || "en"}
            setAgreementLanguage={setAgreementLanguage}
            description={contractData.description || ""}
            setDescription={setDescription}
          />
        )}
        {currentStep === 2 && (
          <PartiesInformation
            currentLanguage={lang}
            contractType={contractData.contractType}
            parties={contractData.parties || [
              { fullName: "", phone: "", email: "" },
              { fullName: "", phone: "", email: "" },
            ]}
            setParties={setParties}
          />
        )}
        {currentStep === 3 && (
          <CommonDetails
            currentLanguage={lang}
            contractType={contractData.contractType}
            commonDetails={
              contractData.commonDetails || {
                location: "",
                totalAmount: 0,
                currency: "ETB",
                startDate: "",
                endDate: "",
                dueDates: [],
              }
            }
            setCommonDetails={setCommonDetails}
          />
        )}
        {currentStep === 4 && (
          <SpecificDetails
            currentLanguage={lang}
            contractType={contractData.contractType}
            specificDetails={contractData.specificDetails || {}}
            setSpecificDetails={setSpecificDetails}
            contract={contractData}
          />
        )}
        {currentStep === 5 && (
          <AIDraftPreview
            contractData={contractData}
            draftedData={intialDraftdata}
            setDraftedData={setIntialDraftdata}
          />
        )}
        {currentStep === 6 && (
          <FinalPreview
            draftedData={intialDraftdata}
          />
        )}
      </div>

      {/* Footer navigation */}
      <div className="px-6 py-4 flex justify-between">
        <Button
          className="cursor-pointer hover:bg-gray-200"
          variant="ghost"
          size="sm"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t[lang].back}
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button
            onClick={handleFooterNext}
            className="bg-gray-600 hover:bg-gray-700 text-white cursor-pointer"
          >
            {t[lang].next}
          </Button>
        ) : (
          <Button
            onClick={() => handleNext({})}
            className="bg-slate-800 hover:bg-slate-700 text-white"
          >
            {t[lang].finish}
          </Button>
        )}
      </div>
    </div>
  );
}
// ----------------- Snippets for comparison -----------------