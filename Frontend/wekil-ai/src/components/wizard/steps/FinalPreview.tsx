"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Globe, Download, Send, FileText, AlertTriangle } from "lucide-react";
import { ContractData, Language } from "@/components/wizard/ContractWizard";
import { toast } from "sonner";

interface FinalPreviewProps {
  currentLanguage: Language;
  contractData: Partial<ContractData>;
}

export function FinalPreview({
  currentLanguage,
  contractData,
}: FinalPreviewProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [previewLanguage, setPreviewLanguage] = useState(currentLanguage);

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

  const getContractTitle = () => {
    if (previewLanguage === "en") {
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
    if (previewLanguage === "en") {
      return `This agreement is between ${
        parties[0]?.fullName || "Party A"
      } and ${parties[1]?.fullName || "Party B"}.`;
    } else {
      return `ይህ ስምምነት በ${parties[0]?.fullName || "የመጀመሪያ ወገን"} እና በ${
        parties[1]?.fullName || "ሁለተኛ ወገን"
      } መካከል ነው።`;
    }
  };

  const getTermsSection = () => {
    const common = contractData.commonDetails;
    if (!common) return "";

    if (previewLanguage === "en") {
      return `The total amount is ${common.totalAmount} ${common.currency}, effective from ${common.startDate} to ${common.endDate}.`;
    } else {
      return `ጠቅላላ መጠኑ ${common.totalAmount} ${common.currency} ሲሆን ከ${common.startDate} እስከ ${common.endDate} ድረስ የሚሰራ ነው።`;
    }
  };

  const handleSaveDraft = () => {
    toast.success(
      previewLanguage === "en"
        ? "Draft saved successfully!"
        : "ረቂቁ በተሳካ ሁኔታ ተቀምጧል!"
    );
  };

  const handleExport = () => {
    toast.success(
      previewLanguage === "en"
        ? "Contract exported successfully!"
        : "ውሉ በተሳካ ሁኔታ ወደ ውጭ ተልኳል!"
    );
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
        <Card>
          <CardHeader>
            <CardTitle>{getContractTitle()}</CardTitle>
            <CardDescription>
              {t.language}: {previewLanguage === "en" ? "English" : "አማርኛ"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold">{t.parties}</h3>
              <p className="text-sm leading-relaxed">{getPartiesSection()}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">{t.terms}</h3>
              <p className="text-sm leading-relaxed">{getTermsSection()}</p>
            </div>

            {contractData.description && (
              <div className="space-y-2">
                <h3 className="font-semibold">{t.descriptions}</h3>
                <p className="text-sm leading-relaxed">
                  {contractData.description}
                </p>
              </div>
            )}

            <div className="pt-6 border-t">
              <h3 className="font-semibold mb-4">{t.signatures}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>
                    {previewLanguage === "en"
                      ? "Party A Signature"
                      : "የመጀመሪያ ወገን ፊርማ"}
                  </Label>
                  <div className="h-16 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                    {previewLanguage === "en" ? "Signature Line" : "የፊርማ መስመር"}
                  </div>
                </div>
                <div>
                  <Label>
                    {previewLanguage === "en"
                      ? "Party B Signature"
                      : "የሁለተኛ ወገን ፊርማ"}
                  </Label>
                  <div className="h-16 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                    {previewLanguage === "en" ? "Signature Line" : "የፊርማ መስመር"}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label>
                    {t.place}: {contractData.commonDetails?.location || ""}
                  </Label>
                </div>
                <div>
                  <Label>
                    {t.date}: {new Date().toISOString().split("T")[0]}
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
        <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
          <FileText className="w-4 h-4" />
          {t.saveDraft}
        </Button>
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" />
          {t.export}
        </Button>
        <Button onClick={handleShare} className="gap-2">
          <Send className="w-4 h-4" />
          {t.share}
        </Button>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium mb-2">{children}</p>;
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
      className={`animate-spin ${className}`}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
