"use client";
import { ContractFormat } from "@/types/Contracttype";
import React from "react";
import {
  Handshake,
  Banknote,
  ScrollText,
  Shield,
  Users,
  DollarSign,
  Timer,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit3,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { viewContractTranslation } from "@/lib/DashboardTranslation/dashboardPageTranslation";
interface ContractCardProps {
  contract: ContractFormat;
}
function getTimeAgo(createdAt: string,lang:"am"|"en"): string {
  // Create Date objects
  const createdDate = new Date(createdAt);
  const now = new Date();

  // Validate the input date
  if (isNaN(createdDate.getTime())) {
    throw new Error(
      "Invalid date string provided. Please use a valid ISO format (e.g., '2024-01-01')."
    );
  }

  // Calculate the difference in milliseconds using .getTime()
  const diffMs = now.getTime() - createdDate.getTime();

  // Handle potential future dates (if necessary)
  if (diffMs < 0) {
    // This is a future date. Choose how to handle it:
    // Option 1: Return a message
    return "in the future";
    
  }

  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30); // Approximation
  const diffYears = Math.floor(diffDays / 365); // Approximation

  const translation = viewContractTranslation[lang].getTimeAgo;
  if (diffYears > 0) {
    return `${diffYears} ${viewContractTranslation[lang].getTimeAgo.year} ${diffYears !== 1 && lang === 'en'? "s" : ""} ${translation.ago}`;
  } else if (diffMonths > 0) {
    return `${diffMonths} ${translation.month}${diffMonths !== 1 && lang === 'en'? "s" : ""} ${translation.ago}`;
  } else if (diffDays > 0) {
    return `${diffDays} ${translation.day}${diffDays !== 1 && lang === 'en'? "s" : ""} ${translation.ago}`;
  } else if (diffHours > 0) {
    return `${diffHours} ${translation.hour}${diffHours !== 1 && lang === 'en'? "s" : ""} ${translation.ago}`;
  } else if (diffMins > 0) {
    return `${diffMins} ${translation.minute}${diffMins !== 1 && lang === 'en'? "s" : ""} ${translation.ago}`;
  } else if (diffSecs > 0) { 
    return `${diffSecs} ${translation.second}${diffSecs !== 1 && lang === 'en'? "s" : ""} ${translation.ago}`;
  } else {
    return translation.just;
  }
}

const contractIcons = {
  service: {
    icon: <Handshake className="w-5 h-5 text-blue-500 " />,
  },
  sale: {
    icon: <Banknote className="w-5 h-5 text-blue-500 " />,
  },
  loan: {
    icon: <ScrollText className="w-5 h-5 text-blue-500 " />,
  },
  nonDisclosure: {
    icon: <Shield className="w-5 h-5 text-blue-500 " />,
  },
};

const ContractCard: React.FC<ContractCardProps> = ({ contract }) => {
  const [showMore, setshowMore] = React.useState(false);
  const {lang} = useLanguage();

  return (
    <div className="w-full bg-white col-span-2 md:col-span-1 border border-gray-200 rounded-2xl p-4 m-4">
      <div className="flex items-center">
        {contractIcons[contract.type].icon}
        <span
          className={`text-sm ml-2 p-1 px-2 font-semibold border border-gray-100 rounded-full ${
            contract.status === "completed"
              ? "text-blue-600 bg-blue-100"
              : "text-green-600 bg-green-100"
          }`}
        >
          {contract.status}
        </span>
      </div>
      <div className="my-2">
        <p className="text-md font-semibold">{contract.title}</p>
        <p className="text-xs text-gray-500">{contract.type} {`${lang=='en'?"Agreement":"ውሎች"}`}</p>
      </div>
      <div className="grid grid-cols-2 mt-8 gap-6">
        <p className="col-span-1 text-sm text-blue-950 font-semibold">
          <Users className="inline w-5 h-5 mx-2" />
          {contract.party1.name}
        </p>
        <p className="col-span-1 text-sm text-blue-950 font-semibold">
          <Timer className="inline w-5 h-5 mx-2" />
          {getTimeAgo(contract.createdAt,lang)}
        </p>
        <p className="col-span-1 text-sm text-blue-950 font-semibold">
          <DollarSign className="inline w-5 h-5 mx-2" />
          ETB {contract.payment}
        </p>
      </div>
      <button className="text-center"></button>
      {showMore ? (
        <>
          <hr className="my-5 border-gray-200" />
          <div className="">
            <p className="inline mx-2 text-sm text-blue-950 font-semibold">
              {`${lang=='en'?"Parties:":"ወገኖች"}`}
            </p>
            <p className="inline mx-2 text-sm text-blue-950 font-semibold">
              {contract.party1.name} & {contract.party2.name}
            </p>
            <p className="mx-4 text-sm text-blue-950 font-semibold my-2">
              <MapPin className="inline w-5 h-5 mr-2" />
              {contract.party1.address}
            </p>
            <p className="mx-4 text-sm text-blue-950 font-semibold my-2">
              <Calendar className="inline w-5 h-5 mr-2" />
              {contract.startDate} - {contract.endDate}
            </p>
            <p className="mx-2 text-sm text-blue-950 font-semibold my-2">
              {`${lang=='en'?"Description:":"መግለጫ፡"}`}
            </p>
            <div className="border border-gray-100 rounded-lg p-3 ml-4 font-semibold">
              <p className="inline text-sm text-blue-950">
                {contract.Description}
              </p>
            </div>
            <div className="flex justify-around">
              <button className="text-center bg-blue-900 p-1 m-4 rounded-full pr-8 text-sm w-full hover:bg-blue-500 text-white">
                <Eye className="inline w-5 h-5 mx-2" /> {`${lang=='en'?"View:":"ይመልከቱ"}`}

              </button>
              <button className="text-center bg-blue-900 p-1 m-4 rounded-full pr-8 text-sm w-full hover:bg-blue-400 text-white">
                <Edit3 className="inline w-5 h-5 mx-2" />  {`${lang=='en'?"Edit:":"ያርሙ"}`}
              </button>
            </div>
          </div>
        </>
      ) : null}
      {!showMore ? (
        <button
          onClick={() => setshowMore(!showMore)}
          className="my-4 text-blue-500 font-semibold text-sm"
        >
          <ChevronDown className="inline mx-2" />
          {`${lang == 'en' ? "Show More" : "ተጨማሪ አሳይ"}`}
        </button>
      ) : (
        <button
          onClick={() => setshowMore(!showMore)}
          className="my-4 text-blue-500 font-semibold text-sm"
        >
          <ChevronUp className="inline mx-2" />
          {`${lang == 'en' ? "Show Less" : "በመጠኑ አሳይ"}`}
        </button>
      )}
    </div>
  );
};

export default ContractCard;
