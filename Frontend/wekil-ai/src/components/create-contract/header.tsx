import React from "react";
import { Globe } from "lucide-react";
import Link from "next/link";

const CreateContractHeader = () => {
  return (
    <div className="w-full flex justify-between">
      <div>
        <Link href="/dashboard"></Link>
        <div className="inline">
          <p className="text-xl my-2 text-blue-950 font-bold">
            Contract Wizard
          </p>
          <p className="text-md mb-2 text-gray-500 font-semibold">Step 1 of 5</p>
        </div>
      </div>
      <div>
        <button className="rounded-full px-2 py-1 border border-gray-200 hover:bg-blue-400">
          <Globe className="w-6 h-8 mx-2" />
          amh
        </button>
      </div>
    </div>
  );
};

export default CreateContractHeader;
