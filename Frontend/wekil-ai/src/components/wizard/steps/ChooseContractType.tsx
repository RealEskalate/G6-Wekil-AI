"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Shield, ShoppingCart, CreditCard, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Language } from "@/components/wizard/ContractWizard";

interface ChooseContractTypeProps {
  currentLanguage: Language;
  contractType: string;
  setContractType: (type: string) => void;
}

export default function ChooseContractType({
  currentLanguage,
  contractType,
  setContractType,
}: ChooseContractTypeProps) {
  const t = {
    en: {
      title: "Choose Contract Type",
      subtitle: "Select the type of agreement you want to create",
      service: "Service Agreement",
      serviceDesc: "For freelance work, consulting, and services",
      goods: "Sale of Goods",
      goodsDesc: "For buying and selling products or items",
      loan: "Simple Loan",
      loanDesc: "For personal loans between individuals",
      nda: "Non-Disclosure Agreement",
      ndaDesc: "To protect confidential information",
    },
    am: {
      title: "የውል አይነት ይምረጡ",
      subtitle: "መፍጠር የሚፈልጉትን የስምምነት አይነት ይምረጡ",
      service: "የአገልግሎት ስምምነት",
      serviceDesc: "ለነጻ ስራ፣ አማካሪነት እና አገልግሎቶች",
      goods: "የእቃ ሽያጭ",
      goodsDesc: "ምርቶችን ወይም እቃዎችን ለመግዛት እና ለመሸጥ",
      loan: "ቀላል ብድር",
      loanDesc: "በግለሰቦች መካከል ለግል ብድር",
      nda: "የሚስጥር ጥበቃ ስምምነት",
      ndaDesc: "ሚስጥራዊ መረጃን ለመጠበቅ",
    },
  }[currentLanguage];

  const contractTypes = [
    { id: "service", title: t.service, desc: t.serviceDesc, icon: Shield },
    { id: "goods", title: t.goods, desc: t.goodsDesc, icon: ShoppingCart },
    { id: "loan", title: t.loan, desc: t.loanDesc, icon: CreditCard },
    { id: "nda", title: t.nda, desc: t.ndaDesc, icon: Lock },
  ];

  return (
    <Card className="max-w-4xl px-6">
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <p className="text-sm text-gray-600">{t.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contractTypes.map(({ id, title, desc, icon: Icon }) => (
            <Card
              key={id}
              className={cn(
                "p-6 cursor-pointer transition-all hover:shadow-md bg-white",
                contractType === id
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => setContractType(id)}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className={cn(
                    "p-3 rounded-full",
                    contractType === id
                      ? "bg-teal-500 text-white"
                      : "bg-gray-100 text-gray-400"
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm">{desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
