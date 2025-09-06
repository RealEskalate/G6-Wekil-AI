"use client";
import React from "react";
import { ArrowLeft, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import ContractCard from "@/components/Contract/ContractCard";
import { ContractFormat} from "@/types/Contracttype";
import { useLanguage } from "@/context/LanguageContext";
import { viewContractTranslation } from "@/lib/translations/dashboardPageTranslation";
interface ContractListsProps{
  contractList: ContractFormat[]
}
const ContractLists:React.FC<ContractListsProps> = ({contractList}) => {
  const route = useRouter();
  const { lang, setLang } = useLanguage();
  return (
    <div className="m-4 px-6 py-4">
      <div className="md:flex md:justify-between mt-4 mx-4">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
          <button
            className="text-blue-950 text-sm font-semibold h-10 text-md mx-3 rounded-full border-gray-100 hover:bg-blue-400 hover:text-white px-2"
            onClick={() => route.push("/dashboard")}
          >
            <ArrowLeft className="inline w-6 h-6 mx-2" />
            {viewContractTranslation[lang].back}
          </button>
          <span className="">
            <p className="text-lg my-2 text-blue-950 font-bold">
              {viewContractTranslation[lang].title}
            </p>
          </span>
        </div>
        <div className="">
          <button
            className="py-1 px-3 rounded-full border text-sm border-gray-200 mr-6 hover:text-blue-200"
            onClick={() => (lang == "am" ? setLang("en") : setLang("am"))}
          >
            <Globe className="w-4 h-4 inline mx-2" />
            {lang == "am" ? "English" : "አማርኛ"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
        {contractList.map((item:ContractFormat,idx)=>(<ContractCard contract={item} key={idx}/>))}
      </div>
    </div>
  );
};

export default ContractLists;
