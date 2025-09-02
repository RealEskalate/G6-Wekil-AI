"use client";

import { MdDriveFileRenameOutline } from "react-icons/md";
import { FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import { SignupFormData, FormErrors } from "@/types/auth";
import { useLanguage } from "@/context/LanguageContext";
import { authTranslations } from "@/lib/authTranslations";

interface IndividualFormProps {
  formData: SignupFormData;
  errors: FormErrors;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function IndividualForm({
  formData,
  errors,
  onInputChange,
}: IndividualFormProps) {
  const { lang } = useLanguage();
  const t = authTranslations[lang];

  const inputClass =
    "w-full pl-8 py-1.5 text-xs border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500";

  return (
    <>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {t.first_name} *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <MdDriveFileRenameOutline className="text-gray-400 text-sm" />
            </div>
            <input
              type="text"
              name="first_name"
              placeholder={t.first_name}
              className={`${inputClass} ${
                errors.first_name ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.first_name}
              onChange={onInputChange}
            />
          </div>
          {errors.first_name && (
            <p className="mt-0.5 text-xs text-red-600">{errors.first_name}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {t.middle_name} *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <MdDriveFileRenameOutline className="text-gray-400 text-sm" />
            </div>
            <input
              type="text"
              name="middle_name"
              placeholder={t.middle_name}
              className={`${inputClass} ${
                errors.middle_name ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.middle_name}
              onChange={onInputChange}
            />
          </div>
          {errors.middle_name && (
            <p className="mt-0.5 text-xs text-red-600">{errors.middle_name}</p>
          )}
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {t.last_name} *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <MdDriveFileRenameOutline className="text-gray-400 text-sm" />
          </div>
          <input
            type="text"
            name="last_name"
            placeholder={t.last_name}
            className={`${inputClass} ${
              errors.last_name ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.last_name}
            onChange={onInputChange}
          />
        </div>
        {errors.last_name && (
          <p className="mt-0.5 text-xs text-red-600">{errors.last_name}</p>
        )}
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {t.email} *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <FaEnvelope className="text-gray-400 text-sm" />
          </div>
          <input
            type="email"
            name="email"
            placeholder={t.email}
            className={`${inputClass} ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.email}
            onChange={onInputChange}
          />
        </div>
        {errors.email && (
          <p className="mt-0.5 text-xs text-red-600">{errors.email}</p>
        )}
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {t.telephone} *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <FaPhone className="text-gray-400 text-sm" />
          </div>
          <input
            type="tel"
            name="telephone"
            placeholder="+251..."
            className={`${inputClass} ${
              errors.telephone ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.telephone}
            onChange={onInputChange}
          />
        </div>
        {errors.telephone && (
          <p className="mt-0.5 text-xs text-red-600">{errors.telephone}</p>
        )}
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {t.password} *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <FaLock className="text-gray-400 text-sm" />
            </div>
            <input
              type="password"
              name="password"
              placeholder={t.password}
              className={`${inputClass} ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.password}
              onChange={onInputChange}
            />
          </div>
          {errors.password && (
            <p className="mt-0.5 text-xs text-red-600">{errors.password}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {t.confirmPassword} *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <FaLock className="text-gray-400 text-sm" />
            </div>
            <input
              type="password"
              name="confirmPassword"
              placeholder={t.confirmPassword}
              className={`${inputClass} ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.confirmPassword}
              onChange={onInputChange}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-0.5 text-xs text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
