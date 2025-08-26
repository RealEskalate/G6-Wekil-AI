"use client";

import { useState } from "react";
import { FaGoogle, FaEnvelope, FaLock, FaRobot } from "react-icons/fa";

interface LoginPageProps {
  onLoginComplete: (email: string) => void;
  onSwitchToSignup: () => void;
}

export default function LoginPage({
  onLoginComplete,
  onSwitchToSignup,
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onLoginComplete(email);
    } catch (err) {
      setErrors({
        general: `Invalid email or password. Please try again. ${err}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
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
              Welcome Back
            </h2>
            <p className="text-sm text-gray-600">
              Sign in to your Wekil AI account
            </p>
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
                Email Address
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
                Password
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
                  className="h-3 w-3 text-blue-600 focus:ring-1 focus:ring-blue-400 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-1 text-gray-700">
                  Remember me
                </label>
              </div>
              <a
                href="/auth/forgot-password"
                className="text-blue-600 cursor-pointer hover:text-blue-500"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 cursor-pointer text-white py-2 text-sm rounded-md font-medium hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow-sm flex items-center justify-center focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Google login */}
          <div className="mt-4">
            <div className="relative flex items-center">
              <div className="w-full border-t border-gray-300"></div>
              <span className="px-2 bg-white text-xs text-gray-500">Or</span>
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <button
              onClick={handleGoogleLogin}
              className="mt-3 w-full cursor-pointer inline-flex justify-center py-2 px-3 border border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
            >
              <FaGoogle className="text-red-500 mr-2 text-sm" /> Google
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              Don’t have an account?{" "}
              <button
                onClick={onSwitchToSignup}
                className="text-blue-600 cursor-pointer hover:text-blue-500 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
