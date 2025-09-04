"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock, FaRobot } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { authTranslations } from "@/lib/authTranslations";

interface LoginPageProps {
  onLoginComplete: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => void;
  onSwitchToSignup: () => void;
}

export default function LoginPage({
  onLoginComplete,
  onSwitchToSignup,
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const { lang } = useLanguage();
  const t = authTranslations[lang];

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = t.emailRequired;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t.invalidEmail;
    }
    if (!password) {
      newErrors.password = t.passwordRequired;
    } else if (password.length < 8) {
      newErrors.password = t.passwordLengthError;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      onLoginComplete(email, password, rememberMe);
    } catch (err) {
      console.log(err);
      setErrors({
        general: t.loginGeneralError,
      });
      toast.error(t.loginFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 to-indigo-100/70 -z-10"></div>

      <div className="w-full max-w-md bg-white/95 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm">
        <div className="p-4 sm:p-6">
          <div className="text-center mb-6">
            <div className="bg-blue-600 text-white p-2 rounded-lg inline-block mb-3">
              <FaRobot className="text-xl" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              {t.welcomeBack}
            </h2>
            <p className="text-sm text-gray-600">{t.signInAccount}</p>
          </div>

          {errors.general && (
            <div className="mb-4 p-2 text-sm bg-red-100 text-red-700 rounded-md">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                {t.emailLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400 text-sm" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-8 pr-2 py-2 text-sm border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                {t.passwordLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400 text-sm" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-8 pr-2 py-2 text-sm border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3 w-3 text-blue-600 focus:ring-1 focus:ring-blue-400 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-1 text-gray-700">
                  {t.rememberMe}
                </label>
              </div>
              <a
                href="/auth/forgot-password"
                className="text-blue-600 cursor-pointer hover:text-blue-500"
              >
                {t.forgotPassword}
              </a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 cursor-pointer text-white py-2 text-sm rounded-md font-medium hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow-sm flex items-center justify-center focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              {isSubmitting ? t.signingIn : t.signIn}
            </button>
          </form>

          {/* Google login */}
          <div className="mt-4">
            <div className="relative flex items-center">
              <div className="w-full border-t border-gray-300"></div>
              <span className="px-2 bg-white text-xs text-gray-500">
                {t.or}
              </span>
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <button
              onClick={handleGoogleLogin}
              className="mt-3 w-full cursor-pointer inline-flex items-center justify-center py-2 px-3 border border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 48 48"
                className="mr-2"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
              Google
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              {t.dontHaveAccount}{" "}
              <button
                onClick={onSwitchToSignup}
                className="text-blue-600 cursor-pointer hover:text-blue-500 font-medium"
              >
                {t.signUp}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
