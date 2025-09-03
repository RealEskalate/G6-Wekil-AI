"use client";
import { ContractFormat } from "@/types/Contracttype";
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
interface LoanAgreementSpecificProps {
  contract: ContractFormat;
}
import { useLanguage } from "@/context/LanguageContext";
const LoanAgreementSpecific: React.FC<LoanAgreementSpecificProps> = ({
  contract,
}) => {
  const {lang} = useLanguage();
  const [showMore, setshowMore] = React.useState(false);
  return (
    <div className="w-full font-bold">
      <div className="p-4 mt-6">
        <p className="my-2 text-md text-blue-950 font-semibold">{lang=="en"?"Principal":"ዋና መጠን"}</p>
        <p className="my-2 text-md text-end text-blue-950">
          {contract.principal}
        </p>
      </div>
      <div className="p-4">
        <div className="flex justify-between my-2 text-md text-blue-950">
          <p className="">{lang=="en"?"Installment":"የመክፈያ ክፍሎች"}</p>
          <p className="">
            {!showMore ? (
              <button onClick={() => setshowMore(!showMore)}>
                <ChevronDown className="inline mx-16" />
              </button>
            ) : (
              <button onClick={() => setshowMore(!showMore)}>
                <ChevronUp className="inline mx-16" />
              </button>
            )}
          </p>
        </div>
        {showMore ? (
          <div className=" m-8 border border-gray-100 py-4 rounded-2xl flex justify-around">
            <p className="text-md text-blue-950 font-bold inline">
              {lang=="en"?"Item amount":"የእቃ መጠን"}
            </p>

            <p className="text-sm text-blue-950 font-bold text-end inline">
              {lang=="en"?"Item Due date":"የመክፈያ ቀን"}
            </p>
          </div>
        ) : null}
        {showMore ? (
          contract.installments && contract.installments.length > 0 ? (
            contract.installments.map((item, key) => {
              return (
                <div
                  className=" m-8 border border-gray-100 p-4 rounded-2xl flex justify-around"
                  key={key}
                >
                  <p className="text-md text-blue-950 font-semibold inline">
                    {item.amount}
                  </p>

                  <p className="text-sm text-blue-950 font-semibold text-end inline">
                    {item.due_date}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-sm font-bold text-blue-950 inline mx-4 ">
              {lang=="en"?"No installments yet":"እስካሁን ድረስ የሚከፈሉ ክፍያዎች የሉም"}
            </p>
          )
        ) : null}
      </div>
      <div className="p-4 mt-6">
        <p className="my-2 text-md text-blue-950">{lang=="en"?"Delivery Terms":"'የማድረስ ውሎች'"}</p>
        <p className="my-2 text-sm text-blue-950">{contract.delivery_terms}</p>
      </div>
    </div>
  );
};

export default LoanAgreementSpecific;
