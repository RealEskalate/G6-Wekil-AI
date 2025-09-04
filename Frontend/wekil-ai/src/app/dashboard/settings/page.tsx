"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  User,
  Settings as SettingsIcon,
  Loader2,
  Bell,
  Shield,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

import ProfileCard from "@/components/settings/ProfileCard";
import PreferencesCard from "@/components/settings/PreferencesCard";
import NotificationsCard from "@/components/settings/NotificationsCard";
import PrivacyCard from "@/components/settings/PrivacyCard";
import AboutCard from "@/components/settings/AboutCard";

import { settingTranslations } from "@/lib/translations/settingTranslations";
import { useLanguage } from "@/context/LanguageContext";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { lang } = useLanguage();
  const t = settingTranslations[lang];

  const handleSaveSettings = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="pl-4 text-2xl sm:text-3xl font-semibold text-gray-900">
            {t.settings}
          </h1>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="border-b border-gray-200 px-2 sm:px-6">
              <TabsList className="grid grid-cols-3 sm:grid-cols-5 w-full max-w-full mx-auto rounded-none bg-transparent p-0 h-14">
                <TabsTrigger
                  value="profile"
                  className="flex-col sm:flex-row gap-1 sm:gap-2 data-[state=inactive]:text-black cursor-pointer font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent py-3 sm:py-4 px-1 sm:px-2 h-full transition-all text-xs sm:text-sm"
                >
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span>{t.profile}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="preferences"
                  className="flex-col sm:flex-row gap-1 data-[state=inactive]:text-black cursor-pointer sm:gap-2 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent py-3 sm:py-4 px-1 sm:px-2 h-full transition-all text-xs sm:text-sm"
                >
                  <SettingsIcon className="w-4 h-4 flex-shrink-0" />
                  <span>{t.preferences}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="flex-col sm:flex-row gap-1 data-[state=inactive]:text-black cursor-pointer sm:gap-2 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent py-3 sm:py-4 px-1 sm:px-2 h-full transition-all text-xs sm:text-sm"
                >
                  <Bell className="w-4 h-4 flex-shrink-0" />
                  <span>{t.notifications}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="privacy"
                  className="flex-col sm:flex-row gap-1 data-[state=inactive]:text-black cursor-pointer sm:gap-2 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent py-3 sm:py-4 px-1 sm:px-2 h-full transition-all text-xs sm:text-sm"
                >
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  <span>{t.privacy}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="about"
                  className="flex-col sm:flex-row gap-1  data-[state=inactive]:text-black cursor-pointer sm:gap-2 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent py-3 sm:py-4 px-1 sm:px-2 h-full transition-all text-xs sm:text-sm"
                >
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span>{t.about}</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Contents */}
            <TabsContent
              value="profile"
              className="m-0 p-4 sm:p-6 focus:outline-none"
            >
              <ProfileCard />
            </TabsContent>

            <TabsContent
              value="preferences"
              className="m-0 p-4 sm:p-6 focus:outline-none"
            >
              <PreferencesCard />
            </TabsContent>

            <TabsContent
              value="notifications"
              className="m-0 p-4 sm:p-6 focus:outline-none"
            >
              <NotificationsCard />
            </TabsContent>

            <TabsContent
              value="privacy"
              className="m-0 p-4 sm:p-6 focus:outline-none"
            >
              <PrivacyCard />
              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-6 mt-6 border-t border-gray-100">
                <Button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> {t.saving}
                    </>
                  ) : (
                    t.save
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent
              value="about"
              className="m-0 p-4 sm:p-6 focus:outline-none"
            >
              <AboutCard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
