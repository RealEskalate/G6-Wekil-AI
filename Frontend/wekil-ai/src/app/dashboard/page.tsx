"use client";
import DashboardCard from "@/components/dashboard/dashboardCard";
import AgreementType from "@/components/dashboard/AgreementType";
const Contracttype: ("service" | "loan" | "sale" | "nonDisclosure")[] = [
  "service",
  "loan",
  "sale",
  "nonDisclosure",
];
import { dashboardPageTranslation } from "@/lib/translations/dashboardPageTranslation";
import { ContractFormat } from "@/types/Contracttype";
import { DashBoardContract } from "@/components/dashboard/DashBoardContract";
import Link from "next/link";
import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import WeKilAILoader from "@/components/ui/WekilAILoader";
import { getAgreementByUserId } from "@/lib/ContractGetAgreements";
import {
  convertIntakeToContractFormat,
  Intake,
} from "./my-contracts/[agreementId]/ShowAgreement";

const Dashboard = () => {
  const { lang, setLang } = useLanguage();
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [contractList, setContractList] = useState<ContractFormat[] | null>();
  const { data: session, status } = useSession();
  const [pageNumber, setPageNumber] = useState<number>(1);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      setIsAuthChecked(true);
      const fetch = async () => {
        if (session?.user) {
          try {
            const res = await getAgreementByUserId(
              session.user.accessToken || "",
              pageNumber
            );

            if (!res?.data || !Array.isArray(res.data)) {
              setContractList([]);
              return;
            }

            setContractList(
              res.data.map((item: Intake) =>
                convertIntakeToContractFormat(item)
              )
            );
          } catch (error) {
            console.error("Error fetching agreements:", error);
            setContractList([]);
          }
        }
      };
      fetch();
    }
  }, [router, session?.user, status,pageNumber]);

  if (status === "loading" || !isAuthChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <WeKilAILoader />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 sm:pl-6 lg:pl-8 h-full">
      <div className="p-4 sm:p-6 lg:p-8 w-auto">
        <p className="text-center my-4 text-3xl font-bold text-blue-950">
          {dashboardPageTranslation[lang].title}
        </p>
        <p className="text-center my-4 text-lg text-gray-500">
          {dashboardPageTranslation[lang].tagline}
        </p>
        <div className="flex justify-center my-4">
          <button
            className="py-1 px-3 cursor-pointer rounded-full border text-sm border-gray-200 mr-6 hover:text-blue-400"
            onClick={() => (lang == "am" ? setLang("en") : setLang("am"))}
          >
            <Globe className="w-4 h-4 inline mx-2" />
            {lang == "am" ? "English" : "አማርኛ"}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mx-4">
          <div className="bg-gray-50 sm:pl-6 lg:pl-8 h-full p-0 col-span-2 md:col-span-1">
            <Link href="/dashboard/create-contract">
              <DashboardCard
                title={dashboardPageTranslation[lang].createContract}
                type="create"
                lang={lang}
              >
                {dashboardPageTranslation[lang].createContractTag}
              </DashboardCard>
            </Link>
          </div>
          <div className="bg-gray-50 sm:pl-6 lg:pl-8 h-full p-0 col-span-2 md:col-span-1">
            <Link href="/dashboard/my-contracts">
              <DashboardCard
                title={dashboardPageTranslation[lang].myContracts}
                type="view"
                lang={lang}
              >
                {dashboardPageTranslation[lang].myContractsTag}
              </DashboardCard>
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-white my-6 rounded-2xl border border-gray-200 p-4 sm:p-6 lg:p-8">
        <p className="text-center text-gray-500 text-lg font-semibold mb-6">
          {dashboardPageTranslation[lang].chooseType}
        </p>
        <div className="grid grid-cols-4 gap-4">
          {Contracttype.map((item, index) => (
            <AgreementType type={item} key={index} lang={lang} />
          ))}
        </div>
      </div>
      <div className="">
        <div className="flex justify-around">
          <p className="text-blue-950 text-center font-bold text-2xl">
            {" "}
            {dashboardPageTranslation[lang].recentContracts}
          </p>
        </div>
        {contractList?.map((item: ContractFormat, idx) => (
          <DashBoardContract contract={item} key={idx} />
        ))}
      </div>
      {
      contractList != null ? (<div className="flex my-8 justify-around">
        <button disabled={pageNumber==1} className="rounded-full mb-5 px-8 py-1 bg-gray-50 text-blue-950 hover:text-blue-400 font-bold border border-gray-200" onClick={()=>{setPageNumber(pageNumber-1)}}>
          {lang == "en" ? "PREV" : "ተመለስ"}
        </button>
        <button className="rounded-full mb-5 px-8 py-1 bg-gray-50 text-blue-950 hover:text-blue-400 font-bold border border-gray-200" onClick={()=>{setPageNumber(pageNumber+1)}}>
          {lang == "en" ? "NEXT" : "ቀጥል"}
        </button>
      </div>) : <p className="text-xl font-extrabold text-center my-8">No contracts yet</p>
      }
    </div>
  );
};

export default Dashboard;
