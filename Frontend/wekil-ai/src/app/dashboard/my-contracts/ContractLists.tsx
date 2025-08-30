"use client";
import React from "react";
import { ArrowLeft, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import ContractCard from "@/components/Contract/ContractCard";
import { data1, data2, data3, data4 } from "@/types/Contracttype";

const ContractLists = () => {
  const route = useRouter();
  return (
    <div className="m-4 px-6 py-4">
      <div className="md:flex md:justify-between mt-4 mb-4  mx-4">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
          <button
            className="text-sm h-10 text-md mx-3 rounded-full border-gray-100 hover:bg-blue-100 cursor-pointer px-2"
            onClick={() => route.push("/dashboard")}
          >
            <ArrowLeft className="inline w-4 h-4 mx-2" />
            Back to Dashboard
          </button>
          <span className="">
            <h1 className="text-3xl font-bold text-gray-900">My Contracts</h1>
          </span>
        </div>
        <div className="">
          <button className="py-1 px-3 rounded-full border text-sm border-gray-200 mr-6 hover:text-blue-200">
            <Globe className="w-4 h-4 inline mx-2" />
            አማርኛ
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
        <ContractCard contract={data1} />
        <ContractCard contract={data2} />
        <ContractCard contract={data3} />
        <ContractCard contract={data4} />
      </div>
    </div>
  );
};

export default ContractLists;
