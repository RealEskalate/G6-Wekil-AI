"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Language, ContractData } from "@/components/wizard/ContractWizard";

interface SpecificDetailsProps {
  currentLanguage: Language;
  contractType?: string;
  specificDetails: NonNullable<ContractData["specificDetails"]>;
  setSpecificDetails: (
    details: NonNullable<ContractData["specificDetails"]>
  ) => void;
  contract: Partial<ContractData>;
}

export default function SpecificDetails({
  currentLanguage,
  contractType,
  specificDetails,
  setSpecificDetails,
}: SpecificDetailsProps) {
  const t = {
    en: {
      title: "Specific Details",
      subtitle: "Provide details depending on your contract type",
      services: "Services Description",
      items: "Items",
      addItem: "Add Item",
      desc: "Description",
      qty: "Quantity",
      price: "Unit Price",
      principal: "Principal Amount",
      terms: "Delivery Terms",
      purpose: "Purpose",
    },
    am: {
      title: "የተወሰኑ ዝርዝሮች",
      subtitle: "በተመረጠው የውል አይነት መሰረት ዝርዝሮችን ያስገቡ",
      services: "የአገልግሎት መግለጫ",
      items: "እቃዎች",
      addItem: "እቃ ያክሉ",
      desc: "መግለጫ",
      qty: "ብዛት",
      price: "የእቃ ዋጋ",
      principal: "ዋና መጠን",
      terms: "የመላኪያ መመሪያዎች",
      purpose: "አላማ",
    },
  }[currentLanguage];

  const updateSpecificDetails = <
    K extends keyof NonNullable<ContractData["specificDetails"]>
  >(
    field: K,
    value: NonNullable<ContractData["specificDetails"]>[K]
  ) => {
    setSpecificDetails({ ...specificDetails, [field]: value });
  };

  const addItem = () => {
    const newItems = [
      ...(specificDetails.items || []),
      { description: "", quantity: 1, unitPrice: 0 },
    ];
    setSpecificDetails({ ...specificDetails, items: newItems });
  };

  const renderFields = () => {
    switch (contractType) {
      case "service":
        return (
          <div>
            <label className="block mb-2 font-medium">{t.services}</label>
            <Textarea
              value={specificDetails.servicesDescription || ""}
              onChange={(e) =>
                updateSpecificDetails("servicesDescription", e.target.value)
              }
              placeholder={t.services}
              className="w-full"
            />
          </div>
        );

      case "goods":
        return (
          <div>
            <label className="block mb-2 font-medium">{t.items}</label>
            {(specificDetails.items || []).map((item, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-4 mb-2">
                <Input
                  placeholder={t.desc}
                  value={item.description}
                  onChange={(e) => {
                    const newItems = [...(specificDetails.items || [])];
                    newItems[idx].description = e.target.value;
                    setSpecificDetails({ ...specificDetails, items: newItems });
                  }}
                />
                <Input
                  type="number"
                  placeholder={t.qty}
                  value={item.quantity}
                  onChange={(e) => {
                    const newItems = [...(specificDetails.items || [])];
                    newItems[idx].quantity = Number(e.target.value);
                    setSpecificDetails({ ...specificDetails, items: newItems });
                  }}
                />
                <Input
                  type="number"
                  placeholder={t.price}
                  value={item.unitPrice}
                  onChange={(e) => {
                    const newItems = [...(specificDetails.items || [])];
                    newItems[idx].unitPrice = Number(e.target.value);
                    setSpecificDetails({ ...specificDetails, items: newItems });
                  }}
                />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addItem}>
              {t.addItem}
            </Button>
          </div>
        );

      case "loan":
        return (
          <div>
            <label className="block mb-2 font-medium">{t.principal}</label>
            <Input
              type="number"
              placeholder={t.principal}
              value={specificDetails.principalAmount || ""}
              onChange={(e) =>
                updateSpecificDetails("principalAmount", Number(e.target.value))
              }
            />
          </div>
        );

      case "nda":
        return (
          <div>
            <label className="block mb-2 font-medium">{t.purpose}</label>
            <Textarea
              value={specificDetails.purpose || ""}
              onChange={(e) => updateSpecificDetails("purpose", e.target.value)}
              placeholder={t.purpose}
              className="w-full"
            />
          </div>
        );

      default:
        return (
          <p className="text-gray-500">
            No specific fields for this contract type.
          </p>
        );
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <p className="text-sm text-gray-600">{t.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-6">{renderFields()}</CardContent>
    </Card>
  );
}
