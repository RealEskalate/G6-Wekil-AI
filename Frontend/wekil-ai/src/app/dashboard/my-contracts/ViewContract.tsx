"use client";
import React from "react";
import { ArrowLeft, Edit3, Download, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ContractDescription from "@/components/Contract/ContractDescription";
import PartyCard from "@/components/Contract/partyCard";
import { ContractFormat } from "@/types/Contracttype";
import StatusCard from "@/components/Contract/StatusCard";
import TypeSpecificFields from "@/components/Contract/TypeSpecificFields";
import { useLanguage } from "@/context/LanguageContext";
const options = [
  {
    label: {en:"Edit",am:"ያስተካክሉ"},
    icon: <Edit3 className="inline mx-2 w-4 h-4  text-blue-950 " />,
  },
  {
    label: {en:"Export",am:"ያውርዱ"},
    icon: <Download className="inline mx-2 w-4 h-4  text-blue-950 " />,
  },
  {
    label: {en:"Share",am:"ያጋሩ"},
    icon: <Share2 className="inline mx-2 w-4 h-4  text-blue-950 " />,
  },
];
interface ViewContractProps {
  contract: ContractFormat;
}
const ViewContract: React.FC<ViewContractProps> = ({ contract }) => {
  const route = useRouter();
  const {lang}=useLanguage();
  return (
    <div className="border-l border-gray-200 min-h-screen">
      <div className="md:flex md:justify-between mt-12 mx-4">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
          <button
            className="text-blue-950 text-sm font-semibold h-10 text-md mx-3 rounded-full border-gray-100 hover:bg-blue-400 hover:text-white px-2"
            onClick={() => route.push("/dashboard")}
          >
            <ArrowLeft className="inline w-6 h-6 mx-2" />
            { lang==="en"?"back to Dashboard":"ወደ ዳሽቦርድ ተመለስ" }
          </button>
          <span className="">
            <p className="text-2xl my-2 text-blue-950 font-bold">
              { lang==="en"?"Contract Details":"የውል ዝርዝር" }
              
            </p>
            <p className="text-md pl-8 mb-2 text-gray-500 font-normal">
              {contract.title}
            </p>
          </span>
        </div>
        <div className="mt-4">
          <div className="col-span-8 md:col-span-3 flex items-center mb-4">
            {options.map((item, index) => (
              <div
                className="inline mx-2 text-sm text-gray-700 hover:text-blue-400 bg-gray-100 font-semibold border border-gray-200 shadow-5xl shadow-gray-500 cursor-pointer px-3 py-1 rounded-full"
                key={index}
              >
                {item.icon}
                {item.label[lang]}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 items-start">
        <div className="col-span-4 md:col-span-3">
          <ContractDescription contract={contract} />
          <PartyCard party1={contract.party1} party2={contract.party2} type={contract.type}/>
          <TypeSpecificFields contract={contract} />
        </div>
        <div className="col-span-4 md:col-span-1 h-auto">
          <div className="border border-gray-200 rounded-2xl py-4">
            <p className="text-center text-lg font-semibold">{lang=='en'?'Quick Actions':'ፈጣን '} </p>
            {options.map((item, index) => (
              <div
                className="mx-2 my-4 text-sm text-gray-700 hover:text-blue-400 bg-gray-100 font-semibold border border-gray-200 shadow-5xl shadow-gray-500 cursor-pointer px-6 py-1 rounded-full"
                key={index}
              >
                {item.icon}
                {item.label[lang]}
              </div>
            ))}
          </div>
          <StatusCard contract={contract} />
        </div>
      </div>
    </div>
  );
};

export default ViewContract;
