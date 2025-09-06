import React, { useState } from "react";
import {
  Handshake,
  Banknote,
  ScrollText,
  Shield,
  Download,
  Eye,
  Delete,
  Loader2,
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
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";
export const options = [
  {
    label: "show",
    icon: <Eye className="inline mx-2 w-4 h-4 rounded-full  text-blue-400 " />,
  },
  {
    label: "delete",
    icon: <Delete className="inline mx-2 w-4 h-4 rounded-full  text-red-500" />,
  },
  {
    label: "Export",
    icon: (
      <Download className="inline mx-2 w-4 h-4 rounded-full  text-blue-400 " />
    ),
  },
];

async function handleExport(pdfUrl: string, lang: "am" | "en",setIsExporting: (arg:boolean) => void) {
  try {
    const response = await fetch(
      "https://drive.google.com/file/d/1Vf3VFt5Uzqvm7yCCM58ujSO_b8iRHMsA/view?usp=drive_link"
    );
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "contract.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    toast.success(
      lang === "en"
        ? "Contract exported successfully!"
        : "ውሉ በተሳካ ሁኔታ ወደ ውጭ ተልኳል!"
    );
  } catch (error) {
    console.log(error);
    toast.success(
      lang === "en" ? "Contract exported failed!" : "ውሉ ወደ ውጭ መላክ አልተቻለም!"
    );
  }
  setIsExporting(false);
}

interface DashBoardContractProps {
  contract: ContractFormat;
}

export const DashBoardContract: React.FC<DashBoardContractProps> = ({
  contract,
}) => {
  const router = useRouter();
  const { lang } = useLanguage();
  const [isExporting, setIsExporting] = useState<boolean>(false);
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
            onClick={() => {
              if (item.label == "show") {
                router.push(`dashboard/my-contracts/${contract.id}`);
              } else if (item.label == "Export") {
                setIsExporting(true);
                handleExport(contract.pdfURl, lang,setIsExporting);
                
              }
            }}
          >
            {item.label == "Export" ? (
              !isExporting ? (
                <>
                  <Download className="w-4 h-4" />
                  {lang == "en" ? "Export" : "አውርድ"}
                </>
              ) : (
                <span className="w-32 flex items-center">
                  <Loader2 />
                  {lang == "en" ? "Exporting" : "በማውረድ ላይ"}
                </span>
              )
            ) : (
              <>
                {item.icon}
                {item.label}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashBoardContract;
