import React from "react";
import {
  Handshake,
  Banknote,
  ScrollText,
  Shield,
  FileText,
} from "lucide-react";
import { ContractFormat } from "@/types/Contracttype";
const contractTypes = {
  service: {
    label: "Service Agreement",
    icon: <Handshake className="w-16 h-12 mt-8 text-blue-950 inline px-2" />,
  },
  sale: {
    label: "Sales Agreement",
    icon: <Banknote className="w-16 h-12 mt-8 text-blue-950 inline px-2" />,
  },
  loan: {
    label: "Loan Agreement",
    icon: <ScrollText className="w-16 h-12 mt-8 text-blue-950 inline px-2" />,
  },
  nonDisclosure: {
    label: "Non Disclosure Agreement",
    icon: <Shield className="w-16 h-12 mt-8 text-blue-950 inline px-2" />,
  },
};

interface ContractDescriptionProps {
  contract: ContractFormat;
}

export const ContractDescription: React.FC<ContractDescriptionProps> = ({
  contract,
}) => {
  return (
    <div className="border border-gray-200 rounded-2xl p-4 m-4">
      <div className="flex justify-between items-center">
        <p className="text-lg my-2 text-gray-700">
          {<FileText className="w-12 h-12 text-gray-950 inline px-2" />}
          {contractTypes[contract.type].label}
        </p>
        <p className="text-sm px-2 h-6 rounded-full bg-blue-950 text-white font-normal">
          Active
        </p>
      </div>
      <div className="w-full grid grid-cols-2">
        <div>
          <div className="my-4">
            <p className="text-sm font-semibold text-gray-500 my-1">Amount</p>
            <p className="text-md ml-4 text-gray-700 font-semibold my-1">
              {contract.payment}
            </p>
          </div>
          <div className="my-4">
            <p className="text-sm font-semibold text-gray-500 my-1">
              Start Date
            </p>
            <p className="text-md ml-4 text-gray-700 font-semibold my-1">
              {contract.startDate}
            </p>
          </div>
        </div>
        <div>
          <div>
            <div className="my-4">
              <p className="text-sm font-semibold text-gray-500 my-1">
                Created On
              </p>
              <p className="text-md ml-4 text-gray-700 font-semibold my-1">
                {contract.createdAt}
              </p>
            </div>
            <div className="my-4">
              <p className="text-sm font-semibold text-gray-500 my-1">
                End Date
              </p>
              <p className="text-md ml-4 text-gray-700 font-semibold my-1">
                {contract.endDate}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <p className="text-md text-gray-500 font-semibold my-1">Description</p>
        <p className="text-sm font-bold ml-4 border border-gray-200 p-4 rounded-2xl text-gray-700 my-1">
          {contract.Description}
        </p>
      </div>
    </div>
  );
};

export default ContractDescription;
