import React from "react";
import DashboardCard from "@/components/dashboard/dashboardCard";
import AgreementType from "@/components/dashboard/AgreementType";
import DashBoardContract, {
  ContractFormat,
} from "@/components/dashboard/DashBoardContract";
const Contracttype: ("service" | "loan" | "sale" | "nonDisclosure")[] = [
  "service",
  "loan",
  "sale",
  "nonDisclosure",
];

const data1: ContractFormat = {
  type: "service",
  title: "Website Development Contract",
  party1: "John Doe",
  party2: "ABC Company",
  payment: "50,000",
  date: "2024-01-15",
  status: "completed",
  language: "en",
};

const data2: ContractFormat = { ...data1, type: "loan" };
const data3: ContractFormat = {
  ...data1,
  type: "nonDisclosure",
  status: "drafted",
};
const data4: ContractFormat = { ...data1, type: "sale" };

const Dashboard = () => {
  return (
    <div className="lg:ml-80 bg-gray-50 sm:pl-6 lg:pl-8 h-full">
      <div className="p-4 sm:p-6 lg:p-8 w-auto">
        <p className="text-center my-4 text-3xl font-bold text-blue-950">
          Wekil AI
        </p>
        <p className="text-center my-4 text-lg text-gray-500">
          Simple, Clear Agreements in Amharic & English
        </p>
        <div className="flex justify-center my-4">
          <button className="mb-6 w-auto border border-gray-200 px-2 rounded-full">
            am
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mx-4">
          <DashboardCard title="Create Contract" type="create">
            Start create a new agreement with guided wizard
          </DashboardCard>
          <DashboardCard title="My Contract" type="view">
            View, edit, and manage your existing contracts
          </DashboardCard>
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
