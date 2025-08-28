"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  User,
  Settings as SettingsIcon,
  ArrowLeft,
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

import { settingTranslations } from "@/lib/settingTranslations";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { lang } = useLanguage();
  const t = settingTranslations[lang];
  const router = useRouter();

  const handleSaveSettings = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="gap-2 cursor-pointer hover:bg-blue-100 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backToDashboard}
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">{t.settings}</h1>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="border-b border-gray-200 px-6">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full max-w-2xl mx-auto rounded-none bg-transparent p-0 h-14">
                <TabsTrigger
                  value="profile"
                  className="flex-col cursor-pointer md:flex-row gap-1.5 md:gap-2 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent py-4 px-2 h-full transition-all"
                >
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs md:text-sm">{t.profile}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="preferences"
                  className="flex-col cursor-pointer md:flex-row gap-1.5 md:gap-2 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent py-4 px-2 h-full transition-all"
                >
                  <SettingsIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs md:text-sm">{t.preferences}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="flex-col cursor-pointer md:flex-row gap-1.5 md:gap-2 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent py-4 px-2 h-full transition-all"
                >
                  <Bell className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs md:text-sm">{t.notifications}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="privacy"
                  className="flex-col cursor-pointer md:flex-row gap-1.5 md:gap-2 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent py-4 px-2 h-full transition-all"
                >
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs md:text-sm">{t.privacy}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="about"
                  className="flex-col cursor-pointer md:flex-row gap-1.5 md:gap-2 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent py-4 px-2 h-full transition-all"
                >
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs md:text-sm">{t.about}</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Contents (already dynamic) */}
            <TabsContent value="profile" className="m-0 p-6 focus:outline-none">
              <ProfileCard />
            </TabsContent>

            <TabsContent
              value="preferences"
              className="m-0 p-6 focus:outline-none"
            >
              <PreferencesCard />
            </TabsContent>

            <TabsContent
              value="notifications"
              className="m-0 p-6 focus:outline-none"
            >
              <NotificationsCard />
            </TabsContent>

            <TabsContent value="privacy" className="m-0 p-6 focus:outline-none">
              <PrivacyCard />
              <div className="flex justify-end pt-6 mt-6 border-t border-gray-100">
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

            <TabsContent value="about" className="m-0 p-6 focus:outline-none">
              <AboutCard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
