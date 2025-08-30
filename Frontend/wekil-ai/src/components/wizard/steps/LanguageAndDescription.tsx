"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Language } from "@/components/wizard/ContractWizard";

interface LanguageAndDescriptionProps {
  currentLanguage: Language;
  agreementLanguage: Language;
  setAgreementLanguage: (lang: Language) => void;
  description: string;
  setDescription: (desc: string) => void;
}

export function LanguageAndDescription({
  currentLanguage,
  agreementLanguage,
  setAgreementLanguage,
  description,
  setDescription,
}: LanguageAndDescriptionProps) {
  const t = {
    en: {
      title: "Language & Description",
      subtitle: "Select the agreement language and provide a description",
      languageLabel: "Agreement Language",
      descriptionLabel: "Description",
    },
    am: {
      title: "ቋንቋ እና መግለጫ",
      subtitle: "የስምምነቱን ቋንቋ ይምረጡ እና መግለጫ ያቅርቡ",
      languageLabel: "የስምምነት ቋንቋ",
      descriptionLabel: "መግለጫ",
    },
  }[currentLanguage];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <p className="text-sm text-gray-600">{t.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="agreement-language">{t.languageLabel}</Label>
          <select
            id="agreement-language"
            value={agreementLanguage}
            onChange={(e) => setAgreementLanguage(e.target.value as Language)}
            className="w-full border rounded-md p-2"
          >
            <option value="en">English</option>
            <option value="am">አማርኛ</option>
          </select>
        </div>
        <div>
          <Label htmlFor="description">{t.descriptionLabel}</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.descriptionLabel}
          />
        </div>
      </CardContent>
    </Card>
  );
}