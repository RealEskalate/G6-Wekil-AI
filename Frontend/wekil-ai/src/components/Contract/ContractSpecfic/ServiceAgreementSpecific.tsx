"use client";
import { ContractFormat } from "@/types/Contracttype";
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
interface ServiceAgreementSpecificProps {
  contract: ContractFormat;
}

const ServiceAgreementSpecific: React.FC<ServiceAgreementSpecificProps> = ({
  contract,
}) => {
  const [showMilestones, setShowMilestones] = React.useState(false);
  const {lang} = useLanguage();
  return (
    <div className="w-full font-bold">
      <div className="p-4">
        <p className="my-2 text-md text-blue-950">Service</p>
        <p className="my-2 text-sm text-gray-500">{contract.services}</p>
      </div>
      <div className="p-4">
        <div className="flex justify-between my-2 text-md text-blue-950">
          <p className="">{lang=='en'?'Milestones':'ዋና ዋና ደረጃዎች'} </p>
          <p className="">
            {!showMilestones ? (
              <button onClick={() => setShowMilestones(!showMilestones)}>
                <ChevronDown className="inline mx-16" />
              </button>
            ) : (
              <button onClick={() => setShowMilestones(!showMilestones)}>
                <ChevronUp className="inline mx-16" />
              </button>
            )}
          </p>
        </div>
        {showMilestones ? (
          <div className=" m-8 border-gray-100 py-4 rounded-2xl flex justify-between">
            <p className="text-lg text-blue-950 font-bold inline">
              {lang=='en'?'Milestone Description':'የደረጃዎች መግለጫ'} 
            </p>

            <p className="text-lg text-blue-950 font-bold inline">
              {lang=='en'?'Deadline Date':'የማድረሻ ቀን'} 
            </p>
          </div>
        ) : null}
        {showMilestones ? (
          contract.milestones && contract.milestones.length > 0 ? (
            contract.milestones.map((item, key) => {
              return (
                <div
                  className=" m-8 border border-gray-100 p-4 rounded-2xl flex justify-between"
                  key={key}
                >
                  <p className="text-md text-blue-950 font-semibold inline">
                    {item.description}
                  </p>
                  <p className="text-sm text-blue-950 font-semibold text-end inline">
                    {item.date}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-md inline mx-4">{lang=='en'?'No milestones yet':'ገና ምንም ዋና ደረጃዎች አልተጨመሩም'} </p>
          )
        ) : null}
      </div>
      <div className="p-4 mt-6">
        <p className="my-2 text-md text-blue-950">{lang=='en'?'Revisions':'የማሻሻያ ብዛት'} </p>
        <p className="my-2 text-md text-blue-950">{contract.revisions}</p>
      </div>
    </div>
  );
};

export default ServiceAgreementSpecific;
