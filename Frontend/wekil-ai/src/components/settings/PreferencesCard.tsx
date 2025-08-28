"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/Card";
import { Label } from "../ui/Label";
import { Switch } from "../ui/switch";
import { settingTranslations } from "@/lib/settingTranslations";
import { useLanguage } from "@/context/LanguageContext";
import { Globe, FileText, Save } from "lucide-react";
import { Button } from "../ui/Button";

interface Settings {
  currency: "ETB" | "USD" | "EUR";
  contractTemplates: boolean;
  language: "en" | "am";
}

export default function PreferencesCard() {
  const { lang, setLang } = useLanguage();
  const t = settingTranslations[lang];
  const [settings, setSettings] = useState<Settings>({
    currency: "ETB",
    contractTemplates: true,
    language: lang,
  });

  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));

    // Apply changes immediately for language settings
    if (key === "language") {
      setLang(value as "en" | "am");
    }
  };

  const handleSave = () => {
    // In a real app, you would save these preferences to a backend
    console.log("Saving preferences:", settings);
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <CardHeader className="border-b border-gray-100 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          {t.preferences}
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {t.preferencesDescription}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 space-y-6">
        {/* Language Preference */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <Label className="text-gray-700 font-medium text-sm">
              {t.language}
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                settings.language === "en"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => updateSetting("language", "en")}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full border flex items-center justify-center ${
                    settings.language === "en"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {settings.language === "en" && (
                    <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-sm font-medium">English</span>
              </div>
            </div>

            <div
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                settings.language === "am"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => updateSetting("language", "am")}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full border flex items-center justify-center ${
                    settings.language === "am"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {settings.language === "am" && (
                    <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-sm font-medium">አማርኛ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Currency Preference */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <Label className="text-gray-700 font-medium text-sm">
              {t.defaultCurrency}
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: "ETB", label: "Ethiopian Birr", symbol: "Br" },
              { value: "USD", label: "US Dollar", symbol: "$" },
              { value: "EUR", label: "Euro", symbol: "€" },
            ].map((currency) => (
              <div
                key={currency.value}
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  settings.currency === currency.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() =>
                  updateSetting(
                    "currency",
                    currency.value as Settings["currency"]
                  )
                }
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full border flex items-center justify-center ${
                      settings.currency === currency.value
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {settings.currency === currency.value && (
                      <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{currency.label}</div>
                    <div className="text-xs text-gray-500">
                      {currency.symbol}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contract Templates Toggle */}
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <div>
              <Label className="text-gray-700 font-medium text-sm">
                {t.contractTemplates}
              </Label>
              <p className="text-xs text-gray-500">{t.contractTemplatesDesc}</p>
            </div>
          </div>
          <Switch
            checked={settings.contractTemplates}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateSetting("contractTemplates", e.target.checked)
            }
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-3">
          <Button
            onClick={handleSave}
            className="gap-1.5 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm"
          >
            <Save className="w-3.5 h-3.5" />
            {t.save}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
