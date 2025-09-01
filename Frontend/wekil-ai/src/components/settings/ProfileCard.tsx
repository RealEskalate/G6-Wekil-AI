"use client";

import React, { useState, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/Card";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User, Camera, Loader2, Lock, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { settingTranslations } from "@/lib/settingTranslations";
import { useLanguage } from "@/context/LanguageContext";
import type { FormData } from "@/types/auth";
import Image from "next/image";

export default function ProfileCard() {
  const [profileData, setProfileData] = useState<FormData>({
    profilePicture: "",
    signatureImage: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "user@example.com",
    telephone: "",
    password: "",
    confirmPassword: "",
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const { lang } = useLanguage();
  const t = settingTranslations[lang];

  const updateProfile = <K extends keyof FormData>(
    key: K,
    value: FormData[K]
  ) => {
    setProfileData((prev) => ({ ...prev, [key]: value }));
  };

  const uploadToCloudinary = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "YOUR_CLOUDINARY_UPLOAD_PRESET"); // replace with your preset

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
      return "";
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = async (
    key: "profilePicture" | "signatureImage",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast.error(t.invalidFileType);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error(t.fileSizeLimit);
      return;
    }

    const url = await uploadToCloudinary(file);
    if (url) {
      updateProfile(key, url);
      toast.success(
        `${key === "profilePicture" ? t.changePhoto : t.signature} ${
          t.updatedSuccessfully
        }`
      );
    }

    // Reset the input
    e.target.value = "";
  };

  const removeImage = (key: "profilePicture" | "signatureImage") => {
    updateProfile(key, "");
    toast.success(
      `${key === "profilePicture" ? t.changePhoto : t.signature} ${
        t.removedSuccessfully
      }`
    );
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`${t.updateProfile} ${t.successfully}`);
      } else {
        toast.error(data.message || t.failedToUpdateProfile);
      }
    } catch (error) {
      toast.error(t.failedToUpdateProfile);
      console.error(error);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error(t.fillAllPasswordFields);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t.passwordsDoNotMatch);
      return;
    }
    try {
      const response = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(t.passwordChangedSuccessfully);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message || t.failedToChangePassword);
      }
    } catch (error) {
      toast.error(t.failedToChangePassword);
      console.error(error);
    }
  };

  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
      <CardHeader className="border-b border-gray-100 pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
          <User className="w-5 h-5" /> {t.profile}
        </CardTitle>
        <CardDescription className="text-gray-500">
          {t.profileDescription}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8 pt-6">
        {/* Profile Picture */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <Avatar className="w-24 h-24 border-2 border-blue-100 shadow-sm group-hover:border-blue-300 transition-colors">
              {profileData.profilePicture ? (
                <AvatarImage
                  src={profileData.profilePicture}
                  alt={t.profilePicture}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-blue-50 text-blue-600 text-2xl font-bold">
                  <User className="w-8 h-8" />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center cursor-pointer bg-gray-400 bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full p-2 h-10 w-10 bg-white cursor-pointer text-gray-800 hover:bg-gray-100 shadow-md"
                onClick={() => profileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </Button>
            </div>
            {profileData.profilePicture && (
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 rounded-full p-1 h-6 w-6 shadow-md"
                onClick={() => removeImage("profilePicture")}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
            <input
              type="file"
              ref={profileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageChange("profilePicture", e)}
            />
          </div>
          <div>
            <Label className="font-medium text-gray-700">
              {t.profilePicture}
            </Label>
            <p className="text-sm text-gray-500 mt-1">{t.imageRequirements}</p>
          </div>
        </div>

        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-700">{t.firstName}</Label>
            <Input
              value={profileData.firstName}
              onChange={(e) => updateProfile("firstName", e.target.value)}
              placeholder={t.firstNamePlaceholder}
              className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">{t.middleName}</Label>
            <Input
              value={profileData.middleName}
              onChange={(e) => updateProfile("middleName", e.target.value)}
              placeholder={t.middleNamePlaceholder}
              className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">{t.lastName}</Label>
            <Input
              value={profileData.lastName}
              onChange={(e) => updateProfile("lastName", e.target.value)}
              placeholder={t.lastNamePlaceholder}
              className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email (readonly) */}
          <div className="space-y-2">
            <Label className="text-gray-700">{t.email}</Label>
            <div className="relative">
              <Input
                value={profileData.email}
                readOnly
                className="border-2 border-gray-200 bg-gray-50 cursor-not-allowed rounded-lg pr-10"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
            </div>
            <p className="text-sm text-gray-500">{t.emailCannotBeChanged}</p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label className="text-gray-700">{t.phoneNumber}</Label>
            <Input
              value={profileData.telephone}
              onChange={(e) => updateProfile("telephone", e.target.value)}
              placeholder="+251..."
              className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>
        </div>

        {/* Change Password Section */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <Label className="flex items-center gap-2 text-blue-600 font-semibold">
            <Lock className="w-4 h-4" /> {t.changePassword}
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700">{t.oldPassword}</Label>
              <Input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">{t.newPassword}</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">{t.confirmPassword}</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleChangePassword}
              className="gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Lock className="w-4 h-4" />
              {t.changePassword}
            </Button>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100">
          <Label className="flex items-center gap-2 text-blue-600 font-semibold">
            <Upload className="w-4 h-4" /> {t.signature}
          </Label>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg w-full md:w-64 h-32 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
              {profileData.signatureImage ? (
                <>
                  <Image
                    src={profileData.signatureImage}
                    alt="Signature"
                    className="max-h-28 max-w-full object-contain"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 rounded-full p-1 h-6 w-6 shadow-md"
                    onClick={() => removeImage("signatureImage")}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </>
              ) : (
                <div className="text-center p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 cursor-pointer"
                    onClick={() => signatureInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    ) : (
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    )}
                  </Button>
                  <p className="text-sm text-gray-500">{t.uploadSignature}</p>
                </div>
              )}
              <input
                type="file"
                ref={signatureInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageChange("signatureImage", e)}
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.signatureRequirements}</p>
            </div>
          </div>
        </div>

        {/* Save Profile Button */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button
            onClick={handleSaveProfile}
            disabled={isSavingProfile}
            className="gap-2 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-6 py-2"
          >
            {isSavingProfile ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> {t.saving}
              </>
            ) : (
              <>
                <User className="w-4 h-4" />
                {t.updateProfile}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
