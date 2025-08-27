import React from "react";
import { Handshake, Banknote, ScrollText, Shield } from "lucide-react";

const contractTypes = {
  service: {
    icon: (
      <Handshake className="w-1/5 h-1/5 hover:w-1/4 hover:h-1/4 transition-all rounded-full text-blue-500 " />
    ),
    title: { english: "Service Agreement", amharic: "የአገልግሎት ስምምነት" },
    description: {
      english: "For freelance work, consulting, and services",
      amharic: "ለነጻ ስራ፣ አማካሪነት እና አገልግሎቶች",
    },
  },
  sale: {
    icon: (
      <Banknote className="w-1/5 h-1/5 hover:w-1/4 hover:h-1/4 transition-all rounded-full text-blue-500 " />
    ),
    title: { english: "Sale of Goods", amharic: "የዕቃ ሽያጭ" },
    description: {
      english: "For buying and selling products or items",
      amharic: "ምርቶችን ወይም እቃዎችን ለመግዛት እና ለመሸጥ",
    },
  },
  loan: {
    icon: (
      <ScrollText className="w-1/5 h-1/5 hover:w-1/4 hover:h-1/4 transition-all rounded-full text-blue-500 " />
    ),
    title: { english: "Simple Loan", amharic: "ቀለል ያለ ብድር" },
    description: {
      english: "For personal loans between individuals",
      amharic: "በግለሰቦች መካከል ለግል ብድር",
    },
  },
  nonDisclosure: {
    icon: (
      <Shield className="w-1/5 h-1/5 hover:w-1/4 hover:h-1/4 transition-all rounded-full text-blue-500 " />
    ),
    title: { english: "Non-Disclosure Agreement", amharic: "የሚስጥር ጥበቃ ስምምነት" },
    description: {
      english: "To protect confidential information",
      amharic: "ሚስጥራዊ መረጃን ለመጠበቅ",
    },
  },
};
const AgreementType = ({
  type,
}: {
  type: "service" | "loan" | "sale" | "nonDisclosure";
}) => {
  return (
    <div className="px-4 border col-span-4 md:col-span-2 lg:col-span-1 border-gray-100 cursor-pointer hover:shadow-lg hover:scale-105 hover:border hover:border-blue-300 transition-all duration-300 ease-in-out p-6 rounded-lg">
      <div className="flex justify-center mb-4 rounded-full">
        {contractTypes[type].icon}
      </div>
      <p className="pl-3 mb-4 text-center text-lg font-bold text-gray-700">
        {contractTypes[type].title.english}
      </p>
      <p className="pl-3 mb-4 text-md text-gray-500">
        {contractTypes[type].description.english}
      </p>
    </div>
  );
};

export default AgreementType;
