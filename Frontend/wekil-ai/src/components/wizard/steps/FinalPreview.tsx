"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Globe, Download, Send, FileText, AlertTriangle } from "lucide-react";
import { ContractData, Language } from "@/components/wizard/ContractWizard";
import { toast } from "sonner";
import ContractPreview from "@/components/ContractPreview/ContractPreview";
import { ContractDraft } from "@/types/Contracttype";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { createAgreement } from "@/lib/redux/slices/agreementsSlice";
import { useSession } from "next-auth/react";

interface FinalPreviewProps {
  currentLanguage: Language;
  draftedData: ContractDraft;
  contractData: ContractData;
}

export function FinalPreview({
  currentLanguage,
  draftedData,
  contractData,
}: FinalPreviewProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [previewLanguage, setPreviewLanguage] = useState(currentLanguage);
  const [isExporting, setIsExporting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const accessToken = session?.user?.accessToken;

  const texts = {
    en: {
      title: "Final Preview",
      description: "Review your final agreement",
      saveDraft: "Save as Draft",
      export: "Export",
      share: "Share",
      disclaimer: "NOT LEGAL ADVICE",
      disclaimerText:
        "This contract is generated for informational purposes only and does not constitute legal advice.",
      language: "Language",
      contractType: "Contract Type",
      parties: "Parties",
      terms: "Terms",
      descriptions: "Description",
      signatures: "Signatures",
      place: "Place",
      date: "Date",
    },
    am: {
      title: "ፍጻሜ ቅድመ እይታ",
      description: "የመጨረሻ ስምምነትዎን ይገምግሙ",
      saveDraft: "እንደ ረቂቅ አስቀምጥ",
      export: "ወደ ውጭ ላክ",
      share: "አጋራ",
      disclaimer: "የሕግ ምክር አይደለም",
      disclaimerText: "ይህ ውል ለመረጃ አላማ ብቻ የተዘጋጀ ሲሆን የሕግ ምክር አይወክልም።",
      language: "ቋንቋ",
      contractType: "የውል አይነት",
      parties: "ወገኖች",
      terms: "ውሎች",
      descriptions: "መግለጫ",
      signatures: "ፊርማዎች",
      place: "ቦታ",
      date: "ቀን",
    },
  };

  const t = texts[previewLanguage];

  const translateAgreement = async () => {
    setIsTranslating(true);
    // Simulate translation API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setPreviewLanguage((prev) => (prev === "en" ? "am" : "en"));
    setIsTranslating(false);
    toast.success(
      previewLanguage === "en"
        ? "Agreement translated to Amharic"
        : "ስምምነቱ ወደ እንግሊዘኛ ተተርጉሟል"
    );
  };

  const handleSaveDraft = () => {
    if (!accessToken) {
      toast.error("You must be logged in to save a draft");
      return;
    }
    const result = dispatch(
      createAgreement({
        agreementData: {
          pdf_url: "",
          status: "pending",
          draft: {
            title: draftedData.title,
            sections: draftedData.sections.map((section) => ({
              heading: section.heading,
              text: section.description,
            })),
          },
          party_a: {
            name: contractData.parties?.[0]?.fullName ?? "",
            email: contractData.parties?.[0]?.email ?? "",
            phone: contractData.parties?.[0]?.phone ?? "",
          },
          party_b: {
            name: contractData.parties?.[1]?.fullName ?? "",
            email: contractData.parties?.[1]?.email ?? "",
            phone: contractData.parties?.[1]?.phone ?? "",
          },
        },
        token: accessToken,
      })
    );

    console.log("Save draft result:", result);
    toast.success(
      previewLanguage === "en"
        ? "Draft saved successfully!"
        : "ረቂቁ በተሳካ ሁኔታ ተቀምጧል!"
    );
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/pdfDraft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(draftedData),
      });
      const data = await response.json();

      if (data.file) {
        const response = await fetch(data.file);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "contract.pdf";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success(
          previewLanguage === "en"
            ? "Contract exported successfully!"
            : "ውሉ በተሳካ ሁኔታ ወደ ውጭ ተልኳል!"
        );
      }
    } catch (error) {
      console.log(error);
    }
    setIsExporting(false);
  };

  const handleShare = () => {
    toast.success(
      previewLanguage === "en"
        ? "Contract shared successfully!"
        : "ውሉ በተሳካ ሁኔታ ተጋርቷል!"
    );
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">{t.title}</h2>
          <p className="text-muted-foreground">{t.description}</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={translateAgreement}
          disabled={isTranslating}
          className="gap-2"
        >
          <Globe className="w-4 h-4" />
          {previewLanguage === "en" ? "አማርኛ" : "English"}
        </Button>
      </div>

      {isTranslating ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-teal-500" />
            <h3 className="text-lg font-medium">
              {previewLanguage === "en"
                ? "Translating Agreement..."
                : "ስምምነቱ በትርጉም ላይ..."}
            </h3>
            <p className="text-muted-foreground">
              {previewLanguage === "en"
                ? "Please wait while we translate your agreement..."
                : "እባክዎ ስምምነትዎን እያተረጎምን ያለን ይጠብቁ..."}
            </p>
          </div>
        </div>
      ) : (
        <div className="">
          <ContractPreview data={draftedData} />
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

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={handleSaveDraft} className="gap-2 ">
          <FileText className="w-4 h-4" />
          {t.saveDraft}
        </Button>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={isExporting}
          className="gap-2 disabled"
        >
          {!isExporting ? (
            <>
              <Download className="w-4 h-4" />
              {t.export}
            </>
          ) : (
            <span className="w-32 flex items-center">
              <Loader2 /> Exporting...
            </span>
          )}
        </Button>
        <Button onClick={handleShare} className="gap-2">
          <Send className="w-4 h-4" />
          {t.share}
        </Button>
      </div>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
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
      className={`animate-spin ${className} mx-2`}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
