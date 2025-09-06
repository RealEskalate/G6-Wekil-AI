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
import { ChevronDownIcon, ChevronUp } from "lucide-react";

const MyContracts = () => {
  const [contractList, setContractList] = useState<ContractFormat[] | null>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const { data: session, status } = useSession();
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
  }, [session?.user, status, pageNumber]);
  const { lang } = useLanguage();
  if (contractList != null) {
    return (
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
    );
  } else {
    <WeKilAILoader />;
  }
};

export default MyContracts;
