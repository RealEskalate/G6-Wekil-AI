"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft, FaRobot, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

function ChangePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

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

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!otp) newErrors.otp = "OTP is required";
    if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to change password");
      }

      toast.success("Password changed successfully!");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Error changing password");
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
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(`OTP resent to: ${email}`);
      setResendCountdown(30);
    } catch (error) {
      console.error(error);
      toast.error("Failed to resend OTP");
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
          Change Password
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter OTP and your new password
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {/* OTP */}
        <div className="flex items-center mb-4 justify-between">
          <input
            type="text"
            maxLength={6}
            placeholder="XXX-XXX"
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
            {resendCountdown > 0 ? `${resendCountdown}s` : "Resend"}
          </button>
        </div>

        {errors.otp && (
          <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
        )}

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
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
            placeholder="Confirm Password"
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
          {isLoading ? "Changing Password..." : "Change Password"}
        </button>

        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Login
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
