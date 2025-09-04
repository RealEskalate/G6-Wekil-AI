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
import { Button } from "../ui/Button";
import { Shield, Loader2, Download, Trash2, UserX, X } from "lucide-react";
import toast from "react-hot-toast";
import { settingTranslations } from "@/lib/translations/settingTranslations";
import { useLanguage } from "@/context/LanguageContext";

export default function PrivacyCard() {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const { lang } = useLanguage();
  const t = settingTranslations[lang];

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 2000));
      toast.success(t.dataExported);
    } catch (error) {
      console.error(error);
      toast.error(t.dataExportFailed);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 3000));
      toast.success(t.accountDeletedSuccessfully);
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error(error);
      toast.error(t.failedToDeleteAccount);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-transparent rounded-xl shadow-lg max-w-md w-full">
            <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {t.deleteAccount}
                </h3>
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5 cursor-pointer" />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                {t.deleteConfirmationMessage}
              </p>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="border-gray-300 cursor-pointer"
                >
                  {t.cancel}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="gap-2 text-gray-500 cursor-pointer"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t.deleting}
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      {t.confirm}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Shield className="w-5 h-5 text-blue-600" />
            {t.privacy}
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            {t.privacyDesc}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          {/* Data Management */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              {t.dataManagement}
            </h3>

            <div className="space-y-4">
              {/* Export Data */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-blue-600" />
                  <div>
                    <Label className="text-gray-700 font-medium text-sm">
                      {t.dataExport}
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      {t.dataExportDesc}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportData}
                  disabled={isExporting}
                  className="gap-2 cursor-pointer border-gray-300 hover:bg-gray-100"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> {t.exporting}
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> {t.exportData}
                    </>
                  )}
                </Button>
              </div>

              {/* Delete Account */}
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50/50 hover:bg-red-50 transition-colors">
                <div className="flex items-center gap-3">
                  <UserX className="w-5 h-5 text-red-600" />
                  <div>
                    <Label className="text-red-700 font-medium text-sm">
                      {t.deleteAccount}
                    </Label>
                    <p className="text-xs text-red-500 mt-1">
                      {t.deleteAccountDesc}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirmation(true)}
                  className="gap-2 cursor-pointer border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" /> {t.deleteAccount}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
