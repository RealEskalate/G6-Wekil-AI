"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Loader2, Bot, Edit3, Send, Eye } from "lucide-react";
import { ContractData, Language } from "@/components/wizard/ContractWizard";
import { toast } from "sonner";
import ContractPreview from "@/components/ContractPreview/ContractPreview";
import { ContractDraft } from "@/types/Contracttype";
import ContractDraftLoader from "@/components/ui/ContractDraftLoader";
import { updateDraftFromPrompt } from "@/lib/redux/slices/aiSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { Section } from "@/types/Contracttype";

interface AIDraftPreviewProps {
  currentLanguage: Language;
  contractData: Partial<ContractData>;
  draftedData: ContractDraft;
  setDraftedData: (item: ContractDraft) => void;
}

export const getFullDraftText = (draft: ContractDraft) => {
  let fullText = draft.title.replace(/<<.*?>>/g, "");

  draft.sections.forEach((section: Section) => {
    const heading = section.heading.replace(/<<.*?>>/g, "");
    const description = section.description.replace(/<<.*?>>/g, "");
    fullText += ` ${heading} ${description}`;
  });

  return fullText.trim();
};

export function AIDraftPreview({
  currentLanguage,
  contractData,
  draftedData,
  setDraftedData,
}: AIDraftPreviewProps) {
  const [aiDraft, setAiDraft] = useState<ContractDraft>(draftedData);
  const [isGeneratingDraft] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [reprompt, setReprompt] = useState("");
  const [isReprompting, setIsReprompting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

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

  const updateDraftWithPrompt = async () => {
    if (!aiDraft) return;
    setIsReprompting(true);

    try {
      const text = getFullDraftText(aiDraft);

      const resultAction = await dispatch(
        updateDraftFromPrompt({
          draft: text,
          prompt: reprompt,
          language:
            contractData.agreementLanguage === "en" ? "English" : "Amharic",
        })
      );

      if (updateDraftFromPrompt.fulfilled.match(resultAction)) {
        const backendContract = resultAction.payload;

        // Check if sections exist
        if (backendContract.sections && backendContract.sections.length > 0) {
          const updatedDraft: ContractDraft = {
            title: backendContract.title || aiDraft.title,
            party1: aiDraft.party1,
            party2: aiDraft.party2,
            sections: backendContract.sections.map((s) => ({
              heading: s.heading || "",
              description: s.text || "",
            })),
            sign1: backendContract.signatures.party_a || "",
            sign2: backendContract.signatures.party_b || "",
            place: backendContract.signatures.place || "",
            date: backendContract.signatures.date || "",
          };
          console.log(updatedDraft, "Updated Draft from AI");
          setAiDraft(updatedDraft);
          setDraftedData(updatedDraft);

          toast.success(
            currentLanguage === "en"
              ? "Draft updated successfully!"
              : "ረቂቁ በተሳካ ሁኔታ ተዘምኗል!"
          );
        } else {
          console.warn("Sections are null, retrying...");
          toast.error(
            currentLanguage === "en"
              ? "Failed to update draft. try to be more descriptive or continue with these data!."
              : "ረቂቁን ማዘመን አልተሳካም። ዝርዝር መግለጫ ለመስጠት ይሞክሩ ወይም በእነዚህ ውሂቦች ይቀጥሉ!"
          );
        }
      } else {
        console.error("Draft update failed:", resultAction);
      }
    } catch (err) {
      console.error("Error updating draft:", err);
      toast.error(
        currentLanguage === "en" ? "Failed to update draft" : "ረቂቁ ማዘመን አልተሳካም"
      );
    } finally {
      setReprompt("");
      setIsReprompting(false);
    }
  };

  if (isGeneratingDraft) {
    return <ContractDraftLoader currentLanguage={currentLanguage} />;
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
            <CardHeader>{getContractTitle()}</CardHeader>

            <CardContent className="space-y-6 margin-auto w-9/10 border border-gray-200">
              {isEditMode ? (
                <>
                  <label htmlFor="font-bold text-sm" className="">
                    title:
                  </label>
                  <input
                    className="min-h-8 font-semibold"
                    value={aiDraft.title}
                    onChange={(e) => {
                      setAiDraft({ ...aiDraft, title: e.target.value });
                      setDraftedData({ ...aiDraft, title: e.target.value });
                    }}
                  />
                </>
              ) : null}
              {isEditMode ? (
                aiDraft.sections.map((section, index) => (
                  <div key={index} className="space-y-2">
                    <input
                      className="min-h-8 font-semibold"
                      value={section.heading}
                      onChange={(e) => {
                        const newDraft = { ...aiDraft };
                        newDraft.sections[index].heading = e.target.value;
                        setAiDraft(newDraft);
                        setDraftedData(newDraft);
                      }}
                    />
                    <Textarea
                      value={section.description}
                      onChange={(e) => {
                        const newDraft = { ...aiDraft };
                        newDraft.sections[index].description = e.target.value;
                        setAiDraft(newDraft);
                        setDraftedData(newDraft);
                      }}
                      className="min-h-24"
                    />
                  </div>
                ))
              ) : (
                <ContractPreview data={aiDraft} />
              )}
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
