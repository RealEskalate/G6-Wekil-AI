"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Language, ContractData } from "@/components/wizard/ContractWizard";

interface LanguageAndDescriptionProps {
  currentLanguage: Language;
  onNext: (data: Partial<ContractData>) => void;
}

export default function LanguageAndDescription({ currentLanguage, onNext }: LanguageAndDescriptionProps) {
  const [agreementLanguage, setAgreementLanguage] = useState<"en" | "am">("en");
  const [description, setDescription] = useState("");

  const t = {
    en: {
      title: "Language and Description",
      subtitle: "Choose the agreement language and describe your needs",
      languageLabel: "Agreement Language",
      languagePlaceholder: "Select language",
      descriptionLabel: "Describe the Agreement",
      descriptionPlaceholder: "Enter a brief description of the agreement",
      next: "Next",
      error: "Please select a language and enter a description",
    },
    am: {
      title: "ቋንቋ እና መግለጫ",
      subtitle: "የውሉን ቋንቋ ይምረጡ እና ፍላጎቶችዎን ይግለጹ",
      languageLabel: "የውል ቋንቋ",
      languagePlaceholder: "ቋንቋ ይምረጡ",
      descriptionLabel: "ውሉን ይግለጹ",
      descriptionPlaceholder: "የውሉን አጭር መግለጫ ያስገቡ",
      next: "ቀጣይ",
      error: "እባክዎ ቋንቋ ይምረጡ እና መግለጫ ያስገቡ",
    },
  }[currentLanguage];

  const handleNext = () => {
    if (!agreementLanguage || !description) {
      toast.error(t.error);
      return;
    }
    onNext({ agreementLanguage, description });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <p className="text-sm text-gray-600">{t.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t.languageLabel}</label>
          <Select onValueChange={setAgreementLanguage} value={agreementLanguage}>
            <SelectTrigger>
              <SelectValue placeholder={t.languagePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="am">Amharic</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t.descriptionLabel}</label>
          <Textarea
            placeholder={t.descriptionPlaceholder}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1"
          />
        </div>
        <Button onClick={handleNext}>{t.next}</Button>
      </CardContent>
    </Card>
  );
}