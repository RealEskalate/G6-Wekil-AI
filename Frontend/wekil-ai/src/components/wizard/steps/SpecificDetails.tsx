"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Language, ContractData } from "@/components/wizard/ContractWizard";

interface SpecificDetailsProps {
  currentLanguage: Language;
  onNext: (data: Partial<ContractData>) => void;
  contractType?: string;
}

export default function SpecificDetails({ currentLanguage, onNext, contractType }: SpecificDetailsProps) {
  // Service Agreement states
  const [servicesDescription, setServicesDescription] = useState("");
  const [milestones, setMilestones] = useState([{ description: "", date: "" }]);
  const [revisions, setRevisions] = useState("0");

  // Sale of Goods states
  const [items, setItems] = useState([{ description: "", quantity: 0, unitPrice: 0 }]);
  const [deliveryTerms, setDeliveryTerms] = useState("");

  // Simple Loan states
  const [principalAmount, setPrincipalAmount] = useState("");
  const [installments, setInstallments] = useState([{ amount: 0, dueDate: "" }]);
  const [lateFeePercentage, setLateFeePercentage] = useState("0");

  // Non-Disclosure Agreement states
  const [effectiveDate, setEffectiveDate] = useState("");
  const [confidentialityPeriod, setConfidentialityPeriod] = useState("0");
  const [purpose, setPurpose] = useState("");

  const t = {
    en: {
      title: "Specific Details",
      subtitle: "Enter details specific to the agreement type",
      // Service Agreement
      servicesDescription: "Services Description",
      milestones: "Milestones",
      milestoneDescription: "Description",
      milestoneDate: "Date",
      addMilestone: "Add Milestone",
      revisions: "Number of Revisions",
      // Sale of Goods
      goodsTitle: "Goods/Items",
      itemDescription: "Item Description",
      quantity: "Quantity",
      unitPrice: "Unit Price",
      addItem: "Add Item",
      deliveryTerms: "Delivery Terms",
      // Simple Loan
      principalAmount: "Principal Amount",
      installments: "Installments",
      installmentAmount: "Amount",
      installmentDueDate: "Due Date",
      addInstallment: "Add Installment",
      lateFeePercentage: "Late Fee Percentage",
      // Non-Disclosure Agreement
      effectiveDate: "Effective Date",
      confidentialityPeriod: "Confidentiality Period (Years)",
      purpose: "Purpose",
      next: "Next",
      error: "Please fill in all required fields",
    },
    am: {
      title: "የተወሰኑ ዝርዝሮች",
      subtitle: "የውሉ አይነት ላይ የተመሰረቱ ዝርዝሮችን ያስገቡ",
      servicesDescription: "የአገልግሎት መግለጫ",
      milestones: "የሥራ ደረጃዎች",
      milestoneDescription: "መግለጫ",
      milestoneDate: "ቀን",
      addMilestone: "የሥራ ደረጃ ጨምር",
      revisions: "የእርማት ብዛት",
      goodsTitle: "ዕቃዎች",
      itemDescription: "የዕቃ መግለጫ",
      quantity: "ብዛት",
      unitPrice: "የአንዱ ዋጋ",
      addItem: "ዕቃ ጨምር",
      deliveryTerms: "የመላኪያ ውሎች",
      principalAmount: "ዋና መጠን",
      installments: "ክፍያዎች",
      installmentAmount: "መጠን",
      installmentDueDate: "የሚከፈልበት ቀን",
      addInstallment: "ክፍያ ጨምር",
      lateFeePercentage: "የዘግይቶ ክፍያ መቶኛ",
      effectiveDate: "የመጀመሪያ ቀን",
      confidentialityPeriod: "የምስጢርነት ጊዜ (ዓመታት)",
      purpose: "ዓላማ",
      next: "ቀጣይ",
      error: "እባክዎ ሁሉንም አስፈላጊ መስኮች ይሙሉ",
    },
  }[currentLanguage];

  const addMilestone = () => {
    setMilestones([...milestones, { description: "", date: "" }]);
  };

  const updateMilestone = (index: number, field: string, value: string) => {
    const newMilestones = [...milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setMilestones(newMilestones);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 0, unitPrice: 0 }]);
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addInstallment = () => {
    setInstallments([...installments, { amount: 0, dueDate: "" }]);
  };

  const updateInstallment = (index: number, field: string, value: string | number) => {
    const newInstallments = [...installments];
    newInstallments[index] = { ...newInstallments[index], [field]: value };
    setInstallments(newInstallments);
  };

  const handleNext = () => {
    let data: Partial<ContractData> = {};
    let isValid = true;

    if (contractType === "service") {
      if (!servicesDescription || milestones.some(m => !m.description || !m.date) || !revisions) {
        isValid = false;
      } else {
        data.specificDetails = {
          servicesDescription,
          milestones,
          revisions: parseInt(revisions),
        };
      }
    } else if (contractType === "goods") {
      if (items.some(i => !i.description || i.quantity <= 0 || i.unitPrice <= 0) || !deliveryTerms) {
        isValid = false;
      } else {
        data.specificDetails = { items, deliveryTerms };
      }
    } else if (contractType === "loan") {
      if (!principalAmount || installments.some(i => i.amount <= 0 || !i.dueDate) || !lateFeePercentage) {
        isValid = false;
      } else {
        data.specificDetails = {
          principalAmount: parseFloat(principalAmount),
          installments,
          lateFeePercentage: parseInt(lateFeePercentage),
        };
      }
    } else if (contractType === "nda") {
      if (!effectiveDate || !confidentialityPeriod || !purpose) {
        isValid = false;
      } else {
        data.specificDetails = {
          effectiveDate,
          confidentialityPeriod: parseInt(confidentialityPeriod),
          purpose,
        };
      }
    }

    if (!isValid) {
      toast.error(t.error);
      return;
    }

    onNext(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <p className="text-sm text-gray-600">{t.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {contractType === "service" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.servicesDescription}</label>
              <Textarea
                value={servicesDescription}
                onChange={(e) => setServicesDescription(e.target.value)}
                placeholder={t.servicesDescription}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.milestones}</label>
              {milestones.map((milestone, index) => (
                <div key={index} className="border p-4 rounded-lg mt-2 space-y-2">
                  <Input
                    value={milestone.description}
                    onChange={(e) => updateMilestone(index, "description", e.target.value)}
                    placeholder={t.milestoneDescription}
                  />
                  <Input
                    type="date"
                    value={milestone.date}
                    onChange={(e) => updateMilestone(index, "date", e.target.value)}
                    placeholder={t.milestoneDate}
                  />
                </div>
              ))}
              <Button variant="outline" onClick={addMilestone} className="mt-2">
                {t.addMilestone}
              </Button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.revisions}</label>
              <Input
                type="number"
                value={revisions}
                onChange={(e) => setRevisions(e.target.value)}
                placeholder={t.revisions}
              />
            </div>
          </>
        )}
        {contractType === "goods" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.goodsTitle}</label>
              {items.map((item, index) => (
                <div key={index} className="border p-4 rounded-lg mt-2 space-y-2">
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(index, "description", e.target.value)}
                    placeholder={t.itemDescription}
                  />
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">{t.quantity}</label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
                        placeholder={t.quantity}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">{t.unitPrice}</label>
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value))}
                        placeholder={t.unitPrice}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addItem} className="mt-2">
                {t.addItem}
              </Button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.deliveryTerms}</label>
              <Textarea
                value={deliveryTerms}
                onChange={(e) => setDeliveryTerms(e.target.value)}
                placeholder={t.deliveryTerms}
              />
            </div>
          </>
        )}
        {contractType === "loan" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.principalAmount}</label>
              <Input
                type="number"
                value={principalAmount}
                onChange={(e) => setPrincipalAmount(e.target.value)}
                placeholder={t.principalAmount}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.installments}</label>
              {installments.map((installment, index) => (
                <div key={index} className="border p-4 rounded-lg mt-2 space-y-2">
                  <Input
                    type="number"
                    value={installment.amount}
                    onChange={(e) => updateInstallment(index, "amount", parseFloat(e.target.value))}
                    placeholder={t.installmentAmount}
                  />
                  <Input
                    type="date"
                    value={installment.dueDate}
                    onChange={(e) => updateInstallment(index, "dueDate", e.target.value)}
                    placeholder={t.installmentDueDate}
                  />
                </div>
              ))}
              <Button variant="outline" onClick={addInstallment} className="mt-2">
                {t.addInstallment}
              </Button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.lateFeePercentage}</label>
              <Input
                type="number"
                value={lateFeePercentage}
                onChange={(e) => setLateFeePercentage(e.target.value)}
                placeholder={t.lateFeePercentage}
              />
            </div>
          </>
        )}
        {contractType === "nda" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.effectiveDate}</label>
              <Input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                placeholder={t.effectiveDate}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.confidentialityPeriod}</label>
              <Input
                type="number"
                value={confidentialityPeriod}
                onChange={(e) => setConfidentialityPeriod(e.target.value)}
                placeholder={t.confidentialityPeriod}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.purpose}</label>
              <Textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder={t.purpose}
              />
            </div>
          </>
        )}
        <Button onClick={handleNext}>{t.next}</Button>
      </CardContent>
    </Card>
  );
}