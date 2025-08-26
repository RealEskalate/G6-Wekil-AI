"use client";

import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      //   const res = await fetch("/api/auth/verify-email", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ otp }),
      //   });

      //   const data = await res.json();

      //   if (res.ok) {
      toast.success("✅ Email verified successfully!");
      console.log("email verified");
      // redirect after success
      setTimeout(() => {
        window.location.href = "/"; // or wherever you want
      }, 1500);
      //   } else {
      //     setMessage(data.error || "❌ Invalid OTP, please try again.");
      //   }
    } catch (err) {
      toast.error(`⚠️ Something went wrong, try again later. ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4">
          Verify Your Email
        </h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          We have sent a verification code to your email. Enter it below:
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="flex items-center border rounded-lg px-3 py-2">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="flex-1 outline-none text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        {message && <p className="text-center text-sm mt-4">{message}</p>}
      </div>
    </div>
  );
}
