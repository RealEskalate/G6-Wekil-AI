"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switchs"; // Fixed typo: Switchs -> Switch
import { Trash } from "lucide-react"; // Add this import
import { Label } from "@/components/ui/Label";
import { Language, ContractData } from "@/components/wizard/ContractWizard";

interface SpecificDetailsProps {
  currentLanguage: Language;
  contractType?: string;
  specificDetails: NonNullable<ContractData["specificDetails"]>;
  setSpecificDetails: (
    details: NonNullable<ContractData["specificDetails"]>
  ) => void;
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
      effectiveDate: "Effective Date",
      confidentialityPeriod: "Confidentiality Period (years)",
      isMutual: "Mutual NDA",
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
      effectiveDate: "የተግባር ቀን",
      confidentialityPeriod: "የምስጢር ጊዜ (ዓመታት)",
      isMutual: "የጋራ ሚስጥር ጥበቃ ስምምነት",
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
          <div className="space-y-6">
            <div>
              <Label className="block mb-2 font-medium">{t.services}</Label>
              <Textarea
                value={specificDetails.servicesDescription || ""}
                onChange={(e) =>
                  updateSpecificDetails("servicesDescription", e.target.value)
                }
                placeholder={t.services}
                className="w-full bg-white"
              />
            </div>
            <div>
              <Label className="block mb-2 font-medium">Milestones</Label>
              {(specificDetails.milestones || []).map((milestone, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-2 gap-4 mb-2 items-center"
                >
                  <Input
                    placeholder="Milestone Description"
                    value={milestone.description}
                    onChange={(e) => {
                      const newMilestones = [
                        ...(specificDetails.milestones || []),
                      ];
                      newMilestones[idx].description = e.target.value;
                      setSpecificDetails({
                        ...specificDetails,
                        milestones: newMilestones,
                      });
                    }}
                  />
                  <div className="flex gap-2 items-center">
                    <Input
                      type="date"
                      placeholder="Deadline Date"
                      value={milestone.date}
                      onChange={(e) => {
                        const newMilestones = [
                          ...(specificDetails.milestones || []),
                        ];
                        newMilestones[idx].date = e.target.value;
                        setSpecificDetails({
                          ...specificDetails,
                          milestones: newMilestones,
                        });
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newMilestones = [
                          ...(specificDetails.milestones || []),
                        ];
                        newMilestones.splice(idx, 1);
                        setSpecificDetails({
                          ...specificDetails,
                          milestones: newMilestones,
                        });
                      }}
                      aria-label="Delete milestone"
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newMilestones = [
                    ...(specificDetails.milestones || []),
                    { description: "", date: "" },
                  ];
                  setSpecificDetails({
                    ...specificDetails,
                    milestones: newMilestones,
                  });
                }}
              >
                Add Milestone
              </Button>
            </div>
          </div>
        );
      // ...existing code...
      case "goods":
        return (
          <div>
            <Label className="block mb-2 font-medium">{t.items}</Label>
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
            <Label className="block mb-2 font-medium">{t.principal}</Label>
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
          <div className="space-y-6 ">
            <div>
              <Label className="block mb-2 font-medium">
                {t.effectiveDate}
              </Label>
              <Input
                type="date"
                value={specificDetails.effectiveDate || ""}
                onChange={(e) =>
                  updateSpecificDetails("effectiveDate", e.target.value)
                }
                className="w-full"
              />
            </div>
            <div>
              <Label className="block mb-2 font-medium">
                {t.confidentialityPeriod}
              </Label>
              <Input
                type="number"
                placeholder={t.confidentialityPeriod}
                value={specificDetails.confidentialityPeriod || ""}
                onChange={(e) =>
                  updateSpecificDetails(
                    "confidentialityPeriod",
                    Number(e.target.value)
                  )
                }
                className="w-full"
              />
            </div>
            <div>
              <Label className="block mb-2 font-medium">{t.purpose}</Label>
              <Textarea
                value={specificDetails.purpose || ""}
                onChange={(e) =>
                  updateSpecificDetails("purpose", e.target.value)
                }
                placeholder={t.purpose}
                className="w-full  bg-white "
              />
            </div>
            <div className=" bg-white items-center">
              <Label className="font-medium">{t.isMutual}</Label>
              <Switch
                checked={specificDetails.isMutual || false}
                onCheckedChange={(checked: boolean) =>
                  updateSpecificDetails("isMutual", checked)
                }
                className="data-[state=checked]:bg-teal-500"
              />
            </div>
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
