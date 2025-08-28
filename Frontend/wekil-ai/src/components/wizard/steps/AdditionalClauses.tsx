"use client";
import React from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import type { ContractData, Language } from "@/components/wizard/ContractWizard";

interface AdditionalClausesProps {
  data: ContractData;
  onUpdate: (data: Partial<ContractData>) => void;
  currentLanguage: Language; // Add this prop
}

const texts = {
  english: {
    title: "Additional Clauses",
    subtitle: "Add optional clauses to strengthen your agreement",
    lateFee: "Late Fee Penalty",
    lateFeeDesc: "Percentage charged for late payments",
    revisionLimit: "Revision Limit",
    revisionLimitDesc: "Maximum number of revisions allowed",
    confidentiality: "Confidentiality Clause",
    confidentialityDesc: "Include non-disclosure terms",
    cancellation: "Cancellation Clause",
    cancellationDesc: "Allow cancellation under specific conditions",
  },
  amharic: {
    title: "ተጨማሪ አንቀጾች",
    subtitle: "ስምምነትዎን ለማጠንከር አማራጭ አንቀጾችን ይጨምሩ",
    lateFee: "የዘግይቶ ክፍያ ቅጣት",
    lateFeeDesc: "ለዘግይቶ ክፍያ የሚከፈል መቶኛ",
    revisionLimit: "የክለሳ ገደብ",
    revisionLimitDesc: "የሚፈቀድ ከፍተኛ የክለሳ ብዛት",
    confidentiality: "የምስጢር አንቀጽ",
    confidentialityDesc: "የምስጢር ያልሆኑ ውሎችን ያካትቱ",
    cancellation: "የመሰረዣ አንቀጽ",
    cancellationDesc: "በተወሰኑ ሁኔታዎች መሰረዝ ይፈቀዳል",
  },
};

export function AdditionalClauses({ data, onUpdate, currentLanguage }: AdditionalClausesProps) {
  const t = texts[currentLanguage];
  const updateAdditionalClauses = (field: string, value: string | boolean) => {
    onUpdate({
      additionalClauses: { ...data.additionalClauses, [field]: value },
    });
  };

  return (
    <div className={`max-w-2xl mx-auto p-6 ${currentLanguage === "amharic" ? "font-ethiopic" : ""}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4 bg-white">
          <div className="space-y-3">
          <Label htmlFor="late-fee">{t.lateFee}</Label>
          <Input
          id="late-fee"
          placeholder="5"
          value={data.additionalClauses.lateFee}
          onChange={(e) => updateAdditionalClauses("lateFee", e.target.value)}
          />
          <p className="text-sm text-gray-500">{t.lateFeeDesc}</p>
          </div>
          </Card>

          <Card className="p-4 bg-white">
          <div className="space-y-3">
          <Label htmlFor="revision-limit">{t.revisionLimit}</Label>
          <Input
          id="revision-limit"
          placeholder="3"
          value={data.additionalClauses.revisionLimit}
          onChange={(e) => updateAdditionalClauses("revisionLimit", e.target.value)}
          />
          <p className="text-sm text-gray-500">{t.revisionLimitDesc}</p>
          </div>
          </Card>
        </div>

        <Card className="p-4 bg-white">
        <div className="flex items-center justify-between">
        <div>
        <Label htmlFor="confidentiality">{t.confidentiality}</Label>
        <p className="text-sm text-gray-500">{t.confidentialityDesc}</p>
        </div>
        <Switch
        id="confidentiality"
        checked={data.additionalClauses.confidentialityClause}
        onCheckedChange={(checked: boolean) => updateAdditionalClauses("confidentialityClause", checked)}
        />
        </div>
        </Card>

        <Card className="p-4 bg-white">
        <div className="flex items-center justify-between">
        <div>
        <Label htmlFor="cancellation">{t.cancellation}</Label>
        <p className="text-sm text-gray-500">{t.cancellationDesc}</p>
        </div>
        <Switch
        id="cancellation"
        checked={data.additionalClauses.cancellationClause}
        onCheckedChange={(checked: boolean) => updateAdditionalClauses("cancellationClause", checked)}
        />
        </div>
        </Card>
      </div>
    </div>
  );
}