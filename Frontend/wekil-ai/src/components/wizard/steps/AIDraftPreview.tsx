"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Loader2, Bot, Edit3, Send, Eye } from "lucide-react";
import { ContractData, Language } from "@/components/wizard/ContractWizard";
import { toast } from "sonner";

interface AIDraftPreviewProps {
  currentLanguage: Language;
  contractData: Partial<ContractData>;
}

interface DraftSection {
  heading: string;
  text: string;
}

interface Draft {
  title: string;
  sections: DraftSection[];
  signatures: {
    partyA: string;
    partyB: string;
    place: string;
    date: string;
  };
}

export function AIDraftPreview({
  currentLanguage,
  contractData,
}: AIDraftPreviewProps) {
  const [aiDraft, setAiDraft] = useState<Draft | null>(null);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [reprompt, setReprompt] = useState("");
  const [isReprompting, setIsReprompting] = useState(false);

  const texts = {
    en: {
      title: "AI Draft Preview",
      description: "Review the AI-generated draft and make adjustments",
      viewMode: "View Mode",
      editMode: "Edit Mode",
      repromptPlaceholder:
        "Describe changes you want to make to the agreement...",
      sendPrompt: "Update Draft",
      generating: "Generating Draft...",
      updating: "Updating Draft...",
      disclaimer: "NOT LEGAL ADVICE",
      disclaimerText:
        "This agreement is generated for informational purposes only and does not constitute legal advice.",
    },
    am: {
      title: "AI ረቂቅ ቅድመ እይታ",
      description: "AI የተፈጠረውን ረቂቅ ይገምግሙ እና ማስተካከያዎች ያድርጉ",
      viewMode: "የመመልከቻ ሁነታ",
      editMode: "የማርም ሁነታ",
      repromptPlaceholder: "በስምምነቱ ላይ ማድረግ የሚፈልጉት ለውጦች ይግለጹ...",
      sendPrompt: "ረቂቁን አዘምን",
      generating: "ረቂቅ በመፍጠር ላይ...",
      updating: "ረቂቅ በማዘመን ላይ...",
      disclaimer: "የሕግ ምክር አይደለም",
      disclaimerText: "ይህ ስምምነት ለመረጃ አላማ ብቻ የተዘጋጀ ሲሆን የሕግ ምክር አይወክልም።",
    },
  };

  const t = texts[currentLanguage];

  // Memoized function to generate AI draft
  const generateDraft = useCallback(async () => {
    setIsGeneratingDraft(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mockDraft: Draft = {
      title: getContractTitle(),
      sections: [
        {
          heading: currentLanguage === "en" ? "Parties" : "ተሳታፊዎች",
          text: getPartiesSection(),
        },
        {
          heading: currentLanguage === "en" ? "Terms" : "ውሎች",
          text: getTermsSection(),
        },
        {
          heading: currentLanguage === "en" ? "Description" : "መግለጫ",
          text: contractData.description || "",
        },
      ],
      signatures: {
        partyA: "",
        partyB: "",
        place: contractData.commonDetails?.location || "",
        date: new Date().toISOString().split("T")[0],
      },
    };

    setAiDraft(mockDraft);
    setIsGeneratingDraft(false);
  }, [contractData, currentLanguage]);

  const getContractTitle = () => {
    if (currentLanguage === "en") {
      switch (contractData.contractType) {
        case "service":
          return "Service Agreement";
        case "goods":
          return "Sale of Goods Agreement";
        case "loan":
          return "Loan Agreement";
        case "nda":
          return "Non-Disclosure Agreement";
        default:
          return "Contract Agreement";
      }
    } else {
      switch (contractData.contractType) {
        case "service":
          return "የአገልግሎት ስምምነት";
        case "goods":
          return "የዕቃ ሽያጭ ስምምነት";
        case "loan":
          return "የብድር ስምምነት";
        case "nda":
          return "የሚስጥር ጥበቃ ስምምነት";
        default:
          return "የውል ስምምነት";
      }
    }
  };

  const getPartiesSection = () => {
    const parties = contractData.parties || [];
    if (currentLanguage === "en") {
      return `This agreement is between ${
        parties[0]?.fullName || "Party A"
      } and ${parties[1]?.fullName || "Party B"}.`;
    } else {
      return `ይህ ስምምነት በ${parties[0]?.fullName || "የመጀመሪያ ወገን"} እና ${
        parties[1]?.fullName || "ሁለተኛ ወገን"
      } መካከል ነው።`;
    }
  };

  const getTermsSection = () => {
    const common = contractData.commonDetails;
    if (!common) return "";

    if (currentLanguage === "en") {
      return `The total amount is ${common.totalAmount} ${common.currency}, effective from ${common.startDate} to ${common.endDate}.`;
    } else {
      return `ጠቅላላ መጠኑ ${common.totalAmount} ${common.currency} ሲሆን ከ${common.startDate} እስከ ${common.endDate} ድረስ የሚሰራ ነው።`;
    }
  };

  const updateDraftWithPrompt = async () => {
    setIsReprompting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (aiDraft) {
      const updatedDraft = {
        ...aiDraft,
        sections: aiDraft.sections.map((section) => ({
          ...section,
          text: section.text + ` [Updated based on: ${reprompt}]`,
        })),
      };
      setAiDraft(updatedDraft);
    }

    setReprompt("");
    setIsReprompting(false);
    toast.success(
      currentLanguage === "en"
        ? "Draft updated successfully!"
        : "ረቂቁ በተሳካ ሁኔታ ተዘምኗል!"
    );
  };

  useEffect(() => {
    generateDraft();
  });

  if (isGeneratingDraft) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-teal-500" />
          <h3 className="text-lg font-medium">{t.generating}</h3>
          <p className="text-muted-foreground">
            {currentLanguage === "en"
              ? "Please wait while we generate your agreement..."
              : "እባክዎ ውልዎን እያመነጨን ያለን ይጠብቁ..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{t.title}</h2>
        <p className="text-muted-foreground">{t.description}</p>
      </div>

      {aiDraft && (
        <div className="space-y-6">
          <div className="flex gap-2">
            <Button
              variant={!isEditMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditMode(false)}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              {t.viewMode}
            </Button>
            <Button
              variant={isEditMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditMode(true)}
              className="gap-2"
            >
              <Edit3 className="w-4 h-4" />
              {t.editMode}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{aiDraft.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {aiDraft.sections.map((section, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-semibold">{section.heading}</h3>
                  {isEditMode ? (
                    <Textarea
                      value={section.text}
                      onChange={(e) => {
                        const newDraft = { ...aiDraft };
                        newDraft.sections[index].text = e.target.value;
                        setAiDraft(newDraft);
                      }}
                      className="min-h-24"
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">{section.text}</p>
                  )}
                </div>
              ))}

              <div className="pt-6 border-t">
                <h3 className="font-semibold mb-4">
                  {currentLanguage === "en" ? "Signatures" : "ፊርማዎች"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>
                      {currentLanguage === "en"
                        ? "Party A Signature"
                        : "የመጀመሪያ ወገን ፊርማ"}
                    </Label>
                    <div className="h-16 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                      {currentLanguage === "en"
                        ? "Signature Line"
                        : "የፊርማ መስመር"}
                    </div>
                  </div>
                  <div>
                    <Label>
                      {currentLanguage === "en"
                        ? "Party B Signature"
                        : "የሁለተኛ ወገን ፊርማ"}
                    </Label>
                    <div className="h-16 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                      {currentLanguage === "en"
                        ? "Signature Line"
                        : "የፊርማ መስመር"}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label>
                      {currentLanguage === "en" ? "Place:" : "ቦታ:"}{" "}
                      {aiDraft.signatures.place}
                    </Label>
                  </div>
                  <div>
                    <Label>
                      {currentLanguage === "en" ? "Date:" : "ቀን:"}{" "}
                      {aiDraft.signatures.date}
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                {currentLanguage === "en" ? "AI Assistant" : "AI ረዳት"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  {currentLanguage === "en"
                    ? "Ask AI to modify the agreement"
                    : "AI ን ውሉን እንዲሻሻል ይጠይቁ"}
                </Label>
                <Textarea
                  value={reprompt}
                  onChange={(e) => setReprompt(e.target.value)}
                  placeholder={t.repromptPlaceholder}
                  className="min-h-24"
                />
              </div>
              <Button
                onClick={updateDraftWithPrompt}
                disabled={!reprompt.trim() || isReprompting}
                className="gap-2"
              >
                {isReprompting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t.updating}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {t.sendPrompt}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-orange-800 mb-1">{t.disclaimer}</h4>
            <p className="text-sm text-orange-700">{t.disclaimerText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium mb-2">{children}</p>;
}

function AlertTriangle({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
