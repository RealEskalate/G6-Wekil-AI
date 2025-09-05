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
      // Shared
      add: "Add",
      description: "Description",
      date: "Date",
      actions: "Actions",
      // Service
      servicesDescription: "Services Description",
      milestones: "Milestones",
      milestoneDescription: "Milestone Description",
      milestoneDate: "Milestone Date",
      addMilestone: "Add Milestone",
      revisions: "Allowed Revisions",
      // Sales
      items: "Items",
      itemDescription: "Item Description",
      quantity: "Quantity",
      unitPrice: "Unit Price",
      addItem: "Add Item",
      deliveryTerms: "Delivery Terms",
      // Loan
      principalAmount: "Principal Amount",
      installments: "Installments",
      installmentAmount: "Installment Amount",
      installmentDueDate: "Installment Due Date",
      addInstallment: "Add Installment",
      lateFeePercentage: "Late Fee (%)",
      // NDA
      effectiveDate: "Effective Date",
      confidentialityPeriod: "Confidentiality Period (months)",
      purpose: "Purpose",
      isMutual: "Is Mutual?",
    },
    am: {
      title: "የተወሰኑ ዝርዝሮች",
      subtitle: "በተመረጠው የውል አይነት መሰረት ዝርዝሮችን ያስገቡ",
      add: "ያክሉ",
      description: "መግለጫ",
      date: "ቀን",
      actions: "እርምጃዎች",
      servicesDescription: "የአገልግሎት መግለጫ",
      milestones: "ሂደቶች",
      milestoneDescription: "የሂደት መግለጫ",
      milestoneDate: "የሂደት ቀን",
      addMilestone: "ሂደት ያክሉ",
      revisions: "ተፈቅዷል የሚደረጉ ማሻሻያዎች",
      items: "እቃዎች",
      itemDescription: "የእቃ መግለጫ",
      quantity: "ብዛት",
      unitPrice: "የእቃ ዋጋ",
      addItem: "እቃ ያክሉ",
      deliveryTerms: "የመላኪያ መመሪያዎች",
      principalAmount: "ዋና መጠን",
      installments: "ክፍያዎች",
      installmentAmount: "የክፍያ መጠን",
      installmentDueDate: "የክፍያ ቀን",
      addInstallment: "ክፍያ ያክሉ",
      lateFeePercentage: "የቀድሞ ወንድም ቅጣት (%)",
      effectiveDate: "የመስራት ቀን",
      confidentialityPeriod: "የምስጢርነት ወቅት (ወራቶች)",
      purpose: "አላማ",
      isMutual: "በሁለትነት ነው?",
    },
  }[currentLanguage];

  // Helper to update fields
  const updateSpecificDetails = <
    K extends keyof NonNullable<ContractData["specificDetails"]>
  >(
    field: K,
    value: NonNullable<ContractData["specificDetails"]>[K]
  ) => {
    setSpecificDetails({ ...specificDetails, [field]: value });
  };

  // Renderers for dynamic lists with objects
  const renderMilestones = () => (
    <div>
      <label className="block mb-2 font-medium">{t.milestones}</label>
      {(specificDetails.milestones || []).map((milestone: any, idx: number) => (
        <div key={idx} className="flex gap-2 mb-2 items-center">
          <Input
            placeholder={t.milestoneDescription}
            value={milestone.description}
            onChange={e => {
              const milestones = [...(specificDetails.milestones || [])];
              milestones[idx].description = e.target.value;
              updateSpecificDetails("milestones", milestones);
            }}
            className="w-1/2"
          />
          <Input
            type="date"
            placeholder={t.milestoneDate}
            value={milestone.date || ""}
            onChange={e => {
              const milestones = [...(specificDetails.milestones || [])];
              milestones[idx].date = e.target.value;
              updateSpecificDetails("milestones", milestones);
            }}
          />
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
          updateSpecificDetails("milestones", newMilestones);
        }}
      >
        {t.addMilestone}
      </Button>
    </div>
  );

  const renderItems = () => (
    <div>
      <label className="block mb-2 font-medium">{t.items}</label>
      {(specificDetails.items || []).map((item: any, idx: number) => (
        <div key={idx} className="grid grid-cols-3 gap-4 mb-2">
          <Input
            placeholder={t.itemDescription}
            value={item.description}
            onChange={e => {
              const items = [...(specificDetails.items || [])];
              items[idx].description = e.target.value;
              updateSpecificDetails("items", items);
            }}
          />
          <Input
            type="number"
            placeholder={t.quantity}
            value={item.quantity}
            onChange={e => {
              const items = [...(specificDetails.items || [])];
              items[idx].quantity = Number(e.target.value);
              updateSpecificDetails("items", items);
            }}
          />
          <Input
            type="number"
            placeholder={t.unitPrice}
            value={item.unitPrice}
            onChange={e => {
              const items = [...(specificDetails.items || [])];
              items[idx].unitPrice = Number(e.target.value);
              updateSpecificDetails("items", items);
            }}
          />
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const newItems = [
            ...(specificDetails.items || []),
            { description: "", quantity: 1, unitPrice: 0 },
          ];
          updateSpecificDetails("items", newItems);
        }}
      >
        {t.addItem}
      </Button>
    </div>
  );

  const renderInstallments = () => (
    <div>
      <label className="block mb-2 font-medium">{t.installments}</label>
      {(specificDetails.installments || []).map((installment: any, idx: number) => (
        <div key={idx} className="flex items-center gap-2 mb-2">
          <Input
            type="number"
            placeholder={t.installmentAmount}
            value={installment.amount}
            onChange={e => {
              const installments = [...(specificDetails.installments || [])];
              installments[idx].amount = Number(e.target.value);
              updateSpecificDetails("installments", installments);
            }}
            className="w-1/2"
          />
          <Input
            type="date"
            placeholder={t.installmentDueDate}
            value={installment.dueDate || ""}
            onChange={e => {
              const installments = [...(specificDetails.installments || [])];
              installments[idx].dueDate = e.target.value;
              updateSpecificDetails("installments", installments);
            }}
          />
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const newInstallments = [
            ...(specificDetails.installments || []),
            { amount: 0, dueDate: "" },
          ];
          updateSpecificDetails("installments", newInstallments);
        }}
      >
        {t.addInstallment}
      </Button>
    </div>
  );

  const renderFields = () => {
    switch (contractType) {
      case "service":
        return (
          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">{t.servicesDescription}</label>
              <Textarea
                value={specificDetails.servicesDescription || ""}
                onChange={e => updateSpecificDetails("servicesDescription", e.target.value)}
                placeholder={t.servicesDescription}
                className="w-full"
              />
            </div>
            {renderMilestones()}
            <div>
              <label className="block mb-2 font-medium">{t.revisions}</label>
              <Input
                type="number"
                placeholder={t.revisions}
                value={specificDetails.revisions || ""}
                onChange={e => updateSpecificDetails("revisions", Number(e.target.value))}
              />
            </div>
          </div>
        );
      case "goods":
        return (
          <div className="space-y-6">
            {renderItems()}
            <div>
              <label className="block mb-2 font-medium">{t.deliveryTerms}</label>
              <Textarea
                value={specificDetails.deliveryTerms || ""}
                onChange={e => updateSpecificDetails("deliveryTerms", e.target.value)}
                placeholder={t.deliveryTerms}
                className="w-full"
              />
            </div>
          </div>
        );
      case "loan":
        return (
          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">{t.principalAmount}</label>
              <Input
                type="number"
                placeholder={t.principalAmount}
                value={specificDetails.principalAmount || ""}
                onChange={e => updateSpecificDetails("principalAmount", Number(e.target.value))}
              />
            </div>
            {renderInstallments()}
            <div>
              <label className="block mb-2 font-medium">{t.lateFeePercentage}</label>
              <Input
                type="number"
                placeholder={t.lateFeePercentage}
                value={specificDetails.lateFeePercentage || ""}
                onChange={e => updateSpecificDetails("lateFeePercentage", Number(e.target.value))}
              />
            </div>
          </div>
        );
      case "nda":
        return (
          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">{t.purpose}</label>
              <Textarea
                value={specificDetails.purpose || ""}
                onChange={e => updateSpecificDetails("purpose", e.target.value)}
                placeholder={t.purpose}
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">{t.effectiveDate}</label>
              <Input
                type="date"
                placeholder={t.effectiveDate}
                value={specificDetails.effectiveDate || ""}
                onChange={e => updateSpecificDetails("effectiveDate", e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">{t.confidentialityPeriod}</label>
              <Input
                type="number"
                placeholder={t.confidentialityPeriod}
                value={specificDetails.confidentialityPeriod || ""}
                onChange={e => updateSpecificDetails("confidentialityPeriod", Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-medium">{t.isMutual}</label>
              <Input
                type="checkbox"
                checked={Boolean(specificDetails.isMutual)}
                onChange={e => updateSpecificDetails("isMutual", e.target.checked)}
                className="w-4 h-4"
              />
            </div>
            {renderMilestones()}
          </div>
        );
      default:
        return <p className="text-gray-500">No specific fields for this contract type.</p>;
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
