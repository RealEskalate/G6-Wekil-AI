import React, { ReactNode } from "react";
import { FileText, Plus } from "lucide-react";

const DashboardCard = ({
  title,
  children,
  type,
}: {
  title: string;
  children: ReactNode;
  type: "create" | "view";
}) => {
  return (
    <div className="border w-9/10 bg-white  border-gray-200 shadow-md shadow-gray-200 hover:shadow-blue-200 rounded-3xl p-4 hover:shadow-xl cursor-pointer col-span-2 md:col-span-1">
      <div className="flex justify-center">
        {type === "create" ? (
          <Plus className="w-1/5 h-1/5 hover:w-1/4 hover:h-1/4 transition-all rounded-full bg-blue-400" />
        ) : (
          <FileText className="w-1/5 h-1/5 hover:w-1/4 hover:h-1/4 transition-all text-blue-500 " />
        )}
      </div>
      <p className="text-center my-6 text-xl text-blue-950 font-bold hover:text-blue-400">
        {title}
      </p>
      <p className="text-center my-6 text-md text-gray-600 ">{children}</p>
      {type === "view" ? (
        <div className="flex justify-center">
          <div className="border p-2 font-bold text-blue-600 border-blue-800 rounded-full">
            3 Contracts
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DashboardCard;
