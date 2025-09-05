"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft, FaRobot, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";
import { authTranslations } from "@/lib/translations/authTranslations";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { resetPassword, forgotPassword } from "@/lib/redux/slices/authSlice";

function ChangePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") ?? "";
  
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [errors, setErrors] = useState<{
    otp?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const { lang } = useLanguage();
  const t = authTranslations[lang];
  const dispatch = useDispatch<AppDispatch>();

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!otp) newErrors.otp = t.otpRequired;
    if (password.length < 8) newErrors.password = t.passwordError;
    if (password !== confirmPassword)
      newErrors.confirmPassword = t.confirmPasswordError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await dispatch(
        resetPassword({ email, otp, new_password: password })
      ).unwrap();

      if (res.success) {
        toast.success(t.passwordChangedSuccess);
        router.push("/");
      } else {
        toast.error(res.data.message || t.passwordChangeFailed);
      }
    } catch (error) {
      console.error(error);
      toast.error(t.passwordChangeFailed);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(
      () => setResendCountdown((prev) => prev - 1),
      1000
    );
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleResendOTP = async () => {
    if (!email) return;
    try {
      const res = await dispatch(forgotPassword({ email: email })).unwrap();

      if (res.success) {
        toast.success(t.otpSentSuccess + " " + email);
      } else {
        toast.error(res.data.message || t.otpSentFailed);
      }
      setResendCountdown(30);
    } catch (error) {
      console.error(error);
      toast.error(t.otpSentFailed);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl">
      <div className="text-center">
        <div className="flex justify-center items-center mb-6">
          <div className="bg-blue-600 text-white p-3 rounded-lg mr-3">
            <FaRobot className="text-2xl" />
          </div>
          <span className="text-3xl font-bold text-blue-800">Wekil AI</span>
        </div>
        <h2 className="mt-2 text-3xl font-bold text-gray-800">
          {t.changePasswordTitle}
        </h2>
        <p className="mt-2 text-sm text-gray-600">{t.changePasswordDesc}</p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {/* OTP */}
        <div className="flex items-center mb-4 justify-between">
          <input
            type="text"
            maxLength={6}
            placeholder={t.otpPlaceholder}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))}
            autoComplete="off"
            className="w-1/2 text-center tracking-widest text-lg font-medium px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base placeholder-gray-400"
          />
          <button
            type="button"
            disabled={resendCountdown > 0}
            onClick={handleResendOTP}
            className={`ml-4 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
              resendCountdown > 0
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {resendCountdown > 0 ? `${resendCountdown}s` : t.resend}
          </button>
        </div>

        {errors.otp && (
          <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
        )}

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={t.newPassword}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t.confirmNewPassword}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 cursor-pointer px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isLoading ? t.changingPassword : t.changePasswordButton}
        </button>

        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" /> {t.backToLogin}
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function ChangePassword() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={<p className="text-center text-blue-600">Loading...</p>}
      >
        <ChangePasswordForm />
      </Suspense>
    </div>
  );
}
