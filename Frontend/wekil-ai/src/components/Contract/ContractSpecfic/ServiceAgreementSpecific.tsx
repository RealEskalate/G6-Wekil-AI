"use client";
import { ContractFormat } from "@/types/Contracttype";
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
interface ServiceAgreementSpecificProps {
  contract: ContractFormat;
}
const ServiceAgreementSpecific: React.FC<ServiceAgreementSpecificProps> = ({
  contract,
}) => {
  const [showMilestones, setShowMilestones] = React.useState(false);
  return (
    <div className="w-full font-bold">
      <div className="p-4">
        <p className="my-2 text-md text-blue-950">Service</p>
        <p className="my-2 text-sm text-gray-500">{contract.services}</p>
      </div>
      <div className="p-4">
        <div className="flex justify-between my-2 text-md text-blue-950">
          <p className="">Milestones</p>
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
              Milestone Description
            </p>

            <p className="text-lg text-blue-950 font-bold inline">
              Deadline Date
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
            <p className="text-md inline mx-4">No milestones yet</p>
          )
        ) : null}
      </div>
      <div className="p-4 mt-6">
        <p className="my-2 text-md text-blue-950">Revisions</p>
        <p className="my-2 text-md text-blue-950">{contract.revisions}</p>
      </div>
    </div>
  );
};

export default ServiceAgreementSpecific;
