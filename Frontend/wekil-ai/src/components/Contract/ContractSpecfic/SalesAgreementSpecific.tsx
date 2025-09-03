"use client";
import { ContractFormat } from "@/types/Contracttype";
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
interface SalesAgreementSpecificProps {
  contract: ContractFormat;
}
import { useLanguage } from "@/context/LanguageContext";
const SalesAgreementSpecific: React.FC<SalesAgreementSpecificProps> = ({
  contract,
}) => {
  const [showMore, setshowMore] = React.useState(false);
  const {lang} = useLanguage();
  return (
    <div className="w-full font-bold">
      <div className="p-4">
        <div className="flex justify-between my-2 text-md text-blue-950">
          <p className="">{lang=='en'?'Goods':'ዕቃዎች/ንጥሎች'} </p>
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
          <div className=" m-8 py-4 rounded-2xl flex justify-around">
            <p className="text-md text-blue-950 font-bold inline">{lang=='en'?'Goods':'ዕቃዎች/ንጥሎች'}</p>
            <p className="text-sm text-blue-950 font-bold text-end inline">
              {lang=='en'?'Quantity':'መጠን'} 
            </p>
            <p className="text-sm text-blue-950 font-bold text-end inline">
              {lang=='en'?'Unit Price':'የአንድ ዓይነት ዋጋ'} 
            </p>
          </div>
        ) : null}
        {showMore ? (
          contract.goods && contract.goods.length > 0 ? (
            contract.goods.map((item, key) => {
              return (
                <div
                  className=" m-8 border border-gray-100 p-4 rounded-2xl flex justify-around"
                  key={key}
                >
                  <p className="text-md text-blue-950 font-semibold inline">
                    {item.item}
                  </p>
                  <p className="text-sm text-blue-950 font-semibold text-end inline">
                    {item.qty}
                  </p>
                  <p className="text-sm text-blue-950 font-semibold text-end inline">
                    {item.unit_price}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-md inline mx-4">{lang=='en'?'No goods yet':'እስካሁን ምንም እቃ የለም'} </p>
          )
        ) : null}
      </div>
      <div className="p-4 mt-6">
        <p className="my-2 text-md text-blue-950">{lang=='en'?'Delivery Terms':'የማድረስ ውሎች'}</p>
        <p className="my-2 text-md text-blue-950">{contract.delivery_terms}</p>
      </div>
    </div>
  );
};

export default SalesAgreementSpecific;
