"use client";
import DashboardCard from "@/components/dashboard/dashboardCard";
import AgreementType from "@/components/dashboard/AgreementType";
const Contracttype: ("service" | "loan" | "sale" | "nonDisclosure")[] = [
  "service",
  "loan",
  "sale",
  "nonDisclosure",
];
import { dashboardPageTranslation } from "@/lib/DashboardTranslation/dashboardPageTranslation";
import { data1, data2, data3, data4 } from "@/types/Contracttype";
import { DashBoardContract } from "@/components/dashboard/DashBoardContract";
import Link from "next/link";
import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
const Dashboard = () => {
  const { lang, setLang } = useLanguage();
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
            className="py-1 px-3 rounded-full border text-sm border-gray-200 mr-6 hover:text-blue-400"
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
          <button className="rounded-full px-4 py-1 bg-gray-50 text-blue-950 hover:text-blue-400 font-bold border border-gray-200">
            {dashboardPageTranslation[lang].viewAll}
          </button>
        </div>
        <DashBoardContract contract={data1} />
        <DashBoardContract contract={data2} />
        <DashBoardContract contract={data3} />
        <DashBoardContract contract={data4} />
      </div>
    </div>
  );
};

export default Dashboard;