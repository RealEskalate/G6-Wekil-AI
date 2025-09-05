"use client";

import { useState, useEffect } from "react";
import { FaRobot } from "react-icons/fa";
import { translations } from "@/lib/translations/generalTranslations";
import { useLanguage } from "@/context/LanguageContext";

interface HeaderProps {
  activeSection: string;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export default function Header({
  activeSection,
  onLoginClick,
  onSignupClick,
  onScrollToSection,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center cursor-pointer">
          <div className="bg-blue-600 text-white p-2 rounded-lg mr-2 animate-pulse">
            <FaRobot className="text-xl" />
          </div>
          <span className="text-2xl font-bold text-blue-800">
            {t.headerBrand}
          </span>
        </div>

        <div className="hidden md:flex space-x-8">
          <button
            onClick={() => onScrollToSection("features")}
            className={`font-medium transition-colors cursor-pointer ${
              activeSection === "features"
                ? "text-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            {t.navFeatures}
          </button>
          <button
            onClick={() => onScrollToSection("how-it-works")}
            className={`font-medium transition-colors cursor-pointer ${
              activeSection === "howItWorks"
                ? "text-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            {t.navHowItWorks}
          </button>
          <button
            onClick={() => onScrollToSection("pricing")}
            className={`font-medium transition-colors cursor-pointer ${
              activeSection === "pricing"
                ? "text-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            {t.navPricing}
          </button>
          <button
            onClick={() => onScrollToSection("faq")}
            className={`font-medium transition-colors cursor-pointer ${
              activeSection === "faq"
                ? "text-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            {t.navFAQ}
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onLoginClick}
            className="text-blue-600 cursor-pointer hover:text-blue-800 font-medium transition-colors"
          >
            {t.loginButton}
          </button>
          <button
            onClick={onSignupClick}
            className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {t.signupButton}
          </button>

          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === "en" ? "am" : "en")}
            className="ml-2 border px-2 py-1 rounded text-sm font-medium hover:bg-gray-200 transition"
          >
            {lang === "en" ? "AM" : "EN"}
          </button>
        </div>
      </div>
    </nav>
  );
}
