"use client";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import type { ContractData, Language } from "@/components/wizard/ContractWizard";

interface DealTermsProps {
  data: ContractData;
  onUpdate: (data: Partial<ContractData>) => void;
  currentLanguage: Language;
}

const texts = {
  english: {
    title: "Deal Terms",
    subtitle: "Enter the financial and timeline details",
    amount: "Amount",
    currency: "Currency",
    startDate: "Start Date",
    endDate: "End Date",
    description: "Description/Details",
    descriptionPlaceholder: "Enter details...",
  },
  amharic: {
    title: "የስምምነት ውሎች",
    subtitle: "የገንዘብ እና የጊዜ መስመር ዝርዝሮችን ያስገቡ",
    amount: "መጠን",
    currency: "ገንዘብ አይነት",
    startDate: "የመጀመሪያ ቀን",
    endDate: "መጨረሻ ቀን",
    description: "መግለጫ/ዝርዝሮች",
    descriptionPlaceholder: "ዝርዝሮችን ያስገቡ...",
  },
};

export function DealTerms({ data, onUpdate, currentLanguage }: DealTermsProps) {
  const t = texts[currentLanguage];

  const updateDealTerms = (field: string, value: string) => {
    onUpdate({
      dealTerms: { ...data.dealTerms, [field]: value },
    });
  };

  return (
    <div className={`max-w-2xl mx-auto p-6 ${currentLanguage === "amharic" ? "font-ethiopic" : ""}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      <Card className="p-6 bg-white">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">{t.amount}</Label>
              <div className="flex gap-2">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={data.dealTerms.amount}
                  onChange={(e) => updateDealTerms("amount", e.target.value)}
                />
                <Select
                  value={data.dealTerms.currency}
                  onValueChange={(value: string) => updateDealTerms("currency", value)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETB">ETB</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="start-date">{t.startDate}</Label>
              <Input
                id="start-date"
                type="date"
                value={data.dealTerms.startDate}
                onChange={(e) => updateDealTerms("startDate", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="end-date">{t.endDate}</Label>
            <Input
              id="end-date"
              type="date"
              value={data.dealTerms.endDate}
              onChange={(e) => updateDealTerms("endDate", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">{t.description}</Label>
            <Textarea
              id="description"
              placeholder={t.descriptionPlaceholder}
              rows={4}
              value={data.dealTerms.description}
              onChange={(e) => updateDealTerms("description", e.target.value)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}