"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Language, ContractData } from "@/components/wizard/ContractWizard";

interface CommonDetailsProps {
  currentLanguage: Language;
  onNext: (data: Partial<ContractData>) => void;
  contractType?: string;
}

export default function CommonDetails({ currentLanguage, onNext, contractType }: CommonDetailsProps) {
  const [location, setLocation] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [currency, setCurrency] = useState<"ETB" | "USD" | "EUR">("ETB");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dueDates, setDueDates] = useState<string[]>([""]);

  const t = {
    en: {
      title: "Common Details",
      subtitle: "Enter the basic agreement information",
      location: "Location",
      totalAmount: "Total Amount",
      currency: "Currency",
      startDate: "Start Date",
      endDate: "End Date",
      dueDate: "Due Date",
      addDueDate: "Add Due Date",
      next: "Next",
      error: "Please fill in all fields and at least one due date",
    },
    am: {
      title: "የጋራ ዝርዝሮች",
      subtitle: "መሠረታዊ የውል መረጃን ያስገቡ",
      location: "ቦታ",
      totalAmount: "ጠቅላላ መጠን",
      currency: "መገበያዥ",
      startDate: "መጀመሪያ ቀን",
      endDate: "መጨረሻ ቀን",
      dueDate: "የሚከፈልበት ቀን",
      addDueDate: "የሚከፈልበት ቀን ጨምር",
      next: "ቀጣይ",
      error: "እባክዎ ሁሉንም መስኮች እና ቢያንስ አንድ የሚከፈልበት ቀን ይሙሉ",
    },
  }[currentLanguage];

  const addDueDate = () => {
    setDueDates([...dueDates, ""]);
  };

  const updateDueDate = (index: number, value: string) => {
    const newDueDates = [...dueDates];
    newDueDates[index] = value;
    setDueDates(newDueDates);
  };

  const handleNext = () => {
    if (!location || !totalAmount || !startDate || !endDate || dueDates.some(d => !d)) {
      toast.error(t.error);
      return;
    }
    onNext({
      commonDetails: {
        location,
        totalAmount: parseFloat(totalAmount),
        currency,
        startDate,
        endDate,
        dueDates,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <p className="text-sm text-gray-600">{t.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t.location}</label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t.location}
          />
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">{t.totalAmount}</label>
            <Input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder={t.totalAmount}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">{t.currency}</label>
            <Select onValueChange={setCurrency} value={currency}>
              <SelectTrigger>
                <SelectValue placeholder={t.currency} />
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
          <label className="block text-sm font-medium text-gray-700">{t.startDate}</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder={t.startDate}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t.endDate}</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder={t.endDate}
          />
        </div>
        {dueDates.map((dueDate, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700">{t.dueDate} {index + 1}</label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => updateDueDate(index, e.target.value)}
              placeholder={t.dueDate}
            />
          </div>
        ))}
        <Button variant="outline" onClick={addDueDate}>
          {t.addDueDate}
        </Button>
        <Button onClick={handleNext}>{t.next}</Button>
      </CardContent>
    </Card>
  );
}