import React from "react";
import {
  Handshake,
  Banknote,
  ScrollText,
  Shield,
  Download,
  Eye,
  Edit3,
} from "lucide-react";
const contractTypes = {
  service: {
    icon: (
      <Handshake className="w-16 h-12 mt-8 rounded-full text-blue-950 inline px-2" />
    ),
  },
  sale: {
    icon: (
      <Banknote className="w-16 h-12 mt-8 rounded-full text-blue-950 inline px-2" />
    ),
  },
  loan: {
    icon: (
      <ScrollText className="w-16 h-12 mt-8 rounded-full text-blue-950 inline px-2" />
    ),
  },
  nonDisclosure: {
    icon: (
      <Shield className="w-16 h-12 mt-8 rounded-full text-blue-950 inline px-2" />
    ),
  },
};
import { ContractFormat } from "@/types/Contracttype";
const options = [
  {
    label: "show",
    icon: <Eye className="inline mx-2 w-4 h-4 rounded-full  text-blue-400 " />,
  },
  {
    label: "edit",
    icon: (
      <Edit3 className="inline mx-2 w-4 h-4 rounded-full  text-blue-400 " />
    ),
  },
  {
    label: "Export",
    icon: (
      <Download className="inline mx-2 w-4 h-4 rounded-full  text-blue-400 " />
    ),
  },
];

interface DashBoardContractProps {
  contract: ContractFormat;
}

export const DashBoardContract: React.FC<DashBoardContractProps> = ({
  contract,
}) => {
  return (
    <div className="mx-4 my-4 md:p-4 bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-gray-200 grid grid-cols-8 gap-3">
      <div className="col-span-1 flex align-middle">
        {contractTypes[contract.type].icon}
      </div>
      <div className="col-span-7 md:col-span-4 pl-2">
        <p className="text-blue-950 font-semibold my-2 text-lg">
          {contract.title}
        </p>
        <p className="text-gray-500 mb-2 text-sm font-bold ml-4">{`${contract.party1?.name} <-> ${contract.party2?.name} . ${contract.payment} ETB`}</p>
        <p className="text-blue-950 text-center font-semibold mb-2 text-sm">
          {contract.date}
        </p>
        <div className="flex justify-around">
          <p
            className={`inline px-2 py-1 rounded-full text-sm text-blue-950 font-semibold mb-2 ${
              contract.status === "completed"
                ? "bg-blue-950 text-white"
                : "bg-white text-blue-950 border border-gray-200"
            }`}
          >
            {contract.status}
          </p>
          <p className="inline mx-2 text-blue-950 font-semibold border rounded-full px-4 border-gray-100 my-2">
            {contract.language === "en" ? "EN" : "AM"}
          </p>
        </div>
      </div>
      <div className="col-span-8 md:col-span-3 flex items-center mb-4">
        {options.map((item, index) => (
          <div
            className="inline mx-2 text-gray-700 hover:text-blue-400 bg-gray-100 font-semibold border border-gray-200 shadow-5xl shadow-gray-500 cursor-pointer px-3 py-1 rounded-full"
            key={index}
          >
            {item.icon}
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashBoardContract;
