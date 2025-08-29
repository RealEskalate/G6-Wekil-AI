"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Language, ContractData } from "@/components/wizard/ContractWizard";

interface ChooseContractTypeProps {
  currentLanguage: Language;
  onNext: (data: Partial<ContractData>) => void;
}

export default function ChooseContractType({ currentLanguage, onNext }: ChooseContractTypeProps) {
  const [contractType, setContractType] = useState("");
  const t = {
    en: {
      title: "Choose Contract Type",
      selectLabel: "Select contract type",
      next: "Next",
      error: "Please select a contract type",
    },
    am: {
      title: "የውል አይነት ይምረጡ",
      selectLabel: "የውል አይነት ይምረጡ",
      next: "ቀጣይ",
      error: "እባክዎ የውል አይነት ይምረጡ",
    },
  }[currentLanguage];

  const handleNext = () => {
    if (!contractType) {
      toast.error(t.error);
      return;
    }
    onNext({ contractType });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={setContractType} value={contractType}>
          <SelectTrigger>
            <SelectValue placeholder={t.selectLabel} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="service">Service Agreement</SelectItem>
            <SelectItem value="goods">Sale of Goods</SelectItem>
            <SelectItem value="loan">Simple Loan</SelectItem>
            <SelectItem value="nda">Non-Disclosure Agreement</SelectItem>
          </SelectContent>
        </Select>
        <Button className="mt-4" onClick={handleNext}>
          {t.next}
        </Button>
      </CardContent>
    </Card>
  );
}