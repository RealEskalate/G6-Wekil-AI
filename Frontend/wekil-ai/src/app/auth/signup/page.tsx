"use client";

import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { IndividualFormData, FormErrors } from "@/types/auth";
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateName,
  validateConfirmPassword,
} from "@/utils/validation";
import IndividualForm from "@/components/auth/IndividualForm";
import VerifyEmail from "../verify-email/page";

interface SignupPageProps {
  onBackToLogin: () => void;
}

export default function SignupPage({ onBackToLogin }: SignupPageProps) {
  const [individualForm, setIndividualForm] = useState<IndividualFormData>({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setIndividualForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!validateName(individualForm.firstName)) {
      newErrors.firstName = "First name must be at least 2 letters";
    }
    if (!validateName(individualForm.middleName)) {
      newErrors.middleName = "Middle name must be at least 2 letters";
    }
    if (!validateName(individualForm.lastName)) {
      newErrors.lastName = "Last name must be at least 2 letters";
    }
    if (!validateEmail(individualForm.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!validatePhone(individualForm.telephone)) {
      newErrors.telephone = "Invalid phone number";
    }
    if (!validatePassword(individualForm.password)) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (
      !validateConfirmPassword(
        individualForm.password,
        individualForm.confirmPassword
      )
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Fake API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowVerifyModal(true); // 👈 show popup after success
    } catch (error) {
      setErrors({
        general: `An error occurred during registration. Please try again. ${error}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 to-indigo-100/70 -z-10"></div>

      <div className="w-full max-w-lg bg-white/95 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm">
        <div className="w-full p-4 md:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Create Account
            </h2>
            <button
              onClick={onBackToLogin}
              className="text-blue-600 cursor-pointer hover:text-blue-800 text-sm flex items-center"
            >
              <FaArrowLeft className="mr-1" /> Back
            </button>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="mb-3 p-2 bg-red-100 text-red-700 text-sm rounded-md">
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <IndividualForm
              formData={individualForm}
              errors={errors}
              onInputChange={handleInputChange}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 cursor-pointer text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow-sm flex items-center justify-center focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Verify Email Modal */}
      {showVerifyModal && <VerifyEmail />}
    </div>
  );
}
