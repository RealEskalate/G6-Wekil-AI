"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/Card";
import { Label } from "../ui/Label";
import { settingTranslations } from "@/lib/translations/settingTranslations";
import { useLanguage } from "@/context/LanguageContext";
import { Mail, Bell, Save } from "lucide-react";
import { Button } from "../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markAsRead,
} from "@/lib/redux/slices/notificationsSlice";
import { useSession } from "next-auth/react";
import { AppDispatch, RootState } from "@/lib/redux/store";
import toast from "react-hot-toast";

interface NotificationSettings {
  emailNotifications: boolean;
}

export default function NotificationsCard() {
  const [settings, setSettings] = React.useState<NotificationSettings>({
    emailNotifications: true,
  });

  const { lang } = useLanguage();
  const t = settingTranslations[lang];
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error } = useSelector(
    (state: RootState) => state.notification
  );

  useEffect(() => {
    const token = session?.user?.accessToken;
    if (token) {
      dispatch(fetchNotifications({ token }));
    }
  }, [dispatch, session]);

  const handleSave = () => {
    toast.success(`Saving notification settings`);
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
        {/* 🔔 Notifications List */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">
            Recent Notifications
          </h3>

          {loading && <p className="text-gray-500 text-sm">Loading...</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {!loading && !error && list.length === 0 && (
            <p className="text-gray-500 text-sm">No notifications found.</p>
          )}

          {!loading &&
            !error &&
            list.map((n) => (
              <div
                key={n.id}
                className={`p-3 border rounded-lg ${
                  n.read ? "bg-gray-50" : "bg-blue-50"
                }`}
              >
                <h4 className="font-medium text-gray-800">{n.title}</h4>
                <p className="text-sm text-gray-600">{n.message}</p>
                {!n.read && (
                  <button
                    onClick={() => dispatch(markAsRead(n.id))}
                    className="text-xs text-blue-600 hover:underline mt-1"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))}
        </div>

        {/* ⚙️ Settings Section */}
        <div className="space-y-6 pt-6 border-t border-gray-100">
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
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) =>
                setSettings({ emailNotifications: e.target.checked })
              }
              className="w-10 h-6 cursor-pointer rounded-full bg-blue-500"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button
              onClick={handleSave}
              className="gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              <Save className="w-4 h-4" />
              {t.save}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
