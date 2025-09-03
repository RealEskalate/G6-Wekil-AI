"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FiAlertTriangle } from "react-icons/fi";

const NotAuthorizedPage: React.FC = () => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 sm:p-16 max-w-lg w-full text-center transition-transform transform hover:scale-105">
        <FiAlertTriangle className="mx-auto text-red-500 text-6xl mb-6 animate-bounce" />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-base sm:text-lg">
          You are not authorized to view this page. Please log in to continue.
        </p>
        <button
          onClick={handleLoginRedirect}
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default NotAuthorizedPage;
