import React from "react";
import { Globe } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext"; // Import context

const CreateContractHeader = () => {
  const { lang, setLang } = useLanguage();// Use context

  return (
    <div className="w-full flex justify-between">
      <div>
        <Link href="/dashboard"></Link>
        <div className="inline">
          <p className="text-xl my-2 text-blue-950 font-bold">
            {lang === "en" ? "Contract Wizard" : "የውል አዘጋጅ"}
          </p>
          <p className="text-md mb-2 text-gray-500 font-semibold">
            {lang === "en" ? "Step 1 of 5" : "ደረጃ 1 ከ 5"}
          </p>
        </div>
      </div>
      <div>
        <button
          className="rounded-full px-2 py-1 border border-gray-200 hover:bg-blue-400 flex items-center"
          onClick={() => setLang(lang === "en" ? "am" : "en")}
        >
          <Globe className="w-6 h-8 mx-2" />
          {lang === "en" ? "amh" : "eng"}
        </button>
      </div>
    </div>
  );
};

export default CreateContractHeader;
// filepath: c:\Users\kenan\G6-Wekil-AI-1\Frontend\wekil-ai\src\components\create-contract\header.tsx