"use client";

import { useState, Suspense } from "react";
import { FaEnvelope, FaRobot } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleResendOTP = async (targetEmail?: string) => {
    const finalEmail = targetEmail || email;
    if (!finalEmail) return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(`OTP sent to: ${finalEmail}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await handleResendOTP();
      router.push(`/auth/change-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
          Forgot Password
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email to reset your password
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group relative cursor-pointer w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : "Send OTP to Email"}
        </button>
      </form>

      <div className="text-center text-sm text-gray-600 mt-4">
        <p>
          Remember your password?{" "}
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={<p className="text-center text-blue-600">Loading...</p>}
      >
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
