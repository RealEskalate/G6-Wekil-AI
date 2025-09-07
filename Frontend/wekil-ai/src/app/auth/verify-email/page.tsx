"use client";

import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";
import { authTranslations } from "@/lib/translations/authTranslations";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { verifyOtp } from "@/lib/redux/slices/authSlice";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { user } = useSelector((state: RootState) => state.auth);
  const { lang } = useLanguage();
  const t = authTranslations[lang];
  const dispatch = useDispatch<AppDispatch>();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!user?.email) {
      toast.error("No email found. Please register first.");
      setLoading(false);
      return;
    }

    try {
      const res = await dispatch(
        verifyOtp({ email: user.email, otp })
      ).unwrap();

      if (res.success) {
        toast.success(t.emailVerifiedSuccess);
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        setMessage(res.message || "❌ Invalid OTP, please try again.");
        toast.error(res.message || t.somethingWentWrong);
      }
    } catch (err) {
      console.error(err);
      toast.error(t.somethingWentWrong);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4">
          {t.verifyEmailTitle}
        </h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          {t.verifyEmailDesc}
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="flex items-center border rounded-lg px-3 py-2">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder={t.enterOtp}
              className="flex-1 outline-none text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            {loading ? t.verifying : t.verifyEmailButton}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm mt-4 text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
}
