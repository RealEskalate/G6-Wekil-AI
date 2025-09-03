"use client";
import React, { useEffect } from "react";
import DashboardCard from "@/components/dashboard/dashboardCard";
import AgreementType from "@/components/dashboard/AgreementType";
const Contracttype: ("service" | "loan" | "sale" | "nonDisclosure")[] = [
  "service",
  "loan",
  "sale",
  "nonDisclosure",
];
// import { ContractFormat } from "@/types/Contracttype";

// const data1: ContractFormat = {
//   type: "service",
//   title: "Website Development Contract",
//   party1: "John Doe",
//   party2: "ABC Company",
//   payment: "50,000",
//   date: "2024-01-15",
//   status: "completed",
//   language: "en",
// };

// const data2: ContractFormat = { ...data1, type: "loan" };
// const data3: ContractFormat = {
//   ...data1,
//   type: "nonDisclosure",
//   status: "drafted",
// };
// const data4: ContractFormat = { ...data1, type: "sale" };

import { data1, data2, data3, data4 } from "@/types/Contracttype";
import { DashBoardContract } from "@/components/dashboard/DashBoardContract";
import Link from "next/link";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const accessToken = session?.user?.accessToken;
  const router = useRouter();

  useEffect(() => {
    if (!accessToken && status === "unauthenticated") {
      router.push("/");
    }
  }, [accessToken, router, status]);

  return (
    <div className="bg-gray-50 sm:pl-6 lg:pl-8 h-full">
      <div className="p-4 sm:p-6 lg:p-8 w-auto">
        <p className="text-center my-4 text-3xl font-bold text-blue-950">
          Wekil AI
        </p>
        <p className="text-center my-4 text-lg text-gray-500">
          Simple, Clear Agreements in Amharic & English
        </p>
        <div className="flex justify-center my-4">
          <button className="py-1 px-3 rounded-full border text-sm border-gray-200 mr-6 hover:text-blue-400">
            <Globe className="w-4 h-4 inline mx-2" />
            አማርኛ
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mx-4">
          <Link href="/dashboard/create-contract">
            <DashboardCard title="Create Contract" type="create">
              Create a new contract quickly and easily
            </DashboardCard>
          </Link>
          <Link href="/dashboard/my-contracts">
            <DashboardCard title="My Contract" type="view">
              View, edit, and manage your existing contracts
            </DashboardCard>
          </Link>
        </div>
      </div>
      <div className="bg-white my-6 rounded-2xl border border-gray-200 p-4 sm:p-6 lg:p-8">
        <p className="text-center text-gray-500 text-lg font-semibold mb-6">
          Choose Contract Type
        </p>
        <div className="grid grid-cols-4 gap-4">
          {Contracttype.map((item, index) => (
            <AgreementType type={item} key={index} />
          ))}
        </div>
      </div>
      <div className="">
        <div className="flex justify-around">
          <p className="text-blue-950 text-center font-bold text-2xl">
            {" "}
            Recent Contracts
          </p>
          <button className="rounded-full px-4 py-1 bg-gray-50 text-blue-950 hover:text-blue-400 font-bold border border-gray-200">
            View All
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
