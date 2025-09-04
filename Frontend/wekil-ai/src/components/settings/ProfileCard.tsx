"use client";

import React, { useState, useRef, useEffect } from "react";
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
import { User, Camera, Loader2, Lock, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { settingTranslations } from "@/lib/settingTranslations";
import { useLanguage } from "@/context/LanguageContext";
import type { FormData } from "@/types/auth";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  fetchProfile,
  updateProfileApi,
} from "@/lib/redux/slices/profileSlice";
import { useSession } from "next-auth/react";
import { changePassword } from "@/lib/redux/slices/authSlice";

export default function ProfileCard() {
  const profileState = useSelector((state: RootState) => state.profile);
  const [profileData, setProfileData] = useState<FormData>({
    profilePicture: "",
    signatureImage: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const profileInputRef = useRef<HTMLInputElement>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const [drawing, setDrawing] = useState(false);
  const currentPath = useRef<string>("");

  const { lang } = useLanguage();
  const t = settingTranslations[lang];
  const accessToken = session?.user?.accessToken;
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    if (accessToken && !profileState.loaded) {
      dispatch(fetchProfile(accessToken!))
        .unwrap()
        .catch((err) => {
          toast.error("Failed to load profile data");
          console.error(err);
        });
    }
  }, [accessToken, dispatch, profileState.loaded]);

  useEffect(() => {
    if (profileState.user) {
      setProfileData({
        profilePicture: profileState.user.profileImage || "",
        signatureImage: profileState.user.signature || "",
        first_name: profileState.user.first_name || "",
        middle_name: profileState.user.middle_name || "",
        last_name: profileState.user.last_name || "",
        email: profileState.user.email || "",
        telephone: profileState.user.telephone || "",
        password: "",
        confirmPassword: "",
        address: profileState.user.address || "",
      });
    }
  }, [profileState.user]);

  const getPoint = (
    e:
      | React.MouseEvent<SVGSVGElement, MouseEvent>
      | React.TouchEvent<SVGSVGElement>
  ) => {
    if ("touches" in e && e.touches.length > 0) {
      const rect = (e.target as SVGSVGElement).getBoundingClientRect();
      const touch = e.touches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    } else if ("nativeEvent" in e) {
      const mouseEvent = e.nativeEvent as MouseEvent;
      return { x: mouseEvent.offsetX, y: mouseEvent.offsetY };
    }
    return { x: 0, y: 0 };
  };

  const handleDrawStart = (
    e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>
  ) => {
    setDrawing(true);
    const { x, y } = getPoint(e);
    currentPath.current = `M ${x} ${y}`;
  };

  const handleDrawMove = (
    e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>
  ) => {
    if (!drawing) return;
    const { x, y } = getPoint(e);
    currentPath.current += ` L ${x} ${y}`;
    setPaths((prev) => [...prev.slice(0, -1), currentPath.current]);
  };

  const handleClearDrawing = () => {
    setPaths([]);
    currentPath.current = "";
  };

  const uploadSVG = async () => {
    if (paths.length === 0) return "";
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="200">${paths
      .map(
        (d) => `<path d="${d}" stroke="black" stroke-width="2" fill="none"/>`
      )
      .join("")}</svg>`;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const file = new File([blob], "signature.svg", { type: "image/svg+xml" });
    const url = await uploadToCloudinary(file);
    return url;
  };

  const handleDrawEnd = () => {
    if (!drawing) return;
    setDrawing(false);
    setPaths([...paths, currentPath.current]);
    currentPath.current = "";
  };

  const updateProfile = <K extends keyof FormData>(
    key: K,
    value: FormData[K]
  ) => {
    console.log(`Updating ${key} to`, value);
    setProfileData((prev) => ({ ...prev, [key]: value }));
  };

  const uploadToCloudinary = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();

    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
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

    if (!file.type.startsWith("image/")) {
      toast.error(t.invalidFileType);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
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
    if (!accessToken) return toast.error("Not authenticated");
    setIsSavingProfile(true);
    try {
      let signatureUrl = profileData.signatureImage;
      if (!profileData.signatureImage && paths.length > 0) {
        signatureUrl = await uploadSVG();
      }

      const payload = {
        first_name: profileData.first_name,
        middle_name: profileData.middle_name,
        last_name: profileData.last_name,
        telephone: profileData.telephone,
        address: profileData.address,
        profile_image: profileData.profilePicture,
        signature: signatureUrl,
      };

      const result = await dispatch(
        updateProfileApi({ accessToken, profileData: payload })
      ).unwrap();

      toast.success(result.message);
      dispatch(fetchProfile(accessToken));
    } catch (error: unknown) {
      console.log(error);
      toast.error(t.failedToUpdateProfile);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsChanging(true);
      const result = await dispatch(
        changePassword({
          old_password: oldPassword,
          new_password: newPassword,
          token: accessToken!,
        })
      ).unwrap();

      toast.success(result.data?.message || "Password changed successfully");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      toast.error(
        typeof error === "string" ? error : "Failed to change password"
      );
    }
    setIsChanging(false);
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
                  className="w-full h-full object-cover rounded-full"
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
                className="absolute -bottom-2 -right-2 z-50 rounded-full p-1 h-6 w-6 shadow-md cursor-pointer flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white"
                onClick={() => removeImage("profilePicture")}
              >
                <Pencil className="w-4 h-4 bottom-0 right-0" />
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
            <Label className="text-gray-700">{t.first_name}</Label>
            <Input
              value={profileData.first_name}
              onChange={(e) => updateProfile("first_name", e.target.value)}
              placeholder={t.first_namePlaceholder}
              className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">{t.middle_name}</Label>
            <Input
              value={profileData.middle_name}
              onChange={(e) => updateProfile("middle_name", e.target.value)}
              placeholder={t.middle_namePlaceholder}
              className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">{t.last_name}</Label>
            <Input
              value={profileData.last_name}
              onChange={(e) => updateProfile("last_name", e.target.value)}
              placeholder={t.last_namePlaceholder}
              className="border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          {/* Address */}
          <div className="space-y-2">
            <Label className="text-gray-700">{t.address}</Label>
            <Input
              value={profileData.address}
              onChange={(e) => updateProfile("address", e.target.value)}
              placeholder="Enter your address"
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
              {isChanging ? "Changing..." : t.changePassword}
            </Button>
          </div>
        </div>

        {/* Signature Drawing Section */}
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg w-full md:w-64 h-32 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
          {!profileData.signatureImage && (
            <>
              <p className="absolute top-1 left-1 text-gray-400 text-sm select-none pointer-events-none">
                Draw your signature here
              </p>
              <svg
                width="100%"
                height="100%"
                style={{ touchAction: "none", cursor: "crosshair" }}
                onMouseDown={handleDrawStart}
                onMouseMove={handleDrawMove}
                onMouseUp={handleDrawEnd}
                onMouseLeave={handleDrawEnd}
                onTouchStart={handleDrawStart}
                onTouchMove={handleDrawMove}
                onTouchEnd={handleDrawEnd}
              >
                {paths.map((d, idx) => (
                  <path
                    key={idx}
                    d={d}
                    stroke="black"
                    strokeWidth={2}
                    fill="none"
                  />
                ))}
              </svg>
            </>
          )}

          {profileData.signatureImage && (
            <>
              <Image
                src={profileData.signatureImage}
                alt="Signature"
                fill
                className="max-h-28 max-w-full object-contain"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute -bottom-2 -right-2 z-50 rounded-full p-1 h-6 w-6 shadow-md cursor-pointer flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white"
                onClick={() => removeImage("signatureImage")}
              >
                <Pencil className="w-4 h-4 bottom-0 right-0" />
              </Button>
            </>
          )}
        </div>
        {!profileData.signatureImage && paths.length > 0 && (
          <div className="flex justify-end mt-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={handleClearDrawing}
              className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white"
            >
              Clear
            </Button>
          </div>
        )}

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
