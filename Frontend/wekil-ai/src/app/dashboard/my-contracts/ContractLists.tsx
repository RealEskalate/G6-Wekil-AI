"use client";
import React from "react";
import ContractCard from "@/components/Contract/ContractCard";
import { ContractFormat} from "@/types/Contracttype";
interface ContractListsProps{
  contractList: ContractFormat[]
}
const ContractLists:React.FC<ContractListsProps> = ({contractList}) => {
  return (
    <div className="m-4 px-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
        {contractList.map((item:ContractFormat,idx)=>(<ContractCard contract={item} key={idx}/>))}
      </div>
    </div>
  );
};

export default ContractLists;
