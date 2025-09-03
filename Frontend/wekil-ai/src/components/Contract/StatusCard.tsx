import React from "react";
import { ContractFormat } from "@/types/Contracttype";
interface StatusCardProps {
  contract: ContractFormat;
}
import { useLanguage } from "@/context/LanguageContext";
interface translationEntry {
  status: string;
  createdAt: string;
  id: string;
  language: string;
}
interface translationType {
  am: translationEntry;
  en: translationEntry;
}
const translation: translationType = {
  en: {
    status: "Status",
    createdAt: "CreatedAt",
    id: "Id",
    language: "language",
  },
  am: {
    status:"ሁኔታ",
    createdAt:"የተፈጠረበት ቀን",
    id:"መለያ",
    language:"ቋንቋ",
  },
};
const StatusCard: React.FC<StatusCardProps> = ({ contract }) => {
  const keys: Array<
    keyof Pick<ContractFormat, "createdAt" | "id" | "language">
  > = ["createdAt", "id", "language"];
  const {lang} = useLanguage();
  return (
    <div className="p-4 border border-gray-200 rounded-2xl my-3 py-6">
      <p className="text-center text-lg font-semibold text-blue-950">Status</p>
      <p className="inline text-sm border rounded-full p-1 font-semibold">
        {contract.status == "active" ? "Active" : "Completed"}
      </p>
      {keys.map((key, index) => (
        <div key={index} className="my-2">
          <p className="inline  text-gray-500 text-md font-semibold">{translation[lang][key]}: </p>
          <p className="inline  text-blue-950 text-end font-semibold text-md">
            {contract[key]}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatusCard;
