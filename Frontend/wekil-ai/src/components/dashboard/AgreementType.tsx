import React from "react";
import { Handshake, Banknote, ScrollText, Shield } from "lucide-react";

export const contractTypes = {
  service: {
    icon: (
      <Handshake className="w-1/5 h-1/5 hover:w-1/4 hover:h-1/4 transition-all rounded-full text-blue-950 " />
    ),
    title: { en: "Service Agreement", am: "የአገልግሎት ስምምነት" },
    description: {
      en: "For freelance work, consulting, and services",
      am: "ለነጻ ስራ፣ አማካሪነት እና አገልግሎቶች",
    },
  },
  sale: {
    icon: (
      <Banknote className="w-1/5 h-1/5 hover:w-1/4 hover:h-1/4 transition-all rounded-full text-blue-950" />
    ),
    title: { en: "Sale of Goods", am: "የዕቃ ሽያጭ" },
    description: {
      en: "For buying and selling products or items",
      am: "ምርቶችን ወይም እቃዎችን ለመግዛት እና ለመሸጥ",
    },
  },
  loan: {
    icon: (
      <ScrollText className="w-1/5 h-1/5 hover:w-1/4 hover:h-1/4 transition-all rounded-full text-blue-950" />
    ),
    title: { en: "Simple Loan", am: "ቀለል ያለ ብድር" },
    description: {
      en: "For personal loans between individuals",
      am: "በግለሰቦች መካከል ለግል ብድር",
    },
  },
  nonDisclosure: {
    icon: (
      <Shield className="w-1/5 h-1/5 hover:w-1/4 hover:h-1/4 transition-all rounded-full text-blue-950" />
    ),
    title: { en: "Non-Disclosure Agreement", am: "የሚስጥር ጥበቃ ስምምነት" },
    description: {
      en: "To protect confidential information",
      am: "ሚስጥራዊ መረጃን ለመጠበቅ",
    },
  },
};
const AgreementType = ({
  type,
  lang,
}: {
  type: "service" | "loan" | "sale" | "nonDisclosure";
  lang: "en" | "am";
}) => {
  return (
    <div className="px-4 border col-span-4 md:col-span-2 lg:col-span-1 border-gray-100 cursor-pointer hover:shadow-lg hover:scale-105 hover:border hover:border-blue-300 transition-all duration-300 ease-in-out p-6 rounded-lg">
      <div className="flex justify-center mb-4 rounded-full">
        {contractTypes[type].icon}
      </div>
      <p className="pl-3 mb-4 text-center text-lg font-bold text-gray-700">
        {contractTypes[type].title[lang]}
      </p>
      <p className="pl-3 mb-4 text-md text-gray-500">
        {contractTypes[type].description[lang]}
      </p>
    </div>
  );
};

export default AgreementType;
