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
import {
  AIDraftPreview,
  getFullDraftText,
} from "@/components/wizard/steps/AIDraftPreview";
import { FinalPreview } from "@/components/wizard/steps/FinalPreview";
import { useLanguage } from "@/context/LanguageContext";
import WeKilAILoader from "../ui/WekilAILoader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import {
  classifyApi,
  finalPreview,
  generateDraft,
} from "@/lib/redux/slices/aiSlice";
import {
  ApiContractDraft,
  convertContractFormatToIntake,
  convertInterfaceContractDraft,
} from "@/types/BackendTypes";
import { ContractDraft } from "@/types/Contracttype";

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
  id: string;
  contractType?: string;
  agreementLanguage?: Language;
  description?: string;
  parties?: {
    fullName: string;
    phone: string;
    email: string;
    address?: string;
  }[];
  commonDetails: CommonDetail;
  specificDetails?: {
    //service
    servicesDescription?: string;
    milestones?: { description: string; date: string }[];
    revisions?: number;

    // sales
    items?: { description: string; quantity: number; unitPrice: number }[];
    deliveryTerms?: string;

    //loan
    principalAmount?: number;
    installments?: { amount: number; dueDate: string }[];
    lateFeePercentage?: number;

    //nda
    effectiveDate?: string;
    confidentialityPeriod?: number;
    purpose?: string;
    isMutual?: boolean;
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

// ✅ Safe for Next.js + TS
const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Operation timed out"));
    }, ms);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

export function ContractWizard({ onBackToDashboard }: ContractWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { lang, setLang } = useLanguage();
  const [contractData, setContractData] = useState<Partial<ContractData>>({});
  const [isCheckingComplexity, setIsCheckingComplexity] = useState(false);
  const { status } = useSession();

  // Step-specific state
  const [contractType, setContractType] = useState<string>("");
  const [parties, setParties] = useState<
    { fullName: string; phone: string; email: string }[]
  >([
    { fullName: "", phone: "", email: "" },
    { fullName: "", phone: "", email: "" },
  ]);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const router = useRouter();
  const [agreementLanguage, setAgreementLanguage] = useState<Language>("en");
  const [intialDraftdata, setIntialDraftdata] = useState<ContractDraft>();
  const [description, setDescription] = useState<string>("");
  const [commonDetails, setCommonDetails] = useState<
    ContractData["commonDetails"]
  >({
    location: "",
    totalAmount: 0,
    currency: "ETB",
    startDate: "",
    endDate: "",
    dueDates: [],
  });
  const [isNextLoading, setIsNextLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [specificDetails, setSpecificDetails] = useState<
    NonNullable<ContractData["specificDetails"]>
  >({});

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
    { id: "parties", label: lang === "en" ? "Parties" : "ተዋዋዮች", icon: Users },
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

  const handleNext = async (data: Partial<ContractData>) => {
    setContractData({ ...contractData, ...data });

    if (currentStep === 1) {
      setIsCheckingComplexity(true);

      try {
        await withTimeout(
          (async () => {
            const res = await dispatch(
              classifyApi({ text: description, language: agreementLanguage })
            );

            setIsCheckingComplexity(false);

            if (classifyApi.fulfilled.match(res) && res.payload) {
              const classification = (
                res.payload as {
                  data?: {
                    payload?: { category?: string; reasons?: string[] };
                  };
                }
              )?.data?.payload;

              const type = classification?.category;

              if (type === "basic") {
                toast.success("Your prompt is Basic");
                setCurrentStep((prev) => prev + 1);
              } else if (type) {
                toast.error(
                  `Your prompt is ${type} due to ${
                    classification?.reasons?.[0] ?? "unspecified reason"
                  }, please consult a lawyer.`
                );
              } else {
                toast.error("Invalid classification response");
              }
            } else {
              toast.error(
                (res as { payload?: { message?: string } }).payload?.message ??
                  "Classification failed"
              );
            }
          })(),
          6000
        );
      } catch (err) {
        toast.error("Server is Busy, Unable to classify it complexity")
        setIsCheckingComplexity(false)
      }
    } else if (currentStep === 4) {
      setContractData({
        ...contractData,
        specificDetails,
      });

      const intakeData = convertContractFormatToIntake(
        contractData as ContractData
      );

      let draftData: ApiContractDraft | undefined;
      let attempts = 0;

      const overallTimeout = 15000;

      try {
        await withTimeout(
          (async () => {
            while (attempts < 3) {
              attempts += 1;

              const resultAction = await dispatch(
                generateDraft({
                  intake: intakeData,
                  language: contractData.agreementLanguage,
                })
              );

              if (generateDraft.fulfilled.match(resultAction)) {
                draftData = (
                  resultAction.payload as { payload?: ApiContractDraft }
                )?.payload;

                if (draftData?.sections) {
                  const draft = convertInterfaceContractDraft(draftData);
                  setIntialDraftdata(draft);
                  toast.success("Draft generated successfully");
                  setCurrentStep((prev) => prev + 1);
                  return;
                }
              } else {
                toast.error(
                  (resultAction as { payload?: { message?: string } }).payload
                    ?.message ?? "Draft generation failed"
                );
              }
            }

            throw new Error("Draft generation failed");
          })(),
          overallTimeout
        );
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : "Server is busy. Please try again later."
        );
      }
    } else if (currentStep === 5) {
      const text = getFullDraftText(intialDraftdata!);

      try {
        await withTimeout(
          (async () => {
            const res = await dispatch(
              finalPreview({
                draft: text,
                parties: parties.map((item) => ({
                  name: item.fullName,
                  address: "",
                  email: item.email,
                })),
                language: agreementLanguage || "en",
              })
            );

            if (finalPreview.fulfilled.match(res) && res.payload) {
              const category = res.payload.classification.category;
              if (category !== "basic") {
                toast.error(
                  `Your agreement is classified as ${category}: ${res.payload.classification.reasons.join(
                    ", "
                  )}`
                );
              } else {
                toast.success("Your agreement is Basic");
              }
              setCurrentStep((prev) => prev + 1);
            } else {
              toast.error(
                (res as { payload?: { message?: string } })?.payload?.message ||
                  "Final preview failed"
              );
            }
          })(),
          12000
        );
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : "Server is busy. Please try again later."
        );
        const userWill = window.confirm(
          "We could not check the complexity of final draft would you like to pass with your own consent?"
        );
        if (userWill) {
          toast.success("You have passed with your own will");
          setCurrentStep((prev) => prev + 1);
        }
      }
    } else if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
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
        if (!contractType) {
          toast.error(t[lang].error);
          return null;
        }
        return { contractType };
      case 1: // LanguageAndDescription
        if (!description.trim()) {
          toast.error(t[lang].error);
          return null;
        }
        return { agreementLanguage, description };
      case 2: // PartiesInformation
        if (
          parties.some(
            (party) => !party.fullName || !party.phone || !party.email
          )
        ) {
          toast.error(t[lang].error);
          return null;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (parties.some((party) => !emailRegex.test(party.email))) {
          toast.error(t[lang].invalidEmail);
          return null;
        }
        return { parties };
      case 3: // CommonDetails
        if (
          !commonDetails?.location ||
          !commonDetails?.totalAmount ||
          !commonDetails?.startDate ||
          !commonDetails?.endDate
        ) {
          toast.error(t[lang].error);
          return null;
        }
        return { commonDetails };
      case 4: // SpecificDetails
        if (
          contractType === "service" &&
          !specificDetails?.servicesDescription?.trim()
        ) {
          toast.error(t[lang].error);
          return null;
        }
        if (
          contractType === "goods" &&
          (!specificDetails?.items || specificDetails.items.length === 0)
        ) {
          toast.error(t[lang].error);
          return null;
        }
        if (contractType === "loan" && !specificDetails?.principalAmount) {
          toast.error(t[lang].error);
          return null;
        }
        if (contractType === "nda" && !specificDetails?.purpose?.trim()) {
          toast.error(t[lang].error);
          return null;
        }
        return { specificDetails };
      default:
        return {};
    }
  };

  const handleFooterNext = async () => {
    const data = validateAndGetStepData();
    if (data) {
      setIsNextLoading(true);
      try {
        await handleNext(data); // always async now
      } finally {
        setIsNextLoading(false); // ensure reset
      }
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
      className={`h-full p-2 sm:p-5 flex flex-col bg-gray-50 ${
        lang === "am" ? "font-ethiopic" : ""
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row py-6 sm:py-10 items-center justify-between gap-4">
        <h1 className="text-lg sm:text-xl px-0 sm:px-10 font-semibold">
          {t[lang].title}
        </h1>
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
      <div className="w-full">
        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-auto mt-4">
        {currentStep === 0 && (
          <ChooseContractType
            currentLanguage={lang}
            contractType={contractType}
            setContractType={setContractType}
          />
        )}
        {currentStep === 1 && (
          <LanguageAndDescription
            currentLanguage={lang}
            agreementLanguage={agreementLanguage}
            setAgreementLanguage={setAgreementLanguage}
            description={description}
            setDescription={setDescription}
          />
        )}
        {currentStep === 2 && (
          <PartiesInformation
            currentLanguage={lang}
            contractType={contractData.contractType}
            parties={parties}
            setParties={setParties}
          />
        )}
        {currentStep === 3 && (
          <CommonDetails
            currentLanguage={lang}
            contractType={contractData.contractType}
            commonDetails={commonDetails}
            setCommonDetails={setCommonDetails}
          />
        )}
        {currentStep === 4 && (
          <SpecificDetails
            currentLanguage={lang}
            contractType={contractData.contractType}
            specificDetails={specificDetails}
            setSpecificDetails={setSpecificDetails}
          />
        )}
        {currentStep === 5 && (
          <AIDraftPreview
            currentLanguage={lang}
            contractData={contractData}
            draftedData={intialDraftdata!}
            setDraftedData={setIntialDraftdata}
          />
        )}
        {currentStep === 6 && (
          <FinalPreview
            currentLanguage={lang}
            draftedData={intialDraftdata!}
            contractData={contractData as ContractData}
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
          disabled={isNextLoading} // disable Back while loading if you want
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t[lang].back}
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button
            onClick={handleFooterNext}
            className="bg-gray-600 hover:bg-gray-700 text-white cursor-pointer flex items-center gap-2"
            disabled={isNextLoading}
          >
            {isNextLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              t[lang].next
            )}
          </Button>
        ) : (
          <Button
            onClick={() => handleNext({})}
            className="bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-2"
            disabled={isNextLoading}
          >
            {isNextLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              t[lang].finish
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
