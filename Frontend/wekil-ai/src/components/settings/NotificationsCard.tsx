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
import { Switch } from "../ui/Switch";
import { settingTranslations } from "@/lib/settingTranslations";
import { useLanguage } from "@/context/LanguageContext";
import { Bell, Mail, Save } from "lucide-react";
import { Button } from "../ui/Button";

interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
}

export default function NotificationsCard() {
  const [settings, setSettings] = useState<NotificationSettings>({
    pushNotifications: true,
    emailNotifications: true,
  });

  const { lang } = useLanguage();
  const t = settingTranslations[lang];

  const updateSetting = <K extends keyof NotificationSettings>(
    key: K,
    value: boolean
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // In a real app, you would save these notification settings to a backend
    console.log("Saving notification settings:", settings);
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <CardHeader className="border-b border-gray-100 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <Bell className="w-5 h-5 text-blue-600" />
          {t.notifications}
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {t.notificationsDesc}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Push Notifications */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-blue-600" />
            <div>
              <Label className="text-gray-700 font-medium text-sm">
                {t.pushNotifications}
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                {t.pushNotificationsDesc}
              </p>
            </div>
          </div>
          <Switch
            checked={settings.pushNotifications}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateSetting("pushNotifications", e.target.checked)
            }
          />
        </div>

        {/* Email Notifications */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-600" />
            <div>
              <Label className="text-gray-700 font-medium text-sm">
                {t.emailNotifications}
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                {t.emailNotificationsDesc}
              </p>
            </div>
          </div>
          <Switch
            checked={settings.emailNotifications}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateSetting("emailNotifications", e.target.checked)
            }
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button
            onClick={handleSave}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            <Save className="w-4 h-4" />
            {t.save}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
