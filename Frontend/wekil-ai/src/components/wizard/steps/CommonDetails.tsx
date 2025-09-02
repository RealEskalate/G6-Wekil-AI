"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Calendar } from "lucide-react";
import { CommonDetail, Language } from "@/components/wizard/ContractWizard";

interface CommonDetailsProps {
  currentLanguage: Language;
  contractType?: string;
  commonDetails: CommonDetail;
  setCommonDetails: (details: CommonDetail) => void;
}

export default function CommonDetails({
  currentLanguage,
  commonDetails,
  setCommonDetails,
}: CommonDetailsProps) {
  const t = {
    en: {
      title: "Common Details",
      subtitle: "Fill in shared details of the agreement",
      location: "Location",
      amount: "Total Amount",
      currency: "Currency",
      start: "Start Date",
      end: "End Date",
      dateError: "End date cannot be before start date.",
    },
    am: {
      title: "የጋራ ዝርዝሮች",
      subtitle: "ከሁሉም የተጋራ ዝርዝሮችን ይሙሉ",
      location: "ቦታ",
      amount: "ጠቅላላ መጠን",
      currency: "ገንዘብ",
      start: "የመጀመሪያ ቀን",
      end: "የመጨረሻ ቀን",
      dateError: "የመጨረሻ ቀን ከመጀመሪያ ቀን በፊት መሆን አይችልም።",
    },
  }[currentLanguage];

  const updateCommonDetails = <K extends keyof CommonDetail>(
    field: K,
    value: CommonDetail[K]
  ) => {
    setCommonDetails({ ...commonDetails, [field]: value });
  };

  // Validation: check if end date is before start date
  const isInvalidDate =
    commonDetails?.startDate &&
    commonDetails?.endDate &&
    new Date(commonDetails.endDate) < new Date(commonDetails.startDate);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <p className="text-sm text-gray-600">{t.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location */}
        <div>
          <label className="block mb-2 font-medium">{t.location}</label>
          <Input
            placeholder={t.location}
            value={commonDetails?.location || ""}
            onChange={(e) => updateCommonDetails("location", e.target.value)}
          />
        </div>

        {/* Amount & Currency */}
        <div>
          <label className="block mb-2 font-medium">{t.amount}</label>
          <div className="flex gap-4">
            <Input
              type="number"
              placeholder={t.amount}
              value={commonDetails?.totalAmount || ""}
              onChange={(e) =>
                updateCommonDetails("totalAmount", Number(e.target.value))
              }
              className="flex-1"
            />
            <div className="flex gap-2">
              {(["ETB", "USD", "EUR"] as const).map((c) => (
                <Button
                  key={c}
                  variant={
                    commonDetails?.currency === c ? "default" : "outline"
                  }
                  onClick={() => updateCommonDetails("currency", c)}
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">{t.start}</label>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={commonDetails?.startDate || ""}
                onChange={(e) =>
                  updateCommonDetails("startDate", e.target.value)
                }
              />
              <Calendar className="text-gray-400 h-5 w-5" />
            </div>
          </div>
          <div>
            <label className="block mb-2 font-medium">{t.end}</label>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={commonDetails?.endDate || ""}
                onChange={(e) => updateCommonDetails("endDate", e.target.value)}
              />
              <Calendar className="text-gray-400 h-5 w-5" />
            </div>
            {isInvalidDate && (
              <p className="text-red-500 text-sm mt-1">{t.dateError}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
