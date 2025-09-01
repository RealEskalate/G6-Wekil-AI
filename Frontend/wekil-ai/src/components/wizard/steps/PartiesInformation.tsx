"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { User, Users } from "lucide-react";
import { Language } from "@/components/wizard/ContractWizard";

const CONTRACT_TYPE_KEYS = ["service", "goods", "loan", "nda"] as const;
type ContractType = (typeof CONTRACT_TYPE_KEYS)[number];

interface PartiesInformationProps {
  currentLanguage: Language;
  contractType?: string;
  parties: { fullName: string; phone: string; email: string }[];
  setParties: (
    parties: { fullName: string; phone: string; email: string }[]
  ) => void;
}

function isContractType(key: string | undefined): key is ContractType {
  return CONTRACT_TYPE_KEYS.includes(key as ContractType);
}

export function PartiesInformation({
  currentLanguage,
  contractType,
  parties,
  setParties,
}: PartiesInformationProps) {
  const t = {
    en: {
      title: "Parties Information",
      subtitle: "Enter details for both parties involved in the agreement",
      firstParty: "First Party",
      secondParty: "Second Party",
      fullName: "Full Name",
      phone: "Phone Number",
      email: "Email Address",
      partyTitles: {
        service: ["Service Provider", "Client"],
        goods: ["Seller", "Buyer"],
        loan: ["Lender", "Borrower"],
        nda: ["Disclosing Party", "Receiving Party"],
      },
    },
    am: {
      title: "የተዋዋዮች መረጃ",
      subtitle: "በስምምነቱ ውስጥ ለተሳተፉ ሁለቱም ወገኖች ዝርዝሮችን ያስገቡ",
      firstParty: "የመጀመሪያ ወገን",
      secondParty: "ሁለተኛ ወገን",
      fullName: "ሙሉ ስም",
      phone: "ስልክ ቁጥር",
      email: "ኢሜል አድራሻ",
      partyTitles: {
        service: ["የአገልግሎት ሰጪ", "ደንበኛ"],
        goods: ["ሻጭ", "ገዢ"],
        loan: ["አበዳሪ", "ተበዳሪ"],
        nda: ["መረጃ ሰጪ ወገን", "መረጃ ተቀባይ ወገን"],
      },
    },
  }[currentLanguage];

  const updateParty = (index: number, field: string, value: string) => {
    const newParties = [...parties];
    newParties[index] = { ...newParties[index], [field]: value };
    setParties(newParties);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-xl">
      <Card>
        <CardHeader>
          <CardTitle>
            {isContractType(contractType)
              ? t.partyTitles[contractType][0] +
                " & " +
                t.partyTitles[contractType][1]
              : t.title}
          </CardTitle>
          <p className="text-sm text-gray-600">{t.subtitle}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* First Party */}
            <Card className="p-6 bg-white">
              <div className="flex items-center mb-4">
                <User className="h-5 w-5 mr-2 text-gray-600" />
                <h3 className="text-lg font-semibold">
                  {isContractType(contractType)
                    ? t.partyTitles[contractType][0]
                    : t.firstParty}
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="first-name">{t.fullName}</Label>
                  <Input
                    id="first-name"
                    placeholder={t.fullName}
                    value={parties[0].fullName}
                    onChange={(e) => updateParty(0, "fullName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="first-phone">{t.phone}</Label>
                  <Input
                    id="first-phone"
                    placeholder="+251..."
                    value={parties[0].phone}
                    onChange={(e) => updateParty(0, "phone", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="first-email">{t.email}</Label>
                  <Input
                    id="first-email"
                    type="email"
                    placeholder="example@example.com"
                    value={parties[0].email}
                    onChange={(e) => updateParty(0, "email", e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {/* Second Party */}
            <Card className="p-6 bg-white">
              <div className="flex items-center mb-4">
                <Users className="h-5 w-5 mr-2 text-gray-600" />
                <h3 className="text-lg font-semibold">
                  {isContractType(contractType)
                    ? t.partyTitles[contractType][1]
                    : t.secondParty}
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="second-name">{t.fullName}</Label>
                  <Input
                    id="second-name"
                    placeholder={t.fullName}
                    value={parties[1].fullName}
                    onChange={(e) => updateParty(1, "fullName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="second-phone">{t.phone}</Label>
                  <Input
                    id="second-phone"
                    placeholder="+251..."
                    value={parties[1].phone}
                    onChange={(e) => updateParty(1, "phone", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="second-email">{t.email}</Label>
                  <Input
                    id="second-email"
                    type="email"
                    placeholder="example@example.com"
                    value={parties[1].email}
                    onChange={(e) => updateParty(1, "email", e.target.value)}
                  />
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
