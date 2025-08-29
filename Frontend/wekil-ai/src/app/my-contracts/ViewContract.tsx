"use client";
import React from "react";
import { ArrowLeft, Edit3, Download, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ContractDescription from "@/components/Contract/ContractDescription";
import PartyCard from "@/components/Contract/partyCard";
import { ContractFormat } from "@/types/Contracttype";
import StatusCard from "@/components/Contract/StatusCard";
import TypeSpecificFields from "@/components/Contract/TypeSpecificFields";
const options = [
  {
    label: "Edit",
    icon: <Edit3 className="inline mx-2 w-4 h-4  text-blue-950 " />,
  },
  {
    label: "Export",
    icon: <Download className="inline mx-2 w-4 h-4  text-blue-950 " />,
  },
  {
    label: "Share",
    icon: <Share2 className="inline mx-2 w-4 h-4  text-blue-950 " />,
  },
];
interface ViewContractProps {
  contract: ContractFormat;
}
const ViewContract: React.FC<ViewContractProps> = ({ contract }) => {
  const route = useRouter();
  return (
    <div className="lg:ml-80 border-l border-gray-200 min-h-screen">
      <div className="md:flex md:justify-between mt-12 mx-4">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
          <button
            className="text-blue-950 text-sm font-semibold h-10 text-md mx-3 rounded-full border-gray-100 hover:bg-blue-400 hover:text-white px-2"
            onClick={() => route.push("/dashboard")}
          >
            <ArrowLeft className="inline w-6 h-6 mx-2" />
            Back to Dashboard
          </button>
          <span className="">
            <p className="text-2xl my-2 text-blue-950 font-bold">
              Contract Details
            </p>
            <p className="text-md pl-8 mb-2 text-gray-500 font-normal">
              Website Development Contract
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
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 items-start">
        <div className="col-span-4 md:col-span-3">
          <ContractDescription contract={contract} />
          <PartyCard party1={contract.party1} party2={contract.party2} />
          <TypeSpecificFields contract={contract} />
        </div>
        <div className="col-span-4 md:col-span-1 h-auto">
          <div className="border border-gray-200 rounded-2xl py-4">
            <p className="text-center text-lg font-semibold">Quick Actions</p>
            {options.map((item, index) => (
              <div
                className="mx-2 my-4 text-sm text-gray-700 hover:text-blue-400 bg-gray-100 font-semibold border border-gray-200 shadow-5xl shadow-gray-500 cursor-pointer px-6 py-1 rounded-full"
                key={index}
              >
                {item.icon}
                {item.label}
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
