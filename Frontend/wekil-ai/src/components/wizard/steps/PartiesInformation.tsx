"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Language, ContractData } from "@/components/wizard/ContractWizard";

interface PartiesInformationProps {
  currentLanguage: Language;
  onNext: (data: Partial<ContractData>) => void;
  contractType?: string;
}

export default function PartiesInformation({ currentLanguage, onNext, contractType }: PartiesInformationProps) {
  const [parties, setParties] = useState([
    { fullName: "", phone: "", email: "" },
    { fullName: "", phone: "", email: "" },
  ]);

  const t = {
    en: {
      title: "Parties Information",
      subtitle: "Enter details for both parties",
      party1Label: contractType === "service" ? "Service Provider" : 
                    contractType === "goods" ? "Seller" : 
                    contractType === "loan" ? "Lender" : 
                    "Disclosing Party",
      party2Label: contractType === "service" ? "Client" : 
                    contractType === "goods" ? "Buyer" : 
                    contractType === "loan" ? "Borrower" : 
                    "Receiving Party",
      fullName: "Full Name",
      phone: "Phone Number",
      email: "Email",
      next: "Next",
      error: "Please fill in all fields for both parties",
    },
    am: {
      title: "የተዋዋዮች መረጃ",
      subtitle: "ለሁለቱም ወገኖች ዝርዝሮችን ያስገቡ",
      party1Label: contractType === "service" ? "የአገልግሎት ሰጪ" : 
                    contractType === "goods" ? "ሻጭ" : 
                    contractType === "loan" ? "አበዳሪ" : 
                    "መረጃ ሰጪ ወገን",
      party2Label: contractType === "service" ? "ደንበኛ" : 
                    contractType === "goods" ? "ገዢ" : 
                    contractType === "loan" ? "ተበዳሪ" : 
                    "መረጃ ተቀባይ ወገን",
      fullName: "ሙሉ ስም",
      phone: "ስልክ ቁጥር",
      email: "ኢሜይል",
      next: "ቀጣይ",
      error: "እባክዎ ለሁለቱም ወገኖች ሁሉንም መስኮች ይሙሉ",
    },
  }[currentLanguage];

  const handleInputChange = (index: number, field: string, value: string) => {
    const newParties = [...parties];
    newParties[index] = { ...newParties[index], [field]: value };
    setParties(newParties);
  };

  const handleNext = () => {
    if (parties.some(party => !party.fullName || !party.phone || !party.email)) {
      toast.error(t.error);
      return;
    }
    onNext({ parties });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <p className="text-sm text-gray-600">{t.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {[0, 1].map(index => (
          <div key={index} className="border p-4 rounded-lg">
            <h3 className="text-lg font-semibold">{index === 0 ? t.party1Label : t.party2Label}</h3>
            <div className="space-y-4 mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.fullName}</label>
                <Input
                  value={parties[index].fullName}
                  onChange={(e) => handleInputChange(index, "fullName", e.target.value)}
                  placeholder={t.fullName}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.phone}</label>
                <Input
                  value={parties[index].phone}
                  onChange={(e) => handleInputChange(index, "phone", e.target.value)}
                  placeholder={t.phone}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.email}</label>
                <Input
                  value={parties[index].email}
                  onChange={(e) => handleInputChange(index, "email", e.target.value)}
                  placeholder={t.email}
                />
              </div>
            </div>
          </div>
        ))}
        <Button onClick={handleNext}>{t.next}</Button>
      </CardContent>
    </Card>
  );
}