"use client";
import React, { useEffect, useState } from "react";
import ContractLists from "./ContractLists";
import { useSession } from "next-auth/react";
import { ContractFormat } from "@/types/Contracttype";
import { getAgreementByUserId } from "@/lib/ContractGetAgreements";
import {
  convertIntakeToContractFormat,
  Intake,
} from "./[agreementId]/ShowAgreement";
import WeKilAILoader from "@/components/ui/WekilAILoader";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, ChevronDownIcon, ChevronUp, Globe } from "lucide-react";
import { viewContractTranslation } from "@/lib/translations/dashboardPageTranslation";
import { useRouter } from "next/navigation";

const MyContracts = () => {
  const [contractList, setContractList] = useState<ContractFormat[] | null>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isloading, setIsLoading] = useState<boolean>(true);
  const { data: session, status } = useSession();
  const route = useRouter();
  const { setLang } = useLanguage();
  useEffect(() => {
    const fetch = async () => {
      if (status === "authenticated" && session?.user) {
        const res = await getAgreementByUserId(
          session.user.accessToken || "",
          pageNumber
        );
        setContractList(
          res.data.map((item: Intake) => convertIntakeToContractFormat(item))
        );
      }
    };
    fetch();
    setIsLoading(false);
  }, [session?.user, status, pageNumber]);
  const { lang } = useLanguage();
  return (
    <div>
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
      {contractList != null ? (
        <div>
          <ContractLists contractList={contractList} />
          <div className="flex my-8 justify-around">
            <button
              className="rounded-full mb-5 px-8 py-1 bg-gray-50 text-blue-950 hover:text-blue-400 font-bold border border-gray-200"
              onClick={() => {
                setPageNumber(pageNumber - 1);
              }}
            >
              <ChevronDownIcon className="w-8 h-8 mx-2 inline" />
              {lang == "en" ? "Show More" : "ተጨማሪ አሳይ"}
            </button>
            <button
              className="rounded-full mb-5 px-8 py-1 bg-gray-50 text-blue-950 hover:text-blue-400 font-bold border border-gray-200"
              onClick={() => {
                setPageNumber(pageNumber + 1);
              }}
            >
              <ChevronUp className="w-8 h-8 mx-2 inline" />
              {lang == "en" ? "Show less" : "በመጠኑ አሳይ"}
            </button>
          </div>
        </div>
      ) : isloading ? (
        <div className="flex flex-col align-middle">
          <WeKilAILoader />
          <p className="text-lg mt-16 text-center">loading the contracts</p>
        </div>
      ) : (
        <div>
          <p className="text-lg mt-16 text-center">No Contract created yet</p>
        </div>
      )}
    </div>
  );
};

export default MyContracts;
